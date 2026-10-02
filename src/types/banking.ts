export type UserRole = 'admin' | 'customer';

export interface BankUser {
  uid: string;
  email: string;
  fullName: string;
  role: UserRole;
  accountNumber: string;
  routingNumber: string;
  balance: number;
  currency: string;
  isLocked: boolean;
  isTransferRestricted: boolean;
  warningMessage?: string;
  transactionPin?: string; // 4 digits
  password?: string;
  authProvider?: string;
  phone?: string;
  address?: string;
  accountType?: 'Checking' | 'Savings' | 'Private Wealth' | 'Corporate Treasury';
  createdAt: string;
  updatedAt?: string;
}

export type TransactionType = 'internal' | 'international' | 'funding' | 'reversal';
export type TransactionStatus = 'completed' | 'pending' | 'reversed' | 'flagged';

export interface BankTransaction {
  id: string;
  senderId: string;
  senderName: string;
  senderAccount: string;
  recipientId: string;
  recipientName: string;
  recipientAccount: string;
  recipientBank?: string;
  recipientCountry?: string;
  swiftCode?: string;
  amount: number;
  fee: number;
  type: TransactionType;
  status: TransactionStatus;
  description: string;
  reference: string;
  createdAt: string;
  reversedAt?: string;
  reversedBy?: string;
  reversalReason?: string;
}

export interface AdminTreasury {
  id: string;
  institutionName: string;
  balance: number; // 10,000,000,000 USD
  currency: string;
  lastUpdated: string;
  totalFundedToUsers: number;
  totalReversed: number;
}

export interface SupportMessage {
  id: string;
  threadId: string;
  senderId: string;
  senderName: string;
  senderRole: 'customer' | 'admin';
  text: string;
  attachmentUrl?: string; // Base64 data URL or image URL
  attachmentName?: string;
  attachmentType?: 'image' | 'document';
  timestamp: string;
}

export interface SupportThread {
  id: string;
  userId: string;
  userEmail: string;
  userName: string;
  userAccountNumber: string;
  lastMessage: string;
  lastMessageTimestamp: string;
  unreadByAdmin: boolean;
  unreadByUser: boolean;
  status: 'open' | 'resolved';
  createdAt: string;
  updatedAt: string;
}

export interface AuditLog {
  id: string;
  actor: string;
  action: 'REVERSE_TRANSACTION' | 'FUND_ACCOUNT' | 'LOCK_ACCOUNT' | 'UNLOCK_ACCOUNT' | 'RESTRICT_TRANSFERS' | 'UNRESTRICT_TRANSFERS' | 'ISSUE_WARNING' | 'CLEAR_WARNING' | 'AI_COMMAND' | 'TRANSFER_INTERNAL' | 'TRANSFER_INTERNATIONAL' | 'SUPPORT_CHAT';
  targetUser?: string;
  details: string;
  timestamp: string;
}

export interface CountryBank {
  name: string;
  swiftPrefix: string;
  code: string;
}

export interface CountryData {
  country: string;
  code: string;
  currency: string;
  banks: CountryBank[];
}

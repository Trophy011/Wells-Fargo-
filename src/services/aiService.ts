import { BankUser, BankTransaction, AdminTreasury } from '../types/banking.ts';

export interface AiCommandResult {
  executiveSummary: string;
  actions: Array<{
    action: 'FUND_CUSTOMER' | 'REVERSE_TRANSACTION' | 'LOCK_ACCOUNT' | 'UNLOCK_ACCOUNT' | 'RESTRICT_TRANSFERS' | 'UNRESTRICT_TRANSFERS' | 'ISSUE_WARNING' | 'CLEAR_WARNING' | 'AUDIT_AND_ADVISE';
    targetUserIdentifier?: string;
    amount?: number;
    transactionIdOrReference?: string;
    isLocked?: boolean;
    isRestricted?: boolean;
    warningMessage?: string;
    reason?: string;
    summary?: string;
  }>;
  responseMessage: string;
}

export async function sendAdminAiCommand(
  command: string,
  context: {
    users: BankUser[];
    transactions: BankTransaction[];
    treasury: AdminTreasury | null;
  }
): Promise<AiCommandResult> {
  // Prune sensitive pin fields before passing context to AI
  const sanitizedUsers = context.users.map(u => ({
    uid: u.uid,
    email: u.email,
    fullName: u.fullName,
    accountNumber: u.accountNumber,
    balance: u.balance,
    isLocked: u.isLocked,
    isTransferRestricted: u.isTransferRestricted,
    warningMessage: u.warningMessage,
    accountType: u.accountType
  }));

  const recentTransactions = context.transactions.slice(0, 15).map(t => ({
    id: t.id,
    reference: t.reference,
    senderName: t.senderName,
    recipientName: t.recipientName,
    amount: t.amount,
    type: t.type,
    status: t.status,
    createdAt: t.createdAt
  }));

  const response = await fetch('/api/admin/ai-command', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      command,
      bankContext: {
        treasuryBalance: context.treasury?.balance || 10_000_000_000,
        totalFundedToUsers: context.treasury?.totalFundedToUsers || 0,
        activeAccountsCount: sanitizedUsers.length,
        users: sanitizedUsers,
        recentTransactions
      }
    })
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `AI Operator Error: ${response.statusText}`);
  }

  const data = await response.json();
  return data as AiCommandResult;
}

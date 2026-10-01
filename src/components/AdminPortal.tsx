import React, { useState, useEffect, useRef } from 'react';
import { 
  Building2, 
  Users, 
  RotateCcw, 
  DollarSign, 
  Lock, 
  Unlock, 
  AlertTriangle, 
  ShieldAlert, 
  Sparkles, 
  Search, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  ArrowUpRight, 
  ArrowDownLeft, 
  FileText, 
  Bot, 
  Send, 
  RefreshCw, 
  SlidersHorizontal,
  ChevronRight,
  ShieldCheck,
  Ban,
  MessageSquare,
  Paperclip,
  Image as ImageIcon,
  ExternalLink,
  Download,
  X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.tsx';
import { 
  BankUser, 
  BankTransaction, 
  AdminTreasury, 
  AuditLog, 
  SupportThread, 
  SupportMessage 
} from '../types/banking.ts';
import { 
  formatCurrency, 
  subscribeToAllUsers, 
  subscribeToAllTransactions, 
  subscribeToTreasury, 
  subscribeToAuditLogs,
  subscribeToAllSupportThreads,
  subscribeToSupportMessages,
  sendSupportMessage,
  markThreadRead,
  adminFundCustomer,
  adminReverseTransaction,
  adminSetAccountLock,
  adminSetTransferRestriction,
  adminSetWarningMessage
} from '../services/bankingService.ts';
import { sendAdminAiCommand, AiCommandResult } from '../services/aiService.ts';
import { ReceiptModal } from './ReceiptModal.tsx';

export const AdminPortal: React.FC = () => {
  const { currentUser } = useAuth();

  const [activeTab, setActiveTab] = useState<'treasury' | 'users' | 'transactions' | 'chat' | 'ai' | 'audit'>('treasury');
  
  // Real-time collections
  const [treasury, setTreasury] = useState<AdminTreasury | null>(null);
  const [users, setUsers] = useState<BankUser[]>([]);
  const [transactions, setTransactions] = useState<BankTransaction[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [supportThreads, setSupportThreads] = useState<SupportThread[]>([]);

  // Active Support Chat State
  const [selectedThread, setSelectedThread] = useState<SupportThread | null>(null);
  const [chatMessages, setChatMessages] = useState<SupportMessage[]>([]);
  const [adminReplyText, setAdminReplyText] = useState('');
  const [isSendingReply, setIsSendingReply] = useState(false);
  const [adminAttachment, setAdminAttachment] = useState<{
    url: string;
    name: string;
    type: 'image' | 'document';
  } | null>(null);

  const adminFileInputRef = useRef<HTMLInputElement>(null);
  const chatScrollRef = useRef<HTMLDivElement>(null);

  // Search & Filter
  const [userSearch, setUserSearch] = useState('');
  const [txSearch, setTxSearch] = useState('');
  const [txTypeFilter, setTxTypeFilter] = useState<string>('all');

  // Modals & Action States
  const [selectedTxForReceipt, setSelectedTxForReceipt] = useState<BankTransaction | null>(null);
  const [adminImagePreview, setAdminImagePreview] = useState<{ url: string; name: string } | null>(null);

  // Funding Modal
  const [fundingUser, setFundingUser] = useState<BankUser | null>(null);
  const [fundAmount, setFundAmount] = useState<string>('');
  const [fundReason, setFundReason] = useState<string>('Wells Fargo Liquidity Allocation');

  // Warning Modal
  const [warningUser, setWarningUser] = useState<BankUser | null>(null);
  const [warningText, setWarningText] = useState<string>('');

  // Reversal Modal
  const [reversingTx, setReversingTx] = useState<BankTransaction | null>(null);
  const [reversalReason, setReversalReason] = useState<string>('Operator audit rollback');

  // AI Command Terminal
  const [aiPrompt, setAiPrompt] = useState<string>('');
  const [isAiExecuting, setIsAiExecuting] = useState<boolean>(false);
  const [aiHistory, setAiHistory] = useState<Array<{
    command: string;
    result?: AiCommandResult;
    error?: string;
    timestamp: string;
  }>>([
    {
      command: 'System Status Diagnostic',
      result: {
        executiveSummary: 'Wells Fargo Institutional Management System operating nominally. $10 Billion USD liquidity pool active.',
        actions: [],
        responseMessage: 'Greetings, Administrator. Wells Fargo Executive AI is online with high thinking mode. You can command any action: fund customers, reverse wires, freeze accounts, issue compliance alerts, or request liquidity audits.'
      },
      timestamp: new Date().toLocaleTimeString()
    }
  ]);

  // Status Feedback
  const [operatorNotice, setOperatorNotice] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Subscriptions
  useEffect(() => {
    const unsubTreasury = subscribeToTreasury((t) => setTreasury(t));
    const unsubUsers = subscribeToAllUsers((u) => setUsers(u));
    const unsubTx = subscribeToAllTransactions((t) => setTransactions(t));
    const unsubLogs = subscribeToAuditLogs((l) => setAuditLogs(l));
    const unsubThreads = subscribeToAllSupportThreads((threads) => {
      setSupportThreads(threads);
      if (!selectedThread && threads.length > 0) {
        setSelectedThread(threads[0]);
      }
    });

    return () => {
      unsubTreasury();
      unsubUsers();
      unsubTx();
      unsubLogs();
      unsubThreads();
    };
  }, []);

  // Subscribe to selected chat messages
  useEffect(() => {
    if (!selectedThread) return;

    markThreadRead(selectedThread.id, 'admin');
    const unsubMsgs = subscribeToSupportMessages(selectedThread.id, (msgs) => {
      setChatMessages(msgs);
    });

    return () => unsubMsgs();
  }, [selectedThread?.id]);

  useEffect(() => {
    chatScrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const showFeedback = (type: 'success' | 'error', message: string) => {
    setOperatorNotice({ type, message });
    setTimeout(() => setOperatorNotice(null), 6000);
  };

  // 1. FUND CUSTOMER
  const handleConfirmFunding = async () => {
    if (!fundingUser || !currentUser) return;
    const amt = parseFloat(fundAmount);
    if (!amt || amt <= 0) {
      showFeedback('error', 'Please enter a valid funding amount.');
      return;
    }
    setIsSubmitting(true);
    try {
      await adminFundCustomer(currentUser.email, fundingUser.uid, amt, fundReason);
      showFeedback('success', `Successfully funded ${fundingUser.fullName} with ${formatCurrency(amt)} from Treasury.`);
      setFundingUser(null);
      setFundAmount('');
    } catch (err: any) {
      showFeedback('error', err.message || 'Funding failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 2. REVERSE TRANSACTION
  const handleConfirmReversal = async () => {
    if (!reversingTx || !currentUser) return;
    setIsSubmitting(true);
    try {
      const reversed = await adminReverseTransaction(currentUser.email, reversingTx.id, reversalReason);
      showFeedback('success', `Transaction ${reversed.reference} has been reversed. Account balances rolled back.`);
      setReversingTx(null);
    } catch (err: any) {
      showFeedback('error', err.message || 'Reversal failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 3. TOGGLE LOCK
  const handleToggleLock = async (user: BankUser) => {
    if (!currentUser) return;
    setIsSubmitting(true);
    try {
      await adminSetAccountLock(currentUser.email, user.uid, !user.isLocked, 'Operator toggle');
      showFeedback('success', `Account of ${user.fullName} has been ${user.isLocked ? 'unlocked' : 'locked'}.`);
    } catch (err: any) {
      showFeedback('error', err.message || 'Failed to toggle lock.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 4. TOGGLE TRANSFER RESTRICTION
  const handleToggleRestriction = async (user: BankUser) => {
    if (!currentUser) return;
    setIsSubmitting(true);
    try {
      await adminSetTransferRestriction(currentUser.email, user.uid, !user.isTransferRestricted, 'Operator toggle');
      showFeedback('success', `Transfer capability for ${user.fullName} ${user.isTransferRestricted ? 'restored' : 'restricted'}.`);
    } catch (err: any) {
      showFeedback('error', err.message || 'Failed to toggle restriction.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 5. SET WARNING MESSAGE
  const handleSaveWarning = async () => {
    if (!warningUser || !currentUser) return;
    setIsSubmitting(true);
    try {
      await adminSetWarningMessage(currentUser.email, warningUser.uid, warningText);
      showFeedback('success', warningText.trim() 
        ? `Warning banner published to ${warningUser.fullName}'s dashboard.` 
        : `Cleared warning for ${warningUser.fullName}.`
      );
      setWarningUser(null);
      setWarningText('');
    } catch (err: any) {
      showFeedback('error', err.message || 'Failed to set warning.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 6. SUPPORT CHAT REPLY
  const handleAdminFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2.5 * 1024 * 1024) {
      showFeedback('error', 'Attachment size limit is 2.5MB for secure transfer.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const isImg = file.type.startsWith('image/');
      setAdminAttachment({
        url: result,
        name: file.name,
        type: isImg ? 'image' : 'document'
      });
    };
    reader.readAsDataURL(file);
  };

  const handleSendAdminReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((!adminReplyText.trim() && !adminAttachment) || !selectedThread || !currentUser) return;

    setIsSendingReply(true);
    try {
      await sendSupportMessage(
        selectedThread.id,
        { uid: currentUser.uid, name: 'Wells Fargo Banking Specialist', role: 'admin' },
        adminReplyText,
        adminAttachment || undefined
      );
      setAdminReplyText('');
      setAdminAttachment(null);
      if (adminFileInputRef.current) adminFileInputRef.current.value = '';
    } catch (err) {
      console.error('Failed to send admin reply:', err);
    } finally {
      setIsSendingReply(false);
    }
  };

  // 7. EXECUTE AI COMMAND
  const handleAiCommandSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiPrompt.trim() || !currentUser) return;
    const promptText = aiPrompt.trim();
    setAiPrompt('');
    setIsAiExecuting(true);

    try {
      const result = await sendAdminAiCommand(promptText, {
        users,
        transactions,
        treasury
      });

      // Execute structured actions if returned by AI
      if (result.actions && result.actions.length > 0) {
        for (const act of result.actions) {
          if (act.action === 'FUND_CUSTOMER' && act.targetUserIdentifier && act.amount) {
            const target = users.find(u => 
              u.email.toLowerCase() === act.targetUserIdentifier?.toLowerCase() || 
              u.accountNumber === act.targetUserIdentifier ||
              u.fullName.toLowerCase().includes(act.targetUserIdentifier?.toLowerCase() || '')
            );
            if (target) {
              await adminFundCustomer(currentUser.email, target.uid, act.amount, act.reason || 'AI Directed Disbursement');
            }
          } else if (act.action === 'REVERSE_TRANSACTION' && act.transactionIdOrReference) {
            const targetTx = transactions.find(t => 
              t.id === act.transactionIdOrReference || 
              t.reference.toLowerCase() === act.transactionIdOrReference?.toLowerCase()
            );
            if (targetTx && targetTx.status !== 'reversed') {
              await adminReverseTransaction(currentUser.email, targetTx.id, act.reason || 'AI Directive Rollback');
            }
          } else if (act.action === 'LOCK_ACCOUNT' && act.targetUserIdentifier) {
            const target = users.find(u => 
              u.email.toLowerCase() === act.targetUserIdentifier?.toLowerCase() || 
              u.accountNumber === act.targetUserIdentifier ||
              u.fullName.toLowerCase().includes(act.targetUserIdentifier?.toLowerCase() || '')
            );
            if (target) {
              await adminSetAccountLock(currentUser.email, target.uid, true, act.reason || 'AI Compliance Lockdown');
            }
          } else if (act.action === 'UNLOCK_ACCOUNT' && act.targetUserIdentifier) {
            const target = users.find(u => 
              u.email.toLowerCase() === act.targetUserIdentifier?.toLowerCase() || 
              u.accountNumber === act.targetUserIdentifier
            );
            if (target) {
              await adminSetAccountLock(currentUser.email, target.uid, false, 'AI Directive Unlock');
            }
          } else if (act.action === 'RESTRICT_TRANSFERS' && act.targetUserIdentifier) {
            const target = users.find(u => 
              u.email.toLowerCase() === act.targetUserIdentifier?.toLowerCase() || 
              u.accountNumber === act.targetUserIdentifier
            );
            if (target) {
              await adminSetTransferRestriction(currentUser.email, target.uid, true, act.reason || 'AI AML Restriction');
            }
          } else if (act.action === 'UNRESTRICT_TRANSFERS' && act.targetUserIdentifier) {
            const target = users.find(u => 
              u.email.toLowerCase() === act.targetUserIdentifier?.toLowerCase() || 
              u.accountNumber === act.targetUserIdentifier
            );
            if (target) {
              await adminSetTransferRestriction(currentUser.email, target.uid, false, 'AI Lift Restriction');
            }
          } else if (act.action === 'ISSUE_WARNING' && act.targetUserIdentifier && act.warningMessage) {
            const target = users.find(u => 
              u.email.toLowerCase() === act.targetUserIdentifier?.toLowerCase() || 
              u.accountNumber === act.targetUserIdentifier
            );
            if (target) {
              await adminSetWarningMessage(currentUser.email, target.uid, act.warningMessage);
            }
          } else if (act.action === 'CLEAR_WARNING' && act.targetUserIdentifier) {
            const target = users.find(u => 
              u.email.toLowerCase() === act.targetUserIdentifier?.toLowerCase() || 
              u.accountNumber === act.targetUserIdentifier
            );
            if (target) {
              await adminSetWarningMessage(currentUser.email, target.uid, '');
            }
          }
        }
      }

      setAiHistory(prev => [
        {
          command: promptText,
          result,
          timestamp: new Date().toLocaleTimeString()
        },
        ...prev
      ]);
      showFeedback('success', 'AI Executive Directive executed successfully.');
    } catch (err: any) {
      setAiHistory(prev => [
        {
          command: promptText,
          error: err.message || 'AI Operator failed to process command',
          timestamp: new Date().toLocaleTimeString()
        },
        ...prev
      ]);
      showFeedback('error', err.message || 'AI Command failed.');
    } finally {
      setIsAiExecuting(false);
    }
  };

  const unreadChatsCount = supportThreads.filter(t => t.unreadByAdmin).length;

  // Filtered Users
  const filteredUsers = users.filter(u => {
    const q = userSearch.toLowerCase();
    return (
      u.fullName.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      u.accountNumber.includes(q)
    );
  });

  // Filtered Transactions
  const filteredTransactions = transactions.filter(t => {
    const q = txSearch.toLowerCase();
    const matchesSearch = 
      t.reference.toLowerCase().includes(q) ||
      t.senderName.toLowerCase().includes(q) ||
      t.recipientName.toLowerCase().includes(q) ||
      (t.recipientBank && t.recipientBank.toLowerCase().includes(q));
    
    const matchesType = txTypeFilter === 'all' || t.type === txTypeFilter;
    return matchesSearch && matchesType;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* ---------------- 1. EXECUTIVE OPERATOR BANNER ---------------- */}
      <div className="rounded-2xl bg-gradient-to-r from-red-900/40 via-slate-900 to-slate-950 border border-[#d71e28]/40 p-6 sm:p-7 shadow-2xl relative overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-[#d71e28]/20 border border-[#d71e28]/40 text-[#ffd100] flex items-center justify-center shadow-lg">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                  Wells Fargo Bank Operator &amp; Management Portal
                </h1>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#d71e28]/20 text-[#ffd100] font-bold border border-[#d71e28]/40 uppercase">
                  OPERATOR PRIVILEGE
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Central banking liquidity management, live customer chat desk with file attachments, wire reversals, customer funding, and autonomous AI command.
              </p>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block">
              Operator Clearance
            </span>
            <span className="text-xs font-mono font-bold text-[#ffd100]">
              {currentUser?.email}
            </span>
          </div>
        </div>
      </div>

      {/* Operator Notification Banner */}
      {operatorNotice && (
        <div className={`p-4 rounded-xl border flex items-start gap-3 text-xs animate-in fade-in duration-200 ${
          operatorNotice.type === 'success' 
            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' 
            : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
        }`}>
          {operatorNotice.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-400" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
          )}
          <span>{operatorNotice.message}</span>
        </div>
      )}

      {/* ---------------- 2. 10 BILLION USD TREASURY METRICS ---------------- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Metric 1: 10 Billion USD Central Vault Balance */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-[#d71e28]/30 relative overflow-hidden group space-y-2">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#d71e28]/10 rounded-full blur-2xl pointer-events-none" />
          <span className="text-[10px] font-mono font-bold text-[#ffd100] uppercase tracking-widest block">
            Central Management Vault
          </span>
          <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono tracking-tight">
            {formatCurrency(treasury?.balance || 10_000_000_000.00)}
          </div>
          <p className="text-[11px] text-slate-400 font-mono">
            10 Billion USD Operating Liquidity Pool
          </p>
        </div>

        {/* Metric 2: Total Disbursed / Funded to Customers */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-widest block">
            Liquidity Funded to Clients
          </span>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-mono tracking-tight">
            {formatCurrency(treasury?.totalFundedToUsers || 0)}
          </div>
          <p className="text-[11px] text-slate-500 font-mono">
            Cumulative operator disbursements
          </p>
        </div>

        {/* Metric 3: Active Customer Accounts */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <span className="text-[10px] font-mono font-bold text-teal-400 uppercase tracking-widest block">
            Enrolled Customers
          </span>
          <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono tracking-tight">
            {users.length}
          </div>
          <p className="text-[11px] text-slate-500 font-mono">
            Checking &amp; Corporate Treasury accounts
          </p>
        </div>

        {/* Metric 4: Total Reversals Executed */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <span className="text-[10px] font-mono font-bold text-indigo-400 uppercase tracking-widest block">
            Reversed Transaction Volume
          </span>
          <div className="text-2xl sm:text-3xl font-extrabold text-indigo-300 font-mono tracking-tight">
            {formatCurrency(treasury?.totalReversed || 0)}
          </div>
          <p className="text-[11px] text-slate-500 font-mono">
            Guaranteed rollback protections
          </p>
        </div>

      </div>

      {/* ---------------- 3. NAVIGATION TABS ---------------- */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto text-xs font-semibold">
        <button
          onClick={() => setActiveTab('treasury')}
          className={`px-4 py-2 rounded-xl transition-all ${
            activeTab === 'treasury'
              ? 'bg-[#d71e28] text-white font-bold shadow-md shadow-[#d71e28]/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          Overview &amp; Quick Controls
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2 rounded-xl transition-all ${
            activeTab === 'users'
              ? 'bg-[#d71e28] text-white font-bold shadow-md shadow-[#d71e28]/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          Customer Directory &amp; Funding ({users.length})
        </button>
        <button
          onClick={() => setActiveTab('transactions')}
          className={`px-4 py-2 rounded-xl transition-all ${
            activeTab === 'transactions'
              ? 'bg-[#d71e28] text-white font-bold shadow-md shadow-[#d71e28]/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          Wire Ledger &amp; Reversals ({transactions.length})
        </button>

        {/* Live Customer Support Chat Tab */}
        <button
          onClick={() => setActiveTab('chat')}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 ${
            activeTab === 'chat'
              ? 'bg-[#d71e28] text-white font-bold shadow-md shadow-[#d71e28]/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>Live Customer Support Hub</span>
          {unreadChatsCount > 0 && (
            <span className="px-1.5 py-0.2 rounded-full bg-[#ffbf00] text-slate-950 font-bold text-[10px]">
              {unreadChatsCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('ai')}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
            activeTab === 'ai'
              ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
              : 'text-emerald-400 hover:text-emerald-300 hover:bg-slate-900'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Wells Fargo AI Operator</span>
        </button>
        <button
          onClick={() => setActiveTab('audit')}
          className={`px-4 py-2 rounded-xl transition-all ${
            activeTab === 'audit'
              ? 'bg-[#d71e28] text-white font-bold shadow-md shadow-[#d71e28]/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          Regulatory Audit Trail ({auditLogs.length})
        </button>
      </div>

      {/* ---------------- 4. TAB CONTENTS ---------------- */}

      {/* TAB A: OVERVIEW & QUICK CONTROLS */}
      {activeTab === 'treasury' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          <div className="lg:col-span-7 space-y-6">
            <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-xl space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Building2 className="w-5 h-5 text-[#ffd100]" />
                <span>Wells Fargo Central Treasury Liquidity Allocation</span>
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                As the executive operator of Wells Fargo Online Banking, you possess full administrative authority to fund any customer account directly from the 10 Billion USD liquidity pool, freeze bad actor accounts, set compliance alerts, rollback wires, or converse in real time with clients.
              </p>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs font-mono">
                <div className="flex justify-between">
                  <span className="text-slate-400">Total Treasury Liquidity:</span>
                  <span className="font-bold text-white">{formatCurrency(treasury?.balance || 10_000_000_000)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">FedWire Routing:</span>
                  <span className="text-emerald-400 font-bold">121000247</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Operator Clearance ID:</span>
                  <span className="text-[#ffd100]">WF-OP-001</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Two-Step Auth Override:</span>
                  <span className="text-emerald-400 font-bold">BYPASSED (Direct Operator Access)</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 pt-2">
                <button
                  onClick={() => setActiveTab('users')}
                  className="px-4 py-2.5 rounded-xl bg-[#d71e28] hover:bg-[#b8141d] text-white font-bold text-xs shadow-md transition-colors"
                >
                  Fund a Customer Account
                </button>
                <button
                  onClick={() => setActiveTab('chat')}
                  className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors flex items-center gap-1.5"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Open Live Client Chat Desk</span>
                </button>
                <button
                  onClick={() => setActiveTab('transactions')}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs transition-colors"
                >
                  Inspect Wires &amp; Reverse
                </button>
              </div>
            </div>

            {/* Quick Customer Snapshot */}
            <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h4 className="text-xs font-mono font-bold text-slate-300 uppercase">
                  Recent Customer Accounts
                </h4>
                <button
                  onClick={() => setActiveTab('users')}
                  className="text-xs text-[#ffd100] hover:underline"
                >
                  View All &rarr;
                </button>
              </div>
              <div className="divide-y divide-slate-800/80">
                {users.slice(0, 4).map(u => (
                  <div key={u.uid} className="py-3 flex items-center justify-between text-xs">
                    <div>
                      <p className="font-bold text-white">{u.fullName}</p>
                      <p className="text-[11px] text-slate-400 font-mono">ACCT: {u.accountNumber} &bull; {u.email}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-mono font-bold text-emerald-400">{formatCurrency(u.balance)}</p>
                      <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${u.isLocked ? 'bg-rose-500/20 text-rose-400' : 'bg-slate-800 text-slate-400'}`}>
                        {u.isLocked ? 'LOCKED' : 'ACTIVE'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick AI Terminal Widget */}
          <div className="lg:col-span-5 rounded-2xl bg-slate-900 border border-emerald-500/30 p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                <Sparkles className="w-4 h-4" />
                <span>Wells Fargo AI Operator Fast Dispatch</span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400">
                HIGH THINKING
              </span>
            </div>

            <p className="text-xs text-slate-400">
              Type any banking command. The AI executes on your command:
            </p>

            <div className="space-y-2">
              {[
                'Fund Elena Vance with $50,000 for seed liquidity',
                'Reverse transaction tx_seed_001',
                'Lock account of David Chen and set AML warning'
              ].map(prompt => (
                <button
                  key={prompt}
                  onClick={() => { setAiPrompt(prompt); setActiveTab('ai'); }}
                  className="w-full text-left p-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-xs text-slate-300 font-mono flex items-center justify-between group transition-colors"
                >
                  <span className="truncate">{prompt}</span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-emerald-400 shrink-0" />
                </button>
              ))}
            </div>

            <div className="pt-2">
              <button
                onClick={() => setActiveTab('ai')}
                className="w-full py-2.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 font-bold text-xs uppercase tracking-wider transition-colors"
              >
                Open Full AI Command Terminal
              </button>
            </div>
          </div>

        </div>
      )}

      {/* TAB B: CUSTOMER DIRECTORY & MANAGEMENT */}
      {activeTab === 'users' && (
        <div className="rounded-2xl bg-slate-900 border border-slate-800 shadow-xl overflow-hidden space-y-4 p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-[#ffd100]" />
                <span>Wells Fargo Customer Directory</span>
              </h3>
              <p className="text-xs text-slate-400">
                Fund balances, manage restrictions, write compliance warnings, or freeze accounts.
              </p>
            </div>

            {/* Search */}
            <div className="relative w-72">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search name, email, account..."
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-[#d71e28]"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/60 text-slate-400 font-mono text-[10px] uppercase tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Customer Details</th>
                  <th className="py-3 px-4">Account Number</th>
                  <th className="py-3 px-4 text-right">Available Balance</th>
                  <th className="py-3 px-4">Status &amp; Restrictions</th>
                  <th className="py-3 px-4">Active Warning</th>
                  <th className="py-3 px-4 text-center">Operator Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredUsers.map((u) => (
                  <tr key={u.uid} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-3.5 px-4">
                      <p className="font-bold text-white">{u.fullName}</p>
                      <p className="text-[11px] text-slate-400">{u.email}</p>
                      {u.role === 'admin' && (
                        <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-amber-500/20 text-[#ffd100] font-mono">
                          OPERATOR
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-semibold text-slate-300">
                      {u.accountNumber}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-right text-emerald-400">
                      {formatCurrency(u.balance, u.currency)}
                    </td>
                    <td className="py-3.5 px-4 space-y-1">
                      <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${
                        u.isLocked
                          ? 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                          : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                      }`}>
                        {u.isLocked ? 'LOCKED' : 'ACTIVE'}
                      </span>
                      {u.isTransferRestricted && (
                        <span className="block text-[10px] text-orange-400 font-mono">
                          &bull; Transfers Restricted
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 max-w-[200px]">
                      {u.warningMessage ? (
                        <span className="text-[11px] text-amber-300 truncate block" title={u.warningMessage}>
                          ⚠️ {u.warningMessage}
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-600 font-mono">None</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center justify-center gap-1.5">
                        
                        {/* Fund Customer Button */}
                        <button
                          onClick={() => { setFundingUser(u); setFundAmount(''); }}
                          className="px-2.5 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-semibold transition-colors flex items-center gap-1"
                          title="Fund from Treasury Vault"
                        >
                          <DollarSign className="w-3.5 h-3.5" />
                          <span>Fund</span>
                        </button>

                        {/* Open Chat with this User */}
                        <button
                          onClick={() => {
                            const foundThread = supportThreads.find(t => t.userId === u.uid);
                            if (foundThread) setSelectedThread(foundThread);
                            setActiveTab('chat');
                          }}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-400 border border-slate-700 transition-colors"
                          title="Chat with Customer"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                        </button>

                        {/* Lock / Unlock */}
                        <button
                          onClick={() => handleToggleLock(u)}
                          className={`p-1.5 rounded-lg border transition-colors ${
                            u.isLocked 
                              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20' 
                              : 'bg-rose-500/10 border-rose-500/30 text-rose-400 hover:bg-rose-500/20'
                          }`}
                          title={u.isLocked ? 'Unlock Account' : 'Lock Account'}
                        >
                          {u.isLocked ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                        </button>

                        {/* Restrict Transfers */}
                        <button
                          onClick={() => handleToggleRestriction(u)}
                          className={`p-1.5 rounded-lg border transition-colors ${
                            u.isTransferRestricted 
                              ? 'bg-amber-500/20 border-amber-500/40 text-amber-300' 
                              : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
                          }`}
                          title={u.isTransferRestricted ? 'Lift Transfer Restrictions' : 'Restrict Outgoing Transfers'}
                        >
                          <Ban className="w-3.5 h-3.5" />
                        </button>

                        {/* Set Warning Message */}
                        <button
                          onClick={() => { setWarningUser(u); setWarningText(u.warningMessage || ''); }}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-400 border border-slate-700 transition-colors"
                          title="Write Compliance Warning Message"
                        >
                          <AlertTriangle className="w-3.5 h-3.5" />
                        </button>

                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB C: TRANSACTION LEDGER & REVERSALS */}
      {activeTab === 'transactions' && (
        <div className="rounded-2xl bg-slate-900 border border-slate-800 shadow-xl overflow-hidden space-y-4 p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Clock className="w-5 h-5 text-indigo-400" />
                <span>Central Transaction Ledger &amp; Reversal Controls</span>
              </h3>
              <p className="text-xs text-slate-400">
                You can reverse ANY completed transaction. Funds roll back directly to originating parties.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <select
                value={txTypeFilter}
                onChange={(e) => setTxTypeFilter(e.target.value)}
                className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-semibold text-white focus:outline-none"
              >
                <option value="all">All Types</option>
                <option value="internal">Internal P2P</option>
                <option value="international">International SWIFT</option>
                <option value="funding">Treasury Funding</option>
              </select>

              <div className="relative w-64">
                <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search ref, counterparty..."
                  value={txSearch}
                  onChange={(e) => setTxSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/60 text-slate-400 font-mono text-[10px] uppercase tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Date / Ref</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Sender</th>
                  <th className="py-3 px-4">Beneficiary / Bank</th>
                  <th className="py-3 px-4 text-right">Amount</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-center">Reversal Action</th>
                  <th className="py-3 px-4 text-center">Receipt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredTransactions.map((tx) => {
                  const isReversed = tx.status === 'reversed';

                  return (
                    <tr key={tx.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="py-3.5 px-4 font-mono text-slate-400">
                        <p className="text-white font-bold">{tx.reference}</p>
                        <p className="text-[10px] text-slate-500">{new Date(tx.createdAt).toLocaleString()}</p>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-slate-200 capitalize">
                          {tx.type}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <p className="font-bold text-white">{tx.senderName}</p>
                        <p className="text-[11px] font-mono text-slate-400">{tx.senderAccount}</p>
                      </td>
                      <td className="py-3.5 px-4">
                        <p className="font-bold text-white">{tx.recipientName}</p>
                        <p className="text-[11px] font-mono text-slate-400">
                          {tx.recipientBank ? `${tx.recipientBank} (${tx.recipientCountry})` : tx.recipientAccount}
                        </p>
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold text-right text-emerald-400 whitespace-nowrap">
                        <span className={isReversed ? 'line-through text-slate-500' : ''}>
                          {formatCurrency(tx.amount)}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase font-bold border ${
                          isReversed
                            ? 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                            : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                        }`}>
                          {tx.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        {isReversed ? (
                          <span className="text-[10px] font-mono text-slate-500">
                            Reversed
                          </span>
                        ) : (
                          <button
                            onClick={() => { setReversingTx(tx); setReversalReason('Operator audit rollback'); }}
                            className="px-2.5 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 text-xs font-semibold transition-colors flex items-center gap-1 mx-auto"
                            title="Reverse transaction and rollback balances"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                            <span>Reverse</span>
                          </button>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <button
                          onClick={() => setSelectedTxForReceipt(tx)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                          title="View Wire Slip"
                        >
                          <FileText className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB D: LIVE CUSTOMER SUPPORT CHAT HUB (ADMIN RECEIVES ALL CUSTOMER CHATS + PICTURES & DOCUMENTS) */}
      {activeTab === 'chat' && (
        <div className="rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[640px]">
          
          {/* Customer Threads List (Left Column) */}
          <div className="lg:col-span-4 border-r border-slate-800 flex flex-col bg-slate-950/60">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-[#ffd100]" />
                  <span>Client Conversations</span>
                </h3>
                <p className="text-[11px] text-slate-400">All customer live chat inquiries</p>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                {supportThreads.length} active
              </span>
            </div>

            <div className="flex-1 overflow-y-auto divide-y divide-slate-800/60">
              {supportThreads.length === 0 ? (
                <div className="p-8 text-center text-slate-500 text-xs space-y-2">
                  <MessageSquare className="w-6 h-6 mx-auto text-slate-600" />
                  <p>No customer chats initiated yet.</p>
                </div>
              ) : (
                supportThreads.map((thread) => {
                  const isSelected = selectedThread?.id === thread.id;
                  const hasUnread = thread.unreadByAdmin;

                  return (
                    <button
                      key={thread.id}
                      onClick={() => setSelectedThread(thread)}
                      className={`w-full p-4 text-left transition-colors flex items-start gap-3 ${
                        isSelected 
                          ? 'bg-[#d71e28]/15 border-l-4 border-[#d71e28]' 
                          : 'hover:bg-slate-900/60'
                      }`}
                    >
                      <div className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center text-white font-bold text-xs shrink-0 border border-slate-700">
                        {thread.userName.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1 mb-1">
                          <p className="text-xs font-bold text-white truncate">
                            {thread.userName}
                          </p>
                          <span className="text-[10px] font-mono text-slate-500">
                            {new Date(thread.lastMessageTimestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className="text-[11px] font-mono text-slate-400">
                          ACCT: {thread.userAccountNumber}
                        </p>
                        <p className={`text-xs truncate mt-1 ${hasUnread ? 'font-bold text-amber-300' : 'text-slate-400'}`}>
                          {thread.lastMessage}
                        </p>
                      </div>
                      {hasUnread && (
                        <span className="w-2.5 h-2.5 rounded-full bg-[#ffbf00] shrink-0 mt-1 animate-pulse" />
                      )}
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* Active Conversation Desk (Right Column) */}
          <div className="lg:col-span-8 flex flex-col bg-slate-900">
            {selectedThread ? (
              <>
                {/* Desk Header */}
                <div className="p-4 border-b border-slate-800 bg-slate-950/80 flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-white">{selectedThread.userName}</h4>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                        CLIENT VERIFIED
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 font-mono">
                      Email: {selectedThread.userEmail} &bull; Account: {selectedThread.userAccountNumber}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        const targetUser = users.find(u => u.uid === selectedThread.userId);
                        if (targetUser) {
                          setFundingUser(targetUser);
                          setFundAmount('');
                        }
                      }}
                      className="px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold hover:bg-emerald-500/30 transition-colors flex items-center gap-1"
                    >
                      <DollarSign className="w-3.5 h-3.5" />
                      <span>Fund Account</span>
                    </button>
                  </div>
                </div>

                {/* Messages Feed */}
                <div className="flex-1 p-5 overflow-y-auto space-y-4 bg-slate-950/40 text-xs">
                  {chatMessages.map((msg) => {
                    const isAdminMsg = msg.senderRole === 'admin';

                    return (
                      <div 
                        key={msg.id}
                        className={`flex flex-col ${isAdminMsg ? 'items-end' : 'items-start'}`}
                      >
                        <span className="text-[10px] font-mono text-slate-500 mb-1 px-1">
                          {isAdminMsg ? 'You (Banking Officer)' : msg.senderName} &bull; {new Date(msg.timestamp).toLocaleTimeString()}
                        </span>

                        <div className={`max-w-[75%] rounded-2xl p-4 shadow-md ${
                          isAdminMsg 
                            ? 'bg-[#d71e28] text-white rounded-br-none' 
                            : 'bg-slate-800 border border-slate-700 text-slate-100 rounded-bl-none'
                        }`}>
                          {msg.text && (
                            <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                          )}

                          {/* Image Attachment */}
                          {msg.attachmentUrl && msg.attachmentType === 'image' && (
                            <div className="mt-2.5 rounded-xl overflow-hidden border border-black/20 bg-black/40 p-1">
                              <img 
                                src={msg.attachmentUrl} 
                                alt={msg.attachmentName || 'Customer Attachment'} 
                                className="max-h-60 w-auto rounded-lg object-contain cursor-pointer hover:opacity-90 transition-opacity"
                                onClick={() => setAdminImagePreview({ url: msg.attachmentUrl!, name: msg.attachmentName || 'Customer Attachment' })}
                              />
                              <p className="text-[10px] font-mono text-slate-300 mt-1 truncate">
                                🖼️ {msg.attachmentName}
                              </p>
                            </div>
                          )}

                          {/* Document Attachment */}
                          {msg.attachmentUrl && msg.attachmentType === 'document' && (
                            <a
                              href={msg.attachmentUrl}
                              download={msg.attachmentName || 'document'}
                              className="mt-2.5 p-3 rounded-xl flex items-center gap-2.5 bg-slate-900 border border-slate-700 text-slate-200 hover:bg-slate-800 transition-colors font-mono text-xs"
                            >
                              <FileText className="w-5 h-5 text-[#ffd100] shrink-0" />
                              <span className="truncate flex-1 font-semibold">{msg.attachmentName || 'document.pdf'}</span>
                              <ExternalLink className="w-4 h-4 text-slate-400 shrink-0" />
                            </a>
                          )}
                        </div>
                      </div>
                    );
                  })}
                  <div ref={chatScrollRef} />
                </div>

                {/* Selected Attachment Preview */}
                {adminAttachment && (
                  <div className="px-4 py-2 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs font-mono">
                    <div className="flex items-center gap-2 text-emerald-400 truncate">
                      {adminAttachment.type === 'image' ? <ImageIcon className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
                      <span className="truncate">Ready to send: {adminAttachment.name}</span>
                    </div>
                    <button onClick={() => setAdminAttachment(null)} className="text-slate-400 hover:text-white">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}

                {/* Operator Reply Bar */}
                <form onSubmit={handleSendAdminReply} className="p-3 border-t border-slate-800 bg-slate-950 flex items-center gap-2">
                  <input 
                    type="file" 
                    ref={adminFileInputRef} 
                    onChange={handleAdminFileUpload} 
                    accept="image/*,.pdf,.doc,.docx,.txt" 
                    className="hidden" 
                  />
                  <button
                    type="button"
                    onClick={() => adminFileInputRef.current?.click()}
                    className="p-2.5 rounded-xl text-slate-400 hover:text-[#ffd100] hover:bg-slate-800 transition-colors"
                    title="Attach picture or document for customer"
                  >
                    <Paperclip className="w-5 h-5" />
                  </button>

                  <input
                    type="text"
                    placeholder={`Reply to ${selectedThread.userName}...`}
                    value={adminReplyText}
                    onChange={(e) => setAdminReplyText(e.target.value)}
                    className="flex-1 px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#d71e28]"
                  />

                  <button
                    type="submit"
                    disabled={isSendingReply || (!adminReplyText.trim() && !adminAttachment)}
                    className="px-5 py-3 rounded-xl bg-[#d71e28] hover:bg-[#b8141d] text-white font-bold text-xs flex items-center gap-1.5 disabled:opacity-40 transition-colors shadow-md"
                  >
                    <span>Send Reply</span>
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-12 text-slate-500 text-xs space-y-3">
                <MessageSquare className="w-10 h-10 text-slate-600" />
                <p className="text-sm font-semibold text-slate-400">Select a customer from the left to view and answer their live chat.</p>
              </div>
            )}
          </div>

        </div>
      )}

      {/* TAB E: AI OPERATOR TERMINAL */}
      {activeTab === 'ai' && (
        <div className="rounded-2xl bg-slate-900 border border-emerald-500/30 shadow-2xl p-6 sm:p-8 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
                <Bot className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <span>Wells Fargo AI Banking Operator Engine</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    EXECUTIVE CLEARANCE
                  </span>
                </h3>
                <p className="text-xs text-slate-400">
                  Powered by Gemini with High Thinking. Solves issues and commands any operation in the banking system.
                </p>
              </div>
            </div>

            <span className="text-xs font-mono text-emerald-400 bg-emerald-950/50 px-3 py-1 rounded-full border border-emerald-500/30">
              Model: gemini-3.1-pro-preview / Thinking: HIGH
            </span>
          </div>

          {/* Prompt Form */}
          <form onSubmit={handleAiCommandSubmit} className="space-y-3">
            <div className="relative">
              <input
                type="text"
                placeholder="Give command e.g.: 'Fund Marcus Sterling with $150,000', 'Reverse transaction WF-INT-...', 'Lock account of ...'"
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                disabled={isAiExecuting}
                className="w-full pl-4 pr-32 py-3.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 font-mono shadow-inner"
              />
              <button
                type="submit"
                disabled={isAiExecuting || !aiPrompt.trim()}
                className="absolute right-2 top-2 bottom-2 px-4 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 disabled:opacity-50 transition-all shadow-md"
              >
                {isAiExecuting ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Reasoning...</span>
                  </>
                ) : (
                  <>
                    <span>Command</span>
                    <Send className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>

            {/* Quick Prompts */}
            <div className="flex flex-wrap gap-2 text-xs">
              <span className="text-slate-500 font-mono text-[11px] self-center">Sample directives:</span>
              {[
                'Fund Elena Vance with $100,000 for verified wire',
                'Reverse the most recent international transfer',
                'Lock all accounts with unverified address flags',
                'Generate a liquidity and reserve risk audit report'
              ].map(q => (
                <button
                  type="button"
                  key={q}
                  onClick={() => setAiPrompt(q)}
                  className="px-2.5 py-1 rounded-lg bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 text-[11px] font-mono transition-colors"
                >
                  "{q}"
                </button>
              ))}
            </div>
          </form>

          {/* Conversation & Execution Log */}
          <div className="space-y-4 pt-4 border-t border-slate-800 max-h-[500px] overflow-y-auto pr-2">
            {aiHistory.map((item, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 font-mono text-emerald-400">
                    <Bot className="w-4 h-4" />
                    <span className="font-bold">ADMIN COMMAND: "{item.command}"</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-500">{item.timestamp}</span>
                </div>

                {item.error ? (
                  <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-xs text-rose-300">
                    {item.error}
                  </div>
                ) : item.result ? (
                  <div className="space-y-2 text-xs">
                    {item.result.executiveSummary && (
                      <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 font-mono text-[11px]">
                        <strong>REASONING &amp; THINKING ANALYSIS:</strong> {item.result.executiveSummary}
                      </div>
                    )}

                    {item.result.actions && item.result.actions.length > 0 && (
                      <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
                        <span className="text-[10px] font-mono uppercase text-slate-400">System Actions Applied:</span>
                        {item.result.actions.map((act, actIdx) => (
                          <div key={actIdx} className="font-mono text-xs text-white flex items-center gap-2">
                            <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                              {act.action}
                            </span>
                            <span>{JSON.stringify(act)}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    <p className="text-slate-300 leading-relaxed pl-1">
                      {item.result.responseMessage}
                    </p>
                  </div>
                ) : null}
              </div>
            ))}
          </div>

        </div>
      )}

      {/* TAB F: REGULATORY AUDIT LOGS */}
      {activeTab === 'audit' && (
        <div className="rounded-2xl bg-slate-900 border border-slate-800 shadow-xl overflow-hidden p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <span>Wells Fargo Regulatory Audit Trail</span>
              </h3>
              <p className="text-xs text-slate-400">
                Immutable chronological log of all administrative disbursements, reversals, and security flags.
              </p>
            </div>
            <span className="text-xs font-mono text-slate-500">{auditLogs.length} Records</span>
          </div>

          <div className="space-y-2 max-h-[460px] overflow-y-auto pr-1 text-xs">
            {auditLogs.map((log) => (
              <div key={log.id} className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 flex items-start justify-between gap-4 font-mono">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-300 border border-amber-500/30">
                      {log.action}
                    </span>
                    <span className="text-slate-400 text-[11px]">Actor: {log.actor}</span>
                  </div>
                  <p className="text-slate-200">{log.details}</p>
                </div>
                <span className="text-[10px] text-slate-500 shrink-0">
                  {new Date(log.timestamp).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ---------------- 5. ACTION MODALS ---------------- */}

      {/* Modal 1: Fund Customer */}
      {fundingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-emerald-400" />
              <span>Fund Customer Account</span>
            </h3>
            <p className="text-xs text-slate-400">
              Disburse liquidity from the 10 Billion USD Treasury directly to <strong>{fundingUser.fullName}</strong> ({fundingUser.accountNumber}).
            </p>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Funding Amount (USD)
              </label>
              <input
                type="number"
                step="100"
                min="1"
                placeholder="e.g. 50000"
                value={fundAmount}
                onChange={(e) => setFundAmount(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm font-mono font-bold text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Operator Memo / Reason
              </label>
              <input
                type="text"
                value={fundReason}
                onChange={(e) => setFundReason(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-3">
              <button
                type="button"
                onClick={() => setFundingUser(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleConfirmFunding}
                className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20"
              >
                {isSubmitting ? 'Funding...' : 'Confirm Funding'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 2: Reversal Confirmation */}
      {reversingTx && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-rose-500/40 p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <RotateCcw className="w-5 h-5 text-rose-400" />
              <span>Confirm Transaction Reversal</span>
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Are you sure you want to reverse transfer <strong>{reversingTx.reference}</strong> ({formatCurrency(reversingTx.amount)})? 
              Funds will be instantaneously debited from the recipient and restored to the sender.
            </p>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Reversal Audit Note
              </label>
              <input
                type="text"
                value={reversalReason}
                onChange={(e) => setReversalReason(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-rose-500"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-3">
              <button
                type="button"
                onClick={() => setReversingTx(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
              >
                Abort
              </button>
              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleConfirmReversal}
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-lg shadow-rose-600/25"
              >
                {isSubmitting ? 'Reversing...' : 'Execute Reversal'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 3: Write Warning Message */}
      {warningUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-amber-500/40 p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
              <span>Compliance Warning Banner</span>
            </h3>
            <p className="text-xs text-slate-400">
              Set an official notification banner that displays at the top of <strong>{warningUser.fullName}</strong>'s dashboard. Clear the field to remove warning.
            </p>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Warning Message Text
              </label>
              <textarea
                rows={3}
                placeholder="e.g. Compliance Notice: Please submit proof of source of funds for recent international wire."
                value={warningText}
                onChange={(e) => setWarningText(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-3">
              <button
                type="button"
                onClick={() => setWarningUser(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleSaveWarning}
                className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20"
              >
                {isSubmitting ? 'Saving...' : 'Publish Warning'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Official Receipt Modal */}
      <ReceiptModal 
        transaction={selectedTxForReceipt}
        onClose={() => setSelectedTxForReceipt(null)}
      />

      {/* Admin Image Lightbox Modal */}
      {adminImagePreview && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative max-w-3xl max-h-[85vh] bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden flex flex-col p-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-white">
              <span className="text-xs font-mono truncate">{adminImagePreview.name}</span>
              <div className="flex items-center gap-2">
                <a
                  href={adminImagePreview.url}
                  download={adminImagePreview.name}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
                  title="Download Image"
                >
                  <Download className="w-4 h-4" />
                </a>
                <button
                  onClick={() => setAdminImagePreview(null)}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-auto flex items-center justify-center p-2">
              <img 
                src={adminImagePreview.url} 
                alt={adminImagePreview.name} 
                className="max-h-[70vh] w-auto object-contain rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

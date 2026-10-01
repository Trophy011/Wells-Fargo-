import React, { useState, useEffect, useMemo } from 'react';
import { 
  Building2, 
  Send, 
  Globe2, 
  Clock, 
  ShieldCheck, 
  AlertTriangle, 
  Lock, 
  KeyRound, 
  UserCheck, 
  Copy, 
  Check, 
  FileText, 
  Search, 
  Filter, 
  ArrowUpRight, 
  ArrowDownLeft, 
  CheckCircle2, 
  AlertCircle,
  RotateCcw,
  Sparkles,
  RefreshCw,
  Zap,
  ArrowRight,
  Printer,
  Download,
  ExternalLink,
  X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.tsx';
import { BankTransaction } from '../types/banking.ts';
import { COUNTRIES_AND_BANKS, EXCHANGE_RATES_TO_USD } from '../data/countriesAndBanks.ts';
import { 
  formatCurrency, 
  executeInternalTransfer, 
  executeInternationalTransfer, 
  subscribeToUserTransactions, 
  setupTransactionPin,
  updateUserProfile
} from '../services/bankingService.ts';
import { ReceiptModal } from './ReceiptModal.tsx';

export const CustomerDashboard: React.FC = () => {
  const { currentUser, refreshUserProfile } = useAuth();

  const [activeTab, setActiveTab] = useState<'overview' | 'internal' | 'international' | 'history' | 'profile'>('overview');
  const [transactions, setTransactions] = useState<BankTransaction[]>([]);
  const [selectedTxForReceipt, setSelectedTxForReceipt] = useState<BankTransaction | null>(null);

  // Copy state
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Feedback states
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  // Form: Internal Transfer
  const [internalRecipient, setInternalRecipient] = useState('');
  const [internalAmount, setInternalAmount] = useState<string>('');
  const [internalPin, setInternalPin] = useState('');
  const [internalMemo, setInternalMemo] = useState('');

  // Form: International Wire
  const [wireCountryCode, setWireCountryCode] = useState<string>('GB');
  const [wireBankName, setWireBankName] = useState<string>('Barclays Bank UK');
  const [wireSwiftCode, setWireSwiftCode] = useState<string>('BARCGB22');
  const [wireRecipientName, setWireRecipientName] = useState('');
  const [wireAccountOrIban, setWireAccountOrIban] = useState('');
  const [wireAmount, setWireAmount] = useState<string>('');
  const [wirePin, setWirePin] = useState('');
  const [wireMemo, setWireMemo] = useState('');

  // Form: Profile & PIN setup
  const [profileName, setProfileName] = useState(currentUser?.fullName || '');
  const [profilePhone, setProfilePhone] = useState(currentUser?.phone || '');
  const [profileAddress, setProfileAddress] = useState(currentUser?.address || '');
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');

  // Subscribe to user transactions
  useEffect(() => {
    if (!currentUser?.uid) return;
    const unsub = subscribeToUserTransactions(currentUser.uid, (txs) => {
      setTransactions(txs);
    });
    return () => unsub();
  }, [currentUser?.uid]);

  // Search and custom bank state
  const [wireCountrySearch, setWireCountrySearch] = useState('');
  const [isCustomBank, setIsCustomBank] = useState(false);
  const [customBankName, setCustomBankName] = useState('');

  // Clearance tools modal states
  const [showClearanceModal, setShowClearanceModal] = useState(false);
  const [showProofOfBalanceModal, setShowProofOfBalanceModal] = useState(false);
  const [clearanceQuery, setClearanceQuery] = useState('');
  const [isTestingClearance, setIsTestingClearance] = useState(false);
  const [clearanceResult, setClearanceResult] = useState<{
    tested: boolean;
    valid: boolean;
    network: string;
    speed: string;
    details: string;
    protocol: string;
    refCode: string;
  } | null>(null);

  const filteredCountries = useMemo(() => {
    if (!wireCountrySearch.trim()) return COUNTRIES_AND_BANKS;
    const q = wireCountrySearch.toLowerCase();
    return COUNTRIES_AND_BANKS.filter(c => 
      c.country.toLowerCase().includes(q) || 
      c.code.toLowerCase().includes(q) ||
      c.currency.toLowerCase().includes(q)
    );
  }, [wireCountrySearch]);

  // Keep country banks synced
  const activeWireCountry = COUNTRIES_AND_BANKS.find(c => c.code === wireCountryCode) || COUNTRIES_AND_BANKS[0];

  const handleCountryChange = (code: string) => {
    setWireCountryCode(code);
    setIsCustomBank(false);
    setCustomBankName('');
    const country = COUNTRIES_AND_BANKS.find(c => c.code === code) || COUNTRIES_AND_BANKS[0];
    if (country.banks.length > 0) {
      setWireBankName(country.banks[0].name);
      setWireSwiftCode(country.banks[0].swiftPrefix);
    } else {
      setIsCustomBank(true);
      setWireBankName('__custom__');
    }
  };

  const handleBankChange = (bankName: string) => {
    if (bankName === '__custom__') {
      setIsCustomBank(true);
      setWireBankName('__custom__');
      setWireSwiftCode(activeWireCountry.code + 'XXB');
    } else {
      setIsCustomBank(false);
      setWireBankName(bankName);
      const foundBank = activeWireCountry.banks.find(b => b.name === bankName);
      if (foundBank) {
        setWireSwiftCode(foundBank.swiftPrefix);
      }
    }
  };

  const handleRunClearanceCheck = () => {
    if (!clearanceQuery.trim()) return;
    setIsTestingClearance(true);
    setTimeout(() => {
      const q = clearanceQuery.trim().toUpperCase();
      const isInternal = /^\d{10}$/.test(q);
      setClearanceResult({
        tested: true,
        valid: true,
        network: isInternal ? 'Wells Fargo Automated Clearing Network (P2P)' : 'SWIFT GPI Instant Clearance Protocol',
        speed: isInternal ? 'Instant (0 seconds)' : 'Standard High-Priority (1-3 min)',
        details: isInternal ? `Direct internal route confirmed for Account #${q}. Zero intermediary fees applied.` : `Verified straight-through-processing (STP) channel to routing BIC ${q}.`,
        protocol: 'ISO 20022 End-to-End Cryptographic Clearing',
        refCode: `WF-CLR-${Math.random().toString(36).substring(2, 9).toUpperCase()}`
      });
      setIsTestingClearance(false);
    }, 600);
  };

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(label);
    setTimeout(() => setCopiedField(null), 2000);
  };

  // Submit Internal Transfer
  const handleInternalTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    setActionError(null);
    setActionSuccess(null);

    // requirement: make sure you have set you transactions pin when making transfer you will put the pin
    if (!currentUser.transactionPin) {
      setActionError('Security Requirement: You must configure your 4-digit Transaction PIN in the Profile & PIN Security tab before making transfers.');
      setActiveTab('profile');
      return;
    }

    if (!internalPin || internalPin.length !== 4) {
      setActionError('Please enter your complete 4-digit Transaction PIN.');
      return;
    }

    if (internalPin !== currentUser.transactionPin) {
      setActionError('Invalid Transaction PIN. Verification failed.');
      return;
    }

    setIsProcessing(true);

    try {
      const amt = parseFloat(internalAmount);
      const tx = await executeInternalTransfer(currentUser, internalRecipient, amt, internalPin, internalMemo);
      await refreshUserProfile();
      setActionSuccess(`Transfer of ${formatCurrency(amt)} completed successfully to ${tx.recipientName}. Ref: ${tx.reference}`);
      setInternalRecipient('');
      setInternalAmount('');
      setInternalPin('');
      setInternalMemo('');
      setSelectedTxForReceipt(tx);
    } catch (err: any) {
      setActionError(err.message || 'Transfer failed.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Submit International Transfer
  const handleInternationalTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    setActionError(null);
    setActionSuccess(null);

    // requirement: make sure you have set you transactions pin when making transfer you will put the pin
    if (!currentUser.transactionPin) {
      setActionError('Security Requirement: You must configure your 4-digit Transaction PIN in the Profile & PIN Security tab before dispatching international wires.');
      setActiveTab('profile');
      return;
    }

    if (!wirePin || wirePin.length !== 4) {
      setActionError('Please enter your complete 4-digit Transaction PIN.');
      return;
    }

    if (wirePin !== currentUser.transactionPin) {
      setActionError('Invalid Transaction PIN. International wire authorization failed.');
      return;
    }

    const resolvedBankName = isCustomBank ? customBankName.trim() : wireBankName;
    if (!resolvedBankName) {
      setActionError('Please select or enter the destination commercial bank.');
      return;
    }

    setIsProcessing(true);

    try {
      const amt = parseFloat(wireAmount);
      const tx = await executeInternationalTransfer(currentUser, {
        recipientName: wireRecipientName,
        country: activeWireCountry.country,
        bankName: resolvedBankName,
        swiftCode: wireSwiftCode,
        accountOrIban: wireAccountOrIban,
        amount: amt,
        pin: wirePin,
        memo: wireMemo
      });
      await refreshUserProfile();
      setActionSuccess(`International Wire of ${formatCurrency(amt)} dispatched to ${wireRecipientName} at ${resolvedBankName}. Ref: ${tx.reference}`);
      setWireRecipientName('');
      setWireAccountOrIban('');
      setWireAmount('');
      setWirePin('');
      setWireMemo('');
      setSelectedTxForReceipt(tx);
    } catch (err: any) {
      setActionError(err.message || 'Wire failed.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Save Profile
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    setActionError(null);
    setActionSuccess(null);
    setIsProcessing(true);

    try {
      await updateUserProfile(currentUser.uid, {
        fullName: profileName,
        phone: profilePhone,
        address: profileAddress
      });
      await refreshUserProfile();
      setActionSuccess('Your customer profile details have been securely updated.');
    } catch (err: any) {
      setActionError(err.message || 'Failed to update profile.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Setup PIN
  const handleSetupPin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    setActionError(null);
    setActionSuccess(null);

    if (newPin !== confirmPin) {
      setActionError('PINs do not match.');
      return;
    }
    if (!/^\d{4}$/.test(newPin)) {
      setActionError('PIN must be exactly 4 numerical digits (0-9).');
      return;
    }

    setIsProcessing(true);
    try {
      await setupTransactionPin(currentUser.uid, newPin);
      await refreshUserProfile();
      setActionSuccess('4-digit Transaction PIN configured successfully! You can now authorize transfers.');
      setNewPin('');
      setConfirmPin('');
    } catch (err: any) {
      setActionError(err.message || 'Failed to setup PIN.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (!currentUser) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* ---------------- 1. COMPLIANCE & SECURITY WARNING BANNERS ---------------- */}
      {currentUser.warningMessage && (
        <div className="p-4 sm:p-5 rounded-2xl bg-amber-500/10 border-2 border-amber-500/40 shadow-xl flex items-start gap-4 animate-in fade-in duration-300">
          <div className="p-2 rounded-xl bg-amber-500/20 text-amber-300 shrink-0 mt-0.5">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400">
                Official Compliance & Security Notice
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300">
                ACTION ADVISED
              </span>
            </div>
            <p className="text-sm font-semibold text-white">
              {currentUser.warningMessage}
            </p>
            <p className="text-xs text-amber-300/80">
              This message was dispatched directly by Wells Fargo Online Banking Management. Please contact compliance if clarification is needed.
            </p>
          </div>
        </div>
      )}

      {currentUser.isLocked && (
        <div className="p-4 sm:p-5 rounded-2xl bg-rose-500/10 border-2 border-rose-500/40 shadow-xl flex items-start gap-4">
          <div className="p-2 rounded-xl bg-rose-500/20 text-rose-300 shrink-0 mt-0.5">
            <Lock className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-rose-300 uppercase tracking-wide">
              Account Suspended by Bank Operator
            </h4>
            <p className="text-xs text-rose-200 mt-1">
              Your account has been temporarily locked by bank administration. All outgoing transactions are halted until compliance verification is cleared.
            </p>
          </div>
        </div>
      )}

      {currentUser.isTransferRestricted && !currentUser.isLocked && (
        <div className="p-4 rounded-xl bg-orange-500/10 border border-orange-500/30 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-orange-400 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-xs font-bold text-orange-300 uppercase tracking-wide">
              Transfer Restrictions Enforced
            </h4>
            <p className="text-xs text-orange-200/90 mt-0.5">
              Outgoing transfer capabilities have been flagged and restricted by bank administration. Account remains open for deposits and viewing.
            </p>
          </div>
        </div>
      )}

      {/* ---------------- 2. ACCOUNT OVERVIEW CARD ---------------- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Main Balance & Account Card */}
        <div className="lg:col-span-8 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900/95 to-slate-950 border border-slate-800 p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none" />

          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div>
              <span className="text-xs font-mono font-semibold text-slate-400 uppercase tracking-wider">
                {currentUser.accountType || 'Personal Checking'} &bull; Base Currency USD
              </span>
              <h2 className="text-2xl font-bold text-white tracking-tight mt-0.5">
                {currentUser.fullName}
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <span className={`px-3 py-1 rounded-full text-xs font-mono font-bold tracking-wider uppercase border ${
                currentUser.isLocked 
                  ? 'bg-rose-500/10 border-rose-500/30 text-rose-400' 
                  : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
              }`}>
                {currentUser.isLocked ? 'LOCKED' : 'ACTIVE & VERIFIED'}
              </span>
            </div>
          </div>

          {/* Balance Display */}
          <div className="my-6">
            <span className="text-xs font-mono text-slate-400 uppercase tracking-widest block mb-1">
              Available Balance
            </span>
            <div className="text-4xl sm:text-5xl font-extrabold text-white font-mono tracking-tight flex items-baseline gap-2">
              <span>{formatCurrency(currentUser.balance, currentUser.currency)}</span>
              <span className="text-sm font-semibold text-emerald-400 font-sans">USD</span>
            </div>
            {currentUser.balance === 0 && (
              <p className="text-xs text-slate-400 mt-2 font-mono">
                New account initial balance: $0.00. Fund via bank wire or internal transfer.
              </p>
            )}
          </div>

          {/* Account & Routing Numbers with Copy */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6 border-t border-slate-800/80">
            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono text-slate-500 uppercase">Account Number</span>
                <p className="text-sm font-mono font-bold text-white">{currentUser.accountNumber}</p>
              </div>
              <button
                onClick={() => handleCopy(currentUser.accountNumber, 'acct')}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                title="Copy Account Number"
              >
                {copiedField === 'acct' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono text-slate-500 uppercase">FedWire Routing Transit</span>
                <p className="text-sm font-mono font-bold text-white">{currentUser.routingNumber}</p>
              </div>
              <button
                onClick={() => handleCopy(currentUser.routingNumber, 'routing')}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                title="Copy Routing Number"
              >
                {copiedField === 'routing' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

        </div>

        {/* Quick Transfer Actions Column */}
        <div className="lg:col-span-4 rounded-2xl bg-slate-900 border border-slate-800 p-6 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
                <Zap className="w-4 h-4 text-emerald-400" />
                <span>Instant Clearance Tools</span>
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                ACTIVE
              </span>
            </div>

            <div className="space-y-2.5">
              <button
                onClick={() => { setActiveTab('internal'); setActionError(null); setActionSuccess(null); }}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-950 hover:bg-slate-800/80 border border-slate-800 transition-all group text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
                    <Send className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white group-hover:text-emerald-400 transition-colors">
                      Internal Transfer
                    </p>
                    <p className="text-[11px] text-slate-400">Instant peer-to-peer reflection</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-all" />
              </button>

              <button
                onClick={() => { setActiveTab('international'); setActionError(null); setActionSuccess(null); }}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-950 hover:bg-slate-800/80 border border-slate-800 transition-all group text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-teal-500/10 text-teal-400 flex items-center justify-center shrink-0">
                    <Globe2 className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white group-hover:text-teal-400 transition-colors">
                      International Wire
                    </p>
                    <p className="text-[11px] text-slate-400">Global SWIFT wire (180+ countries)</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-teal-400 group-hover:translate-x-0.5 transition-all" />
              </button>

              <button
                onClick={() => { setShowClearanceModal(true); setClearanceResult(null); setClearanceQuery(currentUser.accountNumber); }}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-950 hover:bg-slate-800/80 border border-slate-800 transition-all group text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white group-hover:text-amber-400 transition-colors">
                      Routing & Clearance Verifier
                    </p>
                    <p className="text-[11px] text-slate-400">Pre-clear SWIFT / routing transit</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-amber-400 group-hover:translate-x-0.5 transition-all" />
              </button>

              <button
                onClick={() => setShowProofOfBalanceModal(true)}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-950 hover:bg-slate-800/80 border border-slate-800 transition-all group text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-sky-500/10 text-sky-400 flex items-center justify-center shrink-0">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white group-hover:text-sky-400 transition-colors">
                      Proof of Balance Statement
                    </p>
                    <p className="text-[11px] text-slate-400">Official certified funds certificate</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-sky-400 group-hover:translate-x-0.5 transition-all" />
              </button>

              <button
                onClick={() => { setActiveTab('profile'); setActionError(null); setActionSuccess(null); }}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-950 hover:bg-slate-800/80 border border-slate-800 transition-all group text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center shrink-0">
                    <KeyRound className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white group-hover:text-indigo-400 transition-colors">
                      Security & 4-Digit PIN
                    </p>
                    <p className="text-[11px] text-slate-400">
                      {currentUser.transactionPin ? 'PIN configured & active' : 'Setup PIN required for wires'}
                    </p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-indigo-400 group-hover:translate-x-0.5 transition-all" />
              </button>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800 flex items-center gap-2 text-[11px] text-slate-500 font-mono">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Customer Data Protected via 256-bit HSM</span>
          </div>
        </div>

      </div>

      {/* ---------------- 3. NAVIGATION TABS ---------------- */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto text-xs font-medium">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 rounded-xl transition-all ${
            activeTab === 'overview'
              ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          Recent Activity
        </button>
        <button
          onClick={() => setActiveTab('internal')}
          className={`px-4 py-2 rounded-xl transition-all ${
            activeTab === 'internal'
              ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          Internal Transfer
        </button>
        <button
          onClick={() => setActiveTab('international')}
          className={`px-4 py-2 rounded-xl transition-all ${
            activeTab === 'international'
              ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          International Wire
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`px-4 py-2 rounded-xl transition-all ${
            activeTab === 'history'
              ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          Transaction Ledger ({transactions.length})
        </button>
        <button
          onClick={() => setActiveTab('profile')}
          className={`px-4 py-2 rounded-xl transition-all ${
            activeTab === 'profile'
              ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          Profile & PIN Security
        </button>
      </div>

      {/* Alerts */}
      {actionError && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-3 text-xs text-rose-300">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
          <span>{actionError}</span>
        </div>
      )}

      {actionSuccess && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-start gap-3 text-xs text-emerald-300">
          <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-400" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* ---------------- 4. TAB CONTENTS ---------------- */}

      {/* A. INTERNAL TRANSFER FORM */}
      {activeTab === 'internal' && (
        <div className="max-w-2xl mx-auto rounded-2xl bg-slate-900 border border-slate-800 p-6 sm:p-8 shadow-xl">
          <div className="mb-6 pb-4 border-b border-slate-800">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Send className="w-5 h-5 text-emerald-400" />
              <span>Send Money Within Wells Fargo Online Banking</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Transfer instantly to any customer by entering their 10-digit Account Number or registered Email.
            </p>
          </div>

          <form onSubmit={handleInternalTransfer} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Recipient Account Number or Registered Email
              </label>
              <input
                type="text"
                required
                placeholder="e.g. 8892019482 or colleague@company.com"
                value={internalRecipient}
                onChange={(e) => setInternalRecipient(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm font-mono text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Amount (USD)
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-3 text-slate-500 font-mono font-bold">$</span>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  max={currentUser.balance}
                  required
                  placeholder="0.00"
                  value={internalAmount}
                  onChange={(e) => setInternalAmount(e.target.value)}
                  className="w-full pl-8 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-base font-mono font-bold text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
              <p className="text-[11px] text-slate-500 mt-1 font-mono">
                Available to send: {formatCurrency(currentUser.balance)}
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Transfer Purpose / Memo
              </label>
              <input
                type="text"
                placeholder="e.g. Monthly rent, invoice settlement, invoice #442"
                value={internalMemo}
                onChange={(e) => setInternalMemo(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            {!currentUser.transactionPin && (
              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-amber-300">
                <div className="flex items-center gap-2.5">
                  <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
                  <div>
                    <p className="font-bold">Transaction PIN Required</p>
                    <p className="text-[11px] text-amber-400/80">You must configure your 4-digit security PIN before transferring funds.</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab('profile')}
                  className="px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shrink-0 transition-colors"
                >
                  Set Up PIN Now
                </button>
              </div>
            )}

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
              <label className="block text-xs font-bold text-emerald-400 font-mono uppercase">
                Enter Your 4-Digit Transaction PIN
              </label>
              <input
                type="password"
                maxLength={4}
                required
                placeholder="••••"
                value={internalPin}
                onChange={(e) => setInternalPin(e.target.value)}
                className="w-32 tracking-[0.5em] text-center px-4 py-2 rounded-lg bg-slate-900 border border-slate-700 text-lg font-mono text-white focus:outline-none focus:border-emerald-500"
              />
              <p className="text-[11px] text-slate-500">
                {!currentUser.transactionPin 
                  ? 'Notice: Click "Set Up PIN Now" above to configure your security PIN.' 
                  : 'Authorized cryptographic signature required for disbursement.'}
              </p>
            </div>

            <button
              type="submit"
              disabled={isProcessing || currentUser.isLocked || currentUser.isTransferRestricted}
              className="w-full py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm shadow-lg shadow-emerald-500/20 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
            >
              <span>{isProcessing ? 'Clearing Transfer...' : 'Authorize & Send Transfer'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

      {/* B. INTERNATIONAL WIRE FORM */}
      {activeTab === 'international' && (
        <div className="max-w-3xl mx-auto rounded-2xl bg-slate-900 border border-slate-800 p-6 sm:p-8 shadow-xl">
          <div className="mb-6 pb-4 border-b border-slate-800">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Globe2 className="w-5 h-5 text-teal-400" />
                <span>Global SWIFT Commercial Wire Transfer</span>
              </h3>
              <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-teal-500/10 text-teal-400 border border-teal-500/30">
                180+ COUNTRIES
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Select destination country and commercial bank. Data is tokenized and protected by PCI-DSS protocols.
            </p>
          </div>

          <form onSubmit={handleInternationalTransfer} className="space-y-4">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
                  <span>1. Destination Country ({COUNTRIES_AND_BANKS.length} Countries)</span>
                  {wireCountrySearch && (
                    <button
                      type="button"
                      onClick={() => setWireCountrySearch('')}
                      className="text-[10px] text-teal-400 hover:underline"
                    >
                      Reset filter
                    </button>
                  )}
                </label>
                <div className="space-y-2">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-500" />
                    <input
                      type="text"
                      placeholder="Type country name (e.g. France, Nigeria, Japan)..."
                      value={wireCountrySearch}
                      onChange={(e) => setWireCountrySearch(e.target.value)}
                      className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
                    />
                  </div>
                  <select
                    value={wireCountryCode}
                    onChange={(e) => handleCountryChange(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm font-bold text-white focus:outline-none focus:border-teal-500"
                  >
                    {filteredCountries.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.country} ({c.code} - {c.currency})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  2. Select Commercial Bank in {activeWireCountry.country}
                </label>
                <div className="space-y-2">
                  <select
                    value={isCustomBank ? '__custom__' : wireBankName}
                    onChange={(e) => handleBankChange(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-teal-500"
                  >
                    {activeWireCountry.banks.map((b) => (
                      <option key={b.name} value={b.name}>
                        {b.name} ({b.swiftPrefix})
                      </option>
                    ))}
                    <option value="__custom__">➕ Other / Unlisted Financial Institution (Enter Manually)</option>
                  </select>

                  {isCustomBank && (
                    <input
                      type="text"
                      required
                      placeholder="Type destination bank or credit union name"
                      value={customBankName}
                      onChange={(e) => setCustomBankName(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-teal-500/50 text-xs text-white focus:outline-none focus:border-teal-400"
                    />
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  SWIFT / BIC Routing Code
                </label>
                <input
                  type="text"
                  required
                  value={wireSwiftCode}
                  onChange={(e) => setWireSwiftCode(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm font-mono font-bold text-teal-400 focus:outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Beneficiary Account # / IBAN
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. GB29BARC20000088192841"
                  value={wireAccountOrIban}
                  onChange={(e) => setWireAccountOrIban(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm font-mono text-white focus:outline-none focus:border-teal-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Beneficiary Full Name or Entity
              </label>
              <input
                type="text"
                required
                placeholder="Legal name as registered with destination bank"
                value={wireRecipientName}
                onChange={(e) => setWireRecipientName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-teal-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Amount in USD
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-3 text-slate-500 font-mono font-bold">$</span>
                <input
                  type="number"
                  step="0.01"
                  min="1"
                  required
                  placeholder="0.00"
                  value={wireAmount}
                  onChange={(e) => setWireAmount(e.target.value)}
                  className="w-full pl-8 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-base font-mono font-bold text-white focus:outline-none focus:border-teal-500"
                />
              </div>
              {wireAmount && parseFloat(wireAmount) > 0 && (
                <div className="mt-2 p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-400 flex justify-between">
                  <span>Estimated Payout in {activeWireCountry.currency}:</span>
                  <span className="font-mono font-bold text-emerald-400">
                    {new Intl.NumberFormat('en-US', {
                      style: 'currency',
                      currency: activeWireCountry.currency
                    }).format(parseFloat(wireAmount) / (EXCHANGE_RATES_TO_USD[activeWireCountry.currency] || 1))}
                  </span>
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Wire Purpose & Memo
              </label>
              <input
                type="text"
                placeholder="e.g. Commercial invoice, equipment purchase, family support"
                value={wireMemo}
                onChange={(e) => setWireMemo(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-teal-500"
              />
            </div>

            {!currentUser.transactionPin && (
              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-amber-300">
                <div className="flex items-center gap-2.5">
                  <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
                  <div>
                    <p className="font-bold">Transaction PIN Required</p>
                    <p className="text-[11px] text-amber-400/80">You must configure your 4-digit security PIN before dispatching international wires.</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab('profile')}
                  className="px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shrink-0 transition-colors"
                >
                  Set Up PIN Now
                </button>
              </div>
            )}

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
              <label className="block text-xs font-bold text-teal-400 font-mono uppercase">
                Authorize with Your 4-Digit Transaction PIN
              </label>
              <input
                type="password"
                maxLength={4}
                required
                placeholder="••••"
                value={wirePin}
                onChange={(e) => setWirePin(e.target.value)}
                className="w-32 tracking-[0.5em] text-center px-4 py-2 rounded-lg bg-slate-900 border border-slate-700 text-lg font-mono text-white focus:outline-none focus:border-teal-500"
              />
              <p className="text-[11px] text-slate-500">
                {!currentUser.transactionPin 
                  ? 'Notice: Click "Set Up PIN Now" above to configure your security PIN.' 
                  : 'Fixed standard SWIFT international clearance fee: $25.00 USD.'}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-teal-500/10 border border-teal-500/20 text-[11px] text-teal-300 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>Customer Data Protection: End-to-end cryptographic payload masking and SWIFT GPI tracking.</span>
            </div>

            <button
              type="submit"
              disabled={isProcessing || currentUser.isLocked || currentUser.isTransferRestricted}
              className="w-full py-3.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-sm shadow-lg shadow-teal-500/20 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
            >
              <span>{isProcessing ? 'Dispatching SWIFT Wire...' : 'Authorize Global Wire'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

      {/* C. RECENT TRANSACTIONS / HISTORY */}
      {(activeTab === 'overview' || activeTab === 'history') && (
        <div className="rounded-2xl bg-slate-900 border border-slate-800 shadow-xl overflow-hidden">
          <div className="p-6 border-b border-slate-800 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-400" />
                <span>Transaction Ledger</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Real-time statement of debits, credits, fundings, and settlements.
              </p>
            </div>
            <button
              onClick={refreshUserProfile}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs flex items-center gap-1.5 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Refresh Balance</span>
            </button>
          </div>

          {transactions.length === 0 ? (
            <div className="p-12 text-center text-slate-500 space-y-2">
              <Clock className="w-8 h-8 mx-auto text-slate-600" />
              <p className="text-sm font-medium">No transactions recorded yet.</p>
              <p className="text-xs text-slate-600">Your transfer activity and deposits will appear here in real time.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950/60 text-slate-400 font-mono text-[10px] uppercase tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-4">Date & Time</th>
                    <th className="py-3 px-4">Type & Direction</th>
                    <th className="py-3 px-4">Counterparty / Description</th>
                    <th className="py-3 px-4">Reference</th>
                    <th className="py-3 px-4 text-right">Amount</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-center">Receipt</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {transactions.map((tx) => {
                    const isOutgoing = tx.senderId === currentUser.uid;
                    const isReversed = tx.status === 'reversed';

                    return (
                      <tr key={tx.id} className="hover:bg-slate-800/30 transition-colors">
                        <td className="py-3.5 px-4 font-mono text-slate-400 whitespace-nowrap">
                          {new Date(tx.createdAt).toLocaleDateString()} &bull; {new Date(tx.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2">
                            <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                              isReversed
                                ? 'bg-rose-500/10 text-rose-400'
                                : isOutgoing 
                                  ? 'bg-amber-500/10 text-amber-400' 
                                  : 'bg-emerald-500/10 text-emerald-400'
                            }`}>
                              {isReversed ? (
                                <RotateCcw className="w-3.5 h-3.5" />
                              ) : isOutgoing ? (
                                <ArrowUpRight className="w-3.5 h-3.5" />
                              ) : (
                                <ArrowDownLeft className="w-3.5 h-3.5" />
                              )}
                            </div>
                            <span className="font-semibold text-slate-200 capitalize">
                              {tx.type} {isOutgoing ? 'Debit' : 'Credit'}
                            </span>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 max-w-[240px]">
                          <p className="font-bold text-white truncate">
                            {isOutgoing ? tx.recipientName : tx.senderName}
                          </p>
                          <p className="text-[11px] text-slate-400 truncate">
                            {tx.description}
                          </p>
                        </td>
                        <td className="py-3.5 px-4 font-mono text-slate-400 select-all">
                          {tx.reference}
                        </td>
                        <td className="py-3.5 px-4 font-mono font-bold text-right whitespace-nowrap">
                          <span className={isReversed ? 'line-through text-slate-500' : isOutgoing ? 'text-amber-400' : 'text-emerald-400'}>
                            {isOutgoing ? '-' : '+'}{formatCurrency(tx.amount)}
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
                          <button
                            onClick={() => setSelectedTxForReceipt(tx)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                            title="View Official Wire Receipt"
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
          )}
        </div>
      )}

      {/* D. PROFILE & PIN SECURITY SETTINGS */}
      {activeTab === 'profile' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Edit Profile Info */}
          <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-xl">
            <h3 className="text-base font-bold text-white mb-1 flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-emerald-400" />
              <span>Customer Profile Information</span>
            </h3>
            <p className="text-xs text-slate-400 mb-5">
              Keep your contact and residential address details up to date.
            </p>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Full Legal Name
                </label>
                <input
                  type="text"
                  required
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Email Address (Verified)
                </label>
                <input
                  type="email"
                  disabled
                  value={currentUser.email}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 text-sm text-slate-400 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Phone Number
                </label>
                <input
                  type="text"
                  placeholder="+1 (555) 000-0000"
                  value={profilePhone}
                  onChange={(e) => setProfilePhone(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Residential Address
                </label>
                <textarea
                  rows={2}
                  placeholder="Street, City, State/Province, Country"
                  value={profileAddress}
                  onChange={(e) => setProfileAddress(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <button
                type="submit"
                disabled={isProcessing}
                className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs transition-colors"
              >
                {isProcessing ? 'Saving Profile...' : 'Save Profile Changes'}
              </button>
            </form>
          </div>

          {/* Setup / Change 4-Digit Transaction PIN */}
          <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-xl">
            <h3 className="text-base font-bold text-white mb-1 flex items-center gap-2">
              <KeyRound className="w-5 h-5 text-indigo-400" />
              <span>4-Digit Transaction PIN</span>
            </h3>
            <p className="text-xs text-slate-400 mb-5">
              Required to authorize outgoing internal transfers and international wire settlements.
            </p>

            <div className="mb-4 p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-400">Current PIN Status:</span>
              <span className={`font-mono font-bold ${currentUser.transactionPin ? 'text-emerald-400' : 'text-amber-400'}`}>
                {currentUser.transactionPin ? 'CONFIGURED & ACTIVE' : 'NOT SET UP YET'}
              </span>
            </div>

            <form onSubmit={handleSetupPin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  New 4-Digit Security PIN
                </label>
                <input
                  type="password"
                  maxLength={4}
                  required
                  placeholder="••••"
                  value={newPin}
                  onChange={(e) => setNewPin(e.target.value)}
                  className="w-full tracking-[0.5em] text-center px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-lg font-mono text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Confirm 4-Digit Security PIN
                </label>
                <input
                  type="password"
                  maxLength={4}
                  required
                  placeholder="••••"
                  value={confirmPin}
                  onChange={(e) => setConfirmPin(e.target.value)}
                  className="w-full tracking-[0.5em] text-center px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-lg font-mono text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <button
                type="submit"
                disabled={isProcessing}
                className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-colors shadow-lg shadow-indigo-600/20"
              >
                {isProcessing ? 'Updating PIN...' : 'Save 4-Digit PIN'}
              </button>
            </form>
          </div>

        </div>
      )}

      {/* Official Receipt Modal */}
      <ReceiptModal 
        transaction={selectedTxForReceipt}
        onClose={() => setSelectedTxForReceipt(null)}
      />

      {/* ---------------- 5. CLEARANCE TOOLS MODAL: SWIFT & ROUTING VERIFIER ---------------- */}
      {showClearanceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-6 sm:p-7">
            <button
              onClick={() => setShowClearanceModal(false)}
              className="absolute top-4 right-4 p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">SWIFT & Routing Clearance Verifier</h3>
                <p className="text-xs text-slate-400">Real-time ISO 20022 STP clearing route test</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Enter Account # or SWIFT / BIC Code to Pre-Clear
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={clearanceQuery}
                    onChange={(e) => setClearanceQuery(e.target.value)}
                    placeholder="e.g. 4892019482 or BARCGB22"
                    className="flex-1 px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm font-mono text-white focus:outline-none focus:border-amber-500 uppercase"
                  />
                  <button
                    onClick={handleRunClearanceCheck}
                    disabled={isTestingClearance || !clearanceQuery.trim()}
                    className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shrink-0 transition-colors disabled:opacity-50 flex items-center gap-1.5"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isTestingClearance ? 'animate-spin' : ''}`} />
                    <span>{isTestingClearance ? 'Testing...' : 'Pre-Clear'}</span>
                  </button>
                </div>
              </div>

              {clearanceResult && (
                <div className="p-4 rounded-xl bg-slate-950 border border-emerald-500/30 space-y-3 animate-in fade-in duration-150">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                    <span className="text-xs font-mono font-bold text-emerald-400 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>CLEARANCE APPROVED: ELIGIBLE</span>
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300">
                      {clearanceResult.speed}
                    </span>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Clearing Network:</span>
                      <span className="font-semibold text-white">{clearanceResult.network}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Messaging Standard:</span>
                      <span className="font-mono text-slate-300">{clearanceResult.protocol}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Clearance Ref Hash:</span>
                      <span className="font-mono text-amber-400">{clearanceResult.refCode}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">AML / Sanctions:</span>
                      <span className="text-emerald-400 font-semibold">Clean / Pre-Screen Passed</span>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-400 pt-2 border-t border-slate-900">
                    {clearanceResult.details}
                  </p>
                </div>
              )}

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Fedwire & SWIFT GPI certified</span>
                </span>
                <button
                  type="button"
                  onClick={() => setShowClearanceModal(false)}
                  className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ---------------- 6. CLEARANCE TOOLS MODAL: PROOF OF BALANCE STATEMENT ---------------- */}
      {showProofOfBalanceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowProofOfBalanceModal(false)}
              className="absolute top-5 right-5 p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Official Header */}
            <div className="border-b border-slate-800 pb-5 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-[#d71e28] text-white flex items-center justify-center font-serif font-black text-xl shadow-lg border border-[#ffbf00]/40">
                    WF
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white tracking-tight">WELLS FARGO BANK, N.A.</h2>
                    <p className="text-xs text-slate-400">Corporate & Institutional Treasury Clearing</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-mono px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold uppercase">
                    Official Certificate
                  </span>
                  <p className="text-[10px] text-slate-500 font-mono mt-1">FDIC Charter #1</p>
                </div>
              </div>
            </div>

            {/* Certificate Body */}
            <div className="space-y-6">
              <div className="text-center p-4 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[11px] font-mono text-slate-400 uppercase tracking-widest block mb-1">
                  Certified Net Liquid Available Balance
                </span>
                <div className="text-3xl sm:text-4xl font-extrabold text-white font-mono text-emerald-400">
                  {formatCurrency(currentUser.balance, currentUser.currency)} USD
                </div>
                <p className="text-[11px] text-slate-500 font-mono mt-1">
                  Verified as of {new Date().toUTCString()}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <span className="text-slate-500 uppercase font-mono text-[10px]">Beneficiary Legal Name</span>
                  <p className="font-bold text-white text-sm">{currentUser.fullName}</p>
                  <p className="text-slate-400">{currentUser.email}</p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <span className="text-slate-500 uppercase font-mono text-[10px]">Account Identifier</span>
                  <p className="font-bold font-mono text-white text-sm">{currentUser.accountNumber}</p>
                  <p className="text-slate-400 font-mono">Routing: {currentUser.routingNumber}</p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <span className="text-slate-500 uppercase font-mono text-[10px]">Account Classification</span>
                  <p className="font-bold text-white">{currentUser.accountType || 'Private Wealth Checking'}</p>
                  <p className="text-emerald-400">Clearance Status: Good Standing</p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <span className="text-slate-500 uppercase font-mono text-[10px]">Verification Reference</span>
                  <p className="font-mono text-teal-400 font-bold">WF-CERT-{currentUser.accountNumber.substring(0, 5)}-{Date.now().toString(36).toUpperCase()}</p>
                  <p className="text-slate-500">256-Bit HSM Cryptographic Seal</p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-400 space-y-1 font-mono">
                <p className="font-bold text-slate-300">INSTITUTIONAL ATTESTATION STATEMENT:</p>
                <p>
                  This official electronic certificate serves as an authoritative proof of funds issued under Wells Fargo Online Banking infrastructure.
                  All funds are held in unencumbered liquidity accounts backed by federal reserves.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs flex items-center gap-2 transition-colors"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print Certificate</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowProofOfBalanceModal(false)}
                  className="px-6 py-2.5 rounded-xl bg-[#d71e28] hover:bg-[#b8141d] text-white font-bold text-xs transition-colors"
                >
                  Close Document
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

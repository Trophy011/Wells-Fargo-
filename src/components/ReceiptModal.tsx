import React from 'react';
import { 
  X, 
  Printer, 
  Download, 
  CheckCircle2, 
  ShieldCheck, 
  Building2, 
  ArrowUpRight, 
  ArrowDownLeft,
  RotateCcw
} from 'lucide-react';
import { BankTransaction } from '../types/banking.ts';
import { formatCurrency } from '../services/bankingService.ts';

interface ReceiptModalProps {
  transaction: BankTransaction | null;
  onClose: () => void;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({ transaction, onClose }) => {
  if (!transaction) return null;

  const handlePrint = () => {
    window.print();
  };

  const isReversed = transaction.status === 'reversed';
  const isIncoming = transaction.type === 'funding';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-6 sm:p-8 overflow-hidden">
        
        {/* Top actions */}
        <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-800 print:hidden">
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Slip</span>
            </button>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Printable Official Wire Voucher */}
        <div className="space-y-6 text-slate-100">
          
          {/* Header watermark & logo */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-slate-900 p-0.5 flex items-center justify-center">
                <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-emerald-400" />
                </div>
              </div>
              <div>
                <h3 className="font-bold text-lg tracking-tight text-white font-serif">WELLS FARGO ONLINE BANKING</h3>
                <p className="text-[10px] text-slate-400 font-mono">OFFICIAL TRANSACTION SETTLEMENT ADVICE</p>
              </div>
            </div>

            {/* Status Stamp */}
            <div className={`px-2.5 py-1 rounded-md text-xs font-bold font-mono uppercase tracking-wider border ${
              isReversed 
                ? 'bg-rose-500/10 border-rose-500/30 text-rose-400' 
                : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
            }`}>
              {isReversed ? 'REVERSED' : 'SETTLED & CONFIRMED'}
            </div>
          </div>

          {/* Amount Badge */}
          <div className="p-5 rounded-xl bg-slate-950 border border-slate-800/80 text-center">
            <p className="text-xs text-slate-400 font-mono uppercase tracking-widest mb-1">
              {transaction.type.toUpperCase()} WIRE AMOUNT
            </p>
            <div className="text-3xl sm:text-4xl font-extrabold text-white font-mono tracking-tight">
              {formatCurrency(transaction.amount)}
            </div>
            {transaction.fee > 0 && (
              <p className="text-xs text-slate-500 mt-1 font-mono">
                + {formatCurrency(transaction.fee)} SWIFT clearance fee
              </p>
            )}
          </div>

          {/* Details Table */}
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="space-y-1">
              <span className="text-slate-500 font-mono uppercase text-[10px]">Reference Number</span>
              <p className="font-mono font-semibold text-slate-200 select-all">{transaction.reference}</p>
            </div>
            <div className="space-y-1">
              <span className="text-slate-500 font-mono uppercase text-[10px]">Timestamp (UTC)</span>
              <p className="font-mono text-slate-200">
                {new Date(transaction.createdAt).toLocaleString('en-US', { timeZoneName: 'short' })}
              </p>
            </div>

            <div className="space-y-1 col-span-2 sm:col-span-1 pt-2 border-t border-slate-800/60">
              <span className="text-slate-500 font-mono uppercase text-[10px]">Originating Party (Sender)</span>
              <p className="font-semibold text-white">{transaction.senderName}</p>
              <p className="text-[11px] font-mono text-slate-400">ACCT: {transaction.senderAccount}</p>
            </div>

            <div className="space-y-1 col-span-2 sm:col-span-1 pt-2 border-t border-slate-800/60">
              <span className="text-slate-500 font-mono uppercase text-[10px]">Beneficiary (Recipient)</span>
              <p className="font-semibold text-white">{transaction.recipientName}</p>
              <p className="text-[11px] font-mono text-slate-400">ACCT/IBAN: {transaction.recipientAccount}</p>
            </div>

            {transaction.recipientBank && (
              <div className="space-y-1 col-span-2 pt-2 border-t border-slate-800/60">
                <span className="text-slate-500 font-mono uppercase text-[10px]">Destination Bank & Routing</span>
                <p className="font-semibold text-white">{transaction.recipientBank}</p>
                <p className="text-[11px] font-mono text-emerald-400">
                  {transaction.recipientCountry} &bull; SWIFT: {transaction.swiftCode || 'WFBIUS6S'}
                </p>
              </div>
            )}

            <div className="space-y-1 col-span-2 pt-2 border-t border-slate-800/60">
              <span className="text-slate-500 font-mono uppercase text-[10px]">Purpose / Memo</span>
              <p className="text-slate-300 italic">{transaction.description || 'N/A'}</p>
            </div>

            {isReversed && (
              <div className="col-span-2 p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 space-y-1">
                <div className="flex items-center gap-1.5 font-bold">
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>TRANSACTION REVERSED BY BANK OPERATOR</span>
                </div>
                <p className="text-[11px]">Reason: {transaction.reversalReason || 'Operator Administrative Adjustment'}</p>
                <p className="text-[10px] font-mono text-rose-400/80">
                  Reversed at: {transaction.reversedAt ? new Date(transaction.reversedAt).toLocaleString() : 'N/A'} by {transaction.reversedBy}
                </p>
              </div>
            )}
          </div>

          {/* Footer Security Seal */}
          <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-500 font-mono">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>CRYPTOGRAPHICALLY SIGNED VOUCHER</span>
            </div>
            <span>WELLS FARGO FEDWIRE NETWORK</span>
          </div>

        </div>

      </div>
    </div>
  );
};

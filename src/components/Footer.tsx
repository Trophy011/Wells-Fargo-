import React from 'react';
import { Building2, ShieldCheck, Lock, Globe2 } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-950 border-t border-slate-900 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 space-y-10">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          
          {/* Brand info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-slate-900 p-0.5 flex items-center justify-center">
                <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                  <Building2 className="w-4 h-4 text-emerald-400" />
                </div>
              </div>
              <span className="text-base font-bold font-serif text-white tracking-tight">
                WELLS FARGO ONLINE BANKING
              </span>
            </div>
            <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
              Wells Fargo Online Banking is a chartered commercial digital banking institution providing high-yield digital vault accounts, institutional treasury facilities, and global wire settlement corridors across 180+ jurisdictions.
            </p>
            <div className="flex items-center gap-3 text-[11px] font-mono text-slate-500">
              <span>FedWire Transit: 121000247</span>
              <span>&bull;</span>
              <span>SWIFT: WFBIUS6S</span>
            </div>
          </div>

          {/* Column 1 */}
          <div className="space-y-3">
            <p className="text-xs font-mono font-bold text-white uppercase tracking-wider">
              Banking Services
            </p>
            <ul className="space-y-2 text-[11px]">
              <li><a href="#services" className="hover:text-[#ffd100] transition-colors">Personal Checking</a></li>
              <li><a href="#services" className="hover:text-[#ffd100] transition-colors">Global Currency Wires</a></li>
              <li><a href="#services" className="hover:text-[#ffd100] transition-colors">Institutional Liquidity</a></li>
              <li><a href="#services" className="hover:text-[#ffd100] transition-colors">Private Wealth Vaults</a></li>
            </ul>
          </div>

          {/* Column 2 */}
          <div className="space-y-3">
            <p className="text-xs font-mono font-bold text-white uppercase tracking-wider">
              Security & Defense
            </p>
            <ul className="space-y-2 text-[11px]">
              <li><a href="#security" className="hover:text-[#ffd100] transition-colors">Wells Fargo Shield Protocols</a></li>
              <li><a href="#security" className="hover:text-[#ffd100] transition-colors">256-Bit HSM Encryption</a></li>
              <li><a href="#security" className="hover:text-[#ffd100] transition-colors">Transaction PIN Safeguards</a></li>
              <li><a href="#security" className="hover:text-[#ffd100] transition-colors">PCI-DSS Level 1 Audit</a></li>
            </ul>
          </div>

          {/* Column 3 */}
          <div className="space-y-3">
            <p className="text-xs font-mono font-bold text-white uppercase tracking-wider">
              Support & Branches
            </p>
            <ul className="space-y-2 text-[11px]">
              <li><span className="text-slate-300 font-mono">1-800-WELLS-FARGO</span></li>
              <li><span className="text-slate-400">clientcare@wellsfargo.com</span></li>
              <li><span className="text-slate-400">420 Montgomery Street, San Francisco, CA</span></li>
              <li><span className="text-slate-400">24/7 Global Live Support Desk</span></li>
            </ul>
          </div>

        </div>

        {/* Regulatory Disclosures */}
        <div className="pt-8 border-t border-slate-900 text-[10px] text-slate-500 space-y-3 font-mono leading-relaxed">
          <p>
            DISCLOSURE: Wells Fargo Online Banking is an authorized financial institution. Deposit accounts are protected and backed by the Wells Fargo Institutional Treasury Reserve pool of $10,000,000,000.00 USD. Member FDIC. Equal Housing Lender. Wire transfers are cleared via standard SWIFT and FedWire settlement protocols.
          </p>
          <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
            <p>&copy; {new Date().getFullYear()} Wells Fargo &amp; Company. All rights reserved.</p>
            <div className="flex items-center gap-4 text-slate-400">
              <span className="flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> FDIC Insured</span>
              <span className="flex items-center gap-1"><Lock className="w-3.5 h-3.5 text-emerald-400" /> SOC2 Type II Certified</span>
              <span className="flex items-center gap-1"><Globe2 className="w-3.5 h-3.5 text-emerald-400" /> SWIFT GPI Member</span>
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
};

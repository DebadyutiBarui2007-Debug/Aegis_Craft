import React, { useEffect, useState } from 'react';
import { User, WorkerProfile, ServiceCategory, JobRequest, BidOffer, ChatMessage } from './types/index.ts';
import { api, tokenStorage } from './services/api.ts';
import { formatInr } from './lib/biddingEngine.ts';
import { Header } from './components/Header.tsx';
import { ServiceDiscoveryView } from './components/ServiceDiscoveryView.tsx';
import { RadarMatchingView } from './components/RadarMatchingView.tsx';
import { LiveBiddingView } from './components/LiveBiddingView.tsx';
import { ActiveJobTrackingView } from './components/ActiveJobTrackingView.tsx';
import { WorkerTerminalView } from './components/WorkerTerminalView.tsx';
import { McpStudioView } from './components/McpStudioView.tsx';
import { SosModal } from './components/SosModal.tsx';
import { AddressModal } from './components/AddressModal.tsx';
import { ReviewModal } from './components/ReviewModal.tsx';
import { SplashLaunchScreen } from './components/SplashLaunchScreen.tsx';
import { AuthModal } from './components/AuthModal.tsx';
import { FallingGlitterBackground } from './components/FallingGlitterBackground.tsx';

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [hasUserAccount, setHasUserAccount] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Default initial state is null until user creates/authenticates their account
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const defaultLocation = {
    lat: 12.9784,
    lng: 77.6408,
    address: '742 12th Main Road, HAL 2nd Stage, Indiranagar, Bengaluru, Karnataka 560038',
    city: 'Bengaluru',
    pincode: '560038',
    sector: 'Indiranagar Sector 4',
  };

  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [workers, setWorkers] = useState<WorkerProfile[]>([]);
  const [activeJob, setActiveJob] = useState<JobRequest | null>(null);
  const [bids, setBids] = useState<BidOffer[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [activeTab, setActiveTab] = useState<string>('discovery');

  // Modals state
  const [isSosOpen, setIsSosOpen] = useState(false);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  // Toast notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // 1. Initial Data Fetch
  useEffect(() => {
    const initData = async () => {
      try {
        const [meRes, catRes, workersRes, jobsRes] = await Promise.all([
          api.getMe(),
          api.getCategories(),
          api.getNearbyWorkers(12.9784, 77.6408, 3.2),
          api.getJobs(),
        ]);

        if (meRes.user) {
          setCurrentUser(meRes.user);
          setHasUserAccount(true);
          if (meRes.user.role === 'worker_pro') {
            setActiveTab('worker');
          } else {
            setActiveTab('discovery');
          }
        }
        setCategories(catRes.categories);
        setWorkers(workersRes.workers);

        if (jobsRes.jobs.length > 0) {
          const current = jobsRes.jobs[0];
          setActiveJob(current);

          const [bidsRes, msgsRes] = await Promise.all([
            api.getBids(current.id),
            api.getMessages(current.id),
          ]);
          setBids(bidsRes.bids);
          setMessages(msgsRes.messages);
        }
      } catch (err) {
        console.error('Failed to load initial data:', err);
      }
    };

    initData();
  }, []);

  // 2. Real-Time Server-Sent Events (SSE) Stream
  useEffect(() => {
    const unsubscribe = api.subscribeEvents((event) => {
      if (event.type === 'job:created') {
        setActiveJob(event.data);
        showToast(`New Job created: ${event.data.title}`);
      } else if (event.type === 'bid:created') {
        setBids((prev) => [...prev, event.data]);
        showToast(`New Counteroffer received: ${formatInr(event.data.proposedAmount)}`);
      } else if (event.type === 'bid:accepted') {
        setActiveJob(event.data.job);
        showToast(`Agreement locked at ${formatInr(event.data.bid.proposedAmount)}! INR Escrow secured.`);
      } else if (event.type === 'job:updated') {
        setActiveJob(event.data);
      } else if (event.type === 'message:created') {
        setMessages((prev) => [...prev, event.data]);
      } else if (event.type === 'sos:triggered') {
        showToast('EMERGENCY 112 SOS: Platform intervention broadcasted to 48 certified units in Bengaluru.');
      }
    });

    return () => unsubscribe();
  }, []);

  // 3. Splash completion handler
  const handleSplashComplete = () => {
    setShowSplash(false);
    // As soon as splash finishes, open the mandatory Account Creation popup if no user account exists yet
    if (!hasUserAccount) {
      setIsAuthModalOpen(true);
    }
  };

  // Tab Navigation Guard
  const handleTabChange = (targetTab: string) => {
    if (currentUser) {
      if (currentUser.role === 'customer' && targetTab === 'worker') {
        showToast('This area is available to worker accounts. Please log out and sign in with your worker account.');
        return;
      }
      if (
        currentUser.role === 'worker_pro' &&
        (targetTab === 'discovery' || targetTab === 'radar' || targetTab === 'bidding')
      ) {
        showToast('This area is available to customer accounts. Please log out and sign in with your customer account.');
        return;
      }
    }
    setActiveTab(targetTab);
  };

  const handleUpdateAddress = (newAddress: string) => {
    if (currentUser) {
      setCurrentUser((prev) =>
        prev
          ? {
              ...prev,
              location: { ...prev.location, address: newAddress },
            }
          : null
      );
    }
    showToast(`Service location updated to: ${newAddress}`);
  };

  const handleExecuteDispatchSearch = async (
    category: string,
    urgency: 'standard' | 'emergency',
    summary: string
  ) => {
    try {
      const res = await api.createJob({
        tradeCategory: category,
        urgency,
        situationSummary: summary || 'Emergency inspection requested via Fast Dispatch Terminal.',
        location: currentUser?.location || defaultLocation,
      });
      setActiveJob(res.job);
      setActiveTab('radar');
      showToast('PostGIS Proximity Search executed! Showing verified nearby technicians in Bengaluru.');
    } catch (e: any) {
      showToast(e.message);
    }
  };

  const handleSelectWorkerForBid = async (worker: WorkerProfile, initialRate: number) => {
    if (!activeJob) return;
    try {
      await api.submitBid(activeJob.id, {
        proposedAmount: initialRate,
        proposingParty: 'CUSTOMER',
        scopeNotes: `Direct dispatch proposal to ${worker.name} for ${activeJob.tradeCategory} diagnostics.`,
        workerId: worker.id,
      });
      setActiveTab('bidding');
      showToast(`Dispatch proposal transmitted to ${worker.name}. Opening live bidding room.`);
    } catch (e: any) {
      showToast(e.message);
    }
  };

  const handleSubmitCounter = async (proposedAmount: number, scopeNotes?: string) => {
    if (!activeJob) return;
    try {
      await api.submitBid(activeJob.id, {
        proposedAmount,
        proposingParty: currentUser?.role === 'worker_pro' ? 'WORKER' : 'CUSTOMER',
        scopeNotes,
      });
    } catch (e: any) {
      showToast(e.message);
    }
  };

  const handleAcceptOffer = async (bidId: string) => {
    if (!activeJob) return;
    try {
      const res = await api.acceptBid(activeJob.id, bidId);
      setActiveJob(res.job);
      showToast(res.message);
    } catch (e: any) {
      showToast(e.message);
    }
  };

  const handleAdvancePhase = async (phase: number) => {
    if (!activeJob) return;
    try {
      const res = await api.updateJobPhase(activeJob.id, phase);
      setActiveJob(res.job);
      showToast(`Workflow advanced to Phase ${phase}. Telemetry synchronized.`);
    } catch (e: any) {
      showToast(e.message);
    }
  };

  const handleSendMessage = async (content: string) => {
    if (!activeJob) return;
    try {
      await api.sendMessage(activeJob.id, {
        senderRole: currentUser?.role || 'customer',
        content,
      });
    } catch (e: any) {
      showToast(e.message);
    }
  };

  const handleLogout = async () => {
    try {
      await api.logout();
    } catch (err: any) {
      console.warn('Logout request completed:', err);
    } finally {
      setCurrentUser(null);
      setHasUserAccount(false);
      setActiveTab('discovery');
      showToast('Logged out successfully. Session and credentials cleared.');
      setIsAuthModalOpen(true);
    }
  };

  const showAuthModal = isAuthModalOpen || (!currentUser && !hasUserAccount);

  return (
    <div className="bg-[#0b1326] font-body-default text-[#dae2fd] relative min-h-screen selection:bg-[#89ceff] selection:text-[#00344d] overflow-x-hidden">
      {/* Launch Splash Screen - Aperture Shutter Reveal */}
      {showSplash && <SplashLaunchScreen onComplete={handleSplashComplete} />}

      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed top-24 right-6 z-50 bg-[#171f33] border border-[#4edea3]/40 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-fade-in">
          <span className="w-2 h-2 rounded-full bg-[#4edea3] animate-ping"></span>
          <span className="text-xs font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Falling Stars & Champagne-Gold Glitter Animated Background (Main interface only) */}
      {!showSplash && !showAuthModal && <FallingGlitterBackground />}

      {/* Main Header with Integrated Horizontal Scrolling Marquee */}
      {!showSplash && (
        <Header
          currentUser={currentUser}
          activeTab={activeTab}
          setActiveTab={handleTabChange}
          onOpenSos={() => setIsSosOpen(true)}
          onOpenAuth={() => setIsAuthModalOpen(true)}
          onLogout={handleLogout}
          showMarquee={!showAuthModal}
        />
      )}

      {/* Main Application Content Body */}
      <main className="relative z-10 w-full pt-28 md:pt-32 min-h-[calc(100vh-5rem)]">
        {/* Customer Access Denial Fallback Banner */}
        {currentUser?.role === 'customer' && activeTab === 'worker' && (
          <div className="max-w-2xl mx-auto my-12 p-8 rounded-2xl bg-[#171f33] border border-amber-500/30 text-center space-y-4">
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-400 mx-auto flex items-center justify-center">
              <span className="material-symbols-outlined text-2xl">lock</span>
            </div>
            <h3 className="text-lg font-bold text-white">Worker Pro Area Restricted</h3>
            <p className="text-xs text-[#bec8d2]">
              This area is available to worker accounts. Please log out and sign in with your worker account to continue.
            </p>
            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold text-xs uppercase tracking-wider cursor-pointer"
            >
              Log Out &amp; Switch Account
            </button>
          </div>
        )}

        {/* Worker Access Denial Fallback Banner */}
        {currentUser?.role === 'worker_pro' && (activeTab === 'discovery' || activeTab === 'radar' || activeTab === 'bidding') && (
          <div className="max-w-2xl mx-auto my-12 p-8 rounded-2xl bg-[#171f33] border border-emerald-500/30 text-center space-y-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center">
              <span className="material-symbols-outlined text-2xl">lock</span>
            </div>
            <h3 className="text-lg font-bold text-white">Customer Area Restricted</h3>
            <p className="text-xs text-[#bec8d2]">
              This area is available to customer accounts. Please log out and sign in with your customer account to continue.
            </p>
            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold text-xs uppercase tracking-wider cursor-pointer"
            >
              Log Out &amp; Switch Account
            </button>
          </div>
        )}

        {/* Customer Interface Views (Active if Customer or guest before account creation) */}
        {(!currentUser || currentUser.role === 'customer') && (
          <>
            {activeTab === 'discovery' && (
              <ServiceDiscoveryView
                categories={categories}
                currentAddress={currentUser?.location.address || defaultLocation.address}
                onOpenEditAddress={() => setIsAddressModalOpen(true)}
                onOpenSos={() => setIsSosOpen(true)}
                onSelectCategory={() => handleTabChange('radar')}
                onExecuteDispatchSearch={handleExecuteDispatchSearch}
                onNavigateToTracking={() => handleTabChange('tracking')}
              />
            )}

            {activeTab === 'radar' && (
              <RadarMatchingView
                workers={workers}
                onSelectWorkerForBid={handleSelectWorkerForBid}
                onOpenSos={() => setIsSosOpen(true)}
              />
            )}

            {activeTab === 'bidding' && activeJob && (
              <LiveBiddingView
                job={activeJob}
                bids={bids}
                onSubmitCounter={handleSubmitCounter}
                onAcceptOffer={handleAcceptOffer}
                onNavigateToTracking={() => handleTabChange('tracking')}
              />
            )}
          </>
        )}

        {/* Worker Pro Interface View (Active ONLY if logged in as Worker Pro) */}
        {currentUser?.role === 'worker_pro' && activeTab === 'worker' && activeJob && (
          <WorkerTerminalView
            job={activeJob}
            bids={bids}
            messages={messages}
            onSubmitCounter={handleSubmitCounter}
            onAdvancePhase={handleAdvancePhase}
            onSendMessage={handleSendMessage}
            onOpenSos={() => setIsSosOpen(true)}
            onOpenReviewModal={() => setIsReviewModalOpen(true)}
          />
        )}

        {/* Common Views (Tracking & MCP Studio) */}
        {activeTab === 'tracking' && activeJob && (
          <ActiveJobTrackingView
            job={activeJob}
            messages={messages}
            onSendMessage={handleSendMessage}
            onAdvancePhase={handleAdvancePhase}
            onOpenSos={() => setIsSosOpen(true)}
            onOpenReviewModal={() => setIsReviewModalOpen(true)}
          />
        )}

        {activeTab === 'mcp' && <McpStudioView />}
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full bg-[#060e20] py-8 border-t border-white/5">
        <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-12 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#4edea3] text-xl">shield</span>
            <span className="text-sm font-bold text-white">AegisCraft Bharat Dispatch Infrastructure</span>
          </div>
          <p className="text-xs text-[#88929b]">
            © 2026 AegisCraft Network. Real-Time Blue-Collar Bidding, PostGIS Geolocation &amp; Verified INR Escrow Operations.
          </p>
          <div className="flex items-center gap-4 text-xs text-[#bec8d2]">
            <button onClick={() => showToast('AegisCraft Security: 256-bit encryption & dual KYC validation.')} className="hover:text-white cursor-pointer">
              Security Protocols
            </button>
            <button onClick={() => showToast('Escrow Guarantee: Zero fee escrow vault backed by ₹25,000 30-day warranty.')} className="hover:text-white cursor-pointer">
              ₹ Escrow Guarantee
            </button>
            <button
              onClick={() => {
                if (currentUser?.role === 'customer') {
                  showToast('To access the Technician Portal, please log out and sign in with a worker account.');
                } else if (!currentUser) {
                  setIsAuthModalOpen(true);
                } else {
                  handleTabChange('worker');
                }
              }}
              className="text-[#4edea3] hover:underline font-semibold cursor-pointer"
            >
              Technician Portal
            </button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <SosModal
        isOpen={isSosOpen}
        onClose={() => setIsSosOpen(false)}
        activeJobId={activeJob?.id}
      />

      <AddressModal
        isOpen={isAddressModalOpen}
        onClose={() => setIsAddressModalOpen(false)}
        currentAddress={currentUser?.location.address || defaultLocation.address}
        onSaveAddress={handleUpdateAddress}
      />

      {/* Mandatory Account Creation & Authentication Modal Overlay at Startup */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => {
          if (hasUserAccount) {
            setIsAuthModalOpen(false);
          } else {
            showToast('Please create an account or select a demo profile to enter AegisCraft.');
          }
        }}
        onSuccess={(user) => {
          setCurrentUser(user);
          setHasUserAccount(true);
          setIsAuthModalOpen(false);
          showToast(`Account Created & Authenticated! Welcome, ${user.name}`);
          if (user.role === 'worker_pro') {
            setActiveTab('worker');
          } else {
            setActiveTab('discovery');
          }
        }}
        defaultRole={currentUser?.role || 'customer'}
      />

      {activeJob && (
        <ReviewModal
          isOpen={isReviewModalOpen}
          onClose={() => setIsReviewModalOpen(false)}
          jobId={activeJob.id}
          technicianName={activeJob.assignedWorker?.name || 'Rajesh Sharma'}
          agreedAmount={activeJob.agreedAmount}
          onCompletionSuccess={() => {
            showToast('INR Escrow released! Reciprocal 5-star ratings permanently registered.');
            setActiveTab(currentUser?.role === 'worker_pro' ? 'worker' : 'discovery');
          }}
        />
      )}
    </div>
  );
}

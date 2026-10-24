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

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const [currentUser, setCurrentUser] = useState<User>({
    id: 'user-aditi-roy',
    name: 'Aditi Roy',
    email: 'aditi.roy@example.in',
    role: 'customer',
    phone: '+91 98450 12345',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
    rating: 5.0,
    completedJobsCount: 14,
    location: {
      lat: 12.9784,
      lng: 77.6408,
      address: '742 12th Main Road, HAL 2nd Stage, Indiranagar, Bengaluru, Karnataka 560038',
      city: 'Bengaluru',
      pincode: '560038',
      sector: 'Indiranagar Sector 4',
    },
  });

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
          if (meRes.user.role === 'worker_pro') {
            setActiveTab('worker');
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

  // Handlers
  const handleRoleSwitch = async (role: 'customer' | 'worker_pro') => {
    try {
      const res = await api.setRole(role);
      setCurrentUser(res.user);
      if (role === 'worker_pro') {
        setActiveTab('worker');
        showToast('Switched to Worker Pro Terminal (Rajesh Sharma - Master Electrician)');
      } else {
        setActiveTab('discovery');
        showToast('Switched to Customer View (Aditi Roy)');
      }
    } catch (e: any) {
      console.error(e);
    }
  };

  const handleUpdateAddress = (newAddress: string) => {
    setCurrentUser((prev) => ({
      ...prev,
      location: { ...prev.location, address: newAddress },
    }));
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
        location: currentUser.location,
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
        proposingParty: currentUser.role === 'worker_pro' ? 'WORKER' : 'CUSTOMER',
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
        senderRole: currentUser.role,
        content,
      });
    } catch (e: any) {
      showToast(e.message);
    }
  };

  const handleLogout = async () => {
    try {
      await api.logout();
      showToast('Logged out of session');
      setIsAuthModalOpen(true);
    } catch (err: any) {
      showToast(err.message || 'Logout error');
    }
  };

  return (
    <div className="bg-[#0b1326] font-body-default text-[#dae2fd] relative min-h-screen selection:bg-[#89ceff] selection:text-[#00344d]">
      {/* Launch Splash Screen */}
      {showSplash && <SplashLaunchScreen onComplete={() => setShowSplash(false)} />}

      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed top-24 right-6 z-50 bg-[#171f33] border border-[#4edea3]/40 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-fade-in">
          <span className="w-2 h-2 rounded-full bg-[#4edea3] animate-ping"></span>
          <span className="text-xs font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Main Header */}
      <Header
        currentUser={currentUser}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenSos={() => setIsSosOpen(true)}
        onRoleSwitch={handleRoleSwitch}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onLogout={handleLogout}
      />

      {/* Main Application Content Body */}
      <main className="relative z-10 w-full pt-28 bg-[#0b1326] min-h-[calc(100vh-5rem)]">
        {activeTab === 'discovery' && (
          <ServiceDiscoveryView
            categories={categories}
            currentAddress={currentUser.location.address}
            onOpenEditAddress={() => setIsAddressModalOpen(true)}
            onOpenSos={() => setIsSosOpen(true)}
            onSelectCategory={(catId) => {
              setActiveTab('radar');
            }}
            onExecuteDispatchSearch={handleExecuteDispatchSearch}
            onNavigateToTracking={() => setActiveTab('tracking')}
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
            onNavigateToTracking={() => setActiveTab('tracking')}
          />
        )}

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

        {activeTab === 'worker' && activeJob && (
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
            <button onClick={() => handleRoleSwitch('worker_pro')} className="text-[#4edea3] hover:underline font-semibold cursor-pointer">
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
        currentAddress={currentUser.location.address}
        onSaveAddress={handleUpdateAddress}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={(user) => {
          setCurrentUser(user);
          showToast(`Welcome back, ${user.name}!`);
          if (user.role === 'worker_pro') {
            setActiveTab('worker');
          } else {
            setActiveTab('discovery');
          }
        }}
        defaultRole={currentUser.role}
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
            setActiveTab('discovery');
          }}
        />
      )}
    </div>
  );
}

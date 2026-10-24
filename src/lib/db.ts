import EventEmitter from 'node:events';
import {
  User,
  WorkerProfile,
  ServiceCategory,
  JobRequest,
  JobStatus,
  BidOffer,
  ChatMessage,
  SosAlert,
  ReviewRecord,
} from '../types/index.ts';
import { calculateDistanceKm, calculateEtaMinutes, isWithinRadius } from './spatial.ts';
import { calculateBidBreakdown, isValidJobTransition } from './biddingEngine.ts';

class AegisCraftDatabase extends EventEmitter {
  public currentUser: User = {
    id: 'user-sarah-jenkins',
    name: 'Sarah Jenkins',
    email: 'sarah.jenkins@example.com',
    role: 'customer',
    phone: '+1 (555) 234-5678',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=256&q=80',
    rating: 5.0,
    completedJobsCount: 14,
    location: {
      lat: 44.0462,
      lng: -123.022,
      address: '742 Evergreen Terrace, Springfield',
      sector: 'Metro Sector 4',
    },
  };

  public categories: ServiceCategory[] = [
    {
      id: 'electrical',
      name: 'Electrical & Wiring',
      icon: 'bolt',
      description: 'Panel replacement, short circuit diagnostics, lighting installation & EV chargers.',
      prosOnline: 34,
      baseRate: 45,
      rateRange: '$45 - $65',
      emergencyReady: true,
      isCommercial: true,
      ratingTier: 4.95,
      commonIssues: [
        'Main breaker tripped & won\'t reset',
        'Sparking outlet or burning smell',
        'Complete power blackout in wing',
        'EV charger install quotation',
      ],
    },
    {
      id: 'plumbing',
      name: 'Plumbing & Pipe Rescue',
      icon: 'plumbing',
      description: 'High-pressure hydro-jetting, leak detection, water heater burst repair & drain clearance.',
      prosOnline: 28,
      baseRate: 50,
      rateRange: '$50 - $75',
      emergencyReady: true,
      isCommercial: true,
      ratingTier: 4.92,
      commonIssues: [
        'Severe pipe rupture flooding basement',
        'Water heater leaking scalding water',
        'Clogged sewer main backing up',
        'Frozen pipe thawing and containment',
      ],
    },
    {
      id: 'hvac',
      name: 'HVAC & Climate Control',
      icon: 'mode_fan',
      description: 'Furnace recovery, freon leak containment, condenser coil repair & smart thermostat setup.',
      prosOnline: 19,
      baseRate: 55,
      rateRange: '$55 - $80',
      emergencyReady: true,
      isCommercial: true,
      ratingTier: 4.9,
      commonIssues: [
        'Furnace blowing cold air during freeze',
        'AC compressor burning electrical smell',
        'Thermostat unresponsive, zero airflow',
        'Freon refrigerant line pressure drop',
      ],
    },
    {
      id: 'roofing',
      name: 'Roofing & Storm Damage',
      icon: 'roofing',
      description: 'Emergency tarping, shingle replacement, flashing leaks & structural gutter overflow.',
      prosOnline: 12,
      baseRate: 60,
      rateRange: '$60 - $95',
      emergencyReady: true,
      isCommercial: false,
      ratingTier: 4.88,
      commonIssues: [
        'Tree branch puncture through ceiling',
        'Severe storm wind shingle tear-off',
        'Flashing leak pouring into attic',
        'Emergency tarpaulin installation',
      ],
    },
    {
      id: 'locksmith',
      name: 'Locksmith & Security',
      icon: 'lock_open',
      description: 'Smart deadbolt re-keying, emergency house lockouts, high-security cylinder extraction.',
      prosOnline: 15,
      baseRate: 40,
      rateRange: '$40 - $60',
      emergencyReady: true,
      isCommercial: true,
      ratingTier: 4.94,
      commonIssues: [
        'Locked out with stove/baby inside',
        'Broken key snapped in deadbolt',
        'Electronic keypad locked out',
        'Commercial fire exit door jammed',
      ],
    },
    {
      id: 'carpentry',
      name: 'Carpentry & Structural',
      icon: 'handyman',
      description: 'Door frame reinforcement, weight-bearing header repair, decking & subfloor stabilization.',
      prosOnline: 22,
      baseRate: 42,
      rateRange: '$42 - $65',
      emergencyReady: false,
      isCommercial: false,
      ratingTier: 4.89,
      commonIssues: [
        'Sagging ceiling beam stabilization',
        'Forced entry door frame repair',
        'Subfloor water rot urgent patch',
        'Staircase tread structural fracture',
      ],
    },
    {
      id: 'masonry',
      name: 'Masonry & Foundation',
      icon: 'foundation',
      description: 'Basement crack injection, tuckpointing, stone veneer preservation & driveway slab settling.',
      prosOnline: 9,
      baseRate: 48,
      rateRange: '$48 - $70',
      emergencyReady: false,
      isCommercial: true,
      ratingTier: 4.91,
      commonIssues: [
        'Basement wall horizontal fissure leak',
        'Chimney brick spalling and risk',
        'Retaining wall bowing under mud load',
        'Foundation hydro-expansion leak',
      ],
    },
    {
      id: 'appliance',
      name: 'Appliance Repair',
      icon: 'kitchen',
      description: 'Commercial & domestic refrigerators, induction ranges, washing drum balancing.',
      prosOnline: 31,
      baseRate: 38,
      rateRange: '$38 - $58',
      emergencyReady: true,
      isCommercial: true,
      ratingTier: 4.93,
      commonIssues: [
        'Commercial freezer warming up',
        'Washing machine overflow flood',
        'Induction range sparking error E04',
        'Gas dryer heating element fault',
      ],
    },
  ];

  public workers: WorkerProfile[] = [
    {
      id: 'worker-mark-j',
      name: 'Mark J.',
      email: 'mark.j@aegispro.network',
      role: 'worker_pro',
      phone: '+1 (555) 019-2834',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDaz397TpeK9wHKhlQ-LWITbHWEvxV1IXzEAqubiSuS4FoXgI3NYH787ar8yeNsCAQ2p4G7_BwbLN0oIvXu6jKmGZzsRGRjJqncqM0i5M5pxZE9KPNS7XwfIcC_2NkC-vu4dc10rwkp4oHwOYjNiZBCLJc-SEZLU32gkOfyqdj_sCgUaabYnIx--jWI0w5QDr5nCrrfhreXI3xMOJ1yMlBhKNY7pQcGWLqL0m81vYdrINVae5b0M9eJnQ',
      rating: 4.98,
      completedJobsCount: 214,
      location: {
        lat: 44.052,
        lng: -123.016,
        address: 'Elm St & Pioneer Pkwy, Springfield',
        sector: 'Metro Sector 4',
      },
      tradeCategory: 'electrical',
      specialtyTitle: 'Master Electrical Specialist',
      licenseNumber: 'State Lic. #EL-8941',
      insuranceCoverage: 'Clear • Insured $2M',
      isKycVerified: true,
      policeBackgroundPassed: true,
      baseHourlyRate: 48,
      isOnline: true,
      isAvailable: true,
      vehicle: 'Ford Transit Service Van (#VAN-08)',
      toolsLoadout: 'Fluke Diagnostic Multimeter, FLIR Thermal Camera, Eaton Breaker Spares',
      currentEtaMinutes: 4,
      distanceKm: 0.8,
    },
    {
      id: 'worker-elena-r',
      name: 'Elena Rostova',
      email: 'elena.rostova@aegispro.network',
      role: 'worker_pro',
      phone: '+1 (555) 782-9912',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=256&q=80',
      rating: 4.9,
      completedJobsCount: 98,
      location: {
        lat: 44.056,
        lng: -123.033,
        address: 'Centennial Blvd & MLK Jr Pkwy, Springfield',
        sector: 'Metro Sector 3',
      },
      tradeCategory: 'electrical',
      specialtyTitle: 'Certified High-Voltage Specialist',
      licenseNumber: 'State Lic. #EL-7720',
      insuranceCoverage: 'Insured $2M General Commercial',
      isKycVerified: true,
      policeBackgroundPassed: true,
      baseHourlyRate: 52,
      isOnline: true,
      isAvailable: true,
      vehicle: 'RAM ProMaster 2500 Heavy Mobile Workshop',
      toolsLoadout: 'High-voltage arc flash gear, Megohmmeter, Industrial cable crimpers',
      currentEtaMinutes: 11,
      distanceKm: 1.4,
    },
    {
      id: 'worker-david-c',
      name: 'David Chen',
      email: 'david.chen@aegispro.network',
      role: 'worker_pro',
      phone: '+1 (555) 438-1920',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80',
      rating: 4.88,
      completedJobsCount: 64,
      location: {
        lat: 44.032,
        lng: -123.038,
        address: 'Franklin Blvd, South Springfield',
        sector: 'Metro Sector 5',
      },
      tradeCategory: 'electrical',
      specialtyTitle: 'Residential Wiring & Panel Pro',
      licenseNumber: 'State Lic. #EL-9114',
      insuranceCoverage: 'Bonded & Insured $1M',
      isKycVerified: true,
      policeBackgroundPassed: true,
      baseHourlyRate: 45,
      isOnline: true,
      isAvailable: false, // Finishing active repair
      vehicle: 'Chevy Express 3500 Utility',
      toolsLoadout: 'Conduit benders, Southwire circuit pullers, Square-D surge suppressors',
      currentEtaMinutes: 15,
      distanceKm: 2.1,
    },
    {
      id: 'worker-marcus-v',
      name: 'Marcus Vance',
      email: 'marcus.vance@aegispro.network',
      role: 'worker_pro',
      phone: '+1 (555) 882-3104',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&q=80',
      rating: 4.92,
      completedJobsCount: 187,
      location: {
        lat: 44.029,
        lng: -123.004,
        address: 'Jasper Rd, Springfield East',
        sector: 'Metro Sector 6',
      },
      tradeCategory: 'electrical',
      specialtyTitle: 'Emergency Power & Generator Tech',
      licenseNumber: 'State Lic. #EL-6240',
      insuranceCoverage: 'Insured $3M Commercial',
      isKycVerified: true,
      policeBackgroundPassed: true,
      baseHourlyRate: 55,
      isOnline: true,
      isAvailable: true,
      vehicle: 'Ford F-350 SuperDuty with 25kW Diesel Generator',
      toolsLoadout: 'Load bank tester, Generac ATS controllers, Transfer switch diagnostic kit',
      currentEtaMinutes: 18,
      distanceKm: 2.9,
    },
  ];

  public jobs: JobRequest[] = [
    {
      id: 'job-8842',
      customerId: 'user-sarah-jenkins',
      customerName: 'Sarah Jenkins',
      customerPhone: '+1 (555) 234-5678',
      tradeCategory: 'electrical',
      title: 'Emergency Electrical Panel Tripping & Surge Protection',
      situationSummary:
        'Main breaker burning smell, circuit breaker 30A fault, requires immediate multimeter diagnostics, circuit thermal imaging check, & Eaton breaker replacement.',
      issueTags: ['Breaker Tripped', 'Sparking / Smell', 'Partial Outage'],
      urgency: 'emergency',
      location: {
        lat: 44.0462,
        lng: -123.022,
        address: '742 Evergreen Terrace, Springfield',
        sector: 'Metro Sector 4',
      },
      status: 'BIDDING', // Can be ACCEPTED, IN_PROGRESS, COMPLETED
      escrowStatus: 'LOCKED',
      agreedAmount: 80.0,
      currency: 'USD',
      acceptedBidId: 'bid-3',
      assignedWorkerId: 'worker-mark-j',
      createdAt: new Date(Date.now() - 35 * 60 * 1000).toISOString(),
      currentPhase: 2, // Phase 2: Technician Dispatched / En Route
      telemetry: {
        speedKmh: 32,
        distanceMeters: 420,
        etaMinutes: 4,
        signalStatus: '5G Safe',
        lastGpsSync: new Date().toISOString(),
      },
    },
  ];

  public bids: BidOffer[] = [
    {
      id: 'bid-1',
      jobId: 'job-8842',
      workerId: 'worker-mark-j',
      workerName: 'Mark J.',
      workerTitle: 'Master Electrical Specialist',
      workerRating: 4.98,
      workerAvatar:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuDaz397TpeK9wHKhlQ-LWITbHWEvxV1IXzEAqubiSuS4FoXgI3NYH787ar8yeNsCAQ2p4G7_BwbLN0oIvXu6jKmGZzsRGRjJqncqM0i5M5pxZE9KPNS7XwfIcC_2NkC-vu4dc10rwkp4oHwOYjNiZBCLJc-SEZLU32gkOfyqdj_sCgUaabYnIx--jWI0w5QDr5nCrrfhreXI3xMOJ1yMlBhKNY7pQcGWLqL0m81vYdrINVae5b0M9eJnQ',
      proposedAmount: 70.0,
      currency: 'USD',
      proposingParty: 'CUSTOMER',
      status: 'COUNTERED',
      scopeNotes: 'Smelled electrical smoke near the main basement circuit. Need technician to diagnose cause promptly.',
      laborAmount: 55.0,
      partsAllowance: 15.0,
      platformFee: 0.0,
      createdAt: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
    },
    {
      id: 'bid-2',
      jobId: 'job-8842',
      workerId: 'worker-mark-j',
      workerName: 'Mark J.',
      workerTitle: 'Master Electrical Specialist',
      workerRating: 4.98,
      workerAvatar:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuDaz397TpeK9wHKhlQ-LWITbHWEvxV1IXzEAqubiSuS4FoXgI3NYH787ar8yeNsCAQ2p4G7_BwbLN0oIvXu6jKmGZzsRGRjJqncqM0i5M5pxZE9KPNS7XwfIcC_2NkC-vu4dc10rwkp4oHwOYjNiZBCLJc-SEZLU32gkOfyqdj_sCgUaabYnIx--jWI0w5QDr5nCrrfhreXI3xMOJ1yMlBhKNY7pQcGWLqL0m81vYdrINVae5b0M9eJnQ',
      proposedAmount: 85.0,
      currency: 'USD',
      proposingParty: 'WORKER',
      status: 'COUNTERED',
      scopeNotes:
        'Includes OEM 30A Eaton breaker replacement and FLIR thermal imaging diagnostic to verify panel busbar integrity. Fast on-site turnaround.',
      laborAmount: 70.0,
      partsAllowance: 15.0,
      platformFee: 0.0,
      voiceTranscribed: true,
      createdAt: new Date(Date.now() - 20 * 60 * 1000).toISOString(),
    },
    {
      id: 'bid-3',
      jobId: 'job-8842',
      workerId: 'worker-mark-j',
      workerName: 'Mark J.',
      workerTitle: 'Master Electrical Specialist',
      workerRating: 4.98,
      workerAvatar:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuDaz397TpeK9wHKhlQ-LWITbHWEvxV1IXzEAqubiSuS4FoXgI3NYH787ar8yeNsCAQ2p4G7_BwbLN0oIvXu6jKmGZzsRGRjJqncqM0i5M5pxZE9KPNS7XwfIcC_2NkC-vu4dc10rwkp4oHwOYjNiZBCLJc-SEZLU32gkOfyqdj_sCgUaabYnIx--jWI0w5QDr5nCrrfhreXI3xMOJ1yMlBhKNY7pQcGWLqL0m81vYdrINVae5b0M9eJnQ',
      proposedAmount: 80.0,
      currency: 'USD',
      proposingParty: 'CUSTOMER',
      status: 'PENDING',
      scopeNotes: 'Can we meet at $80.00? Happy to confirm and lock escrow right away so you can dispatch immediately.',
      laborAmount: 65.0,
      partsAllowance: 15.0,
      platformFee: 0.0,
      createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    },
  ];

  public messages: ChatMessage[] = [
    {
      id: 'msg-1',
      jobId: 'job-8842',
      senderId: 'worker-mark-j',
      senderName: 'Mark J.',
      senderRole: 'worker_pro',
      content: 'Just turned onto your block, will park in the driveway.',
      timestamp: '10:24 AM',
    },
    {
      id: 'msg-2',
      jobId: 'job-8842',
      senderId: 'user-sarah-jenkins',
      senderName: 'Sarah Jenkins',
      senderRole: 'customer',
      content: 'Front door is unlocked, panel is in the basement right by the stairs.',
      timestamp: '10:25 AM',
    },
  ];

  public sosAlerts: SosAlert[] = [];
  public reviews: ReviewRecord[] = [];

  constructor() {
    super();
    // Pre-populate assigned worker reference
    const activeJob = this.jobs[0];
    activeJob.assignedWorker = this.workers.find((w) => w.id === activeJob.assignedWorkerId);
  }

  // --- Methods ---

  public getNearbyWorkers(lat: number, lng: number, radiusKm = 3.2, category?: string): WorkerProfile[] {
    const origin = { lat, lng };
    return this.workers
      .filter((w) => {
        if (category && category !== 'all' && w.tradeCategory !== category) return false;
        return isWithinRadius(origin, w.location, radiusKm);
      })
      .map((w) => {
        const dist = calculateDistanceKm(origin, w.location);
        const eta = calculateEtaMinutes(dist);
        return {
          ...w,
          distanceKm: dist,
          currentEtaMinutes: eta,
        };
      })
      .sort((a, b) => a.distanceKm - b.distanceKm);
  }

  public createJob(jobData: Partial<JobRequest>): JobRequest {
    const id = `job-${Date.now().toString().slice(-4)}`;
    const breakdown = calculateBidBreakdown(jobData.agreedAmount || 65, jobData.tradeCategory || 'electrical');

    const newJob: JobRequest = {
      id,
      customerId: this.currentUser.id,
      customerName: this.currentUser.name,
      customerPhone: this.currentUser.phone,
      tradeCategory: jobData.tradeCategory || 'electrical',
      title: jobData.title || 'Urgent Trade Service Dispatch',
      situationSummary: jobData.situationSummary || 'Emergency service inspection needed.',
      issueTags: jobData.issueTags || ['Urgent Diagnostic'],
      urgency: jobData.urgency || 'standard',
      location: jobData.location || this.currentUser.location,
      status: 'MATCHING',
      escrowStatus: 'UNFUNDED',
      agreedAmount: breakdown.total,
      currency: 'USD',
      createdAt: new Date().toISOString(),
      currentPhase: 1,
      telemetry: {
        speedKmh: 0,
        distanceMeters: 800,
        etaMinutes: 6,
        signalStatus: '5G Safe',
        lastGpsSync: new Date().toISOString(),
      },
    };

    this.jobs.unshift(newJob);
    this.emit('job:created', newJob);
    return newJob;
  }

  public submitCounteroffer(
    jobId: string,
    proposedAmount: number,
    proposingParty: 'WORKER' | 'CUSTOMER',
    scopeNotes: string,
    workerId?: string
  ): BidOffer {
    const job = this.jobs.find((j) => j.id === jobId);
    if (!job) throw new Error(`Job ${jobId} not found`);

    const targetWorker = this.workers.find((w) => w.id === (workerId || job.assignedWorkerId || 'worker-mark-j'))!;
    const breakdown = calculateBidBreakdown(proposedAmount, job.tradeCategory);

    // Mark previous bids as countered
    this.bids
      .filter((b) => b.jobId === jobId && b.status === 'PENDING')
      .forEach((b) => {
        b.status = 'COUNTERED';
      });

    const newBid: BidOffer = {
      id: `bid-${Date.now().toString().slice(-4)}`,
      jobId,
      workerId: targetWorker.id,
      workerName: targetWorker.name,
      workerTitle: targetWorker.specialtyTitle,
      workerRating: targetWorker.rating,
      workerAvatar: targetWorker.avatar,
      proposedAmount: breakdown.total,
      currency: 'USD',
      proposingParty,
      status: 'PENDING',
      scopeNotes,
      laborAmount: breakdown.laborAmount,
      partsAllowance: breakdown.partsAllowance,
      platformFee: breakdown.platformFee,
      createdAt: new Date().toISOString(),
    };

    this.bids.push(newBid);
    job.agreedAmount = breakdown.total;
    this.emit('bid:created', newBid);
    return newBid;
  }

  public acceptOffer(jobId: string, bidId: string): { job: JobRequest; bid: BidOffer } {
    const job = this.jobs.find((j) => j.id === jobId);
    if (!job) throw new Error(`Job ${jobId} not found`);

    const bid = this.bids.find((b) => b.id === bidId);
    if (!bid) throw new Error(`Bid ${bidId} not found`);

    // Concurrency / transaction safety: verify status
    if (job.status === 'COMPLETED' || job.status === 'CANCELLED') {
      throw new Error(`Job is already finalized with status: ${job.status}`);
    }

    bid.status = 'ACCEPTED';
    job.status = 'ACCEPTED';
    job.escrowStatus = 'LOCKED';
    job.acceptedBidId = bid.id;
    job.agreedAmount = bid.proposedAmount;
    job.assignedWorkerId = bid.workerId;
    job.assignedWorker = this.workers.find((w) => w.id === bid.workerId);
    job.acceptedAt = new Date().toISOString();
    job.currentPhase = 2; // Technician en route

    this.emit('bid:accepted', { job, bid });
    return { job, bid };
  }

  public updateJobPhase(jobId: string, phase: number, targetStatus?: JobStatus): JobRequest {
    const job = this.jobs.find((j) => j.id === jobId);
    if (!job) throw new Error(`Job ${jobId} not found`);

    if (targetStatus && !isValidJobTransition(job.status, targetStatus)) {
      throw new Error(`Cannot transition job from ${job.status} to ${targetStatus}`);
    }

    job.currentPhase = phase;
    if (targetStatus) {
      job.status = targetStatus;
    }

    if (phase === 2) {
      job.status = 'ACCEPTED';
      job.enRouteAt = new Date().toISOString();
    } else if (phase === 3) {
      job.status = 'IN_PROGRESS';
      job.startedAt = new Date().toISOString();
    } else if (phase === 4) {
      job.status = 'COMPLETED';
      job.escrowStatus = 'RELEASED';
      job.completedAt = new Date().toISOString();
    }

    this.emit('job:updated', job);
    return job;
  }

  public addChatMessage(jobId: string, senderRole: 'customer' | 'worker_pro', content: string): ChatMessage {
    const job = this.jobs.find((j) => j.id === jobId);
    if (!job) throw new Error(`Job ${jobId} not found`);

    const senderName = senderRole === 'customer' ? this.currentUser.name : (job.assignedWorker?.name || 'Mark J.');
    const senderId = senderRole === 'customer' ? this.currentUser.id : (job.assignedWorkerId || 'worker-mark-j');

    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const msg: ChatMessage = {
      id: `msg-${Date.now().toString().slice(-4)}`,
      jobId,
      senderId,
      senderName,
      senderRole,
      content,
      timestamp: timeStr,
    };

    this.messages.push(msg);
    this.emit('message:created', msg);
    return msg;
  }

  public triggerSosAlert(jobId?: string, hazardType: 'fire' | 'water' | 'gas' | 'structural' = 'fire'): SosAlert {
    const alert: SosAlert = {
      id: `sos-${Date.now().toString().slice(-4)}`,
      jobId,
      hazardType,
      status: 'ESCALATED_911',
      coordinates: {
        lat: 44.0462,
        lng: -123.022,
        address: '742 Evergreen Terrace, Springfield',
      },
      notifiedProsCount: 48,
      assignedUnit: 'Mark J. (Master Electrician - Tier 1 Response)',
      timestamp: new Date().toISOString(),
    };

    this.sosAlerts.unshift(alert);
    this.emit('sos:triggered', alert);
    return alert;
  }

  public submitReview(
    jobId: string,
    rating: number,
    comment: string,
    reviewerRole: 'customer' | 'worker_pro' = 'customer'
  ): ReviewRecord {
    const job = this.jobs.find((j) => j.id === jobId);
    const revieweeId =
      reviewerRole === 'customer'
        ? (job?.assignedWorkerId || 'worker-mark-j')
        : (job?.customerId || 'user-sarah-jenkins');

    const rev: ReviewRecord = {
      id: `rev-${Date.now().toString().slice(-4)}`,
      jobId,
      reviewerId: this.currentUser.id,
      reviewerName: this.currentUser.name,
      reviewerRole,
      revieweeId,
      rating,
      comment,
      timestamp: new Date().toISOString(),
      warrantyGuaranteed: true,
    };

    this.reviews.push(rev);
    this.emit('review:created', rev);
    return rev;
  }
}

export const db = new AegisCraftDatabase();

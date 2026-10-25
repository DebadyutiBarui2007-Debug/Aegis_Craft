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
  ServiceAgency,
  RegisterPayload,
} from '../types/index.ts';
import { normalizeIndianPhone, isValidIndianPhone } from './phone.ts';
import { calculateDistanceKm, calculateEtaMinutes, isWithinRadius } from './spatial.ts';
import { calculateBidBreakdown, isValidJobTransition } from './biddingEngine.ts';

export interface OtpChallenge {
  id: string;
  phone: string;
  code: string;
  expiresAt: number;
  attempts: number;
  verified: boolean;
  createdAt: number;
}

class AegisCraftDatabase extends EventEmitter {
  public users: Map<string, User & { password?: string }> = new Map();
  public activeSessions: Map<string, string> = new Map(); // token -> userId
  public otpChallenges: Map<string, OtpChallenge> = new Map();

  public sendOtp(phone: string): { success: boolean; challengeId: string; phone: string; message: string; debugOtp?: string } {
    const canonicalPhone = normalizeIndianPhone(phone);
    if (!isValidIndianPhone(canonicalPhone)) {
      throw new Error('Valid 10-digit Indian mobile number required (e.g. +91 98450 12345).');
    }

    const challengeId = `chal-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 5 * 60 * 1000; // 5 min expiry

    const challenge: OtpChallenge = {
      id: challengeId,
      phone: canonicalPhone,
      code,
      expiresAt,
      attempts: 0,
      verified: false,
      createdAt: Date.now(),
    };

    // Invalidate/supersede any previous active challenge for this phone number
    const previousChallenge = this.otpChallenges.get(canonicalPhone);
    if (previousChallenge && previousChallenge.id) {
      this.otpChallenges.delete(previousChallenge.id);
    }

    // Store challenge under both canonical phone and challenge ID for dual lookup
    this.otpChallenges.set(canonicalPhone, challenge);
    this.otpChallenges.set(challengeId, challenge);

    return {
      success: true,
      challengeId,
      phone: canonicalPhone,
      message: 'OTP sent successfully via SMS gateway.',
      debugOtp: code,
    };
  }

  public verifyOtp(phone: string, code: string, challengeId?: string): { success: boolean; challengeId: string; phone: string; message: string } {
    const canonicalPhone = normalizeIndianPhone(phone);
    const cleanCode = code ? code.replace(/\D/g, '').trim() : '';

    if (!cleanCode || cleanCode.length !== 6) {
      throw new Error('Please enter a valid 6-digit verification code.');
    }

    let challenge: OtpChallenge | undefined;
    if (challengeId && this.otpChallenges.has(challengeId)) {
      challenge = this.otpChallenges.get(challengeId);
    }
    if (!challenge && canonicalPhone && this.otpChallenges.has(canonicalPhone)) {
      challenge = this.otpChallenges.get(canonicalPhone);
    }

    if (!challenge) {
      throw new Error(`No active OTP challenge found for ${canonicalPhone || 'this phone number'}. Please click Send OTP to request a verification code.`);
    }

    if (challenge.phone !== canonicalPhone) {
      throw new Error('OTP challenge phone number mismatch. Please request a new OTP for this phone number.');
    }

    if (Date.now() > challenge.expiresAt) {
      this.otpChallenges.delete(canonicalPhone);
      if (challenge.id) this.otpChallenges.delete(challenge.id);
      throw new Error('OTP code has expired (validity is 5 minutes). Please click Resend OTP.');
    }

    if (challenge.attempts >= 5) {
      this.otpChallenges.delete(canonicalPhone);
      if (challenge.id) this.otpChallenges.delete(challenge.id);
      throw new Error('Maximum verification attempts exceeded. Please click Resend OTP.');
    }

    challenge.attempts++;

    if (challenge.code !== cleanCode) {
      const remaining = 5 - challenge.attempts;
      throw new Error(`Invalid verification code. ${remaining} attempt${remaining === 1 ? '' : 's'} remaining.`);
    }

    challenge.verified = true;
    return {
      success: true,
      challengeId: challenge.id,
      phone: canonicalPhone,
      message: 'Phone number verified successfully.',
    };
  }

  public currentUser: User = {
    id: 'user-aditi-roy',
    name: 'Aditi Roy',
    email: 'aditi.roy@example.in',
    role: 'customer',
    phone: '+91 98450 12345',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=256&q=80',
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
  };

  public categories: ServiceCategory[] = [
    {
      id: 'electrical',
      name: 'Electrical & Wiring',
      icon: 'bolt',
      description: 'Panel replacement, short circuit diagnostics, lighting installation & inverter/EV chargers.',
      prosOnline: 34,
      baseRate: 450,
      rateRange: '₹450 - ₹650',
      emergencyReady: true,
      isCommercial: true,
      ratingTier: 4.95,
      commonIssues: [
        'Main MCB tripped & won\'t reset',
        'Sparking switchboard or burning smell',
        'Complete power outage in residential wing',
        'Inverter battery / EV charger installation',
      ],
    },
    {
      id: 'plumbing',
      name: 'Plumbing & Pipe Rescue',
      icon: 'plumbing',
      description: 'High-pressure hydro-jetting, concealed leak detection, geyser burst repair & drain clearance.',
      prosOnline: 28,
      baseRate: 500,
      rateRange: '₹500 - ₹750',
      emergencyReady: true,
      isCommercial: true,
      ratingTier: 4.92,
      commonIssues: [
        'Severe pipeline rupture flooding utility room',
        'Geyser tank leaking boiling water',
        'Clogged drainage line overflow',
        'Overhead water tank booster pump failure',
      ],
    },
    {
      id: 'hvac',
      name: 'HVAC & Climate Control',
      icon: 'mode_fan',
      description: 'Inverter AC gas leak recovery, copper line brazing, condenser coil cleaning & compressor repair.',
      prosOnline: 19,
      baseRate: 550,
      rateRange: '₹550 - ₹800',
      emergencyReady: true,
      isCommercial: true,
      ratingTier: 4.9,
      commonIssues: [
        'Split AC blowing warm air during summer peak',
        'Outdoor AC condenser burning smell',
        'Indoor unit ice formation & water dripping',
        'R32/R410A refrigerant gas pressure drop',
      ],
    },
    {
      id: 'roofing',
      name: 'Roofing & Waterproofing',
      icon: 'roofing',
      description: 'Monsoon terrace tarping, polymer injection crack seal, parapet flashing & drain overflows.',
      prosOnline: 12,
      baseRate: 600,
      rateRange: '₹600 - ₹950',
      emergencyReady: true,
      isCommercial: false,
      ratingTier: 4.88,
      commonIssues: [
        'Monsoon terrace ceiling dampness & seepage',
        'Heavy storm wind sheet tear-off',
        'Parapet wall joint leak into false ceiling',
        'Emergency UV tarpaulin installation',
      ],
    },
    {
      id: 'locksmith',
      name: 'Locksmith & Key Security',
      icon: 'lock_open',
      description: 'Smart biometric deadbolt re-keying, emergency house lockouts, high-security cylinder extraction.',
      prosOnline: 15,
      baseRate: 400,
      rateRange: '₹400 - ₹600',
      emergencyReady: true,
      isCommercial: true,
      ratingTier: 4.94,
      commonIssues: [
        'Locked out with gas stove active inside',
        'Broken key jammed in main entrance deadbolt',
        'Electronic digital lock battery depleted',
        'Commercial safety shutter jammed',
      ],
    },
    {
      id: 'carpentry',
      name: 'Carpentry & Structural',
      icon: 'handyman',
      description: 'Door frame reinforcement, teakwood door realignment, modular kitchen hinges & subfloor support.',
      prosOnline: 22,
      baseRate: 420,
      rateRange: '₹420 - ₹650',
      emergencyReady: false,
      isCommercial: false,
      ratingTier: 4.89,
      commonIssues: [
        'Heavy entrance door scraping floor tiles',
        'Broken hydraulic hinge on kitchen cabinet',
        'Water-damaged wardrobe bottom panel patch',
        'Loose wooden staircase handrail stabilization',
      ],
    },
    {
      id: 'masonry',
      name: 'Masonry & Civil Repair',
      icon: 'foundation',
      description: 'Basement wall crack epoxy injection, tile hollow repair, stone facade preservation & plaster patch.',
      prosOnline: 9,
      baseRate: 480,
      rateRange: '₹480 - ₹700',
      emergencyReady: false,
      isCommercial: true,
      ratingTier: 4.91,
      commonIssues: [
        'Basement retaining wall water pressure fissure',
        'Balcony concrete spalling and falling hazard',
        'Hollow floor tiles clicking and buckling',
        'Compound wall mortar degradation & leaning',
      ],
    },
    {
      id: 'appliance',
      name: 'Appliance Repair',
      icon: 'kitchen',
      description: 'Frost-free refrigerator gas filling, front-load washer drum balancing & induction hob circuit fix.',
      prosOnline: 31,
      baseRate: 380,
      rateRange: '₹380 - ₹580',
      emergencyReady: true,
      isCommercial: true,
      ratingTier: 4.93,
      commonIssues: [
        'Double-door refrigerator cooling failure',
        'Washing machine error OE drain pump blocked',
        'Induction cooktop sparking error E04',
        'Microwave oven heating magnetron breakdown',
      ],
    },
  ];

  public workers: WorkerProfile[] = [
    {
      id: 'worker-rajesh-sharma',
      name: 'Rajesh Sharma',
      email: 'rajesh.sharma@aegispro.in',
      role: 'worker_pro',
      phone: '+91 98765 43210',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80',
      rating: 4.98,
      completedJobsCount: 214,
      location: {
        lat: 12.9825,
        lng: 77.6450,
        address: '100 Feet Road, Near CMH Metro, Indiranagar, Bengaluru',
        city: 'Bengaluru',
        pincode: '560038',
        sector: 'Indiranagar Sector 4',
      },
      tradeCategory: 'electrical',
      specialtyTitle: 'Master Electrical Specialist (Grade A License)',
      licenseNumber: 'State Lic. #KA-EL-8941',
      insuranceCoverage: 'Clear • Insured ₹15 Lakhs Commercial',
      isKycVerified: true,
      policeBackgroundPassed: true,
      baseHourlyRate: 480,
      isOnline: true,
      isAvailable: true,
      vehicle: 'Mahindra Bolero Maxi Truck (#KA-03-ET-8812)',
      toolsLoadout: 'Fluke 117 Multimeter, FLIR E4 Thermal Camera, Havells & Schneider OEM Spares',
      currentEtaMinutes: 4,
      distanceKm: 0.8,
    },
    {
      id: 'worker-priya-patel',
      name: 'Priya Patel',
      email: 'priya.patel@aegispro.in',
      role: 'worker_pro',
      phone: '+91 98200 55432',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=256&q=80',
      rating: 4.9,
      completedJobsCount: 98,
      location: {
        lat: 12.9650,
        lng: 77.6480,
        address: 'Old Airport Road, Kodihalli, Bengaluru',
        city: 'Bengaluru',
        pincode: '560008',
        sector: 'HAL / Domlur Zone',
      },
      tradeCategory: 'electrical',
      specialtyTitle: 'Certified High-Voltage Specialist',
      licenseNumber: 'State Lic. #KA-EL-7720',
      insuranceCoverage: 'Insured ₹20 Lakhs Commercial General',
      isKycVerified: true,
      policeBackgroundPassed: true,
      baseHourlyRate: 520,
      isOnline: true,
      isAvailable: true,
      vehicle: 'Tata Ace Mobile Utility Unit',
      toolsLoadout: 'High-voltage arc protection kit, Kyoritsu Megger, Industrial crimping station',
      currentEtaMinutes: 11,
      distanceKm: 1.4,
    },
    {
      id: 'worker-amit-verma',
      name: 'Amit Verma',
      email: 'amit.verma@aegispro.in',
      role: 'worker_pro',
      phone: '+91 98311 22334',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&q=80',
      rating: 4.88,
      completedJobsCount: 64,
      location: {
        lat: 12.9352,
        lng: 77.6245,
        address: '80 Feet Road, 4th Block, Koramangala, Bengaluru',
        city: 'Bengaluru',
        pincode: '560034',
        sector: 'Koramangala Zone',
      },
      tradeCategory: 'electrical',
      specialtyTitle: 'Residential Wiring & Inverter Pro',
      licenseNumber: 'State Lic. #KA-EL-9114',
      insuranceCoverage: 'Bonded & Insured ₹10 Lakhs',
      isKycVerified: true,
      policeBackgroundPassed: true,
      baseHourlyRate: 450,
      isOnline: true,
      isAvailable: false, // Finishing active repair
      vehicle: 'Maruti Suzuki Eeco Utility Van',
      toolsLoadout: 'Bosch Rotary Hammer, Microtek Inverter Diagnostic Tester, Polycab Wires Kit',
      currentEtaMinutes: 15,
      distanceKm: 2.1,
    },
    {
      id: 'worker-vikram-sen',
      name: 'Vikram Sen',
      email: 'vikram.sen@aegispro.in',
      role: 'worker_pro',
      phone: '+91 98101 99887',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=256&q=80',
      rating: 4.92,
      completedJobsCount: 187,
      location: {
        lat: 12.9800,
        lng: 77.6180,
        address: 'Ulsoor Road, Near Halasuru Lake, Bengaluru',
        city: 'Bengaluru',
        pincode: '560042',
        sector: 'Ulsoor Central Zone',
      },
      tradeCategory: 'electrical',
      specialtyTitle: 'Emergency Power & DG Genset Tech',
      licenseNumber: 'State Lic. #KA-EL-6240',
      insuranceCoverage: 'Insured ₹25 Lakhs Industrial',
      isKycVerified: true,
      policeBackgroundPassed: true,
      baseHourlyRate: 550,
      isOnline: true,
      isAvailable: true,
      vehicle: 'Mahindra Pik-Up with 15kVA Silent Diesel Generator',
      toolsLoadout: 'Kirloskar Engine Diagnostic Scanner, Automatic Transfer Switch (ATS) Analyzer',
      currentEtaMinutes: 18,
      distanceKm: 2.9,
    },
  ];

  public agencies: ServiceAgency[] = [
    {
      id: 'agency-havells-indiranagar',
      name: 'Havells Galaxy Electricals & Repair Hub',
      category: 'electrical',
      address: 'Shop 14, 100 Feet Road, HAL 2nd Stage, Indiranagar',
      locality: 'Indiranagar',
      city: 'Bengaluru',
      pincode: '560038',
      lat: 12.9810,
      lng: 77.6430,
      phone: '+91 80 2520 4411',
      website: 'https://www.havells.com',
      rating: 4.8,
      reviewCount: 342,
      distanceKm: 0.6,
      isOpenNow: true,
      openingHours: '09:00 AM - 08:30 PM',
      isExternalListing: true,
      verifiedSource: 'Google Places & Havells India Authorized Dealer Network',
    },
    {
      id: 'agency-voltas-care',
      name: 'Voltas Customer Care & AC Diagnostic Center',
      category: 'hvac',
      address: 'Plot 42, CMH Road, Near Indiranagar Metro Station',
      locality: 'Indiranagar',
      city: 'Bengaluru',
      pincode: '560038',
      lat: 12.9790,
      lng: 77.6390,
      phone: '+91 80 4112 8899',
      website: 'https://www.voltas.com',
      rating: 4.7,
      reviewCount: 512,
      distanceKm: 0.9,
      isOpenNow: true,
      openingHours: '09:30 AM - 07:00 PM',
      isExternalListing: true,
      verifiedSource: 'Voltas Official Service Partner Registry',
    },
    {
      id: 'agency-jaquar-hub',
      name: 'Jaquar Authorized Plumbing Care Hub',
      category: 'plumbing',
      address: 'Building 18, 80 Feet Road, 4th Block, Koramangala',
      locality: 'Koramangala',
      city: 'Bengaluru',
      pincode: '560034',
      lat: 12.9360,
      lng: 77.6250,
      phone: '+91 80 4153 7700',
      website: 'https://www.jaquar.com',
      rating: 4.9,
      reviewCount: 420,
      distanceKm: 2.3,
      isOpenNow: true,
      openingHours: '10:00 AM - 08:00 PM',
      isExternalListing: true,
      verifiedSource: 'Jaquar Orient Care Service Network',
    },
    {
      id: 'agency-godrej-smartcare',
      name: 'Godrej SmartCare & Security Solutions',
      category: 'locksmith',
      address: '77 Old Airport Road, Kodihalli',
      locality: 'Domlur',
      city: 'Bengaluru',
      pincode: '560008',
      lat: 12.9645,
      lng: 77.6495,
      phone: '+91 80 6647 2200',
      website: 'https://www.godrejenterprises.com',
      rating: 4.6,
      reviewCount: 298,
      distanceKm: 1.5,
      isOpenNow: true,
      openingHours: '09:00 AM - 07:30 PM',
      isExternalListing: true,
      verifiedSource: 'Godrej & Boyce Certified Master Hub',
    },
    {
      id: 'agency-schneider-care',
      name: 'Schneider Electric Authorised Service Center',
      category: 'electrical',
      address: 'Intermediate Ring Road, Domlur',
      locality: 'Domlur',
      city: 'Bengaluru',
      pincode: '560071',
      lat: 12.9610,
      lng: 77.6420,
      phone: '+91 80 3940 4000',
      website: 'https://www.se.com/in',
      rating: 4.8,
      reviewCount: 184,
      distanceKm: 1.8,
      isOpenNow: true,
      openingHours: '09:00 AM - 06:00 PM',
      isExternalListing: true,
      verifiedSource: 'Schneider Electric India Enterprise Directory',
    },
    {
      id: 'agency-lg-repair',
      name: 'LG Best Care Appliance Repair Wing',
      category: 'appliance',
      address: '12th Main Road, HAL 2nd Stage, Indiranagar',
      locality: 'Indiranagar',
      city: 'Bengaluru',
      pincode: '560038',
      lat: 12.9775,
      lng: 77.6415,
      phone: '+91 80 2528 5566',
      website: 'https://www.lg.com/in',
      rating: 4.7,
      reviewCount: 367,
      distanceKm: 0.3,
      isOpenNow: true,
      openingHours: '10:00 AM - 07:30 PM',
      isExternalListing: true,
      verifiedSource: 'LG Electronics India Authorized Service Network',
    },
    {
      id: 'agency-drfixit-center',
      name: 'Dr. Fixit Structural Repair & Waterproofing Center',
      category: 'roofing',
      address: 'HAL 3rd Stage, Near Jeevan Bheema Nagar Main Rd',
      locality: 'Indiranagar / JB Nagar',
      city: 'Bengaluru',
      pincode: '560075',
      lat: 12.9720,
      lng: 77.6520,
      phone: '+91 80 2521 9900',
      website: 'https://www.drfixit.co.in',
      rating: 4.8,
      reviewCount: 220,
      distanceKm: 1.6,
      isOpenNow: true,
      openingHours: '09:30 AM - 07:00 PM',
      isExternalListing: true,
      verifiedSource: 'Pidilite Authorized Technical Solutions Network',
    },
    {
      id: 'agency-centuryply-hub',
      name: 'CenturyPly Woodcare & Structural Fitters',
      category: 'carpentry',
      address: 'CMH Road, Binnamangala, 1st Stage, Indiranagar',
      locality: 'Indiranagar',
      city: 'Bengaluru',
      pincode: '560038',
      lat: 12.9795,
      lng: 77.6350,
      phone: '+91 80 2525 3300',
      website: 'https://www.centuryply.com',
      rating: 4.6,
      reviewCount: 154,
      distanceKm: 1.1,
      isOpenNow: true,
      openingHours: '10:00 AM - 08:00 PM',
      isExternalListing: true,
      verifiedSource: 'Century Plyboards Authorized Contractor Center',
    },
  ];

  public jobs: JobRequest[] = [
    {
      id: 'job-8842',
      customerId: 'user-aditi-roy',
      customerName: 'Aditi Roy',
      customerPhone: '+91 98450 12345',
      tradeCategory: 'electrical',
      title: 'Emergency Electrical Panel Tripping & Surge Protection',
      situationSummary:
        'Main MCB tripped with burning odor, circuit breaker 30A fault, requires immediate multimeter diagnostics, circuit thermal imaging check, & Havells/Schneider breaker replacement.',
      issueTags: ['MCB Tripped', 'Sparking / Smell', 'Partial Outage'],
      urgency: 'emergency',
      location: {
        lat: 12.9784,
        lng: 77.6408,
        address: '742 12th Main Road, HAL 2nd Stage, Indiranagar, Bengaluru, Karnataka 560038',
        city: 'Bengaluru',
        pincode: '560038',
        sector: 'Indiranagar Sector 4',
      },
      status: 'BIDDING',
      escrowStatus: 'LOCKED',
      agreedAmount: 800.0,
      currency: 'INR',
      acceptedBidId: 'bid-3',
      assignedWorkerId: 'worker-rajesh-sharma',
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
      workerId: 'worker-rajesh-sharma',
      workerName: 'Rajesh Sharma',
      workerTitle: 'Master Electrical Specialist (Grade A License)',
      workerRating: 4.98,
      workerAvatar:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80',
      proposedAmount: 700.0,
      currency: 'INR',
      proposingParty: 'CUSTOMER',
      status: 'COUNTERED',
      scopeNotes: 'Smelled electrical smoke near main distribution board. Need technician to diagnose cause promptly.',
      laborAmount: 550.0,
      partsAllowance: 150.0,
      platformFee: 0.0,
      createdAt: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
    },
    {
      id: 'bid-2',
      jobId: 'job-8842',
      workerId: 'worker-rajesh-sharma',
      workerName: 'Rajesh Sharma',
      workerTitle: 'Master Electrical Specialist (Grade A License)',
      workerRating: 4.98,
      workerAvatar:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80',
      proposedAmount: 850.0,
      currency: 'INR',
      proposingParty: 'WORKER',
      status: 'COUNTERED',
      scopeNotes:
        'Includes OEM 30A Havells MCB breaker replacement and FLIR thermal imaging diagnostic to verify panel busbar integrity. Fast on-site turnaround.',
      laborAmount: 700.0,
      partsAllowance: 150.0,
      platformFee: 0.0,
      voiceTranscribed: true,
      createdAt: new Date(Date.now() - 20 * 60 * 1000).toISOString(),
    },
    {
      id: 'bid-3',
      jobId: 'job-8842',
      workerId: 'worker-rajesh-sharma',
      workerName: 'Rajesh Sharma',
      workerTitle: 'Master Electrical Specialist (Grade A License)',
      workerRating: 4.98,
      workerAvatar:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80',
      proposedAmount: 800.0,
      currency: 'INR',
      proposingParty: 'CUSTOMER',
      status: 'PENDING',
      scopeNotes: 'Can we meet at ₹800.00? Happy to confirm and lock escrow right away so you can dispatch immediately.',
      laborAmount: 650.0,
      partsAllowance: 150.0,
      platformFee: 0.0,
      createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    },
  ];

  public messages: ChatMessage[] = [
    {
      id: 'msg-1',
      jobId: 'job-8842',
      senderId: 'worker-rajesh-sharma',
      senderName: 'Rajesh Sharma',
      senderRole: 'worker_pro',
      content: 'Just crossed Indiranagar 100ft road junction, entering 12th Main driveway now.',
      timestamp: '10:24 AM',
    },
    {
      id: 'msg-2',
      jobId: 'job-8842',
      senderId: 'user-aditi-roy',
      senderName: 'Aditi Roy',
      senderRole: 'customer',
      content: 'Gate is unlocked, main distribution board is in the ground floor utility closet.',
      timestamp: '10:25 AM',
    },
  ];

  public sosAlerts: SosAlert[] = [];
  public reviews: ReviewRecord[] = [];

  constructor() {
    super();
    // Seed initial users into users map
    this.users.set(this.currentUser.id, { ...this.currentUser, password: 'password123' });
    this.workers.forEach((w) => {
      this.users.set(w.id, { ...w, password: 'password123' });
    });

    const activeJob = this.jobs[0];
    activeJob.assignedWorker = this.workers.find((w) => w.id === activeJob.assignedWorkerId);
  }

  // --- Auth & Profile Management ---

  public register(payload: RegisterPayload): { token: string; user: User } {
    if (!payload.name || !payload.phone) {
      throw new Error('Name and valid phone number are required.');
    }
    const canonicalPhone = normalizeIndianPhone(payload.phone);
    if (!isValidIndianPhone(canonicalPhone)) {
      throw new Error('Valid 10-digit Indian mobile number required.');
    }

    let challenge: OtpChallenge | undefined;
    if (payload.challengeId && this.otpChallenges.has(payload.challengeId)) {
      challenge = this.otpChallenges.get(payload.challengeId);
    }
    if (!challenge && this.otpChallenges.has(canonicalPhone)) {
      challenge = this.otpChallenges.get(canonicalPhone);
    }

    const isVerified =
      payload.phoneVerified === true ||
      (challenge && challenge.verified === true) ||
      !!payload.firebaseUid ||
      !!payload.idToken;

    if (!isVerified) {
      throw new Error('Phone number verification via OTP is required before registration.');
    }

    const userId = `user-${Date.now().toString().slice(-6)}`;
    const token = `aegis-tok-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

    const newUser: User = {
      id: userId,
      firebaseUid: payload.firebaseUid,
      name: payload.name.trim(),
      email: payload.email?.trim() || `${userId}@aegis.in`,
      role: payload.role,
      phone: canonicalPhone,
      phoneVerified: true,
      phoneVerifiedAt: new Date().toISOString(),
      avatar:
        payload.role === 'worker_pro'
          ? 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80'
          : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
      rating: 5.0,
      completedJobsCount: 0,
      location: {
        lat: 12.9784,
        lng: 77.6408,
        address: payload.address || 'Indiranagar, Bengaluru, Karnataka 560038',
        city: payload.city || 'Bengaluru',
        pincode: payload.pincode || '560038',
        sector: 'Central Zone',
      },
    };

    if (payload.role === 'worker_pro') {
      const newWorker: WorkerProfile = {
        ...newUser,
        tradeCategory: payload.tradeCategory || 'electrical',
        specialtyTitle: payload.specialtyTitle || 'Certified Trade Professional',
        licenseNumber: `KA-REG-${Date.now().toString().slice(-4)}`,
        insuranceCoverage: 'Verified Commercial Bonded ₹10L',
        isKycVerified: false,
        policeBackgroundPassed: true,
        baseHourlyRate: 450,
        isOnline: true,
        isAvailable: true,
        vehicle: 'Commercial Service Two-Wheeler / Van',
        toolsLoadout: 'Standard Certified Hand & Power Loadout',
        currentEtaMinutes: 10,
        distanceKm: 1.0,
      };
      this.workers.unshift(newWorker);
      this.users.set(userId, { ...newWorker, password: payload.password || 'password123' });
    } else {
      this.users.set(userId, { ...newUser, password: payload.password || 'password123' });
    }

    this.activeSessions.set(token, userId);
    this.currentUser = newUser;
    this.emit('user:registered', newUser);
    return { token, user: newUser };
  }

  public login(identifier: string, password?: string): { token: string; user: User } {
    const cleanId = identifier.trim().toLowerCase();
    const canonicalPhoneId = normalizeIndianPhone(identifier);

    let foundUser: (User & { password?: string }) | undefined;

    for (const u of this.users.values()) {
      const userCanonicalPhone = normalizeIndianPhone(u.phone);
      if (
        (u.firebaseUid && u.firebaseUid === cleanId) ||
        u.email.toLowerCase() === cleanId ||
        (canonicalPhoneId && userCanonicalPhone === canonicalPhoneId) ||
        u.phone.replace(/[\s-]/g, '').includes(cleanId.replace(/[\s-]/g, '')) ||
        u.name.toLowerCase().includes(cleanId)
      ) {
        foundUser = u;
        break;
      }
    }

    if (!foundUser) {
      throw new Error('Account not found with provided phone or email.');
    }

    const token = `aegis-tok-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    this.activeSessions.set(token, foundUser.id);
    this.currentUser = foundUser;
    this.emit('user:authenticated', foundUser);
    return { token, user: foundUser };
  }

  public getUserByToken(token: string): User | null {
    const userId = this.activeSessions.get(token);
    if (!userId) return null;
    return this.users.get(userId) || null;
  }

  public logout(token?: string) {
    if (token) {
      this.activeSessions.delete(token);
    }
  }

  // --- Real Nearby Service Agencies Directory ---

  public getNearbyAgencies(lat: number, lng: number, radiusKm = 10.0, category?: string, city?: string): ServiceAgency[] {
    const origin = { lat, lng };
    return this.agencies
      .filter((a) => {
        if (category && category !== 'all' && a.category !== category) return false;
        if (city && a.city.toLowerCase() !== city.toLowerCase()) return false;
        return isWithinRadius(origin, { lat: a.lat, lng: a.lng }, radiusKm);
      })
      .map((a) => {
        const dist = calculateDistanceKm(origin, { lat: a.lat, lng: a.lng });
        return {
          ...a,
          distanceKm: dist,
        };
      })
      .sort((a, b) => a.distanceKm - b.distanceKm);
  }

  // --- Core Methods ---

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
    const breakdown = calculateBidBreakdown(jobData.agreedAmount || 650, jobData.tradeCategory || 'electrical');

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
      currency: 'INR',
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

    const targetWorker = this.workers.find((w) => w.id === (workerId || job.assignedWorkerId || 'worker-rajesh-sharma'))!;
    const breakdown = calculateBidBreakdown(proposedAmount, job.tradeCategory);

    // Mark previous pending bids as countered
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
      currency: 'INR',
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

    const senderName = senderRole === 'customer' ? this.currentUser.name : (job.assignedWorker?.name || 'Rajesh Sharma');
    const senderId = senderRole === 'customer' ? this.currentUser.id : (job.assignedWorkerId || 'worker-rajesh-sharma');

    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });

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
        lat: this.currentUser.location.lat,
        lng: this.currentUser.location.lng,
        address: this.currentUser.location.address,
      },
      notifiedProsCount: 48,
      assignedUnit: 'Rajesh Sharma (Grade A Master Electrician - Rapid Emergency Unit)',
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
        ? (job?.assignedWorkerId || 'worker-rajesh-sharma')
        : (job?.customerId || 'user-aditi-roy');

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

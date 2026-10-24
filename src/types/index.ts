export type UserRole = 'customer' | 'worker_pro';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone: string;
  avatar: string;
  rating: number;
  completedJobsCount: number;
  location: {
    lat: number;
    lng: number;
    address: string;
    city?: string;
    pincode?: string;
    sector: string;
  };
}

export interface WorkerProfile extends User {
  tradeCategory: string;
  specialtyTitle: string;
  licenseNumber: string;
  insuranceCoverage: string;
  isKycVerified: boolean;
  policeBackgroundPassed: boolean;
  baseHourlyRate: number;
  isOnline: boolean;
  isAvailable: boolean;
  vehicle: string;
  toolsLoadout: string;
  currentEtaMinutes: number;
  distanceKm: number;
}

export interface ServiceCategory {
  id: string;
  name: string;
  icon: string;
  description: string;
  prosOnline: number;
  baseRate: number;
  rateRange: string;
  emergencyReady: boolean;
  isCommercial: boolean;
  ratingTier: number;
  commonIssues: string[];
}

export type JobStatus = 
  | 'PENDING'
  | 'MATCHING'
  | 'BIDDING'
  | 'ACCEPTED'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'CANCELLED';

export type EscrowStatus =
  | 'UNFUNDED'
  | 'LOCKED'
  | 'RELEASED'
  | 'DISPUTED';

export type UrgencyLevel = 'standard' | 'emergency';

export interface JobRequest {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  tradeCategory: string;
  title: string;
  situationSummary: string;
  issueTags: string[];
  urgency: UrgencyLevel;
  location: {
    lat: number;
    lng: number;
    address: string;
    city?: string;
    pincode?: string;
    sector: string;
  };
  status: JobStatus;
  escrowStatus: EscrowStatus;
  agreedAmount: number;
  currency: string;
  acceptedBidId?: string;
  assignedWorkerId?: string;
  assignedWorker?: WorkerProfile;
  createdAt: string;
  acceptedAt?: string;
  enRouteAt?: string;
  startedAt?: string;
  completedAt?: string;
  currentPhase: number; // 1: Agreement Lock, 2: Dispatched/En Route, 3: Diagnostics & Repair, 4: Escrow Release
  telemetry: {
    speedKmh: number;
    distanceMeters: number;
    etaMinutes: number;
    signalStatus: string;
    lastGpsSync: string;
  };
}

export type BidStatus = 'PENDING' | 'COUNTERED' | 'ACCEPTED' | 'REJECTED' | 'WITHDRAWN';

export interface BidOffer {
  id: string;
  jobId: string;
  workerId: string;
  workerName: string;
  workerTitle: string;
  workerRating: number;
  workerAvatar: string;
  proposedAmount: number;
  currency: string;
  proposingParty: 'WORKER' | 'CUSTOMER';
  status: BidStatus;
  scopeNotes: string;
  laborAmount: number;
  partsAllowance: number;
  platformFee: number;
  voiceTranscribed?: boolean;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  jobId: string;
  senderId: string;
  senderName: string;
  senderRole: UserRole;
  content: string;
  timestamp: string;
}

export interface SosAlert {
  id: string;
  jobId?: string;
  hazardType: 'fire' | 'water' | 'gas' | 'structural';
  status: 'RECEIVED' | 'BROADCASTING' | 'ESCALATED_911' | 'CANCELLED';
  coordinates: {
    lat: number;
    lng: number;
    address: string;
  };
  notifiedProsCount: number;
  assignedUnit?: string;
  timestamp: string;
}

export interface ReviewRecord {
  id: string;
  jobId: string;
  reviewerId: string;
  reviewerName: string;
  reviewerRole: UserRole;
  revieweeId: string;
  rating: number;
  comment: string;
  timestamp: string;
  warrantyGuaranteed: boolean;
}

export interface ServiceAgency {
  id: string;
  name: string;
  category: string;
  address: string;
  locality: string;
  city: string;
  pincode: string;
  lat: number;
  lng: number;
  phone?: string;
  website?: string;
  rating?: number;
  reviewCount?: number;
  distanceKm: number;
  isOpenNow?: boolean;
  openingHours?: string;
  isExternalListing: true;
  verifiedSource: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface RegisterPayload {
  name: string;
  email?: string;
  phone: string;
  password?: string;
  role: UserRole;
  tradeCategory?: string;
  specialtyTitle?: string;
  address?: string;
  city?: string;
  pincode?: string;
}

export interface LoginPayload {
  identifier: string;
  password?: string;
}

export interface MCPToolCall {
  tool: string;
  arguments: Record<string, unknown>;
}

export interface MCPToolResult {
  tool: string;
  success: boolean;
  data: unknown;
  message?: string;
}

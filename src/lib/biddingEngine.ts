/**
 * AegisCraft Dynamic Bidding & Escrow Calculation Engine
 */

export interface MarketCorridor {
  minEscrow: number;
  marketMean: number;
  maxSafe: number;
  safeMin: number;
  safeMax: number;
}

export const CATEGORY_MARKET_CORRIDORS: Record<string, MarketCorridor> = {
  electrical: {
    minEscrow: 50,
    marketMean: 75,
    maxSafe: 150,
    safeMin: 65,
    safeMax: 85,
  },
  plumbing: {
    minEscrow: 50,
    marketMean: 80,
    maxSafe: 160,
    safeMin: 68,
    safeMax: 92,
  },
  hvac: {
    minEscrow: 55,
    marketMean: 85,
    maxSafe: 180,
    safeMin: 72,
    safeMax: 98,
  },
  roofing: {
    minEscrow: 60,
    marketMean: 95,
    maxSafe: 220,
    safeMin: 80,
    safeMax: 110,
  },
  locksmith: {
    minEscrow: 40,
    marketMean: 65,
    maxSafe: 130,
    safeMin: 50,
    safeMax: 75,
  },
  carpentry: {
    minEscrow: 45,
    marketMean: 70,
    maxSafe: 140,
    safeMin: 55,
    safeMax: 80,
  },
  masonry: {
    minEscrow: 50,
    marketMean: 78,
    maxSafe: 150,
    safeMin: 60,
    safeMax: 88,
  },
  appliance: {
    minEscrow: 40,
    marketMean: 62,
    maxSafe: 125,
    safeMin: 48,
    safeMax: 72,
  },
};

export interface PriceBreakdown {
  total: number;
  laborAmount: number;
  partsAllowance: number;
  platformFee: number;
  isWithinCorridor: boolean;
  spreadDelta: number;
}

/**
 * Calculates itemized breakdown for a proposed bid
 * Hardware parts allowance is typically $15 base, platform fee is $0.00 (escrow covered)
 */
export function calculateBidBreakdown(
  totalAmount: number,
  tradeCategory = 'electrical',
  partsAllowance = 15
): PriceBreakdown {
  const safeTotal = Math.max(20, Math.round(totalAmount));
  const corridor = CATEGORY_MARKET_CORRIDORS[tradeCategory] || CATEGORY_MARKET_CORRIDORS.electrical;
  
  const laborAmount = Math.max(0, safeTotal - partsAllowance);
  const platformFee = 0.0; // Covered by platform escrow guarantee
  const isWithinCorridor = safeTotal >= corridor.safeMin && safeTotal <= corridor.safeMax;
  const spreadDelta = safeTotal - corridor.marketMean;

  return {
    total: safeTotal,
    laborAmount,
    partsAllowance,
    platformFee,
    isWithinCorridor,
    spreadDelta,
  };
}

/**
 * Validates legal job state transitions
 */
export function isValidJobTransition(
  currentStatus: string,
  targetStatus: string
): boolean {
  const allowedTransitions: Record<string, string[]> = {
    PENDING: ['MATCHING', 'BIDDING', 'CANCELLED'],
    MATCHING: ['BIDDING', 'ACCEPTED', 'CANCELLED'],
    BIDDING: ['ACCEPTED', 'MATCHING', 'CANCELLED'],
    ACCEPTED: ['IN_PROGRESS', 'CANCELLED'],
    IN_PROGRESS: ['COMPLETED', 'CANCELLED'],
    COMPLETED: [],
    CANCELLED: [],
  };

  return (allowedTransitions[currentStatus] || []).includes(targetStatus);
}

/**
 * AegisCraft Dynamic Bidding & Escrow Calculation Engine (India Localized)
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
    minEscrow: 450,
    marketMean: 750,
    maxSafe: 1500,
    safeMin: 650,
    safeMax: 950,
  },
  plumbing: {
    minEscrow: 500,
    marketMean: 800,
    maxSafe: 1600,
    safeMin: 680,
    safeMax: 980,
  },
  hvac: {
    minEscrow: 550,
    marketMean: 900,
    maxSafe: 1800,
    safeMin: 750,
    safeMax: 1100,
  },
  roofing: {
    minEscrow: 600,
    marketMean: 1000,
    maxSafe: 2200,
    safeMin: 800,
    safeMax: 1300,
  },
  locksmith: {
    minEscrow: 350,
    marketMean: 600,
    maxSafe: 1200,
    safeMin: 450,
    safeMax: 750,
  },
  carpentry: {
    minEscrow: 400,
    marketMean: 700,
    maxSafe: 1400,
    safeMin: 550,
    safeMax: 850,
  },
  masonry: {
    minEscrow: 450,
    marketMean: 750,
    maxSafe: 1500,
    safeMin: 600,
    safeMax: 900,
  },
  appliance: {
    minEscrow: 350,
    marketMean: 650,
    maxSafe: 1300,
    safeMin: 500,
    safeMax: 800,
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
 * Indian Rupee (INR) Formatter using en-IN locale
 * e.g., formatInr(800) -> "₹800", formatInr(12500) -> "₹12,500"
 */
export function formatInr(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Calculates itemized breakdown for a proposed bid in INR
 * Hardware parts allowance is typically ₹150 base in India, platform fee is ₹0 (escrow covered)
 */
export function calculateBidBreakdown(
  totalAmount: number,
  tradeCategory = 'electrical',
  partsAllowance = 150
): PriceBreakdown {
  const safeTotal = Math.max(100, Math.round(totalAmount));
  const corridor = CATEGORY_MARKET_CORRIDORS[tradeCategory] || CATEGORY_MARKET_CORRIDORS.electrical;
  
  const laborAmount = Math.max(0, safeTotal - partsAllowance);
  const platformFee = 0; // Covered by platform escrow guarantee
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

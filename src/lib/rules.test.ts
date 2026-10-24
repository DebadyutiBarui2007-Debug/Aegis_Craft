import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateDistanceKm, isWithinRadius, calculateEtaMinutes, calculateBearing } from './spatial.ts';
import { calculateBidBreakdown, isValidJobTransition, CATEGORY_MARKET_CORRIDORS } from './biddingEngine.ts';

test('spatial: calculates accurate distance between two Springfield geo-coordinates', () => {
  // Springfield client site: 44.0462° N, 123.0220° W
  const client = { lat: 44.0462, lng: -123.0220 };
  // Mark J. technician coords: ~0.8 km away
  const markJ = { lat: 44.0520, lng: -123.0160 };

  const distance = calculateDistanceKm(client, markJ);
  assert.ok(distance > 0.5 && distance < 1.2, `Distance should be ~0.8km, got ${distance}`);
});

test('spatial: isWithinRadius respects PostGIS ST_DWithin thresholds', () => {
  const client = { lat: 44.0462, lng: -123.0220 };
  const nearbyWorker = { lat: 44.0500, lng: -123.0200 };
  const farawayWorker = { lat: 44.1500, lng: -123.1000 };

  assert.equal(isWithinRadius(client, nearbyWorker, 3.2), true);
  assert.equal(isWithinRadius(client, farawayWorker, 3.2), false);
});

test('spatial: calculateEtaMinutes produces sane driving estimates', () => {
  assert.equal(calculateEtaMinutes(0.8, 32), 2);
  assert.equal(calculateEtaMinutes(1.4, 32), 3);
  assert.equal(calculateEtaMinutes(3.2, 32), 6);
  assert.equal(calculateEtaMinutes(0, 32), 1);
});

test('spatial: calculateBearing produces correct directional angle', () => {
  const p1 = { lat: 0, lng: 0 };
  const pNorth = { lat: 10, lng: 0 };
  const bearing = calculateBearing(p1, pNorth);
  assert.equal(Math.round(bearing), 0);
});

test('bidding: itemizes price breakdown with parts allowance and zero platform escrow fee', () => {
  const breakdown = calculateBidBreakdown(80, 'electrical', 15);
  assert.equal(breakdown.total, 80);
  assert.equal(breakdown.laborAmount, 65);
  assert.equal(breakdown.partsAllowance, 15);
  assert.equal(breakdown.platformFee, 0);
  assert.equal(breakdown.isWithinCorridor, true);
  assert.equal(breakdown.spreadDelta, 5); // 80 - 75 marketMean
});

test('bidding: correctly flags amounts outside safe market corridor', () => {
  const corridor = CATEGORY_MARKET_CORRIDORS.electrical;
  const underpriced = calculateBidBreakdown(40, 'electrical', 15);
  assert.equal(underpriced.isWithinCorridor, false);

  const overpriced = calculateBidBreakdown(200, 'electrical', 15);
  assert.equal(overpriced.isWithinCorridor, false);
});

test('state machine: permits valid transitions and denies illegal status jumps', () => {
  assert.equal(isValidJobTransition('PENDING', 'MATCHING'), true);
  assert.equal(isValidJobTransition('MATCHING', 'BIDDING'), true);
  assert.equal(isValidJobTransition('BIDDING', 'ACCEPTED'), true);
  assert.equal(isValidJobTransition('ACCEPTED', 'IN_PROGRESS'), true);
  assert.equal(isValidJobTransition('IN_PROGRESS', 'COMPLETED'), true);

  // Illegal jumps
  assert.equal(isValidJobTransition('PENDING', 'COMPLETED'), false);
  assert.equal(isValidJobTransition('COMPLETED', 'BIDDING'), false);
  assert.equal(isValidJobTransition('CANCELLED', 'IN_PROGRESS'), false);
});

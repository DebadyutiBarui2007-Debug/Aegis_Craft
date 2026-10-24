import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateDistanceKm, isWithinRadius, calculateEtaMinutes, calculateBearing } from './spatial.ts';
import { calculateBidBreakdown, isValidJobTransition, CATEGORY_MARKET_CORRIDORS } from './biddingEngine.ts';

test('spatial: calculates accurate distance between Bengaluru client site and technician', () => {
  // Indiranagar client site: 12.9784° N, 77.6408° E
  const client = { lat: 12.9784, lng: 77.6408 };
  // Rajesh Sharma technician coords: ~0.4 km away
  const rajeshSharma = { lat: 12.9810, lng: 77.6435 };

  const distance = calculateDistanceKm(client, rajeshSharma);
  assert.ok(distance > 0.2 && distance < 0.8, `Distance should be ~0.4km, got ${distance}`);
});

test('spatial: isWithinRadius respects PostGIS ST_DWithin thresholds in Bengaluru grid', () => {
  const client = { lat: 12.9784, lng: 77.6408 };
  const nearbyWorker = { lat: 12.9810, lng: 77.6435 }; // ~0.4km
  const farawayWorker = { lat: 13.1000, lng: 77.8000 }; // ~25km away

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

test('bidding: itemizes INR price breakdown with parts allowance and zero platform escrow fee', () => {
  const breakdown = calculateBidBreakdown(800, 'electrical', 150);
  assert.equal(breakdown.total, 800);
  assert.equal(breakdown.laborAmount, 650);
  assert.equal(breakdown.partsAllowance, 150);
  assert.equal(breakdown.platformFee, 0);
  assert.equal(breakdown.isWithinCorridor, true);
  assert.equal(breakdown.spreadDelta, 50); // 800 - 750 marketMean
});

test('bidding: correctly flags INR amounts outside safe market corridor', () => {
  const corridor = CATEGORY_MARKET_CORRIDORS.electrical;
  const underpriced = calculateBidBreakdown(200, 'electrical', 150);
  assert.equal(underpriced.isWithinCorridor, false);

  const overpriced = calculateBidBreakdown(3500, 'electrical', 150);
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

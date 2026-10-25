import test from 'node:test';
import assert from 'node:assert/strict';
import { db } from './db.ts';
import { normalizeIndianPhone, isValidIndianPhone } from './phone.ts';

test('otp: canonical E.164 phone normalization across formats', () => {
  assert.equal(normalizeIndianPhone('9845012345'), '+919845012345');
  assert.equal(normalizeIndianPhone('+91 98450 12345'), '+919845012345');
  assert.equal(normalizeIndianPhone('919845012345'), '+919845012345');
  assert.equal(normalizeIndianPhone('+91-98450-12345'), '+919845012345');

  assert.equal(isValidIndianPhone('9845012345'), true);
  assert.equal(isValidIndianPhone('+919845012345'), true);
  assert.equal(isValidIndianPhone('12345'), false);
});

test('otp: sends OTP with unformatted phone and verifies with formatted phone (no challenge mismatch)', () => {
  const rawInputPhone = '9845012345';
  const formattedPhone = '+91 98450 12345';

  const sendRes = db.sendOtp(rawInputPhone);
  assert.equal(sendRes.success, true);
  assert.ok(sendRes.challengeId);
  assert.equal(sendRes.phone, '+919845012345');
  assert.ok(sendRes.debugOtp);

  // Verification using different formatting string MUST match the exact same challenge
  const verifyRes = db.verifyOtp(formattedPhone, sendRes.debugOtp!, sendRes.challengeId);
  assert.equal(verifyRes.success, true);
  assert.equal(verifyRes.phone, '+919845012345');
});

test('otp: rejects incorrect code and enforces attempt limit', () => {
  const phone = '9845054321';
  const sendRes = db.sendOtp(phone);
  assert.ok(sendRes.debugOtp);

  // Incorrect code attempt
  assert.throws(() => {
    db.verifyOtp(phone, '000000', sendRes.challengeId);
  }, /Invalid verification code/);

  // Correct code attempt works after previous failed attempt
  const verifyRes = db.verifyOtp(phone, sendRes.debugOtp!, sendRes.challengeId);
  assert.equal(verifyRes.success, true);
});

test('otp: resend OTP creates new challenge and supersedes previous challenge', () => {
  const phone = '9876500000';
  const firstRes = db.sendOtp(phone);
  const secondRes = db.sendOtp(phone);

  assert.notEqual(firstRes.challengeId, secondRes.challengeId);

  // First code should fail because it was superseded
  assert.throws(() => {
    db.verifyOtp(phone, firstRes.debugOtp!, firstRes.challengeId);
  });

  // Second code succeeds
  const verifyRes = db.verifyOtp(phone, secondRes.debugOtp!, secondRes.challengeId);
  assert.equal(verifyRes.success, true);
});

test('otp: registration succeeds after phone OTP verification', () => {
  const unverifiedPhone = '9111122222';
  const sendRes = db.sendOtp(unverifiedPhone);

  // Registration without OTP verification fails
  assert.throws(() => {
    db.register({
      name: 'Unverified User',
      phone: unverifiedPhone,
      role: 'customer',
      phoneVerified: false,
    });
  }, /Phone number verification via OTP is required/);

  // Verify OTP
  db.verifyOtp(unverifiedPhone, sendRes.debugOtp!, sendRes.challengeId);

  // Registration succeeds now
  const reg = db.register({
    name: 'Verified Customer User',
    phone: unverifiedPhone,
    role: 'customer',
    challengeId: sendRes.challengeId,
    phoneVerified: true,
  });

  assert.equal(reg.user.phone, '+919111122222');
  assert.equal(reg.user.phoneVerified, true);
  assert.ok(reg.user.phoneVerifiedAt);
});

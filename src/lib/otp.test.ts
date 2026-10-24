import test from 'node:test';
import assert from 'node:assert/strict';
import { db } from './db.ts';

test('otp: sends verification code and stores challenge', () => {
  const phone = '+919845012345';
  const res = db.sendOtp(phone);
  assert.equal(res.success, true);
  assert.ok(res.debugOtp);
  assert.equal(res.debugOtp.length, 6);
});

test('otp: successfully verifies correct code and rejects incorrect code', () => {
  const phone = '+919845054321';
  const res = db.sendOtp(phone);
  const code = res.debugOtp!;

  // Incorrect code attempt
  assert.throws(() => {
    db.verifyOtp(phone, '000000');
  }, /Invalid verification code/);

  // Correct code attempt
  const verifyRes = db.verifyOtp(phone, code);
  assert.equal(verifyRes.success, true);
});

test('otp: registration requires verified phone number', () => {
  const unverifiedPhone = '+919111122222';
  const cleanPhone = unverifiedPhone.replace(/[^\d]/g, '');
  db.sendOtp(unverifiedPhone);

  // Attempt registration without verifying OTP
  assert.throws(() => {
    db.register({
      name: 'Unverified User',
      phone: unverifiedPhone,
      role: 'customer',
      phoneVerified: false,
    });
  }, /Phone number verification via OTP is required/);

  // Now verify OTP
  const challenge = db.otpChallenges.get(cleanPhone)!;
  assert.ok(challenge);
  db.verifyOtp(unverifiedPhone, challenge.code);

  // Registration should succeed now
  const reg = db.register({
    name: 'Verified User',
    phone: unverifiedPhone,
    role: 'customer',
    phoneVerified: true,
  });

  assert.equal(reg.user.phoneVerified, true);
  assert.ok(reg.user.phoneVerifiedAt);
});

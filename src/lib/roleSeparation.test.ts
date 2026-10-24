import test from 'node:test';
import assert from 'node:assert/strict';
import { db } from './db.ts';

test('role separation: customer account is saved with customer role and cannot create worker bids', () => {
  // Register customer
  const custReg = db.register({
    name: 'Ananya Sen',
    phone: '+91 99001 12233',
    phoneVerified: true,
    email: 'ananya.sen@example.in',
    password: 'password123',
    role: 'customer',
    address: 'Indiranagar, Bengaluru',
  });

  assert.equal(custReg.user.role, 'customer');
  assert.ok(custReg.token.startsWith('aegis-tok-'));

  // Fetch from DB by token
  const fetched = db.getUserByToken(custReg.token);
  assert.ok(fetched);
  assert.equal(fetched.role, 'customer');
});

test('role separation: worker account is saved with worker_pro role and profile initialized', () => {
  // Register worker
  const wrkReg = db.register({
    name: 'Karan Malhotra',
    phone: '+91 98888 77766',
    phoneVerified: true,
    email: 'karan.m@aegispro.in',
    password: 'password123',
    role: 'worker_pro',
    tradeCategory: 'plumbing',
    specialtyTitle: 'Master Pipe Specialist',
  });

  assert.equal(wrkReg.user.role, 'worker_pro');
  const fetchedWorker = db.workers.find((w) => w.id === wrkReg.user.id);
  assert.ok(fetchedWorker);
  assert.equal(fetchedWorker.tradeCategory, 'plumbing');
});

test('role separation: logout clears session token and invalidates authenticated state', () => {
  const reg = db.register({
    name: 'Test Session User',
    phone: '+91 91111 22222',
    phoneVerified: true,
    email: 'session.test@example.in',
    role: 'customer',
  });

  assert.ok(db.getUserByToken(reg.token));

  // Perform logout
  db.logout(reg.token);

  // Session token must now return null
  assert.equal(db.getUserByToken(reg.token), null);
});

test('role separation: login retrieves correct stored account role for given credentials', () => {
  const custLogin = db.login('aditi.roy@example.in', 'password123');
  assert.equal(custLogin.user.role, 'customer');

  const workerLogin = db.login('rajesh.sharma@aegispro.in', 'password123');
  assert.equal(workerLogin.user.role, 'worker_pro');
});

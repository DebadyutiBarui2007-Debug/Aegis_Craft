import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  ConfirmationResult,
  User as FirebaseUser,
} from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase App for Client
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);

import { normalizeIndianPhone, isValidIndianPhone } from './phone.ts';

export { normalizeIndianPhone, isValidIndianPhone };

/**
 * E.164 phone number validator & formatter for Indian mobile numbers (+91)
 */
export function formatIndianPhoneNumber(rawPhone: string): string {
  return normalizeIndianPhone(rawPhone);
}

export function isValidIndianPhoneNumber(rawPhone: string): boolean {
  return isValidIndianPhone(rawPhone);
}

/**
 * Initialize invisible or visible reCAPTCHA Verifier for Firebase Web Auth
 */
export function setupRecaptchaVerifier(containerId: string): RecaptchaVerifier {
  if (typeof window === 'undefined') {
    throw new Error('reCAPTCHA requires a browser environment');
  }

  const containerEl = document.getElementById(containerId);
  if (!containerEl) {
    console.warn(`reCAPTCHA container #${containerId} not found in DOM`);
  }

  if ((window as any).recaptchaVerifier) {
    try {
      (window as any).recaptchaVerifier.clear();
      (window as any).recaptchaVerifier = null;
    } catch (err) {
      console.warn('Clearing previous recaptcha verifier:', err);
    }
  }

  const verifier = new RecaptchaVerifier(auth, containerId, {
    size: 'invisible',
    callback: () => {
      // reCAPTCHA solved - proceed with phone auth
    },
    'expired-callback': () => {
      console.warn('reCAPTCHA solved state expired');
    },
  });

  (window as any).recaptchaVerifier = verifier;
  return verifier;
}

/**
 * Initiate real Firebase SMS OTP dispatch
 */
export async function sendFirebasePhoneOtp(
  rawPhone: string,
  verifier: RecaptchaVerifier
): Promise<ConfirmationResult> {
  const formattedPhone = formatIndianPhoneNumber(rawPhone);
  if (!isValidIndianPhoneNumber(rawPhone)) {
    throw new Error('Invalid 10-digit Indian mobile number. Example: +91 98450 12345');
  }
  return await signInWithPhoneNumber(auth, formattedPhone, verifier);
}

/**
 * Confirm 6-digit OTP entered by user via Firebase
 */
export async function verifyFirebasePhoneOtp(
  confirmationResult: ConfirmationResult,
  otpCode: string
): Promise<{ user: FirebaseUser; idToken: string }> {
  const cleanCode = otpCode.replace(/\D/g, '').trim();
  if (cleanCode.length !== 6) {
    throw new Error('Please enter a valid 6-digit OTP verification code.');
  }

  const result = await confirmationResult.confirm(cleanCode);
  const idToken = await result.user.getIdToken(/* forceRefresh */ true);
  return {
    user: result.user,
    idToken,
  };
}

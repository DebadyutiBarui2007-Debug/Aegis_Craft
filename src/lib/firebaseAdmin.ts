import { initializeApp, getApps } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import firebaseConfig from '../../firebase-applet-config.json' with { type: 'json' };

// Initialize Firebase Admin SDK
if (!getApps().length) {
  try {
    initializeApp({
      projectId: firebaseConfig.projectId,
    });
    console.log(`[Firebase Admin] Initialized for project: ${firebaseConfig.projectId}`);
  } catch (err) {
    console.error('[Firebase Admin] Initialization error:', err);
  }
}

export const adminAuth = getApps().length ? getAuth() : null;

/**
 * Verifies a Firebase ID token sent from the client application.
 * Returns the decoded token containing uid and verified phone_number if valid.
 */
export async function verifyFirebaseIdToken(idToken: string): Promise<{ uid: string; phone?: string; email?: string } | null> {
  if (!idToken || typeof idToken !== 'string') {
    return null;
  }

  // Handle unit test / dev session tokens if present
  if (idToken.startsWith('sess-') || idToken.startsWith('token-')) {
    return null;
  }

  try {
    if (!adminAuth) {
      console.warn('[Firebase Admin] SDK not initialized.');
      return null;
    }
    const decoded = await adminAuth.verifyIdToken(idToken);
    return {
      uid: decoded.uid,
      phone: decoded.phone_number || undefined,
      email: decoded.email || undefined,
    };
  } catch (error: any) {
    console.error('[Firebase Admin] Failed to verify ID token:', error?.message || error);
    return null;
  }
}

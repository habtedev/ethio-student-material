import { initializeApp, getApps, cert, App } from 'firebase-admin/app';
import { getFirestore, Firestore, QueryDocumentSnapshot } from 'firebase-admin/firestore';
import { getAuth, Auth } from 'firebase-admin/auth';

// Singleton to prevent multiple Firebase Admin initializations across Next.js hot reloads
function getFirebaseAdminApp(): App | null {
  const existingApps = getApps();
  if (existingApps.length > 0) {
    return existingApps[0];
  }

  // 1. Try full JSON service account string or base64
  const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  if (serviceAccountJson && serviceAccountJson.trim().length > 10) {
    try {
      const parsed = serviceAccountJson.trim();
      if (parsed.startsWith('{')) {
        const serviceAccount = JSON.parse(parsed);
        return initializeApp({
          credential: cert(serviceAccount),
        });
      } else {
        const decoded = Buffer.from(parsed, 'base64').toString('utf-8');
        const serviceAccount = JSON.parse(decoded);
        return initializeApp({
          credential: cert(serviceAccount),
        });
      }
    } catch (err) {
      console.error('⚠️ Failed to parse FIREBASE_SERVICE_ACCOUNT_KEY JSON:', err);
    }
  }

  // 2. Try individual environment variables
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  let privateKey = process.env.FIREBASE_PRIVATE_KEY;

  if (
    projectId &&
    clientEmail &&
    privateKey &&
    privateKey.includes('BEGIN PRIVATE KEY')
  ) {
    try {
      privateKey = privateKey.replace(/\\n/g, '\n');
      return initializeApp({
        credential: cert({
          projectId,
          clientEmail,
          privateKey,
        }),
      });
    } catch (err) {
      console.error('⚠️ Failed to initialize Firebase Admin with individual credentials:', err);
    }
  }

  // Return null if credentials are not provided or incomplete
  return null;
}

export const firebaseAdminApp: App | null = getFirebaseAdminApp();
export const adminDb: Firestore | null = firebaseAdminApp ? getFirestore(firebaseAdminApp) : null;
export const adminAuth: Auth | null = firebaseAdminApp ? getAuth(firebaseAdminApp) : null;
export type { QueryDocumentSnapshot };

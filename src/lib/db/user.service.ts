import fs from 'fs';
import path from 'path';
import { adminDb, QueryDocumentSnapshot } from '@/src/lib/firebase/admin';
import { TelegramUser, BotStats } from '@/src/types/database';

const USERS_COLLECTION = 'users';
const LOCAL_DATA_DIR = path.join(process.cwd(), 'data');
const LOCAL_USERS_FILE = path.join(LOCAL_DATA_DIR, 'users.json');

// In-memory fallback cache backed by local JSON file
const memoryUsersCache = new Map<number, TelegramUser>();

function loadLocalUsers() {
  try {
    if (!fs.existsSync(LOCAL_DATA_DIR)) {
      fs.mkdirSync(LOCAL_DATA_DIR, { recursive: true });
    }
    if (fs.existsSync(LOCAL_USERS_FILE)) {
      const data = fs.readFileSync(LOCAL_USERS_FILE, 'utf-8');
      const parsed = JSON.parse(data) as TelegramUser[];
      parsed.forEach((u) => {
        if (u.telegramId) memoryUsersCache.set(u.telegramId, u);
      });
    }
  } catch (err) {
    // ignore
  }
}

function saveLocalUsers() {
  try {
    if (!fs.existsSync(LOCAL_DATA_DIR)) {
      fs.mkdirSync(LOCAL_DATA_DIR, { recursive: true });
    }
    const arr = Array.from(memoryUsersCache.values());
    fs.writeFileSync(LOCAL_USERS_FILE, JSON.stringify(arr, null, 2), 'utf-8');
  } catch (err) {
    // ignore
  }
}

// Initial load
loadLocalUsers();

/**
 * Upsert (Create or Update) Telegram User in Firestore / Local Store
 */
export async function upsertTelegramUser(
  data: Partial<TelegramUser> & { telegramId: number; phoneNumber?: string }
): Promise<TelegramUser> {
  const now = new Date().toISOString();
  const telegramIdStr = String(data.telegramId);

  if (adminDb) {
    try {
      const userRef = adminDb.collection(USERS_COLLECTION).doc(telegramIdStr);
      const doc = await userRef.get();

      if (doc.exists) {
        const existing = doc.data() as TelegramUser;
        const isPremiumVal = data.isPremium !== undefined ? data.isPremium : true;
        const updatedUser: TelegramUser = {
          ...existing,
          ...data,
          telegramId: data.telegramId,
          firstName: data.firstName ?? existing.firstName ?? 'Student',
          phoneNumber: data.phoneNumber ?? existing.phoneNumber ?? '',
          isVerified: !!(data.phoneNumber || existing.phoneNumber),
          isPremium: isPremiumVal,
          plan: isPremiumVal ? 'premium' : 'free',
          role: data.role ?? existing.role ?? 'student',
          updatedAt: now,
          lastActiveAt: now,
        };

        await userRef.set(updatedUser, { merge: true });
        memoryUsersCache.set(data.telegramId, updatedUser);
        saveLocalUsers();
        return updatedUser;
      } else {
        const isPremiumVal = data.isPremium !== undefined ? data.isPremium : true;
        const newUser: TelegramUser = {
          id: telegramIdStr,
          telegramId: data.telegramId,
          firstName: data.firstName || 'Freshman',
          lastName: data.lastName || null,
          username: data.username || null,
          phoneNumber: data.phoneNumber || '',
          languageCode: data.languageCode || 'am',
          grade: data.grade || 'Freshman Year',
          stream: data.stream || null,
          isVerified: !!data.phoneNumber,
          isPremium: isPremiumVal,
          plan: isPremiumVal ? 'premium' : 'free',
          premiumUntil: data.premiumUntil || null,
          role: data.role || 'student',
          createdAt: now,
          updatedAt: now,
          lastActiveAt: now,
        };

        await userRef.set(newUser);
        memoryUsersCache.set(data.telegramId, newUser);
        saveLocalUsers();
        return newUser;
      }
    } catch (error) {
      console.error('❌ Firestore write error (using local database):', error);
    }
  }

  // Persistent local file store fallback
  const existing = memoryUsersCache.get(data.telegramId);
  const isPremiumVal = data.isPremium !== undefined ? data.isPremium : true;
  const user: TelegramUser = {
    id: telegramIdStr,
    telegramId: data.telegramId,
    firstName: data.firstName || existing?.firstName || 'Freshman',
    lastName: data.lastName !== undefined ? data.lastName : existing?.lastName || null,
    username: data.username !== undefined ? data.username : existing?.username || null,
    phoneNumber: data.phoneNumber || existing?.phoneNumber || '',
    languageCode: data.languageCode || existing?.languageCode || 'am',
    grade: data.grade || existing?.grade || 'Freshman Year',
    stream: data.stream || existing?.stream || null,
    isVerified: !!(data.phoneNumber || existing?.phoneNumber),
    isPremium: isPremiumVal,
    plan: isPremiumVal ? 'premium' : (existing?.plan || 'free'),
    premiumUntil: data.premiumUntil !== undefined ? data.premiumUntil : (existing?.premiumUntil || null),
    role: data.role || existing?.role || 'student',
    createdAt: existing?.createdAt || now,
    updatedAt: now,
    lastActiveAt: now,
  };

  memoryUsersCache.set(data.telegramId, user);
  saveLocalUsers();
  return user;
}

/**
 * Retrieve user by their Telegram ID
 */
export async function getUserByTelegramId(telegramId: number): Promise<TelegramUser | null> {
  const telegramIdStr = String(telegramId);

  if (adminDb) {
    try {
      const doc = await adminDb.collection(USERS_COLLECTION).doc(telegramIdStr).get();
      if (doc.exists) {
        return doc.data() as TelegramUser;
      }
    } catch (error) {
      // Fallback to local memory cache
    }
  }

  loadLocalUsers();
  return memoryUsersCache.get(telegramId) || null;
}
/**
 * Check if a user currently has active Premium access
 */
export async function isUserPremium(telegramId: number): Promise<boolean> {
  const user = await getUserByTelegramId(telegramId);
  return user?.isPremium ?? true;
}

/**
 * Delete a user from Firestore and local cache
 */
export async function deleteTelegramUser(telegramId: number): Promise<boolean> {
  const telegramIdStr = String(telegramId);

  if (adminDb) {
    try {
      await adminDb.collection(USERS_COLLECTION).doc(telegramIdStr).delete();
    } catch (error) {
      console.error('❌ Firestore delete error (using local database):', error);
    }
  }

  const removed = memoryUsersCache.delete(telegramId);
  saveLocalUsers();
  return removed;
}

/**
 * Grant or Revoke Premium access for a user
 */
export async function setPremiumStatus(
  telegramId: number,
  isPremium: boolean,
  durationDays = 30
): Promise<TelegramUser | null> {
  let premiumUntil: string | null = null;
  if (isPremium) {
    const expDate = new Date();
    expDate.setDate(expDate.getDate() + durationDays);
    premiumUntil = expDate.toISOString();
  }

  return upsertTelegramUser({
    telegramId,
    isPremium,
    plan: isPremium ? 'premium' : 'free',
    premiumUntil,
  });
}

/**
 * Update user's selected Grade and Stream
 */
export async function updateUserGrade(
  telegramId: number,
  grade: string,
  stream?: 'Natural' | 'Social' | 'General'
): Promise<TelegramUser | null> {
  return upsertTelegramUser({
    telegramId,
    grade,
    stream: stream || null,
  });
}

/**
 * List all registered users
 */
export async function getAllUsers(limitCount = 50): Promise<TelegramUser[]> {
  if (adminDb) {
    try {
      const snapshot = await adminDb
        .collection(USERS_COLLECTION)
        .orderBy('createdAt', 'desc')
        .limit(limitCount)
        .get();

      return snapshot.docs.map((doc: QueryDocumentSnapshot) => doc.data() as TelegramUser);
    } catch (error) {
      // Fallback to local store
    }
  }

  return Array.from(memoryUsersCache.values());
}

/**
 * Get aggregated statistics
 */
export async function getBotStats(): Promise<BotStats> {
  const users = await getAllUsers(500);
  const verifiedCount = users.filter((u) => u.phoneNumber && u.phoneNumber.length > 5).length;
  const premiumCount = users.filter((u) => u.isPremium).length;

  return {
    totalUsers: users.length,
    verifiedWithPhone: verifiedCount,
    premiumUsers: premiumCount,
    activeToday: users.filter((u) => {
      const diff = Date.now() - new Date(u.lastActiveAt).getTime();
      return diff < 24 * 60 * 60 * 1000;
    }).length,
    totalMaterials: 48,
  };
}

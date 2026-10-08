import fs from 'fs';
import path from 'path';
import { adminDb } from '@/src/lib/firebase/admin';
import { UniversityInfo } from '@/src/types/database';

const UNIVERSITIES_COLLECTION = 'universities';
const LOCAL_DATA_DIR = path.join(process.cwd(), 'data');
const LOCAL_UNIVERSITIES_FILE = path.join(LOCAL_DATA_DIR, 'universities.json');

// Default Seed Universities with Reviews
const DEFAULT_SEED_UNIVERSITIES: UniversityInfo[] = [
  {
    id: 'uni_aau',
    code: 'AAU',
    name: 'Addis Ababa University',
    city: 'Addis Ababa',
    rating: 4.9,
    reviewDescription: 'Ethiopia’s premier and oldest university. Renowned for intense academic competition, prestigious alumni, rich library resources (John F. Kennedy Memorial Library), and cutting-edge research institutes. 4 Kilo and 5 Kilo campuses have strong engineering hackathons and tech communities.',
    createdAt: new Date(Date.now() - 35 * 24 * 3600 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'uni_astu',
    code: 'ASTU',
    name: 'Adama Science & Technology University',
    city: 'Adama (Nazret)',
    rating: 4.8,
    reviewDescription: 'Specialized national Center of Excellence in STEM and Applied Sciences. Fast-paced curriculum with dedicated engineering laboratories, advanced robotics workshops, modern student dormitories, and warm sunny weather year-round.',
    createdAt: new Date(Date.now() - 32 * 24 * 3600 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'uni_aastu',
    code: 'AASTU',
    name: 'Addis Ababa Science & Technology University',
    city: 'Kilinto, Addis Ababa',
    rating: 4.8,
    reviewDescription: 'Ethiopia’s state-of-the-art technological university located at Kilinto. Features modern research incubation hubs, clean campus environment, digital smart classrooms, and active industry linkages.',
    createdAt: new Date(Date.now() - 30 * 24 * 3600 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'uni_ju',
    code: 'JU',
    name: 'Jimma University',
    city: 'Jimma',
    rating: 4.7,
    reviewDescription: 'Consistently ranked among the top universities in East Africa for Health and Community-Based Education. Lush green campus environment with excellent clinical hospital attachments and a welcoming student community.',
    createdAt: new Date(Date.now() - 28 * 24 * 3600 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'uni_bdu',
    code: 'BDU',
    name: 'Bahir Dar University',
    city: 'Bahir Dar',
    rating: 4.7,
    reviewDescription: 'Spectacular campus settings beside Lake Tana and the Blue Nile. Hosts the famous Ethiopian Maritime Training Institute, modern engineering faculties, and vibrant student recreational facilities.',
    createdAt: new Date(Date.now() - 25 * 24 * 3600 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'uni_hu',
    code: 'HU',
    name: 'Hawassa University',
    city: 'Hawassa',
    rating: 4.8,
    reviewDescription: 'One of the cleanest and most scenic universities in Ethiopia located along Lake Hawassa. Outstanding medical referral hospital and famous Wondo Genet specialized college.',
    createdAt: new Date(Date.now() - 22 * 24 * 3600 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'uni_gondar',
    code: 'UoG',
    name: 'University of Gondar',
    city: 'Gondar',
    rating: 4.7,
    reviewDescription: 'Historic institution founded in 1954 as the Public Health College. Renowned nationally for producing top medical professionals, ophthalmic surgeons, and dedicated healthcare researchers.',
    createdAt: new Date(Date.now() - 20 * 24 * 3600 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'uni_amu',
    code: 'AMU',
    name: 'Arba Minch University',
    city: 'Arba Minch',
    rating: 4.6,
    reviewDescription: 'Nationally celebrated as the Water Capital of Ethiopian higher education through AWTI. Exceptional engineering hydrology facilities nestled between Lake Abaya and Lake Chamo.',
    createdAt: new Date(Date.now() - 18 * 24 * 3600 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const universitiesCache = new Map<string, UniversityInfo>();

function ensureDataDir() {
  if (!fs.existsSync(LOCAL_DATA_DIR)) {
    fs.mkdirSync(LOCAL_DATA_DIR, { recursive: true });
  }
}

function loadLocalUniversities(): void {
  try {
    ensureDataDir();
    if (fs.existsSync(LOCAL_UNIVERSITIES_FILE)) {
      const content = fs.readFileSync(LOCAL_UNIVERSITIES_FILE, 'utf-8');
      const parsed = JSON.parse(content) as UniversityInfo[];
      if (Array.isArray(parsed) && parsed.length > 0) {
        universitiesCache.clear();
        parsed.forEach((u) => universitiesCache.set(u.id, u));
        return;
      }
    }

    // Seed defaults
    universitiesCache.clear();
    DEFAULT_SEED_UNIVERSITIES.forEach((u) => universitiesCache.set(u.id, u));
    saveLocalUniversities();
  } catch (err) {
    console.error('Error loading local universities:', err);
    DEFAULT_SEED_UNIVERSITIES.forEach((u) => universitiesCache.set(u.id, u));
  }
}

function saveLocalUniversities(): void {
  try {
    ensureDataDir();
    const list = Array.from(universitiesCache.values());
    fs.writeFileSync(LOCAL_UNIVERSITIES_FILE, JSON.stringify(list, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving local universities:', err);
  }
}

// Initial sync
loadLocalUniversities();

/**
 * Retrieve all universities with optional search
 */
export async function getAllUniversities(options?: { search?: string }): Promise<UniversityInfo[]> {
  loadLocalUniversities();
  let list = Array.from(universitiesCache.values());

  if (options?.search && options.search.trim()) {
    const q = options.search.toLowerCase().trim();
    list = list.filter(
      (u) =>
        u.name.toLowerCase().includes(q) ||
        (u.code && u.code.toLowerCase().includes(q)) ||
        (u.city && u.city.toLowerCase().includes(q)) ||
        (u.reviewDescription && u.reviewDescription.toLowerCase().includes(q))
    );
  }

  return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

/**
 * Add / Create a new university review
 */
export async function createUniversity(
  data: Omit<UniversityInfo, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }
): Promise<UniversityInfo> {
  const now = new Date().toISOString();
  const id = data.id || `uni_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

  const newUni: UniversityInfo = {
    ...data,
    id,
    rating: data.rating || 4.8,
    createdAt: now,
    updatedAt: now,
  };

  if (adminDb) {
    try {
      await adminDb.collection(UNIVERSITIES_COLLECTION).doc(id).set(newUni);
    } catch (e) {
      console.warn('Firestore write fallback for university:', e);
    }
  }

  universitiesCache.set(id, newUni);
  saveLocalUniversities();
  return newUni;
}

/**
 * Delete a university by ID
 */
export async function deleteUniversity(id: string): Promise<boolean> {
  if (adminDb) {
    try {
      await adminDb.collection(UNIVERSITIES_COLLECTION).doc(id).delete();
    } catch (e) {
      console.warn('Firestore delete fallback for university:', e);
    }
  }

  loadLocalUniversities();
  const existed = universitiesCache.delete(id);
  saveLocalUniversities();
  return existed;
}

/**
 * Get single university
 */
export async function getUniversityById(id: string): Promise<UniversityInfo | null> {
  loadLocalUniversities();
  return universitiesCache.get(id) || null;
}

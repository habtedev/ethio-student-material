import fs from 'fs';
import path from 'path';
import { adminDb } from '@/src/lib/firebase/admin';
import { DepartmentInfo } from '@/src/types/database';

const DEPARTMENTS_COLLECTION = 'departments';
const LOCAL_DATA_DIR = path.join(process.cwd(), 'data');
const LOCAL_DEPARTMENTS_FILE = path.join(LOCAL_DATA_DIR, 'departments.json');

// Default Seed Departments for Ethiopian Universities
const DEFAULT_SEED_DEPARTMENTS: DepartmentInfo[] = [
  {
    id: 'dept_cs_se',
    title: 'Computer Science & Software Engineering',
    stream: 'Natural',
    description: 'The highest-demand technology field in Ethiopia focusing on software development lifecycle, algorithms, data structures, cloud infrastructure, web development, mobile apps, and artificial intelligence systems.',
    createdAt: new Date(Date.now() - 30 * 24 * 3600 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'dept_med',
    title: 'Medicine (MD) & Health Sciences',
    stream: 'Natural',
    description: 'Prestigious clinical medical education leading to Doctor of Medicine (MD) across top teaching referral hospitals (Tikur Anbessa, Jimma, Gondar, Hawassa) with deep clinical training.',
    createdAt: new Date(Date.now() - 28 * 24 * 3600 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'dept_ece',
    title: 'Electrical & Computer Engineering',
    stream: 'Natural',
    description: 'Comprehensive engineering degree covering communications systems, electronics, microprocessors, power generation, embedded systems, and industrial control automation.',
    createdAt: new Date(Date.now() - 26 * 24 * 3600 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'dept_civil',
    title: 'Civil & Construction Engineering',
    stream: 'Natural',
    description: 'Core engineering discipline responsible for designing, constructing, and maintaining roads, bridges, dams, and modern high-rise buildings across Ethiopia.',
    createdAt: new Date(Date.now() - 24 * 24 * 3600 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'dept_mech',
    title: 'Mechanical & Mechatronics Engineering',
    stream: 'Natural',
    description: 'Design and manufacturing of mechanical devices, thermal systems, industrial automation, robotics, HVAC, and aerospace propulsion systems.',
    createdAt: new Date(Date.now() - 22 * 24 * 3600 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'dept_law',
    title: 'School of Law (LLB)',
    stream: 'Social',
    description: 'Premier legal education focusing on constitutional law, criminal jurisprudence, commercial trade agreements, human rights, and Ethiopian civil code.',
    createdAt: new Date(Date.now() - 20 * 24 * 3600 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'dept_accounting',
    title: 'Accounting, Finance & Banking',
    stream: 'Social',
    description: 'Core financial management discipline covering accounting standards, auditing, financial markets, banking operations, taxation laws, and investment strategies.',
    createdAt: new Date(Date.now() - 18 * 24 * 3600 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'dept_econ',
    title: 'Economics & Development Studies',
    stream: 'Social',
    description: 'Study of resource allocation, econometric modeling, trade policy, financial systems, and macro-economic development strategies across East Africa.',
    createdAt: new Date(Date.now() - 16 * 24 * 3600 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const departmentsCache = new Map<string, DepartmentInfo>();

function ensureDataDir() {
  if (!fs.existsSync(LOCAL_DATA_DIR)) {
    fs.mkdirSync(LOCAL_DATA_DIR, { recursive: true });
  }
}

function loadLocalDepartments(): void {
  try {
    ensureDataDir();
    if (fs.existsSync(LOCAL_DEPARTMENTS_FILE)) {
      const content = fs.readFileSync(LOCAL_DEPARTMENTS_FILE, 'utf-8');
      const parsed = JSON.parse(content) as DepartmentInfo[];
      if (Array.isArray(parsed) && parsed.length > 0) {
        departmentsCache.clear();
        parsed.forEach((d) => departmentsCache.set(d.id, d));
        return;
      }
    }

    // Seed defaults
    departmentsCache.clear();
    DEFAULT_SEED_DEPARTMENTS.forEach((d) => departmentsCache.set(d.id, d));
    saveLocalDepartments();
  } catch (err) {
    console.error('Error loading local departments:', err);
    DEFAULT_SEED_DEPARTMENTS.forEach((d) => departmentsCache.set(d.id, d));
  }
}

function saveLocalDepartments(): void {
  try {
    ensureDataDir();
    const list = Array.from(departmentsCache.values());
    fs.writeFileSync(LOCAL_DEPARTMENTS_FILE, JSON.stringify(list, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving local departments:', err);
  }
}

// Initial sync
loadLocalDepartments();

/**
 * Retrieve all department placements with optional filtering
 */
export async function getAllDepartments(options?: {
  stream?: string;
  search?: string;
}): Promise<DepartmentInfo[]> {
  loadLocalDepartments();
  let list = Array.from(departmentsCache.values());

  if (options?.stream && options.stream !== 'all') {
    const s = options.stream.toLowerCase();
    list = list.filter((d) => !d.stream || d.stream.toLowerCase() === s || d.stream.toLowerCase() === 'both');
  }

  if (options?.search && options.search.trim()) {
    const q = options.search.toLowerCase().trim();
    list = list.filter(
      (d) =>
        d.title.toLowerCase().includes(q) ||
        (d.description && d.description.toLowerCase().includes(q))
    );
  }

  // Sort by latest created or updated
  return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

/**
 * Add / Create a new department
 */
export async function createDepartment(
  data: Omit<DepartmentInfo, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }
): Promise<DepartmentInfo> {
  const now = new Date().toISOString();
  const id = data.id || `dept_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

  const newDept: DepartmentInfo = {
    ...data,
    id,
    createdAt: now,
    updatedAt: now,
  };

  if (adminDb) {
    try {
      await adminDb.collection(DEPARTMENTS_COLLECTION).doc(id).set(newDept);
    } catch (e) {
      console.warn('Firestore write fallback for department:', e);
    }
  }

  departmentsCache.set(id, newDept);
  saveLocalDepartments();
  return newDept;
}

/**
 * Delete a department by ID
 */
export async function deleteDepartment(id: string): Promise<boolean> {
  if (adminDb) {
    try {
      await adminDb.collection(DEPARTMENTS_COLLECTION).doc(id).delete();
    } catch (e) {
      console.warn('Firestore delete fallback for department:', e);
    }
  }

  loadLocalDepartments();
  const existed = departmentsCache.delete(id);
  saveLocalDepartments();
  return existed;
}

/**
 * Get single department
 */
export async function getDepartmentById(id: string): Promise<DepartmentInfo | null> {
  loadLocalDepartments();
  return departmentsCache.get(id) || null;
}

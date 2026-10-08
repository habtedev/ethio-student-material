import fs from 'fs';
import path from 'path';
import { adminDb } from '@/src/lib/firebase/admin';
import { CourseMaterial, MaterialCategory, MaterialStream } from '@/src/types/database';

const MATERIALS_COLLECTION = 'materials';
const LOCAL_DATA_DIR = path.join(process.cwd(), 'data');
const LOCAL_MATERIALS_FILE = path.join(LOCAL_DATA_DIR, 'materials.json');

// Default Seed Materials for Ethiopian University Freshmen
const DEFAULT_SEED_MATERIALS: CourseMaterial[] = [
  // 1. MODULES (Official MoE Textbooks)
  {
    id: 'mat_mod_1',
    title: 'Mathematics for Natural Sciences Official Module',
    code: 'MATH101',
    courseName: 'Mathematics for Natural Sciences',
    category: 'module',
    stream: 'Natural',
    university: 'Ministry of Education (MoE)',
    semester: 'Semester 1',
    credits: 4,
    fileUrl: 'https://res.cloudinary.com/demo/image/upload/v1/samples/math101_module.pdf',
    fileSize: '14.2 MB',
    fileFormat: 'pdf',
    description: 'Standard national freshman curriculum module covering Propositional Logic, Functions, Analytic Geometry, and Differential Calculus.',
    downloadsCount: 1420,
    createdAt: new Date(Date.now() - 30 * 24 * 3600 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'mat_mod_2',
    title: 'General Physics (Mechanics & Heat) Student Module',
    code: 'PHYS101',
    courseName: 'General Physics',
    category: 'module',
    stream: 'Natural',
    university: 'MoE / AAiT Archive',
    semester: 'Semester 1',
    credits: 3,
    fileUrl: 'https://res.cloudinary.com/demo/image/upload/v1/samples/phys101_module.pdf',
    fileSize: '18.5 MB',
    fileFormat: 'pdf',
    description: 'Complete physics module covering Vectors, Kinematics, Newton Laws of Motion, Work-Energy, Thermodynamics, and Rotational Motion.',
    downloadsCount: 1180,
    createdAt: new Date(Date.now() - 28 * 24 * 3600 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'mat_mod_3',
    title: 'Mathematics for Social Sciences Official Module',
    code: 'MATH102',
    courseName: 'Mathematics for Social Sciences',
    category: 'module',
    stream: 'Social',
    university: 'Ministry of Education (MoE)',
    semester: 'Semester 1',
    credits: 4,
    fileUrl: 'https://res.cloudinary.com/demo/image/upload/v1/samples/math_social_module.pdf',
    fileSize: '12.0 MB',
    fileFormat: 'pdf',
    description: 'National freshman curriculum for Social Sciences: Matrices, Linear Programming, Financial Mathematics, and Intro to Calculus.',
    downloadsCount: 890,
    createdAt: new Date(Date.now() - 25 * 24 * 3600 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },

  // 2. NOTES (Lecture Summaries & Slides)
  {
    id: 'mat_note_1',
    title: 'Critical Thinking & Logic Concise Chapter Summary',
    code: 'LOGIC101',
    courseName: 'Critical Thinking and Informal Logic',
    category: 'notes',
    stream: 'Natural',
    university: 'Addis Ababa University (AAU)',
    semester: 'Semester 1',
    credits: 3,
    fileUrl: 'https://res.cloudinary.com/demo/image/upload/v1/samples/logic101_summary.pdf',
    fileSize: '6.4 MB',
    fileFormat: 'pdf',
    description: 'Condensed review notes based on Patrick J. Hurley: Fallacies, Categorical Syllogisms, Truth Tables, and Venn Diagrams.',
    downloadsCount: 960,
    createdAt: new Date(Date.now() - 20 * 24 * 3600 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'mat_note_2',
    title: 'General Psychology Full Chapter Powerpoint Slides',
    code: 'PSYC101',
    courseName: 'General Psychology',
    category: 'notes',
    stream: 'Both',
    university: 'Jimma University (JU)',
    semester: 'Semester 1',
    credits: 3,
    fileUrl: 'https://res.cloudinary.com/demo/image/upload/v1/samples/psychology_slides.pdf',
    fileSize: '5.8 MB',
    fileFormat: 'pdf',
    description: 'Detailed lecture notes covering Sensation & Perception, Memory systems, Learning Theories (Classical & Operant conditioning), and Personality.',
    downloadsCount: 750,
    createdAt: new Date(Date.now() - 18 * 24 * 3600 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'mat_note_3',
    title: 'Introduction to Economics (Micro & Macro) Handout',
    code: 'ECON101',
    courseName: 'Introduction to Economics',
    category: 'notes',
    stream: 'Social',
    university: 'AAU FBE Department',
    semester: 'Semester 1',
    credits: 3,
    fileUrl: 'https://res.cloudinary.com/demo/image/upload/v1/samples/econ101_notes.pdf',
    fileSize: '7.5 MB',
    fileFormat: 'pdf',
    description: 'Core concepts of Demand & Supply elasticity, Consumer Theory, Market Structures, National Income Accounting, and Inflation.',
    downloadsCount: 640,
    createdAt: new Date(Date.now() - 17 * 24 * 3600 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },

  // 3. WORKSHEETS (Practice Problems & Step-by-Step Questions)
  {
    id: 'mat_work_1',
    title: 'Emerging Technologies Practice Exercises & Answers',
    code: 'EMERG101',
    courseName: 'Emerging Technologies',
    category: 'worksheet',
    stream: 'Both',
    university: 'Ministry of Innovation & Technology (MInT)',
    semester: 'Semester 1',
    credits: 3,
    fileUrl: 'https://res.cloudinary.com/demo/image/upload/v1/samples/emerging_tech_worksheet.pdf',
    fileSize: '8.1 MB',
    fileFormat: 'pdf',
    description: 'Comprehensive review worksheet covering AI, Machine Learning, IoT architectures, Cloud Computing, Cybersecurity, and Data Science.',
    downloadsCount: 820,
    createdAt: new Date(Date.now() - 15 * 24 * 3600 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'mat_work_2',
    title: 'Moral and Civics Education Chapter Review Sheet',
    code: 'CIVICS101',
    courseName: 'Moral and Civics Education',
    category: 'worksheet',
    stream: 'Social',
    university: 'Addis Ababa University',
    semester: 'Semester 1',
    credits: 3,
    fileUrl: 'https://res.cloudinary.com/demo/image/upload/v1/samples/civics_worksheet.pdf',
    fileSize: '5.1 MB',
    fileFormat: 'pdf',
    description: 'Ethics, Democratic governance, Constitutionalism in Ethiopia, and Human Rights practice questions.',
    downloadsCount: 510,
    createdAt: new Date(Date.now() - 14 * 24 * 3600 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },

  // 4. ASSIGNMENTS (Tutorials & Solved Steps)
  {
    id: 'mat_ass_1',
    title: 'Communicative English Grammar & Writing Assignment',
    code: 'ENG101',
    courseName: 'Communicative English Language Skills',
    category: 'assignment',
    stream: 'Both',
    university: 'ASTU English Department',
    semester: 'Semester 1',
    credits: 3,
    fileUrl: 'https://res.cloudinary.com/demo/image/upload/v1/samples/english_assignment.pdf',
    fileSize: '4.2 MB',
    fileFormat: 'pdf',
    description: 'Complete tutorial questions on Paragraph development, Reading Comprehension, Sentence Structure, and Academic Vocabulary.',
    downloadsCount: 920,
    createdAt: new Date(Date.now() - 12 * 24 * 3600 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'mat_ass_2',
    title: 'Math for Natural Semester 1 Group Assignment with Solutions',
    code: 'MATH101',
    courseName: 'Mathematics for Natural Sciences',
    category: 'assignment',
    stream: 'Natural',
    university: 'Hawassa University (HU)',
    semester: 'Semester 1',
    credits: 4,
    fileUrl: 'https://res.cloudinary.com/demo/image/upload/v1/samples/math_assignment_solved.pdf',
    fileSize: '3.8 MB',
    fileFormat: 'pdf',
    description: 'Step-by-step solved assignment on limits, continuity, derivative techniques, and trigonometric identities.',
    downloadsCount: 1350,
    createdAt: new Date(Date.now() - 10 * 24 * 3600 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },

  // 5. MID EXAMS (Past Papers with Answer Keys)
  {
    id: 'mat_mid_1',
    title: 'AAU 2023/2024 Math for Natural Mid Exam with Answer Key',
    code: 'MATH101',
    courseName: 'Mathematics for Natural Sciences',
    category: 'mid_exam',
    stream: 'Natural',
    university: 'Addis Ababa University (4 Kilo)',
    semester: 'Semester 1',
    credits: 4,
    fileUrl: 'https://res.cloudinary.com/demo/image/upload/v1/samples/aau_math_mid_2024.pdf',
    fileSize: '3.5 MB',
    fileFormat: 'pdf',
    description: 'Official 30-mark midterm exam paper from AAU Faculty of Natural & Computational Sciences with verified detailed solutions.',
    downloadsCount: 2150,
    createdAt: new Date(Date.now() - 8 * 24 * 3600 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'mat_mid_2',
    title: 'Geography of Ethiopia and the Horn Mid Exam Archive',
    code: 'GEOG101',
    courseName: 'Geography of Ethiopia and the Horn',
    category: 'mid_exam',
    stream: 'Both',
    university: 'Bahir Dar University (BDU)',
    semester: 'Semester 1',
    credits: 3,
    fileUrl: 'https://res.cloudinary.com/demo/image/upload/v1/samples/geography_mid_exam.pdf',
    fileSize: '3.9 MB',
    fileFormat: 'pdf',
    description: 'Topography of the Horn, Geological processes, Climate zones of Ethiopia, and Drainage systems with marked keys.',
    downloadsCount: 980,
    createdAt: new Date(Date.now() - 6 * 24 * 3600 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'mat_mid_3',
    title: 'ASTU General Physics Midterm Exam Past Paper',
    code: 'PHYS101',
    courseName: 'General Physics',
    category: 'mid_exam',
    stream: 'Natural',
    university: 'Adama Science & Technology University',
    semester: 'Semester 1',
    credits: 3,
    fileUrl: 'https://res.cloudinary.com/demo/image/upload/v1/samples/astu_physics_mid.pdf',
    fileSize: '4.1 MB',
    fileFormat: 'pdf',
    description: 'ASTU department of Applied Physics midterm test questions with complete working equations.',
    downloadsCount: 1620,
    createdAt: new Date(Date.now() - 5 * 24 * 3600 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },

  // 6. FINAL EXAMS (University Finals Archive)
  {
    id: 'mat_fin_1',
    title: 'AASTU 2024 Calculus Final Examination with Solution Sheet',
    code: 'MATH101',
    courseName: 'Mathematics for Natural Sciences',
    category: 'final_exam',
    stream: 'Natural',
    university: 'AASTU (Kilinto)',
    semester: 'Semester 1',
    credits: 4,
    fileUrl: 'https://res.cloudinary.com/demo/image/upload/v1/samples/aastu_math_final_2024.pdf',
    fileSize: '5.2 MB',
    fileFormat: 'pdf',
    description: '50-mark final semester paper with full steps on integrals, optimization, series, and polar coordinates.',
    downloadsCount: 2480,
    createdAt: new Date(Date.now() - 4 * 24 * 3600 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'mat_fin_2',
    title: 'Inclusiveness in Higher Education Final Exam Question Bank',
    code: 'INCL101',
    courseName: 'Inclusiveness',
    category: 'final_exam',
    stream: 'Both',
    university: 'Jimma University (JU)',
    semester: 'Semester 1',
    credits: 2,
    fileUrl: 'https://res.cloudinary.com/demo/image/upload/v1/samples/inclusiveness_final.pdf',
    fileSize: '4.5 MB',
    fileFormat: 'pdf',
    description: 'Impairment types, Special needs education models, Legal frameworks, and Inclusive society final exam questions.',
    downloadsCount: 890,
    createdAt: new Date(Date.now() - 3 * 24 * 3600 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },

  // 7. REFERENCE BOOKS (Standard International Textbooks)
  {
    id: 'mat_ref_1',
    title: 'Calculus: Early Transcendentals (8th Edition)',
    code: 'CALC_STEWART',
    courseName: 'Calculus & Analytic Geometry',
    category: 'ref_books',
    stream: 'Natural',
    university: 'James Stewart / Cengage Learning',
    semester: 'Both',
    credits: 4,
    fileUrl: 'https://res.cloudinary.com/demo/image/upload/v1/samples/stewart_calculus_8th.pdf',
    fileSize: '42.0 MB',
    fileFormat: 'pdf',
    description: 'The standard worldwide university textbook for single variable and multivariable calculus, limits, and applications.',
    downloadsCount: 3100,
    createdAt: new Date(Date.now() - 40 * 24 * 3600 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'mat_ref_2',
    title: 'University Physics with Modern Physics (14th Edition)',
    code: 'PHYS_YOUNG',
    courseName: 'University Physics',
    category: 'ref_books',
    stream: 'Natural',
    university: 'Hugh D. Young & Roger A. Freedman / Pearson',
    semester: 'Both',
    credits: 4,
    fileUrl: 'https://res.cloudinary.com/demo/image/upload/v1/samples/university_physics_young.pdf',
    fileSize: '65.4 MB',
    fileFormat: 'pdf',
    description: 'Gold standard textbook for engineering and natural science physics: Mechanics, Waves, Thermodynamics, and Electromagnetism.',
    downloadsCount: 2840,
    createdAt: new Date(Date.now() - 38 * 24 * 3600 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// Memory store backed by JSON file
const materialsCache = new Map<string, CourseMaterial>();

function ensureDataDir() {
  if (!fs.existsSync(LOCAL_DATA_DIR)) {
    fs.mkdirSync(LOCAL_DATA_DIR, { recursive: true });
  }
}

function loadLocalMaterials(): void {
  try {
    ensureDataDir();
    if (fs.existsSync(LOCAL_MATERIALS_FILE)) {
      const content = fs.readFileSync(LOCAL_MATERIALS_FILE, 'utf-8');
      const parsed = JSON.parse(content) as CourseMaterial[];
      if (Array.isArray(parsed) && parsed.length > 0) {
        materialsCache.clear();
        parsed.forEach((m) => materialsCache.set(m.id, m));
        return;
      }
    }

    // Seed defaults
    materialsCache.clear();
    DEFAULT_SEED_MATERIALS.forEach((m) => materialsCache.set(m.id, m));
    saveLocalMaterials();
  } catch (err) {
    console.error('Error loading local materials:', err);
    // fallback seed
    DEFAULT_SEED_MATERIALS.forEach((m) => materialsCache.set(m.id, m));
  }
}

function saveLocalMaterials(): void {
  try {
    ensureDataDir();
    const list = Array.from(materialsCache.values());
    fs.writeFileSync(LOCAL_MATERIALS_FILE, JSON.stringify(list, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving local materials:', err);
  }
}

// Initial sync
loadLocalMaterials();

/**
 * Retrieve all materials with optional filtering
 */
export async function getAllMaterials(options?: {
  category?: string;
  stream?: string;
  search?: string;
}): Promise<CourseMaterial[]> {
  loadLocalMaterials();
  let list = Array.from(materialsCache.values());

  if (options?.category && options.category !== 'all') {
    const cat = options.category.toLowerCase();
    list = list.filter((m) => m.category.toLowerCase() === cat);
  }

  if (options?.stream && options.stream !== 'all') {
    const stream = options.stream.toLowerCase();
    list = list.filter(
      (m) => m.stream.toLowerCase() === stream || m.stream.toLowerCase() === 'both'
    );
  }

  if (options?.search && options.search.trim()) {
    const q = options.search.toLowerCase().trim();
    list = list.filter(
      (m) =>
        m.title.toLowerCase().includes(q) ||
        m.code.toLowerCase().includes(q) ||
        m.courseName.toLowerCase().includes(q) ||
        (m.university && m.university.toLowerCase().includes(q))
    );
  }

  // Sort latest first
  return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

/**
 * Add / Create a new material
 */
export async function createMaterial(
  data: Omit<CourseMaterial, 'id' | 'createdAt' | 'updatedAt' | 'downloadsCount'> & {
    id?: string;
  }
): Promise<CourseMaterial> {
  const now = new Date().toISOString();
  const id = data.id || `mat_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

  const newMaterial: CourseMaterial = {
    ...data,
    id,
    downloadsCount: 0,
    createdAt: now,
    updatedAt: now,
  };

  if (adminDb) {
    try {
      await adminDb.collection(MATERIALS_COLLECTION).doc(id).set(newMaterial);
    } catch (e) {
      console.warn('Firestore write fallback for material creation:', e);
    }
  }

  materialsCache.set(id, newMaterial);
  saveLocalMaterials();
  return newMaterial;
}

/**
 * Delete a material by ID
 */
export async function deleteMaterial(id: string): Promise<boolean> {
  if (adminDb) {
    try {
      await adminDb.collection(MATERIALS_COLLECTION).doc(id).delete();
    } catch (e) {
      console.warn('Firestore delete fallback for material:', e);
    }
  }

  loadLocalMaterials();
  const existed = materialsCache.delete(id);
  saveLocalMaterials();
  return existed;
}

/**
 * Get single material
 */
export async function getMaterialById(id: string): Promise<CourseMaterial | null> {
  loadLocalMaterials();
  return materialsCache.get(id) || null;
}

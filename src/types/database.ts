export interface TelegramUser {
  id?: string;
  telegramId: number;
  firstName: string;
  lastName?: string | null;
  username?: string | null;
  phoneNumber: string;
  languageCode?: string | null;
  grade?: string | null;
  stream?: 'Natural' | 'Social' | 'General' | null;
  isVerified: boolean;
  isPremium: boolean;
  plan: 'free' | 'premium';
  premiumUntil?: string | null;
  role: 'student' | 'teacher' | 'admin';
  createdAt: string;
  updatedAt: string;
  lastActiveAt: string;
}

export type MaterialCategory =
  | 'module'
  | 'notes'
  | 'worksheet'
  | 'assignment'
  | 'mid_exam'
  | 'final_exam'
  | 'ref_books';

export type MaterialStream = 'Natural' | 'Social' | 'Both';

export interface CourseMaterial {
  id: string;
  title: string;
  code: string; // e.g. MATH101, PHYS101
  courseName: string;
  category: MaterialCategory;
  stream: MaterialStream;
  university?: string; // e.g. AAU, ASTU, JU, MoE Standard
  semester?: 'Semester 1' | 'Semester 2' | 'Both';
  credits?: number;
  fileUrl: string; // Cloudinary URL or direct link
  fileSize?: string;
  fileFormat?: string; // pdf, docx, pptx, zip
  cloudinaryId?: string;
  description?: string;
  downloadsCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface DepartmentInfo {
  id: string;
  title: string;
  stream?: 'Natural' | 'Social' | 'Both';
  cutoff?: string; // e.g. "3.70 - 3.95 CGPA"
  badgeColor?: string;
  requirements?: string;
  careers?: string;
  description?: string;
  tips?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UniversityInfo {
  id: string;
  code: string; // e.g. AAU, ASTU, JU
  name: string;
  city: string;
  campuses?: string;
  grading?: string;
  topFaculties?: string;
  rating?: number; // e.g. 4.9
  reviewDescription?: string; // typed or pasted detailed review description
  survivalTip?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BotStats {
  totalUsers: number;
  verifiedWithPhone: number;
  premiumUsers: number;
  activeToday: number;
  totalMaterials: number;
}




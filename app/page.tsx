'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Users,
  Send,
  RefreshCw,
  Building2,
  BookOpen,
  Trophy,
  Landmark,
  Layers,
  Search,
  ShieldCheck,
  Plus,
  Trash2,
  ExternalLink,
  Link as LinkIcon,
  FileUp,
  FileCheck,
  AlertCircle,
  X,
  CloudUpload,
  FolderPlus,
  MessageSquare,
  Bookmark,
  FileText,
  Award,
  BookMarked,
  CheckCircle2,
  Info,
  GraduationCap,
  SlidersHorizontal,
  Download,
} from 'lucide-react';
import {
  TelegramUser,
  CourseMaterial,
  MaterialCategory,
  MaterialStream,
  DepartmentInfo,
  UniversityInfo,
} from '@/src/types/database';

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<
    'materials' | 'departments' | 'universities' | 'students'
  >('materials');
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [usersList, setUsersList] = useState<TelegramUser[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [updatingPremiumId, setUpdatingPremiumId] = useState<number | null>(null);
  const [deletingUserId, setDeletingUserId] = useState<number | null>(null);
  const [studentSearchQuery, setStudentSearchQuery] = useState<string>('');

  // Admin Mode Toggle
  const [mounted, setMounted] = useState<boolean>(false);
  const [adminMode, setAdminMode] = useState<boolean>(true);
  const [notification, setNotification] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);

  // Materials State
  const [materials, setMaterials] = useState<CourseMaterial[]>([]);
  const [loadingMaterials, setLoadingMaterials] = useState<boolean>(true);
  const [materialFilterCategory, setMaterialFilterCategory] = useState<string>('all');
  const [materialFilterStream, setMaterialFilterStream] = useState<'All' | 'Natural' | 'Social'>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Add Material Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [uploadMode, setUploadMode] = useState<'file' | 'url'>('url');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgressText, setUploadProgressText] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [newMaterialForm, setNewMaterialForm] = useState<{
    title: string;
    code: string;
    category: MaterialCategory;
    stream: MaterialStream;
    credits: number;
    fileUrl: string;
    fileSize: string;
    fileFormat: string;
    description: string;
  }>({
    title: '',
    code: '',
    category: 'module',
    stream: 'Natural',
    credits: 3,
    fileUrl: '',
    fileSize: '5.0 MB',
    fileFormat: 'pdf',
    description: '',
  });

  // Department State
  const [departments, setDepartments] = useState<DepartmentInfo[]>([]);
  const [loadingDepartments, setLoadingDepartments] = useState<boolean>(true);
  const [deptStreamFilter, setDeptStreamFilter] = useState<'All' | 'Natural' | 'Social'>('All');
  const [deptSearchQuery, setDeptSearchQuery] = useState<string>('');
  const [isAddDeptModalOpen, setIsAddDeptModalOpen] = useState<boolean>(false);
  const [isSubmittingDept, setIsSubmittingDept] = useState<boolean>(false);
  const [deletingDeptId, setDeletingDeptId] = useState<string | null>(null);

  const [newDeptForm, setNewDeptForm] = useState<{
    title: string;
    description: string;
    stream: 'Natural' | 'Social' | 'Both';
  }>({
    title: '',
    description: '',
    stream: 'Natural',
  });

  // University & Reviews State
  const [universities, setUniversities] = useState<UniversityInfo[]>([]);
  const [loadingUniversities, setLoadingUniversities] = useState<boolean>(true);
  const [uniSearchQuery, setUniSearchQuery] = useState<string>('');
  const [isAddUniModalOpen, setIsAddUniModalOpen] = useState<boolean>(false);
  const [isSubmittingUni, setIsSubmittingUni] = useState<boolean>(false);
  const [deletingUniId, setDeletingUniId] = useState<string | null>(null);

  const [newUniForm, setNewUniForm] = useState<{
    code: string;
    name: string;
    city: string;
    reviewDescription: string;
  }>({
    code: '',
    name: '',
    city: '',
    reviewDescription: '',
  });



  // 7 Material Categories Configuration
  const materialCategories: Array<{
    id: MaterialCategory;
    label: string;
    shortLabel: string;
    icon: typeof BookOpen;
    color: string;
    badgeBg: string;
    textColor: string;
    borderColor: string;
    desc: string;
  }> = [
    {
      id: 'module',
      label: 'Official Modules',
      shortLabel: 'Modules',
      icon: BookOpen,
      color: 'emerald',
      badgeBg: 'bg-emerald-500/15',
      textColor: 'text-emerald-400',
      borderColor: 'border-emerald-500/30',
      desc: 'National MoE Textbooks & Curriculum Modules',
    },
    {
      id: 'notes',
      label: 'Lecture Notes',
      shortLabel: 'Notes',
      icon: Bookmark,
      color: 'sky',
      badgeBg: 'bg-sky-500/15',
      textColor: 'text-sky-400',
      borderColor: 'border-sky-500/30',
      desc: 'Concise Summary Slides & Chapter Handouts',
    },
    {
      id: 'worksheet',
      label: 'Worksheets',
      shortLabel: 'Worksheets',
      icon: FileText,
      color: 'violet',
      badgeBg: 'bg-violet-500/15',
      textColor: 'text-violet-400',
      borderColor: 'border-violet-500/30',
      desc: 'Practice Problems, Model Sets & Exercises',
    },
    {
      id: 'assignment',
      label: 'Assignments',
      shortLabel: 'Assignments',
      icon: Layers,
      color: 'amber',
      badgeBg: 'bg-amber-500/15',
      textColor: 'text-amber-400',
      borderColor: 'border-amber-500/30',
      desc: 'Solved Tutorial Questions & Step-by-Step Solutions',
    },
    {
      id: 'mid_exam',
      label: 'Mid Exams',
      shortLabel: 'Mid Exams',
      icon: Award,
      color: 'rose',
      badgeBg: 'bg-rose-500/15',
      textColor: 'text-rose-400',
      borderColor: 'border-rose-500/30',
      desc: 'Past University Midterm Papers with Answer Keys',
    },
    {
      id: 'final_exam',
      label: 'Final Exams',
      shortLabel: 'Final Exams',
      icon: Trophy,
      color: 'red',
      badgeBg: 'bg-red-500/15',
      textColor: 'text-red-400',
      borderColor: 'border-red-500/30',
      desc: 'Semester Final Examinations & Archives',
    },
    {
      id: 'ref_books',
      label: 'Reference Books',
      shortLabel: 'Ref Books',
      icon: BookMarked,
      color: 'indigo',
      badgeBg: 'bg-indigo-500/15',
      textColor: 'text-indigo-400',
      borderColor: 'border-indigo-500/30',
      desc: 'James Stewart Calculus, University Physics Textbooks',
    },
  ];

  // Common Ethiopian Freshman Subjects
  const commonCoursesList = [
    { code: 'MATH101', name: 'Mathematics for Natural Sciences', stream: 'Natural', credits: 4 },
    { code: 'MATH102', name: 'Mathematics for Social Sciences', stream: 'Social', credits: 4 },
    { code: 'PHYS101', name: 'General Physics for Natural Sciences', stream: 'Natural', credits: 3 },
    { code: 'LOGIC101', name: 'Critical Thinking & Informal Logic', stream: 'Both', credits: 3 },
    { code: 'PSYC101', name: 'General Psychology', stream: 'Both', credits: 3 },
    { code: 'EMERG101', name: 'Emerging Technologies (AI, IoT, Cloud)', stream: 'Both', credits: 3 },
    { code: 'ENG101', name: 'Communicative English Language Skills', stream: 'Both', credits: 3 },
    { code: 'GEOG101', name: 'Geography of Ethiopia and the Horn', stream: 'Both', credits: 3 },
    { code: 'INCL101', name: 'Inclusiveness in Higher Education', stream: 'Both', credits: 2 },
    { code: 'ECON101', name: 'Introduction to Economics', stream: 'Social', credits: 3 },
    { code: 'CIVICS101', name: 'Moral and Civics Education', stream: 'Social', credits: 3 },
    { code: 'GLOBAL101', name: 'Global Trends & International Relations', stream: 'Social', credits: 3 },
    { code: 'CALC_STEWART', name: 'Calculus: Early Transcendentals (8th Ed)', stream: 'Natural', credits: 4 },
    { code: 'PHYS_YOUNG', name: 'University Physics with Modern Physics', stream: 'Natural', credits: 4 },
  ];

  // Lifecycle
  useEffect(() => {
    setMounted(true);
    fetchMaterials();
    fetchDepartments();
    fetchUniversities();
    fetchUsers();
  }, []);

  const showToast = (type: 'success' | 'error' | 'info', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  const fetchMaterials = async () => {
    setLoadingMaterials(true);
    try {
      const res = await fetch('/api/materials');
      if (res.ok) {
        const data = await res.json();
        if (data.materials) {
          setMaterials(data.materials);
        }
      }
    } catch (err) {
      console.error('Failed to load materials:', err);
      showToast('error', 'Failed to fetch materials from database');
    } finally {
      setLoadingMaterials(false);
    }
  };

  const fetchDepartments = async () => {
    setLoadingDepartments(true);
    try {
      const res = await fetch('/api/departments');
      if (res.ok) {
        const data = await res.json();
        if (data.departments) {
          setDepartments(data.departments);
        }
      }
    } catch (err) {
      console.error('Failed to load departments:', err);
    } finally {
      setLoadingDepartments(false);
    }
  };

  const fetchUniversities = async () => {
    setLoadingUniversities(true);
    try {
      const res = await fetch('/api/universities');
      if (res.ok) {
        const data = await res.json();
        if (data.universities) {
          setUniversities(data.universities);
        }
      }
    } catch (err) {
      console.error('Failed to load universities:', err);
    } finally {
      setLoadingUniversities(false);
    }
  };

  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const res = await fetch('/api/users');
      if (res.ok) {
        const data = await res.json();
        if (data.users && data.users.length > 0) {
          setUsersList(data.users);
        }
      }
    } catch (e) {
      // ignore
    } finally {
      setLoadingUsers(false);
    }
  };

  const toggleUserPremium = async (telegramId: number, currentStatus: boolean) => {
    setUpdatingPremiumId(telegramId);
    const nextStatus = !currentStatus;
    try {
      const res = await fetch('/api/users/premium', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          telegramId,
          isPremium: nextStatus,
          days: 30,
        }),
      });
      if (res.ok) {
        setUsersList((prev) =>
          prev.map((u) =>
            u.telegramId === telegramId
              ? { ...u, isPremium: nextStatus, plan: nextStatus ? 'premium' : 'free' }
              : u
          )
        );
        showToast(
          'success',
          `Student status updated to ${nextStatus ? 'VIP Active (Premium)' : 'Free Student'}`
        );
      } else {
        showToast('error', 'Failed to update student status');
      }
    } catch {
      showToast('error', 'Failed to update student status');
    } finally {
      setUpdatingPremiumId(null);
    }
  };

  const handleDeleteUser = async (telegramId: number, studentName: string) => {
    if (!window.confirm(`Are you sure you want to permanently delete student "${studentName}" (${telegramId})?`)) {
      return;
    }
    setDeletingUserId(telegramId);
    try {
      const res = await fetch(`/api/users?telegramId=${telegramId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setUsersList((prev) => prev.filter((u) => u.telegramId !== telegramId));
        showToast('success', `Student "${studentName}" deleted successfully.`);
      } else {
        const data = await res.json().catch(() => ({}));
        showToast('error', data.error || 'Failed to delete student.');
      }
    } catch (err) {
      console.error('Delete user error:', err);
      showToast('error', 'Network error while deleting student.');
    } finally {
      setDeletingUserId(null);
    }
  };

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(key);
    setTimeout(() => setCopiedText(null), 2000);
  };

  // DELETE MATERIAL (Admin)
  const handleDeleteMaterial = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to permanently delete "${title}"?`)) {
      return;
    }

    setDeletingId(id);
    try {
      const res = await fetch(`/api/materials?id=${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setMaterials((prev) => prev.filter((m) => m.id !== id));
        showToast('success', `"${title}" has been deleted from the database.`);
      } else {
        showToast('error', 'Failed to delete material from database.');
      }
    } catch (err) {
      console.error('Delete error:', err);
      showToast('error', 'Network error while deleting material.');
    } finally {
      setDeletingId(null);
    }
  };

  // ADD MATERIAL (Admin - Cloudinary / URL)
  const handleAddMaterialSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMaterialForm.title.trim()) {
      showToast('error', 'Please enter a title for the material.');
      return;
    }

    setIsSubmitting(true);
    let finalFileUrl = newMaterialForm.fileUrl.trim();
    let finalFileSize = newMaterialForm.fileSize || '5.0 MB';
    let finalFileFormat = newMaterialForm.fileFormat || 'pdf';

    try {
      if (uploadMode === 'file' && selectedFile) {
        setUploadProgressText('Uploading document to Cloudinary / storage...');
        const formData = new FormData();
        formData.append('file', selectedFile);
        formData.append('folder', `ethio_materials/${newMaterialForm.category}`);

        const uploadRes = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (!uploadRes.ok) {
          throw new Error('Failed to upload file to Cloudinary / server');
        }

        const uploadData = await uploadRes.json();
        if (!uploadData.url) {
          throw new Error(uploadData.error || 'Upload failed without URL');
        }

        finalFileUrl = uploadData.url;
        finalFileSize = uploadData.size || finalFileSize;
        finalFileFormat = uploadData.format || finalFileFormat;
      }

      if (!finalFileUrl) {
        showToast('error', 'Please upload a document file or provide a direct document URL link.');
        setIsSubmitting(false);
        return;
      }

      setUploadProgressText('Saving material record to database...');

      const saveRes = await fetch('/api/materials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newMaterialForm,
          courseName: newMaterialForm.title.trim(),
          code: newMaterialForm.code.trim() || 'GEN101',
          fileUrl: finalFileUrl,
          fileSize: finalFileSize,
          fileFormat: finalFileFormat,
        }),
      });

      if (!saveRes.ok) {
        const errData = await saveRes.json().catch(() => ({}));
        throw new Error(errData.error || 'Failed to save material to database');
      }

      const savedData = await saveRes.json();
      if (savedData.material) {
        setMaterials((prev) => [savedData.material, ...prev]);
        showToast('success', `"${savedData.material.title}" successfully added to database!`);
        setIsAddModalOpen(false);
        setSelectedFile(null);
        setNewMaterialForm({
          title: '',
          code: '',
          category: 'module',
          stream: 'Natural',
          credits: 3,
          fileUrl: '',
          fileSize: '5.0 MB',
          fileFormat: 'pdf',
          description: '',
        });
      }
    } catch (err: any) {
      console.error('Submission error:', err);
      showToast('error', err.message || 'Error creating material.');
    } finally {
      setIsSubmitting(false);
      setUploadProgressText('');
    }
  };

  // DELETE DEPARTMENT (Admin)
  const handleDeleteDepartment = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}" from department info?`)) {
      return;
    }

    setDeletingDeptId(id);
    try {
      const res = await fetch(`/api/departments?id=${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setDepartments((prev) => prev.filter((d) => d.id !== id));
        showToast('success', `"${title}" department info removed from database.`);
      } else {
        showToast('error', 'Failed to delete department from database.');
      }
    } catch (err) {
      console.error('Delete department error:', err);
      showToast('error', 'Network error while deleting department.');
    } finally {
      setDeletingDeptId(null);
    }
  };

  // ADD DEPARTMENT (Admin)
  const handleAddDepartmentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDeptForm.title.trim()) {
      showToast('error', 'Please enter a department name.');
      return;
    }

    setIsSubmittingDept(true);
    try {
      const res = await fetch('/api/departments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newDeptForm),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || 'Failed to save department');
      }

      const data = await res.json();
      if (data.department) {
        setDepartments((prev) => [data.department, ...prev]);
        showToast('success', `Department "${data.department.title}" successfully added!`);
        setIsAddDeptModalOpen(false);
        setNewDeptForm({
          title: '',
          description: '',
          stream: 'Natural',
        });
      }
    } catch (err: any) {
      console.error('Department creation error:', err);
      showToast('error', err.message || 'Error saving department.');
    } finally {
      setIsSubmittingDept(false);
    }
  };

  // DELETE UNIVERSITY (Admin)
  const handleDeleteUniversity = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}" from university guide?`)) {
      return;
    }

    setDeletingUniId(id);
    try {
      const res = await fetch(`/api/universities?id=${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setUniversities((prev) => prev.filter((u) => u.id !== id));
        showToast('success', `"${name}" removed from university directory.`);
      } else {
        showToast('error', 'Failed to delete university from database.');
      }
    } catch (err) {
      console.error('Delete university error:', err);
      showToast('error', 'Network error while deleting university.');
    } finally {
      setDeletingUniId(null);
    }
  };

  // ADD UNIVERSITY (Admin)
  const handleAddUniversitySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUniForm.name.trim()) {
      showToast('error', 'Please enter a university name.');
      return;
    }

    setIsSubmittingUni(true);
    try {
      const res = await fetch('/api/universities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUniForm),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || 'Failed to save university');
      }

      const data = await res.json();
      if (data.university) {
        setUniversities((prev) => [data.university, ...prev]);
        showToast('success', `University "${data.university.name}" successfully added!`);
        setIsAddUniModalOpen(false);
        setNewUniForm({
          code: '',
          name: '',
          city: '',
          reviewDescription: '',
        });
      }
    } catch (err: any) {
      console.error('University creation error:', err);
      showToast('error', err.message || 'Error saving university.');
    } finally {
      setIsSubmittingUni(false);
    }
  };

  // Filtered Materials
  const filteredMaterials = materials.filter((m) => {
    const matchesStream =
      materialFilterStream === 'All' ||
      m.stream.toLowerCase() === materialFilterStream.toLowerCase() ||
      m.stream.toLowerCase() === 'both';

    const matchesCategory =
      materialFilterCategory === 'all' ||
      m.category.toLowerCase() === materialFilterCategory.toLowerCase();

    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      q === '' ||
      m.title.toLowerCase().includes(q) ||
      m.code.toLowerCase().includes(q) ||
      m.courseName.toLowerCase().includes(q) ||
      (m.university && m.university.toLowerCase().includes(q));

    return matchesStream && matchesCategory && matchesSearch;
  });

  // Filtered Departments
  const filteredDepartments = departments.filter((d) => {
    const matchesStream =
      deptStreamFilter === 'All' ||
      !d.stream ||
      d.stream.toLowerCase() === deptStreamFilter.toLowerCase() ||
      d.stream.toLowerCase() === 'both';

    const q = deptSearchQuery.toLowerCase().trim();
    const matchesSearch =
      q === '' ||
      d.title.toLowerCase().includes(q) ||
      (d.description && d.description.toLowerCase().includes(q));

    return matchesStream && matchesSearch;
  });

  // Filtered Universities
  const filteredUniversities = universities.filter((u) => {
    const q = uniSearchQuery.toLowerCase().trim();
    return (
      q === '' ||
      u.name.toLowerCase().includes(q) ||
      (u.code && u.code.toLowerCase().includes(q)) ||
      (u.city && u.city.toLowerCase().includes(q)) ||
      (u.reviewDescription && u.reviewDescription.toLowerCase().includes(q))
    );
  });

  // Filtered Registered Students
  const filteredUsers = usersList.filter((u) => {
    const q = studentSearchQuery.toLowerCase().trim();
    if (!q) return true;
    const fullName = `${u.firstName || ''} ${u.lastName || ''}`.toLowerCase();
    const username = (u.username || '').toLowerCase();
    const phone = (u.phoneNumber || '').toLowerCase();
    const tgId = String(u.telegramId || '');
    return fullName.includes(q) || username.includes(q) || phone.includes(q) || tgId.includes(q);
  });

  const getCategoryCount = (catId: string) => {
    if (catId === 'all') return materials.length;
    return materials.filter((m) => m.category.toLowerCase() === catId.toLowerCase()).length;
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-white">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 animate-bounce">
          <div
            className={`px-4 py-3 rounded-2xl shadow-2xl backdrop-blur-xl border flex items-center gap-3 text-xs font-semibold ${
              notification.type === 'success'
                ? 'bg-emerald-950/90 border-emerald-500/50 text-emerald-200'
                : notification.type === 'error'
                ? 'bg-rose-950/90 border-rose-500/50 text-rose-200'
                : 'bg-sky-950/90 border-sky-500/50 text-sky-200'
            }`}
          >
            {notification.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            ) : notification.type === 'error' ? (
              <AlertCircle className="w-4 h-4 text-rose-400" />
            ) : (
              <Info className="w-4 h-4 text-sky-400" />
            )}
            <span>{notification.message}</span>
          </div>
        </div>
      )}

      {/* Dynamic Ambient Glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[15%] w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[160px]" />
        <div className="absolute top-[35%] right-[-10%] w-[650px] h-[650px] bg-sky-500/10 rounded-full blur-[170px]" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[550px] h-[550px] bg-violet-500/10 rounded-full blur-[150px]" />
      </div>

      {/* Modern Top Header */}
      <header className="relative z-20 border-b border-zinc-800/80 bg-zinc-950/85 backdrop-blur-2xl sticky top-0 px-3 sm:px-6 py-2 sm:py-2.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl overflow-hidden border border-emerald-500/40 shadow-lg shadow-emerald-500/20 shrink-0 bg-zinc-900 group">
              <img
                src="/logo.png"
                alt="Ethio Student Material"
                className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
              />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                <span className="font-extrabold text-sm sm:text-base tracking-tight text-white">Ethio Student Material</span>
                <span className="px-1.5 sm:px-2 py-0.5 text-[9px] sm:text-[10px] font-semibold rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 inline-flex items-center gap-1">
                  <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Freshman Hub</span>
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] text-zinc-400 truncate hidden sm:block">
                Your Guide to a Brighter Future • Ethiopian Universities Academic Portal & Bot
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <button
              onClick={() => {
                if (typeof window !== 'undefined') {
                  window.dispatchEvent(new CustomEvent('trigger-pwa-install'));
                }
              }}
              title="Install Web App on your phone or PC"
              className="flex px-2.5 sm:px-3 py-1.5 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/40 text-emerald-300 font-bold text-xs items-center gap-1.5 transition cursor-pointer shadow-sm active:scale-95"
            >
              <Download className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden xs:inline sm:inline">Install App</span>
              <span className="xs:hidden sm:hidden">Install</span>
            </button>

            <a
              href="https://t.me/EthioStudentMaterialBot"
              target="_blank"
              rel="noreferrer"
              className="flex px-2.5 sm:px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-200 font-semibold text-xs items-center gap-1.5 transition cursor-pointer shadow-sm active:scale-95"
            >
              <Send className="w-3.5 h-3.5 text-sky-400" />
              <span className="hidden xs:inline sm:inline">Open Bot</span>
              <span className="xs:hidden sm:hidden">Bot</span>
            </a>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="relative z-10 flex-1 max-w-7xl mx-auto w-full px-3.5 sm:px-6 py-4 sm:py-6 space-y-4 sm:space-y-6">
        {/* KPI Stats Highlights */}
        <section className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3">
          <div className="p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl bg-zinc-900/60 border border-zinc-800/80 backdrop-blur-xl flex items-center gap-2.5 sm:gap-3 hover:border-emerald-500/40 transition">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center shrink-0">
              <BookOpen className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0">
              <div className="text-base sm:text-lg font-bold text-white tracking-tight">{materials.length}</div>
              <div className="text-[10px] sm:text-[11px] text-zinc-400 truncate">Total Materials</div>
            </div>
          </div>

          <div className="p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl bg-zinc-900/60 border border-zinc-800/80 backdrop-blur-xl flex items-center gap-2.5 sm:gap-3 hover:border-sky-500/40 transition">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20 flex items-center justify-center shrink-0">
              <Trophy className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0">
              <div className="text-base sm:text-lg font-bold text-white tracking-tight">
                {materials.filter((m) => m.category === 'mid_exam' || m.category === 'final_exam').length}
              </div>
              <div className="text-[10px] sm:text-[11px] text-zinc-400 truncate">Exams Bank</div>
            </div>
          </div>

          <div className="p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl bg-zinc-900/60 border border-zinc-800/80 backdrop-blur-xl flex items-center gap-2.5 sm:gap-3 hover:border-violet-500/40 transition">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-violet-500/10 text-violet-400 border border-violet-500/20 flex items-center justify-center shrink-0">
              <Building2 className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0">
              <div className="text-base sm:text-lg font-bold text-white tracking-tight">{departments.length}</div>
              <div className="text-[10px] sm:text-[11px] text-zinc-400 truncate">Department Info</div>
            </div>
          </div>

          <div className="p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl bg-zinc-900/60 border border-zinc-800/80 backdrop-blur-xl flex items-center gap-2.5 sm:gap-3 hover:border-teal-500/40 transition">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/20 flex items-center justify-center shrink-0">
              <Landmark className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0">
              <div className="text-base sm:text-lg font-bold text-white tracking-tight">{universities.length}</div>
              <div className="text-[10px] sm:text-[11px] text-zinc-400 truncate">Universities</div>
            </div>
          </div>

          <div className="col-span-2 sm:col-span-1 p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl bg-gradient-to-tr from-emerald-500/15 via-teal-500/10 to-sky-500/15 border border-emerald-500/30 backdrop-blur-xl flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-emerald-400 truncate">Admin Mode</div>
                <div className="text-[9px] text-zinc-400">Full Access</div>
              </div>
            </div>
            <button
              onClick={() => setAdminMode(!adminMode)}
              className={`px-2.5 py-1 rounded-md text-[10px] font-bold transition cursor-pointer shrink-0 ${
                adminMode ? 'bg-emerald-500 text-zinc-950 shadow-sm' : 'bg-zinc-800 text-zinc-400'
              }`}
            >
              {adminMode ? 'ON' : 'OFF'}
            </button>
          </div>
        </section>

        {/* Navigation Tabs Bar */}
        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar pb-1 border-b border-zinc-800/80 text-xs">
          <button
            onClick={() => setActiveTab('materials')}
            className={`px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl font-semibold flex items-center gap-1.5 sm:gap-2 transition cursor-pointer whitespace-nowrap shrink-0 text-[11px] sm:text-xs ${
              activeTab === 'materials'
                ? 'bg-zinc-800 text-white border border-zinc-700 shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60'
            }`}
          >
            <Layers className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400 shrink-0" />
            <span>Materials</span>
            <span className="px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">
              {materials.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('departments')}
            className={`px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl font-semibold flex items-center gap-1.5 sm:gap-2 transition cursor-pointer whitespace-nowrap shrink-0 text-[11px] sm:text-xs ${
              activeTab === 'departments'
                ? 'bg-zinc-800 text-white border border-zinc-700 shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60'
            }`}
          >
            <Building2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-violet-400 shrink-0" />
            <span>Departments</span>
            <span className="px-1.5 py-0.5 rounded-full bg-violet-500/20 text-violet-400 text-[10px] font-bold">
              {departments.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('universities')}
            className={`px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl font-semibold flex items-center gap-1.5 sm:gap-2 transition cursor-pointer whitespace-nowrap shrink-0 text-[11px] sm:text-xs ${
              activeTab === 'universities'
                ? 'bg-zinc-800 text-white border border-zinc-700 shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60'
            }`}
          >
            <Landmark className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-teal-400 shrink-0" />
            <span>Universities</span>
            <span className="px-1.5 py-0.5 rounded-full bg-teal-500/20 text-teal-400 text-[10px] font-bold">
              {universities.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('students')}
            className={`px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl font-semibold flex items-center gap-1.5 sm:gap-2 transition cursor-pointer whitespace-nowrap shrink-0 text-[11px] sm:text-xs ${
              activeTab === 'students'
                ? 'bg-zinc-800 text-white border border-zinc-700 shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60'
            }`}
          >
            <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-indigo-400 shrink-0" />
            <span>Students Sync</span>
            <span className="px-1.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400 text-[10px] font-bold">
              {usersList.length}
            </span>
          </button>
        </div>

        {/* TAB 1: COURSE & MATERIALS MANAGEMENT REPOSITORY */}
        {activeTab === 'materials' && (
          <section className="space-y-4 sm:space-y-6">
            <div className="p-3.5 sm:p-5 rounded-xl sm:rounded-2xl bg-zinc-900/70 border border-zinc-800/90 shadow-xl space-y-3 sm:space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                      Materials Repository
                    </h2>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] sm:text-xs font-bold">
                      Live Cloud Sync
                    </span>
                  </div>
                  <p className="text-[11px] sm:text-xs text-zinc-400 mt-0.5">
                    Official modules, lecture notes, worksheets, assignments, past mid & final exams.
                  </p>
                </div>

                <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                  <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="flex-1 sm:flex-initial px-3.5 sm:px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-sky-500 hover:opacity-95 text-zinc-950 font-bold text-xs flex items-center justify-center gap-1.5 transition shadow-md shadow-emerald-500/20 cursor-pointer active:scale-98"
                  >
                    <Plus className="w-4 h-4 shrink-0" />
                    <span>Add Material</span>
                  </button>

                  <button
                    onClick={fetchMaterials}
                    className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition cursor-pointer shrink-0"
                    title="Refresh from Database"
                  >
                    <RefreshCw className={`w-4 h-4 ${loadingMaterials ? 'animate-spin text-emerald-400' : ''}`} />
                  </button>
                </div>
              </div>

              {/* Stream Switcher & Search Bar */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 pt-2 border-t border-zinc-800/80">
                <div className="grid grid-cols-3 sm:flex items-center gap-1 bg-zinc-950 border border-zinc-800 rounded-xl p-1 text-xs">
                  {(['All', 'Natural', 'Social'] as const).map((st) => (
                    <button
                      key={st}
                      onClick={() => setMaterialFilterStream(st)}
                      className={`px-2.5 sm:px-3 py-1.5 rounded-lg font-semibold text-center transition cursor-pointer text-[11px] sm:text-xs ${
                        materialFilterStream === st
                          ? 'bg-emerald-500 text-zinc-950 font-bold shadow-sm'
                          : 'text-zinc-400 hover:text-white'
                      }`}
                    >
                      {st === 'All' ? 'All' : st}
                    </button>
                  ))}
                </div>

                <div className="relative flex-1 sm:max-w-xs">
                  <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search materials by title, code..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-8 pr-7 py-2 text-sm sm:text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-emerald-500 transition shadow-inner"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 text-xs cursor-pointer p-1"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* 7 CLICKABLE CATEGORY BUTTONS / HORIZONTAL SCROLL ON MOBILE */}
            <div className="space-y-2">
              <div className="text-[11px] sm:text-xs font-bold text-zinc-400 uppercase tracking-wider flex items-center justify-between">
                <span>Select Category:</span>
                <span className="text-zinc-500 font-normal normal-case">
                  {filteredMaterials.length} items
                </span>
              </div>

              <div className="flex overflow-x-auto no-scrollbar gap-2 pb-1 sm:grid sm:grid-cols-4 lg:grid-cols-8">
                <button
                  onClick={() => setMaterialFilterCategory('all')}
                  className={`p-2.5 sm:p-3 rounded-xl sm:rounded-2xl border text-left transition flex flex-col justify-between space-y-1.5 cursor-pointer shrink-0 min-w-[110px] sm:min-w-0 ${
                    materialFilterCategory === 'all'
                      ? 'bg-zinc-800 border-zinc-600 ring-2 ring-emerald-500/50 text-white shadow-lg'
                      : 'bg-zinc-900/50 border-zinc-800/80 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <SlidersHorizontal className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="px-1.5 py-0.2 rounded-md bg-zinc-800 text-[10px] font-bold text-white">
                      {getCategoryCount('all')}
                    </span>
                  </div>
                  <div>
                    <div className="font-bold text-xs text-white truncate">All</div>
                    <div className="text-[9px] text-zinc-500 truncate">Full Archive</div>
                  </div>
                </button>

                {materialCategories.map((cat) => {
                  const Icon = cat.icon;
                  const isSelected = materialFilterCategory === cat.id;
                  const count = getCategoryCount(cat.id);

                  return (
                    <button
                      key={cat.id}
                      onClick={() => setMaterialFilterCategory(cat.id)}
                      className={`p-2.5 sm:p-3 rounded-xl sm:rounded-2xl border text-left transition flex flex-col justify-between space-y-1.5 cursor-pointer group shrink-0 min-w-[110px] sm:min-w-0 ${
                        isSelected
                          ? `${cat.badgeBg} ${cat.borderColor} ring-2 ring-emerald-500/60 shadow-lg`
                          : 'bg-zinc-900/50 border-zinc-800/80 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <Icon className={`w-3.5 h-3.5 ${isSelected ? cat.textColor : 'text-zinc-400 group-hover:text-zinc-200'}`} />
                        <span
                          className={`px-1.5 py-0.2 rounded-md text-[10px] font-bold ${
                            isSelected ? `${cat.badgeBg} ${cat.textColor}` : 'bg-zinc-800/80 text-zinc-400'
                          }`}
                        >
                          {count}
                        </span>
                      </div>
                      <div>
                        <div className={`font-bold text-xs truncate ${isSelected ? 'text-white' : 'text-zinc-300'}`}>
                          {cat.shortLabel}
                        </div>
                        <div className="text-[9px] text-zinc-500 truncate">{cat.label}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Material Cards List */}
            {loadingMaterials ? (
              <div className="p-8 sm:p-12 text-center rounded-2xl bg-zinc-900/40 border border-zinc-800/80 space-y-3">
                <RefreshCw className="w-6 h-6 text-emerald-400 animate-spin mx-auto" />
                <p className="text-xs text-zinc-400">Loading materials from persistent database...</p>
              </div>
            ) : filteredMaterials.length === 0 ? (
              <div className="p-8 sm:p-12 text-center rounded-2xl bg-zinc-900/40 border border-zinc-800/80 space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-zinc-800/80 text-zinc-400 flex items-center justify-center mx-auto">
                  <BookOpen className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-bold text-white text-base">No materials found</h3>
                  <p className="text-xs text-zinc-400 max-w-md mx-auto">
                    No resources matched your filter category or search query. Click below to add a new document.
                  </p>
                </div>
                <button
                  onClick={() => setIsAddModalOpen(true)}
                  className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs inline-flex items-center gap-1.5 cursor-pointer shadow-md active:scale-95"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add First Document Here</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                {filteredMaterials.map((mat) => {
                  const catConfig = materialCategories.find((c) => c.id === mat.category) || materialCategories[0];
                  const Icon = catConfig.icon;
                  const isDeleting = deletingId === mat.id;

                  return (
                    <div
                      key={mat.id}
                      className="p-4 sm:p-5 rounded-xl sm:rounded-2xl bg-zinc-900/60 border border-zinc-800/80 hover:border-zinc-700 transition flex flex-col justify-between space-y-3 sm:space-y-4 relative group hover:shadow-xl hover:shadow-emerald-500/5"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between gap-1.5 flex-wrap">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="px-2 py-0.5 rounded-md bg-zinc-950 border border-zinc-800 text-zinc-300 font-mono text-[10px] sm:text-[11px] font-bold">
                              {mat.code}
                            </span>
                            <span
                              className={`px-2 py-0.5 rounded-md text-[10px] font-bold border flex items-center gap-1 ${catConfig.badgeBg} ${catConfig.textColor} ${catConfig.borderColor}`}
                            >
                              <Icon className="w-3 h-3" />
                              <span>{catConfig.shortLabel}</span>
                            </span>
                          </div>

                          <span className="px-2 py-0.5 rounded-md bg-zinc-800/80 text-zinc-400 text-[10px] font-medium">
                            {mat.stream}
                          </span>
                        </div>

                        <div>
                          <h3 className="font-bold text-white text-sm sm:text-base tracking-tight leading-snug line-clamp-2">
                            {mat.title}
                          </h3>
                          {mat.courseName && mat.courseName !== mat.title && (
                            <p className="text-[10px] sm:text-[11px] text-zinc-400 mt-0.5 line-clamp-1">{mat.courseName}</p>
                          )}
                        </div>

                        {mat.description && (
                          <p className="text-[10px] sm:text-[11px] text-zinc-400 line-clamp-2 leading-relaxed bg-zinc-950/40 p-2 rounded-lg border border-zinc-900">
                            {mat.description}
                          </p>
                        )}

                        <div className="text-[10px] text-zinc-400 flex items-center gap-1.5 sm:gap-2 pt-1 border-t border-zinc-800/60 flex-wrap">
                          {mat.university && (
                            <>
                              <span className="text-zinc-300 font-medium truncate max-w-[120px]">{mat.university}</span>
                              <span>•</span>
                            </>
                          )}
                          <span className="uppercase font-mono font-semibold text-emerald-400">
                            {mat.fileFormat || 'PDF'}
                          </span>
                          <span>•</span>
                          <span>{mat.fileSize || '5.0 MB'}</span>
                          {mat.semester && (
                            <>
                              <span>•</span>
                              <span>{mat.semester}</span>
                            </>
                          )}
                        </div>
                      </div>

                      <div className="pt-1 flex items-center gap-2">
                        <a
                          href={mat.fileUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="flex-1 py-2 sm:py-2.5 px-3 rounded-xl bg-zinc-800 hover:bg-emerald-500 hover:text-zinc-950 text-zinc-200 font-semibold text-xs flex items-center justify-center gap-2 transition cursor-pointer shadow-sm group/btn active:scale-98"
                        >
                          <Download className="w-3.5 h-3.5 group-hover/btn:scale-110 transition" />
                          <span>Download / Open</span>
                        </a>

                        {adminMode && (
                          <button
                            onClick={() => handleDeleteMaterial(mat.id, mat.title)}
                            disabled={isDeleting}
                            className="p-2 sm:p-2.5 rounded-xl bg-zinc-800/80 hover:bg-rose-500/20 hover:text-rose-400 hover:border-rose-500/30 text-zinc-400 border border-zinc-800 transition cursor-pointer shrink-0 active:scale-95"
                            title="Delete Material (Admin)"
                          >
                            <Trash2 className={`w-3.5 h-3.5 ${isDeleting ? 'animate-spin text-rose-400' : ''}`} />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        )}

        {/* TAB 2: DEPARTMENT INFO & ADMIN MANAGEMENT */}
        {activeTab === 'departments' && (
          <section className="space-y-4 sm:space-y-6">
            <div className="p-3.5 sm:p-5 rounded-xl sm:rounded-2xl bg-zinc-900/70 border border-zinc-800/90 shadow-xl space-y-3 sm:space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                      Department Directory
                    </h2>
                    <span className="px-2 py-0.5 rounded-full bg-violet-500/15 text-violet-400 border border-violet-500/30 text-[10px] sm:text-xs font-bold">
                      Admin Managed
                    </span>
                  </div>
                  <p className="text-[11px] sm:text-xs text-zinc-400 mt-0.5">
                    Curriculum overviews, academic streams, and detailed department profiles for freshman students.
                  </p>
                </div>

                <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                  <button
                    onClick={() => setIsAddDeptModalOpen(true)}
                    className="flex-1 sm:flex-initial px-3.5 sm:px-4 py-2 rounded-xl bg-gradient-to-r from-violet-500 via-purple-500 to-indigo-500 hover:opacity-95 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition shadow-md shadow-violet-500/25 cursor-pointer active:scale-98"
                  >
                    <Plus className="w-4 h-4 shrink-0" />
                    <span>Add Department</span>
                  </button>

                  <button
                    onClick={fetchDepartments}
                    className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition cursor-pointer shrink-0"
                    title="Refresh Departments"
                  >
                    <RefreshCw className={`w-4 h-4 ${loadingDepartments ? 'animate-spin text-violet-400' : ''}`} />
                  </button>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 pt-2 border-t border-zinc-800/80">
                <div className="grid grid-cols-3 sm:flex items-center gap-1 bg-zinc-950 border border-zinc-800 rounded-xl p-1 text-xs">
                  {(['All', 'Natural', 'Social'] as const).map((st) => (
                    <button
                      key={st}
                      onClick={() => setDeptStreamFilter(st)}
                      className={`px-2.5 sm:px-3 py-1.5 rounded-lg font-semibold text-center transition cursor-pointer text-[11px] sm:text-xs ${
                        deptStreamFilter === st
                          ? 'bg-violet-600 text-white font-bold shadow-sm'
                          : 'text-zinc-400 hover:text-white'
                      }`}
                    >
                      {st === 'All' ? 'All' : st}
                    </button>
                  ))}
                </div>

                <div className="relative flex-1 sm:max-w-xs">
                  <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search department by name..."
                    value={deptSearchQuery}
                    onChange={(e) => setDeptSearchQuery(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-8 pr-7 py-2 text-sm sm:text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-violet-500 transition shadow-inner"
                  />
                  {deptSearchQuery && (
                    <button
                      onClick={() => setDeptSearchQuery('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 text-xs cursor-pointer p-1"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Department Cards Grid */}
            {loadingDepartments ? (
              <div className="p-8 sm:p-12 text-center rounded-2xl bg-zinc-900/40 border border-zinc-800/80 space-y-3">
                <RefreshCw className="w-6 h-6 text-violet-400 animate-spin mx-auto" />
                <p className="text-xs text-zinc-400">Loading department database...</p>
              </div>
            ) : filteredDepartments.length === 0 ? (
              <div className="p-8 sm:p-12 text-center rounded-2xl bg-zinc-900/40 border border-zinc-800/80 space-y-4">
                <Building2 className="w-10 h-10 text-zinc-500 mx-auto" />
                <h3 className="font-bold text-white text-base">No departments found</h3>
                <p className="text-xs text-zinc-400 max-w-md mx-auto">
                  No department matched your search or stream filter. Click below to add a new department entry.
                </p>
                <button
                  onClick={() => setIsAddDeptModalOpen(true)}
                  className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs inline-flex items-center gap-1.5 cursor-pointer shadow-md active:scale-95"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add First Department</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                {filteredDepartments.map((dept) => {
                  const isDeleting = deletingDeptId === dept.id;
                  const streamType = dept.stream || 'Both';

                  return (
                    <div
                      key={dept.id}
                      className="p-4 sm:p-5 rounded-xl sm:rounded-2xl bg-zinc-900/60 border border-zinc-800/80 hover:border-zinc-700 transition flex flex-col justify-between space-y-3 sm:space-y-4 group hover:shadow-xl hover:shadow-violet-500/5 relative"
                    >
                      <div className="space-y-2.5">
                        {/* Top Stream Badge & Admin Delete */}
                        <div className="flex items-center justify-between gap-2">
                          <span
                            className={`px-2.5 py-0.5 rounded-lg text-[10px] sm:text-xs font-bold font-mono border ${
                              streamType === 'Natural'
                                ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                                : streamType === 'Social'
                                ? 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                                : 'bg-violet-500/15 text-violet-400 border-violet-500/30'
                            }`}
                          >
                            {streamType === 'Both' ? 'All Streams' : `${streamType} Science`}
                          </span>

                          <div className="flex items-center gap-2">
                            {adminMode && (
                              <button
                                onClick={() => handleDeleteDepartment(dept.id, dept.title)}
                                disabled={isDeleting}
                                className="p-1.5 rounded-lg text-zinc-500 hover:text-rose-400 hover:bg-rose-500/10 transition cursor-pointer active:scale-95"
                                title="Delete Department (Admin)"
                              >
                                <Trash2 className={`w-3.5 h-3.5 ${isDeleting ? 'animate-spin text-rose-400' : ''}`} />
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Department Name / Title */}
                        <h3 className="text-sm sm:text-base font-bold text-white tracking-tight leading-snug">
                          {dept.title}
                        </h3>

                        {/* Detailed Description / Overview */}
                        {dept.description && (
                          <div className="space-y-1 bg-zinc-950/60 p-2.5 sm:p-3 rounded-xl border border-zinc-800/70">
                            <div className="text-[10px] font-bold text-violet-400 uppercase tracking-wider flex items-center gap-1">
                              <BookOpen className="w-3 h-3 shrink-0" />
                              <span>Department Overview</span>
                            </div>
                            <p className="text-[11px] sm:text-xs text-zinc-300 leading-relaxed font-sans line-clamp-6">
                              {dept.description}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        )}

        {/* TAB 3: UNIVERSITY GUIDE & REVIEWS DIRECTORY */}
        {activeTab === 'universities' && (
          <section className="space-y-4 sm:space-y-6">
            <div className="p-3.5 sm:p-5 rounded-xl sm:rounded-2xl bg-zinc-900/70 border border-zinc-800/90 shadow-xl space-y-3 sm:space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                      University Guide
                    </h2>
                    <span className="px-2 py-0.5 rounded-full bg-teal-500/15 text-teal-400 border border-teal-500/30 text-[10px] sm:text-xs font-bold">
                      Campus Directory
                    </span>
                  </div>
                  <p className="text-[11px] sm:text-xs text-zinc-400 mt-0.5">
                    Authentic student reviews, campus environment, and university insights across Ethiopia.
                  </p>
                </div>

                <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                  <button
                    onClick={() => setIsAddUniModalOpen(true)}
                    className="flex-1 sm:flex-initial px-3.5 sm:px-4 py-2 rounded-xl bg-gradient-to-r from-teal-500 via-emerald-500 to-sky-500 hover:opacity-95 text-zinc-950 font-bold text-xs flex items-center justify-center gap-1.5 transition shadow-md shadow-teal-500/25 cursor-pointer active:scale-98"
                  >
                    <Plus className="w-4 h-4 shrink-0" />
                    <span>Add University</span>
                  </button>

                  <button
                    onClick={fetchUniversities}
                    className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition cursor-pointer shrink-0"
                    title="Refresh Universities"
                  >
                    <RefreshCw className={`w-4 h-4 ${loadingUniversities ? 'animate-spin text-teal-400' : ''}`} />
                  </button>
                </div>
              </div>

              {/* Search Bar for Universities */}
              <div className="pt-2 border-t border-zinc-800/80">
                <div className="relative w-full sm:max-w-md">
                  <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search university by name, city, code..."
                    value={uniSearchQuery}
                    onChange={(e) => setUniSearchQuery(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-8 pr-7 py-2 text-sm sm:text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-teal-500 transition shadow-inner"
                  />
                  {uniSearchQuery && (
                    <button
                      onClick={() => setUniSearchQuery('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 text-xs cursor-pointer p-1"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* University Cards Grid */}
            {loadingUniversities ? (
              <div className="p-8 sm:p-12 text-center rounded-2xl bg-zinc-900/40 border border-zinc-800/80 space-y-3">
                <RefreshCw className="w-6 h-6 text-teal-400 animate-spin mx-auto" />
                <p className="text-xs text-zinc-400">Loading university directory...</p>
              </div>
            ) : filteredUniversities.length === 0 ? (
              <div className="p-8 sm:p-12 text-center rounded-2xl bg-zinc-900/40 border border-zinc-800/80 space-y-4">
                <Landmark className="w-10 h-10 text-zinc-500 mx-auto" />
                <h3 className="font-bold text-white text-base">No universities found</h3>
                <p className="text-xs text-zinc-400 max-w-md mx-auto">
                  No university matched your search query. Click below to add a new university review and campus guide.
                </p>
                <button
                  onClick={() => setIsAddUniModalOpen(true)}
                  className="px-4 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-zinc-950 font-bold text-xs inline-flex items-center gap-1.5 cursor-pointer shadow-md active:scale-95"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add First University</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                {filteredUniversities.map((uni) => {
                  const isDeleting = deletingUniId === uni.id;

                  return (
                    <div
                      key={uni.id}
                      className="p-4 sm:p-5 rounded-xl sm:rounded-2xl bg-zinc-900/60 border border-zinc-800/80 hover:border-zinc-700 transition flex flex-col justify-between space-y-3 sm:space-y-4 group hover:shadow-xl hover:shadow-teal-500/5 relative"
                    >
                      <div className="space-y-2.5">
                        {/* Top Code, City & Admin Delete */}
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-1.5">
                            <span className="px-2.5 py-0.5 rounded-lg bg-teal-500/15 text-teal-400 border border-teal-500/30 text-[10px] sm:text-xs font-bold font-mono">
                              {uni.code}
                            </span>
                            <span className="text-[10px] sm:text-[11px] text-zinc-400 truncate max-w-[120px]">{uni.city}</span>
                          </div>

                          <div className="flex items-center gap-2">
                            {adminMode && (
                              <button
                                onClick={() => handleDeleteUniversity(uni.id, uni.name)}
                                disabled={isDeleting}
                                className="p-1.5 rounded-lg text-zinc-500 hover:text-rose-400 hover:bg-rose-500/10 transition cursor-pointer active:scale-95"
                                title="Delete University (Admin)"
                              >
                                <Trash2 className={`w-3.5 h-3.5 ${isDeleting ? 'animate-spin text-rose-400' : ''}`} />
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Name */}
                        <h3 className="text-sm sm:text-base font-bold text-white tracking-tight leading-snug">
                          {uni.name}
                        </h3>

                        {/* Review / Description */}
                        {uni.reviewDescription && (
                          <div className="space-y-1 bg-zinc-950/60 p-2.5 sm:p-3 rounded-xl border border-zinc-800/70">
                            <div className="text-[10px] font-bold text-teal-400 uppercase tracking-wider flex items-center gap-1">
                              <MessageSquare className="w-3 h-3 shrink-0" />
                              <span>Campus Review & Atmosphere</span>
                            </div>
                            <p className="text-[11px] sm:text-xs text-zinc-300 leading-relaxed font-sans line-clamp-6">
                              {uni.reviewDescription}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        )}

        {/* TAB 4: STUDENT DATABASE & SYNC */}
        {activeTab === 'students' && (
          <section className="space-y-4 sm:space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Registered Students</h2>
                <p className="text-[11px] sm:text-xs text-zinc-400">
                  Live Telegram database synchronization. Admin can change student VIP/Free status and delete records.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={fetchUsers}
                  className="w-full sm:w-auto px-3.5 py-2 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-xs font-semibold text-zinc-200 flex items-center justify-center gap-2 transition cursor-pointer shadow-sm active:scale-98"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${loadingUsers ? 'animate-spin text-indigo-400' : ''}`} />
                  <span>Refresh Sync</span>
                </button>
              </div>
            </div>

            {/* Search Input Bar */}
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <input
                type="text"
                placeholder="Search students by name, @username, phone, or Telegram ID..."
                value={studentSearchQuery}
                onChange={(e) => setStudentSearchQuery(e.target.value)}
                className="w-full bg-zinc-900/80 border border-zinc-800/80 rounded-2xl pl-10 pr-8 py-2.5 text-sm sm:text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-indigo-500 transition shadow-inner"
              />
              {studentSearchQuery && (
                <button
                  onClick={() => setStudentSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white text-xs cursor-pointer p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* MOBILE VIEW: Touch-Friendly Student Cards (< sm screens) */}
            <div className="block sm:hidden space-y-3">
              {filteredUsers.map((u) => {
                const isVip = Boolean(u.isPremium);
                const isUpdating = updatingPremiumId === u.telegramId;
                const isDeleting = deletingUserId === u.telegramId;
                const displayName = `${u.firstName || 'Freshman'} ${u.lastName || ''}`.trim();

                return (
                  <div
                    key={u.id || u.telegramId}
                    className="p-3.5 rounded-xl bg-zinc-900/70 border border-zinc-800/80 space-y-3 shadow-md"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="font-bold text-white text-sm truncate">{displayName}</div>
                        {u.username ? (
                          <span className="text-[10px] text-zinc-400 font-mono">@{u.username}</span>
                        ) : (
                          <span className="text-[10px] text-zinc-500">No username</span>
                        )}
                      </div>

                      {/* VIP Status Pill (Click to toggle) */}
                      <button
                        onClick={() => toggleUserPremium(u.telegramId, isVip)}
                        disabled={isUpdating || isDeleting}
                        title="Click to toggle status"
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold transition cursor-pointer border shrink-0 ${
                          isVip
                            ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                            : 'bg-zinc-800 text-zinc-400 border-zinc-700'
                        } disabled:opacity-50 active:scale-95`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            isUpdating
                              ? 'bg-amber-400 animate-spin'
                              : isVip
                              ? 'bg-emerald-400 animate-pulse'
                              : 'bg-zinc-500'
                          }`}
                        />
                        <span>{isUpdating ? '...' : isVip ? 'VIP Active' : 'Free User'}</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[10px] bg-zinc-950/60 p-2.5 rounded-lg border border-zinc-800/60">
                      <div>
                        <div className="text-zinc-500 font-medium">Telegram ID</div>
                        <div className="font-mono text-zinc-300 font-semibold">{u.telegramId}</div>
                      </div>
                      <div>
                        <div className="text-zinc-500 font-medium">Phone</div>
                        <div className="font-mono text-emerald-400 truncate">
                          {u.phoneNumber || 'Not Linked'}
                        </div>
                      </div>
                      <div>
                        <div className="text-zinc-500 font-medium">Stream</div>
                        <div className="text-zinc-300 font-medium">{u.stream || 'Natural'}</div>
                      </div>
                      <div>
                        <div className="text-zinc-500 font-medium">Language</div>
                        <div className="uppercase font-mono text-zinc-400">{u.languageCode || 'am'}</div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-2 pt-1 border-t border-zinc-800/60">
                      <button
                        onClick={() => toggleUserPremium(u.telegramId, isVip)}
                        disabled={isUpdating || isDeleting}
                        className="flex-1 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-semibold text-xs transition cursor-pointer border border-zinc-700 active:scale-95 disabled:opacity-50"
                      >
                        {isUpdating ? 'Updating...' : isVip ? 'Set Free' : 'Make VIP'}
                      </button>

                      <button
                        onClick={() => handleDeleteUser(u.telegramId, displayName)}
                        disabled={isDeleting || isUpdating}
                        className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/25 text-rose-400 border border-rose-500/30 transition cursor-pointer shrink-0 active:scale-95 disabled:opacity-50"
                        title="Delete Student"
                      >
                        <Trash2 className={`w-4 h-4 ${isDeleting ? 'animate-spin' : ''}`} />
                      </button>
                    </div>
                  </div>
                );
              })}

              {filteredUsers.length === 0 && (
                <div className="p-8 text-center text-zinc-500 text-xs rounded-xl bg-zinc-900/40 border border-zinc-800">
                  {studentSearchQuery
                    ? `No students found matching "${studentSearchQuery}".`
                    : 'No registered students found. Click "Refresh Sync" to load.'}
                </div>
              )}
            </div>

            {/* DESKTOP/TABLET VIEW: Full Data Table (>= sm screens) */}
            <div className="hidden sm:block bg-zinc-900/60 border border-zinc-800/80 rounded-2xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-zinc-950/80 border-b border-zinc-800 text-zinc-400 font-semibold uppercase tracking-wider">
                    <tr>
                      <th className="px-4 py-3">Student</th>
                      <th className="px-4 py-3">Telegram ID</th>
                      <th className="px-4 py-3">Phone</th>
                      <th className="px-4 py-3">Stream</th>
                      <th className="px-4 py-3">Language</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3 text-right">Admin Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/60">
                    {filteredUsers.map((u) => {
                      const isVip = Boolean(u.isPremium);
                      const isUpdating = updatingPremiumId === u.telegramId;
                      const isDeleting = deletingUserId === u.telegramId;
                      const displayName = `${u.firstName || 'Freshman'} ${u.lastName || ''}`.trim();

                      return (
                        <tr key={u.id || u.telegramId} className="hover:bg-zinc-800/30 transition">
                          <td className="px-4 py-3 font-semibold text-white">
                            <div>{displayName}</div>
                            {u.username ? (
                              <span className="block text-[10px] text-zinc-400 font-mono">@{u.username}</span>
                            ) : (
                              <span className="block text-[10px] text-zinc-500 font-normal">No username</span>
                            )}
                          </td>
                          <td className="px-4 py-3 font-mono text-zinc-400">{u.telegramId}</td>
                          <td className="px-4 py-3 font-mono text-zinc-300">
                            {u.phoneNumber ? (
                              <span className="text-emerald-400/90 font-medium">{u.phoneNumber}</span>
                            ) : (
                              <span className="text-zinc-500 italic text-[11px]">Not Linked</span>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            <span className="px-2 py-0.5 rounded-md bg-zinc-800 text-zinc-300 text-[10px] font-medium">
                              {u.stream || 'Natural'}
                            </span>
                          </td>
                          <td className="px-4 py-3 uppercase font-mono text-zinc-400">{u.languageCode || 'am'}</td>
                          
                          {/* STATUS */}
                          <td className="px-4 py-3">
                            <button
                              onClick={() => toggleUserPremium(u.telegramId, isVip)}
                              disabled={isUpdating || isDeleting}
                              title="Click to toggle status"
                              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold transition cursor-pointer border shadow-sm ${
                                isVip
                                  ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/25'
                                  : 'bg-zinc-800 text-zinc-400 border-zinc-700 hover:bg-zinc-700 hover:text-zinc-200'
                              } disabled:opacity-50`}
                            >
                              <span
                                className={`w-1.5 h-1.5 rounded-full ${
                                  isUpdating
                                    ? 'bg-amber-400 animate-spin'
                                    : isVip
                                    ? 'bg-emerald-400 animate-pulse'
                                    : 'bg-zinc-500'
                                }`}
                              />
                              <span>
                                {isUpdating ? 'Updating...' : isVip ? 'VIP Active' : 'Free Student'}
                              </span>
                            </button>
                          </td>

                          {/* ACTIONS */}
                          <td className="px-4 py-3 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => toggleUserPremium(u.telegramId, isVip)}
                                disabled={isUpdating || isDeleting}
                                title={isVip ? 'Downgrade to Free' : 'Upgrade to VIP'}
                                className="px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-semibold text-[10px] transition cursor-pointer border border-zinc-700 disabled:opacity-50"
                              >
                                {isUpdating ? '...' : isVip ? 'Set Free' : 'Set VIP'}
                              </button>

                              <button
                                onClick={() => handleDeleteUser(u.telegramId, displayName)}
                                disabled={isDeleting || isUpdating}
                                title={`Delete user ${displayName}`}
                                className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/25 text-rose-400 border border-rose-500/30 hover:border-rose-500/50 transition cursor-pointer disabled:opacity-50"
                              >
                                <Trash2 className={`w-3.5 h-3.5 ${isDeleting ? 'animate-spin' : ''}`} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}

                    {filteredUsers.length === 0 && (
                      <tr>
                        <td colSpan={7} className="px-4 py-8 text-center text-zinc-500 text-xs">
                          {studentSearchQuery
                            ? `No students found matching "${studentSearchQuery}".`
                            : 'No registered students found. Click "Refresh Sync" to fetch live students.'}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        )}
      </main>

      {/* ========================================================= */}
      {/* 1. ADD MATERIAL & DOCUMENT UPLOAD MODAL (Cloudinary/URL) */}
      {/* ========================================================= */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl sm:rounded-3xl w-full max-w-2xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-fadeIn">
            {/* Sticky Header */}
            <div className="p-3.5 sm:p-5 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/80 shrink-0">
              <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shrink-0">
                  <CloudUpload className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-extrabold text-white text-sm sm:text-base truncate">Add Course Material</h3>
                  <p className="text-[10px] sm:text-xs text-zinc-400 truncate">Upload file or save direct link to database</p>
                </div>
              </div>

              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 sm:p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition cursor-pointer shrink-0"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>

            {/* Scrollable Form Body */}
            <form onSubmit={handleAddMaterialSubmit} className="p-3.5 sm:p-6 space-y-3.5 sm:space-y-4 text-xs overflow-y-auto flex-1">
              <div className="space-y-1.5">
                <label className="font-bold text-zinc-300">
                  Material Title <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. AAU 2024 Math for Natural Sciences Mid Exam with Key"
                  value={newMaterialForm.title}
                  onChange={(e) => setNewMaterialForm({ ...newMaterialForm, title: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 sm:px-3.5 py-2.5 text-sm sm:text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-emerald-500 transition"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="space-y-1.5">
                  <label className="font-bold text-zinc-300">
                    Category <span className="text-rose-400">*</span>
                  </label>
                  <select
                    value={newMaterialForm.category}
                    onChange={(e) =>
                      setNewMaterialForm({
                        ...newMaterialForm,
                        category: e.target.value as MaterialCategory,
                      })
                    }
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2.5 text-sm sm:text-xs text-zinc-100 font-semibold focus:outline-none focus:border-emerald-500 transition"
                  >
                    <option value="module">📘 Official Module (Textbook)</option>
                    <option value="notes">📝 Lecture Notes & Slides</option>
                    <option value="worksheet">📄 Worksheet (Practice Problems)</option>
                    <option value="assignment">📑 Assignment (Solved Steps)</option>
                    <option value="mid_exam">🏆 Mid Exam (Past Paper)</option>
                    <option value="final_exam">🥇 Final Exam (Archive)</option>
                    <option value="ref_books">📚 Reference Book (Stewart, Young)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-zinc-300">
                    Stream <span className="text-rose-400">*</span>
                  </label>
                  <select
                    value={newMaterialForm.stream}
                    onChange={(e) =>
                      setNewMaterialForm({
                        ...newMaterialForm,
                        stream: e.target.value as MaterialStream,
                      })
                    }
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2.5 text-sm sm:text-xs text-zinc-100 font-semibold focus:outline-none focus:border-emerald-500 transition"
                  >
                    <option value="Natural">Natural Science</option>
                    <option value="Social">Social Science</option>
                    <option value="Both">Both (Common Course)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-zinc-300">
                  Course Code <span className="text-zinc-500 font-normal">(Optional, e.g. MATH101, PHYS101)</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. MATH101 (or leave blank)"
                  value={newMaterialForm.code}
                  onChange={(e) => setNewMaterialForm({ ...newMaterialForm, code: e.target.value.toUpperCase() })}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 sm:px-3.5 py-2.5 text-sm sm:text-xs text-zinc-100 font-mono placeholder-zinc-500 focus:outline-none focus:border-emerald-500 transition"
                />
              </div>

              {/* Document File / Cloudinary Upload Section */}
              <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-zinc-900/80 border border-zinc-800 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <label className="font-bold text-white flex items-center gap-1.5 text-[11px] sm:text-xs">
                    <CloudUpload className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400" />
                    <span>Document Attachment</span>
                  </label>

                  <div className="flex items-center gap-1 bg-zinc-950 p-1 rounded-lg border border-zinc-800 self-start sm:self-auto">
                    <button
                      type="button"
                      onClick={() => setUploadMode('file')}
                      className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition cursor-pointer ${
                        uploadMode === 'file'
                          ? 'bg-emerald-500 text-zinc-950'
                          : 'text-zinc-400 hover:text-zinc-200'
                      }`}
                    >
                      Upload File
                    </button>
                    <button
                      type="button"
                      onClick={() => setUploadMode('url')}
                      className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition cursor-pointer ${
                        uploadMode === 'url'
                          ? 'bg-emerald-500 text-zinc-950'
                          : 'text-zinc-400 hover:text-zinc-200'
                      }`}
                    >
                      Direct URL
                    </button>
                  </div>
                </div>

                {uploadMode === 'file' ? (
                  <div className="space-y-2">
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-zinc-700 hover:border-emerald-500/80 rounded-xl sm:rounded-2xl p-4 sm:p-6 text-center cursor-pointer transition bg-zinc-950/60 group"
                    >
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept=".pdf,.docx,.doc,.pptx,.ppt,.zip"
                        className="hidden"
                        onChange={(e) => {
                          const f = e.target.files?.[0];
                          if (f) {
                            setSelectedFile(f);
                            const sz =
                              f.size > 1024 * 1024
                                ? `${(f.size / (1024 * 1024)).toFixed(1)} MB`
                                : `${(f.size / 1024).toFixed(0)} KB`;
                            const ext = f.name.split('.').pop()?.toLowerCase() || 'pdf';
                            setNewMaterialForm((prev) => ({
                              ...prev,
                              fileSize: sz,
                              fileFormat: ext,
                              title: prev.title || f.name.replace(/\.[^/.]+$/, ''),
                            }));
                          }
                        }}
                      />
                      <FileUp className="w-6 h-6 sm:w-8 sm:h-8 text-zinc-500 group-hover:text-emerald-400 transition mx-auto mb-2" />
                      {selectedFile ? (
                        <div className="text-emerald-300 font-semibold text-xs space-y-0.5">
                          <div className="flex items-center justify-center gap-1.5 flex-wrap">
                            <FileCheck className="w-4 h-4 text-emerald-400" />
                            <span className="truncate max-w-[200px]">{selectedFile.name}</span>
                          </div>
                          <p className="text-[10px] text-zinc-400">
                            {newMaterialForm.fileSize} • Format: {newMaterialForm.fileFormat.toUpperCase()}
                          </p>
                        </div>
                      ) : (
                        <div>
                          <p className="text-zinc-300 font-semibold text-xs">Click or Drag & Drop PDF / DOCX file</p>
                          <p className="text-[10px] text-zinc-500 mt-0.5">
                            Files are securely processed and uploaded via Cloudinary storage
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    <div className="relative">
                      <LinkIcon className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="url"
                        placeholder="https://res.cloudinary.com/... or Drive / PDF URL"
                        value={newMaterialForm.fileUrl}
                        onChange={(e) => setNewMaterialForm({ ...newMaterialForm, fileUrl: e.target.value })}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-8 pr-3 py-2 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-emerald-500 transition font-mono text-[11px]"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <input
                        type="text"
                        placeholder="File Size (e.g. 5.0 MB)"
                        value={newMaterialForm.fileSize}
                        onChange={(e) => setNewMaterialForm({ ...newMaterialForm, fileSize: e.target.value })}
                        className="bg-zinc-950 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-zinc-300 text-[11px]"
                      />
                      <input
                        type="text"
                        placeholder="Format (e.g. pdf)"
                        value={newMaterialForm.fileFormat}
                        onChange={(e) => setNewMaterialForm({ ...newMaterialForm, fileFormat: e.target.value })}
                        className="bg-zinc-950 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-zinc-300 text-[11px]"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-zinc-300">Brief Overview / Description</label>
                <textarea
                  rows={2}
                  placeholder="Optional chapter outline, topics included, or instructor notes..."
                  value={newMaterialForm.description}
                  onChange={(e) => setNewMaterialForm({ ...newMaterialForm, description: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-2.5 text-sm sm:text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-emerald-500 transition resize-none"
                />
              </div>

              {uploadProgressText && (
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 animate-spin text-emerald-400 shrink-0" />
                  <span className="text-[11px] truncate">{uploadProgressText}</span>
                </div>
              )}
            </form>

            {/* Sticky Footer */}
            <div className="p-3 sm:p-4 border-t border-zinc-800 bg-zinc-900/80 flex items-center justify-end gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                disabled={isSubmitting}
                className="px-3.5 sm:px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-semibold transition cursor-pointer text-xs active:scale-95"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAddMaterialSubmit}
                disabled={isSubmitting}
                className="px-4 sm:px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-sky-500 hover:opacity-95 text-zinc-950 font-bold flex items-center gap-1.5 sm:gap-2 transition shadow-lg shadow-emerald-500/25 cursor-pointer disabled:opacity-50 text-xs active:scale-95"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <CloudUpload className="w-4 h-4" />
                    <span>Save & Publish</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 2. ADD DEPARTMENT INFO MODAL */}
      {/* ========================================================= */}
      {isAddDeptModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl sm:rounded-3xl w-full max-w-2xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-fadeIn">
            {/* Sticky Header */}
            <div className="p-3.5 sm:p-5 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/80 shrink-0">
              <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-violet-500/15 border border-violet-500/30 text-violet-400 flex items-center justify-center shrink-0">
                  <Building2 className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-extrabold text-white text-sm sm:text-base truncate">Add Department Info</h3>
                  <p className="text-[10px] sm:text-xs text-zinc-400 truncate">Type or paste department overview and guidance</p>
                </div>
              </div>

              <button
                onClick={() => setIsAddDeptModalOpen(false)}
                className="p-1.5 sm:p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition cursor-pointer shrink-0"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>

            {/* Scrollable Form Body */}
            <form onSubmit={handleAddDepartmentSubmit} className="p-3.5 sm:p-6 space-y-3.5 sm:space-y-4 text-xs overflow-y-auto flex-1">
              {/* Row 1: Title & Stream Dropdown */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                <div className="sm:col-span-2 space-y-1.5">
                  <label className="font-bold text-zinc-300">
                    Department Name / Title <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Software Engineering"
                    value={newDeptForm.title}
                    onChange={(e) => setNewDeptForm({ ...newDeptForm, title: e.target.value })}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 sm:px-3.5 py-2.5 text-sm sm:text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-violet-500 transition"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-zinc-300">
                    Academic Stream <span className="text-rose-400">*</span>
                  </label>
                  <select
                    value={newDeptForm.stream}
                    onChange={(e) =>
                      setNewDeptForm({
                        ...newDeptForm,
                        stream: e.target.value as 'Natural' | 'Social' | 'Both',
                      })
                    }
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 sm:px-3.5 py-2.5 text-sm sm:text-xs text-zinc-100 focus:outline-none focus:border-violet-500 transition cursor-pointer font-medium"
                  >
                    <option value="Natural">Natural Science</option>
                    <option value="Social">Social Science</option>
                    <option value="Both">Both Streams</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-zinc-300 flex items-center justify-between flex-wrap gap-1">
                  <span>Detailed Department Description (Type or Paste) <span className="text-rose-400">*</span></span>
                  <span className="text-zinc-500 font-normal text-[10px]">Paragraphs supported</span>
                </label>
                <textarea
                  rows={5}
                  required
                  placeholder="Type or paste comprehensive information about what this department teaches, curriculum highlights, labs, research focus, careers, and student insights..."
                  value={newDeptForm.description}
                  onChange={(e) => setNewDeptForm({ ...newDeptForm, description: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-sm sm:text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-violet-500 transition resize-y leading-relaxed font-sans"
                />
              </div>
            </form>

            {/* Sticky Footer */}
            <div className="p-3 sm:p-4 border-t border-zinc-800 bg-zinc-900/80 flex items-center justify-end gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setIsAddDeptModalOpen(false)}
                disabled={isSubmittingDept}
                className="px-3.5 sm:px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-semibold transition cursor-pointer text-xs active:scale-95"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAddDepartmentSubmit}
                disabled={isSubmittingDept}
                className="px-4 sm:px-5 py-2 rounded-xl bg-gradient-to-r from-violet-500 via-purple-500 to-indigo-500 hover:opacity-95 text-white font-bold flex items-center gap-1.5 sm:gap-2 transition shadow-lg shadow-violet-500/25 cursor-pointer disabled:opacity-50 text-xs active:scale-95"
              >
                {isSubmittingDept ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <FolderPlus className="w-4 h-4" />
                    <span>Save Department</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 3. ADD UNIVERSITY & REVIEWS MODAL */}
      {/* ========================================================= */}
      {isAddUniModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl sm:rounded-3xl w-full max-w-2xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-fadeIn">
            {/* Sticky Header */}
            <div className="p-3.5 sm:p-5 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/80 shrink-0">
              <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-teal-500/15 border border-teal-500/30 text-teal-400 flex items-center justify-center shrink-0">
                  <Landmark className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-extrabold text-white text-sm sm:text-base truncate">Add University Guide</h3>
                  <p className="text-[10px] sm:text-xs text-zinc-400 truncate">Type or paste campus review and details</p>
                </div>
              </div>

              <button
                onClick={() => setIsAddUniModalOpen(false)}
                className="p-1.5 sm:p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition cursor-pointer shrink-0"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>

            {/* Scrollable Form Body */}
            <form onSubmit={handleAddUniversitySubmit} className="p-3.5 sm:p-6 space-y-3.5 sm:space-y-4 text-xs overflow-y-auto flex-1">
              {/* Row 1: Name & Code */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                <div className="sm:col-span-2 space-y-1.5">
                  <label className="font-bold text-zinc-300">
                    University Name <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. University of Gondar (UoG)"
                    value={newUniForm.name}
                    onChange={(e) => setNewUniForm({ ...newUniForm, name: e.target.value })}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 sm:px-3.5 py-2.5 text-sm sm:text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-teal-500 transition"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-zinc-300">
                    Acronym / Code <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. UOG"
                    value={newUniForm.code}
                    onChange={(e) => setNewUniForm({ ...newUniForm, code: e.target.value.toUpperCase() })}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 sm:px-3.5 py-2.5 text-sm sm:text-xs text-zinc-100 font-mono font-bold placeholder-zinc-500 focus:outline-none focus:border-teal-500 transition"
                  />
                </div>
              </div>

              {/* Row 2: City / Location */}
              <div className="space-y-1.5">
                <label className="font-bold text-zinc-300">
                  City / Location <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Gondar, Amhara"
                  value={newUniForm.city}
                  onChange={(e) => setNewUniForm({ ...newUniForm, city: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 sm:px-3.5 py-2.5 text-sm sm:text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-teal-500 transition"
                />
              </div>

              {/* Row 3: Full Review & Campus Description */}
              <div className="space-y-1.5">
                <label className="font-bold text-zinc-300 flex items-center justify-between flex-wrap gap-1">
                  <span>Detailed Student Review & Campus Description <span className="text-rose-400">*</span></span>
                  <span className="text-zinc-500 font-normal text-[10px]">Comprehensive review</span>
                </label>
                <textarea
                  rows={5}
                  required
                  placeholder="Type or paste detailed reviews about campus life, study halls, library facilities, dorms, cafeteria food, city weather, living expenses, and academic culture..."
                  value={newUniForm.reviewDescription}
                  onChange={(e) => setNewUniForm({ ...newUniForm, reviewDescription: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-sm sm:text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-teal-500 transition resize-y leading-relaxed font-sans"
                />
              </div>
            </form>

            {/* Sticky Footer */}
            <div className="p-3 sm:p-4 border-t border-zinc-800 bg-zinc-900/80 flex items-center justify-end gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setIsAddUniModalOpen(false)}
                disabled={isSubmittingUni}
                className="px-3.5 sm:px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-semibold transition cursor-pointer text-xs active:scale-95"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAddUniversitySubmit}
                disabled={isSubmittingUni}
                className="px-4 sm:px-5 py-2 rounded-xl bg-gradient-to-r from-teal-500 via-emerald-500 to-sky-500 hover:opacity-95 text-zinc-950 font-bold flex items-center gap-1.5 sm:gap-2 transition shadow-lg shadow-teal-500/25 cursor-pointer disabled:opacity-50 text-xs active:scale-95"
              >
                {isSubmittingUni ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Landmark className="w-4 h-4" />
                    <span>Save University</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  LayoutDashboard,
  User,
  FolderGit2,
  Layers,
  Briefcase,
  Award,
  Mail,
  LogOut,
  ExternalLink,
  Plus,
  Edit2,
  Trash2,
  Check,
  X,
  Save,
  Loader2,
  Shield,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Activity,
  Eye,
  Globe,
  Zap,
  Clock,
  MessageSquare,
  FileText,
  Lock,
  Phone,
  UploadCloud,
  Link as LinkIcon,
  Search,
  Star,
  Filter,
  Code2,
  Tag,
  Github,
  Building2,
  GraduationCap,
  Calendar
} from 'lucide-react';
import DynamicIcon from '@/components/DynamicIcon';
import ImageUpload from '@/components/ImageUpload';
import ThemeToggle from '@/components/ThemeToggle';
import { ICON_PRESETS } from '@/lib/iconPresets';

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', message: '' });

  // Project Filter States
  const [projectSearch, setProjectSearch] = useState('');
  const [projectCategoryFilter, setProjectCategoryFilter] = useState('all');
  const [projectFeaturedOnly, setProjectFeaturedOnly] = useState(false);

  // Skill Filter States
  const [skillSearch, setSkillSearch] = useState('');
  const [skillCategoryFilter, setSkillCategoryFilter] = useState('all');

  // Experience Filter States
  const [expSearch, setExpSearch] = useState('');
  const [expTypeFilter, setExpTypeFilter] = useState('all');

  // Certificate Filter States
  const [certSearch, setCertSearch] = useState('');

  // Data State
  const [user, setUser] = useState(null);
  const [settings, setSettings] = useState(null);
  const [projects, setProjects] = useState([]);
  const [skills, setSkills] = useState([]);
  const [experiences, setExperiences] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [messages, setMessages] = useState([]);

  // Modal States
  const [projectModal, setProjectModal] = useState({ open: false, mode: 'create', data: null });
  const [skillModal, setSkillModal] = useState({ open: false, mode: 'create', data: null });
  const [expModal, setExpModal] = useState({ open: false, mode: 'create', data: null });
  const [certModal, setCertModal] = useState({ open: false, mode: 'create', data: null });
  const [viewMessageModal, setViewMessageModal] = useState(null);

  // Initial Data Load & Session Check
  const fetchData = async () => {
    try {
      setLoading(true);
      const authRes = await fetch('/api/auth/me');
      if (!authRes.ok) {
        router.push('/admin/login');
        return;
      }

      const [portfolioRes, msgRes] = await Promise.all([
        fetch('/api/portfolio'),
        fetch('/api/admin/messages'),
      ]);

      const pData = await portfolioRes.json();
      const mData = await msgRes.json();

      setUser(pData.user);
      setSettings(pData.settings);
      setProjects(pData.projects || []);
      setSkills(pData.skills || []);
      setExperiences(pData.experiences || []);
      setCertificates(pData.certificates || []);
      setMessages(mData.messages || []);
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const showToast = (type, message) => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback({ type: '', message: '' }), 4000);
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/admin/login');
  };

  // --- Profile & Settings Form Submit ---
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('/api/admin/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...user,
          ...settings,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Gagal menyimpan profil');
      showToast('success', 'Profil dan pengaturan berhasil diperbarui!');
    } catch (err) {
      showToast('error', err.message);
    } finally {
      setSaving(false);
    }
  };

  // --- Project Handlers ---
  const handleSaveProject = async (e) => {
    e.preventDefault();
    setSaving(true);
    const form = e.target;
    const coverImage = projectModal.data?.coverImage || form.coverImage?.value || '';

    if (!coverImage) {
      showToast('error', 'Silakan pilih foto cover proyek terlebih dahulu');
      setSaving(false);
      return;
    }

    const projectPayload = {
      id: projectModal.data?.id,
      title: form.title.value,
      category: form.category.value,
      description: form.description.value,
      coverImage,
      demoUrl: form.demoUrl.value,
      githubUrl: form.githubUrl.value,
      techStack: form.techStack.value.split(',').map((s) => s.trim()).filter(Boolean),
      featured: form.featured.checked,
      order: Number(form.order.value) || 0,
    };

    try {
      const res = await fetch('/api/admin/projects', {
        method: projectModal.mode === 'create' ? 'POST' : 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(projectPayload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Gagal menyimpan proyek');
      showToast('success', `Proyek berhasil ${projectModal.mode === 'create' ? 'ditambahkan' : 'diperbarui'}!`);
      setProjectModal({ open: false, mode: 'create', data: null });
      fetchData();
    } catch (err) {
      showToast('error', err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteProject = async (id) => {
    if (!confirm('Apakah Anda yakin ingin menghapus proyek ini?')) return;
    try {
      const res = await fetch(`/api/admin/projects?id=${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Gagal menghapus proyek');
      showToast('success', 'Proyek berhasil dihapus');
      fetchData();
    } catch (err) {
      showToast('error', err.message);
    }
  };

  // --- Skill Handlers ---
  const handleSaveSkill = async (e) => {
    e.preventDefault();
    setSaving(true);
    const form = e.target;
    const skillPayload = {
      id: skillModal.data?.id,
      name: form.name.value,
      category: form.category.value,
      iconName: form.iconName.value,
      level: Number(form.level.value) || 80,
      order: Number(form.order.value) || 0,
    };

    try {
      const res = await fetch('/api/admin/skills', {
        method: skillModal.mode === 'create' ? 'POST' : 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(skillPayload),
      });
      if (!res.ok) throw new Error('Gagal menyimpan skill');
      showToast('success', 'Skill berhasil disimpan');
      setSkillModal({ open: false, mode: 'create', data: null });
      fetchData();
    } catch (err) {
      showToast('error', err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteSkill = async (id) => {
    if (!confirm('Hapus skill ini?')) return;
    try {
      await fetch(`/api/admin/skills?id=${id}`, { method: 'DELETE' });
      showToast('success', 'Skill dihapus');
      fetchData();
    } catch (err) {
      showToast('error', err.message);
    }
  };

  // --- Experience Handlers ---
  const handleSaveExp = async (e) => {
    e.preventDefault();
    setSaving(true);
    const form = e.target;
    const expPayload = {
      id: expModal.data?.id,
      type: form.type.value,
      role: form.role.value,
      institution: form.institution.value,
      period: form.period.value,
      description: form.description.value,
      order: Number(form.order.value) || 0,
    };

    try {
      const res = await fetch('/api/admin/experiences', {
        method: expModal.mode === 'create' ? 'POST' : 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(expPayload),
      });
      if (!res.ok) throw new Error('Gagal menyimpan pengalaman');
      showToast('success', 'Data pengalaman disimpan');
      setExpModal({ open: false, mode: 'create', data: null });
      fetchData();
    } catch (err) {
      showToast('error', err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteExp = async (id) => {
    if (!confirm('Hapus entri ini?')) return;
    try {
      await fetch(`/api/admin/experiences?id=${id}`, { method: 'DELETE' });
      showToast('success', 'Data dihapus');
      fetchData();
    } catch (err) {
      showToast('error', err.message);
    }
  };

  // --- Certificate Handlers ---
  const handleSaveCert = async (e) => {
    e.preventDefault();
    setSaving(true);
    const form = e.target;
    const imageUrl = certModal.data?.imageUrl || '';

    const certPayload = {
      id: certModal.data?.id,
      title: form.title.value,
      issuer: form.issuer.value,
      issueDate: form.issueDate.value,
      credentialUrl: form.credentialUrl.value,
      imageUrl,
      order: Number(form.order.value) || 0,
    };

    try {
      const res = await fetch('/api/admin/certificates', {
        method: certModal.mode === 'create' ? 'POST' : 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(certPayload),
      });
      if (!res.ok) throw new Error('Gagal menyimpan sertifikat');
      showToast('success', 'Sertifikat disimpan');
      setCertModal({ open: false, mode: 'create', data: null });
      fetchData();
    } catch (err) {
      showToast('error', err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteCert = async (id) => {
    if (!confirm('Hapus sertifikat ini?')) return;
    try {
      await fetch(`/api/admin/certificates?id=${id}`, { method: 'DELETE' });
      showToast('success', 'Sertifikat dihapus');
      fetchData();
    } catch (err) {
      showToast('error', err.message);
    }
  };

  // --- Message Handlers ---
  const handleToggleReadMessage = async (id, currentStatus) => {
    try {
      await fetch('/api/admin/messages', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, isRead: !currentStatus }),
      });
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteMessage = async (id) => {
    if (!confirm('Hapus pesan ini?')) return;
    try {
      await fetch(`/api/admin/messages?id=${id}`, { method: 'DELETE' });
      showToast('success', 'Pesan dihapus');
      if (viewMessageModal?.id === id) setViewMessageModal(null);
      fetchData();
    } catch (err) {
      showToast('error', err.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#090d16] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-teal-500" />
          <p className="text-sm text-slate-500 dark:text-slate-400">Loading Admin Dashboard...</p>
        </div>
      </div>
    );
  }

  const unreadMessagesCount = messages.filter((m) => !m.isRead).length;

  return (
    <div className="min-h-screen h-screen bg-slate-100/90 dark:bg-[#04070e] text-slate-900 dark:text-slate-100 flex flex-col md:flex-row p-3 md:p-4 gap-3 md:gap-4 overflow-hidden transition-colors duration-300">
      {/* Toast Notification */}
      {feedback.message && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl border text-sm animate-in slide-in-from-bottom-5 duration-300 ${
            feedback.type === 'success'
              ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-700 dark:text-emerald-300 bg-white dark:bg-slate-900'
              : 'bg-rose-500/10 border-rose-500/40 text-rose-700 dark:text-rose-300 bg-white dark:bg-slate-900'
          }`}
        >
          {feedback.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-500 dark:text-emerald-400" />
          ) : (
            <X className="w-5 h-5 text-rose-500 dark:text-rose-400" />
          )}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Sidebar Navigation - Separated Floating Island */}
      <aside className="w-full md:w-72 bg-white dark:bg-[#0b101b] rounded-3xl border border-slate-200/90 dark:border-white/10 flex flex-col justify-between shrink-0 shadow-lg dark:shadow-2xl overflow-hidden h-full z-20 transition-all">
        <div className="flex flex-col h-full overflow-y-auto no-scrollbar">
          {/* Brand Header */}
          <div className="h-20 px-6 flex items-center gap-3.5 border-b border-slate-200/80 dark:border-white/10 bg-slate-50/50 dark:bg-slate-950/40">
            <div className="relative w-11 h-11 rounded-2xl bg-teal-500 flex items-center justify-center text-slate-950 font-bold shadow-sm shrink-0">
              <Shield className="w-5 h-5 text-slate-950" />
              <span className="absolute 0 top-0.5 right-0.5 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500 ring-2 ring-white dark:ring-slate-950" />
              </span>
            </div>
            <div className="flex flex-col justify-center">
              <div className="flex items-center gap-2">
                <h2 className="font-extrabold text-sm tracking-tight text-slate-900 dark:text-white leading-none">
                  Portfolio CMS
                </h2>
                <span className="text-[9px] font-extrabold font-mono px-1.5 py-0.5 rounded-md bg-teal-500/15 text-teal-600 dark:text-teal-400 border border-teal-500/30">
                  PRO
                </span>
              </div>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium mt-1">
                Control Center
              </span>
            </div>
          </div>

          {/* Categorized Navigation Menu */}
          <nav className="p-4 space-y-6 flex-1">
            {/* GROUP 1: OVERVIEW */}
            <div>
              <div className="text-[10px] font-bold font-mono text-slate-400 dark:text-slate-500 uppercase tracking-wider px-3 mb-2">
                Main Dashboard
              </div>
              <div className="space-y-1">
                {[
                  { id: 'overview', name: 'Dashboard Overview', icon: LayoutDashboard },
                ].map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full group flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold transition-all relative ${
                        isActive
                          ? 'bg-teal-500 text-slate-950 font-bold shadow-sm'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${isActive ? 'text-slate-950' : 'text-teal-500'}`} />
                        <span>{item.name}</span>
                      </div>
                      {isActive && (
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-950 animate-pulse" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* GROUP 2: CONTENT MANAGEMENT */}
            <div>
              <div className="text-[10px] font-bold font-mono text-slate-400 dark:text-slate-500 uppercase tracking-wider px-3 mb-2">
                Manajemen Konten
              </div>
              <div className="space-y-1">
                {[
                  { id: 'profile', name: 'Profile & Foto', icon: User },
                  { id: 'projects', name: 'Projects', icon: FolderGit2, badge: projects.length },
                  { id: 'skills', name: 'Skills & Ikon', icon: Layers, badge: skills.length },
                  { id: 'experience', name: 'Experience & Edu', icon: Briefcase, badge: experiences.length },
                  { id: 'certificates', name: 'Certificates', icon: Award, badge: certificates.length },
                ].map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full group flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold transition-all relative ${
                        isActive
                          ? 'bg-teal-500 text-slate-950 font-bold shadow-sm'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${isActive ? 'text-slate-950' : 'text-slate-400 group-hover:text-teal-500'}`} />
                        <span>{item.name}</span>
                      </div>
                      {item.badge !== undefined && item.badge > 0 && (
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full transition-all ${
                            isActive
                              ? 'bg-slate-950 text-teal-300 shadow-sm'
                              : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 group-hover:bg-teal-500/20 group-hover:text-teal-500'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* GROUP 3: COMMUNICATION */}
            <div>
              <div className="text-[10px] font-bold font-mono text-slate-400 dark:text-slate-500 uppercase tracking-wider px-3 mb-2">
                Komunikasi
              </div>
              <div className="space-y-1">
                {[
                  { id: 'messages', name: 'Inbox Messages', icon: Mail, badge: unreadMessagesCount, badgeColor: 'bg-rose-500 text-white' },
                ].map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full group flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold transition-all relative ${
                        isActive
                          ? 'bg-teal-500 text-slate-950 font-bold shadow-sm'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${isActive ? 'text-slate-950' : 'text-slate-400 group-hover:text-teal-500'}`} />
                        <span>{item.name}</span>
                      </div>
                      {item.badge !== undefined && item.badge > 0 && (
                        <span
                          className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                            isActive
                              ? 'bg-slate-950 text-rose-300'
                              : 'bg-rose-500 text-white shadow-sm'
                          }`}
                        >
                          {item.badge} Baru
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </nav>

          {/* Sidebar Footer Actions */}
          <div className="p-4 border-t border-slate-200/80 dark:border-white/10 bg-slate-50/40 dark:bg-slate-950/40 space-y-2 mt-auto">
            <Link
              href="/"
              target="_blank"
              className="w-full flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-2xl text-xs font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 hover:bg-teal-500 hover:text-slate-950 dark:hover:bg-teal-500 dark:hover:text-slate-950 border border-slate-200 dark:border-white/10 transition-all shadow-sm group"
            >
              <ExternalLink className="w-3.5 h-3.5 text-teal-500 group-hover:text-slate-950 transition-colors" />
              <span>Lihat Live Website</span>
            </Link>

            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-2xl text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-500 hover:text-white dark:hover:bg-rose-500/20 transition-all border border-rose-500/20 group"
            >
              <LogOut className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
              <span>Sign Out / Keluar</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area - Separated Floating Island */}
      <div className="flex-1 flex flex-col min-w-0 bg-white dark:bg-[#0b101b] rounded-3xl border border-slate-200/90 dark:border-white/10 shadow-lg dark:shadow-2xl overflow-hidden h-full transition-all">
        {/* Top Header - Symmetrical Header Island */}
        <header className="h-20 px-6 sm:px-8 border-b border-slate-200/80 dark:border-white/10 bg-slate-50/50 dark:bg-slate-950/40 backdrop-blur-md flex items-center justify-between shrink-0">
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white capitalize tracking-tight flex items-center gap-2">
              {activeTab === 'overview' && 'Dashboard Overview'}
              {activeTab === 'profile' && 'Profile, Foto & Settings'}
              {activeTab === 'projects' && 'Projects Manager'}
              {activeTab === 'skills' && 'Skills & Ikon Teknologi'}
              {activeTab === 'experience' && 'Experience & Learning Timeline'}
              {activeTab === 'certificates' && 'Certificates & Credentials'}
              {activeTab === 'messages' && 'Visitor Messages Inbox'}
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
              Kelola data portofolio dengan mudah tanpa perlu mengetik kode/link manual.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <div className="text-xs px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-white/10 text-slate-700 dark:text-slate-300 flex items-center gap-2.5 shadow-sm font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Logged in as <b className="text-slate-900 dark:text-white font-semibold">{user?.name || 'Noval Lias Ramadani'}</b></span>
            </div>
          </div>
        </header>

        {/* Scrollable Content Body */}
        <main className="flex-1 p-6 sm:p-8 overflow-y-auto">

        {/* TAB 1: OVERVIEW - Clean Solid Command Center */}
        {activeTab === 'overview' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            
            {/* 1. HERO WELCOME BANNER - Clean & Clear */}
            <div className="p-6 sm:p-7 rounded-3xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200/90 dark:border-white/10 shadow-xs">
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                <div className="space-y-2 max-w-2xl">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 text-teal-600 dark:text-teal-400 text-xs font-bold uppercase tracking-wider border border-teal-500/20">
                    <Sparkles className="w-3.5 h-3.5 text-teal-500" />
                    <span>Portfolio Control Hub</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                    Halo, {user?.name || 'Noval Lias'}! 👋
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-normal">
                    Pusat kendali portofolio Anda siap digunakan. Kelola karya proyek, skill teknologi, milestone perjalanan, serta tanggapi pesan klien secara real-time.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3 shrink-0 w-full lg:w-auto">
                  <Link
                    href="/"
                    target="_blank"
                    className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-teal-500 text-slate-950 font-bold text-xs sm:text-sm shadow-sm hover:bg-teal-400 transition-all"
                  >
                    <Eye className="w-4 h-4" />
                    <span>Buka Live Website</span>
                  </Link>
                  <button
                    onClick={() => setActiveTab('messages')}
                    className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-xs sm:text-sm border border-slate-200 dark:border-white/10 shadow-xs transition-all"
                  >
                    <MessageSquare className="w-4 h-4 text-teal-500" />
                    <span>Kotak Masuk ({unreadMessagesCount})</span>
                  </button>
                </div>
              </div>
            </div>

            {/* 2. FIVE METRIC KPI STAT CARDS - Solid & Crisp */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              {/* Card 1: Projects */}
              <div 
                onClick={() => setActiveTab('projects')}
                className="group p-5 rounded-3xl bg-slate-50/70 dark:bg-slate-900/50 hover:bg-white dark:hover:bg-slate-900 border border-slate-200/80 dark:border-white/10 hover:border-teal-500/50 transition-all duration-200 cursor-pointer shadow-xs"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="w-9 h-9 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center">
                    <FolderGit2 className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                    {projects.filter((p) => p.featured).length} Unggulan
                  </span>
                </div>
                <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  {projects.length}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1 flex items-center justify-between">
                  <span>Total Proyek</span>
                  <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-teal-500" />
                </div>
              </div>

              {/* Card 2: Skills */}
              <div 
                onClick={() => setActiveTab('skills')}
                className="group p-5 rounded-3xl bg-slate-50/70 dark:bg-slate-900/50 hover:bg-white dark:hover:bg-slate-900 border border-slate-200/80 dark:border-white/10 hover:border-cyan-500/50 transition-all duration-200 cursor-pointer shadow-xs"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="w-9 h-9 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center">
                    <Layers className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                    Tech Stack
                  </span>
                </div>
                <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  {skills.length}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1 flex items-center justify-between">
                  <span>Keahlian & Ikon</span>
                  <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-cyan-500" />
                </div>
              </div>

              {/* Card 3: Experiences */}
              <div 
                onClick={() => setActiveTab('experience')}
                className="group p-5 rounded-3xl bg-slate-50/70 dark:bg-slate-900/50 hover:bg-white dark:hover:bg-slate-900 border border-slate-200/80 dark:border-white/10 hover:border-indigo-500/50 transition-all duration-200 cursor-pointer shadow-xs"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="w-9 h-9 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                    <Briefcase className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                    Peta Karir
                  </span>
                </div>
                <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  {experiences.length}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1 flex items-center justify-between">
                  <span>Pengalaman</span>
                  <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-indigo-500" />
                </div>
              </div>

              {/* Card 4: Certificates */}
              <div 
                onClick={() => setActiveTab('certificates')}
                className="group p-5 rounded-3xl bg-slate-50/70 dark:bg-slate-900/50 hover:bg-white dark:hover:bg-slate-900 border border-slate-200/80 dark:border-white/10 hover:border-amber-500/50 transition-all duration-200 cursor-pointer shadow-xs"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                    <Award className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                    Terverifikasi
                  </span>
                </div>
                <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  {certificates.length}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1 flex items-center justify-between">
                  <span>Sertifikat</span>
                  <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-amber-500" />
                </div>
              </div>

              {/* Card 5: Messages */}
              <div 
                onClick={() => setActiveTab('messages')}
                className="group p-5 rounded-3xl bg-slate-50/70 dark:bg-slate-900/50 hover:bg-white dark:hover:bg-slate-900 border border-slate-200/80 dark:border-white/10 hover:border-rose-500/50 transition-all duration-200 cursor-pointer shadow-xs col-span-2 sm:col-span-1"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="w-9 h-9 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center">
                    <Mail className="w-4 h-4" />
                  </div>
                  {unreadMessagesCount > 0 ? (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500 text-white">
                      {unreadMessagesCount} Baru
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                      Terkendali
                    </span>
                  )}
                </div>
                <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  {messages.length}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1 flex items-center justify-between">
                  <span>Pesan Klien</span>
                  <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-rose-500" />
                </div>
              </div>
            </div>

            {/* 3. MAIN DASHBOARD CONTENT GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* LEFT COLUMN: RECENT INQUIRIES & RECENT PROJECTS SNAPSHOT */}
              <div className="lg:col-span-7 space-y-6">
                
                {/* Recent Inquiries Card */}
                <div className="p-6 sm:p-7 rounded-3xl bg-slate-50/70 dark:bg-slate-900/50 border border-slate-200/80 dark:border-white/10 shadow-xs">
                  <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center">
                        <MessageSquare className="w-4 h-4" />
                      </div>
                      <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                        Pesan Masuk Terbaru
                      </h3>
                    </div>
                    <button
                      onClick={() => setActiveTab('messages')}
                      className="text-xs font-semibold text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-1"
                    >
                      <span>Lihat Semua</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>

                  {messages.length === 0 ? (
                    <div className="text-center py-8 px-4 rounded-2xl bg-white/50 dark:bg-slate-950/40 border border-dashed border-slate-200 dark:border-slate-800">
                      <Mail className="w-8 h-8 mx-auto text-slate-400 mb-2 opacity-50" />
                      <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                        Belum ada pesan masuk dari formulir kontak.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {messages.slice(0, 4).map((msg) => (
                        <div
                          key={msg.id}
                          onClick={() => {
                            setViewMessageModal(msg);
                            if (!msg.isRead) handleToggleReadMessage(msg.id, false);
                          }}
                          className="p-4 rounded-2xl bg-white dark:bg-slate-950/60 hover:bg-slate-100/80 dark:hover:bg-slate-900 border border-slate-200/80 dark:border-white/5 hover:border-teal-500/40 cursor-pointer transition-all flex items-center justify-between gap-4 group shadow-xs"
                        >
                          <div className="flex items-center gap-3.5 min-w-0">
                            {/* Avatar Initials */}
                            <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 flex items-center justify-center font-bold text-sm shrink-0">
                              {msg.name?.charAt(0)?.toUpperCase() || 'V'}
                            </div>

                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-sm text-slate-900 dark:text-white truncate">
                                  {msg.name}
                                </span>
                                {!msg.isRead && (
                                  <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
                                )}
                              </div>
                              <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                                {msg.subject || msg.message}
                              </p>
                            </div>
                          </div>

                          <div className="text-right shrink-0">
                            <span className="text-[10px] font-mono font-medium text-slate-400 dark:text-slate-500 block">
                              {new Date(msg.createdAt).toLocaleDateString()}
                            </span>
                            <span className="text-[10px] text-teal-600 dark:text-teal-400 font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                              Buka Detail ➔
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Recent Projects Snapshot */}
                <div className="p-6 sm:p-7 rounded-3xl bg-slate-50/70 dark:bg-slate-900/50 border border-slate-200/80 dark:border-white/10 shadow-xs">
                  <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center">
                        <FolderGit2 className="w-4 h-4" />
                      </div>
                      <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                        Daftar Proyek Portofolio Terkini
                      </h3>
                    </div>
                    <button
                      onClick={() => setActiveTab('projects')}
                      className="text-xs font-semibold text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-1"
                    >
                      <span>Kelola Semua ({projects.length})</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>

                  {projects.length === 0 ? (
                    <div className="text-center py-8 px-4 rounded-2xl bg-white/50 dark:bg-slate-950/40 border border-dashed border-slate-200 dark:border-slate-800">
                      <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                        Belum ada proyek yang ditambahkan.
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {projects.slice(0, 3).map((proj) => (
                        <div
                          key={proj.id}
                          onClick={() => {
                            setProjectModal({ open: true, mode: 'edit', data: proj });
                            setActiveTab('projects');
                          }}
                          className="group p-3 rounded-2xl bg-white dark:bg-slate-950/60 hover:bg-slate-100/80 dark:hover:bg-slate-900 border border-slate-200/80 dark:border-white/5 hover:border-teal-500/40 cursor-pointer transition-all shadow-xs"
                        >
                          <div className="w-full h-24 rounded-xl bg-slate-900 overflow-hidden mb-2.5 relative">
                            {proj.imageUrl ? (
                              <img
                                src={proj.imageUrl}
                                alt={proj.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-slate-600">
                                <FolderGit2 className="w-6 h-6" />
                              </div>
                            )}
                            {proj.featured && (
                              <span className="absolute top-1.5 right-1.5 px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-500 text-slate-950 shadow-sm">
                                Featured
                              </span>
                            )}
                          </div>
                          <h4 className="font-bold text-xs text-slate-900 dark:text-white truncate group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                            {proj.title}
                          </h4>
                          <span className="text-[10px] text-slate-500 dark:text-slate-400 truncate block mt-0.5">
                            {proj.category || 'Web Application'}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* RIGHT COLUMN: QUICK ACTIONS & SYSTEM HEALTH */}
              <div className="lg:col-span-5 space-y-6">
                
                {/* Quick Actions Hub */}
                <div className="p-6 sm:p-7 rounded-3xl bg-slate-50/70 dark:bg-slate-900/50 border border-slate-200/80 dark:border-white/10 shadow-xs space-y-3">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center">
                      <Zap className="w-4 h-4" />
                    </div>
                    <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                      Pusat Aksi Cepat
                    </h3>
                  </div>

                  <button
                    onClick={() => {
                      setProjectModal({ open: true, mode: 'create', data: null });
                      setActiveTab('projects');
                    }}
                    className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-white dark:bg-slate-950/70 hover:bg-teal-500 hover:text-slate-950 dark:hover:bg-teal-500 dark:hover:text-slate-950 border border-slate-200/80 dark:border-white/5 transition-all text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 group shadow-xs"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400 group-hover:bg-slate-950 group-hover:text-teal-400 flex items-center justify-center transition-colors">
                        <Plus className="w-4 h-4" />
                      </div>
                      <span>Tambah Proyek Baru</span>
                    </div>
                    <ArrowRight className="w-4 h-4 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                  </button>

                  <button
                    onClick={() => {
                      setSkillModal({ open: true, mode: 'create', data: null });
                      setActiveTab('skills');
                    }}
                    className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-white dark:bg-slate-950/70 hover:bg-cyan-500 hover:text-slate-950 dark:hover:bg-cyan-500 dark:hover:text-slate-950 border border-slate-200/80 dark:border-white/5 transition-all text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 group shadow-xs"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 group-hover:bg-slate-950 group-hover:text-cyan-400 flex items-center justify-center transition-colors">
                        <Layers className="w-4 h-4" />
                      </div>
                      <span>Tambah Skill & Ikon Siap Pakai</span>
                    </div>
                    <ArrowRight className="w-4 h-4 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                  </button>

                  <button
                    onClick={() => {
                      setExpModal({ open: true, mode: 'create', data: null });
                      setActiveTab('experience');
                    }}
                    className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-white dark:bg-slate-950/70 hover:bg-indigo-500 hover:text-slate-950 dark:hover:bg-indigo-500 dark:hover:text-slate-950 border border-slate-200/80 dark:border-white/5 transition-all text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 group shadow-xs"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 group-hover:bg-slate-950 group-hover:text-indigo-400 flex items-center justify-center transition-colors">
                        <Briefcase className="w-4 h-4" />
                      </div>
                      <span>Tambah Pengalaman / Karir</span>
                    </div>
                    <ArrowRight className="w-4 h-4 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                  </button>

                  <button
                    onClick={() => {
                      setCertModal({ open: true, mode: 'create', data: null });
                      setActiveTab('certificates');
                    }}
                    className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-white dark:bg-slate-950/70 hover:bg-amber-500 hover:text-slate-950 dark:hover:bg-amber-500 dark:hover:text-slate-950 border border-slate-200/80 dark:border-white/5 transition-all text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 group shadow-xs"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 group-hover:bg-slate-950 group-hover:text-amber-400 flex items-center justify-center transition-colors">
                        <Award className="w-4 h-4" />
                      </div>
                      <span>Tambah Sertifikat & Lisensi</span>
                    </div>
                    <ArrowRight className="w-4 h-4 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                  </button>

                  <button
                    onClick={() => setActiveTab('profile')}
                    className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-white dark:bg-slate-950/70 hover:bg-teal-500 hover:text-slate-950 dark:hover:bg-teal-500 dark:hover:text-slate-950 border border-slate-200/80 dark:border-white/5 transition-all text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 group shadow-xs"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400 group-hover:bg-slate-950 group-hover:text-teal-400 flex items-center justify-center transition-colors">
                        <User className="w-4 h-4" />
                      </div>
                      <span>Kelola 3 Foto Profil & Bio</span>
                    </div>
                    <ArrowRight className="w-4 h-4 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                  </button>
                </div>

                {/* System & Portfolio Health Card */}
                <div className="p-6 sm:p-7 rounded-3xl bg-slate-50/70 dark:bg-slate-900/50 border border-slate-200/80 dark:border-white/10 shadow-xs space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Activity className="w-4 h-4 text-emerald-500" />
                      <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
                        Status Sistem & Ketersediaan
                      </h4>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-bold">
                      ACTIVE
                    </span>
                  </div>

                  <div className="space-y-2.5 text-xs">
                    <div className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-slate-950/60 border border-slate-200/80 dark:border-white/5">
                      <span className="text-slate-500 dark:text-slate-400 font-medium">Status Klien / Hire:</span>
                      <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                        {settings?.availableForHire ? 'Available for Hire' : 'Busy / Not Available'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-slate-950/60 border border-slate-200/80 dark:border-white/5">
                      <span className="text-slate-500 dark:text-slate-400 font-medium">Platform Framework:</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200 font-mono">
                        Next.js 14 (App Router)
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-slate-950/60 border border-slate-200/80 dark:border-white/5">
                      <span className="text-slate-500 dark:text-slate-400 font-medium">Database Engine:</span>
                      <span className="font-bold text-teal-600 dark:text-teal-400 font-mono">
                        Prisma ORM
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: PROFILE & SETTINGS - Compact Modern Bento Architecture */}
        {activeTab === 'profile' && (
          <form onSubmit={handleProfileSubmit} className="space-y-6 animate-in fade-in duration-300">
            {/* Top Quick Bar with Save Button */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-slate-900 dark:text-white">Pengaturan Portofolio & Identitas</h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Atur visual 3D foto, bio hero, statistik, media sosial, dan kredensial akun.</p>
                </div>
              </div>
              <button
                type="submit"
                disabled={saving}
                className="w-full sm:w-auto shrink-0 flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-slate-950 bg-teal-400 hover:bg-teal-300 shadow-md shadow-teal-500/20 transition-all disabled:opacity-50 cursor-pointer"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                <span>Simpan Semua Perubahan</span>
              </button>
            </div>

            {/* Compact Bento Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
              
              {/* LEFT COLUMN: 3D Photo Carousel & About Narrative (5 cols) */}
              <div className="lg:col-span-5 space-y-5">
                {/* 1. 3 Foto Profil Hero Section */}
                <div className="p-5 rounded-2xl bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-white/10 space-y-4 shadow-sm">
                  <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-3">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-teal-500" />
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                        3 Foto Profil (3D Hero Carousel)
                      </h3>
                    </div>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20">
                      Auto-Rotate 3D
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                    Unggah 3 foto terbaik Anda untuk efek kartu 3D berputar di Hero Section.
                  </p>

                  {/* 3 Compact Upload Slots */}
                  <div className="grid grid-cols-3 gap-2.5">
                    {(() => {
                      let photos = ['', '', ''];
                      try {
                        if (user?.avatarUrl && user.avatarUrl.startsWith('[')) {
                          photos = JSON.parse(user.avatarUrl);
                        } else if (user?.avatarUrl) {
                          photos = [user.avatarUrl, '', ''];
                        }
                      } catch (e) {}

                      const slots = [
                        { name: '1. Utama', desc: 'Tengah' },
                        { name: '2. Kanan', desc: 'Kanan' },
                        { name: '3. Kiri', desc: 'Kiri' },
                      ];

                      return slots.map((slot, idx) => (
                        <div key={idx} className="space-y-1.5">
                          <div className="flex items-center justify-between px-0.5">
                            <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200">{slot.name}</span>
                            <span className="text-[9px] text-teal-600 dark:text-teal-400 font-medium">{slot.desc}</span>
                          </div>
                          <ImageUpload
                            compact={true}
                            label=""
                            value={photos[idx] || ''}
                            onChange={(url) => {
                              const newPhotos = [...photos];
                              newPhotos[idx] = url;
                              setUser({ ...user, avatarUrl: JSON.stringify(newPhotos) });
                            }}
                          />
                        </div>
                      ));
                    })()}
                  </div>
                </div>

                {/* 2. Cerita Lengkap & Link CV */}
                <div className="p-5 rounded-2xl bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-white/10 space-y-3.5 shadow-sm">
                  <div className="flex items-center gap-2 border-b border-slate-200 dark:border-white/10 pb-3">
                    <FileText className="w-4 h-4 text-teal-500" />
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                      Cerita Lengkap & Resume CV
                    </h3>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                      Cerita Lengkap (About Me Section)
                    </label>
                    <textarea
                      rows={4}
                      value={user?.about || ''}
                      onChange={(e) => setUser({ ...user, about: e.target.value })}
                      placeholder="Ceritakan latar belakang, fokus teknologi, dan filosofi kerja Anda..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-xs leading-relaxed resize-none focus:outline-none focus:border-teal-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                      Link Resume / Google Drive CV (Opsional)
                    </label>
                    <input
                      type="text"
                      value={user?.resumeUrl || ''}
                      onChange={(e) => setUser({ ...user, resumeUrl: e.target.value })}
                      placeholder="https://drive.google.com/..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-teal-500"
                    />
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN: Identity, Metrics, Contacts & Security (7 cols) */}
              <div className="lg:col-span-7 space-y-5">
                {/* 3. Data Identitas & Headline */}
                <div className="p-5 rounded-2xl bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-white/10 space-y-3.5 shadow-sm">
                  <div className="flex items-center gap-2 border-b border-slate-200 dark:border-white/10 pb-3">
                    <User className="w-4 h-4 text-teal-500" />
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                      Data Identitas & Headline
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                        Nama Lengkap *
                      </label>
                      <input
                        type="text"
                        required
                        value={user?.name || ''}
                        onChange={(e) => setUser({ ...user, name: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-xs font-medium focus:outline-none focus:border-teal-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                        Job Title / Headline *
                      </label>
                      <input
                        type="text"
                        required
                        value={user?.title || ''}
                        onChange={(e) => setUser({ ...user, title: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-xs font-medium focus:outline-none focus:border-teal-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                      Bio Singkat (Tampil di Hero Halaman Utama)
                    </label>
                    <textarea
                      rows={2}
                      value={user?.bio || ''}
                      onChange={(e) => setUser({ ...user, bio: e.target.value })}
                      placeholder="Ringkasan singkat tentang keahlian utama Anda..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-xs leading-relaxed resize-none focus:outline-none focus:border-teal-500"
                    />
                  </div>
                </div>

                {/* 4. Status Ketersediaan & Statistik */}
                <div className="p-5 rounded-2xl bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-white/10 space-y-3.5 shadow-sm">
                  <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-3">
                    <div className="flex items-center gap-2">
                      <Activity className="w-4 h-4 text-teal-500" />
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                        Status Ketersediaan & Statistik
                      </h3>
                    </div>
                    <label className="inline-flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={settings?.availableForHire ?? true}
                        onChange={(e) => setSettings({ ...settings, availableForHire: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-8 h-4 bg-slate-300 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-teal-500 relative"></div>
                      <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                        {settings?.availableForHire ? 'Available for Hire' : 'Not Available'}
                      </span>
                    </label>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                        Pengalaman
                      </label>
                      <input
                        type="text"
                        value={settings?.statsExperience || ''}
                        onChange={(e) => setSettings({ ...settings, statsExperience: e.target.value })}
                        placeholder="3+ Years"
                        className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-teal-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                        Proyek Selesai
                      </label>
                      <input
                        type="text"
                        value={settings?.statsProjects || ''}
                        onChange={(e) => setSettings({ ...settings, statsProjects: e.target.value })}
                        placeholder="25+ Built"
                        className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-teal-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                        Klien Puas
                      </label>
                      <input
                        type="text"
                        value={settings?.statsClients || ''}
                        onChange={(e) => setSettings({ ...settings, statsClients: e.target.value })}
                        placeholder="15+ Happy"
                        className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-teal-500"
                      />
                    </div>
                  </div>
                </div>

                {/* 5. Kontak, Media Sosial & Keamanan (2 Sub-Cards) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Kontak & Media Sosial */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-white/10 space-y-2.5 shadow-sm">
                    <div className="flex items-center gap-2 border-b border-slate-200 dark:border-white/10 pb-2.5">
                      <Globe className="w-4 h-4 text-teal-500" />
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                        Kontak & Sosmed
                      </h3>
                    </div>
                    <div className="space-y-2">
                      <div>
                        <label className="block text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase mb-0.5">GitHub URL</label>
                        <input
                          type="text"
                          value={user?.socials?.github || ''}
                          onChange={(e) => setUser({ ...user, socials: { ...user.socials, github: e.target.value } })}
                          placeholder="https://github.com/..."
                          className="w-full px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-teal-500"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase mb-0.5">LinkedIn URL</label>
                        <input
                          type="text"
                          value={user?.socials?.linkedin || ''}
                          onChange={(e) => setUser({ ...user, socials: { ...user.socials, linkedin: e.target.value } })}
                          placeholder="https://linkedin.com/in/..."
                          className="w-full px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-teal-500"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase mb-0.5">WhatsApp</label>
                        <input
                          type="text"
                          value={user?.socials?.whatsapp || ''}
                          onChange={(e) => setUser({ ...user, socials: { ...user.socials, whatsapp: e.target.value } })}
                          placeholder="https://wa.me/62..."
                          className="w-full px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-teal-500"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase mb-0.5">Email</label>
                        <input
                          type="email"
                          value={user?.socials?.email || ''}
                          onChange={(e) => setUser({ ...user, socials: { ...user.socials, email: e.target.value } })}
                          placeholder="youremail@gmail.com"
                          className="w-full px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-teal-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Keamanan Akun & Submit */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-white/10 space-y-3 flex flex-col justify-between shadow-sm">
                    <div>
                      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-white/10 pb-2.5">
                        <ShieldCheck className="w-4 h-4 text-teal-500" />
                        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                          Keamanan Akun
                        </h3>
                      </div>
                      <div className="mt-3 space-y-2">
                        <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                          Password Baru
                        </label>
                        <input
                          type="password"
                          value={user?.newPassword || ''}
                          onChange={(e) => setUser({ ...user, newPassword: e.target.value })}
                          placeholder="Kosongkan jika tetap"
                          className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-teal-500"
                        />
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-normal">
                          Isi hanya jika Anda ingin mengubah kata sandi login admin.
                        </p>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={saving}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs text-slate-950 bg-teal-400 hover:bg-teal-300 shadow-md shadow-teal-500/20 transition-all disabled:opacity-50 cursor-pointer mt-3"
                    >
                      {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                      <span>Simpan Perubahan</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </form>
        )}

        {/* TAB 3: PROJECTS MANAGER - High-End Control Center */}
        {activeTab === 'projects' && (() => {
          // Dynamic category list from existing projects
          const availableCategories = ['all', ...Array.from(new Set(projects.map((p) => p.category).filter(Boolean)))];

          const filteredProjects = projects.filter((p) => {
            const query = projectSearch.toLowerCase().trim();
            const techList = Array.isArray(p.techStack) 
              ? p.techStack 
              : (typeof p.techStack === 'string' ? p.techStack.split(',') : []);

            const matchesSearch =
              !query ||
              p.title?.toLowerCase().includes(query) ||
              p.description?.toLowerCase().includes(query) ||
              p.category?.toLowerCase().includes(query) ||
              techList.some((t) => t.toLowerCase().includes(query));

            const matchesCategory = projectCategoryFilter === 'all' || p.category?.toLowerCase() === projectCategoryFilter.toLowerCase();
            const matchesFeatured = !projectFeaturedOnly || p.featured;

            return matchesSearch && matchesCategory && matchesFeatured;
          });

          return (
            <div className="space-y-6 animate-in fade-in duration-300">
              {/* Header Action & Metrics Toolbar */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-white/10">
                <div className="flex flex-wrap items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0">
                    <FolderGit2 className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-sm font-bold text-slate-900 dark:text-white">Kelola Showcase Proyek</h2>
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20">
                        {projects.length} Total
                      </span>
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 flex items-center gap-1">
                        <Star className="w-3 h-3 fill-amber-500" />
                        {projects.filter((p) => p.featured).length} Featured
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Tambah, edit, unggah cover screenshot, dan atur urutan portofolio proyek Anda.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setProjectModal({ open: true, mode: 'create', data: null })}
                  className="w-full sm:w-auto shrink-0 flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-slate-950 bg-teal-400 hover:bg-teal-300 shadow-md shadow-teal-500/20 transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Tambah Proyek Baru</span>
                </button>
              </div>

              {/* Search & Filter Bar */}
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-white/10 space-y-3 shadow-sm">
                <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
                  {/* Search Input */}
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={projectSearch}
                      onChange={(e) => setProjectSearch(e.target.value)}
                      placeholder="Cari proyek berdasarkan judul, teknologi (e.g. Next.js), atau deskripsi..."
                      className="w-full pl-9 pr-9 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-teal-500"
                    />
                    {projectSearch && (
                      <button
                        onClick={() => setProjectSearch('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </div>

                  {/* Featured Only Toggle Button */}
                  <button
                    onClick={() => setProjectFeaturedOnly(!projectFeaturedOnly)}
                    className={`flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                      projectFeaturedOnly
                        ? 'bg-amber-500/10 border-amber-500/40 text-amber-600 dark:text-amber-400'
                        : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                    }`}
                  >
                    <Star className={`w-3.5 h-3.5 ${projectFeaturedOnly ? 'fill-amber-500 text-amber-500' : ''}`} />
                    <span>Hanya Featured</span>
                  </button>
                </div>

                {/* Category Pills */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mr-1 shrink-0">
                    Kategori:
                  </span>
                  {availableCategories.map((cat) => {
                    const isActive = projectCategoryFilter.toLowerCase() === cat.toLowerCase();
                    return (
                      <button
                        key={cat}
                        onClick={() => setProjectCategoryFilter(cat)}
                        className={`px-3 py-1 rounded-lg text-xs font-semibold capitalize whitespace-nowrap transition-all cursor-pointer ${
                          isActive
                            ? 'bg-teal-500 text-slate-950 shadow-sm'
                            : 'bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                        }`}
                      >
                        {cat === 'all' ? 'Semua Kategori' : cat}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Projects Grid */}
              {filteredProjects.length === 0 ? (
                <div className="p-12 text-center rounded-2xl bg-white dark:bg-slate-900/70 border border-dashed border-slate-300 dark:border-white/10 space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
                    <FolderGit2 className="w-6 h-6" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">Tidak ada proyek yang sesuai</h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    Coba ubah kata kunci pencarian atau reset filter kategori untuk melihat seluruh daftar proyek.
                  </p>
                  {(projectSearch || projectCategoryFilter !== 'all' || projectFeaturedOnly) && (
                    <button
                      onClick={() => {
                        setProjectSearch('');
                        setProjectCategoryFilter('all');
                        setProjectFeaturedOnly(false);
                      }}
                      className="px-4 py-2 rounded-xl text-xs font-semibold bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20 hover:bg-teal-500/20 transition-all cursor-pointer"
                    >
                      Reset Filter
                    </button>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                  {filteredProjects.map((p) => {
                    const techList = Array.isArray(p.techStack)
                      ? p.techStack
                      : (typeof p.techStack === 'string' ? p.techStack.split(',').map((s) => s.trim()).filter(Boolean) : []);

                    return (
                      <div
                        key={p.id}
                        className="group bg-white dark:bg-slate-900/70 rounded-2xl border border-slate-200 dark:border-white/10 overflow-hidden flex flex-col justify-between shadow-sm hover:shadow-md hover:border-teal-500/40 transition-all"
                      >
                        <div>
                          {/* Image Cover Preview */}
                          <div className="h-44 sm:h-48 w-full relative bg-slate-950 overflow-hidden">
                            <img
                              src={p.coverImage}
                              alt={p.title}
                              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                            />
                            
                            {/* Overlay Gradient Protection */}
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-slate-950/40 pointer-events-none" />

                            {/* Top Badges */}
                            <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-auto">
                              <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-slate-950/85 backdrop-blur-md text-teal-400 border border-teal-500/30 shadow-sm">
                                {p.category}
                              </span>
                              {p.featured && (
                                <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-amber-400 text-slate-950 flex items-center gap-1 shadow-md">
                                  <Star className="w-3 h-3 fill-slate-950" />
                                  Featured
                                </span>
                              )}
                            </div>

                            {/* Live Links Quick Action (on bottom of image) */}
                            <div className="absolute bottom-3 left-3 right-3 flex items-center gap-2">
                              {p.demoUrl && (
                                <a
                                  href={p.demoUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="px-2.5 py-1 rounded-lg bg-slate-900/90 hover:bg-teal-500 text-white hover:text-slate-950 text-[11px] font-semibold backdrop-blur-md border border-white/10 transition-all flex items-center gap-1.5 shadow-sm"
                                  title="Buka Demo"
                                >
                                  <ExternalLink className="w-3 h-3" />
                                  <span>Demo</span>
                                </a>
                              )}
                              {p.githubUrl && (
                                <a
                                  href={p.githubUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="px-2.5 py-1 rounded-lg bg-slate-900/90 hover:bg-slate-800 text-slate-200 text-[11px] font-semibold backdrop-blur-md border border-white/10 transition-all flex items-center gap-1.5 shadow-sm"
                                  title="Lihat Repository"
                                >
                                  <Github className="w-3 h-3" />
                                  <span>Repo</span>
                                </a>
                              )}
                            </div>
                          </div>

                          {/* Card Content */}
                          <div className="p-4 sm:p-5 space-y-2.5">
                            <h4 className="font-bold text-base text-slate-900 dark:text-white line-clamp-1 group-hover:text-teal-500 transition-colors">
                              {p.title}
                            </h4>
                            <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                              {p.description}
                            </p>

                            {/* Tech Stack Badges */}
                            {techList.length > 0 && (
                              <div className="flex flex-wrap gap-1.5 pt-1">
                                {techList.slice(0, 4).map((tech, i) => (
                                  <span
                                    key={i}
                                    className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] font-semibold border border-slate-200/60 dark:border-white/5"
                                  >
                                    {tech}
                                  </span>
                                ))}
                                {techList.length > 4 && (
                                  <span className="px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-400 text-[10px] font-semibold">
                                    +{techList.length - 4}
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Card Action Footer */}
                        <div className="px-4 sm:px-5 py-3 border-t border-slate-100 dark:border-white/5 flex items-center justify-between bg-slate-50/50 dark:bg-slate-950/20">
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-teal-400" />
                            <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                              Order: #{p.order}
                            </span>
                          </div>

                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => setProjectModal({ open: true, mode: 'edit', data: p })}
                              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-teal-500 hover:text-slate-950 text-slate-700 dark:text-slate-300 text-xs font-semibold transition-all cursor-pointer"
                              title="Edit Proyek"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                              <span>Edit</span>
                            </button>
                            <button
                              onClick={() => handleDeleteProject(p.id)}
                              className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500 text-rose-600 dark:text-rose-400 hover:text-white transition-all cursor-pointer"
                              title="Hapus Proyek"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })()}

        {/* TAB 4: SKILLS & IKON TEKNOLOGI - High-End Control Center */}
        {activeTab === 'skills' && (() => {
          const categories = ['all', ...Array.from(new Set(skills.map((s) => s.category).filter(Boolean)))];

          const filteredSkills = skills.filter((s) => {
            const query = skillSearch.toLowerCase().trim();
            const matchesSearch =
              !query ||
              s.name?.toLowerCase().includes(query) ||
              s.category?.toLowerCase().includes(query) ||
              s.iconName?.toLowerCase().includes(query);

            const matchesCategory = skillCategoryFilter === 'all' || s.category?.toLowerCase() === skillCategoryFilter.toLowerCase();

            return matchesSearch && matchesCategory;
          });

          return (
            <div className="space-y-6 animate-in fade-in duration-300">
              {/* Header Action & Metrics Toolbar */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-white/10">
                <div className="flex flex-wrap items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0">
                    <Code2 className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-sm font-bold text-slate-900 dark:text-white">Keahlian & Stack Teknologi</h2>
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20">
                        {skills.length} Total Skill
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Kelola daftar teknologi, ikon visual, tingkat kemahiran (%), dan urutan keahlian.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setSkillModal({ open: true, mode: 'create', data: null })}
                  className="w-full sm:w-auto shrink-0 flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-slate-950 bg-teal-400 hover:bg-teal-300 shadow-md shadow-teal-500/20 transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Tambah Skill Baru</span>
                </button>
              </div>

              {/* Search & Category Filter Toolbar */}
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-white/10 space-y-3 shadow-sm">
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={skillSearch}
                    onChange={(e) => setSkillSearch(e.target.value)}
                    placeholder="Cari keahlian, teknologi (e.g. Laravel, React, Docker, MySQL)..."
                    className="w-full pl-9 pr-9 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-teal-500"
                  />
                  {skillSearch && (
                    <button
                      onClick={() => setSkillSearch('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>

                {/* Category Filter Pills */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mr-1 shrink-0">
                    Kategori:
                  </span>
                  {categories.map((cat) => {
                    const isActive = skillCategoryFilter.toLowerCase() === cat.toLowerCase();
                    const count = cat === 'all' ? skills.length : skills.filter((s) => s.category?.toLowerCase() === cat.toLowerCase()).length;

                    return (
                      <button
                        key={cat}
                        onClick={() => setSkillCategoryFilter(cat)}
                        className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold capitalize whitespace-nowrap transition-all cursor-pointer ${
                          isActive
                            ? 'bg-teal-500 text-slate-950 shadow-sm'
                            : 'bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                        }`}
                      >
                        <span>{cat === 'all' ? 'Semua Keahlian' : cat}</span>
                        <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isActive ? 'bg-slate-950/20 text-slate-950 font-bold' : 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-300'}`}>
                          {count}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Skills Grid */}
              {filteredSkills.length === 0 ? (
                <div className="p-12 text-center rounded-2xl bg-white dark:bg-slate-900/70 border border-dashed border-slate-300 dark:border-white/10 space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
                    <Code2 className="w-6 h-6" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">Tidak ada skill yang ditemukan</h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    Coba sesuaikan kata kunci pencarian atau reset filter kategori untuk melihat semua teknologi.
                  </p>
                  {(skillSearch || skillCategoryFilter !== 'all') && (
                    <button
                      onClick={() => {
                        setSkillSearch('');
                        setSkillCategoryFilter('all');
                      }}
                      className="px-4 py-2 rounded-xl text-xs font-semibold bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20 hover:bg-teal-500/20 transition-all cursor-pointer"
                    >
                      Reset Filter
                    </button>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredSkills.map((s) => (
                    <div
                      key={s.id}
                      className="group bg-white dark:bg-slate-900/70 p-4 sm:p-4.5 rounded-2xl border border-slate-200 dark:border-white/10 hover:border-teal-500/40 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-3.5"
                    >
                      {/* Top Row: Icon, Title & Action Buttons */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-11 h-11 rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0 group-hover:scale-105 group-hover:bg-teal-500/15 transition-all shadow-sm">
                            <DynamicIcon name={s.iconName} size={22} />
                          </div>
                          <div className="min-w-0">
                            <h4 className="font-bold text-sm text-slate-900 dark:text-white truncate group-hover:text-teal-500 transition-colors">
                              {s.name}
                            </h4>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                {s.category}
                              </span>
                              <span className="text-[10px] text-slate-300 dark:text-slate-600">•</span>
                              <span className="text-[10px] font-mono text-slate-400">
                                Order: #{s.order || 0}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            onClick={() => setSkillModal({ open: true, mode: 'edit', data: s })}
                            className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-teal-500 hover:text-slate-950 text-slate-600 dark:text-slate-300 text-xs font-semibold transition-all cursor-pointer"
                            title="Edit Skill"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteSkill(s.id)}
                            className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500 text-rose-600 dark:text-rose-400 hover:text-white transition-all cursor-pointer"
                            title="Hapus Skill"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Bottom Row: Proficiency Level Progress Bar */}
                      <div className="space-y-1.5 pt-1 border-t border-slate-100 dark:border-white/5">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-slate-500 dark:text-slate-400 font-medium">Tingkat Kemahiran</span>
                          <span className="font-mono font-bold text-teal-600 dark:text-teal-400">
                            {s.level}%
                          </span>
                        </div>
                        <div className="w-full h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                          <div
                            className="h-full rounded-full bg-teal-400 transition-all duration-500"
                            style={{ width: `${Math.min(100, Math.max(5, s.level))}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })()}

        {/* TAB 5: EXPERIENCE & LEARNING TIMELINE - High-End Control Center */}
        {activeTab === 'experience' && (() => {
          const filteredExperiences = experiences.filter((exp) => {
            const query = expSearch.toLowerCase().trim();
            const matchesSearch =
              !query ||
              exp.role?.toLowerCase().includes(query) ||
              exp.institution?.toLowerCase().includes(query) ||
              exp.period?.toLowerCase().includes(query) ||
              exp.description?.toLowerCase().includes(query);

            const matchesType = expTypeFilter === 'all' || exp.type?.toUpperCase() === expTypeFilter.toUpperCase();

            return matchesSearch && matchesType;
          });

          const workCount = experiences.filter((e) => e.type === 'WORK').length;
          const eduCount = experiences.filter((e) => e.type === 'EDUCATION').length;

          return (
            <div className="space-y-6 animate-in fade-in duration-300">
              {/* Header Action & Metrics Toolbar */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-white/10">
                <div className="flex flex-wrap items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0">
                    <Briefcase className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-sm font-bold text-slate-900 dark:text-white">Perjalanan Karir & Edukasi Timeline</h2>
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20">
                        {experiences.length} Entri
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Kelola riwayat karir profesional, peran freelance, dan riwayat pendidikan roadmap Anda.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setExpModal({ open: true, mode: 'create', data: null })}
                  className="w-full sm:w-auto shrink-0 flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-slate-950 bg-teal-400 hover:bg-teal-300 shadow-md shadow-teal-500/20 transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Tambah Pengalaman / Edukasi</span>
                </button>
              </div>

              {/* Search & Type Filter Toolbar */}
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-white/10 space-y-3 shadow-sm">
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={expSearch}
                    onChange={(e) => setExpSearch(e.target.value)}
                    placeholder="Cari berdasarkan posisi, perusahaan (e.g. Herbanova, Indorkarya), atau periode..."
                    className="w-full pl-9 pr-9 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-teal-500"
                  />
                  {expSearch && (
                    <button
                      onClick={() => setExpSearch('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>

                {/* Filter Type Pills */}
                <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mr-1 shrink-0">
                    Tipe:
                  </span>
                  <button
                    onClick={() => setExpTypeFilter('all')}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                      expTypeFilter === 'all'
                        ? 'bg-teal-500 text-slate-950 shadow-sm'
                        : 'bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    <span>Semua ({experiences.length})</span>
                  </button>
                  <button
                    onClick={() => setExpTypeFilter('WORK')}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                      expTypeFilter === 'WORK'
                        ? 'bg-teal-500 text-slate-950 shadow-sm'
                        : 'bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    <Briefcase className="w-3.5 h-3.5" />
                    <span>Karir & Pekerjaan ({workCount})</span>
                  </button>
                  <button
                    onClick={() => setExpTypeFilter('EDUCATION')}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                      expTypeFilter === 'EDUCATION'
                        ? 'bg-teal-500 text-slate-950 shadow-sm'
                        : 'bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    <GraduationCap className="w-3.5 h-3.5" />
                    <span>Pendidikan & Belajar ({eduCount})</span>
                  </button>
                </div>
              </div>

              {/* Experience Timeline Cards */}
              {filteredExperiences.length === 0 ? (
                <div className="p-12 text-center rounded-2xl bg-white dark:bg-slate-900/70 border border-dashed border-slate-300 dark:border-white/10 space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
                    <Briefcase className="w-6 h-6" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">Tidak ada riwayat yang ditemukan</h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    Coba ubah kata kunci pencarian atau sesuaikan filter tipe untuk melihat entri lainnya.
                  </p>
                  {(expSearch || expTypeFilter !== 'all') && (
                    <button
                      onClick={() => {
                        setExpSearch('');
                        setExpTypeFilter('all');
                      }}
                      className="px-4 py-2 rounded-xl text-xs font-semibold bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20 hover:bg-teal-500/20 transition-all cursor-pointer"
                    >
                      Reset Filter
                    </button>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredExperiences.map((exp) => {
                    const isCurrent = exp.period?.toLowerCase().includes('sekarang') || exp.period?.toLowerCase().includes('present');
                    const isWork = exp.type === 'WORK';

                    return (
                      <div
                        key={exp.id}
                        className="group bg-white dark:bg-slate-900/70 p-5 sm:p-6 rounded-2xl border border-slate-200 dark:border-white/10 hover:border-teal-500/40 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row md:items-start justify-between gap-4"
                      >
                        <div className="space-y-2.5 min-w-0 flex-1">
                          {/* Badges Line */}
                          <div className="flex flex-wrap items-center gap-2">
                            {isWork ? (
                              <span className="px-2.5 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20 flex items-center gap-1">
                                <Briefcase className="w-3 h-3" />
                                Work Experience
                              </span>
                            ) : (
                              <span className="px-2.5 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 flex items-center gap-1">
                                <GraduationCap className="w-3 h-3" />
                                Education
                              </span>
                            )}

                            <span className="px-2.5 py-0.5 rounded-lg text-[11px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                              <Calendar className="w-3 h-3 text-slate-400" />
                              {exp.period}
                            </span>

                            {isCurrent && (
                              <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                Aktif / Sekarang
                              </span>
                            )}
                          </div>

                          {/* Role & Company */}
                          <div>
                            <h4 className="font-bold text-base sm:text-lg text-slate-900 dark:text-white group-hover:text-teal-500 transition-colors">
                              {exp.role}
                            </h4>
                            <div className="flex items-center gap-1.5 text-xs font-semibold text-teal-600 dark:text-teal-400 mt-0.5">
                              <Building2 className="w-3.5 h-3.5 shrink-0" />
                              <span>{exp.institution}</span>
                            </div>
                          </div>

                          {/* Description */}
                          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed max-w-3xl">
                            {exp.description}
                          </p>
                        </div>

                        {/* Right: Actions & Order */}
                        <div className="flex md:flex-col items-center md:items-end justify-between md:justify-start gap-2 shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100 dark:border-white/5">
                          <span className="text-[11px] font-mono text-slate-400">
                            Order: #{exp.order || 0}
                          </span>

                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => setExpModal({ open: true, mode: 'edit', data: exp })}
                              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-teal-500 hover:text-slate-950 text-slate-700 dark:text-slate-300 text-xs font-semibold transition-all cursor-pointer"
                              title="Edit Entri"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                              <span>Edit</span>
                            </button>
                            <button
                              onClick={() => handleDeleteExp(exp.id)}
                              className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500 text-rose-600 dark:text-rose-400 hover:text-white transition-all cursor-pointer"
                              title="Hapus Entri"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })()}

        {/* TAB 6: CERTIFICATES & CREDENTIALS - High-End Control Center */}
        {activeTab === 'certificates' && (() => {
          const filteredCertificates = certificates.filter((c) => {
            const query = certSearch.toLowerCase().trim();
            return (
              !query ||
              c.title?.toLowerCase().includes(query) ||
              c.issuer?.toLowerCase().includes(query) ||
              c.issueDate?.toLowerCase().includes(query)
            );
          });

          return (
            <div className="space-y-6 animate-in fade-in duration-300">
              {/* Header Action & Metrics Toolbar */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-white/10">
                <div className="flex flex-wrap items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-sm font-bold text-slate-900 dark:text-white">Sertifikasi & Kredensial Resmi</h2>
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20">
                        {certificates.length} Total Sertifikat
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Kelola daftar sertifikat keahlian, lisensi profesional, dan bukti kelulusan pelatihan Anda.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setCertModal({ open: true, mode: 'create', data: null })}
                  className="w-full sm:w-auto shrink-0 flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-slate-950 bg-teal-400 hover:bg-teal-300 shadow-md shadow-teal-500/20 transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Tambah Sertifikat Baru</span>
                </button>
              </div>

              {/* Search Toolbar */}
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-white/10 shadow-sm">
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={certSearch}
                    onChange={(e) => setCertSearch(e.target.value)}
                    placeholder="Cari berdasarkan nama sertifikat, penerbit (e.g. Dicoding, Google, Udemy), atau tahun..."
                    className="w-full pl-9 pr-9 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-teal-500"
                  />
                  {certSearch && (
                    <button
                      onClick={() => setCertSearch('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>

              {/* Certificates Grid */}
              {filteredCertificates.length === 0 ? (
                <div className="p-12 text-center rounded-2xl bg-white dark:bg-slate-900/70 border border-dashed border-slate-300 dark:border-white/10 space-y-4">
                  <div className="w-14 h-14 rounded-2xl bg-teal-500/10 border border-teal-500/20 text-teal-600 dark:text-teal-400 flex items-center justify-center mx-auto shadow-sm">
                    <Award className="w-7 h-7" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      {certSearch ? 'Tidak ada sertifikat yang cocok' : 'Belum Ada Sertifikat yang Ditambahkan'}
                    </h3>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                      {certSearch
                        ? 'Coba gunakan kata kunci pencarian yang lain untuk menemukan sertifikat yang Anda cari.'
                        : 'Unggah bukti sertifikat kompetensi, kredensial kursus, dan piagam kelulusan untuk memperkuat profil portofolio Anda.'}
                    </p>
                  </div>
                  {certSearch ? (
                    <button
                      onClick={() => setCertSearch('')}
                      className="px-4 py-2 rounded-xl text-xs font-semibold bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20 hover:bg-teal-500/20 transition-all cursor-pointer"
                    >
                      Reset Pencarian
                    </button>
                  ) : (
                    <button
                      onClick={() => setCertModal({ open: true, mode: 'create', data: null })}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-slate-950 bg-teal-400 hover:bg-teal-300 shadow-md shadow-teal-500/20 transition-all cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Tambah Sertifikat Pertama Anda</span>
                    </button>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {filteredCertificates.map((c) => (
                    <div
                      key={c.id}
                      className="group bg-white dark:bg-slate-900/70 rounded-2xl border border-slate-200 dark:border-white/10 overflow-hidden flex flex-col justify-between shadow-sm hover:shadow-md hover:border-teal-500/40 transition-all"
                    >
                      <div>
                        {/* Certificate Image or Graphic Container */}
                        <div className="h-44 w-full relative bg-slate-950 overflow-hidden flex items-center justify-center">
                          {c.imageUrl ? (
                            <img
                              src={c.imageUrl}
                              alt={c.title}
                              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                            />
                          ) : (
                            <div className="flex flex-col items-center justify-center gap-2 text-slate-500">
                              <Award className="w-10 h-10 text-teal-500/60" />
                              <span className="text-[11px] font-medium tracking-wider uppercase">Kredensial Terverifikasi</span>
                            </div>
                          )}

                          {/* Year / Date Badge */}
                          <div className="absolute top-3 left-3">
                            <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-slate-950/85 backdrop-blur-md text-amber-400 border border-amber-500/30 flex items-center gap-1 shadow-sm">
                              <Award className="w-3 h-3 text-amber-400" />
                              <span>{c.issueDate}</span>
                            </span>
                          </div>

                          {/* Verify Link Overlay on Image */}
                          {c.credentialUrl && (
                            <div className="absolute bottom-3 right-3">
                              <a
                                href={c.credentialUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="px-2.5 py-1 rounded-lg bg-slate-900/90 hover:bg-teal-500 text-white hover:text-slate-950 text-[11px] font-semibold backdrop-blur-md border border-white/10 transition-all flex items-center gap-1.5 shadow-sm"
                                title="Buka Link Verifikasi"
                              >
                                <span>Verifikasi</span>
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            </div>
                          )}
                        </div>

                        {/* Content */}
                        <div className="p-4 sm:p-5 space-y-2">
                          <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">
                            <ShieldCheck className="w-3.5 h-3.5" />
                            <span>{c.issuer}</span>
                          </div>
                          <h4 className="font-bold text-base text-slate-900 dark:text-white line-clamp-2 group-hover:text-teal-500 transition-colors">
                            {c.title}
                          </h4>
                        </div>
                      </div>

                      {/* Footer */}
                      <div className="px-4 sm:px-5 py-3 border-t border-slate-100 dark:border-white/5 flex items-center justify-between bg-slate-50/50 dark:bg-slate-950/20">
                        <span className="text-[11px] font-mono text-slate-400">
                          Order: #{c.order || 0}
                        </span>

                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => setCertModal({ open: true, mode: 'edit', data: c })}
                            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-teal-500 hover:text-slate-950 text-slate-700 dark:text-slate-300 text-xs font-semibold transition-all cursor-pointer"
                            title="Edit Sertifikat"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                            <span>Edit</span>
                          </button>
                          <button
                            onClick={() => handleDeleteCert(c.id)}
                            className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500 text-rose-600 dark:text-rose-400 hover:text-white transition-all cursor-pointer"
                            title="Hapus Sertifikat"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })()}

        {/* TAB 7: MESSAGES INBOX */}
        {activeTab === 'messages' && (
          <div className="space-y-4">
            {messages.length === 0 ? (
              <div className="glass-panel p-12 text-center rounded-3xl border border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400">
                <Mail className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                <p className="text-sm">Belum ada pesan kontak dari pengunjung.</p>
              </div>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`glass-panel p-5 rounded-2xl border transition-all ${
                    msg.isRead ? 'border-slate-200/80 dark:border-white/5 opacity-80' : 'border-teal-500/40 bg-teal-500/5'
                  } flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-sm text-slate-900 dark:text-white">{msg.name}</span>
                      <span className="text-xs text-teal-600 dark:text-teal-400">&lt;{msg.email}&gt;</span>
                      {!msg.isRead && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500 text-white">
                          NEW
                        </span>
                      )}
                    </div>
                    <p className="text-xs font-semibold text-slate-800 dark:text-slate-300">
                      Subject: {msg.subject || 'No Subject'}
                    </p>
                    <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 mt-1">{msg.message}</p>
                    <span className="text-[10px] text-slate-400 font-mono inline-block pt-1">
                      {new Date(msg.createdAt).toLocaleString()}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => setViewMessageModal(msg)}
                      className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-medium text-slate-800 dark:text-slate-200"
                    >
                      Read Full
                    </button>
                    <button
                      onClick={() => handleToggleReadMessage(msg.id, msg.isRead)}
                      className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300"
                      title={msg.isRead ? 'Mark Unread' : 'Mark Read'}
                    >
                      <Check className={`w-3.5 h-3.5 ${msg.isRead ? 'text-slate-400' : 'text-teal-500'}`} />
                    </button>
                    <button
                      onClick={() => handleDeleteMessage(msg.id)}
                      className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500 text-rose-600 dark:text-rose-400 hover:text-white"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
        </main>
      </div>

      {/* --- MODALS --- */}

      {/* PROJECT MODAL DENGAN UPLOAD FOTO */}
      {projectModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#0d1322] border border-slate-200 dark:border-white/10 shadow-2xl space-y-6">
            <div className="flex justify-between items-center pb-4 border-b border-slate-200 dark:border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-600 dark:text-teal-400 flex items-center justify-center">
                  <FolderGit2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                    {projectModal.mode === 'create' ? 'Tambah Proyek Baru' : 'Edit Data Proyek'}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {projectModal.mode === 'create' ? 'Unggah cover dan lengkapi detail proyek showcase Anda.' : 'Perbarui informasi dan tautan proyek ini.'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setProjectModal({ open: false, mode: 'create', data: null })}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProject} className="space-y-4">
              <div>
                <label className="block text-[11px] font-semibold uppercase text-slate-600 dark:text-slate-400 mb-1">Judul Proyek *</label>
                <input
                  name="title"
                  defaultValue={projectModal.data?.title || ''}
                  required
                  placeholder="Contoh: Sistem E-Commerce Modern"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:border-teal-500"
                />
              </div>

              {/* Upload Foto Cover Proyek */}
              <div>
                <ImageUpload
                  value={projectModal.data?.coverImage || ''}
                  onChange={(url) =>
                    setProjectModal((prev) => ({
                      ...prev,
                      data: { ...prev.data, coverImage: url },
                    }))
                  }
                  label="Foto Cover / Screenshot Proyek *"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-semibold uppercase text-slate-600 dark:text-slate-400 mb-1">Kategori *</label>
                  <select
                    name="category"
                    defaultValue={projectModal.data?.category || 'Fullstack'}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:border-teal-500"
                  >
                    <option value="Fullstack">Fullstack</option>
                    <option value="Frontend">Frontend</option>
                    <option value="Backend">Backend</option>
                    <option value="Mobile">Mobile</option>
                    <option value="Enterprise">Enterprise</option>
                    <option value="UI/UX">UI/UX</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold uppercase text-slate-600 dark:text-slate-400 mb-1">Urutan (Order Index)</label>
                  <input
                    name="order"
                    type="number"
                    defaultValue={projectModal.data?.order || 0}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase text-slate-600 dark:text-slate-400 mb-1">Deskripsi Proyek *</label>
                <textarea
                  name="description"
                  rows={3}
                  defaultValue={projectModal.data?.description || ''}
                  required
                  placeholder="Deskripsikan fitur utama dan solusi yang dibangun pada proyek ini..."
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-xs sm:text-sm resize-none focus:outline-none focus:border-teal-500 leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-semibold uppercase text-slate-600 dark:text-slate-400 mb-1">Link Live Demo (Opsional)</label>
                  <input
                    name="demoUrl"
                    defaultValue={projectModal.data?.demoUrl || ''}
                    placeholder="https://demo-proyek.com"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:border-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold uppercase text-slate-600 dark:text-slate-400 mb-1">Link GitHub Repo (Opsional)</label>
                  <input
                    name="githubUrl"
                    defaultValue={projectModal.data?.githubUrl || ''}
                    placeholder="https://github.com/..."
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase text-slate-600 dark:text-slate-400 mb-1">
                  Teknologi (Pisahkan dengan koma)
                </label>
                <input
                  name="techStack"
                  defaultValue={
                    Array.isArray(projectModal.data?.techStack)
                      ? projectModal.data.techStack.join(', ')
                      : projectModal.data?.techStack || 'Next.js, Tailwind CSS, Prisma'
                  }
                  placeholder="Next.js, React, Tailwind CSS, PostgreSQL"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="flex items-center gap-2.5 pt-2">
                <input
                  type="checkbox"
                  name="featured"
                  id="featuredCheck"
                  defaultChecked={projectModal.data?.featured || false}
                  className="w-4 h-4 rounded text-teal-500 bg-white dark:bg-slate-900 border-slate-300 dark:border-white/20 focus:ring-teal-400 cursor-pointer"
                />
                <label htmlFor="featuredCheck" className="text-xs text-slate-700 dark:text-slate-300 font-semibold cursor-pointer select-none">
                  Jadikan Proyek Unggulan (Tampilkan Badge Featured ★)
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-white/10">
                <button
                  type="button"
                  onClick={() => setProjectModal({ open: false, mode: 'create', data: null })}
                  className="px-5 py-2.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-slate-950 bg-teal-400 hover:bg-teal-300 shadow-md shadow-teal-500/20 transition-all disabled:opacity-50 cursor-pointer"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  <span>{projectModal.mode === 'create' ? 'Tambah Proyek' : 'Simpan Perubahan'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SKILL MODAL DENGAN PILIHAN IKON VISUAL */}
      {skillModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md p-6 rounded-3xl bg-white dark:bg-[#0d1322] border border-slate-200 dark:border-white/10 shadow-2xl space-y-6">
            <div className="flex justify-between items-center pb-4 border-b border-slate-200 dark:border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-600 dark:text-teal-400 flex items-center justify-center">
                  <Code2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {skillModal.mode === 'create' ? 'Tambah Keahlian Baru' : 'Edit Data Keahlian'}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Atur nama teknologi, kategori, ikon visual, dan level penguasaan.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSkillModal({ open: false, mode: 'create', data: null })}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSkill} className="space-y-4">
              <div>
                <label className="block text-[11px] font-semibold uppercase text-slate-600 dark:text-slate-400 mb-1">Nama Skill / Teknologi *</label>
                <input
                  name="name"
                  defaultValue={skillModal.data?.name || ''}
                  required
                  placeholder="Contoh: Laravel / React 19 / Docker"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase text-slate-600 dark:text-slate-400 mb-1">Kategori *</label>
                <select
                  name="category"
                  defaultValue={skillModal.data?.category || 'Frontend'}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:border-teal-500"
                >
                  <option value="Frontend">Frontend</option>
                  <option value="Backend">Backend</option>
                  <option value="Database">Database</option>
                  <option value="DevOps & Tools">DevOps & Tools</option>
                  <option value="Mobile">Mobile</option>
                  <option value="UI/UX & Design">UI/UX & Design</option>
                </select>
              </div>

              {/* Pilihan Ikon Siap Pakai */}
              <div>
                <label className="block text-[11px] font-semibold uppercase text-slate-600 dark:text-slate-400 mb-1">
                  Pilih Ikon Visual
                </label>
                <select
                  name="iconName"
                  defaultValue={skillModal.data?.iconName || 'Code2'}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:border-teal-500"
                >
                  {ICON_PRESETS.map((icon) => (
                    <option key={icon.id} value={icon.id}>
                      {icon.label} ({icon.id})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-semibold uppercase text-slate-600 dark:text-slate-400 mb-1">Level Kemahiran (%)</label>
                  <input
                    name="level"
                    type="number"
                    min="10"
                    max="100"
                    defaultValue={skillModal.data?.level || 85}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:border-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold uppercase text-slate-600 dark:text-slate-400 mb-1">Urutan (Order)</label>
                  <input
                    name="order"
                    type="number"
                    defaultValue={skillModal.data?.order || 0}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-white/10">
                <button
                  type="button"
                  onClick={() => setSkillModal({ open: false, mode: 'create', data: null })}
                  className="px-5 py-2.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-slate-950 bg-teal-400 hover:bg-teal-300 shadow-md shadow-teal-500/20 transition-all disabled:opacity-50 cursor-pointer"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  <span>{skillModal.mode === 'create' ? 'Tambah Skill' : 'Simpan Perubahan'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EXPERIENCE MODAL */}
      {expModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-lg p-6 sm:p-7 rounded-3xl bg-white dark:bg-[#0d1322] border border-slate-200 dark:border-white/10 shadow-2xl space-y-6">
            <div className="flex justify-between items-center pb-4 border-b border-slate-200 dark:border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-600 dark:text-teal-400 flex items-center justify-center">
                  <Briefcase className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {expModal.mode === 'create' ? 'Tambah Riwayat Pengalaman' : 'Edit Riwayat Pengalaman'}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Lengkapi posisi, perusahaan/kampus, periode waktu, dan deskripsi tanggung jawab.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setExpModal({ open: false, mode: 'create', data: null })}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveExp} className="space-y-4">
              <div>
                <label className="block text-[11px] font-semibold uppercase text-slate-600 dark:text-slate-400 mb-1">Tipe Entri *</label>
                <select
                  name="type"
                  defaultValue={expModal.data?.type || 'WORK'}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:border-teal-500"
                >
                  <option value="WORK">💼 Work Experience (Pengalaman Karir / Freelance)</option>
                  <option value="EDUCATION">🎓 Formal Education (Riwayat Pendidikan / Belajar)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase text-slate-600 dark:text-slate-400 mb-1">Posisi / Gelar / Peran *</label>
                <input
                  name="role"
                  defaultValue={expModal.data?.role || ''}
                  required
                  placeholder="Contoh: Fullstack Developer / S.Kom"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase text-slate-600 dark:text-slate-400 mb-1">Perusahaan / Institusi Kampus *</label>
                <input
                  name="institution"
                  defaultValue={expModal.data?.institution || ''}
                  required
                  placeholder="Contoh: Herbanova / PT Indorkarya Persada"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-semibold uppercase text-slate-600 dark:text-slate-400 mb-1">Periode Waktu *</label>
                  <input
                    name="period"
                    defaultValue={expModal.data?.period || ''}
                    required
                    placeholder="Nov 2025 – Sekarang"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:border-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold uppercase text-slate-600 dark:text-slate-400 mb-1">Urutan (Order)</label>
                  <input
                    name="order"
                    type="number"
                    defaultValue={expModal.data?.order || 0}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase text-slate-600 dark:text-slate-400 mb-1">Deskripsi Ringkas Tanggung Jawab</label>
                <textarea
                  name="description"
                  rows={3}
                  defaultValue={expModal.data?.description || ''}
                  placeholder="Deskripsikan pencapaian, teknologi yang digunakan, serta kontribusi Anda..."
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-xs sm:text-sm resize-none focus:outline-none focus:border-teal-500 leading-relaxed"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-white/10">
                <button
                  type="button"
                  onClick={() => setExpModal({ open: false, mode: 'create', data: null })}
                  className="px-5 py-2.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-slate-950 bg-teal-400 hover:bg-teal-300 shadow-md shadow-teal-500/20 transition-all disabled:opacity-50 cursor-pointer"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  <span>{expModal.mode === 'create' ? 'Tambah Data' : 'Simpan Perubahan'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CERTIFICATE MODAL DENGAN UPLOAD FOTO */}
      {certModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md max-h-[90vh] overflow-y-auto p-6 sm:p-7 rounded-3xl bg-white dark:bg-[#0d1322] border border-slate-200 dark:border-white/10 shadow-2xl space-y-6">
            <div className="flex justify-between items-center pb-4 border-b border-slate-200 dark:border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-600 dark:text-teal-400 flex items-center justify-center">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {certModal.mode === 'create' ? 'Tambah Sertifikat Baru' : 'Edit Data Sertifikat'}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Lengkapi nama sertifikasi, institusi penerbit, tahun, dan link verifikasi.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setCertModal({ open: false, mode: 'create', data: null })}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCert} className="space-y-4">
              <div>
                <label className="block text-[11px] font-semibold uppercase text-slate-600 dark:text-slate-400 mb-1">Nama Sertifikasi *</label>
                <input
                  name="title"
                  defaultValue={certModal.data?.title || ''}
                  required
                  placeholder="Contoh: Certified Web Developer"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:border-teal-500"
                />
              </div>

              {/* Upload Foto Sertifikat */}
              <div>
                <ImageUpload
                  value={certModal.data?.imageUrl || ''}
                  onChange={(url) =>
                    setCertModal((prev) => ({
                      ...prev,
                      data: { ...prev.data, imageUrl: url },
                    }))
                  }
                  label="Foto / Gambar Sertifikat (Opsional)"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase text-slate-600 dark:text-slate-400 mb-1">Penerbit (Issuer / Lembaga) *</label>
                <input
                  name="issuer"
                  defaultValue={certModal.data?.issuer || ''}
                  required
                  placeholder="Contoh: Dicoding / Google / Udemy"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-semibold uppercase text-slate-600 dark:text-slate-400 mb-1">Tahun Perolehan *</label>
                  <input
                    name="issueDate"
                    defaultValue={certModal.data?.issueDate || ''}
                    required
                    placeholder="2025"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:border-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold uppercase text-slate-600 dark:text-slate-400 mb-1">Urutan (Order)</label>
                  <input
                    name="order"
                    type="number"
                    defaultValue={certModal.data?.order || 0}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase text-slate-600 dark:text-slate-400 mb-1">Link Verifikasi Kredensial (Opsional)</label>
                <input
                  name="credentialUrl"
                  defaultValue={certModal.data?.credentialUrl || ''}
                  placeholder="https://dicoding.com/certificates/..."
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-white/10">
                <button
                  type="button"
                  onClick={() => setCertModal({ open: false, mode: 'create', data: null })}
                  className="px-5 py-2.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-slate-950 bg-teal-400 hover:bg-teal-300 shadow-md shadow-teal-500/20 transition-all disabled:opacity-50 cursor-pointer"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  <span>{certModal.mode === 'create' ? 'Tambah Sertifikat' : 'Simpan Perubahan'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* VIEW MESSAGE MODAL */}
      {viewMessageModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="glass-panel w-full max-w-lg p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-white/20 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Detail Pesan Masuk</h3>
              <button onClick={() => setViewMessageModal(null)}>
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase">Pengirim:</span>
                <p className="text-base font-bold text-slate-900 dark:text-white">{viewMessageModal.name}</p>
                <a href={`mailto:${viewMessageModal.email}`} className="text-xs text-teal-600 dark:text-teal-400 hover:underline">
                  {viewMessageModal.email}
                </a>
              </div>

              <div>
                <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase">Subjek:</span>
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{viewMessageModal.subject || 'No Subject'}</p>
              </div>

              <div>
                <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase">Pesan:</span>
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-sm text-slate-800 dark:text-slate-300 whitespace-pre-wrap leading-relaxed mt-1">
                  {viewMessageModal.message}
                </div>
              </div>

              <div className="text-[11px] text-slate-400 font-mono">
                Diterima pada: {new Date(viewMessageModal.createdAt).toLocaleString()}
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-slate-200 dark:border-white/10">
                <a
                  href={`mailto:${viewMessageModal.email}?subject=Re: ${encodeURIComponent(viewMessageModal.subject || 'Portfolio Inquiry')}`}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-950 bg-teal-400 flex items-center gap-2"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Balas via Email</span>
                </a>

                <button
                  onClick={() => handleDeleteMessage(viewMessageModal.id)}
                  className="px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-500/10"
                >
                  Hapus Pesan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

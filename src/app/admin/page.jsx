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
  CheckCircle2
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
    <div className="min-h-screen bg-slate-50 dark:bg-[#090d16] text-slate-900 dark:text-slate-100 flex flex-col md:flex-row transition-colors duration-300">
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

      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-white/95 dark:bg-slate-950/90 border-r border-slate-200/80 dark:border-white/10 flex flex-col justify-between shrink-0 shadow-sm z-20">
        <div>
          {/* Brand Header - Dibuat presisi tinggi h-20 agar sejajar sempurna dengan header kanan */}
          <div className="h-20 px-6 flex items-center gap-3 border-b border-slate-200/80 dark:border-white/10">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-500 to-cyan-400 flex items-center justify-center text-slate-950 font-bold shadow-md shadow-teal-500/20 shrink-0">
              <Shield className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <h2 className="font-bold text-sm tracking-tight text-slate-900 dark:text-white leading-tight">
                Portfolio CMS
              </h2>
              <span className="text-[11px] text-teal-600 dark:text-teal-400 font-semibold tracking-wide">
                Control Center
              </span>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="p-4 space-y-1.5">
            {[
              { id: 'overview', name: 'Dashboard', icon: LayoutDashboard },
              { id: 'profile', name: 'Profile & Foto', icon: User },
              { id: 'projects', name: 'Projects', icon: FolderGit2, badge: projects.length },
              { id: 'skills', name: 'Skills & Ikon', icon: Layers, badge: skills.length },
              { id: 'experience', name: 'Experience & Edu', icon: Briefcase },
              { id: 'certificates', name: 'Certificates', icon: Award },
              { id: 'messages', name: 'Inbox Messages', icon: Mail, badge: unreadMessagesCount, badgeColor: 'bg-rose-500' },
            ].map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-teal-500 text-slate-950 font-bold shadow-md shadow-teal-500/20'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.name}</span>
                  </div>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isActive
                          ? 'bg-slate-950 text-teal-300'
                          : item.badgeColor ? 'bg-rose-500 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-300'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer Actions */}
        <div className="p-4 border-t border-slate-200/80 dark:border-white/10 space-y-2">
          <Link
            href="/"
            target="_blank"
            className="w-full flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-white/5 transition-all shadow-sm"
          >
            <span>View Live Site</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 transition-all"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header - Tinggi persis h-20 rata sejajar horizontal dengan Sidebar Brand */}
        <header className="h-20 px-6 sm:px-8 border-b border-slate-200/80 dark:border-white/10 bg-white/70 dark:bg-slate-950/50 backdrop-blur-md flex items-center justify-between shrink-0">
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

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="glass-panel p-5 rounded-2xl border border-slate-200 dark:border-white/10">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Total Projects</span>
                  <FolderGit2 className="w-4 h-4 text-teal-500" />
                </div>
                <div className="text-3xl font-extrabold text-slate-900 dark:text-white">{projects.length}</div>
              </div>

              <div className="glass-panel p-5 rounded-2xl border border-slate-200 dark:border-white/10">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Total Skills</span>
                  <Layers className="w-4 h-4 text-cyan-500" />
                </div>
                <div className="text-3xl font-extrabold text-slate-900 dark:text-white">{skills.length}</div>
              </div>

              <div className="glass-panel p-5 rounded-2xl border border-slate-200 dark:border-white/10">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Experiences</span>
                  <Briefcase className="w-4 h-4 text-indigo-500" />
                </div>
                <div className="text-3xl font-extrabold text-slate-900 dark:text-white">{experiences.length}</div>
              </div>

              <div className="glass-panel p-5 rounded-2xl border border-slate-200 dark:border-white/10">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Unread Messages</span>
                  <Mail className="w-4 h-4 text-rose-500" />
                </div>
                <div className="text-3xl font-extrabold text-slate-900 dark:text-white">{unreadMessagesCount}</div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-7 glass-panel p-6 rounded-3xl border border-slate-200 dark:border-white/10">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-bold text-base text-slate-900 dark:text-white">Recent Inquiries</h3>
                  <button onClick={() => setActiveTab('messages')} className="text-xs text-teal-600 dark:text-teal-400 hover:underline">
                    View all
                  </button>
                </div>

                {messages.length === 0 ? (
                  <p className="text-xs text-slate-500 py-6 text-center">Belum ada pesan masuk.</p>
                ) : (
                  <div className="space-y-3">
                    {messages.slice(0, 4).map((msg) => (
                      <div
                        key={msg.id}
                        onClick={() => {
                          setViewMessageModal(msg);
                          if (!msg.isRead) handleToggleReadMessage(msg.id, false);
                        }}
                        className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 hover:bg-slate-100 dark:hover:bg-slate-800/80 border border-slate-200/60 dark:border-white/5 cursor-pointer transition-all flex items-center justify-between"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-sm text-slate-900 dark:text-white">{msg.name}</span>
                            {!msg.isRead && (
                              <span className="w-2 h-2 rounded-full bg-rose-500" />
                            )}
                          </div>
                          <p className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-sm mt-0.5">
                            {msg.subject || msg.message}
                          </p>
                        </div>
                        <span className="text-[11px] text-slate-400 font-mono">
                          {new Date(msg.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="lg:col-span-5 glass-panel p-6 rounded-3xl border border-slate-200 dark:border-white/10 space-y-4">
                <h3 className="font-bold text-base text-slate-900 dark:text-white mb-2">Quick Actions</h3>
                <button
                  onClick={() => {
                    setProjectModal({ open: true, mode: 'create', data: null });
                    setActiveTab('projects');
                  }}
                  className="w-full flex items-center gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/80 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-white/5 text-left text-sm text-slate-800 dark:text-slate-200 transition-all group"
                >
                  <div className="w-8 h-8 rounded-lg bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center group-hover:bg-teal-500 group-hover:text-slate-950 transition-all">
                    <Plus className="w-4 h-4" />
                  </div>
                  <span>Add New Project (Upload Foto)</span>
                </button>

                <button
                  onClick={() => {
                    setSkillModal({ open: true, mode: 'create', data: null });
                    setActiveTab('skills');
                  }}
                  className="w-full flex items-center gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/80 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-white/5 text-left text-sm text-slate-800 dark:text-slate-200 transition-all group"
                >
                  <div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center group-hover:bg-cyan-500 group-hover:text-slate-950 transition-all">
                    <Plus className="w-4 h-4" />
                  </div>
                  <span>Add New Skill (Pilih Ikon Siap Pakai)</span>
                </button>

                <button
                  onClick={() => setActiveTab('profile')}
                  className="w-full flex items-center gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/80 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-white/5 text-left text-sm text-slate-800 dark:text-slate-200 transition-all group"
                >
                  <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center group-hover:bg-indigo-500 group-hover:text-slate-950 transition-all">
                    <User className="w-4 h-4" />
                  </div>
                  <span>Upload Foto Profil Saya</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: PROFILE & SETTINGS */}
        {activeTab === 'profile' && (
          <form onSubmit={handleProfileSubmit} className="max-w-4xl space-y-8">
            <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-white/10 space-y-6">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-white/10 pb-3">
                1. 3 Foto Profil Anda (Untuk Efek 3D Stacked Card Carousel)
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Unggah 3 foto terbaik Anda. Ketiga foto ini akan otomatis berputar cantik secara 3D di Hero Section halaman depan.
              </p>

              {/* 3 Upload Foto Slots */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {(() => {
                  let photos = ['', '', ''];
                  try {
                    if (user?.avatarUrl && user.avatarUrl.startsWith('[')) {
                      photos = JSON.parse(user.avatarUrl);
                    } else if (user?.avatarUrl) {
                      photos = [user.avatarUrl, '', ''];
                    }
                  } catch (e) {}

                  return (
                    <>
                      <div>
                        <ImageUpload
                          value={photos[0] || ''}
                          onChange={(url) => {
                            const newPhotos = [...photos];
                            newPhotos[0] = url;
                            setUser({ ...user, avatarUrl: JSON.stringify(newPhotos) });
                          }}
                          label="Foto 1 (Kartu Utama)"
                        />
                      </div>

                      <div>
                        <ImageUpload
                          value={photos[1] || ''}
                          onChange={(url) => {
                            const newPhotos = [...photos];
                            newPhotos[1] = url;
                            setUser({ ...user, avatarUrl: JSON.stringify(newPhotos) });
                          }}
                          label="Foto 2 (Kartu Kanan)"
                        />
                      </div>

                      <div>
                        <ImageUpload
                          value={photos[2] || ''}
                          onChange={(url) => {
                            const newPhotos = [...photos];
                            newPhotos[2] = url;
                            setUser({ ...user, avatarUrl: JSON.stringify(newPhotos) });
                          }}
                          label="Foto 3 (Kartu Kiri)"
                        />
                      </div>
                    </>
                  );
                })()}
              </div>

              <h3 className="text-lg font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-white/10 pb-3 pt-4">
                2. Data Identitas & Bio
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                    Nama Lengkap *
                  </label>
                  <input
                    type="text"
                    required
                    value={user?.name || ''}
                    onChange={(e) => setUser({ ...user, name: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                    Job Title / Headline *
                  </label>
                  <input
                    type="text"
                    required
                    value={user?.title || ''}
                    onChange={(e) => setUser({ ...user, title: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                  Bio Singkat (Tampil di Hero Halaman Utama)
                </label>
                <textarea
                  rows={3}
                  value={user?.bio || ''}
                  onChange={(e) => setUser({ ...user, bio: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-sm resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                  Cerita Lengkap (About Me Section)
                </label>
                <textarea
                  rows={4}
                  value={user?.about || ''}
                  onChange={(e) => setUser({ ...user, about: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-sm resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                  Link Resume / Google Drive CV (Opsional)
                </label>
                <input
                  type="text"
                  value={user?.resumeUrl || ''}
                  onChange={(e) => setUser({ ...user, resumeUrl: e.target.value })}
                  placeholder="https://drive.google.com/..."
                  className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-sm"
                />
              </div>
            </div>

            {/* Site Availability & Metrics */}
            <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-white/10 space-y-6">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-white/10 pb-3">
                Status Ketersediaan & Statistik
              </h3>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="availableForHire"
                  checked={settings?.availableForHire ?? true}
                  onChange={(e) => setSettings({ ...settings, availableForHire: e.target.checked })}
                  className="w-4 h-4 rounded text-teal-500 focus:ring-teal-400 bg-white dark:bg-slate-900 border-slate-300 dark:border-white/20"
                />
                <label htmlFor="availableForHire" className="text-sm text-slate-800 dark:text-slate-200 font-medium">
                  Tampilkan Badge "Available for Hire" di Hero Section
                </label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Stat Pengalaman
                  </label>
                  <input
                    type="text"
                    value={settings?.statsExperience || ''}
                    onChange={(e) => setSettings({ ...settings, statsExperience: e.target.value })}
                    placeholder="3+ Years"
                    className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Stat Proyek Selesai
                  </label>
                  <input
                    type="text"
                    value={settings?.statsProjects || ''}
                    onChange={(e) => setSettings({ ...settings, statsProjects: e.target.value })}
                    placeholder="25+ Built"
                    className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Stat Klien Puas
                  </label>
                  <input
                    type="text"
                    value={settings?.statsClients || ''}
                    onChange={(e) => setSettings({ ...settings, statsClients: e.target.value })}
                    placeholder="15+ Happy"
                    className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Social Media Links */}
            <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-white/10 space-y-6">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-white/10 pb-3">
                Kontak & Media Sosial
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">GitHub URL</label>
                  <input
                    type="text"
                    value={user?.socials?.github || ''}
                    onChange={(e) =>
                      setUser({ ...user, socials: { ...user.socials, github: e.target.value } })
                    }
                    placeholder="https://github.com/username"
                    className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">LinkedIn URL</label>
                  <input
                    type="text"
                    value={user?.socials?.linkedin || ''}
                    onChange={(e) =>
                      setUser({ ...user, socials: { ...user.socials, linkedin: e.target.value } })
                    }
                    placeholder="https://linkedin.com/in/username"
                    className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Nomor / Link WhatsApp</label>
                  <input
                    type="text"
                    value={user?.socials?.whatsapp || ''}
                    onChange={(e) =>
                      setUser({ ...user, socials: { ...user.socials, whatsapp: e.target.value } })
                    }
                    placeholder="https://wa.me/628123456789"
                    className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Email Anda</label>
                  <input
                    type="email"
                    value={user?.socials?.email || ''}
                    onChange={(e) =>
                      setUser({ ...user, socials: { ...user.socials, email: e.target.value } })
                    }
                    placeholder="youremail@gmail.com"
                    className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Change Password */}
            <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-white/10 space-y-4">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-white/10 pb-3">
                Ganti Password Admin
              </h3>
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Password Baru (Kosongkan jika tidak ingin ganti)
                </label>
                <input
                  type="password"
                  value={user?.newPassword || ''}
                  onChange={(e) => setUser({ ...user, newPassword: e.target.value })}
                  placeholder="Minimal 6 karakter"
                  className="w-full max-w-sm px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-sm"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-8 py-3.5 rounded-xl font-bold text-sm text-slate-950 bg-teal-400 hover:bg-teal-300 shadow-lg shadow-teal-500/25 transition-all disabled:opacity-50"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              <span>Simpan Semua Perubahan</span>
            </button>
          </form>
        )}

        {/* TAB 3: PROJECTS MANAGER */}
        {activeTab === 'projects' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <p className="text-sm text-slate-500 dark:text-slate-400">Total: {projects.length} Proyek</p>
              <button
                onClick={() => setProjectModal({ open: true, mode: 'create', data: null })}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-xs sm:text-sm text-slate-950 bg-teal-400 hover:bg-teal-300 shadow-md transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Tambah Proyek Baru (Upload Foto)</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((p) => (
                <div key={p.id} className="glass-panel rounded-2xl border border-slate-200 dark:border-white/10 overflow-hidden flex flex-col justify-between shadow-sm">
                  <div>
                    <div className="h-44 w-full relative bg-slate-900">
                      <img src={p.coverImage} alt={p.title} className="w-full h-full object-cover" />
                      {p.featured && (
                        <span className="absolute top-2 left-2 px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-teal-500 text-slate-950">
                          Featured
                        </span>
                      )}
                    </div>
                    <div className="p-4">
                      <span className="text-[10px] font-semibold text-teal-600 dark:text-teal-400 uppercase tracking-wider">
                        {p.category}
                      </span>
                      <h4 className="font-bold text-base text-slate-900 dark:text-white mt-1 line-clamp-1">{p.title}</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">{p.description}</p>
                    </div>
                  </div>

                  <div className="p-4 pt-0 border-t border-slate-200/60 dark:border-white/5 flex items-center justify-between mt-3">
                    <span className="text-[11px] font-mono text-slate-400">Order: {p.order}</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setProjectModal({ open: true, mode: 'edit', data: p })}
                        className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300"
                        title="Edit"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteProject(p.id)}
                        className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500 text-rose-600 dark:text-rose-400 hover:text-white"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: SKILLS MANAGER */}
        {activeTab === 'skills' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <p className="text-sm text-slate-500 dark:text-slate-400">Total: {skills.length} Keahlian</p>
              <button
                onClick={() => setSkillModal({ open: true, mode: 'create', data: null })}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-xs sm:text-sm text-slate-950 bg-teal-400 hover:bg-teal-300 shadow-md transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Tambah Skill (Pilih Ikon)</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {skills.map((s) => (
                <div key={s.id} className="glass-panel p-4 rounded-2xl border border-slate-200 dark:border-white/10 flex items-center justify-between shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center">
                      <DynamicIcon name={s.iconName} size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white">{s.name}</h4>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400">{s.category} ({s.level}%)</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setSkillModal({ open: true, mode: 'edit', data: s })}
                      className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteSkill(s.id)}
                      className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500 text-rose-600 dark:text-rose-400 hover:text-white"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: EXPERIENCE MANAGER */}
        {activeTab === 'experience' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <p className="text-sm text-slate-500 dark:text-slate-400">Total: {experiences.length} Entri</p>
              <button
                onClick={() => setExpModal({ open: true, mode: 'create', data: null })}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-xs sm:text-sm text-slate-950 bg-teal-400 hover:bg-teal-300 shadow-md transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Tambah Pengalaman / Edukasi</span>
              </button>
            </div>

            <div className="space-y-4">
              {experiences.map((exp) => (
                <div key={exp.id} className="glass-panel p-5 rounded-2xl border border-slate-200 dark:border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-teal-500/20 text-teal-700 dark:text-teal-300">
                        {exp.type}
                      </span>
                      <span className="text-xs text-slate-500 dark:text-slate-400">{exp.period}</span>
                    </div>
                    <h4 className="font-bold text-base text-slate-900 dark:text-white">{exp.role}</h4>
                    <p className="text-xs text-teal-600 dark:text-teal-400 font-medium">{exp.institution}</p>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 max-w-2xl leading-relaxed">{exp.description}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => setExpModal({ open: true, mode: 'edit', data: exp })}
                      className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteExp(exp.id)}
                      className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500 text-rose-600 dark:text-rose-400 hover:text-white"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 6: CERTIFICATES MANAGER */}
        {activeTab === 'certificates' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <p className="text-sm text-slate-500 dark:text-slate-400">Total: {certificates.length} Sertifikat</p>
              <button
                onClick={() => setCertModal({ open: true, mode: 'create', data: null })}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-xs sm:text-sm text-slate-950 bg-teal-400 hover:bg-teal-300 shadow-md transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Tambah Sertifikat (Upload Foto)</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {certificates.map((c) => (
                <div key={c.id} className="glass-panel p-5 rounded-2xl border border-slate-200 dark:border-white/10 flex flex-col justify-between shadow-sm">
                  <div>
                    {c.imageUrl && (
                      <div className="w-full h-36 rounded-xl overflow-hidden mb-3 bg-slate-900">
                        <img src={c.imageUrl} alt={c.title} className="w-full h-full object-cover" />
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-amber-500 text-xs font-semibold mb-2">
                      <Award className="w-4 h-4" />
                      <span>{c.issueDate}</span>
                    </div>
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white mb-1">{c.title}</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{c.issuer}</p>
                  </div>
                  <div className="flex items-center justify-between pt-4 mt-3 border-t border-slate-200/60 dark:border-white/5">
                    {c.credentialUrl ? (
                      <a href={c.credentialUrl} target="_blank" rel="noreferrer" className="text-xs text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-1">
                        <span>Verify</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    ) : <span />}
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => setCertModal({ open: true, mode: 'edit', data: c })}
                        className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteCert(c.id)}
                        className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500 text-rose-600 dark:text-rose-400 hover:text-white"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="glass-panel w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-white/20 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                {projectModal.mode === 'create' ? 'Tambah Proyek Baru' : 'Edit Proyek'}
              </h3>
              <button
                onClick={() => setProjectModal({ open: false, mode: 'create', data: null })}
                className="p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProject} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600 dark:text-slate-400 mb-1">Judul Proyek *</label>
                <input
                  name="title"
                  defaultValue={projectModal.data?.title || ''}
                  required
                  placeholder="Contoh: Sistem E-Commerce Modern"
                  className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-sm"
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
                  label="Upload Foto Cover / Screenshot Proyek *"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-600 dark:text-slate-400 mb-1">Kategori *</label>
                  <select
                    name="category"
                    defaultValue={projectModal.data?.category || 'Fullstack'}
                    className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-sm"
                  >
                    <option value="Fullstack">Fullstack</option>
                    <option value="Frontend">Frontend</option>
                    <option value="Backend">Backend</option>
                    <option value="Mobile">Mobile</option>
                    <option value="UI/UX">UI/UX</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-600 dark:text-slate-400 mb-1">Urutan (Order Index)</label>
                  <input
                    name="order"
                    type="number"
                    defaultValue={projectModal.data?.order || 0}
                    className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600 dark:text-slate-400 mb-1">Deskripsi Proyek *</label>
                <textarea
                  name="description"
                  rows={3}
                  defaultValue={projectModal.data?.description || ''}
                  required
                  placeholder="Deskripsikan fitur dan tujuan proyek ini..."
                  className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-sm resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-600 dark:text-slate-400 mb-1">Link Live Demo (Opsional)</label>
                  <input
                    name="demoUrl"
                    defaultValue={projectModal.data?.demoUrl || ''}
                    placeholder="https://proyek-demo.com"
                    className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-600 dark:text-slate-400 mb-1">Link GitHub Repo (Opsional)</label>
                  <input
                    name="githubUrl"
                    defaultValue={projectModal.data?.githubUrl || ''}
                    placeholder="https://github.com/..."
                    className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600 dark:text-slate-400 mb-1">
                  Teknologi (Pisahkan dengan koma)
                </label>
                <input
                  name="techStack"
                  defaultValue={
                    Array.isArray(projectModal.data?.techStack)
                      ? projectModal.data.techStack.join(', ')
                      : projectModal.data?.techStack || 'Next.js, Tailwind CSS, Prisma'
                  }
                  placeholder="Next.js, Tailwind CSS, SQLite"
                  className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-sm"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  name="featured"
                  id="featuredCheck"
                  defaultChecked={projectModal.data?.featured || false}
                  className="w-4 h-4 rounded text-teal-500 bg-white dark:bg-slate-900 border-slate-300 dark:border-white/20"
                />
                <label htmlFor="featuredCheck" className="text-xs text-slate-700 dark:text-slate-300 font-semibold">
                  Jadikan Proyek Unggulan (Featured Badge)
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-white/10">
                <button
                  type="button"
                  onClick={() => setProjectModal({ open: false, mode: 'create', data: null })}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 rounded-xl text-xs font-bold text-slate-950 bg-teal-400 hover:bg-teal-300"
                >
                  Simpan Proyek
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SKILL MODAL DENGAN PILIHAN IKON VISUAL */}
      {skillModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="glass-panel w-full max-w-md p-6 rounded-3xl border border-slate-200 dark:border-white/20 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {skillModal.mode === 'create' ? 'Tambah Skill Baru' : 'Edit Skill'}
              </h3>
              <button onClick={() => setSkillModal({ open: false, mode: 'create', data: null })}>
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleSaveSkill} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600 dark:text-slate-400 mb-1">Nama Skill *</label>
                <input
                  name="name"
                  defaultValue={skillModal.data?.name || ''}
                  required
                  placeholder="Contoh: React.js / Node.js"
                  className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600 dark:text-slate-400 mb-1">Kategori *</label>
                <select
                  name="category"
                  defaultValue={skillModal.data?.category || 'Frontend'}
                  className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-sm"
                >
                  <option value="Frontend">Frontend</option>
                  <option value="Backend">Backend</option>
                  <option value="Database">Database</option>
                  <option value="DevOps & Tools">DevOps & Tools</option>
                </select>
              </div>

              {/* Pilihan Ikon Siap Pakai */}
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600 dark:text-slate-400 mb-1">
                  Pilih Ikon (Tinggal Klik)
                </label>
                <select
                  name="iconName"
                  defaultValue={skillModal.data?.iconName || 'Code2'}
                  className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-sm"
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
                  <label className="block text-xs font-semibold uppercase text-slate-600 dark:text-slate-400 mb-1">Level Kemahiran (%)</label>
                  <input
                    name="level"
                    type="number"
                    min="10"
                    max="100"
                    defaultValue={skillModal.data?.level || 85}
                    className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-600 dark:text-slate-400 mb-1">Urutan (Order)</label>
                  <input
                    name="order"
                    type="number"
                    defaultValue={skillModal.data?.order || 0}
                    className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-sm"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-white/10">
                <button
                  type="button"
                  onClick={() => setSkillModal({ open: false, mode: 'create', data: null })}
                  className="px-4 py-2 text-xs text-slate-400"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-xl text-xs font-bold text-slate-950 bg-teal-400"
                >
                  Simpan Skill
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EXPERIENCE MODAL */}
      {expModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="glass-panel w-full max-w-lg p-6 rounded-3xl border border-slate-200 dark:border-white/20 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {expModal.mode === 'create' ? 'Tambah Pengalaman / Belajar' : 'Edit Pengalaman'}
              </h3>
              <button onClick={() => setExpModal({ open: false, mode: 'create', data: null })}>
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleSaveExp} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600 dark:text-slate-400 mb-1">Tipe *</label>
                <select
                  name="type"
                  defaultValue={expModal.data?.type || 'WORK'}
                  className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-sm"
                >
                  <option value="WORK">Work Experience (Pengalaman Kerja)</option>
                  <option value="EDUCATION">Formal Education (Riwayat Pendidikan)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600 dark:text-slate-400 mb-1">Posisi / Gelar *</label>
                <input
                  name="role"
                  defaultValue={expModal.data?.role || ''}
                  required
                  placeholder="Contoh: Frontend Developer / S.Kom"
                  className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600 dark:text-slate-400 mb-1">Perusahaan / Kampus *</label>
                <input
                  name="institution"
                  defaultValue={expModal.data?.institution || ''}
                  required
                  placeholder="Nama Perusahaan / Universitas"
                  className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-600 dark:text-slate-400 mb-1">Periode *</label>
                  <input
                    name="period"
                    defaultValue={expModal.data?.period || ''}
                    required
                    placeholder="2023 - Sekarang"
                    className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-600 dark:text-slate-400 mb-1">Urutan (Order)</label>
                  <input
                    name="order"
                    type="number"
                    defaultValue={expModal.data?.order || 0}
                    className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600 dark:text-slate-400 mb-1">Deskripsi Ringkas</label>
                <textarea
                  name="description"
                  rows={3}
                  defaultValue={expModal.data?.description || ''}
                  placeholder="Pencapaian dan tanggung jawab utama..."
                  className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-sm resize-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-white/10">
                <button
                  type="button"
                  onClick={() => setExpModal({ open: false, mode: 'create', data: null })}
                  className="px-4 py-2 text-xs text-slate-400"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-xl text-xs font-bold text-slate-950 bg-teal-400"
                >
                  Simpan Data
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CERTIFICATE MODAL DENGAN UPLOAD FOTO */}
      {certModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="glass-panel w-full max-w-md max-h-[90vh] overflow-y-auto p-6 rounded-3xl border border-slate-200 dark:border-white/20 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {certModal.mode === 'create' ? 'Tambah Sertifikat' : 'Edit Sertifikat'}
              </h3>
              <button onClick={() => setCertModal({ open: false, mode: 'create', data: null })}>
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleSaveCert} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600 dark:text-slate-400 mb-1">Nama Sertifikasi *</label>
                <input
                  name="title"
                  defaultValue={certModal.data?.title || ''}
                  required
                  placeholder="Contoh: Certified Web Developer"
                  className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-sm"
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
                  label="Upload Foto Sertifikat (Opsional)"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600 dark:text-slate-400 mb-1">Penerbit (Issuer) *</label>
                <input
                  name="issuer"
                  defaultValue={certModal.data?.issuer || ''}
                  required
                  placeholder="Contoh: Dicoding / Google / Udemy"
                  className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-600 dark:text-slate-400 mb-1">Tahun Perolehan *</label>
                  <input
                    name="issueDate"
                    defaultValue={certModal.data?.issueDate || ''}
                    required
                    placeholder="2024"
                    className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-600 dark:text-slate-400 mb-1">Urutan</label>
                  <input
                    name="order"
                    type="number"
                    defaultValue={certModal.data?.order || 0}
                    className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600 dark:text-slate-400 mb-1">Link Verifikasi (Opsional)</label>
                <input
                  name="credentialUrl"
                  defaultValue={certModal.data?.credentialUrl || ''}
                  placeholder="https://..."
                  className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-sm"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-white/10">
                <button
                  type="button"
                  onClick={() => setCertModal({ open: false, mode: 'create', data: null })}
                  className="px-4 py-2 text-xs text-slate-400"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-xl text-xs font-bold text-slate-950 bg-teal-400"
                >
                  Simpan Sertifikat
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

'use client';

import { Sparkles, Code2, Zap, Layers, Users2, CheckCircle2 } from 'lucide-react';

export default function About({ user }) {
  const highlights = [
    {
      icon: Zap,
      title: 'Performa Tinggi & Cepat',
      desc: 'Optimalisasi kecepatan akses, performa responsif di semua perangkat, serta penerapan standar SEO modern.',
      gradient: 'from-amber-400 to-teal-400',
      glow: 'text-amber-400 bg-amber-400/10 border-amber-400/25',
    },
    {
      icon: Code2,
      title: 'Arsitektur Bersih & Rapi',
      desc: 'Struktur kode modular, terstandar, aman, dan mudah dirawat untuk skalabilitas jangka panjang.',
      gradient: 'from-teal-400 to-cyan-400',
      glow: 'text-teal-400 bg-teal-400/10 border-teal-400/25',
    },
    {
      icon: Layers,
      title: 'Analisis & Rekayasa Sistem',
      desc: 'Mampu merancang alur sistem dari hulu ke hilir, menghubungkan kebutuhan proses bisnis dengan solusi teknis tepat guna.',
      gradient: 'from-cyan-400 to-indigo-400',
      glow: 'text-cyan-400 bg-cyan-400/10 border-cyan-400/25',
    },
    {
      icon: Users2,
      title: 'Manajemen & Kolaborasi Agile',
      desc: 'Manajemen proyek yang terstruktur, komunikasi proaktif, dan komitmen penyelesaian fitur tepat waktu.',
      gradient: 'from-indigo-400 to-emerald-400',
      glow: 'text-indigo-400 bg-indigo-400/10 border-indigo-400/25',
    },
  ];

  const quickPoints = [
    'Pengembangan Web Fullstack Modern',
    'Manajemen Proyek & Analisis Kebutuhan Sistem',
    'Desain Antarmuka Intuitif & Responsif',
    'Integrasi API & Pengelolaan Basis Data Andal',
  ];

  return (
    <section id="about" className="relative py-24 scroll-mt-16 overflow-hidden">
      {/* Background Ambient Glows */}
      <div className="absolute top-1/3 -left-32 w-80 h-80 bg-teal-500/10 rounded-full filter blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-80 h-80 bg-cyan-500/10 rounded-full filter blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-500/10 text-teal-600 dark:text-teal-400 text-xs font-bold uppercase tracking-wider mb-5 border border-teal-500/20 backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Tentang Saya</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-[40px] font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.35] sm:leading-[1.4] mt-2 mb-4">
            Mendedikasikan Keahlian untuk Membangun Solusi Digital Unggul
          </h2>
        </div>

        {/* Content Grid - Vertically Centered */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Column: Narrative Story & Highlights */}
          <div className="lg:col-span-6 space-y-6">
            <p className="text-justify leading-relaxed text-slate-800 dark:text-slate-200 text-base sm:text-[17px] font-normal">
              {user?.about ||
                'Saya adalah Fullstack Developer, Project Manager, dan System Analyst yang berfokus pada pembangunan solusi digital modern dan berkinerja tinggi. Menggabungkan keahlian teknis pemrograman dengan analisis sistem yang mendalam dan manajemen proyek yang terstruktur untuk menciptakan produk teknologi yang efektif, teruji, dan memberikan dampak nyata bagi pengguna maupun bisnis.'}
            </p>

            {/* Quick Specs Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              {quickPoints.map((point, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/70 dark:bg-slate-900/60 border border-slate-200/80 dark:border-white/10 backdrop-blur-md shadow-sm group hover:border-teal-500/40 transition-all"
                >
                  <div className="w-6 h-6 rounded-lg bg-teal-500/10 border border-teal-500/20 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 leading-tight">
                    {point}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Key Value Cards */}
          <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 auto-rows-fr">
            {highlights.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="relative group p-6 rounded-3xl bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200/80 dark:border-white/10 hover:border-teal-500/40 dark:hover:border-teal-400/40 transition-all duration-500 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-teal-500/10 overflow-hidden flex flex-col justify-between h-full"
                >
                  {/* Top Hover Accent Beam */}
                  <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-teal-400/0 group-hover:via-teal-400 group-hover:via-50% to-transparent transition-all duration-500" />

                  <div>
                    <div
                      className={`w-12 h-12 rounded-2xl border flex items-center justify-center mb-5 transition-transform duration-500 group-hover:scale-110 shadow-lg ${item.glow}`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2 transition-colors group-hover:text-teal-500 dark:group-hover:text-teal-400">
                      {item.title}
                    </h3>
                    <p className="text-justify text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-normal">
                      {item.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}


'use client';

import { useState } from 'react';
import { Briefcase, GraduationCap, Users, Calendar, Sparkles } from 'lucide-react';

export default function Experience({ experiences = [] }) {
  const [filter, setFilter] = useState('ALL');

  const filtered =
    filter === 'ALL'
      ? experiences
      : experiences.filter((e) => e.type === filter);

  const getTypeInfo = (type) => {
    switch (type) {
      case 'WORK':
        return { label: 'Pengalaman Kerja', icon: Briefcase, color: 'text-teal-400 bg-teal-500/10 border-teal-500/20' };
      case 'EDUCATION':
        return { label: 'Edukasi & Asistensi', icon: GraduationCap, color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20' };
      case 'ORGANIZATION':
        return { label: 'Organisasi & Kepemimpinan', icon: Users, color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20' };
      default:
        return { label: 'Pengalaman', icon: Briefcase, color: 'text-teal-400 bg-teal-500/10 border-teal-500/20' };
    }
  };

  return (
    <section id="experience" className="relative py-24 scroll-mt-16 bg-slate-100/40 dark:bg-slate-950/40 overflow-hidden">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-500/10 text-teal-600 dark:text-teal-400 text-xs font-bold uppercase tracking-wider mb-4 border border-teal-500/20 backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Pengalaman & Riwayat</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-[40px] font-extrabold text-slate-900 dark:text-white tracking-tight mb-4">
            Perjalanan Karir, Proyek & Organisasi
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Rekam jejak profesional, pengalaman kerja praktis, kontribusi laboratorium kampus, serta kepemimpinan organisasi.
          </p>
        </div>

        {/* Filter Toggle Buttons */}
        <div className="flex flex-wrap justify-center gap-2.5 sm:gap-3 mb-14">
          <button
            onClick={() => setFilter('ALL')}
            className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold transition-all shadow-sm ${
              filter === 'ALL'
                ? 'bg-teal-500 text-slate-950 font-bold shadow-md shadow-teal-500/25'
                : 'bg-white/80 dark:bg-slate-900/80 text-slate-700 dark:text-slate-300 hover:text-teal-600 dark:hover:text-white border border-slate-200 dark:border-white/10'
            }`}
          >
            Semua Riwayat
          </button>
          <button
            onClick={() => setFilter('WORK')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold transition-all shadow-sm ${
              filter === 'WORK'
                ? 'bg-teal-500 text-slate-950 font-bold shadow-md shadow-teal-500/25'
                : 'bg-white/80 dark:bg-slate-900/80 text-slate-700 dark:text-slate-300 hover:text-teal-600 dark:hover:text-white border border-slate-200 dark:border-white/10'
            }`}
          >
            <Briefcase className="w-4 h-4" />
            <span>Pengalaman Kerja</span>
          </button>
          <button
            onClick={() => setFilter('EDUCATION')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold transition-all shadow-sm ${
              filter === 'EDUCATION'
                ? 'bg-teal-500 text-slate-950 font-bold shadow-md shadow-teal-500/25'
                : 'bg-white/80 dark:bg-slate-900/80 text-slate-700 dark:text-slate-300 hover:text-teal-600 dark:hover:text-white border border-slate-200 dark:border-white/10'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>Edukasi & Asistensi</span>
          </button>
          <button
            onClick={() => setFilter('ORGANIZATION')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold transition-all shadow-sm ${
              filter === 'ORGANIZATION'
                ? 'bg-teal-500 text-slate-950 font-bold shadow-md shadow-teal-500/25'
                : 'bg-white/80 dark:bg-slate-900/80 text-slate-700 dark:text-slate-300 hover:text-teal-600 dark:hover:text-white border border-slate-200 dark:border-white/10'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Organisasi</span>
          </button>
        </div>

        {/* Timeline Container */}
        <div className="relative pl-6 sm:pl-8 border-l-2 border-teal-500/40 space-y-10">
          {filtered.map((item) => {
            const typeInfo = getTypeInfo(item.type);
            const Icon = typeInfo.icon;

            return (
              <div key={item.id} className="relative group">
                {/* Timeline Dot Icon */}
                <div className="absolute -left-[35px] sm:-left-[43px] top-1.5 w-10 h-10 rounded-full bg-white dark:bg-slate-900 border-2 border-teal-500 flex items-center justify-center text-teal-600 dark:text-teal-400 group-hover:scale-110 group-hover:bg-teal-500 group-hover:text-slate-950 transition-all duration-300 shadow-md">
                  <Icon className="w-4 h-4" />
                </div>

                {/* Content Card */}
                <div className="p-6 sm:p-7 rounded-3xl bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200/80 dark:border-white/10 hover:border-teal-500/40 dark:hover:border-teal-400/40 transition-all duration-300 group-hover:-translate-y-1 shadow-sm">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${typeInfo.color}`}>
                      {typeInfo.label}
                    </span>
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-medium">
                      <Calendar className="w-3.5 h-3.5 text-teal-500" />
                      <span>{item.period}</span>
                      {item.period?.toLowerCase().includes('sekarang') && (
                        <span className="ml-1 inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 animate-pulse">
                          Aktif
                        </span>
                      )}
                    </div>
                  </div>

                  <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mt-1">
                    {item.role}
                  </h3>

                  <div className="text-sm font-semibold text-teal-600 dark:text-teal-400 mb-3">
                    {item.institution}
                  </div>

                  <p className="text-justify text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

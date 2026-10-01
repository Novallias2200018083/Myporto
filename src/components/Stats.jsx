'use client';

import { Briefcase, FolderCheck, Users, ShieldCheck, Sparkles, TrendingUp, Zap, Award } from 'lucide-react';

export default function Stats({ settings }) {
  const statsList = [
    {
      icon: Briefcase,
      value: settings?.statsExperience || '2+ Tahun',
      label: 'Pengalaman Profesional',
      sublabel: 'Pengembangan Web & Sistem',
      tag: 'Track Record',
      glow: 'text-teal-400 bg-teal-500/10 border-teal-500/30 shadow-teal-500/20',
      badgeBg: 'bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/20',
      accentColor: 'group-hover:border-teal-500/50',
      ringColor: '#14b8a6',
    },
    {
      icon: FolderCheck,
      value: settings?.statsProjects || '20+ Proyek',
      label: 'Proyek Selesai',
      sublabel: 'Aplikasi Web & Solusi Digital',
      tag: 'Production Ready',
      glow: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30 shadow-cyan-500/20',
      badgeBg: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20',
      accentColor: 'group-hover:border-cyan-500/50',
      ringColor: '#06b6d4',
    },
    {
      icon: Users,
      value: settings?.statsClients || '8 Klien',
      label: 'Klien & Kolaborator',
      sublabel: 'Kepuasan & Kerja Sama Positif',
      tag: 'High Satisfaction',
      glow: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30 shadow-emerald-500/20',
      badgeBg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
      accentColor: 'group-hover:border-emerald-500/50',
      ringColor: '#10b981',
    },
    {
      icon: ShieldCheck,
      value: '100%',
      label: 'Dedikasi & Kualitas',
      sublabel: 'Clean Code & Standar Modern',
      tag: 'Best Practices',
      glow: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/30 shadow-indigo-500/20',
      badgeBg: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20',
      accentColor: 'group-hover:border-indigo-500/50',
      ringColor: '#6366f1',
    },
  ];

  return (
    <section className="relative py-16 sm:py-20 border-y border-slate-200/60 dark:border-white/5 bg-slate-950/20 dark:bg-[#070b14]/60 overflow-hidden">
      {/* Background Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4/5 h-40 bg-teal-500/5 dark:bg-teal-500/10 filter blur-[120px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {statsList.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className={`relative group p-6 sm:p-7 rounded-3xl bg-white/75 dark:bg-slate-900/65 backdrop-blur-xl border border-slate-200/80 dark:border-white/10 ${item.accentColor} transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-teal-500/15 flex flex-col items-center text-center justify-between overflow-hidden cursor-default`}
              >
                {/* Top Glowing Gradient Beam on Hover */}
                <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-teal-400/0 group-hover:via-teal-400 to-transparent transition-all duration-500" />

                {/* Top Corner Index Badge */}
                <div className="w-full flex items-center justify-between mb-4">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${item.badgeBg}`}>
                    {item.tag}
                  </span>
                  <span className="text-[11px] font-mono font-bold text-slate-400 dark:text-slate-500 group-hover:text-teal-400 transition-colors">
                    0{idx + 1}
                  </span>
                </div>

                {/* Centered Glowing Icon Badge */}
                <div className="relative mb-5 flex items-center justify-center">
                  <div className="absolute -inset-2 rounded-2xl bg-teal-500/10 filter blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div
                    className={`relative w-14 h-14 rounded-2xl border flex items-center justify-center transition-all duration-500 group-hover:scale-110 shadow-lg ${item.glow}`}
                  >
                    <Icon className="w-7 h-7 transition-transform duration-500 group-hover:rotate-6" />
                  </div>
                </div>

                {/* Centered Values & Labels */}
                <div className="space-y-1.5 w-full">
                  <div className="text-3xl sm:text-4xl font-black tracking-tight text-slate-950 dark:text-white transition-all group-hover:text-teal-500 dark:group-hover:text-teal-400">
                    {item.value}
                  </div>
                  <h4 className="text-sm font-extrabold text-slate-900 dark:text-slate-100">
                    {item.label}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-normal max-w-[220px] mx-auto">
                    {item.sublabel}
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

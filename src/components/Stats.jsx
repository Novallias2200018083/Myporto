'use client';

import { Briefcase, FolderCheck, Users, ShieldCheck, Sparkles } from 'lucide-react';

export default function Stats({ settings }) {
  const statsList = [
    {
      icon: Briefcase,
      value: settings?.statsExperience || '3+ Tahun',
      label: 'Pengalaman Profesional',
      sublabel: 'Pengembangan Web & Sistem',
      color: 'from-teal-500 to-emerald-400',
      glow: 'shadow-teal-500/20 text-teal-400 bg-teal-500/10 border-teal-500/25',
    },
    {
      icon: FolderCheck,
      value: settings?.statsProjects || '20+ Proyek',
      label: 'Proyek Selesai',
      sublabel: 'Aplikasi Web & Solusi Digital',
      color: 'from-cyan-500 to-blue-500',
      glow: 'shadow-cyan-500/20 text-cyan-400 bg-cyan-500/10 border-cyan-500/25',
    },
    {
      icon: Users,
      value: settings?.statsClients || '12+ Mitra',
      label: 'Klien & Kolaborator',
      sublabel: 'Kepuasan & Kerja Sama Positif',
      color: 'from-emerald-400 to-teal-500',
      glow: 'shadow-emerald-500/20 text-emerald-400 bg-emerald-500/10 border-emerald-500/25',
    },
    {
      icon: ShieldCheck,
      value: '100%',
      label: 'Dedikasi & Kualitas',
      sublabel: 'Clean Code & Standar Modern',
      color: 'from-indigo-400 to-purple-500',
      glow: 'shadow-indigo-500/20 text-indigo-400 bg-indigo-500/10 border-indigo-500/25',
    },
  ];

  return (
    <section className="relative py-16 border-y border-slate-200/60 dark:border-white/5 bg-gradient-to-b from-transparent via-slate-100/40 dark:via-slate-900/40 to-transparent overflow-hidden">
      {/* Background Decorative Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-32 bg-teal-500/5 dark:bg-teal-500/10 filter blur-3xl pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {statsList.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="relative group p-6 rounded-3xl bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200/80 dark:border-white/10 hover:border-teal-500/40 dark:hover:border-teal-400/40 transition-all duration-500 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-teal-500/10 flex flex-col justify-between overflow-hidden"
              >
                {/* Top Subtle Hover Accent Line */}
                <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-teal-400/0 group-hover:via-teal-400 group-hover:via-50% to-transparent transition-all duration-500" />

                <div className="flex items-center justify-between mb-5">
                  <div
                    className={`w-12 h-12 rounded-2xl border flex items-center justify-center transition-transform duration-500 group-hover:scale-110 shadow-lg ${item.glow}`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-[11px] font-mono font-bold text-slate-400 dark:text-slate-500 group-hover:text-teal-500 dark:group-hover:text-teal-400 transition-colors">
                    0{idx + 1}
                  </span>
                </div>

                <div>
                  <div className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-1.5 transition-colors group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-teal-400 group-hover:to-cyan-400">
                    {item.value}
                  </div>
                  <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-0.5">
                    {item.label}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-normal">
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


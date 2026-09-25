'use client';

import { useState } from 'react';
import DynamicIcon from './DynamicIcon';
import { Layers } from 'lucide-react';

export default function Skills({ skills = [] }) {
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', ...Array.from(new Set(skills.map((s) => s.category)))];

  const filteredSkills =
    selectedCategory === 'All'
      ? skills
      : skills.filter((s) => s.category === selectedCategory);

  return (
    <section id="skills" className="relative py-24 scroll-mt-16 bg-slate-100/50 dark:bg-slate-950/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-4 border border-cyan-500/20">
            <Layers className="w-3.5 h-3.5" />
            <span>Tech Stack & Competencies</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4">
            Skills & Technologies I Work With
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
            Kombinasi teknologi mutakhir yang saya gunakan untuk mewujudkan produk digital berkinerja tinggi.
          </p>
        </div>

        {/* Category Pills */}
        {categories.length > 1 && (
          <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 ${
                  selectedCategory === cat
                    ? 'bg-teal-500 text-slate-950 font-bold shadow-md shadow-teal-500/25 scale-105'
                    : 'glass-panel text-slate-700 dark:text-slate-300 hover:text-teal-600 dark:hover:text-white border-slate-200 dark:border-white/10'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* Skills Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {filteredSkills.map((skill) => (
            <div
              key={skill.id}
              className="glass-panel p-5 rounded-2xl border border-slate-200/80 dark:border-white/10 hover:border-teal-500/40 transition-all duration-300 group hover:-translate-y-1 relative overflow-hidden shadow-sm"
            >
              {/* Card top */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-600 dark:text-teal-400 group-hover:scale-110 group-hover:bg-teal-500 group-hover:text-slate-950 transition-all duration-300">
                    <DynamicIcon name={skill.iconName} size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                      {skill.name}
                    </h3>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                      {skill.category}
                    </span>
                  </div>
                </div>

                <span className="text-xs font-mono font-bold text-teal-600 dark:text-teal-400">
                  {skill.level}%
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-800/80 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-teal-500 to-cyan-400 transition-all duration-1000 ease-out"
                  style={{ width: `${skill.level}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

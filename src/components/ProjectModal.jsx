'use client';

import { useEffect } from 'react';
import { X, ExternalLink, Github, Layers, Sparkles, Code2, CheckCircle2 } from 'lucide-react';

export default function ProjectModal({ project, onClose }) {
  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!project) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl rounded-3xl border border-slate-200 dark:border-white/10 shadow-2xl shadow-teal-500/10 p-6 sm:p-8 animate-in zoom-in-95 duration-200"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Tutup Modal"
          className="absolute top-5 right-5 p-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700/80 border border-slate-200/60 dark:border-white/10 transition-all duration-200 shadow-sm"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Badges Header */}
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-teal-500/10 border border-teal-500/30 text-teal-600 dark:text-teal-400">
            <Layers className="w-3.5 h-3.5" />
            <span>{project.category}</span>
          </span>
          {project.featured && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/15 border border-amber-500/30 text-amber-600 dark:text-amber-400">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Featured Project</span>
            </span>
          )}
        </div>

        {/* Project Title */}
        <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-snug mb-5 pr-10">
          {project.title}
        </h3>

        {/* Cover Image */}
        <div className="relative w-full h-64 sm:h-84 rounded-2xl overflow-hidden mb-6 bg-slate-950 border border-slate-200/80 dark:border-white/10 shadow-inner group">
          <img
            src={project.coverImage}
            alt={project.title}
            className="w-full h-full object-cover object-center group-hover:scale-[1.02] transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent pointer-events-none" />
        </div>

        {/* Description / Overview Section with Justify */}
        <div className="mb-6 p-5 sm:p-6 rounded-2xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/60 dark:border-white/5 space-y-2.5">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">
            <CheckCircle2 className="w-4 h-4" />
            <span>Project Overview</span>
          </div>
          <p className="text-justify text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed font-normal">
            {project.description}
          </p>
        </div>

        {/* Tech Stack Pills */}
        <div className="mb-7">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
            <Code2 className="w-4 h-4 text-teal-500" />
            <span>Technologies & Tools</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {Array.isArray(project.techStack) &&
              project.techStack.map((tech, i) => (
                <span
                  key={i}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-mono font-medium bg-slate-100 dark:bg-slate-800/90 text-teal-700 dark:text-teal-300 border border-slate-200 dark:border-teal-500/20 shadow-xs hover:border-teal-500/40 transition-colors"
                >
                  {tech}
                </span>
              ))}
          </div>
        </div>

        {/* Action Links */}
        <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-slate-200/80 dark:border-white/10">
          {project.demoUrl && project.demoUrl !== '#' && (
            <a
              href={project.demoUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-xs sm:text-sm text-slate-950 bg-teal-400 hover:bg-teal-300 shadow-md shadow-teal-500/20 transition-all hover:scale-[1.02]"
            >
              <span>Lihat Demo Live</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          )}
          {project.githubUrl && project.githubUrl !== '#' && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 px-6 py-3 rounded-2xl font-semibold text-xs sm:text-sm text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-white/10 transition-all hover:scale-[1.02]"
            >
              <Github className="w-4 h-4" />
              <span>Source Code Repository</span>
            </a>
          )}
          <button
            type="button"
            onClick={onClose}
            className="ml-auto px-5 py-3 rounded-2xl text-xs sm:text-sm font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}

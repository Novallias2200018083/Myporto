'use client';

import { useState } from 'react';
import ProjectModal from './ProjectModal';
import { ExternalLink, Github, FolderGit2, Eye, ArrowUpRight } from 'lucide-react';

export default function Projects({ projects = [] }) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeModalProject, setActiveModalProject] = useState(null);

  const categories = ['All', ...Array.from(new Set(projects.map((p) => p.category)))];

  const filteredProjects =
    selectedCategory === 'All'
      ? projects
      : projects.filter((p) => p.category === selectedCategory);

  return (
    <section id="projects" className="relative py-24 scroll-mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-500/10 text-teal-600 dark:text-teal-400 text-xs font-bold uppercase tracking-wider mb-4 border border-teal-500/20 backdrop-blur-md">
            <FolderGit2 className="w-3.5 h-3.5" />
            <span>Portofolio Proyek</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-[40px] font-extrabold text-slate-900 dark:text-white tracking-tight mb-4">
            Karya & Proyek Terpilih
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Koleksi sistem informasi enterprise, aplikasi e-commerce, dan solusi digital yang telah saya kembangkan.
          </p>
        </div>

        {/* Category Filters */}
        {categories.length > 1 && (
          <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 ${
                  selectedCategory === cat
                    ? 'bg-teal-500 text-slate-950 font-bold shadow-md shadow-teal-500/25 scale-105'
                    : 'bg-white/80 dark:bg-slate-900/80 text-slate-700 dark:text-slate-300 hover:text-teal-600 dark:hover:text-white border border-slate-200 dark:border-white/10'
                }`}
              >
                {cat === 'All' ? 'Semua Proyek' : cat}
              </button>
            ))}
          </div>
        )}

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="p-0 rounded-3xl bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200/80 dark:border-white/10 hover:border-teal-500/40 dark:hover:border-teal-400/40 overflow-hidden transition-all duration-500 hover:-translate-y-2 group flex flex-col justify-between shadow-sm hover:shadow-2xl hover:shadow-teal-500/10"
            >
              <div>
                {/* Project Image & Overlay */}
                <div className="relative h-52 sm:h-56 w-full overflow-hidden bg-slate-900">
                  <img
                    src={project.coverImage}
                    alt={project.title}
                    className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

                  {/* Featured Tag */}
                  {project.featured && (
                    <div className="absolute top-3 left-3 px-3 py-1 rounded-full text-[11px] font-bold bg-teal-500 text-slate-950 shadow-md">
                      Unggulan
                    </div>
                  )}

                  {/* Quick Action Button on Hover */}
                  <button
                    onClick={() => setActiveModalProject(project)}
                    className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-slate-950/60 backdrop-blur-sm transition-opacity duration-300"
                  >
                    <span className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-slate-900/90 border border-white/20 shadow-lg">
                      <Eye className="w-4 h-4 text-teal-400" />
                      <span>Lihat Detail</span>
                    </span>
                  </button>
                </div>

                {/* Card Content */}
                <div className="p-6">
                  {/* Category Pill */}
                  <span className="text-[11px] font-semibold text-teal-600 dark:text-teal-400 uppercase tracking-wider mb-2 inline-block">
                    {project.category}
                  </span>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2.5 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors line-clamp-1">
                    {project.title}
                  </h3>

                  {/* Description */}
                  <p className="text-justify text-xs sm:text-sm text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed mb-4 font-normal">
                    {project.description}
                  </p>

                  {/* Tech Stack Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {Array.isArray(project.techStack) &&
                      project.techStack.slice(0, 4).map((tech, i) => (
                        <span
                          key={i}
                          className="px-2.5 py-1 rounded-md text-[11px] font-mono bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/5"
                        >
                          {tech}
                        </span>
                      ))}
                    {Array.isArray(project.techStack) && project.techStack.length > 4 && (
                      <span className="px-2 py-1 rounded-md text-[11px] font-mono bg-slate-100 dark:bg-slate-800/50 text-slate-500">
                        +{project.techStack.length - 4}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Card Footer Links */}
              <div className="p-6 pt-0 flex items-center justify-between border-t border-slate-100 dark:border-white/5 mt-4">
                <button
                  onClick={() => setActiveModalProject(project)}
                  className="text-xs font-semibold text-teal-600 dark:text-teal-400 hover:text-teal-500 flex items-center gap-1 transition-colors"
                >
                  <span>Selengkapnya</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>

                <div className="flex items-center gap-2">
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-white/10 transition-all shadow-sm"
                      title="GitHub Repository"
                    >
                      <Github className="w-4 h-4" />
                    </a>
                  )}
                  {project.demoUrl && (
                    <a
                      href={project.demoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2 rounded-lg bg-teal-500/20 hover:bg-teal-500 text-teal-700 dark:text-teal-300 hover:text-slate-950 border border-teal-500/30 transition-all shadow-sm"
                      title="Live Demo"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Project Detail Modal */}
      {activeModalProject && (
        <ProjectModal
          project={activeModalProject}
          onClose={() => setActiveModalProject(null)}
        />
      )}
    </section>
  );
}

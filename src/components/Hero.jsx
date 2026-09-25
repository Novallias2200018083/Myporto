'use client';

import { ArrowRight, Download, Github, Linkedin, Mail, MessageSquare } from 'lucide-react';
import HeroCardCarousel from './HeroCardCarousel';

export default function Hero({ user, settings }) {
  const socials = user?.socials || {};

  return (
    <section className="relative min-h-screen pt-32 pb-20 flex items-center justify-center overflow-hidden">
      {/* Ambient background glows */}
      <div className="ambient-glow-1 top-20 -left-20" />
      <div className="ambient-glow-2 bottom-10 -right-20" />

      {/* Decorative Grid Lines */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#64748b10_1px,transparent_1px),linear-gradient(to_bottom,#64748b10_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Headlines & Call-to-actions */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            {/* Availability Badge */}
            {settings?.availableForHire && (
              <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-600 dark:text-teal-400 text-xs sm:text-sm font-medium mb-6 backdrop-blur-md shadow-sm">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-teal-500"></span>
                </span>
                <span>{settings.statusBadgeText || 'Available for freelance & full-time roles'}</span>
              </div>
            )}

            {/* Main Title - Menjadi 1 Baris Rapi */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[50px] xl:text-[56px] font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight mb-6">
              Hi, I'm{' '}
              <span className="text-gradient">
                {user?.name || 'Noval Lias Ramadani'}
              </span>
            </h1>

            {/* Subtitle / Role - Pasti 1 Baris Rapi */}
            <div className="flex items-center gap-2.5 mb-5 max-w-full">
              <span className="w-6 sm:w-8 h-[2px] bg-teal-500 shrink-0 inline-block"></span>
              <p className="text-xs sm:text-sm md:text-base lg:text-[17px] xl:text-[19px] font-semibold text-slate-700 dark:text-slate-300 whitespace-nowrap overflow-hidden text-ellipsis">
                {user?.title || 'Fullstack Web Engineer'}
              </p>
            </div>

            {/* Short Bio */}
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mb-8 leading-relaxed">
              {user?.bio ||
                'Membangun solusi digital yang andal, inovatif, dan berkinerja tinggi. Berfokus pada perancangan sistem modern serta mengubah tantangan kompleks menjadi produk teknologi yang efektif dan bernilai nyata.'}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4 mb-10">
              <a
                href="#projects"
                className="group flex items-center gap-2.5 px-7 py-3.5 rounded-xl font-semibold text-sm sm:text-base text-slate-950 bg-teal-400 hover:bg-teal-300 shadow-lg shadow-teal-500/25 hover:shadow-teal-500/40 hover:-translate-y-0.5 transition-all duration-300"
              >
                <span>Explore Projects</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>

              {user?.resumeUrl && (
                <a
                  href={user.resumeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-sm sm:text-base text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-700/80 border border-slate-200 dark:border-white/10 shadow-sm hover:-translate-y-0.5 transition-all duration-300"
                >
                  <Download className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                  <span>Resume / CV</span>
                </a>
              )}
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-3">
              <span className="text-xs uppercase tracking-wider text-slate-500 font-semibold mr-2">
                Connect:
              </span>
              {socials.github && (
                <a
                  href={socials.github}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2.5 rounded-xl bg-white dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-white/10 hover:scale-110 shadow-sm transition-all"
                  aria-label="GitHub Profile"
                >
                  <Github className="w-5 h-5" />
                </a>
              )}
              {socials.linkedin && (
                <a
                  href={socials.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2.5 rounded-xl bg-white dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 border border-slate-200 dark:border-white/10 hover:scale-110 shadow-sm transition-all"
                  aria-label="LinkedIn Profile"
                >
                  <Linkedin className="w-5 h-5" />
                </a>
              )}
              {socials.whatsapp && (
                <a
                  href={socials.whatsapp}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2.5 rounded-xl bg-white dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 border border-slate-200 dark:border-white/10 hover:scale-110 shadow-sm transition-all"
                  aria-label="WhatsApp"
                >
                  <MessageSquare className="w-5 h-5" />
                </a>
              )}
              {socials.email && (
                <a
                  href={`mailto:${socials.email}`}
                  className="p-2.5 rounded-xl bg-white dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 border border-slate-200 dark:border-white/10 hover:scale-110 shadow-sm transition-all"
                  aria-label="Email"
                >
                  <Mail className="w-5 h-5" />
                </a>
              )}
            </div>
          </div>

          {/* Right Column: Visual Showcase 3D Rotating Stacked Carousel */}
          <div className="lg:col-span-5 relative flex justify-center">
            <HeroCardCarousel user={user} />
          </div>
        </div>
      </div>
    </section>
  );
}

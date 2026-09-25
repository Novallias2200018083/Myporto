'use client';

import { Award, ExternalLink } from 'lucide-react';

export default function Certificates({ certificates = [] }) {
  if (!certificates || certificates.length === 0) return null;

  return (
    <section className="relative py-20 scroll-mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-semibold uppercase tracking-wider mb-4 border border-amber-500/20">
            <Award className="w-3.5 h-3.5" />
            <span>Honors & Credentials</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4">
            Certifications & Licenses
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
            Validasi keahlian teknis dan standar industri yang telah diraih.
          </p>
        </div>

        {/* Certificates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certificates.map((cert) => (
            <div
              key={cert.id}
              className="glass-panel p-6 rounded-2xl border border-slate-200/80 dark:border-white/10 hover:border-amber-500/40 transition-all duration-300 hover:-translate-y-1.5 group flex flex-col justify-between shadow-sm"
            >
              <div>
                {/* Thumbnail if present */}
                {cert.imageUrl && (
                  <div className="w-full h-40 rounded-xl overflow-hidden mb-4 bg-slate-900 border border-slate-200 dark:border-white/5">
                    <img
                      src={cert.imageUrl}
                      alt={cert.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}

                <div className="flex items-center gap-2 mb-2">
                  <Award className="w-5 h-5 text-amber-500 shrink-0" />
                  <span className="text-xs font-semibold text-amber-600 dark:text-amber-400">
                    Issued {cert.issueDate}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                  {cert.title}
                </h3>

                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium mb-4">
                  {cert.issuer}
                </p>
              </div>

              {cert.credentialUrl && (
                <a
                  href={cert.credentialUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 text-xs font-semibold text-teal-600 dark:text-teal-400 hover:underline pt-3 border-t border-slate-200/60 dark:border-white/5 transition-colors"
                >
                  <span>Show Credential</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

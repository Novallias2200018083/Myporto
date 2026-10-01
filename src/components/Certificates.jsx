'use client';

import { useState, useEffect } from 'react';
import { 
  Award, 
  ExternalLink, 
  Eye, 
  ShieldCheck, 
  Calendar, 
  Building2, 
  Sparkles, 
  X, 
  CheckCircle, 
  ZoomIn 
} from 'lucide-react';

export default function Certificates({ certificates = [] }) {
  const [selectedCert, setSelectedCert] = useState(null);

  // Close lightbox on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setSelectedCert(null);
    };
    if (selectedCert) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [selectedCert]);

  if (!certificates || certificates.length === 0) return null;

  return (
    <section id="certificates" className="relative py-24 scroll-mt-16 bg-slate-900/20 dark:bg-[#070b14]/50 overflow-hidden">
      {/* Background Ambient Glows */}
      <div className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-amber-500/5 dark:bg-amber-500/10 blur-[130px] rounded-full pointer-events-none -z-10" />
      <div className="absolute bottom-10 right-1/4 w-[500px] h-[350px] bg-teal-500/5 dark:bg-teal-500/10 blur-[120px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-bold uppercase tracking-wider mb-4 border border-amber-500/25 backdrop-blur-md shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
            <span>Honors & Verified Credentials</span>
          </div>
          
          <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-extrabold text-slate-900 dark:text-white tracking-tight mb-4">
            Sertifikasi & Lisensi Profesional
          </h2>
          
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl mx-auto mb-6">
            Bukti kompetensi teknis, lisensi arsitektur sistem, dan penghargaan kepemimpinan yang telah teruji serta terverifikasi resmi.
          </p>

          {/* Quick Counter Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-white/10 text-xs font-semibold text-slate-700 dark:text-slate-300 backdrop-blur-md shadow-sm">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>{certificates.length} Sertifikat Terverifikasi Standar Industri</span>
          </div>
        </div>

        {/* Certificates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
          {certificates.map((cert) => (
            <div
              key={cert.id}
              className="group relative flex flex-col justify-between rounded-3xl bg-white/70 dark:bg-slate-900/70 border border-slate-200/90 dark:border-white/10 backdrop-blur-xl shadow-lg hover:shadow-2xl hover:shadow-amber-500/10 hover:border-amber-500/40 dark:hover:border-amber-400/40 transition-all duration-300 hover:-translate-y-2 overflow-hidden"
            >
              {/* Holographic Top Accent Bar */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-teal-400 to-indigo-500 opacity-60 group-hover:opacity-100 transition-opacity" />

              <div>
                {/* Certificate Thumbnail Area */}
                {cert.imageUrl ? (
                  <div 
                    onClick={() => setSelectedCert(cert)}
                    className="relative w-full h-48 sm:h-52 overflow-hidden bg-slate-950 cursor-pointer group/thumb"
                  >
                    <img
                      src={cert.imageUrl}
                      alt={cert.title}
                      className="w-full h-full object-cover group-hover/thumb:scale-105 transition-transform duration-500"
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent opacity-60 group-hover/thumb:opacity-40 transition-opacity" />

                    {/* Top Watermark Badge */}
                    <div className="absolute top-3 left-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-950/80 backdrop-blur-md border border-white/15 text-[11px] font-bold text-emerald-400 shadow-md">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Verified Credential</span>
                    </div>

                    {/* Hover Zoom-in Icon */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/thumb:opacity-100 transition-opacity bg-slate-950/40 backdrop-blur-xs">
                      <div className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-teal-500 text-slate-950 font-bold text-xs shadow-xl transform scale-90 group-hover/thumb:scale-100 transition-transform">
                        <ZoomIn className="w-4 h-4" />
                        <span>Pratinjau Sertifikat</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="relative w-full h-36 bg-gradient-to-br from-amber-500/10 via-slate-900 to-slate-950 flex items-center justify-center border-b border-slate-200 dark:border-white/5">
                    <Award className="w-12 h-12 text-amber-500/50" />
                  </div>
                )}

                {/* Card Info Content */}
                <div className="p-6">
                  {/* Meta: Issued Date & Year */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                      <Calendar className="w-3.5 h-3.5 text-amber-500" />
                      <span>Diterbitkan: {cert.issueDate}</span>
                    </div>

                    <div className="flex items-center gap-1 text-[11px] font-bold text-teal-600 dark:text-teal-400">
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>Valid</span>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-snug mb-2 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors line-clamp-2">
                    {cert.title}
                  </h3>

                  {/* Issuer Institution */}
                  <div className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-300">
                    <Building2 className="w-3.5 h-3.5 text-teal-500 shrink-0" />
                    <span className="truncate">{cert.issuer}</span>
                  </div>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="px-6 pb-6 pt-3 flex items-center justify-between gap-2 border-t border-slate-200/70 dark:border-white/5">
                {cert.imageUrl ? (
                  <button
                    onClick={() => setSelectedCert(cert)}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-amber-500 dark:hover:text-amber-400 transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Lihat Preview</span>
                  </button>
                ) : (
                  <span />
                )}

                {cert.credentialUrl ? (
                  <a
                    href={cert.credentialUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-500/10 hover:bg-teal-500 text-teal-600 dark:text-teal-400 hover:text-slate-950 text-xs font-bold border border-teal-500/20 transition-all group/btn"
                  >
                    <span>Cek Kredensial</span>
                    <ExternalLink className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
                  </a>
                ) : (
                  <span className="text-[11px] font-medium text-slate-400">Terverifikasi Lembaga</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ----------------- INTERACTIVE LIGHTBOX MODAL ----------------- */}
      {selectedCert && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setSelectedCert(null)}
        >
          <div 
            className="relative w-full max-w-3xl rounded-3xl bg-slate-900 border border-slate-700/80 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <span className="text-sm font-bold text-white">Pratinjau Kredensial Sertifikat</span>
              </div>
              <button
                onClick={() => setSelectedCert(null)}
                className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
                aria-label="Tutup"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Certificate Image */}
            <div className="p-4 sm:p-6 bg-slate-950 flex items-center justify-center max-h-[65vh] overflow-y-auto">
              <img
                src={selectedCert.imageUrl}
                alt={selectedCert.title}
                className="w-full max-h-[60vh] object-contain rounded-xl border border-slate-800 shadow-2xl"
              />
            </div>

            {/* Modal Footer Info */}
            <div className="p-5 sm:p-6 bg-slate-900/90 border-t border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h4 className="text-base sm:text-lg font-bold text-white">
                  {selectedCert.title}
                </h4>
                <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                  <span>{selectedCert.issuer}</span>
                  <span>•</span>
                  <span>Diterbitkan {selectedCert.issueDate}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                {selectedCert.credentialUrl && (
                  <a
                    href={selectedCert.credentialUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-teal-500 text-slate-950 text-xs font-bold shadow-md shadow-teal-500/25 hover:bg-teal-400 transition-all"
                  >
                    <span>Buka URL Verifikasi</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
                <button
                  onClick={() => setSelectedCert(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700 transition-all"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}


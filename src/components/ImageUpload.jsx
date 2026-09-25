'use client';

import { useState } from 'react';
import { UploadCloud, Image as ImageIcon, Loader2, X, CheckCircle } from 'lucide-react';

export default function ImageUpload({ value = '', onChange, label = 'Pilih Foto / Gambar', className = '' }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Ukuran file maksimal 5MB');
      return;
    }

    setUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Gagal mengunggah gambar');
      }

      onChange(data.url);
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
        {label}
      </label>

      {/* Preview Box */}
      {value ? (
        <div className="relative group w-full h-44 rounded-2xl overflow-hidden bg-slate-900 border border-slate-200 dark:border-white/10 shadow-sm flex items-center justify-center">
          <img
            src={value}
            alt="Preview"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
            <label className="cursor-pointer px-3.5 py-2 rounded-xl bg-teal-500 text-slate-950 text-xs font-bold shadow-md hover:bg-teal-400 transition-all flex items-center gap-1.5">
              <UploadCloud className="w-4 h-4" />
              <span>Ganti Foto</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                disabled={uploading}
              />
            </label>
            <button
              type="button"
              onClick={() => onChange('')}
              className="p-2 rounded-xl bg-rose-500 text-white hover:bg-rose-600 transition-all shadow-md"
              title="Hapus foto"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        /* Upload Box */
        <label className="flex flex-col items-center justify-center w-full h-36 px-4 rounded-2xl border-2 border-dashed border-slate-300 dark:border-white/20 hover:border-teal-500 dark:hover:border-teal-400 bg-slate-50 dark:bg-slate-900/60 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-all cursor-pointer group">
          <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center">
            {uploading ? (
              <>
                <Loader2 className="w-8 h-8 text-teal-500 animate-spin mb-2" />
                <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                  Mengunggah foto...
                </p>
              </>
            ) : (
              <>
                <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-600 dark:text-teal-400 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                  <UploadCloud className="w-5 h-5" />
                </div>
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Klik untuk pilih foto dari komputer
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Mendukung PNG, JPG, JPEG, WebP (Maks. 5MB)
                </p>
              </>
            )}
          </div>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            disabled={uploading}
          />
        </label>
      )}

      {error && (
        <p className="text-xs text-rose-500 font-medium">{error}</p>
      )}
    </div>
  );
}

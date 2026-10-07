'use client';

import { useState } from 'react';
import { UploadCloud, Image as ImageIcon, Loader2, X, CheckCircle } from 'lucide-react';

// Client-side image compression helper
function compressImage(file, maxWidth = 1200, maxHeight = 1200, quality = 0.85) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new window.Image();
      img.src = event.target.result;
      img.onload = () => {
        let { width, height } = img;
        if (width > maxWidth || height > maxHeight) {
          if (width > height) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(dataUrl);
      };
      img.onerror = () => reject(new Error('Gagal memproses gambar'));
    };
    reader.onerror = () => reject(new Error('Gagal membaca file'));
  });
}

export default function ImageUpload({ value = '', onChange, label = 'Pilih Foto / Gambar', className = '', compact = false }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate type
    if (!file.type.startsWith('image/')) {
      setError('File harus berupa gambar (JPG, PNG, WebP)');
      return;
    }

    // Validate size (max 10MB input before compression)
    if (file.size > 10 * 1024 * 1024) {
      setError('Ukuran file maksimal 10MB');
      return;
    }

    setUploading(true);
    setError(null);

    try {
      // 1. Kompresi gambar otomatis di sisi browser agar ringan dan cepat
      const compressedDataUrl = await compressImage(file, 1200, 1200, 0.85);

      // 2. Simpan URL terkompresi
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: compressedDataUrl }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Gagal mengunggah gambar');
      }

      onChange(data.url);
    } catch (err) {
      console.error('Upload failed:', err);
      setError(err.message || 'Gagal memproses gambar');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className={`space-y-1.5 ${className}`}>
      {label && (
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
          {label}
        </label>
      )}

      {/* Preview Box */}
      {value ? (
        <div className={`relative group w-full ${compact ? 'h-32 rounded-xl' : 'h-44 rounded-2xl'} overflow-hidden bg-slate-900 border border-slate-200 dark:border-white/10 shadow-sm flex items-center justify-center`}>
          <img
            src={value}
            alt="Preview"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-slate-950/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-2">
            <label className="cursor-pointer px-2.5 py-1.5 rounded-lg bg-teal-500 text-slate-950 text-xs font-bold shadow-md hover:bg-teal-400 transition-all flex items-center gap-1">
              <UploadCloud className="w-3.5 h-3.5" />
              <span>Ganti</span>
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
              className="p-1.5 rounded-lg bg-rose-500 text-white hover:bg-rose-600 transition-all shadow-md"
              title="Hapus foto"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      ) : (
        /* Upload Box */
        <label className={`flex flex-col items-center justify-center w-full ${compact ? 'h-32 rounded-xl p-3' : 'h-36 rounded-2xl px-4 py-5'} border-2 border-dashed border-slate-300 dark:border-white/20 hover:border-teal-500 dark:hover:border-teal-400 bg-slate-50 dark:bg-slate-900/60 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-all cursor-pointer group text-center`}>
          <div className="flex flex-col items-center justify-center">
            {uploading ? (
              <>
                <Loader2 className={`${compact ? 'w-6 h-6' : 'w-8 h-8'} text-teal-500 animate-spin mb-1.5`} />
                <p className="text-[11px] font-semibold text-slate-600 dark:text-slate-300">
                  Mengunggah...
                </p>
              </>
            ) : (
              <>
                <div className={`${compact ? 'w-8 h-8' : 'w-10 h-10'} rounded-lg bg-teal-500/10 border border-teal-500/20 text-teal-600 dark:text-teal-400 flex items-center justify-center mb-1.5 group-hover:scale-110 transition-transform`}>
                  <UploadCloud className={`${compact ? 'w-4 h-4' : 'w-5 h-5'}`} />
                </div>
                <p className={`${compact ? 'text-[11px]' : 'text-xs'} font-bold text-slate-800 dark:text-slate-200`}>
                  {compact ? 'Pilih Foto' : 'Klik untuk pilih foto'}
                </p>
                <p className="text-[10px] text-slate-500 mt-0.5">
                  Maks. 5MB
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
        <p className="text-[11px] text-rose-500 font-medium">{error}</p>
      )}
    </div>
  );
}

'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Briefcase, 
  GraduationCap, 
  Users, 
  Calendar, 
  Sparkles, 
  ChevronLeft, 
  ChevronRight, 
  Play, 
  Pause, 
  MapPin, 
  Building2, 
  Compass, 
  ListOrdered,
  Navigation,
  Flag,
  Crosshair,
  Radio,
  X,
  Footprints,
  Award,
  CheckCircle2,
  ExternalLink,
  Layers,
  Globe,
  Maximize2
} from 'lucide-react';

export default function Experience({ experiences = [] }) {
  const [filter, setFilter] = useState('ALL');
  const [activeIndex, setActiveIndex] = useState(0);
  const [viewMode, setViewMode] = useState('map'); // 'map' | 'timeline'
  const [isPlaying, setIsPlaying] = useState(false);
  const [popupItem, setPopupItem] = useState(null); // Full detail modal
  const mapContainerRef = useRef(null);

  const filtered = useMemo(() => {
    return filter === 'ALL'
      ? experiences
      : experiences.filter((e) => e.type === filter);
  }, [filter, experiences]);

  // Reset active index when filter changes
  useEffect(() => {
    setActiveIndex(0);
  }, [filter]);

  // Autoplay expedition tour
  useEffect(() => {
    if (!isPlaying || filtered.length <= 1 || viewMode !== 'map') return;

    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % filtered.length);
    }, 4500);

    return () => clearInterval(interval);
  }, [isPlaying, filtered.length, viewMode]);

  // Close modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setPopupItem(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const getTypeInfo = (type) => {
    switch (type) {
      case 'WORK':
        return {
          label: 'Pekerjaan',
          icon: Briefcase,
          color: 'text-teal-400',
          bg: 'bg-teal-500/10',
          border: 'border-teal-500/30',
          accentGradient: 'from-teal-500 to-emerald-400',
          glowHex: '#14b8a6',
          badgeStyle: 'bg-teal-500/15 text-teal-600 dark:text-teal-400 border-teal-500/30',
          pinBg: 'bg-teal-500 text-slate-950',
          cardBorder: 'border-teal-400/80 shadow-teal-500/25',
          speechTail: 'border-teal-400'
        };
      case 'EDUCATION':
        return {
          label: 'Edukasi',
          icon: GraduationCap,
          color: 'text-cyan-400',
          bg: 'bg-cyan-500/10',
          border: 'border-cyan-500/30',
          accentGradient: 'from-cyan-500 to-blue-400',
          glowHex: '#06b6d4',
          badgeStyle: 'bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 border-cyan-500/30',
          pinBg: 'bg-cyan-500 text-slate-950',
          cardBorder: 'border-cyan-400/80 shadow-cyan-500/25',
          speechTail: 'border-cyan-400'
        };
      case 'ORGANIZATION':
        return {
          label: 'Organisasi',
          icon: Users,
          color: 'text-indigo-400',
          bg: 'bg-indigo-500/10',
          border: 'border-indigo-500/30',
          accentGradient: 'from-indigo-500 to-purple-400',
          glowHex: '#6366f1',
          badgeStyle: 'bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border-indigo-500/30',
          pinBg: 'bg-indigo-500 text-slate-950',
          cardBorder: 'border-indigo-400/80 shadow-indigo-500/25',
          speechTail: 'border-indigo-400'
        };
      default:
        return {
          label: 'Pengalaman',
          icon: Briefcase,
          color: 'text-teal-400',
          bg: 'bg-teal-500/10',
          border: 'border-teal-500/30',
          accentGradient: 'from-teal-500 to-emerald-400',
          glowHex: '#14b8a6',
          badgeStyle: 'bg-teal-500/15 text-teal-600 dark:text-teal-400 border-teal-500/30',
          pinBg: 'bg-teal-500 text-slate-950',
          cardBorder: 'border-teal-400/80 shadow-teal-500/25',
          speechTail: 'border-teal-400'
        };
    }
  };

  // Generate Adventure Map Trail Coordinates with Ample Headroom for the Character Bubble
  const { waypoints, svgPath, svgPathPassed, totalWidth, totalHeight } = useMemo(() => {
    const count = filtered.length;
    if (count === 0) return { waypoints: [], svgPath: '', svgPathPassed: '', totalWidth: 1000, totalHeight: 460 };

    const width = 1000;
    const itemsPerRow = count <= 4 ? count : count <= 6 ? 3 : 4;
    const numRows = Math.ceil(count / itemsPerRow);
    const rowHeight = 200;
    const paddingX = 140;
    const paddingY = 160; // Generous headroom for the floating speech bubble on top row
    const height = Math.max(480, paddingY * 2 + (numRows - 1) * rowHeight);

    const pts = [];
    for (let i = 0; i < count; i++) {
      const rowIndex = Math.floor(i / itemsPerRow);
      const colIndex = i % itemsPerRow;
      const isReverseRow = rowIndex % 2 === 1;

      const effectiveCols = Math.min(itemsPerRow, count - rowIndex * itemsPerRow);
      const colSpacing = effectiveCols > 1 ? (width - paddingX * 2) / (itemsPerRow - 1) : 0;

      let x;
      if (effectiveCols === 1 && itemsPerRow > 1) {
        x = width / 2;
      } else if (isReverseRow) {
        x = width - paddingX - colIndex * colSpacing;
      } else {
        x = paddingX + colIndex * colSpacing;
      }

      // Terrain organic offset
      const terrainSine = Math.sin((i / (count || 1)) * Math.PI * 2) * 16;
      const y = paddingY + rowIndex * rowHeight + terrainSine;

      pts.push({ x, y, rowIndex, colIndex, isReverseRow });
    }

    // Build smooth Bezier curve trail
    let fullD = '';
    let passedD = '';

    if (pts.length > 0) {
      fullD = `M ${pts[0].x} ${pts[0].y}`;
      passedD = `M ${pts[0].x} ${pts[0].y}`;

      for (let i = 0; i < pts.length - 1; i++) {
        const p1 = pts[i];
        const p2 = pts[i + 1];

        let segmentD = '';
        if (p1.rowIndex === p2.rowIndex) {
          const midX = (p1.x + p2.x) / 2;
          const curveLift = (i % 2 === 0 ? -32 : 32);
          segmentD = ` Q ${midX} ${p1.y + curveLift}, ${p2.x} ${p2.y}`;
        } else {
          const isTurningRight = !p1.isReverseRow;
          const bulge = isTurningRight ? 95 : -95;
          const cp1x = p1.x + bulge;
          const cp1y = p1.y + 30;
          const cp2x = p2.x + bulge;
          const cp2y = p2.y - 30;
          segmentD = ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
        }

        fullD += segmentD;
        if (i < activeIndex) {
          passedD += segmentD;
        }
      }
    }

    return {
      waypoints: pts,
      svgPath: fullD,
      svgPathPassed: passedD,
      totalWidth: width,
      totalHeight: height,
    };
  }, [filtered, activeIndex]);

  const currentItem = filtered[activeIndex] || filtered[0];
  const activePoint = waypoints[activeIndex] || waypoints[0];

  const handlePrev = (e) => {
    if (e) e.stopPropagation();
    const nextIdx = activeIndex > 0 ? activeIndex - 1 : filtered.length - 1;
    setActiveIndex(nextIdx);
    if (popupItem) setPopupItem(filtered[nextIdx]);
  };

  const handleNext = (e) => {
    if (e) e.stopPropagation();
    const nextIdx = activeIndex < filtered.length - 1 ? activeIndex + 1 : 0;
    setActiveIndex(nextIdx);
    if (popupItem) setPopupItem(filtered[nextIdx]);
  };

  const handleSelectWaypoint = (idx) => {
    setActiveIndex(idx);
    setIsPlaying(false);
  };

  return (
    <section id="experience" className="relative py-20 lg:py-28 scroll-mt-16 bg-slate-900/40 dark:bg-[#070b14] overflow-hidden">
      {/* Background Topographic Contour & Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[950px] h-[650px] bg-teal-500/5 dark:bg-teal-500/10 blur-[160px] rounded-full pointer-events-none -z-10" />
      <div className="absolute top-10 right-10 w-96 h-96 bg-cyan-500/5 dark:bg-cyan-500/10 blur-[140px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-500/10 text-teal-600 dark:text-teal-400 text-xs font-bold uppercase tracking-wider mb-4 border border-teal-500/20 backdrop-blur-md">
            <Compass className="w-4 h-4 text-teal-500 animate-spin" style={{ animationDuration: '14s' }} />
            <span>Peta Ekspedisi Karir & Pengalaman</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-extrabold text-slate-900 dark:text-white tracking-tight mb-4">
            Peta Perjalanan & Riwayat Profesional
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Ikuti petualang melintasi stasiun karir. Pop-up dialog interaktif akan langsung muncul di atas karakter pada setiap pos tujuan!
          </p>
        </div>

        {/* Top Controls: Filter Categories & Mode Switcher */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
          {/* Category Filters */}
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
            <button
              onClick={() => setFilter('ALL')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                filter === 'ALL'
                  ? 'bg-teal-500 text-slate-950 font-bold shadow-md shadow-teal-500/25'
                  : 'bg-white/80 dark:bg-slate-900/80 text-slate-700 dark:text-slate-300 hover:text-teal-600 dark:hover:text-white border border-slate-200 dark:border-white/10'
              }`}
            >
              Semua Rute ({experiences.length})
            </button>
            <button
              onClick={() => setFilter('WORK')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                filter === 'WORK'
                  ? 'bg-teal-500 text-slate-950 font-bold shadow-md shadow-teal-500/25'
                  : 'bg-white/80 dark:bg-slate-900/80 text-slate-700 dark:text-slate-300 hover:text-teal-600 dark:hover:text-white border border-slate-200 dark:border-white/10'
              }`}
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span>Pekerjaan</span>
            </button>
            <button
              onClick={() => setFilter('EDUCATION')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                filter === 'EDUCATION'
                  ? 'bg-teal-500 text-slate-950 font-bold shadow-md shadow-teal-500/25'
                  : 'bg-white/80 dark:bg-slate-900/80 text-slate-700 dark:text-slate-300 hover:text-teal-600 dark:hover:text-white border border-slate-200 dark:border-white/10'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Edukasi</span>
            </button>
            <button
              onClick={() => setFilter('ORGANIZATION')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                filter === 'ORGANIZATION'
                  ? 'bg-teal-500 text-slate-950 font-bold shadow-md shadow-teal-500/25'
                  : 'bg-white/80 dark:bg-slate-900/80 text-slate-700 dark:text-slate-300 hover:text-teal-600 dark:hover:text-white border border-slate-200 dark:border-white/10'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Organisasi</span>
            </button>
          </div>

          {/* Switcher & Tour Controls */}
          <div className="flex items-center gap-3">
            <div className="inline-flex items-center p-1 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-white/10 backdrop-blur-md shadow-sm">
              <button
                onClick={() => setViewMode('map')}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  viewMode === 'map'
                    ? 'bg-teal-500 text-slate-950 font-bold shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-teal-600 dark:hover:text-white'
                }`}
              >
                <Compass className="w-3.5 h-3.5" />
                <span>Peta Ekspedisi</span>
              </button>
              <button
                onClick={() => setViewMode('timeline')}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  viewMode === 'timeline'
                    ? 'bg-teal-500 text-slate-950 font-bold shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-teal-600 dark:hover:text-white'
                }`}
              >
                <ListOrdered className="w-3.5 h-3.5" />
                <span>Daftar Riwayat</span>
              </button>
            </div>
          </div>
        </div>

        {/* ------------------- EXPEDITION MAP VIEW WITH FLOATING DIALOG CARD ABOVE THE CHARACTER ------------------- */}
        {viewMode === 'map' && filtered.length > 0 && currentItem && (
          <div className="space-y-6">
            
            {/* BIG MAP CANVAS CONTAINER */}
            <div 
              ref={mapContainerRef}
              className="relative w-full rounded-3xl bg-slate-950/90 dark:bg-[#070d18] border-2 border-slate-800 dark:border-teal-500/25 backdrop-blur-2xl shadow-2xl overflow-hidden select-none"
            >
              {/* Top Map HUD Bar */}
              <div className="absolute top-0 left-0 right-0 z-30 flex items-center justify-between px-4 sm:px-6 py-3.5 border-b border-slate-800 bg-slate-950/85 backdrop-blur-md">
                {/* HUD Coordinates & Status */}
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5 text-[11px] font-mono font-bold text-teal-400 bg-teal-500/10 px-2.5 py-1 rounded-lg border border-teal-500/20">
                    <Radio className="w-3.5 h-3.5 animate-pulse text-teal-400" />
                    <span>RADAR EKSPEDISI AKTIF</span>
                  </div>
                  <div className="hidden sm:flex items-center gap-2 text-[11px] font-mono text-slate-400">
                    <span>POS: 0{activeIndex + 1}/{filtered.length}</span>
                    <span>•</span>
                    <span>PROGRESS: {Math.round(((activeIndex + 1) / filtered.length) * 100)}%</span>
                  </div>
                </div>

                {/* Tour Controller Button */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
                      isPlaying
                        ? 'bg-teal-500/20 text-teal-400 border-teal-500/40 shadow-sm shadow-teal-500/20'
                        : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:text-teal-400'
                    }`}
                  >
                    {isPlaying ? (
                      <>
                        <Pause className="w-3.5 h-3.5 text-teal-400 animate-spin" style={{ animationDuration: '4s' }} />
                        <span>Jelajah Auto</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-3.5 h-3.5 text-teal-400" />
                        <span>Mulai Tur Auto</span>
                      </>
                    )}
                  </button>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={handlePrev}
                      className="p-1.5 rounded-xl bg-slate-800/90 text-slate-300 hover:bg-teal-500 hover:text-slate-950 transition-all border border-slate-700"
                      aria-label="Pos Sebelumnya"
                      title="Pos Sebelumnya"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      onClick={handleNext}
                      className="p-1.5 rounded-xl bg-slate-800/90 text-slate-300 hover:bg-teal-500 hover:text-slate-950 transition-all border border-slate-700"
                      aria-label="Pos Selanjutnya"
                      title="Pos Selanjutnya"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Decorative HUD Compass */}
              <div className="absolute top-16 right-5 z-20 hidden sm:flex flex-col items-center pointer-events-none opacity-50 hover:opacity-100 transition-opacity">
                <div className="relative w-16 h-16 rounded-full border border-teal-500/30 flex items-center justify-center bg-slate-950/50">
                  <Crosshair className="w-10 h-10 text-teal-500/50 animate-spin" style={{ animationDuration: '30s' }} />
                  <span className="absolute top-1 text-[9px] font-mono font-bold text-teal-400">N</span>
                  <span className="absolute bottom-1 text-[9px] font-mono font-bold text-teal-400">S</span>
                  <span className="absolute right-1 text-[9px] font-mono font-bold text-teal-400">E</span>
                  <span className="absolute left-1 text-[9px] font-mono font-bold text-teal-400">W</span>
                </div>
              </div>

              {/* Expedition Legend */}
              <div className="absolute bottom-3 left-4 sm:left-6 z-20 hidden sm:flex items-center gap-3 text-[11px] font-mono text-slate-400 bg-slate-950/80 px-3 py-1.5 rounded-xl border border-slate-800">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-teal-400" />
                  <span>Pekerjaan</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
                  <span>Edukasi</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-indigo-400" />
                  <span>Organisasi</span>
                </div>
                <span className="text-slate-600">|</span>
                <span className="text-teal-400">💡 Klik stasiun manapun untuk berpindah</span>
              </div>

              {/* MAP SVG CANVAS (WINDING TRAIL + ADVENTURE TERRAIN + EXPLORER AVATAR WITH FLOATING SPEECH CARD) */}
              <div className="relative w-full overflow-x-auto no-scrollbar pt-16 pb-12 min-h-[460px] sm:min-h-[520px] flex items-center justify-center">
                <div className="relative w-full max-w-[1000px] px-4 py-4">
                  <svg
                    viewBox={`0 0 ${totalWidth} ${totalHeight}`}
                    className="w-full h-auto overflow-visible select-none"
                    style={{ minWidth: '740px' }}
                  >
                    <defs>
                      {/* Trail Gradients */}
                      <linearGradient id="activeTrailGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#10b981" />
                        <stop offset="50%" stopColor="#2dd4bf" />
                        <stop offset="100%" stopColor="#38bdf8" />
                      </linearGradient>

                      {/* Topographic Contour Pattern */}
                      <pattern id="topoGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                        <circle cx="20" cy="20" r="1" fill="#14b8a6" fillOpacity="0.15" />
                        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#334155" strokeWidth="0.5" strokeOpacity="0.15" />
                      </pattern>

                      {/* Map Island / Terrain Region Gradient */}
                      <radialGradient id="terrainIslandGlow" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="#0f766e" stopOpacity="0.15" />
                        <stop offset="100%" stopColor="#022c22" stopOpacity="0" />
                      </radialGradient>

                      {/* Neon Glow Filter */}
                      <filter id="mapNeonGlow" x="-30%" y="-30%" width="160%" height="160%">
                        <feGaussianBlur stdDeviation="6" result="blur" />
                        <feMerge>
                          <feMergeNode in="blur" />
                          <feMergeNode in="SourceGraphic" />
                        </feMerge>
                      </filter>
                    </defs>

                    {/* Background Terrain Grid */}
                    <rect width={totalWidth} height={totalHeight} fill="url(#topoGrid)" />

                    {/* Stylized Island Terrain Contours */}
                    <ellipse cx={totalWidth * 0.3} cy={totalHeight * 0.35} rx="240" ry="140" fill="url(#terrainIslandGlow)" />
                    <ellipse cx={totalWidth * 0.75} cy={totalHeight * 0.65} rx="260" ry="150" fill="url(#terrainIslandGlow)" />

                    {/* Decorative Elevation Contour Lines */}
                    <path
                      d="M 50 150 Q 280 70, 520 160 T 950 120"
                      fill="none"
                      stroke="#14b8a6"
                      strokeWidth="1.2"
                      strokeOpacity="0.1"
                      strokeDasharray="4 6"
                    />
                    <path
                      d="M 60 340 Q 320 410, 640 310 T 960 380"
                      fill="none"
                      stroke="#06b6d4"
                      strokeWidth="1.2"
                      strokeOpacity="0.1"
                      strokeDasharray="6 8"
                    />

                    {/* 1. Base Trail Bed (Wide Track) */}
                    <path
                      d={svgPath}
                      fill="none"
                      stroke="#0f172a"
                      strokeWidth="24"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      opacity="0.9"
                    />

                    {/* 2. Cobblestone / Dirt Trail Outline */}
                    <path
                      d={svgPath}
                      fill="none"
                      stroke="#1e293b"
                      strokeWidth="16"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />

                    {/* 3. Dotted Road Centerline */}
                    <path
                      d={svgPath}
                      fill="none"
                      stroke="#475569"
                      strokeWidth="3"
                      strokeDasharray="8 8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />

                    {/* 4. Active Traveled Trail (Glowing Neon Line) */}
                    {svgPathPassed && (
                      <path
                        d={svgPathPassed}
                        fill="none"
                        stroke="url(#activeTrailGradient)"
                        strokeWidth="6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        filter="url(#mapNeonGlow)"
                        className="transition-all duration-700"
                      />
                    )}

                    {/* 5. Active Waypoint Beacon Ripple */}
                    {activePoint && (
                      <g transform={`translate(${activePoint.x}, ${activePoint.y})`}>
                        <circle r="42" fill="#14b8a6" fillOpacity="0.15" className="animate-ping" style={{ animationDuration: '2.5s' }} />
                        <circle r="28" fill="#14b8a6" fillOpacity="0.25" />
                        <circle r="18" fill="none" stroke="#2dd4bf" strokeWidth="2" strokeDasharray="3 3" className="animate-spin" style={{ animationDuration: '8s' }} />
                      </g>
                    )}

                    {/* 6. Waypoint Pins Across the Trail */}
                    {waypoints.map((pt, idx) => {
                      const item = filtered[idx];
                      if (!item) return null;
                      const typeInfo = getTypeInfo(item.type);
                      const isActive = idx === activeIndex;
                      const isPassed = idx < activeIndex;
                      const isCurrent = item.period?.toLowerCase().includes('sekarang');

                      return (
                        <g
                          key={item.id || idx}
                          transform={`translate(${pt.x}, ${pt.y})`}
                          className="cursor-pointer group"
                          onClick={() => handleSelectWaypoint(idx)}
                        >
                          {/* Ground Shadow */}
                          <ellipse
                            cx="0"
                            cy="16"
                            rx={isActive ? "20" : "13"}
                            ry="6"
                            fill="#000000"
                            fillOpacity="0.6"
                          />

                          {/* Station Small Flag (Shown for all non-active or as marker base) */}
                          {!isActive && (
                            <foreignObject
                              x="-75"
                              y="-48"
                              width="150"
                              height="40"
                              className="overflow-visible pointer-events-none transition-all duration-300"
                            >
                              <div className="flex flex-col items-center">
                                <div
                                  className={`px-2 py-0.5 rounded-lg text-[9px] font-bold shadow-md whitespace-nowrap transition-all duration-300 border flex items-center gap-1 ${
                                    isPassed
                                      ? 'bg-slate-900/90 text-teal-300 border-teal-500/40 group-hover:scale-105'
                                      : 'bg-slate-900/90 text-slate-300 border-slate-700 group-hover:border-teal-500/50 group-hover:scale-105'
                                  }`}
                                >
                                  <span className="font-mono text-[8px] opacity-75">#{idx + 1}</span>
                                  <span>{item.role.length > 14 ? item.role.slice(0, 14) + '...' : item.role}</span>
                                </div>
                                <div className="w-1.5 h-1.5 rotate-45 -mt-0.5 bg-slate-900 border-r border-b border-slate-700" />
                              </div>
                            </foreignObject>
                          )}

                          {/* Pin Icon Ring */}
                          <circle
                            r={isActive ? "18" : "13"}
                            fill={isActive ? typeInfo.glowHex : isPassed ? "#0f766e" : "#1e293b"}
                            stroke={isActive ? "#ffffff" : isPassed ? "#2dd4bf" : "#475569"}
                            strokeWidth={isActive ? "3" : "2"}
                            className="transition-all duration-300 group-hover:scale-125"
                            filter={isActive ? "url(#mapNeonGlow)" : undefined}
                          />

                          {/* Pin Inner Label */}
                          <text
                            textAnchor="middle"
                            dy="4"
                            fontSize={isActive ? "11" : "9"}
                            fontWeight="bold"
                            fill={isActive ? "#022c22" : isPassed ? "#ccfbf1" : "#94a3b8"}
                            className="font-mono select-none pointer-events-none"
                          >
                            {idx + 1}
                          </text>

                          {/* Completed Waypoint Checkmark */}
                          {isPassed && !isActive && (
                            <circle cx="9" cy="-9" r="4" fill="#10b981" stroke="#ffffff" strokeWidth="1" />
                          )}
                        </g>
                      );
                    })}

                    {/* 7. ANIMATED EXPLORER CHARACTER + DYNAMIC FLOATING SPEECH POPUP CARD */}
                    {activePoint && currentItem && (
                      <g 
                        transform={`translate(${activePoint.x}, ${activePoint.y})`}
                        style={{
                          transition: 'transform 0.75s cubic-bezier(0.34, 1.56, 0.64, 1)'
                        }}
                        className="z-40"
                      >
                        {/* ----------------- DYNAMIC FLOATING POPUP DIALOG CARD (FOLLOWS CHARACTER EVERYWHERE) ----------------- */}
                        {(() => {
                          const typeInfo = getTypeInfo(currentItem.type);
                          const Icon = typeInfo.icon;
                          const isCurrent = currentItem.period?.toLowerCase().includes('sekarang');

                          return (
                            <foreignObject
                              x="-140"
                              y="-215"
                              width="280"
                              height="210"
                              className="overflow-visible"
                            >
                              <div className="flex flex-col items-center animate-in zoom-in-95 duration-300">
                                
                                {/* Rich Adventure Speech Bubble Card */}
                                <div
                                  onClick={() => setPopupItem(currentItem)}
                                  className={`w-[280px] p-3.5 rounded-2xl bg-slate-900/95 dark:bg-[#0b1322]/95 backdrop-blur-xl border-2 ${typeInfo.cardBorder} shadow-2xl space-y-2 cursor-pointer transition-all hover:scale-[1.02]`}
                                >
                                  {/* Card Header: Category Badge + Station ID */}
                                  <div className="flex items-center justify-between gap-1">
                                    <div className="flex items-center gap-1.5">
                                      <span className={`inline-flex items-center gap-1 text-[9px] font-bold px-2 py-0.5 rounded-md border ${typeInfo.badgeStyle}`}>
                                        <Icon className="w-3 h-3" />
                                        <span>{typeInfo.label}</span>
                                      </span>
                                      {isCurrent && (
                                        <span className="flex items-center gap-1 text-[8.5px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                          Aktif
                                        </span>
                                      )}
                                    </div>
                                    <span className="text-[9px] font-mono font-bold text-teal-300 bg-slate-800/80 px-1.5 py-0.5 rounded border border-slate-700">
                                      POS {activeIndex + 1}/{filtered.length}
                                    </span>
                                  </div>

                                  {/* Role Title */}
                                  <div>
                                    <h4 className="text-xs font-black text-white tracking-tight leading-snug line-clamp-1">
                                      {currentItem.role}
                                    </h4>
                                    <div className="flex items-center gap-1 text-[10px] font-bold text-teal-400 truncate mt-0.5">
                                      <Building2 className="w-3 h-3 shrink-0" />
                                      <span className="truncate">{currentItem.institution}</span>
                                    </div>
                                  </div>

                                  {/* Short Mission Log Excerpt */}
                                  <div className="p-2 rounded-xl bg-slate-950/70 border border-white/5">
                                    <p className="text-[9.5px] text-slate-300 line-clamp-2 leading-relaxed text-justify">
                                      {currentItem.description}
                                    </p>
                                  </div>

                                  {/* Micro Action Buttons */}
                                  <div className="flex items-center justify-between gap-1 pt-1 border-t border-slate-800/80">
                                    <button
                                      onClick={(e) => handlePrev(e)}
                                      className="p-1 rounded-lg bg-slate-800 text-slate-300 hover:bg-teal-500 hover:text-slate-950 transition-all text-[9px] font-bold flex items-center gap-0.5"
                                      title="Pos Sebelumnya"
                                    >
                                      <ChevronLeft className="w-3 h-3" />
                                    </button>

                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setPopupItem(currentItem);
                                      }}
                                      className="px-2.5 py-1 rounded-lg bg-teal-500/20 hover:bg-teal-500 text-teal-300 hover:text-slate-950 border border-teal-500/40 text-[9px] font-bold transition-all flex items-center gap-1"
                                    >
                                      <Maximize2 className="w-2.5 h-2.5" />
                                      <span>Buka Detail Penuh</span>
                                    </button>

                                    <button
                                      onClick={(e) => handleNext(e)}
                                      className="p-1 rounded-lg bg-slate-800 text-slate-300 hover:bg-teal-500 hover:text-slate-950 transition-all text-[9px] font-bold flex items-center gap-0.5"
                                      title="Pos Selanjutnya"
                                    >
                                      <ChevronRight className="w-3 h-3" />
                                    </button>
                                  </div>
                                </div>

                                {/* Speech Bubble Tail pointing down to the character */}
                                <div className={`w-3.5 h-3.5 rotate-45 -mt-2 bg-slate-900 border-r-2 border-b-2 ${typeInfo.speechTail} shadow-lg`} />
                              </div>
                            </foreignObject>
                          );
                        })()}

                        {/* ----------------- EXPLORER CHARACTER SVG FIGURE ----------------- */}
                        <g transform="translate(0, -14)" className="cursor-pointer" onClick={() => setPopupItem(currentItem)}>
                          {/* Ground Shadow */}
                          <ellipse cx="0" cy="12" rx="10" ry="4" fill="#000000" fillOpacity="0.7" />

                          {/* Backpack */}
                          <rect x="-13" y="-2" width="7" height="11" rx="2.5" fill="#ca8a04" />
                          
                          {/* Body / Jacket */}
                          <rect x="-8" y="-4" width="16" height="14" rx="4" fill="#0f766e" stroke="#2dd4bf" strokeWidth="1" />
                          
                          {/* Tie / Zipper */}
                          <line x1="0" y1="-4" x2="0" y2="8" stroke="#ffffff" strokeWidth="1.5" />

                          {/* Head & Face */}
                          <circle cx="0" cy="-10" r="7.5" fill="#fed7aa" stroke="#78350f" strokeWidth="0.8" />
                          
                          {/* Glasses */}
                          <rect x="-5.5" y="-12.5" width="4.5" height="3" rx="0.8" fill="#0284c7" fillOpacity="0.7" stroke="#0f172a" strokeWidth="0.7" />
                          <rect x="1" y="-12.5" width="4.5" height="3" rx="0.8" fill="#0284c7" fillOpacity="0.7" stroke="#0f172a" strokeWidth="0.7" />
                          <line x1="-1" y1="-11" x2="1" y2="-11" stroke="#0f172a" strokeWidth="0.7" />

                          {/* Adventurer Explorer Hat */}
                          <ellipse cx="0" cy="-15" rx="10" ry="2.5" fill="#b45309" />
                          <path d="M -6 -15 Q 0 -21, 6 -15 Z" fill="#d97706" />
                          <rect x="-6" y="-16" width="12" height="1.8" fill="#78350f" />

                          {/* Boots */}
                          <rect x="-6" y="8" width="4.5" height="3.5" rx="1.2" fill="#78350f" />
                          <rect x="1.5" y="8" width="4.5" height="3.5" rx="1.2" fill="#78350f" />
                        </g>
                      </g>
                    )}
                  </svg>
                </div>
              </div>
            </div>

            {/* ----------------- SPOTLIGHT MISSION CONSOLE SUMMARY ----------------- */}
            {(() => {
              const typeInfo = getTypeInfo(currentItem.type);
              const Icon = typeInfo.icon;
              const isCurrent = currentItem.period?.toLowerCase().includes('sekarang');

              return (
                <div
                  key={currentItem.id || activeIndex}
                  className="relative p-6 sm:p-8 rounded-3xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl border border-slate-200/80 dark:border-white/10 shadow-xl transition-all duration-500 animate-in fade-in slide-in-from-bottom-3"
                >
                  {/* Glowing Top Accent Line */}
                  <div
                    className={`absolute top-0 left-8 right-8 h-[2px] bg-gradient-to-r ${typeInfo.accentGradient} opacity-90`}
                  />

                  {/* Header Row with Waypoint ID & Category */}
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-lg bg-teal-500/15 text-teal-600 dark:text-teal-400 border border-teal-500/30">
                        POS STASIUN 0{activeIndex + 1} / 0{filtered.length}
                      </span>
                      
                      <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full border ${typeInfo.badgeStyle}`}>
                        <Icon className="w-3.5 h-3.5" />
                        {typeInfo.label}
                      </span>

                      {isCurrent && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          Posisi Terkini
                        </span>
                      )}
                    </div>

                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800/80 text-xs text-slate-600 dark:text-slate-300 font-medium">
                      <Calendar className="w-3.5 h-3.5 text-teal-500" />
                      <span>{currentItem.period}</span>
                    </div>
                  </div>

                  {/* Role Title & Institution */}
                  <div className="mb-4">
                    <h3 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                      {currentItem.role}
                    </h3>
                    <div className="inline-flex items-center gap-2 text-sm sm:text-base font-semibold text-teal-600 dark:text-teal-400 mt-1">
                      <Building2 className="w-4 h-4 opacity-80" />
                      <span>{currentItem.institution}</span>
                    </div>
                  </div>

                  {/* Mission Log Description Box */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-slate-50/80 dark:bg-slate-950/50 border border-slate-200/60 dark:border-white/5 mb-6">
                    <p className="text-justify text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-normal">
                      {currentItem.description}
                    </p>
                  </div>

                  {/* Footer Navigation Bar with Action to Open Full Popup Modal */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-200/70 dark:border-slate-800">
                    {/* Stepper Dots */}
                    <div className="flex items-center gap-1.5 order-2 sm:order-1">
                      {filtered.map((_, dotIdx) => (
                        <button
                          key={dotIdx}
                          onClick={() => {
                            setActiveIndex(dotIdx);
                            setIsPlaying(false);
                          }}
                          className={`h-2 rounded-full transition-all duration-300 ${
                            dotIdx === activeIndex
                              ? 'w-7 bg-teal-500 shadow-sm shadow-teal-500/50'
                              : 'w-2 bg-slate-300 dark:bg-slate-700 hover:bg-teal-400/50'
                          }`}
                          aria-label={`Ke Pos ${dotIdx + 1}`}
                          title={`Pos 0${dotIdx + 1}`}
                        />
                      ))}
                    </div>

                    {/* Actions: Open Popup & Nav Buttons */}
                    <div className="flex items-center gap-2 order-1 sm:order-2 w-full sm:w-auto justify-between sm:justify-end">
                      <button
                        onClick={() => setPopupItem(currentItem)}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400 text-xs sm:text-sm font-bold border border-teal-500/30 hover:bg-teal-500 hover:text-slate-950 transition-all cursor-pointer"
                      >
                        <Sparkles className="w-4 h-4" />
                        <span>Buka Detail Penuh</span>
                      </button>

                      <button
                        onClick={handlePrev}
                        className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 hover:bg-teal-500 hover:text-slate-950 transition-all border border-slate-200 dark:border-slate-700"
                        title="Pos Sebelumnya"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      
                      <button
                        onClick={handleNext}
                        className="p-2 rounded-xl bg-teal-500 text-slate-950 hover:bg-teal-400 transition-all shadow-md shadow-teal-500/20"
                        title="Pos Selanjutnya"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* ------------------- INTERACTIVE POPUP MODAL (FULL MISSION BRIEFING DIALOG) ------------------- */}
        {popupItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
            <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-teal-500/30 shadow-2xl overflow-hidden p-6 sm:p-8 animate-in zoom-in-95 duration-200">
              
              {/* Top Accent Gradient */}
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-teal-400 via-cyan-400 to-indigo-500" />

              {/* Close Button */}
              <button
                onClick={() => setPopupItem(null)}
                className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Modal Content */}
              {(() => {
                const typeInfo = getTypeInfo(popupItem.type);
                const Icon = typeInfo.icon;
                const isCurrent = popupItem.period?.toLowerCase().includes('sekarang');

                return (
                  <div className="space-y-5">
                    {/* Badge & Period Header */}
                    <div className="flex flex-wrap items-center gap-2 pr-10">
                      <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-lg bg-teal-500/15 text-teal-600 dark:text-teal-400 border border-teal-500/30">
                        POS STASIUN 0{activeIndex + 1} / 0{filtered.length}
                      </span>
                      
                      <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full border ${typeInfo.badgeStyle}`}>
                        <Icon className="w-3.5 h-3.5" />
                        {typeInfo.label}
                      </span>

                      {isCurrent && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          Posisi Terkini
                        </span>
                      )}
                    </div>

                    {/* Role Title & Institution */}
                    <div className="space-y-1">
                      <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                        {popupItem.role}
                      </h3>
                      <div className="flex items-center gap-2 text-base font-bold text-teal-600 dark:text-teal-400">
                        <Building2 className="w-4 h-4" />
                        <span>{popupItem.institution}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400 pt-1 font-mono">
                        <Calendar className="w-3.5 h-3.5 text-teal-500" />
                        <span>Periode: {popupItem.period}</span>
                      </div>
                    </div>

                    {/* Detailed Log Narrative */}
                    <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200/80 dark:border-white/10 max-h-60 overflow-y-auto">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-teal-500" />
                        <span>Log Misi & Tanggung Jawab</span>
                      </h4>
                      <p className="text-justify text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-normal">
                        {popupItem.description}
                      </p>
                    </div>

                    {/* Stepper Inside Modal */}
                    <div className="flex items-center justify-between gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                      <button
                        onClick={handlePrev}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-teal-500 hover:text-slate-950 transition-all border border-slate-200 dark:border-slate-700"
                      >
                        <ChevronLeft className="w-4 h-4" />
                        <span>Pos Sebelumnya</span>
                      </button>

                      <button
                        onClick={() => setPopupItem(null)}
                        className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white"
                      >
                        Tutup
                      </button>

                      <button
                        onClick={handleNext}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-500 text-slate-950 text-xs font-bold hover:bg-teal-400 transition-all shadow-md shadow-teal-500/20"
                      >
                        <span>Pos Selanjutnya</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        )}

        {/* ------------------- CLASSIC TIMELINE LIST MODE ------------------- */}
        {viewMode === 'timeline' && filtered.length > 0 && (
          <div className="relative pl-6 sm:pl-8 border-l-2 border-teal-500/40 space-y-8 animate-in fade-in duration-300">
            {filtered.map((item, idx) => {
              const typeInfo = getTypeInfo(item.type);
              const Icon = typeInfo.icon;
              const isCurrent = item.period?.toLowerCase().includes('sekarang');

              return (
                <div key={item.id || idx} className="relative group">
                  {/* Timeline Dot Icon */}
                  <div className="absolute -left-[35px] sm:-left-[43px] top-1.5 w-10 h-10 rounded-full bg-white dark:bg-slate-900 border-2 border-teal-500 flex items-center justify-center text-teal-600 dark:text-teal-400 group-hover:scale-110 group-hover:bg-teal-500 group-hover:text-slate-950 transition-all duration-300 shadow-md">
                    <Icon className="w-4 h-4" />
                  </div>

                  {/* Content Card */}
                  <div 
                    onClick={() => setPopupItem(item)}
                    className="p-6 sm:p-7 rounded-3xl bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200/80 dark:border-white/10 hover:border-teal-500/40 dark:hover:border-teal-400/40 transition-all duration-300 group-hover:-translate-y-0.5 shadow-sm cursor-pointer"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                      <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${typeInfo.badgeStyle}`}>
                        {typeInfo.label}
                      </span>
                      <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-medium">
                        <Calendar className="w-3.5 h-3.5 text-teal-500" />
                        <span>{item.period}</span>
                        {isCurrent && (
                          <span className="ml-1 inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 animate-pulse">
                            Aktif
                          </span>
                        )}
                      </div>
                    </div>

                    <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mt-1">
                      {item.role}
                    </h3>

                    <div className="text-sm font-semibold text-teal-600 dark:text-teal-400 mb-3">
                      {item.institution}
                    </div>

                    <p className="text-justify text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                      {item.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

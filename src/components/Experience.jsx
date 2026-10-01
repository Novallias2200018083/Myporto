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
  Maximize2
} from 'lucide-react';

export default function Experience({ experiences = [] }) {
  const [filter, setFilter] = useState('ALL');
  const [activeIndex, setActiveIndex] = useState(0);
  const [viewMode, setViewMode] = useState('map'); // 'map' | 'timeline'
  const [isPlaying, setIsPlaying] = useState(false);
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

  const getTypeInfo = (type) => {
    switch (type) {
      case 'WORK':
        return {
          label: 'Pengalaman Kerja',
          icon: Briefcase,
          color: 'text-teal-400',
          bg: 'bg-teal-500/10',
          border: 'border-teal-500/30',
          accentGradient: 'from-teal-500 to-emerald-400',
          glowHex: '#14b8a6',
          badgeStyle: 'bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/20',
          pinBorder: 'border-teal-400 shadow-teal-500/30'
        };
      case 'EDUCATION':
        return {
          label: 'Edukasi & Asistensi',
          icon: GraduationCap,
          color: 'text-cyan-400',
          bg: 'bg-cyan-500/10',
          border: 'border-cyan-500/30',
          accentGradient: 'from-cyan-500 to-blue-400',
          glowHex: '#06b6d4',
          badgeStyle: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20',
          pinBorder: 'border-cyan-400 shadow-cyan-500/30'
        };
      case 'ORGANIZATION':
        return {
          label: 'Organisasi & Tim',
          icon: Users,
          color: 'text-indigo-400',
          bg: 'bg-indigo-500/10',
          border: 'border-indigo-500/30',
          accentGradient: 'from-indigo-500 to-purple-400',
          glowHex: '#6366f1',
          badgeStyle: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20',
          pinBorder: 'border-indigo-400 shadow-indigo-500/30'
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
          badgeStyle: 'bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/20',
          pinBorder: 'border-teal-400 shadow-teal-500/30'
        };
    }
  };

  // Generate Winding Serpentine Map Waypoint Coordinates & SVG Path
  const { waypoints, svgPath, svgPathPassed, totalWidth, totalHeight } = useMemo(() => {
    const count = filtered.length;
    if (count === 0) return { waypoints: [], svgPath: '', svgPathPassed: '', totalWidth: 1000, totalHeight: 400 };

    const width = 1000;
    // Items per row: 3 or 4 depending on count
    const itemsPerRow = count <= 4 ? count : count <= 6 ? 3 : 4;
    const numRows = Math.ceil(count / itemsPerRow);
    const rowHeight = 160;
    const paddingX = 120;
    const paddingY = 80;
    const height = Math.max(380, paddingY * 2 + (numRows - 1) * rowHeight);

    const pts = [];
    for (let i = 0; i < count; i++) {
      const rowIndex = Math.floor(i / itemsPerRow);
      const colIndex = i % itemsPerRow;
      const isReverseRow = rowIndex % 2 === 1;

      // Usable width
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

      // Add gentle organic terrain curve offset to y
      const terrainSine = Math.sin((i / (count || 1)) * Math.PI * 2) * 15;
      const y = paddingY + rowIndex * rowHeight + terrainSine;

      pts.push({ x, y, rowIndex, colIndex, isReverseRow });
    }

    // Build smooth Bezier Curve SVG Path
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
          // Same row curve: gentle wave
          const midX = (p1.x + p2.x) / 2;
          const curveLift = (i % 2 === 0 ? -25 : 25);
          segmentD = ` Q ${midX} ${p1.y + curveLift}, ${p2.x} ${p2.y}`;
        } else {
          // U-Turn curve to next row
          const isTurningRight = !p1.isReverseRow;
          const bulge = isTurningRight ? 85 : -85;
          const cp1x = p1.x + bulge;
          const cp1y = p1.y + 20;
          const cp2x = p2.x + bulge;
          const cp2y = p2.y - 20;
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

  const handlePrev = () => {
    setActiveIndex((prev) => (prev > 0 ? prev - 1 : filtered.length - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev < filtered.length - 1 ? prev + 1 : 0));
  };

  return (
    <section id="experience" className="relative py-20 lg:py-28 scroll-mt-16 bg-slate-900/30 dark:bg-[#070b14] overflow-hidden">
      {/* Background Topographic Contour & Radar Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[550px] bg-teal-500/5 dark:bg-teal-500/10 blur-[140px] rounded-full pointer-events-none -z-10" />
      <div className="absolute top-10 right-10 w-96 h-96 bg-cyan-500/5 dark:bg-cyan-500/10 blur-[120px] rounded-full pointer-events-none -z-10" />

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
            Jelajahi setiap stasiun waypoint, milestone pekerjaan, asistensi akademik, dan kepemimpinan dalam peta rute interaktif.
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

        {/* ------------------- EXPEDITION MAP VIEW (LARGE REALISTIC ADVENTURE MAP) ------------------- */}
        {viewMode === 'map' && filtered.length > 0 && currentItem && (
          <div className="space-y-6">
            
            {/* BIG MAP CANVAS CONTAINER */}
            <div 
              ref={mapContainerRef}
              className="relative w-full rounded-3xl bg-slate-950/80 dark:bg-[#090e1a] border border-slate-700/60 dark:border-teal-500/20 backdrop-blur-2xl shadow-2xl overflow-hidden"
            >
              {/* Top Map HUD Bar */}
              <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-5 py-3.5 border-b border-slate-800/80 bg-slate-950/70 backdrop-blur-md">
                {/* HUD Coordinates & Status */}
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5 text-[11px] font-mono font-bold text-teal-400 bg-teal-500/10 px-2.5 py-1 rounded-lg border border-teal-500/20">
                    <Radio className="w-3.5 h-3.5 animate-pulse text-teal-400" />
                    <span>EXPEDITION RADAR ACTIVE</span>
                  </div>
                  <div className="hidden sm:flex items-center gap-2 text-[11px] font-mono text-slate-400">
                    <span>SECTOR: 0{activeIndex + 1}/{filtered.length}</span>
                    <span>•</span>
                    <span>ROUTE: CAREER-TRAIL-v2</span>
                  </div>
                </div>

                {/* Tour Controller Button */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold transition-all border ${
                      isPlaying
                        ? 'bg-teal-500/20 text-teal-400 border-teal-500/40 shadow-sm shadow-teal-500/20'
                        : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:text-teal-400'
                    }`}
                  >
                    {isPlaying ? (
                      <>
                        <Pause className="w-3.5 h-3.5 text-teal-400 animate-spin" style={{ animationDuration: '4s' }} />
                        <span>Scout Berjalan</span>
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
                      aria-label="Waypoint Sebelumnya"
                      title="Waypoint Sebelumnya"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      onClick={handleNext}
                      className="p-1.5 rounded-xl bg-slate-800/90 text-slate-300 hover:bg-teal-500 hover:text-slate-950 transition-all border border-slate-700"
                      aria-label="Waypoint Selanjutnya"
                      title="Waypoint Selanjutnya"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Decorative HUD Compass & Grid in Corner */}
              <div className="absolute top-16 right-5 z-10 hidden sm:flex flex-col items-center pointer-events-none opacity-40 hover:opacity-100 transition-opacity">
                <div className="relative w-16 h-16 rounded-full border border-teal-500/30 flex items-center justify-center">
                  <Crosshair className="w-10 h-10 text-teal-500/50" />
                  <span className="absolute top-1 text-[9px] font-mono font-bold text-teal-400">N</span>
                  <span className="absolute bottom-1 text-[9px] font-mono font-bold text-teal-400">S</span>
                  <span className="absolute right-1 text-[9px] font-mono font-bold text-teal-400">E</span>
                  <span className="absolute left-1 text-[9px] font-mono font-bold text-teal-400">W</span>
                </div>
              </div>

              {/* Start Base & Expedition Flags */}
              <div className="absolute bottom-3 left-5 z-10 hidden sm:flex items-center gap-2 text-[11px] font-mono text-slate-400 bg-slate-900/80 px-3 py-1.5 rounded-xl border border-slate-800">
                <Flag className="w-3.5 h-3.5 text-emerald-400" />
                <span>Base Start: Awal Karir</span>
                <span className="text-slate-600">➔</span>
                <Navigation className="w-3.5 h-3.5 text-teal-400 animate-pulse" />
                <span>Aktif: Stasiun {activeIndex + 1}</span>
              </div>

              {/* MAP SVG CANVAS (WINDING ROAD + TERRAIN + WAYPOINT PINS) */}
              <div className="relative w-full overflow-x-auto no-scrollbar pt-14 pb-8 min-h-[380px] sm:min-h-[440px] flex items-center justify-center">
                <div className="relative w-full max-w-[1000px] px-2 py-4">
                  <svg
                    viewBox={`0 0 ${totalWidth} ${totalHeight}`}
                    className="w-full h-auto overflow-visible select-none"
                    style={{ minWidth: '680px' }}
                  >
                    <defs>
                      {/* Linear Gradients for Real Map Road */}
                      <linearGradient id="mapRoadGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#14b8a6" stopOpacity="0.4" />
                        <stop offset="50%" stopColor="#06b6d4" stopOpacity="0.8" />
                        <stop offset="100%" stopColor="#6366f1" stopOpacity="0.9" />
                      </linearGradient>

                      <linearGradient id="activeTrailGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#10b981" />
                        <stop offset="50%" stopColor="#2dd4bf" />
                        <stop offset="100%" stopColor="#38bdf8" />
                      </linearGradient>

                      {/* Topographic Contour Pattern */}
                      <pattern id="topoGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                        <circle cx="20" cy="20" r="1" fill="#14b8a6" fillOpacity="0.15" />
                        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#334155" strokeWidth="0.5" strokeOpacity="0.2" />
                      </pattern>

                      {/* Glow Filter for Active Pin & Trail */}
                      <filter id="mapNeonGlow" x="-30%" y="-30%" width="160%" height="160%">
                        <feGaussianBlur stdDeviation="5" result="blur" />
                        <feMerge>
                          <feMergeNode in="blur" />
                          <feMergeNode in="SourceGraphic" />
                        </feMerge>
                      </filter>
                    </defs>

                    {/* Background Terrain Grid */}
                    <rect width={totalWidth} height={totalHeight} fill="url(#topoGrid)" />

                    {/* Decorative Topographic Elevation Contours */}
                    <path
                      d={`M 0 100 Q 250 50, 500 120 T 1000 80`}
                      fill="none"
                      stroke="#14b8a6"
                      strokeWidth="1"
                      strokeOpacity="0.08"
                      strokeDasharray="4 6"
                    />
                    <path
                      d={`M 0 260 Q 300 320, 600 240 T 1000 300`}
                      fill="none"
                      stroke="#06b6d4"
                      strokeWidth="1"
                      strokeOpacity="0.08"
                      strokeDasharray="6 8"
                    />

                    {/* 1. Base Ground Road Track (Outer Wide Trail) */}
                    <path
                      d={svgPath}
                      fill="none"
                      stroke="#1e293b"
                      strokeWidth="18"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      opacity="0.8"
                    />

                    {/* 2. Dotted Middle Trail Road */}
                    <path
                      d={svgPath}
                      fill="none"
                      stroke="#334155"
                      strokeWidth="6"
                      strokeDasharray="8 8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />

                    {/* 3. Glowing Active Trail Path (Animated Neon Route) */}
                    {svgPathPassed && (
                      <path
                        d={svgPathPassed}
                        fill="none"
                        stroke="url(#activeTrailGradient)"
                        strokeWidth="5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        filter="url(#mapNeonGlow)"
                        className="transition-all duration-700"
                      />
                    )}

                    {/* 4. Active Waypoint Beacon Ripple on Map */}
                    {activePoint && (
                      <g transform={`translate(${activePoint.x}, ${activePoint.y})`}>
                        <circle r="36" fill="#14b8a6" fillOpacity="0.15" className="animate-ping" style={{ animationDuration: '2.5s' }} />
                        <circle r="26" fill="#14b8a6" fillOpacity="0.25" />
                        <circle r="16" fill="none" stroke="#2dd4bf" strokeWidth="2" strokeDasharray="3 3" className="animate-spin" style={{ animationDuration: '8s' }} />
                      </g>
                    )}

                    {/* 5. Render Waypoint Pins across Map */}
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
                          onClick={() => {
                            setActiveIndex(idx);
                            setIsPlaying(false);
                          }}
                        >
                          {/* Pin Drop Shadow & Ground Halo */}
                          <ellipse
                            cx="0"
                            cy="18"
                            rx={isActive ? "18" : "12"}
                            ry="6"
                            fill="#000000"
                            fillOpacity="0.5"
                          />

                          {/* Waypoint Flag Badge Banner (Hover & Active) */}
                          <foreignObject
                            x="-85"
                            y={isActive ? "-72" : "-58"}
                            width="170"
                            height="50"
                            className="overflow-visible pointer-events-none transition-all duration-300"
                          >
                            <div className="flex flex-col items-center">
                              <div
                                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold shadow-lg whitespace-nowrap transition-all duration-300 border ${
                                  isActive
                                    ? 'bg-teal-500 text-slate-950 border-teal-300 scale-110 shadow-teal-500/40'
                                    : 'bg-slate-900/90 text-slate-300 border-slate-700/80 group-hover:border-teal-500/50 group-hover:scale-105'
                                }`}
                              >
                                <span className="font-mono text-[9px] opacity-75 mr-1">WP-0{idx + 1}:</span>
                                <span>{item.role.length > 18 ? item.role.slice(0, 18) + '...' : item.role}</span>
                              </div>
                              {/* Pointer Arrow */}
                              <div
                                className={`w-1.5 h-1.5 rotate-45 -mt-1 ${
                                  isActive ? 'bg-teal-500' : 'bg-slate-900 border-r border-b border-slate-700'
                                }`}
                              />
                            </div>
                          </foreignObject>

                          {/* Waypoint Marker Pin Icon */}
                          <circle
                            r={isActive ? "20" : "15"}
                            fill={isActive ? "#14b8a6" : isPassed ? "#0f766e" : "#1e293b"}
                            stroke={isActive ? "#ffffff" : isPassed ? "#2dd4bf" : "#475569"}
                            strokeWidth={isActive ? "3" : "2"}
                            className="transition-all duration-300 group-hover:scale-110"
                            filter={isActive ? "url(#mapNeonGlow)" : undefined}
                          />

                          {/* Pin Inner Number / Icon Marker */}
                          <text
                            textAnchor="middle"
                            dy="4.5"
                            fontSize={isActive ? "11" : "9"}
                            fontWeight="bold"
                            fill={isActive ? "#022c22" : isPassed ? "#ccfbf1" : "#94a3b8"}
                            className="font-mono select-none pointer-events-none"
                          >
                            {idx + 1}
                          </text>

                          {/* Active Pulsing Indicator for 'Sekarang' */}
                          {isCurrent && (
                            <circle
                              cx="12"
                              cy="-12"
                              r="4.5"
                              fill="#10b981"
                              stroke="#ffffff"
                              strokeWidth="1.5"
                              className="animate-pulse"
                            />
                          )}
                        </g>
                      );
                    })}
                  </svg>
                </div>
              </div>
            </div>

            {/* ----------------- SPOTLIGHT MISSION CONSOLE CARD ----------------- */}
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
                        WAYPOINT 0{activeIndex + 1} / 0{filtered.length}
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

                  {/* Footer Navigation Bar with Waypoint Stepper Dots */}
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
                          aria-label={`Ke Waypoint ${dotIdx + 1}`}
                          title={`Waypoint 0${dotIdx + 1}`}
                        />
                      ))}
                    </div>

                    {/* Prev / Next Mission Buttons */}
                    <div className="flex items-center gap-2 order-1 sm:order-2 w-full sm:w-auto justify-between sm:justify-end">
                      <button
                        onClick={handlePrev}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 text-xs sm:text-sm font-semibold hover:bg-teal-500 hover:text-slate-950 transition-all border border-slate-200 dark:border-slate-700"
                      >
                        <ChevronLeft className="w-4 h-4" />
                        <span>Waypoint Sebelumnya</span>
                      </button>
                      <button
                        onClick={handleNext}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-500 text-slate-950 text-xs sm:text-sm font-bold shadow-md shadow-teal-500/20 hover:bg-teal-400 transition-all"
                      >
                        <span>Waypoint Selanjutnya</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* ------------------- CLASSIC LIST MODE ------------------- */}
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
                  <div className="p-6 sm:p-7 rounded-3xl bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200/80 dark:border-white/10 hover:border-teal-500/40 dark:hover:border-teal-400/40 transition-all duration-300 group-hover:-translate-y-0.5 shadow-sm">
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


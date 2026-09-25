'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function HeroCardCarousel({ user }) {
  // Parse 3 photos safely from user.avatarUrl (supports single string URL or JSON array of 3 URLs)
  let photoList = [];
  try {
    if (user?.avatarUrl && user.avatarUrl.startsWith('[')) {
      photoList = JSON.parse(user.avatarUrl);
    } else if (user?.avatarUrl) {
      photoList = [user.avatarUrl];
    }
  } catch (e) {
    photoList = [user?.avatarUrl || ''];
  }

  const defaultPhotos = [
    photoList[0] || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
    photoList[1] || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
    photoList[2] || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80',
  ];

  const cardsData = [
    {
      id: 0,
      image: defaultPhotos[0],
      title: user?.name || 'Noval Lias Ramadani',
      role: 'Fullstack Developer',
    },
    {
      id: 1,
      image: defaultPhotos[1],
      title: user?.name || 'Noval Lias Ramadani',
      role: 'Project Manager & System Analyst',
    },
    {
      id: 2,
      image: defaultPhotos[2],
      title: user?.name || 'Noval Lias Ramadani',
      role: 'IT Enthusiast',
    },
  ];

  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Auto-rotate every 4 seconds when not hovered
  useEffect(() => {
    if (isHovered) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % cardsData.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [isHovered, cardsData.length]);

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % cardsData.length);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + cardsData.length) % cardsData.length);
  };

  return (
    <div
      className="relative w-full max-w-[360px] sm:max-w-[380px] mx-auto flex flex-col items-center"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Outer Ambient Glow Aura */}
      <div className="absolute -inset-6 bg-gradient-to-tr from-teal-500/25 via-cyan-500/15 to-indigo-500/20 rounded-[40px] filter blur-3xl pointer-events-none opacity-80" />

      {/* 3D Stacked Carousel Cards Deck */}
      <div className="relative w-full h-[470px] sm:h-[500px] flex items-center justify-center cursor-pointer select-none">
        {cardsData.map((card, idx) => {
          const offset = (idx - activeIndex + cardsData.length) % cardsData.length;

          let transformStyle = '';
          let zIndex = 10;
          let opacity = 1;
          let filter = 'none';

          if (offset === 0) {
            // Front Card
            transformStyle = 'translate3d(0, 0, 0) rotate(0deg) scale(1)';
            zIndex = 30;
            opacity = 1;
          } else if (offset === 1) {
            // Right Stack Card (Tilt 6 deg)
            transformStyle = 'translate3d(32px, -12px, 0) rotate(6deg) scale(0.93)';
            zIndex = 20;
            opacity = 0.85;
            filter = 'brightness(0.9)';
          } else {
            // Left Stack Card (Tilt -6 deg)
            transformStyle = 'translate3d(-32px, -22px, 0) rotate(-6deg) scale(0.86)';
            zIndex = 10;
            opacity = 0.7;
            filter = 'brightness(0.8)';
          }

          return (
            <div
              key={card.id}
              onClick={() => setActiveIndex(idx)}
              style={{
                transform: transformStyle,
                zIndex: zIndex,
                opacity: opacity,
                filter: filter,
              }}
              className="absolute w-[88%] sm:w-[90%] h-[420px] sm:h-[450px] rounded-[30px] overflow-hidden bg-slate-950 border border-white/20 dark:border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.6)] ring-1 ring-teal-500/20 transition-all duration-500 ease-out hover:shadow-teal-500/25 group cursor-pointer"
            >
              <div className="relative w-full h-full bg-slate-950 overflow-hidden">
                <img
                  src={card.image}
                  alt={card.title}
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700"
                />

                {/* Seamless Smooth Dark Gradient at Bottom */}
                <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent pointer-events-none" />

                {/* Bottom Overlay Info */}
                <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6 space-y-2 pointer-events-none z-10">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-extrabold text-lg sm:text-xl text-white tracking-tight leading-snug drop-shadow-md">
                      {card.title}
                    </h3>
                    <div className="px-2.5 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-[11px] font-mono text-teal-300 font-semibold shrink-0 shadow-sm">
                      0{idx + 1} / 03
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-0.5">
                    <span className="w-2 h-2 rounded-full bg-teal-400 shadow-[0_0_10px_rgba(45,212,191,1)] shrink-0 animate-pulse" />
                    <p className="text-xs sm:text-sm font-semibold text-teal-300 tracking-wide drop-shadow">
                      {card.role}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Minimalist Glass Carousel Controls Bar */}
      <div className="flex items-center justify-between w-full px-4 mt-2">
        <button
          onClick={handlePrev}
          aria-label="Previous photo"
          className="p-2.5 rounded-2xl bg-white dark:bg-slate-900/90 hover:bg-teal-500 hover:text-slate-950 dark:hover:bg-teal-500 dark:hover:text-slate-950 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-white/10 transition-all shadow-md active:scale-90"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200 dark:border-white/10 shadow-sm">
          {cardsData.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className={`transition-all duration-300 rounded-full ${
                activeIndex === i
                  ? 'w-7 h-2 bg-teal-500 dark:bg-teal-400 shadow-md shadow-teal-500/50'
                  : 'w-2 h-2 bg-slate-300 dark:bg-slate-700 hover:bg-teal-400'
              }`}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>

        <button
          onClick={handleNext}
          aria-label="Next photo"
          className="p-2.5 rounded-2xl bg-white dark:bg-slate-900/90 hover:bg-teal-500 hover:text-slate-950 dark:hover:bg-teal-500 dark:hover:text-slate-950 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-white/10 transition-all shadow-md active:scale-90"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

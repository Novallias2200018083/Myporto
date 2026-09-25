'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ThemeToggle from './ThemeToggle';
import { Menu, X, Shield, Send } from 'lucide-react';

export default function Navbar({ user }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'About', href: '#about' },
    { name: 'Skills', href: '#skills' },
    { name: 'Projects', href: '#projects' },
    { name: 'Experience', href: '#experience' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'glass-nav shadow-lg py-3' : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo - Rata Kiri */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-500 to-cyan-400 flex items-center justify-center text-slate-950 font-bold text-lg shadow-md shadow-teal-500/20 group-hover:scale-105 transition-transform duration-300">
            <span>{user?.name ? user.name.charAt(0) : 'A'}</span>
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-lg tracking-tight text-slate-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
              {user?.name || 'Portfolio'}
            </span>
            <span className="text-xs text-teal-600 dark:text-teal-400 font-medium">
              Fullstack Developer
            </span>
          </div>
        </Link>

        {/* Desktop Navigation - Tengah */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-100/90 dark:bg-slate-900/60 px-5 py-2 rounded-full border border-slate-200/80 dark:border-white/10 backdrop-blur-md shadow-sm">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="px-4 py-1.5 text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-teal-600 dark:hover:text-white rounded-full hover:bg-slate-200/70 dark:hover:bg-white/5 transition-all duration-200"
            >
              {link.name}
            </a>
          ))}
        </nav>

        {/* Right CTA Actions - Rata Kanan */}
        <div className="hidden md:flex items-center gap-3">
          <ThemeToggle />

          <Link
            href="/admin/login"
            title="Admin CMS Portal"
            className="p-2.5 rounded-xl text-slate-600 dark:text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 bg-slate-100 dark:bg-slate-800/50 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-white/10 transition-all duration-200"
          >
            <Shield className="w-4 h-4" />
          </Link>

          <a
            href="#contact"
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-sm text-slate-950 bg-teal-400 hover:bg-teal-300 shadow-md shadow-teal-500/20 hover:shadow-teal-500/40 hover:-translate-y-0.5 transition-all duration-300"
          >
            <span>Let's Talk</span>
            <Send className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden items-center gap-2">
          <ThemeToggle />
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-white/10"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden glass-nav mt-3 mx-4 p-5 rounded-2xl border border-slate-200 dark:border-white/10 shadow-2xl animate-in slide-in-from-top-4 duration-300">
          <nav className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-2.5 text-base font-medium text-slate-800 dark:text-slate-200 hover:text-teal-600 dark:hover:text-teal-400 hover:bg-slate-100 dark:hover:bg-white/5 rounded-xl transition-all"
              >
                {link.name}
              </a>
            ))}
            <hr className="border-slate-200 dark:border-white/10 my-2" />
            <div className="flex items-center justify-between pt-2">
              <Link
                href="/admin/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 px-3 py-2 rounded-lg"
              >
                <Shield className="w-4 h-4" />
                <span>Admin CMS</span>
              </Link>
              <a
                href="#contact"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-slate-950 bg-teal-400 hover:bg-teal-300"
              >
                <span>Let's Talk</span>
                <Send className="w-3.5 h-3.5" />
              </a>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

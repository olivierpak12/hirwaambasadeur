'use client';

import Link from 'next/link';
import { useState } from 'react';
import CategoryFilter from '../home/CategoryFilter';

const NAV_LINKS = ['Politics', 'Business', 'Technology', 'Sports', 'Africa'];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <header className="w-full sticky top-0 z-50 shadow-md">
      {/* Red primary nav */}
      <div className="bg-[#bb1919]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">

            {/* Logo */}
            <Link
              href="/"
              className="flex items-center gap-2.5 pr-4 border-r border-white/20 shrink-0"
            >
              <div className="w-9 h-9 bg-white/15 rounded-sm flex items-center justify-center">
                <span className="text-white font-black text-sm font-serif tracking-tight">HA</span>
              </div>
              <div className="hidden sm:block">
                <p className="text-white font-black text-[15px] leading-none font-serif">
                  Hirwa Ambassadeur
                </p>
                <p className="text-white/60 text-[9px] uppercase tracking-[0.15em] mt-0.5">
                  Breaking News & Analysis
                </p>
              </div>
            </Link>

            {/* Desktop nav links */}
            <nav className="hidden md:flex items-center flex-1 px-4">
              {NAV_LINKS.map((cat) => (
                <Link
                  key={cat}
                  href={`/categories/${cat.toLowerCase()}`}
                  className="text-white/85 text-[13px] font-semibold px-3.5 py-1.5 rounded-sm
                             hover:text-white hover:bg-white/15 transition-all duration-150"
                >
                  {cat}
                </Link>
              ))}
            </nav>

            {/* Right side: search + date + hamburger */}
            <div className="flex items-center gap-2">
              {/* Search link */}
              <Link
                href="/search"
                aria-label="Search"
                className="text-white/80 hover:text-white hover:bg-white/15 p-2 rounded-sm transition-all duration-150"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607z" />
                </svg>
              </Link>

              {/* Date — desktop only */}
              <span className="hidden lg:block text-white/50 text-[11px] border-l border-white/20 pl-3">
                {today}
              </span>

              {/* Hamburger — mobile only */}
              <button
                aria-label="Toggle menu"
                onClick={() => setMenuOpen((o) => !o)}
                className="md:hidden text-white/80 hover:text-white hover:bg-white/15 p-2 rounded-sm transition-all duration-150"
              >
                {menuOpen ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile dropdown menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-white/20 bg-[#a51616]">
            <div className="max-w-7xl mx-auto px-4 py-2 flex flex-col">
              {NAV_LINKS.map((cat) => (
                <Link
                  key={cat}
                  href={`/categories/${cat.toLowerCase()}`}
                  onClick={() => setMenuOpen(false)}
                  className="text-white/90 text-[14px] font-semibold py-2.5 px-2 border-b border-white/10
                             last:border-0 hover:text-white hover:bg-white/10 rounded-sm transition-all duration-150"
                >
                  {cat}
                </Link>
              ))}
              <p className="text-white/40 text-[11px] py-2 px-2">{today}</p>
            </div>
          </div>
        )}
      </div>

      <CategoryFilter />
    </header>
  );
}
'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function Header() {
 const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
 const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

 useEffect(() => {
 const adminAuthorized = typeof window !== 'undefined' && sessionStorage.getItem('adminAuthorized') === 'true';
 setIsAdminLoggedIn(adminAuthorized);

 const handleStorageChange = () => {
 const authorized = sessionStorage.getItem('adminAuthorized') === 'true';
 setIsAdminLoggedIn(authorized);
 };

 window.addEventListener('storage', handleStorageChange);
 return () => window.removeEventListener('storage', handleStorageChange);
 }, []);

 return (
 <header className="bg-whit e text-black sticky top-0 z-50 shadow-lg">
 <div className="bg-gra y-100 px-4 py-2 text-center text-xs text-gray-600">
 Advertisement Space - Google AdSense Banner
 </div>

 <div className="containe r mx-auto px-4 py-4">
 <div className="fle x items-center justify-between">
 <Link href = "/" className="fle x items-center gap-2">
 <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center font-bold text-lg text-white">
 HA
 </div>
 <span className="text-x l font-bold hidden sm:inline">Hirwa Amb as sadeur</span>
 <span className="text-l g font-bold sm:hidden">HA News</span>
 </Link>

 <button
 className="m d:hidden p-2"
 onClick={ () => setMobileMenuOpen(!mobileMenuOpen) }
 >
 <svg className="w-6 h-6" fill = "none" stroke = "currentColor" viewBox = "0 0 24 24">
 <path strokeLinecap = "round" strokeLinejoin = "round" strokeWidth = {2} d = "M4 6h16M4 12h16M4 18h16" />
 </svg>
 </button>

 <nav className="hidde n md:flex gap-6">
 <Link href = "/" className="text-gra y-700 hover:text-gray-900 hover:border-b-2 hover:border-gray-900 transition pb-1">Home</Link>
 <Link href = "/categories/politics" className="text-gra y-700 hover:text-gray-900 hover:border-b-2 hover:border-gray-900 transition pb-1">Politics</Link>
 <Link href = "/categories/business" className="text-gra y-700 hover:text-gray-900 hover:border-b-2 hover:border-gray-900 transition pb-1">Business</Link>
 <Link href = "/categories/technology" className="text-gra y-700 hover:text-gray-900 hover:border-b-2 hover:border-gray-900 transition pb-1">Tech</Link>
 <Link href = "/search" className="text-gra y-700 hover:text-gray-900 hover:border-b-2 hover:border-gray-900 transition pb-1">Search</Link>
 </nav>

 {isAdminLoggedIn && (
 <div className="hidde n md:flex gap-3">
 <Link href = "/request-permission" className="bg-gra y-700 hover:bg-gray-800 text-white px-4 py-2 rounded transition">
 Write for Us
 </Link>
 <Link href = "/submit" className="bg-gra y-800 hover:bg-gray-900 text-white px-4 py-2 rounded transition">
 Submit News
 </Link>
 </div>
 )}
 </div>

 {mobileMenuOpen && (
 <nav className="m d:hidden mt-4 py-4 border-t border-gray-300 flex flex-col gap-3">
 <Link href = "/" className="text-gra y-700 hover:text-gray-900 transition">Home</Link>
 <Link href = "/categories/politics" className="text-gra y-700 hover:text-gray-900 transition">Politics</Link>
 <Link href = "/categories/business" className="text-gra y-700 hover:text-gray-900 transition">Business</Link>
 <Link href = "/categories/technology" className="text-gra y-700 hover:text-gray-900 transition">Technology</Link>
 <Link href = "/categories/health" className="text-gra y-700 hover:text-gray-900 transition">Health</Link>
 <Link href = "/categories/sports" className="text-gra y-700 hover:text-gray-900 transition">Sports</Link>
 <Link href = "/search" className="text-gra y-700 hover:text-gray-900 transition">Search</Link>
 {isAdminLoggedIn && (
 <>
 <Link href = "/request-permission" className="bg-gra y-700 hover:bg-gray-800 text-white px-4 py-2 rounded transition inline-block text-center">
 Write for Us
 </Link>
 <Link href = "/submit" className="bg-gra y-800 hover:bg-gray-900 text-white px-4 py-2 rounded transition inline-block text-center">
 Submit News
 </Link>
 </>
 )}
 </nav>
 )}
 </div>

 <div className="bg-gra y-200 border-t border-gray-300">
 <div className="containe r mx-auto px-4 py-2 overflow-x-auto">
 <div className="fle x gap-4 text-sm md:text-b as e whitespace-nowrap text-gray-700">
 <Link href = "/categories/africa" className="hove r:text-gray-900 transition">Africa News</Link>
 <Link href = "/categories/world" className="hove r:text-gray-900 transition">World</Link>
 <Link href = "/categories/entertainment" className="hove r:text-gray-900 transition">Entertainment</Link>
 <Link href = "/categories/health" className="hove r:text-gray-900 transition">Health</Link>
 <Link href = "/categories/sports" className="hove r:text-gray-900 transition">Sports</Link>
 </div>
 </div>
 </div>
 </header>
 );
}













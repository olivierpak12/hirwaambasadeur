import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-950 text-gray-400 py-6 px-4">
      <div className="max-w-4xl mx-auto flex flex-col items-center gap-4">

        {/* Brand */}
        <p className="text-white font-bold text-sm tracking-wide">Hirwa Ambassadeur</p>

        {/* Categories */}
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 text-xs">
          {[
            ['Politics', '/categories/politics'],
            ['Business', '/categories/business'],
            ['Technology', '/categories/technology'],
            ['Health', '/categories/health'],
            ['Sports', '/categories/sports'],
            ['Africa News', '/categories/africa'],
          ].map(([label, href]) => (
            <Link key={href} href={href} className="hover:text-white transition-colors duration-200">
              {label}
            </Link>
          ))}
        </div>

        {/* Social Links */}
        <div className="flex gap-5 text-xs">
          {[
            ['Facebook', 'https://facebook.com'],
            ['Twitter', 'https://twitter.com'],
            ['Instagram', 'https://instagram.com'],
            ['YouTube', 'https://youtube.com'],
          ].map(([label, href]) => (
            <a
              key={href}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors duration-200"
            >
              {label}
            </a>
          ))}
        </div>

        {/* Copyright */}
        <p className="text-xs text-gray-600">&copy; 2026 Hirwa Ambassadeur. All rights reserved.</p>
      </div>
    </footer>
  );
}
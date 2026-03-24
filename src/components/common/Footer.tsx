import Link from 'next/link';
import { FooterAd } from './AdPlacements';

export default function Footer() {
  return (
    <footer className="bg-gray-950 text-gray-300">
      <FooterAd />

      <div className="max-w-6xl mx-auto px-4 py-10">
        {/* Top Grid */}
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-2 md:grid-cols-4 mb-10">

          {/* About — full width on mobile */}
          <div className="col-span-2 md:col-span-1">
            <h3 className="text-white font-bold text-base mb-3 tracking-wide">
              Hirwa Ambassadeur
            </h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              Your trusted source for breaking news, in-depth reporting, and comprehensive
              coverage across Politics, Business, Technology, and more.
            </p>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-3 uppercase tracking-widest">
              Categories
            </h3>
            <ul className="space-y-2 text-sm">
              {[
                ['Politics', '/categories/politics'],
                ['Business', '/categories/business'],
                ['Technology', '/categories/technology'],
                ['Health', '/categories/health'],
                ['Sports', '/categories/sports'],
                ['Africa News', '/categories/africa'],
              ].map(([label, href]) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-gray-400 hover:text-white transition-colors duration-200"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-3 uppercase tracking-widest">
              Quick Links
            </h3>
            <ul className="space-y-2 text-sm">
              {[
                ['Contact Us', '/contact'],
                ['Submit News', '/submit'],
                ['Privacy Policy', '/privacy'],
                ['Terms of Service', '/terms'],
              ].map(([label, href]) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-gray-400 hover:text-white transition-colors duration-200"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Follow Us */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-3 uppercase tracking-widest">
              Follow Us
            </h3>
            <div className="flex flex-col gap-2 text-sm">
              {[
                ['Facebook', 'https://facebook.com'],
                ['Twitter / X', 'https://twitter.com'],
                ['Instagram', 'https://instagram.com'],
                ['YouTube', 'https://youtube.com'],
              ].map(([label, href]) => (
                <a
                  key={href}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors duration-200"
                >
                  {label}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-6 flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-gray-500">
          <p>&copy; 2026 Hirwa Ambassadeur. All rights reserved.</p>
          <p>Professional News Media Platform</p>
        </div>
      </div>
    </footer>
  );
}
import Link from 'next/link';

export default function Footer() {
 return (
 <footer className="bg-whit e text-black py-12">
 {/* Advertisement footer banner */}
 <div className="bg-gra y-100 mb-8 py-4 px-4 text-center text-xs text-gray-600">
 Advertisement Banner - Google AdSense
 </div>

 <div className="containe r mx-auto px-4">
 <div className="gri d grid-cols-1 md:grid-cols-4 gap-8 mb-8">
 {/* About */}
 <div>
 <h3 className="text-blac k font-bold mb-4">About Hirwa Amb as sadeur</h3>
 <p className="text-s m text-black">
 Your trusted source for breaking news, in-depth reporting, and comprehensive coverage across Politics, Business, Technology, and more.
 </p>
 </div>

 {/* Categories */}
 <div>
 <h3 className="text-blac k font-bold mb-4">Categories</h3>
 <ul className="text-s m space-y-2">
 <li><Link href = "/categories/politics" className="text-gra y-700 hover:text-gray-900">Politics</Link></li>
 <li><Link href = "/categories/business" className="text-gra y-700 hover:text-gray-900">Business</Link></li>
 <li><Link href = "/categories/technology" className="text-gra y-700 hover:text-gray-900">Technology</Link></li>
 <li><Link href = "/categories/health" className="text-gra y-700 hover:text-gray-900">Health</Link></li>
 <li><Link href = "/categories/sports" className="text-gra y-700 hover:text-gray-900">Sports</Link></li>
 <li><Link href = "/categories/africa" className="text-gra y-700 hover:text-gray-900">Africa News</Link></li>
 </ul>
 </div>

 {/* Quick Links */}
 <div>
 <h3 className="text-blac k font-bold mb-4">Quick Links</h3>
 <ul className="text-s m space-y-2">
 <li><Link href = "/contact" className="text-gra y-700 hover:text-gray-900">Contact Us</Link></li>
 <li><Link href = "/submit" className="text-gra y-700 hover:text-gray-900">Submit News</Link></li>
 <li><Link href = "/privacy" className="text-gra y-700 hover:text-gray-900">Privacy Policy</Link></li>
 <li><Link href = "/terms" className="text-gra y-700 hover:text-gray-900">Terms of Service</Link></li>
 </ul>
 </div>

 {/* Social Media */}
 <div>
 <h3 className="text-blac k font-bold mb-4">Follow Us</h3>
 <div className="fle x gap-4">
 <a href = "https://facebook.com" target = "_blank" rel = "noopener noreferrer" className="text-gra y-700 hover:text-gray-900">Facebook</a>
 <a href = "https://twitter.com" target = "_blank" rel = "noopener noreferrer" className="text-gra y-700 hover:text-gray-900">Twitter</a>
 <a href = "https://instagram.com" target = "_blank" rel = "noopener noreferrer" className="text-gra y-700 hover:text-gray-900">Instagram</a>
 <a href = "https://youtube.com" target = "_blank" rel = "noopener noreferrer" className="text-gra y-700 hover:text-gray-900">YouTube</a>
 </div>
 </div>
 </div>

 {/* Divider */}
 <div className="border- t border-gray-300 pt-8">
 <div className="fle x flex-col md:flex-row justify-between items-center text-sm text-gray-600">
 <p>&copy; 2026 Hirwa Amb as sadeur. All rights reserved.</p>
 <p>Professional News Media Platform</p>
 </div>
 </div>
 </div>
 </footer>
 );
}












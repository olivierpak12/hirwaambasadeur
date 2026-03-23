'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const CATEGORIES = ['Top Stories', 'World', 'Technology', 'Business', 'Sport', 'Culture', 'Health', 'Science', 'Africa'];

const categorySlug = (category: string) =>
  category === 'Top Stories'
    ? '/'
    : `/categories/${category.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}`;

export default function CategoryFilter() {
  const pathname = usePathname();

  const activeCategory = pathname === '/'
    ? 'Top Stories'
    : CATEGORIES.find((category) => {
        if (category === 'Top Stories') return false;
        const slug = category.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
        return pathname?.startsWith(`/categories/${slug}`);
      }) || 'Top Stories';

  return (
    <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center space-x-3 sm:space-x-8 py-4 overflow-x-auto">
          {CATEGORIES.map((category) => {
            const isActive = activeCategory === category;
            return (
              <Link
                key={category}
                href={categorySlug(category)}
                className={`whitespace-nowrap px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  isActive
                    ? 'bg-red-600 text-white'
                    : 'text-gray-600 hover:text-red-600 hover:bg-red-50'
                }`}
              >
                {category}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
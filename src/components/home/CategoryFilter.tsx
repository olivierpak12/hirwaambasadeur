'use client';

import { useState } from 'react';

const CATEGORIES = ['Top Stories', 'World', 'Technology', 'Business', 'Sport', 'Culture', 'Health', 'Science', 'Africa'];

export default function CategoryFilter() {
  const [activeCategory, setActiveCategory] = useState('Top Stories');

  return (
    <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center space-x-8 py-4 overflow-x-auto">
          {CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`whitespace-nowrap px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                activeCategory === category
                  ? 'bg-red-600 text-white'
                  : 'text-gray-600 hover:text-red-600 hover:bg-red-50'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
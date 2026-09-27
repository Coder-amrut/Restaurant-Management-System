import React from 'react';
import { Search, X, Sparkles } from 'lucide-react';

export function SearchBarAndFilters({
  searchTerm,
  setSearchTerm,
  categories,
  selectedCategory,
  setSelectedCategory
}) {
  const allCategories = ['All', ...categories];

  return (
    <section className="py-6 bg-white/70 border-b border-slate-200/80 backdrop-blur-sm sticky top-20 z-30 shadow-xs">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-4">
        
        {/* Live Search Bar */}
        <div className="relative max-w-2xl mx-auto">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
            <Search className="w-5 h-5 text-slate-400" />
          </div>

          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search delicious dishes, ingredients, or categories..."
            className="w-full pl-11 pr-10 py-3.5 bg-slate-50 hover:bg-slate-100/80 focus:bg-white text-slate-900 placeholder-slate-400 rounded-2xl border border-slate-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/15 outline-none transition-all text-sm sm:text-base font-medium shadow-inner"
          />

          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
              title="Clear search"
            >
              <div className="w-6 h-6 rounded-full bg-slate-200 hover:bg-slate-300 flex items-center justify-center">
                <X className="w-3.5 h-3.5 text-slate-700" />
              </div>
            </button>
          )}
        </div>

        {/* Horizontally Scrollable Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 scroll-smooth">
          {allCategories.map((cat) => {
            const isSelected = (selectedCategory.toLowerCase() === cat.toLowerCase()) || 
                               (selectedCategory === '' && cat === 'All');

            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat === 'All' ? 'All' : cat)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all duration-200 border ${
                  isSelected
                    ? 'bg-gradient-to-r from-orange-600 to-amber-600 text-white border-transparent shadow-md shadow-orange-500/20 scale-[1.02]'
                    : 'bg-white text-slate-700 border-slate-200 hover:border-orange-300 hover:bg-orange-50/50 shadow-xs'
                }`}
              >
                {cat === 'All' && <Sparkles className={`w-3.5 h-3.5 ${isSelected ? 'text-amber-200' : 'text-orange-500'}`} />}
                <span>{cat}</span>
              </button>
            );
          })}
        </div>

      </div>
    </section>
  );
}

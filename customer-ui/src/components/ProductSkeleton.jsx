import React from 'react';
import { Loader2, UtensilsCrossed } from 'lucide-react';

export function ProductSkeleton() {
  return (
    <div className="space-y-6">
      {/* Spinner Banner */}
      <div className="flex items-center justify-center gap-3 bg-amber-500/10 text-amber-900 border border-amber-500/20 py-3.5 px-6 rounded-2xl max-w-md mx-auto animate-pulse">
        <Loader2 className="w-5 h-5 text-orange-600 animate-spin" />
        <span className="text-sm font-semibold tracking-wide">Fetching menu from kitchen...</span>
      </div>

      {/* Grid of Skeleton Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="bg-white rounded-3xl border border-slate-200 overflow-hidden p-4 space-y-4 shadow-xs">
            <div className="w-full h-44 skeleton-shimmer rounded-2xl"></div>
            <div className="space-y-2">
              <div className="w-1/3 h-4 skeleton-shimmer"></div>
              <div className="w-3/4 h-6 skeleton-shimmer"></div>
              <div className="w-full h-3 skeleton-shimmer"></div>
              <div className="w-2/3 h-3 skeleton-shimmer"></div>
            </div>
            <div className="pt-3 flex items-center justify-between border-t border-slate-100">
              <div className="w-1/4 h-6 skeleton-shimmer"></div>
              <div className="w-24 h-9 skeleton-shimmer rounded-xl"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

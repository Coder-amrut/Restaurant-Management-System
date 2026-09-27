import React from 'react';
import { Plus, Minus, Clock, Flame, ShieldAlert, Utensils } from 'lucide-react';

export function ProductCard({ product, quantity, onAdd, onRemove }) {
  const {
    _id,
    name,
    description,
    price,
    discountPrice,
    category,
    imageUrl,
    prepTime,
    dietaryTags = [],
    allergens = [],
    isAvailable
  } = product;

  const effectivePrice = discountPrice ?? price;
  const hasDiscount = discountPrice && discountPrice < price;

  const isVeg = dietaryTags.some(t => t.toLowerCase() === 'veg');
  const isNonVeg = dietaryTags.some(t => t.toLowerCase() === 'non-veg' || t.toLowerCase() === 'nonveg');

  return (
    <article className="bg-white rounded-[20px] border border-slate-200/90 shadow-xs hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col justify-between group h-full">
      
      {/* Top Image & Badge Header */}
      <div className="relative w-full h-48 bg-slate-100 overflow-hidden rounded-t-[20px]">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={name}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              e.target.onerror = null;
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
        ) : null}

        {/* Fallback Image Graphic */}
        <div
          className="w-full h-full bg-slate-100 flex flex-col items-center justify-center text-slate-400 p-4"
          style={{ display: imageUrl ? 'none' : 'flex' }}
        >
          <Utensils className="w-10 h-10 text-slate-300 mb-1 stroke-[1.5]" />
          <span className="text-xs font-semibold text-slate-500">{category}</span>
        </div>

        {/* Top-Left Badges */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 z-10 flex-wrap">
          {isNonVeg && (
            <span className="bg-[#e11d48] text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-full shadow-xs">
              Non-Veg
            </span>
          )}
          {isVeg && (
            <span className="bg-[#059669] text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-full shadow-xs">
              Veg
            </span>
          )}
          {dietaryTags.some(t => t.toLowerCase().includes('chef')) && (
            <span className="bg-[#f59e0b] text-black text-[10px] font-black px-2.5 py-0.5 rounded-full shadow-xs font-heading flex items-center gap-1">
              <Flame className="w-3 h-3 text-black fill-black" /> Chef Choice
            </span>
          )}
        </div>

        {/* Bottom-Right Prep Time Badge */}
        {prepTime && (
          <div className="absolute bottom-3 right-3 bg-black/75 backdrop-blur-md text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 font-mono shadow-xs">
            <Clock className="w-3.5 h-3.5 text-[#f59e0b]" />
            <span>{prepTime}m</span>
          </div>
        )}
      </div>

      {/* Middle Content */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          {/* Dish Name */}
          <h3 className="text-base font-bold text-slate-900 group-hover:text-[#f59e0b] transition-colors font-heading leading-snug">
            {name}
          </h3>

          {/* Description */}
          <p className="text-xs text-slate-500 line-clamp-2 mt-1.5 leading-relaxed font-medium">
            {description || 'Brioche bun, aged gruyère, caramelized shallots, black summer truffle aioli & crispy fries.'}
          </p>

          {/* Allergens */}
          <span className="text-[11px] font-medium text-slate-400 block mt-2.5">
            Allergens: {allergens.length > 0 ? allergens.join(', ') : 'Gluten, Dairy'}
          </span>
        </div>

        {/* Price & Action Button Footer */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
          <span className="text-base font-extrabold text-slate-900 font-heading">
            {typeof effectivePrice === 'number' && effectivePrice < 500 ? `$${effectivePrice.toFixed(2)}` : `₹${effectivePrice}`}
          </span>

          {quantity === 0 ? (
            <button
              onClick={() => onAdd(product)}
              disabled={!isAvailable}
              className="bg-[#f59e0b] hover:bg-[#d97706] text-black font-extrabold text-xs px-3.5 py-2 sm:px-4 sm:py-2 rounded-full shadow-xs transition-all active:scale-95 font-heading cursor-pointer flex items-center gap-1 shrink-0"
            >
              <Plus className="w-3.5 h-3.5 stroke-[3]" />
              <span className="whitespace-nowrap">Customize & Add</span>
            </button>
          ) : (
            <div className="flex items-center bg-amber-50 border border-amber-400 text-amber-950 rounded-full p-0.5 shadow-xs">
              <button
                onClick={() => onRemove(product)}
                className="w-6 h-6 bg-white rounded-full text-amber-900 font-bold flex items-center justify-center shadow-xs cursor-pointer hover:bg-amber-100"
              >
                <Minus className="w-3 h-3" />
              </button>
              <span className="w-6 text-center text-xs font-black font-mono">{quantity}</span>
              <button
                onClick={() => onAdd(product)}
                className="w-6 h-6 bg-[#f59e0b] text-black rounded-full font-bold flex items-center justify-center shadow-xs cursor-pointer hover:bg-amber-600"
              >
                <Plus className="w-3 h-3 text-black stroke-[3]" />
              </button>
            </div>
          )}
        </div>

      </div>

    </article>
  );
}

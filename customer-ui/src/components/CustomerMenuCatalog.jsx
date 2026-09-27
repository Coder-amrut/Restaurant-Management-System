import React, { useState } from 'react';
import { Search, Sparkles, MapPin, Clock, Plus, Minus, Flame, Utensils, X } from 'lucide-react';
import { ProductSkeleton } from './ProductSkeleton';

const DEFAULT_IMAGE_FALLBACK = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80';

export function CustomerMenuCatalog({
  products,
  loading,
  error,
  cart,
  onAddToCart,
  onRemoveFromCart,
  onSeedDemo
}) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDiet, setSelectedDiet] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const categoriesList = ['All', "Chef's Specials", 'Starters', 'Mains', 'Pizzas & Burgers', 'Beverages', 'Desserts'];

  const displayProducts = products || [];

  // Filter products dynamically preserving all data & logic
  const filteredProducts = displayProducts.filter((prod) => {
    // Category Filter
    if (selectedCategory !== 'All') {
      const catMatch = prod.category?.toLowerCase() === selectedCategory.toLowerCase() ||
        (selectedCategory === "Chef's Specials" && prod.dietaryTags?.some(t => t.toLowerCase().includes('chef')));
      if (!catMatch) return false;
    }

    // Dietary Filter
    if (selectedDiet !== 'All') {
      const isVeg = prod.dietaryTags?.some(t => t.toLowerCase() === 'veg');
      const isNonVeg = prod.dietaryTags?.some(t => t.toLowerCase() === 'non-veg' || t.toLowerCase() === 'nonveg');
      if (selectedDiet === 'Veg' && !isVeg) return false;
      if (selectedDiet === 'Non-Veg' && !isNonVeg) return false;
      if (selectedDiet === 'Vegan' && !prod.dietaryTags?.some(t => t.toLowerCase() === 'vegan')) return false;
    }

    // Search Query
    if (searchTerm) {
      const query = searchTerm.toLowerCase();
      const nameMatch = prod.name?.toLowerCase().includes(query);
      const descMatch = prod.description?.toLowerCase().includes(query);
      const catMatch = prod.category?.toLowerCase().includes(query);
      if (!nameMatch && !descMatch && !catMatch) return false;
    }

    return true;
  });

  const handleImageError = (e) => {
    e.target.onerror = null;
    e.target.src = DEFAULT_IMAGE_FALLBACK;
  };

  return (
    <div className="w-full bg-white rounded-[24px] border border-slate-200/90 shadow-sm p-4 sm:p-6 lg:p-8 space-y-6 animate-fade-in font-body">

      {/* 4. HERO SECTION (Centered card inside white container) */}
      <div className="bg-gradient-to-r from-[#21140b] via-[#180e07] to-[#120803] text-white rounded-[20px] p-6 sm:p-8 border border-[#3b2518] relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6 min-h-[190px] shadow-sm w-full">

        {/* Left Hero Content */}
        <div className="space-y-3 max-w-xl relative z-10">
          <span className="inline-flex items-center gap-1.5 bg-[#f59e0b]/15 text-[#fcd34d] text-xs font-bold px-3 py-1 rounded-full border border-[#f59e0b]/30 font-heading">
            <Sparkles className="w-3.5 h-3.5 text-[#f59e0b]" /> Autumn Chef Tasting Special
          </span>

          <h2
            className="text-2xl sm:text-3xl lg:text-[32px] font-extrabold font-heading tracking-tight leading-snug !text-white"
            style={{ color: '#ffffff' }}
          >
            Handcrafted Artisan Dining, Prepared<br className="hidden sm:inline" /> Fresh to Order.
          </h2>

          {/* <p className="text-xs sm:text-sm text-slate-300 font-medium">
            Use coupon code <span className="text-black font-black bg-[#f59e0b] px-2 py-0.5 rounded-md font-mono text-xs shadow-xs">BISTR020</span> at checkout for 20% off your entire order today.
          </p> */}
        </div>

        {/* Right Dining Context Card */}
        <div className="bg-black/45 border border-[#3d2719] p-4 rounded-2xl shrink-0 w-full md:w-auto max-w-xs font-heading shadow-inner backdrop-blur-xs">
          <span className="text-[10px] font-black text-[#f59e0b] uppercase tracking-wider block mb-1.5">
            WELCOME
          </span>
          <div className="flex items-center gap-2 text-xs font-bold text-white">
            {/* <MapPin className="w-4 h-4 text-[#f59e0b] shrink-0" /> */}
            <span>Customer is GOD</span>
          </div>
        </div>

      </div>

      {/* 5. CATEGORY / FILTER BAR */}
      <div className="bg-[#f9f9fb] rounded-[18px] border border-slate-200/80 shadow-2xs p-3.5 flex flex-col lg:flex-row items-center justify-between gap-4 min-h-[64px] w-full">

        {/* Left Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar w-full lg:w-auto py-1" style={{ display: 'flex', gap: '6px' }}>
          {categoriesList.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`settings-style-btn ${selectedCategory === cat ? 'active' : ''}`}
            >
              <span>{cat}</span>
            </button>
          ))}
        </div>

        {/* Right Dietary Filters & Search Bar */}
        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto" style={{ display: 'flex', gap: '12px' }}>

          {/* Dietary Filters */}
          <div className="flex items-center gap-1" style={{ display: 'flex', gap: '4px' }}>
            {['All', 'Veg', 'Non-Veg', 'Vegan'].map((diet) => (
              <button
                key={diet}
                onClick={() => setSelectedDiet(diet)}
                className={`settings-style-btn ${selectedDiet === diet ? 'active' : ''}`}
              >
                <span>{diet}</span>
              </button>
            ))}
          </div>

          {/* Search Bar */}
          <div className="relative flex-1 lg:w-52">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search menu..."
              className="w-full pl-9 pr-8 py-1.5 bg-white border border-slate-200 rounded-full text-xs font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#f59e0b] transition-colors"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-2.5 top-2 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

        </div>

      </div>

      {/* 6 & 7. MENU GRID & CARDS (Three-column desktop, 2-column tablet, 1-column mobile) */}
      {loading ? (
        <ProductSkeleton />
      ) : filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
          {filteredProducts.map((prod) => {
            const cartItem = cart[prod._id];
            const qty = cartItem ? cartItem.quantity : 0;
            const price = prod.discountPrice ?? prod.price;

            const isVeg = prod.dietaryTags?.some(t => t.toLowerCase() === 'veg');
            const isNonVeg = prod.dietaryTags?.some(t => t.toLowerCase() === 'non-veg' || t.toLowerCase() === 'nonveg');
            const isChef = prod.dietaryTags?.some(t => t.toLowerCase().includes('chef'));

            const formattedPrice = typeof price === 'number'
              ? (price < 100 ? `$${price.toFixed(2)}` : `₹${price}`)
              : price;

            const allergenText = prod.allergens && prod.allergens.length > 0
              ? (Array.isArray(prod.allergens) ? prod.allergens.join(', ') : prod.allergens)
              : 'Gluten, Dairy';

            return (
              <article
                key={prod._id}
                className="bg-white rounded-[20px] border border-slate-200/90 shadow-xs hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col justify-between group h-full"
              >

                {/* Image Section (Fixed aspect ratio 16:9, rounded top corners) */}
                <div className="relative w-full h-48 bg-slate-100 overflow-hidden rounded-t-[20px]">
                  <img
                    src={prod.imageUrl || DEFAULT_IMAGE_FALLBACK}
                    alt=""
                    onError={handleImageError}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />

                  {/* Top-Left Overlay Badges */}
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
                    {isChef && (
                      <span className="bg-[#f59e0b] text-black text-[10px] font-black px-2.5 py-0.5 rounded-full shadow-xs font-heading flex items-center gap-1">
                        <Flame className="w-3 h-3 text-black fill-black" /> Chef Choice
                      </span>
                    )}
                  </div>

                  {/* Bottom-Right Prep Time Badge */}
                  <div className="absolute bottom-3 right-3 bg-black/75 backdrop-blur-md text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 font-mono shadow-xs">
                    <Clock className="w-3.5 h-3.5 text-[#f59e0b]" />
                    <span>{prod.prepTime || 15}m</span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 group-hover:text-[#f59e0b] transition-colors font-heading leading-snug">
                      {prod.name}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-2 mt-1.5 leading-relaxed font-medium">
                      {prod.description || 'Brioche bun, aged gruyère, caramelized shallots, black summer truffle aioli & crispy fries.'}
                    </p>

                    <span className="text-[11px] font-medium text-slate-400 block mt-2.5">
                      Allergens: {allergenText}
                    </span>
                  </div>

                  {/* Card Bottom Row (Price on left, + Customize & Add on right) */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-base font-extrabold text-slate-900 font-heading">
                      {formattedPrice}
                    </span>

                    {qty === 0 ? (
                      <button
                        onClick={() => onAddToCart(prod)}
                        className="settings-style-btn active"
                      >
                        <Plus className="w-3.5 h-3.5 stroke-[3]" />
                        <span>Customize & Add</span>
                      </button>
                    ) : (
                      <div className="flex items-center bg-amber-50 border border-amber-400 text-amber-950 rounded-full p-0.5 shadow-xs">
                        <button
                          onClick={() => onRemoveFromCart(prod)}
                          className="w-6 h-6 bg-white rounded-full text-amber-900 font-bold flex items-center justify-center shadow-xs cursor-pointer hover:bg-amber-100"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-6 text-center text-xs font-black font-mono">{qty}</span>
                        <button
                          onClick={() => onAddToCart(prod)}
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
          })}
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 max-w-md mx-auto space-y-3 shadow-xs">
          <Utensils className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="font-bold text-base font-heading text-slate-800">No dishes found</h3>
          <p className="text-xs text-slate-500">Seed sample structured artisan dishes into MongoDB database.</p>
          <button
            onClick={onSeedDemo}
            className="px-4 py-2 bg-[#f59e0b] text-black text-xs font-black rounded-full shadow-md font-heading cursor-pointer"
          >
            Seed Sample Dishes
          </button>
        </div>
      )}

    </div>
  );
}

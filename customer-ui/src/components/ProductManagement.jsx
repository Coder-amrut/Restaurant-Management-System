import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit2, Trash2, CheckCircle, XCircle, X, Loader2, Sparkles, AlertCircle, ArrowLeft, Upload, Image as ImageIcon } from 'lucide-react';
import { api } from '../services/api';

export function ProductManagement({ onBackToMenu }) {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deletingProductId, setDeletingProductId] = useState(null);

  // Form State for Add / Edit
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    discountPrice: '',
    category: 'Pizzas & Burgers',
    imageUrl: '',
    prepTime: 15,
    isAvailable: true
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  const handleDeviceImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      setFormError('Image file size must be less than 10MB');
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData(prev => ({ ...prev, imageUrl: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const loadProducts = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await api.getProducts(search);
      setProducts(data || []);
    } catch (err) {
      setError(err.message || 'Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, [search]);

  const openAddModal = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      description: '',
      price: '',
      discountPrice: '',
      category: 'Pizzas & Burgers',
      imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
      prepTime: 15,
      isAvailable: true
    });
    setFormError('');
    setIsAddModalOpen(true);
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name || '',
      description: product.description || '',
      price: product.price || '',
      discountPrice: product.discountPrice || '',
      category: product.category || 'Pizzas & Burgers',
      imageUrl: product.imageUrl || '',
      prepTime: product.prepTime || 15,
      isAvailable: product.isAvailable !== false
    });
    setFormError('');
    setIsAddModalOpen(true);
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price || isSubmitting) return;

    setIsSubmitting(true);
    setFormError('');

    const payload = {
      name: formData.name.trim(),
      description: formData.description.trim(),
      price: parseFloat(formData.price),
      discountPrice: formData.discountPrice ? parseFloat(formData.discountPrice) : undefined,
      category: formData.category.trim(),
      imageUrl: formData.imageUrl.trim(),
      prepTime: parseInt(formData.prepTime) || 15,
      isAvailable: Boolean(formData.isAvailable)
    };

    try {
      if (editingProduct) {
        await api.updateProduct(editingProduct._id, payload);
      } else {
        await api.createProduct(payload);
      }
      setIsAddModalOpen(false);
      loadProducts();
    } catch (err) {
      setFormError(err.message || 'Failed to save product details');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteProduct = async () => {
    if (!deletingProductId || isSubmitting) return;
    setIsSubmitting(true);
    try {
      await api.deleteProduct(deletingProductId);
      setDeletingProductId(null);
      loadProducts();
    } catch (err) {
      alert('Delete failed: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in font-body">

      {/* Top Action Row with Back Button */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBackToMenu}
          className="px-4 py-2 bg-white hover:bg-slate-100 text-slate-800 font-extrabold text-xs rounded-full border border-slate-200 shadow-xs flex items-center gap-1.5 transition-all font-heading"
        >
          <ArrowLeft className="w-4 h-4 text-amber-600" />
          <span>Back to Menu</span>
        </button>

        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider font-heading">
          Catalog Inventory Management
        </span>
      </div>

      {/* Search & Action Header Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">

        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products by name or category..."
            className="w-full pl-11 pr-4 py-2.5 bg-slate-50 rounded-full border border-slate-200 focus:bg-white focus:border-amber-500 focus:outline-none text-xs font-medium"
          />
        </div>

        {/* Add Product Button */}
        <button
          onClick={openAddModal}
          className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs sm:text-sm rounded-full shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 font-heading active:scale-95 cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Add Product</span>
        </button>

      </div>

      {/* Product List Table View */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">

        {loading ? (
          <div className="p-12 text-center text-slate-500 space-y-2">
            <Loader2 className="w-8 h-8 text-amber-600 animate-spin mx-auto" />
            <p className="text-xs font-semibold">Loading product catalog...</p>
          </div>
        ) : error ? (
          <div className="p-8 text-center text-rose-600 space-y-2">
            <AlertCircle className="w-8 h-8 mx-auto" />
            <p className="text-sm font-bold">{error}</p>
          </div>
        ) : products.length === 0 ? (
          <div className="p-12 text-center text-slate-500 space-y-3">
            <p className="text-sm font-bold">No products found</p>
            <p className="text-xs text-slate-400">Click "Add Product" above to create your first menu dish.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200 font-heading">
                  <th className="py-3.5 px-6">Product Dish</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Price</th>
                  <th className="py-3.5 px-4">Availability</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs sm:text-sm font-medium text-slate-800">
                {products.map((prod) => (
                  <tr key={prod._id} className="hover:bg-slate-50/80 transition-colors">

                    {/* Name & Image */}
                    <td className="py-3.5 px-6 flex items-center gap-3">
                      <img
                        src={prod.imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=120&q=80'}
                        alt={prod.name}
                        className="w-10 h-10 rounded-xl object-cover border border-slate-200 shrink-0"
                      />
                      <div>
                        <span className="font-bold text-slate-900 block font-heading">{prod.name}</span>
                        <span className="text-xs text-slate-400 line-clamp-1">{prod.description || 'No description'}</span>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3.5 px-4">
                      <span className="bg-slate-100 text-slate-700 text-xs font-bold px-2.5 py-1 rounded-full border border-slate-200">
                        {prod.category}
                      </span>
                    </td>

                    {/* Price */}
                    <td className="py-3.5 px-4 font-bold font-mono text-slate-900">
                      ₹{prod.discountPrice || prod.price}
                      {prod.discountPrice && (
                        <span className="text-[10px] text-slate-400 line-through block font-normal">₹{prod.price}</span>
                      )}
                    </td>

                    {/* Availability Status */}
                    <td className="py-3.5 px-4">
                      {prod.isAvailable !== false ? (
                        <span className="bg-emerald-100 text-emerald-800 text-[11px] font-extrabold px-2.5 py-0.5 rounded-full inline-flex items-center gap-1 border border-emerald-200">
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> Available
                        </span>
                      ) : (
                        <span className="bg-slate-100 text-slate-600 text-[11px] font-bold px-2.5 py-0.5 rounded-full inline-flex items-center gap-1 border border-slate-200">
                          <XCircle className="w-3.5 h-3.5 text-slate-400" /> Unavailable
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-6 text-right space-x-2">
                      <button
                        onClick={() => openEditModal(prod)}
                        className="p-2 text-slate-600 hover:text-amber-600 hover:bg-amber-50 rounded-xl transition-colors"
                        title="Edit Product"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => setDeletingProductId(prod._id)}
                        className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                        title="Delete Product"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>

      {/* Add / Edit Product Modal */}
      {isAddModalOpen && (
        <div className="modal-backdrop">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-fade-in border border-slate-200 m-4">

            <div className="px-6 py-4 bg-slate-950 text-white flex items-center justify-between">
              <h3 className="font-bold text-base font-heading">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-900 text-slate-400 hover:text-white flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">

              {formError && (
                <div className="p-3 bg-rose-50 text-rose-700 text-xs font-bold rounded-xl">
                  {formError}
                </div>
              )}

              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block font-heading mb-1">
                  Product Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Artisan Truffle Wagyu Burger"
                  className="w-full text-xs sm:text-sm px-3.5 py-2.5 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:border-amber-500 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block font-heading mb-1">
                    Price (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="350"
                    className="w-full text-xs sm:text-sm px-3.5 py-2.5 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:border-amber-500 font-medium font-mono"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block font-heading mb-1">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full text-xs sm:text-sm px-3.5 py-2.5 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:border-amber-500 font-semibold text-slate-800"
                  >
                    <option value="Starters">Starters</option>
                    <option value="Mains">Mains</option>
                    <option value="Pizzas & Burgers">Pizzas & Burgers</option>
                    <option value="Breads">Breads</option>
                    <option value="Beverages">Beverages</option>
                    <option value="Desserts">Desserts</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block font-heading mb-1">
                  Description
                </label>
                <textarea
                  rows="2"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Short description of dish..."
                  className="w-full text-xs sm:text-sm px-3.5 py-2.5 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:border-amber-500 font-medium"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block font-heading mb-1.5">
                  Product Photo (Device Upload or Image URL)
                </label>
                
                <div className="space-y-2.5">
                  <div className="flex items-center gap-2">
                    <label className="cursor-pointer px-3.5 py-2 bg-amber-500 hover:bg-amber-600 text-black text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5 transition-colors shrink-0 font-heading">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload Photo from Device</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleDeviceImageUpload}
                      />
                    </label>
                    <span className="text-[11px] text-slate-400 font-medium">Or enter web URL</span>
                  </div>

                  <input
                    type="text"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    placeholder="https://... or choose photo above"
                    className="w-full text-xs sm:text-sm px-3.5 py-2.5 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:border-amber-500 font-medium"
                  />

                  {formData.imageUrl && (
                    <div className="relative w-full h-32 rounded-xl overflow-hidden border border-slate-200 bg-slate-100">
                      <img src={formData.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, imageUrl: '' })}
                        className="absolute top-2 right-2 p-1.5 bg-black/75 text-white rounded-full hover:bg-rose-600 transition-colors shadow-md"
                        title="Remove Photo"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-xs font-bold text-slate-700">Item Availability</span>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, isAvailable: !formData.isAvailable })}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition-colors ${formData.isAvailable
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : 'bg-slate-100 text-slate-600 border border-slate-300'
                    }`}
                >
                  {formData.isAvailable ? 'Available' : 'Unavailable'}
                </button>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-full"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs rounded-full shadow-md flex items-center gap-1.5 font-heading"
                >
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  <span>{editingProduct ? 'Update Product' : 'Create Product'}</span>
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {deletingProductId && (
        <div className="modal-backdrop">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full space-y-4 animate-fade-in border border-slate-200 m-4 text-center">
            <Trash2 className="w-12 h-12 text-rose-600 mx-auto" />
            <h3 className="font-bold text-base font-heading text-slate-900">Delete Product?</h3>
            <p className="text-xs text-slate-500">This dish will be permanently removed from the kitchen database catalog.</p>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setDeletingProductId(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-full"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteProduct}
                disabled={isSubmitting}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-full shadow-md"
              >
                {isSubmitting ? 'Deleting...' : 'Yes, Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

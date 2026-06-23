import React, { useState, useEffect } from 'react';
import { X, Upload, Loader2 } from 'lucide-react';


const ProductModal = ({ isOpen, onClose, onSave, product = null }) => {
  const [formData, setFormData] = useState({
    name: '',
    category: 'Ceramics',
    price: '',
    stockQuantity: '',
    description: '',
    colors: '',
    sizes: '',
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  
  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        category: product.category || 'Ceramics',
        price: product.price ? (product.price / 100).toString() : '',
        stockQuantity: product.stockQuantity !== undefined ? product.stockQuantity.toString() : '0',
        description: product.description || '',
        colors: product.colors ? product.colors.join(', ') : '',
        sizes: product.sizes ? product.sizes.join(', ') : '',
      });
      setImagePreview(product.imageUrl || '');
      setImageFile(null);
    } else {
      setFormData({
        name: '',
        category: 'Ceramics',
        price: '',
        stockQuantity: '1',
        description: '',
        colors: '',
        sizes: '',
      });
      setImagePreview('');
      setImageFile(null);
    }
    setError('');
  }, [product, isOpen]);

  
  useEffect(() => {
    return () => {
      if (imagePreview && imagePreview.startsWith('blob:')) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      
      if (!formData.name || !formData.price || !formData.stockQuantity) {
        throw new Error('Name, price, and stock quantity are required.');
      }

      const parsedPrice = Math.round(parseFloat(formData.price) * 100);
      if (isNaN(parsedPrice) || parsedPrice < 0) {
        throw new Error('Please enter a valid price.');
      }

      const parsedStock = parseInt(formData.stockQuantity, 10);
      if (isNaN(parsedStock) || parsedStock < 0) {
        throw new Error('Please enter a valid stock quantity.');
      }

      
      const colorsArray = formData.colors
        ? formData.colors.split(',').map((c) => c.trim()).filter(Boolean)
        : [];
      const sizesArray = formData.sizes
        ? formData.sizes.split(',').map((s) => s.trim()).filter(Boolean)
        : [];

      
      const data = new FormData();
      data.append('name', formData.name);
      data.append('category', formData.category);
      data.append('price', parsedPrice.toString());
      data.append('stockQuantity', parsedStock.toString());
      data.append('description', formData.description);
      
      
      colorsArray.forEach((color) => data.append('colors[]', color));
      sizesArray.forEach((size) => data.append('sizes[]', size));

      if (imageFile) {
        data.append('image', imageFile);
      }

      await onSave(data, product?._id);
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to save product. Please check your inputs.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      
      <div 
        className="fixed inset-0 bg-neutral-dark/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal Dialog */}
      <div className="relative bg-card rounded-2xl border border-border shadow-soft-xl w-full max-w-lg overflow-hidden transform transition-all my-8 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border/80 shrink-0">
          <h3 className="text-lg font-headline font-bold text-foreground">
            {product ? 'Edit Product' : 'Add New Product'}
          </h3>
          <button 
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground hover:bg-neutral-dark/5 rounded-full p-2 transition-colors focus:outline-none"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content - Scrollable Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
          {error && (
            <div className="p-3.5 bg-destructive/10 border border-destructive/20 rounded-xl text-xs font-sans text-destructive font-medium">
              {error}
            </div>
          )}

          {/* Image Upload Area */}
          <div className="space-y-2">
            <label className="field-label">Product Image</label>
            <div className="flex items-center justify-center w-full">
              <label className="flex flex-col items-center justify-center w-full h-40 border border-dashed border-border/80 rounded-xl cursor-pointer hover:border-primary/50 bg-neutral-light/30 transition-colors overflow-hidden group">
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 text-muted-foreground group-hover:text-primary transition-colors mb-2" />
                    <p className="text-xs font-sans font-bold text-foreground">Click to upload product photo</p>
                    <p className="text-[10px] font-sans text-muted-foreground mt-1">PNG, JPG, or WEBP</p>
                  </div>
                )}
                <input 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  onChange={handleImageChange} 
                  disabled={isLoading}
                />
              </label>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="name" className="field-label">Product Name</label>
              <input
                id="name"
                name="name"
                required
                disabled={isLoading}
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Speckled Mug"
                className="field-input"
              />
            </div>

            {/* Category */}
            <div className="space-y-2">
              <label htmlFor="category" className="field-label">Category</label>
              <select
                id="category"
                name="category"
                disabled={isLoading}
                value={formData.category}
                onChange={handleChange}
                className="field-select"
              >
                <option value="Ceramics">Ceramics</option>
                <option value="Textiles">Textiles</option>
                <option value="Woodwork">Woodwork</option>
                <option value="Home Decor">Home Decor</option>
                <option value="Glassware">Glassware</option>
                <option value="Stationery">Stationery</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Price */}
            <div className="space-y-2">
              <label htmlFor="price" className="field-label">Price (PHP)</label>
              <input
                id="price"
                name="price"
                type="number"
                step="0.01"
                min="0"
                required
                disabled={isLoading}
                value={formData.price}
                onChange={handleChange}
                placeholder="0.00"
                className="field-input"
              />
            </div>

            {/* Stock Quantity */}
            <div className="space-y-2">
              <label htmlFor="stockQuantity" className="field-label">Stock Quantity</label>
              <input
                id="stockQuantity"
                name="stockQuantity"
                type="number"
                min="0"
                required
                disabled={isLoading}
                value={formData.stockQuantity}
                onChange={handleChange}
                placeholder="10"
                className="field-input"
              />
            </div>
          </div>

          
          <div className="space-y-2">
            <label htmlFor="description" className="field-label">Description</label>
            <textarea
              id="description"
              name="description"
              disabled={isLoading}
              value={formData.description}
              onChange={handleChange}
              placeholder="Tell customers about the craftsmanship, materials, and creation of this item..."
              className="field-textarea h-20"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Colors */}
            <div className="space-y-2">
              <label htmlFor="colors" className="field-label">Colors</label>
              <input
                id="colors"
                name="colors"
                disabled={isLoading}
                value={formData.colors}
                onChange={handleChange}
                placeholder="e.g. Sand, Terracotta, White"
                className="field-input"
              />
              <p className="text-[9px] text-muted-foreground mt-1">Separate with commas</p>
            </div>

            
            <div className="space-y-2">
              <label htmlFor="sizes" className="field-label">Sizes</label>
              <input
                id="sizes"
                name="sizes"
                disabled={isLoading}
                value={formData.sizes}
                onChange={handleChange}
                placeholder="e.g. Small, Medium, Large"
                className="field-input"
              />
              <p className="text-[9px] text-muted-foreground mt-1">Separate with commas</p>
            </div>
          </div>

          {/* Footer inside Form */}
          <div className="flex justify-end gap-3 pt-6 border-t border-border/80">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="btn-md btn-outline"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="btn-md btn-solid"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Product'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductModal;

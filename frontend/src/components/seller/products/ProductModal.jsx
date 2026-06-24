import React, { useState, useEffect } from 'react';
import { Upload, Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';

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

  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
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
      setImagePreviews(product.imageUrls?.length > 0 ? product.imageUrls : (product.imageUrl ? [product.imageUrl] : []));
      setImageFiles([]);
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
      setImagePreviews([]);
      setImageFiles([]);
    }
    setError('');
  }, [product, isOpen]);

  
  useEffect(() => {
    return () => {
      imagePreviews.forEach((preview) => {
        if (preview && preview.startsWith('blob:')) {
          URL.revokeObjectURL(preview);
        }
      });
    };
  }, [imagePreviews]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      
      setImageFiles((prev) => [...prev, ...files].slice(0, 5));
      
      const newPreviews = files.map((file) => URL.createObjectURL(file));
      setImagePreviews((prev) => [...prev, ...newPreviews].slice(0, 5));
    }
  };

  const removeImage = (indexToRemove) => {
    setImageFiles((prev) => prev.filter((_, idx) => idx !== indexToRemove));
    setImagePreviews((prev) => {
      const newPreviews = [...prev];
      const removed = newPreviews.splice(indexToRemove, 1)[0];
      if (removed && removed.startsWith('blob:')) {
        URL.revokeObjectURL(removed);
      }
      return newPreviews;
    });
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

      if (imageFiles.length > 0) {
        imageFiles.forEach((file) => {
          data.append('images', file);
        });
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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogClose onClick={onClose} />
        
        <DialogHeader>
          <DialogTitle>
            {product ? 'Edit Product' : 'Add New Product'}
          </DialogTitle>
        </DialogHeader>

        {/* Content - Scrollable Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-4">
          {error && (
            <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-xl text-[10px] font-sans text-destructive font-medium">
              {error}
            </div>
          )}

          {/* Image Upload Area */}
          <div className="space-y-2">
            <label className="field-label flex justify-between">
              <span>Product Images</span>
              <span className="text-[10px] text-muted-foreground font-normal">{imagePreviews.length} / 5</span>
            </label>
            <div className="flex flex-col gap-3">
              {/* Image Previews Grid */}
              {imagePreviews.length > 0 && (
                <div className="grid grid-cols-5 gap-2">
                  {imagePreviews.map((preview, idx) => (
                    <div key={idx} className="relative w-full aspect-square rounded-lg border border-border/80 overflow-hidden group">
                      <img src={preview} alt={`Preview ${idx + 1}`} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeImage(idx)}
                        className="absolute top-1 right-1 p-1 bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/80"
                      >
                        <Upload className="w-3 h-3 rotate-45" /> {/* Close button replacement */}
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {imagePreviews.length < 5 && (
                <label className="flex flex-col items-center justify-center w-full h-20 border border-dashed border-border/80 rounded-xl cursor-pointer hover:border-primary/50 bg-neutral-light/30 transition-colors overflow-hidden group">
                  <div className="flex flex-col items-center justify-center pt-3 pb-4">
                    <Upload className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors mb-1" />
                    <p className="text-[10px] font-sans font-bold text-foreground">Click to upload photos</p>
                    <p className="text-[9px] font-sans text-muted-foreground mt-0.5">PNG, JPG, or WEBP (Max 5)</p>
                  </div>
                  <input 
                    type="file" 
                    accept="image/*" 
                    multiple
                    className="hidden" 
                    onChange={handleImageChange} 
                    disabled={isLoading}
                  />
                </label>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="name" className="field-label !mb-1 !text-[10px]">Product Name</label>
              <input
                id="name"
                name="name"
                required
                disabled={isLoading}
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Speckled Mug"
                className="field-input !py-1.5 !text-xs"
              />
            </div>

            {/* Category */}
            <div className="space-y-2">
              <label htmlFor="category" className="field-label !mb-1 !text-[10px]">Category</label>
              <select
                id="category"
                name="category"
                disabled={isLoading}
                value={formData.category}
                onChange={handleChange}
                className="field-select !py-1.5 !text-xs"
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
              <label htmlFor="price" className="field-label !mb-1 !text-[10px]">Price (PHP)</label>
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
                className="field-input !py-1.5 !text-xs"
              />
            </div>

            {/* Stock Quantity */}
            <div className="space-y-2">
              <label htmlFor="stockQuantity" className="field-label !mb-1 !text-[10px]">Stock Quantity</label>
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
                className="field-input !py-1.5 !text-xs"
              />
            </div>
          </div>

          
          <div className="space-y-2">
            <label htmlFor="description" className="field-label !mb-1 !text-[10px]">Description</label>
            <textarea
              id="description"
              name="description"
              disabled={isLoading}
              value={formData.description}
              onChange={handleChange}
              placeholder="Tell customers about the craftsmanship, materials, and creation of this item..."
              className="field-textarea h-16 !py-1.5 !text-xs"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Colors */}
            <div className="space-y-2">
              <label htmlFor="colors" className="field-label !mb-1 !text-[10px]">Colors</label>
              <input
                id="colors"
                name="colors"
                disabled={isLoading}
                value={formData.colors}
                onChange={handleChange}
                placeholder="e.g. Sand, Terracotta, White"
                className="field-input !py-1.5 !text-xs"
              />
              <p className="text-[8px] text-muted-foreground mt-0.5">Separate with commas</p>
            </div>

            
            <div className="space-y-2">
              <label htmlFor="sizes" className="field-label !mb-1 !text-[10px]">Sizes</label>
              <input
                id="sizes"
                name="sizes"
                disabled={isLoading}
                value={formData.sizes}
                onChange={handleChange}
                placeholder="e.g. Small, Medium, Large"
                className="field-input !py-1.5 !text-xs"
              />
              <p className="text-[8px] text-muted-foreground mt-0.5">Separate with commas</p>
            </div>
          </div>

          {/* Footer inside Form */}
          <div className="flex justify-end gap-2 pt-4 border-t border-border/80">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="btn-sm btn-outline px-4"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="btn-sm btn-solid px-4"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Product'
              )}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProductModal;

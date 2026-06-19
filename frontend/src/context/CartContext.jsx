import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem('artisan_hub_cart');
    if (!saved) return [];
    try {
      const parsed = JSON.parse(saved);
      // Sanitize corrupted quantities from previous bug
      return parsed.map(item => ({
        ...item,
        quantity: typeof item.quantity === 'object' ? 1 : (item.quantity || 1)
      }));
    } catch {
      return [];
    }
  });

  const [savedShopIds, setSavedShopIds] = useState(() => {
    const saved = localStorage.getItem('artisan_hub_saved_shops');
    return saved ? JSON.parse(saved) : ['shop_1', 'shop_2', 'shop_3'];
  });

  const [savedProductIds, setSavedProductIds] = useState(() => {
    const saved = localStorage.getItem('artisan_hub_saved_products');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('artisan_hub_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem('artisan_hub_saved_shops', JSON.stringify(savedShopIds));
  }, [savedShopIds]);

  useEffect(() => {
    localStorage.setItem('artisan_hub_saved_products', JSON.stringify(savedProductIds));
  }, [savedProductIds]);

  const toggleSaveShop = (shopId) => {
    setSavedShopIds(prev => 
      prev.includes(shopId) ? prev.filter(id => id !== shopId) : [...prev, shopId]
    );
  };

  const toggleSaveProduct = (productId) => {
    setSavedProductIds(prev => 
      prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]
    );
  };

  const addToCart = (product, quantity = 1) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.product._id === product._id);
      if (existing) {
        return prev.map(item =>
          item.product._id === product._id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) return;
    setCartItems(prev =>
      prev.map(item =>
        item.product._id === productId
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  const removeFromCart = (productId) => {
    setCartItems(prev => prev.filter(item => item.product._id !== productId));
  };

  const updateItemOptions = (productId, color, size) => {
    setCartItems(prev =>
      prev.map(item =>
        item.product._id === productId
          ? { ...item, color: color !== undefined ? color : item.color, size: size !== undefined ? size : item.size }
          : item
      )
    );
  };

  const clearCart = () => setCartItems([]);

  const cartTotal = cartItems.reduce(
    (total, item) => total + (item?.product?.price || 0) * (item?.quantity || 0),
    0
  );
  
  const cartItemCount = cartItems.reduce(
    (count, item) => count + (item?.quantity || 0),
    0
  );

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      updateQuantity,
      removeFromCart,
      updateItemOptions,
      clearCart,
      cartTotal,
      cartItemCount,
      savedShopIds,
      toggleSaveShop,
      savedProductIds,
      toggleSaveProduct
    }}>
      {children}
    </CartContext.Provider>
  );
};

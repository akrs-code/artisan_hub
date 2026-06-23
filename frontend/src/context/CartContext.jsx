import { createContext, useContext, useState, useEffect } from 'react';
import { cartAPI } from '../services/api';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const { user } = useAuth();

  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem('artisan_hub_cart');
    if (!saved) return [];
    try {
      const parsed = JSON.parse(saved);

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
    if (user) {
      cartAPI.getCart().then(res => {
        if (res?.data?.items) {
          setCartItems(res.data.items);
        }
      }).catch(err => console.error("Failed to fetch cart:", err));
    }
  }, [user]);

  useEffect(() => {
    if (!user) {
      localStorage.setItem('artisan_hub_cart', JSON.stringify(cartItems));
    }
  }, [cartItems, user]);

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

  const addToCart = async (product, quantity = 1) => {
    if (user) {
      try {
        const res = await cartAPI.addToCart({ productId: product._id, quantity });
        if (res?.data?.items) setCartItems(res.data.items);
      } catch (err) {
        console.error("Failed to add to cart:", err);
      }
    } else {
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
    }
  };

  const updateQuantity = async (productId, newQuantity) => {
    if (newQuantity < 1) return;
    if (user) {
      try {
        const res = await cartAPI.updateCartItem({ productId, quantity: newQuantity });
        if (res?.data?.items) setCartItems(res.data.items);
      } catch (err) {
        console.error("Failed to update cart:", err);
      }
    } else {
      setCartItems(prev =>
        prev.map(item =>
          item.product._id === productId
            ? { ...item, quantity: newQuantity }
            : item
        )
      );
    }
  };

  const removeFromCart = async (productId) => {
    if (user) {
      try {
        const res = await cartAPI.removeFromCart({ productId });
        if (res?.data?.items) setCartItems(res.data.items);
      } catch (err) {
        console.error("Failed to remove from cart:", err);
      }
    } else {
      setCartItems(prev => prev.filter(item => item.product._id !== productId));
    }
  };

  const updateItemOptions = async (productId, color, size) => {
    if (user) {
      // Backend does not currently support partial option updates cleanly without passing qty,
      // So we will just fetch existing qty and add. For now, just update local state if needed.
    }
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

/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

const CartContext = createContext(null);
const STORAGE_KEY = 'cart';

const loadCart = () => {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((i) => i && i.id && Number(i.price) >= 0 && Number(i.quantity) > 0);
  } catch {
    return [];
  }
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(loadCart);

  // Persist the cart so it survives reloads
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cartItems));
  }, [cartItems]);

  /**
   * Add `quantity` of an item. `item` = { id, name, price, image, stock }.
   * The quantity in the cart never exceeds the available stock.
   */
  const addToCart = useCallback((item, quantity = 1) => {
    setCartItems((prev) => {
      const stock = Number(item.stock) || 0;
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        const next = Math.min(existing.quantity + quantity, stock);
        return prev.map((i) => (i.id === item.id ? { ...i, ...item, quantity: next } : i));
      }
      return [...prev, { ...item, quantity: Math.min(quantity, stock) }];
    });
  }, []);

  const updateQuantity = useCallback((id, quantity) => {
    setCartItems((prev) =>
      prev.map((i) => {
        if (i.id !== id) return i;
        const clamped = Math.max(1, Math.min(quantity, i.stock ?? quantity));
        return { ...i, quantity: clamped };
      })
    );
  }, []);

  const removeFromCart = useCallback((id) => {
    setCartItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const clearCart = useCallback(() => setCartItems([]), []);

  const value = useMemo(
    () => ({
      cartItems,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      itemCount: cartItems.reduce((sum, i) => sum + i.quantity, 0),
      totalPrice: cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0),
    }),
    [cartItems, addToCart, updateQuantity, removeFromCart, clearCart]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside <CartProvider>');
  return ctx;
};

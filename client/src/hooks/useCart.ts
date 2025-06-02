import { useState, useEffect } from "react";
import { Tyre, Accessory } from "@shared/schema";

interface CartItem {
  id: string;
  productId: number;
  productType: 'tyre' | 'accessory';
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
  size?: string;
  category?: string;
  fitmentOption?: 'partner' | 'home' | 'mobile';
}

export function useCart() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product: Tyre | Accessory, productType: 'tyre' | 'accessory', fitmentOption?: string) => {
    const existingItem = cartItems.find(
      item => item.productId === product.id && item.productType === productType
    );

    if (existingItem) {
      setCartItems(items =>
        items.map(item =>
          item.id === existingItem.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      const newItem: CartItem = {
        id: `${productType}-${product.id}`,
        productId: product.id,
        productType,
        name: product.name,
        price: product.price,
        quantity: 1,
        imageUrl: product.imageUrl || undefined,
        size: 'size' in product ? product.size : undefined,
        category: 'category' in product ? product.category : undefined,
        fitmentOption: fitmentOption as any,
      };
      setCartItems(items => [...items, newItem]);
    }
    setIsCartOpen(true);
  };

  const removeFromCart = (itemId: string) => {
    setCartItems(items => items.filter(item => item.id !== itemId));
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    
    setCartItems(items =>
      items.map(item =>
        item.id === itemId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const getSubtotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getFitmentFee = () => {
    const hasTyres = cartItems.some(item => item.productType === 'tyre');
    return hasTyres ? 50 : 0;
  };

  const getVAT = () => {
    const subtotal = getSubtotal();
    const fitmentFee = getFitmentFee();
    return (subtotal + fitmentFee) * 0.05;
  };

  const getTotal = () => {
    return getSubtotal() + getFitmentFee() + getVAT();
  };

  return {
    cartItems,
    isCartOpen,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    toggleCart,
    getTotalItems,
    getSubtotal,
    getFitmentFee,
    getVAT,
    getTotal,
  };
}

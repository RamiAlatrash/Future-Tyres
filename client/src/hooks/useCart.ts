import { Accessory, Tyre } from "@shared/schema";
import { ReactNode, createContext, createElement, useContext, useEffect, useState } from "react";

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
  fitmentOption?: 'partner' | 'home' | 'no';
  brand: string;
}

interface CartContextType {
  cartItems: CartItem[];
  isCartOpen: boolean;
  isFitmentActive: boolean;
  addToCart: (product: (Tyre | Accessory) & { quantity?: number }, productType: 'tyre' | 'accessory', fitmentOption?: string) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  setGlobalFitmentOption: (wantsFitment: boolean) => void;
  clearCart: () => void;
  toggleCart: () => void;
  totalItems: number;
  getSubtotal: () => number;
  getFitmentFee: () => number;
  getVAT: () => number;
  getTotal: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product: (Tyre | Accessory) & { quantity?: number }, productType: 'tyre' | 'accessory', fitmentOption?: string) => {
    const existingItem = cartItems.find(
      item => item.productId === product.id && item.productType === productType
    );

    if (existingItem) {
      setCartItems(items =>
        items.map(item =>
          item.id === existingItem.id
            ? { ...item, quantity: item.quantity + (product.quantity || 1) }
            : item
        )
      );
    } else {
      const newItemId = `${productType}-${product.id}-${Date.now()}`;
      
      const newItem: CartItem = {
        id: newItemId,
        productId: product.id,
        productType,
        name: product.name,
        brand: product.brand,
        price: product.price,
        quantity: product.quantity || 1,
        imageUrl: product.imageUrl || undefined,
        size: 'size' in product ? product.size : undefined,
        category: 'category' in product ? product.category : undefined,
        fitmentOption: fitmentOption as any,
      };
      setCartItems(items => [...items, newItem]);
    }
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

  const setGlobalFitmentOption = (wantsFitment: boolean) => {
    setCartItems(items =>
      items.map(item => {
        if (item.productType === 'tyre' || item.productType === 'accessory') {
          return { ...item, fitmentOption: wantsFitment ? 'partner' : 'no' };
        }
        return item;
      })
    );
  };

  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
  };

  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);

  const getSubtotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const isFitmentActive = cartItems.some(
    item => (item.productType === 'tyre' || item.productType === 'accessory') && item.fitmentOption && item.fitmentOption !== 'no'
  );

  const getFitmentFee = () => {
    return isFitmentActive ? 50 : 0;
  };

  const getVAT = () => {
    const subtotal = getSubtotal();
    const fitmentFee = getFitmentFee();
    return (subtotal + fitmentFee) * 0.05;
  };

  const getTotal = () => {
    return getSubtotal() + getFitmentFee() + getVAT();
  };

  const value = {
    cartItems,
    isCartOpen,
    isFitmentActive,
    addToCart,
    removeFromCart,
    updateQuantity,
    setGlobalFitmentOption,
    clearCart,
    toggleCart,
    totalItems,
    getSubtotal,
    getFitmentFee,
    getVAT,
    getTotal,
  };

    return createElement(CartContext.Provider, { value }, children);
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

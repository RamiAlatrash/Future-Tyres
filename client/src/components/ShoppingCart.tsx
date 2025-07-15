import { X, Minus, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/useCart";
import { useLocation } from "wouter";

export default function ShoppingCart() {
  const [, setLocation] = useLocation();
  const { 
    isCartOpen, 
    toggleCart, 
    cartItems, 
    updateQuantity, 
    removeFromCart, 
    getSubtotal, 
    getFitmentFee, 
    getVAT, 
    getTotal 
  } = useCart();

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
      <div className="fixed right-0 top-0 h-full w-96 bg-white shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b">
          <h3 className="font-orbitron text-xl font-bold">Shopping Cart</h3>
          <Button variant="ghost" className="text-gray-500 hover:text-gray-700" onClick={toggleCart}>
            <X className="w-6 h-6" />
          </Button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6 max-h-[calc(100vh-200px)]">
          {cartItems.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">Your cart is empty</p>
              <Button onClick={toggleCart}>Continue Shopping</Button>
            </div>
          ) : (
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                  <img 
                    src={item.imageUrl || "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=80&h=80"}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium">{item.name}</h4>
                    <p className="text-sm text-gray-600">{item.size || item.category}</p>
                    <p className="text-electric-blue font-bold">AED {item.price}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <span className="w-8 text-center">{item.quantity}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-500 hover:text-red-700"
                    onClick={() => removeFromCart(item.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {cartItems.length > 0 && (
          <div className="border-t p-6">
            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>AED {getSubtotal().toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Fitment Fee:</span>
                <span>AED {getFitmentFee().toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>VAT (5%):</span>
                <span>AED {getVAT().toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg border-t pt-2">
                <span>Total:</span>
                <span className="text-electric-blue">AED {getTotal().toFixed(2)}</span>
              </div>
            </div>
            <Button 
              className="w-full bg-electric-blue hover:bg-electric-blue-dark mb-3"
              onClick={() => {
                toggleCart();
                setLocation('/cart');
              }}
            >
              Proceed to Checkout
            </Button>
            <Button 
              variant="outline" 
              className="w-full" 
              onClick={toggleCart}
            >
              Continue Shopping
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

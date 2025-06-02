import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { useCart } from "@/hooks/useCart";
import { Tyre, Accessory } from "@shared/schema";

interface ProductCardProps {
  product: Tyre | Accessory;
  type: "tyre" | "accessory";
}

export default function ProductCard({ product, type }: ProductCardProps) {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart(product, type);
  };

  const isOutOfStock = product.stock === 0;

  return (
    <Card className="product-card overflow-hidden">
      <CardContent className="p-6 text-center">
        {/* Product Image */}
        <div className="relative mb-4">
          {type === "tyre" ? (
            <div className="w-32 h-32 mx-auto rounded-full border-2 border-electric-blue p-2">
              <img 
                src={product.imageUrl || "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300"}
                alt={product.name}
                className="w-full h-full object-cover rounded-full"
              />
            </div>
          ) : (
            <img 
              src={product.imageUrl || "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"}
              alt={product.name}
              className="w-full h-48 object-cover rounded-lg hover:scale-105 transition-transform"
            />
          )}
        </div>
        
        {/* Product Info */}
        <h3 className="font-orbitron font-bold text-future-black mb-2">
          {product.brand} {product.name}
        </h3>
        
        {'size' in product && (
          <p className="text-sm text-gray-600 mb-2">{product.size}</p>
        )}
        
        {'category' in product && (
          <p className="text-sm text-gray-600 mb-3">
            {product.material && `Material: ${product.material}`}
            {product.fitment && `, Fitment: ${product.fitment}`}
          </p>
        )}
        
        <p className="text-xl font-bold text-electric-blue mb-3">
          AED {product.price.toFixed(2)}
        </p>
        
        {/* Stock Status */}
        <Badge 
          variant={isOutOfStock ? "destructive" : "default"}
          className={`mb-4 ${isOutOfStock ? "bg-red-500" : "bg-green-500"}`}
        >
          {isOutOfStock ? "Out of Stock" : "In Stock"}
        </Badge>
        
        {/* Action Buttons */}
        <div className="space-y-2">
          {type === "tyre" ? (
            <Button 
              className="w-full bg-electric-blue hover:bg-electric-blue-dark" 
              onClick={handleAddToCart}
              disabled={isOutOfStock}
            >
              {isOutOfStock ? "Out of Stock" : "Add to Cart"}
            </Button>
          ) : (
            <>
              <Link href={`/product/${type}/${product.id}`}>
                <Button 
                  variant="outline" 
                  className="w-full border-electric-blue text-electric-blue hover:bg-electric-blue hover:text-white"
                >
                  View Details
                </Button>
              </Link>
              <Button 
                className="w-full bg-electric-blue hover:bg-electric-blue-dark" 
                onClick={handleAddToCart}
                disabled={isOutOfStock}
              >
                {isOutOfStock ? "Out of Stock" : "Add to Cart"}
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

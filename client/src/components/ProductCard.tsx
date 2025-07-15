import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useCart } from "@/hooks/useCart";
import { cn } from "@/lib/utils";
import { Accessory, Tyre } from "@shared/schema";
import { Link } from "wouter";

interface ProductCardProps {
  product: Tyre | Accessory;
  type: "tyre" | "accessory";
  onProductClick?: () => void;
  layout?: 'default' | 'uniform';
}

export default function ProductCard({ product, type, onProductClick, layout = 'default' }: ProductCardProps) {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart(product, type);
  };

  const isOutOfStock = product.stock === 0;
  const isTyre = type === "tyre" && 'size' in product;
  
  // Enhanced discount detection for both tyres and accessories
  const getDiscountInfo = () => {
    if (isTyre) {
      const tyre = product as Tyre;
      // Check for Continental brand (automatic 25% discount)
      if (tyre.brand === "Continental") {
        const originalPrice = Math.round(tyre.price / 0.75); // Reverse calculate original price
        return {
          hasDiscount: true,
          originalPrice,
          discountPercent: 25,
          currentPrice: tyre.price
        };
      }
      // Check for promotion field
      if (tyre.promotion && tyre.promotion !== "") {
        const discountPercent = tyre.promotion === "20% Off" ? 20 : 15;
        const originalPrice = Math.round(tyre.price / (1 - discountPercent / 100));
        return {
          hasDiscount: true,
          originalPrice,
          discountPercent,
          currentPrice: tyre.price
        };
      }
      // Check for explicit originalPrice field
      if ('originalPrice' in tyre && tyre.originalPrice) {
        const discountPercent = Math.round(((tyre.originalPrice - tyre.price) / tyre.originalPrice) * 100);
        return {
          hasDiscount: true,
          originalPrice: tyre.originalPrice,
          discountPercent,
          currentPrice: tyre.price
        };
      }
    } else {
      // Handle accessories
      const accessory = product as Accessory;
      if ('discount' in accessory && accessory.discount && accessory.discount > 0) {
        const originalPrice = 'originalPrice' in accessory && accessory.originalPrice 
          ? accessory.originalPrice 
          : Math.round(accessory.price / (1 - accessory.discount / 100));
        return {
          hasDiscount: true,
          originalPrice,
          discountPercent: accessory.discount,
          currentPrice: accessory.price
        };
      }
    }
    
    return { hasDiscount: false, originalPrice: 0, discountPercent: 0, currentPrice: product.price };
  };

  const discountInfo = getDiscountInfo();
  const isUniformLayout = layout === 'uniform';

  return (
    <Card className={cn(
      "product-card overflow-hidden hover:shadow-lg transition-shadow",
      isUniformLayout && "flex flex-col h-full"
    )}>
      <CardContent className={cn("p-3", isUniformLayout && "flex flex-col flex-grow")}>
        <div className={cn(isUniformLayout && "flex-grow flex flex-col")}>
          {type === "tyre" ? (
            (() => {
              const tyreContent = (
                <>
                  {/* Product Image for Tyre */}
                  <div className="relative h-40 flex items-center justify-center overflow-hidden rounded-lg border border-gray-200 bg-white group-hover:border-electric-blue transition-colors mb-2">
                    <img 
                      src={product.imageUrl || "/tyre-placeholder.jpg"}
                      alt={product.name}
                      className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-105"
                    />
                    {/* Discount Badge */}
                    {discountInfo.hasDiscount && (
                      <div className="absolute top-1 right-1 bg-red-600 text-white px-1.5 py-0.5 rounded text-xs font-semibold">
                        -{discountInfo.discountPercent}%
                      </div>
                    )}
                  </div>
                  {/* Product Info for Tyre */}
                  <div className={cn("mt-2 space-y-1", isUniformLayout && "flex flex-col flex-grow")}>
                    <div className={cn(isUniformLayout && "flex-grow")}>
                      {(product as Tyre).brandImageUrl && (
                        <img 
                          src={(product as Tyre).brandImageUrl!} 
                          alt={`${product.brand} logo`}
                          className="h-6 mx-auto mb-1" 
                        />
                      )}
                      <h3 className={cn(
                        "font-orbitron font-bold text-future-black text-sm leading-tight group-hover:text-electric-blue transition-colors line-clamp-2",
                        isUniformLayout ? "min-h-[40px]" : "h-10"
                      )}>
                        {product.brand} {product.name}
                      </h3>
                      {isTyre && (
                        <p className="text-xs text-gray-600 min-h-[16px]">{(product as Tyre).size}</p>
                      )}
                    </div>
                    <div className="flex items-baseline justify-center gap-2">
                      {discountInfo.hasDiscount && (
                        <p className="text-xs text-gray-500 line-through">
                          AED {discountInfo.originalPrice.toFixed(2)}
                        </p>
                      )}
                      <p className={`text-sm font-bold ${discountInfo.hasDiscount ? 'text-red-600' : 'text-electric-blue'}`}>
                        AED {product.price.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </>
              );

              if (isUniformLayout) {
                return <div className="group flex flex-col h-full">{tyreContent}</div>;
              }
              return (
                <Link href={`/product/tyre/${product.id}`} className="block focus:outline-none focus:ring-2 focus:ring-electric-blue rounded-lg group">
                  {tyreContent}
                </Link>
              );
            })()
          ) : (
            onProductClick ? (
              <div onClick={onProductClick} className="cursor-pointer block focus:outline-none focus:ring-2 focus:ring-electric-blue rounded-lg group h-full flex flex-col">
                {/* Product Image for Accessory */}
                <div className="relative h-40 flex items-center justify-center overflow-hidden rounded-lg border border-gray-200 bg-white group-hover:border-electric-blue transition-colors mb-2">
                  <img 
                    src={product.imageUrl || "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"}
                    alt={product.name}
                    className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform"
                  />
                  {/* Discount Badge for Accessories */}
                  {discountInfo.hasDiscount && (
                    <div className="absolute top-1 right-1 bg-red-600 text-white px-1.5 py-0.5 rounded text-xs font-semibold">
                      -{discountInfo.discountPercent}%
                    </div>
                  )}
                </div>
                {/* Product Info for Accessory */}
                <div className="mt-2 space-y-1 flex flex-col flex-grow">
                  <div className="flex-grow">
                    <h3 className={cn(
                      "font-orbitron font-bold text-future-black text-sm leading-tight group-hover:text-electric-blue transition-colors line-clamp-2",
                      isUniformLayout ? "min-h-[40px]" : ""
                    )}>
                      {product.brand} {product.name}
                    </h3>
                    {'category' in product && (
                      <p className="text-xs text-gray-600 line-clamp-1 min-h-[16px]">
                        {product.material && `Material: ${product.material}`}
                        {product.fitment && `, Fitment: ${product.fitment}`}
                      </p>
                    )}
                  </div>
                  <div className="flex items-baseline justify-center gap-2">
                    {discountInfo.hasDiscount && (
                      <p className="text-xs text-gray-500 line-through">
                        AED {discountInfo.originalPrice.toFixed(2)}
                      </p>
                    )}
                    <p className={`text-sm font-bold ${discountInfo.hasDiscount ? 'text-red-600' : 'text-electric-blue'}`}>
                      AED {product.price.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <Link href={`/accessory/${product.id}`} className="block focus:outline-none focus:ring-2 focus:ring-electric-blue rounded-lg group h-full flex flex-col">
                {/* Product Image for Accessory */}
                <div className="relative h-40 flex items-center justify-center overflow-hidden rounded-lg border border-gray-200 bg-white group-hover:border-electric-blue transition-colors mb-2">
                  <img 
                    src={product.imageUrl || "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"}
                    alt={product.name}
                    className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform"
                  />
                  {/* Discount Badge for Accessories */}
                  {discountInfo.hasDiscount && (
                    <div className="absolute top-1 right-1 bg-red-600 text-white px-1.5 py-0.5 rounded text-xs font-semibold">
                      -{discountInfo.discountPercent}%
                    </div>
                  )}
                </div>
                {/* Product Info for Accessory */}
                <div className="mt-2 space-y-1 flex flex-col flex-grow">
                  <div className="flex-grow">
                    <h3 className={cn(
                      "font-orbitron font-bold text-future-black text-sm leading-tight group-hover:text-electric-blue transition-colors line-clamp-2",
                      isUniformLayout ? "min-h-[40px]" : ""
                    )}>
                      {product.brand} {product.name}
                    </h3>
                    {'category' in product && (
                      <p className="text-xs text-gray-600 line-clamp-1 min-h-[16px]">
                        {product.material && `Material: ${product.material}`}
                        {product.fitment && `, Fitment: ${product.fitment}`}
                      </p>
                    )}
                  </div>
                  <div className="flex items-baseline justify-center gap-2">
                    {discountInfo.hasDiscount && (
                      <p className="text-xs text-gray-500 line-through">
                        AED {discountInfo.originalPrice.toFixed(2)}
                      </p>
                    )}
                    <p className={`text-sm font-bold ${discountInfo.hasDiscount ? 'text-red-600' : 'text-electric-blue'}`}>
                      AED {product.price.toFixed(2)}
                    </p>
                  </div>
                </div>
              </Link>
            )
          )}
        </div>
        
        {/* Bottom Section */}
        <div className="mt-2 flex items-center justify-between gap-2">
          <Badge 
            variant={isOutOfStock ? "destructive" : "default"}
            className={`text-xs py-0.5 ${isOutOfStock ? "bg-red-500" : "bg-green-500"}`}
          >
            {isOutOfStock ? "Out of Stock" : "In Stock"}
          </Badge>
          
          <Button 
            size="sm"
            variant="default"
            className="bg-electric-blue hover:bg-electric-blue-dark text-xs py-1 h-auto" 
            onClick={handleAddToCart}
            disabled={isOutOfStock}
          >
            {isOutOfStock ? "Out of Stock" : "Add to Cart"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

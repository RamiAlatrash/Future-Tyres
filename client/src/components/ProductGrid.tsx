import { Skeleton } from "@/components/ui/skeleton";
import ProductCard from "@/components/ProductCard";
import { Tyre, Accessory } from "@shared/schema";

interface ProductGridProps {
  products: (Tyre | Accessory)[];
  isLoading: boolean;
  type: "tyre" | "accessory";
}

export default function ProductGrid({ products, isLoading, type }: ProductGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="space-y-4">
            <Skeleton className="h-48 w-full rounded-lg" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-8 w-full" />
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">No products found matching your criteria.</p>
        <p className="text-gray-400 text-sm mt-2">Try adjusting your filters or search terms.</p>
      </div>
    );
  }

  const gridCols = type === "tyre" 
    ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" 
    : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3";

  return (
    <div className={`grid ${gridCols} gap-6 mb-8`}>
      {products.map((product) => (
        <ProductCard 
          key={product.id} 
          product={product} 
          type={type}
        />
      ))}
    </div>
  );
}

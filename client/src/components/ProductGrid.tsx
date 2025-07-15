import ProductCard from "@/components/ProductCard";
import { Accessory, Tyre } from "@shared/schema";

interface ProductGridProps {
  products: (Tyre | Accessory)[];
  isLoading: boolean;
  type: "tyre" | "accessory" | "search";
  getProductType?: (product: Tyre | Accessory) => "tyre" | "accessory";
}

export default function ProductGrid({ products, isLoading, type, getProductType }: ProductGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((key) => (
          <div key={key} className="animate-pulse">
            <div className="bg-gray-200 h-64 rounded-lg mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
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
      {products.map((product, index) => {
        const productType = type === 'search' && getProductType ? getProductType(product) : type;
        if (productType === 'search') return null; // Should not happen with the logic above
        return (
          <div key={index} className="flex flex-col">
            <ProductCard
              product={product}
              type={productType}
            />
          </div>
        )
      })}
    </div>
  );
}

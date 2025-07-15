import ProductGrid from "@/components/ProductGrid";
import { allMockAccessories as staticAccessories } from "@/data/accessories";
import { staticTyres } from "@/data/tyres";
import { Accessory, Tyre } from "@shared/schema";
import { useSearchParams } from "wouter";

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("query") || "";

  const searchResults = (query: string): (Tyre | Accessory)[] => {
    if (!query) return [];

    const lowercasedQuery = query.toLowerCase();

    const filteredTyres = staticTyres.filter(tyre =>
      tyre.name.toLowerCase().includes(lowercasedQuery) ||
      tyre.brand.toLowerCase().includes(lowercasedQuery)
    );

    const filteredAccessories = staticAccessories.filter(accessory =>
      accessory.name.toLowerCase().includes(lowercasedQuery) ||
      accessory.brand.toLowerCase().includes(lowercasedQuery) ||
      accessory.category.toLowerCase().includes(lowercasedQuery)
    );

    return [...filteredTyres, ...filteredAccessories];
  };

  const results = searchResults(query);

  const getProductType = (product: Tyre | Accessory): 'tyre' | 'accessory' => {
    return 'size' in product ? 'tyre' : 'accessory';
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">
        Search Results for "{query}"
      </h1>
      {results.length > 0 ? (
        <ProductGrid
          products={results}
          isLoading={false}
          type="search"
          getProductType={getProductType}
        />
      ) : (
        <p>No results found.</p>
      )}
    </div>
  );
} 
import BrandGrid from "@/components/BrandGrid";
import FilterSidebar from "@/components/FilterSidebar";
import ProductGrid from "@/components/ProductGrid";
import SearchWidget from "@/components/SearchWidget";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLanguage } from '@/contexts/LanguageContext';
import { staticTyres } from "@/data/tyres";
import { Tyre } from "@shared/schema";
import { SlidersHorizontal, Tag } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useLocation, useSearchParams } from "wouter";

const ITEMS_PER_PAGE = 12;

export default function TyresPage() {
  const { t } = useLanguage();
  const [location] = useLocation();
  const [searchParams] = useSearchParams();
  const [tyres, setTyres] = useState<Tyre[]>([]);
  const [isFilterSidebarOpen, setIsFilterSidebarOpen] = useState(false);

  const allPrices = staticTyres.map(p => p.price);
  const minProductPrice = Math.min(...allPrices);
  const maxProductPrice = Math.max(...allPrices);

  const [filters, setFilters] = useState({
    brand: "",
    minPrice: minProductPrice,
    maxPrice: maxProductPrice,
    search: "",
    sort: "relevance",
    years: [] as number[],
    tyreSize: "",
    loadIndex: "",
    oem: [] as string[],
    origin: [] as string[],
    isRunFlat: false,
    promotion: [] as string[],
    pattern: [] as string[],
    warrantyPeriod: [] as string[],
    performance: [] as string[],
    dealsOnly: false,
  });

  const [currentPage, setCurrentPage] = useState(1);

  // Always show discount alert for Continental
  const [showDiscountAlert] = useState(true);

  // Parse URL parameters on mount and when they change
  useEffect(() => {
    setFilters(prev => ({
      ...prev,
      search: searchParams.get('productName') || searchParams.get('size') || searchParams.get('search') || '',
      dealsOnly: searchParams.get('deals') === 'true',
      brand: searchParams.get('brand') || '',
    }));
  }, [searchParams]);

  // Always apply discount to Continental tires
  const processedTyres = staticTyres.map(tyre => {
    if (tyre.brand === "Continental") {
      const discountedPrice = Math.round(tyre.price * 0.75); // 25% discount
      return {
        ...tyre,
        originalPrice: tyre.price,
        price: discountedPrice
      };
    }
    return tyre;
  });

  // Extract unique brands with counts and imageUrls
  const brands = useMemo(() => {
    const brandMap = new Map();
    processedTyres.forEach(tyre => {
      if (brandMap.has(tyre.brand)) {
        brandMap.get(tyre.brand).count++;
      } else {
        brandMap.set(tyre.brand, {
          name: tyre.brand,
          imageUrl: tyre.brandImageUrl || `https://via.placeholder.com/160x80/ffffff/333333?text=${encodeURIComponent(tyre.brand)}&font=Arial&size=14`,
          count: 1
        });
      }
    });
    return Array.from(brandMap.values()).sort((a, b) => a.name.localeCompare(b.name));
  }, [processedTyres]);

  // Log all processed tyres
  console.log("All processed tyres:", processedTyres.map(t => ({
    name: t.name,
    brand: t.brand,
    price: t.price,
    originalPrice: (t as any).originalPrice
  })));

  // Helper function to parse size into components
  const parseTyreSize = (size: string) => {
    // Format example: "205/55 R16"
    const match = size.match(/^(\d+)\/(\d+)\s*R(\d+)$/);
    if (match) {
      return {
        width: match[1], // e.g., "205"
        profile: match[2], // e.g., "55"
        rim: match[3] // e.g., "16"
      };
    }
    return null;
  };

  // Filter and sort tyres based on current filters
  const filteredTyres = processedTyres.filter(tyre => {
    if (filters.brand && !tyre.brand.toLowerCase().includes(filters.brand.toLowerCase())) return false;
    if (tyre.price < filters.minPrice || tyre.price > filters.maxPrice) return false;
    if (filters.years.length > 0 && (tyre.year == null || !filters.years.includes(tyre.year))) return false;
    if (filters.tyreSize && tyre.size !== filters.tyreSize) return false;
    if (filters.loadIndex && tyre.loadIndex !== filters.loadIndex) return false;
    if (filters.oem.length > 0 && (tyre.oem == null || !filters.oem.includes(tyre.oem))) return false;
    if (filters.origin.length > 0 && (tyre.origin == null || !filters.origin.includes(tyre.origin))) return false;
    if (filters.isRunFlat && !tyre.isRunFlat) return false;
    if (filters.promotion.length > 0 && (tyre.promotion == null || !filters.promotion.includes(tyre.promotion))) return false;
    if (filters.pattern.length > 0 && (tyre.pattern == null || !filters.pattern.includes(tyre.pattern))) return false;
    if (filters.warrantyPeriod.length > 0 && (tyre.warrantyPeriod == null || !filters.warrantyPeriod.includes(tyre.warrantyPeriod))) return false;
    if (filters.performance.length > 0 && (tyre.performance == null || !filters.performance.includes(tyre.performance))) return false;
    
    // Deals filter - show only tyres with promotions or Continental brand (has automatic discount)
    if (filters.dealsOnly) {
      const hasPromotion = tyre.promotion && tyre.promotion !== "";
      const isContinental = tyre.brand === "Continental";
      if (!hasPromotion && !isContinental) return false;
    }

    if (filters.search) {
      const normalize = (str: string) => str.toLowerCase().replace(/[^a-z0-9]/g, '');
      const searchLower = normalize(filters.search);

      if (!searchLower) return true;

      const nameNormalized = normalize(tyre.name);
      const brandNormalized = normalize(tyre.brand);
      const sizeNormalized = normalize(tyre.size);

      return (
        nameNormalized.includes(searchLower) ||
        brandNormalized.includes(searchLower) ||
        sizeNormalized.includes(searchLower)
      );
    }
    return true;
  });

  const sortedTyres = filters.sort === 'relevance'
    ? filteredTyres
    : [...filteredTyres].sort((a, b) => {
      switch (filters.sort) {
        case "price-asc":
          return a.price - b.price;
        case "price-desc":
          return b.price - a.price;
        case "name":
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

  const totalPages = Math.ceil(sortedTyres.length / ITEMS_PER_PAGE);

  const paginatedTyres = sortedTyres.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleFilterChange = (key: string, value: any) => {
    setCurrentPage(1); // Reset to first page on filter change
    if (key === 'priceRange') {
      setFilters(prev => ({ ...prev, minPrice: value[0], maxPrice: value[1] }));
    } else {
      setFilters(prev => ({ ...prev, [key]: value }));
    }
  };

  const clearFilters = () => {
    setCurrentPage(1); // Reset to first page on clear
    setFilters({
      brand: "",
      minPrice: minProductPrice,
      maxPrice: maxProductPrice,
      search: "",
      sort: "relevance",
      years: [],
      tyreSize: "",
      loadIndex: "",
      oem: [],
      origin: [],
      isRunFlat: false,
      promotion: [],
      pattern: [],
      warrantyPeriod: [],
      performance: [],
      dealsOnly: false,
    });
  };

  const handleBrandSelect = (brandName: string) => {
    // Navigate to a new page with brand filter
    window.location.href = `/tyres?brand=${encodeURIComponent(brandName)}`;
  };

  return (
    <div className="container mx-auto px-4 py-8 pb-40">
      {/* Discount Alert */}
      {showDiscountAlert && (
        <Alert className="mb-6 bg-green-50 border-green-200">
          <Tag className="h-4 w-4 text-green-600" />
          <AlertTitle className="text-green-800">{t('specialDeal')}</AlertTitle>
          <AlertDescription className="text-green-700">
            {t('specialDealOffer')}
          </AlertDescription>
        </Alert>
      )}

      {/* Mobile Filter Drawer */}
      {isFilterSidebarOpen && (
        <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" 
            onClick={() => setIsFilterSidebarOpen(false)}
        >
            <div 
                className="fixed inset-y-0 left-0 w-4/5 max-w-md bg-white z-50 p-4 overflow-y-auto" 
                onClick={(e) => e.stopPropagation()}
            >
                <FilterSidebar
                    filters={filters}
                    onFilterChange={handleFilterChange}
                    onClearFilters={clearFilters}
                    type="tyres"
                    allProducts={processedTyres}
                    filteredProducts={filteredTyres}
                />
            </div>
        </div>
      )}

      {/* Breadcrumb */}
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Tyres</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {filters.brand ? (
        // Brand-specific header
        <div className="mb-12">
            <div className="bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl p-6 mb-6 shadow-md">
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        {/* Brand Logo and Name - FIXED */}
                        {(() => {
                          // Find the brand object from the brands array
                          // (No image rendering)
                          return (
                            <>
                              <div>
                                <h1 className="font-orbitron text-2xl font-bold mb-1">{filters.brand} Tyres</h1>
                                <p className="text-red-100 text-base">Premium {filters.brand} automotive tyres</p>
                              </div>
                            </>
                          );
                        })()}
                    </div>
                    <button
                        onClick={() => window.location.href = '/tyres'}
                        className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-300 text-sm"
                    >
                        View All Brands
                    </button>
                </div>
            </div>
        </div>
      ) : (
        // Default header with brand grid
        <>
          <h1 className="font-orbitron text-4xl font-bold text-future-black mb-8">{t('tyresPage.shop_tyres')}</h1>
          
          {/* Brand Grid Section */}
          <BrandGrid 
            brands={brands} 
            onBrandSelect={handleBrandSelect}
          />
        </>
      )}
      
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Desktop Filters Sidebar */}
        <aside className="hidden lg:block lg:w-1/4">
          <FilterSidebar
            filters={filters}
            onFilterChange={handleFilterChange}
            onClearFilters={clearFilters}
            type="tyres"
            allProducts={processedTyres}
            filteredProducts={filteredTyres}
          />
        </aside>
        
        {/* Main Content */}
        <main className="w-full lg:w-3/4">
          {/* Search, Sort, and Mobile Filter Button Bar */}
          <div className="flex flex-col lg:flex-row gap-4 mb-8">
             <Button 
                variant="outline" 
                className="lg:hidden flex items-center justify-between text-base text-gray-500 font-normal h-12" 
                onClick={() => setIsFilterSidebarOpen(true)}
            >
                <span>Filters</span>
                <SlidersHorizontal className="h-5 w-5" />
            </Button>
            <Input
              placeholder="Search by size or keyword"
              value={filters.search}
              onChange={(e) => handleFilterChange("search", e.target.value)}
              className="flex-1 focus:border-electric-blue h-12"
            />
            <Select value={filters.sort} onValueChange={(value) => handleFilterChange("sort", value)}>
              <SelectTrigger className="w-full lg:w-64 h-12">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent position="popper" sideOffset={5}>
                <SelectItem value="relevance">Relevance</SelectItem>
                <SelectItem value="price-asc">Price: Low to High</SelectItem>
                <SelectItem value="price-desc">Price: High to Low</SelectItem>
                <SelectItem value="name">Name A-Z</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {/* Product Grid */}
          <ProductGrid products={paginatedTyres} isLoading={false} type="tyre" />

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="mt-8">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        handlePageChange(currentPage - 1);
                      }}
                      className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>
                  {[...Array(totalPages)].map((_, i) => (
                    <PaginationItem key={i}>
                      <PaginationLink
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          handlePageChange(i + 1);
                        }}
                        isActive={currentPage === i + 1}
                      >
                        {i + 1}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        handlePageChange(currentPage + 1);
                      }}
                      className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </main>
      </div>

      <div className="fixed bottom-0 left-0 w-full bg-white z-40 border-t-4 border-electric-blue">
          <div className="container mx-auto py-3">
            <SearchWidget variant="footer" />
          </div>
      </div>

    </div>
  );
}

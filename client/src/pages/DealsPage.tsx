import ProductCard from "@/components/ProductCard";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getCurrentDeals, Deal } from "@/data/deals";
import { ChevronDown, ChevronUp, SlidersHorizontal, Tag } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "wouter";

const ITEMS_PER_PAGE = 16;

export default function DealsPage() {
  const [searchParams] = useSearchParams();
  const [deals] = useState<Deal[]>(() => getCurrentDeals());
  const [isFilterSidebarOpen, setIsFilterSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const [filters, setFilters] = useState({
    search: "",
    productType: "all", // all, tyre, accessory
    brand: "all",
    category: "all",
    discountRange: "all", // all, 10-19, 20-29, 30-39, 40-49, 50+
    minPrice: 0,
    maxPrice: 10000,
    sort: "discount-desc" // discount-desc, discount-asc, price-asc, price-desc, name
  });

  const [expandedSections, setExpandedSections] = useState({
    productType: true,
    brand: false,
    category: false,
    discount: false,
    price: false,
  });

  // Parse URL parameters
  useEffect(() => {
    const searchParam = searchParams.get('search');
    const categoryParam = searchParams.get('category');
    const typeParam = searchParams.get('type');
    const brandParam = searchParams.get('brand');
    
    if (searchParam) {
      setFilters(prev => ({ ...prev, search: searchParam }));
    }
    if (categoryParam) {
      setFilters(prev => ({ ...prev, category: categoryParam }));
    }
    if (typeParam) {
      setFilters(prev => ({ ...prev, productType: typeParam }));
    }
    if (brandParam) {
      setFilters(prev => ({ ...prev, brand: brandParam }));
    }
  }, [searchParams]);

  // Get unique categories and brands from deals
  const categories = useMemo(() => {
    const tyreCategories = deals
      .filter(deal => deal.productType === 'tyre')
      .map(deal => deal.product.type || 'All-Season')
      .filter((value, index, self) => self.indexOf(value) === index);
    
    const accessoryCategories = deals
      .filter(deal => deal.productType === 'accessory')
      .map(deal => (deal.product as any).category)
      .filter((value, index, self) => self.indexOf(value) === index);

    return [...tyreCategories, ...accessoryCategories].sort();
  }, [deals]);

  const brands = useMemo(() => {
    return [...new Set(deals.map(deal => deal.product.brand))].sort();
  }, [deals]);

  // Filter deals
  const filteredDeals = useMemo(() => {
    return deals.filter(deal => {
      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        if (!deal.title.toLowerCase().includes(searchLower) &&
            !deal.description.toLowerCase().includes(searchLower)) {
          return false;
        }
      }

      // Product type filter
      if (filters.productType !== "all" && deal.productType !== filters.productType) {
        return false;
      }

      // Brand filter
      if (filters.brand !== "all" && deal.product.brand !== filters.brand) {
        return false;
      }

      // Category filter
      if (filters.category !== "all") {
        if (deal.productType === 'tyre') {
          const tyreType = deal.product.type || 'All-Season';
          if (tyreType !== filters.category) return false;
        } else {
          const accessoryCategory = (deal.product as any).category;
          if (accessoryCategory !== filters.category) return false;
        }
      }

      // Discount range filter
      if (filters.discountRange !== "all") {
        const discount = deal.discountPercent;
        switch (filters.discountRange) {
          case "10-19":
            if (discount < 10 || discount >= 20) return false;
            break;
          case "20-29":
            if (discount < 20 || discount >= 30) return false;
            break;
          case "30-39":
            if (discount < 30 || discount >= 40) return false;
            break;
          case "40-49":
            if (discount < 40 || discount >= 50) return false;
            break;
          case "50+":
            if (discount < 50) return false;
            break;
        }
      }

      // Price filter
      if (deal.salePrice < filters.minPrice || deal.salePrice > filters.maxPrice) {
        return false;
      }

      return true;
    });
  }, [deals, filters]);

  // Sort deals
  const sortedDeals = useMemo(() => {
    const sorted = [...filteredDeals];
    switch (filters.sort) {
      case "discount-desc":
        return sorted.sort((a, b) => b.discountPercent - a.discountPercent);
      case "discount-asc":
        return sorted.sort((a, b) => a.discountPercent - b.discountPercent);
      case "price-asc":
        return sorted.sort((a, b) => a.salePrice - b.salePrice);
      case "price-desc":
        return sorted.sort((a, b) => b.salePrice - a.salePrice);
      case "name":
        return sorted.sort((a, b) => a.title.localeCompare(b.title));
      default:
        return sorted;
    }
  }, [filteredDeals, filters.sort]);

  // Pagination
  const totalPages = Math.ceil(sortedDeals.length / ITEMS_PER_PAGE);
  const paginatedDeals = sortedDeals.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleFilterChange = (key: string, value: any) => {
    setCurrentPage(1);
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setCurrentPage(1);
    setFilters({
      search: "",
      productType: "all",
      brand: "all",
      category: "all",
      discountRange: "all",
      minPrice: 0,
      maxPrice: 10000,
      sort: "discount-desc"
    });
  };

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const getProductType = (product: any): 'tyre' | 'accessory' => {
    return 'size' in product ? 'tyre' : 'accessory';
  };

  const FilterSection = ({ 
    title, 
    section, 
    children 
  }: { 
    title: string; 
    section: keyof typeof expandedSections; 
    children: React.ReactNode;
  }) => (
    <div className="border rounded-md">
      <button
        onClick={() => toggleSection(section)}
        className="w-full flex items-center justify-between p-3 hover:bg-gray-50 transition-colors"
      >
        <Label className="font-medium text-future-black cursor-pointer">{title}</Label>
        {expandedSections[section] ? (
          <ChevronUp className="h-4 w-4 text-gray-500" />
        ) : (
          <ChevronDown className="h-4 w-4 text-gray-500" />
        )}
      </button>
      {expandedSections[section] && (
        <div className="p-3 border-t bg-gray-50">
          {children}
        </div>
      )}
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8 pb-40">
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
            {/* Mobile filters content */}
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
            <BreadcrumbPage>Deals</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <Tag className="h-8 w-8 text-red-600" />
        <h1 className="font-orbitron text-4xl font-bold text-future-black">All Deals</h1>
      </div>
      
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Desktop Filters Sidebar */}
        <aside className="hidden lg:block lg:w-1/4">
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle className="font-orbitron text-lg">Filters</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Product Type Filter */}
              <FilterSection title="Product Type" section="productType">
                <div className="space-y-2">
                  {[
                    { value: "all", label: "All Products" },
                    { value: "tyre", label: "Tyres" },
                    { value: "accessory", label: "Accessories" }
                  ].map(option => (
                    <div key={option.value} className="flex items-center space-x-2">
                      <Checkbox
                        id={`type-${option.value}`}
                        checked={filters.productType === option.value}
                        onCheckedChange={() => handleFilterChange("productType", option.value)}
                      />
                      <Label htmlFor={`type-${option.value}`} className="text-sm cursor-pointer">
                        {option.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </FilterSection>

              {/* Brand Filter */}
              <FilterSection title="Brand" section="brand">
                <ScrollArea className="h-[200px]">
                  <div className="space-y-2 pr-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="brand-all"
                        checked={filters.brand === "all"}
                        onCheckedChange={() => handleFilterChange("brand", "all")}
                      />
                      <Label htmlFor="brand-all" className="text-sm cursor-pointer">
                        All Brands
                      </Label>
                    </div>
                    {brands.map(brand => (
                      <div key={brand} className="flex items-center space-x-2">
                        <Checkbox
                          id={`brand-${brand}`}
                          checked={filters.brand === brand}
                          onCheckedChange={() => handleFilterChange("brand", brand)}
                        />
                        <Label htmlFor={`brand-${brand}`} className="text-sm cursor-pointer">
                          {brand}
                        </Label>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </FilterSection>

              {/* Category Filter */}
              <FilterSection title="Category" section="category">
                <ScrollArea className="h-[200px]">
                  <div className="space-y-2 pr-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="category-all"
                        checked={filters.category === "all"}
                        onCheckedChange={() => handleFilterChange("category", "all")}
                      />
                      <Label htmlFor="category-all" className="text-sm cursor-pointer">
                        All Categories
                      </Label>
                    </div>
                    {categories.map(category => (
                      <div key={category} className="flex items-center space-x-2">
                        <Checkbox
                          id={`category-${category}`}
                          checked={filters.category === category}
                          onCheckedChange={() => handleFilterChange("category", category)}
                        />
                        <Label htmlFor={`category-${category}`} className="text-sm cursor-pointer">
                          {category}
                        </Label>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </FilterSection>

              {/* Discount Range Filter */}
              <FilterSection title="Discount Range" section="discount">
                <div className="space-y-2">
                  {[
                    { value: "all", label: "All Discounts" },
                    { value: "10-19", label: "10% - 19%" },
                    { value: "20-29", label: "20% - 29%" },
                    { value: "30-39", label: "30% - 39%" },
                    { value: "40-49", label: "40% - 49%" },
                    { value: "50+", label: "50% and above" }
                  ].map(option => (
                    <div key={option.value} className="flex items-center space-x-2">
                      <Checkbox
                        id={`discount-${option.value}`}
                        checked={filters.discountRange === option.value}
                        onCheckedChange={() => handleFilterChange("discountRange", option.value)}
                      />
                      <Label htmlFor={`discount-${option.value}`} className="text-sm cursor-pointer">
                        {option.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </FilterSection>

              {/* Clear Filters Button */}
              <Button 
                variant="ghost" 
                onClick={clearFilters} 
                className="w-full justify-center text-sm text-gray-600 hover:bg-gray-100"
              >
                Clear All Filters
              </Button>
            </CardContent>
          </Card>
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
              placeholder="Search deals..."
              value={filters.search}
              onChange={(e) => handleFilterChange("search", e.target.value)}
              className="flex-1 focus:border-electric-blue h-12"
            />
            <Select value={filters.sort} onValueChange={(value) => handleFilterChange("sort", value)}>
              <SelectTrigger className="w-full lg:w-64 h-12">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent position="popper" sideOffset={5}>
                <SelectItem value="discount-desc">Highest Discount</SelectItem>
                <SelectItem value="discount-asc">Lowest Discount</SelectItem>
                <SelectItem value="price-asc">Price: Low to High</SelectItem>
                <SelectItem value="price-desc">Price: High to Low</SelectItem>
                <SelectItem value="name">Name A-Z</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Results count */}
          <div className="mb-6">
            <p className="text-gray-600">
              Showing {paginatedDeals.length} of {sortedDeals.length} deals
            </p>
          </div>
          
          {/* Product Grid */}
          {paginatedDeals.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No deals found matching your criteria.</p>
              <p className="text-gray-400 text-sm mt-2">Try adjusting your filters or search terms.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {paginatedDeals.map((deal) => (
                <ProductCard
                  key={deal.id}
                  product={deal.product}
                  type={deal.productType}
                  layout="uniform"
                />
              ))}
            </div>
          )}

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
    </div>
  );
} 
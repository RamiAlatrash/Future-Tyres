import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import FilterSidebar from "@/components/FilterSidebar";
import ProductGrid from "@/components/ProductGrid";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";

export default function TyresPage() {
  const [location] = useLocation();
  const [filters, setFilters] = useState({
    brand: "",
    type: "",
    minPrice: 0,
    maxPrice: 2000,
    search: "",
    sort: "price-asc",
  });

  // Parse URL parameters on mount
  useEffect(() => {
    const params = new URLSearchParams(location.split('?')[1] || '');
    setFilters(prev => ({
      ...prev,
      search: params.get('size') || params.get('search') || '',
    }));
  }, [location]);

  const { data: tyres = [], isLoading } = useQuery({
    queryKey: ["/api/tyres", filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value && value !== 0) {
          params.append(key, value.toString());
        }
      });
      
      const response = await fetch(`/api/tyres?${params}`);
      if (!response.ok) throw new Error('Failed to fetch tyres');
      return response.json();
    },
  });

  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      brand: "",
      type: "",
      minPrice: 0,
      maxPrice: 2000,
      search: "",
      sort: "price-asc",
    });
  };

  const sortedTyres = [...tyres].sort((a, b) => {
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

  return (
    <div className="container mx-auto px-4 py-8">
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

      <h1 className="font-orbitron text-4xl font-bold text-future-black mb-8">Shop Tyres</h1>
      
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar */}
        <div className="lg:w-1/4">
          <FilterSidebar
            filters={filters}
            onFilterChange={handleFilterChange}
            onClearFilters={clearFilters}
            type="tyres"
          />
        </div>
        
        {/* Main Content */}
        <div className="lg:w-3/4">
          {/* Search and Sort Bar */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <Input
              placeholder="Search by size or keyword"
              value={filters.search}
              onChange={(e) => handleFilterChange("search", e.target.value)}
              className="flex-1 focus:border-electric-blue"
            />
            <Select value={filters.sort} onValueChange={(value) => handleFilterChange("sort", value)}>
              <SelectTrigger className="w-full sm:w-64">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="price-asc">Price: Low to High</SelectItem>
                <SelectItem value="price-desc">Price: High to Low</SelectItem>
                <SelectItem value="name">Name A-Z</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {/* Product Grid */}
          <ProductGrid products={sortedTyres} isLoading={isLoading} type="tyre" />
        </div>
      </div>
    </div>
  );
}

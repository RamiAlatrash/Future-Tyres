import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import FilterSidebar from "@/components/FilterSidebar";
import ProductGrid from "@/components/ProductGrid";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";

export default function AccessoriesPage() {
  const [activeCategory, setActiveCategory] = useState("All Accessories");
  const [filters, setFilters] = useState({
    brand: "",
    category: "",
    minPrice: 100,
    maxPrice: 10000,
    search: "",
  });

  const categories = ["All Accessories", "Bumpers", "Lighting", "Lift Kits", "Roof Racks", "Wheel Spacers"];

  const { data: accessories = [], isLoading } = useQuery({
    queryKey: ["/api/accessories", filters, activeCategory],
    queryFn: async () => {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value && value !== 0) {
          params.append(key, value.toString());
        }
      });
      
      if (activeCategory !== "All Accessories") {
        params.append("category", activeCategory);
      }
      
      const response = await fetch(`/api/accessories?${params}`);
      if (!response.ok) throw new Error('Failed to fetch accessories');
      return response.json();
    },
  });

  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      brand: "",
      category: "",
      minPrice: 100,
      maxPrice: 10000,
      search: "",
    });
    setActiveCategory("All Accessories");
  };

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
            <BreadcrumbPage>Accessories</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <h1 className="font-orbitron text-4xl font-bold text-future-black mb-8">Automotive Accessories</h1>
      <p className="text-gray-600 text-xl mb-12">Enhance your vehicle with premium accessories</p>
      
      {/* Category Tabs */}
      <div className="flex flex-wrap justify-center gap-4 mb-12">
        {categories.map((category) => (
          <Button
            key={category}
            variant={activeCategory === category ? "default" : "outline"}
            className={`px-6 py-3 font-orbitron font-medium ${
              activeCategory === category 
                ? "bg-electric-blue text-white" 
                : "border-gray-300 text-gray-700 hover:bg-gray-50"
            }`}
            onClick={() => setActiveCategory(category)}
          >
            {category}
          </Button>
        ))}
      </div>
      
      {/* Search and Filter Row */}
      <div className="flex flex-col md:flex-row gap-4 mb-8 max-w-4xl mx-auto">
        <Input
          placeholder="Search accessories..."
          value={filters.search}
          onChange={(e) => handleFilterChange("search", e.target.value)}
          className="flex-1 focus:border-electric-blue"
        />
        
        <div className="flex-1">
          <Slider
            value={[filters.minPrice, filters.maxPrice]}
            onValueChange={([min, max]) => {
              handleFilterChange("minPrice", min);
              handleFilterChange("maxPrice", max);
            }}
            max={10000}
            min={100}
            step={100}
            className="w-full"
          />
          <div className="flex justify-between text-sm text-gray-600 mt-1">
            <span>AED {filters.minPrice}</span>
            <span>AED {filters.maxPrice}</span>
          </div>
        </div>
        
        <Select value={filters.brand} onValueChange={(value) => handleFilterChange("brand", value)}>
          <SelectTrigger className="w-full md:w-48">
            <SelectValue placeholder="All Brands" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Brands</SelectItem>
            <SelectItem value="ARB">ARB</SelectItem>
            <SelectItem value="TJM">TJM</SelectItem>
            <SelectItem value="Thule">Thule</SelectItem>
            <SelectItem value="Yakima">Yakima</SelectItem>
          </SelectContent>
        </Select>
        
        <Button 
          variant="ghost" 
          onClick={clearFilters}
          className="text-red-500 hover:text-red-700"
        >
          Clear Filters
        </Button>
      </div>
      
      {/* Product Grid */}
      <ProductGrid products={accessories} isLoading={isLoading} type="accessory" />
      
      {/* Load More Button */}
      {accessories.length > 0 && (
        <div className="text-center">
          <Button className="bg-electric-blue hover:bg-electric-blue-dark text-white px-8 py-3 rounded-full font-medium transform hover:scale-105">
            Load More Products
          </Button>
        </div>
      )}
    </div>
  );
}

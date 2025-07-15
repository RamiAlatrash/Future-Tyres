import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Accessory, Tyre } from "@shared/schema";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { PriceFilter } from "./PriceFilter";

interface FilterSidebarProps {
  filters: {
    brand: string;
    minPrice: number;
    maxPrice: number;
    years: number[];
    tyreSize: string;
    loadIndex: string;
    oem: string[];
    origin: string[];
    isRunFlat: boolean;
    promotion: string[];
    pattern: string[];
    warrantyPeriod: string[];
    performance: string[];
    dealsOnly: boolean;
    [key: string]: any;
  };
  onFilterChange: (key: string, value: any) => void;
  onClearFilters: () => void;
  type: "tyres" | "accessories";
  allProducts: (Tyre | Accessory)[];
  filteredProducts: (Tyre | Accessory)[];
}

export default function FilterSidebar({
  filters,
  onFilterChange,
  onClearFilters,
  type,
  allProducts,
  filteredProducts,
}: FilterSidebarProps) {
  // Search states for each filter
  const [brandSearch, setBrandSearch] = useState("");
  const [oemSearch, setOemSearch] = useState("");
  const [originSearch, setOriginSearch] = useState("");
  const [promotionSearch, setPromotionSearch] = useState("");
  const [patternSearch, setPatternSearch] = useState("");
  const [warrantySearch, setWarrantySearch] = useState("");
  const [performanceSearch, setPerformanceSearch] = useState("");

  // Collapse states
  const [expandedSections, setExpandedSections] = useState({
    brand: true,
    deals: false,
    price: false,
    year: false,
    tyreSize: false,
    loadIndex: false,
    oem: false,
    origin: false,
    runFlat: false,
    promotion: false,
    pattern: false,
    warrantyPeriod: false,
    performance: false,
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Premium brands to highlight
  const premiumBrands = ["Bridgestone", "Continental", "Michelin"];
  
  const accessoryBrands = ["ARB", "TJM", "Thule", "Yakima"];
  const accessoryCategories = ["Bumpers", "Lighting", "Lift Kits", "Roof Racks", "Wheel Spacers"];

  // Dynamically generate filter options from ALL products
  const tyreBrands = Array.from(new Set(allProducts.map(p => p.brand as string))).sort();
  const tyreYears = Array.from(new Set(allProducts.filter(p => 'year' in p && p.year).map(p => (p as Tyre).year!))).sort((a, b) => b - a);
  
  const allPrices = allProducts.map(p => p.price);
  const minPrice = Math.min(...allPrices);
  const maxPrice = Math.max(...allPrices);
  
  const tyreSizes = Array.from(new Set(allProducts.filter(p => 'size' in p).map(p => (p as Tyre).size)));
  const loadIndexes = Array.from(new Set(allProducts.filter(p => 'loadIndex' in p && (p as Tyre).loadIndex).map(p => (p as Tyre).loadIndex!)));
  const oems = Array.from(new Set(allProducts.filter(p => 'oem' in p && (p as Tyre).oem).map(p => (p as Tyre).oem!)));
  const origins = Array.from(new Set(allProducts.filter(p => 'origin' in p && (p as Tyre).origin).map(p => (p as Tyre).origin!)));
  const promotions = Array.from(new Set(allProducts.filter(p => 'promotion' in p && (p as Tyre).promotion).map(p => (p as Tyre).promotion!)));
  const patterns = Array.from(new Set(allProducts.filter(p => 'pattern' in p && (p as Tyre).pattern).map(p => (p as Tyre).pattern!)));
  const warrantyPeriods = Array.from(new Set(allProducts.filter(p => 'warrantyPeriod' in p && (p as Tyre).warrantyPeriod).map(p => (p as Tyre).warrantyPeriod!)));
  const performances = Array.from(new Set(allProducts.filter(p => 'performance' in p && (p as Tyre).performance).map(p => (p as Tyre).performance!)));
  const hasRunFlat = allProducts.some(p => (p as Tyre).isRunFlat);

  // Generate counts from FILTERED products
  const getCounts = (products: (Tyre | Accessory)[]) => {
    const counts: { [key: string]: { [key: string]: number } } = {
      brand: {}, oem: {}, origin: {}, promotion: {}, pattern: {}, warrantyPeriod: {}, performance: {}, years: {}, runFlat: {}
    };

    products.forEach(p => {
      const tyre = p as Tyre;
      if (tyre.brand) counts.brand[tyre.brand] = (counts.brand[tyre.brand] || 0) + 1;
      if (tyre.oem) counts.oem[tyre.oem] = (counts.oem[tyre.oem] || 0) + 1;
      if (tyre.origin) counts.origin[tyre.origin] = (counts.origin[tyre.origin] || 0) + 1;
      if (tyre.promotion) counts.promotion[tyre.promotion] = (counts.promotion[tyre.promotion] || 0) + 1;
      if (tyre.pattern) counts.pattern[tyre.pattern] = (counts.pattern[tyre.pattern] || 0) + 1;
      if (tyre.warrantyPeriod) counts.warrantyPeriod[tyre.warrantyPeriod] = (counts.warrantyPeriod[tyre.warrantyPeriod] || 0) + 1;
      if (tyre.performance) counts.performance[tyre.performance] = (counts.performance[tyre.performance] || 0) + 1;
      if (tyre.year) counts.years[tyre.year] = (counts.years[tyre.year] || 0) + 1;
      if (tyre.isRunFlat) counts.runFlat["RunFlat"] = (counts.runFlat["RunFlat"] || 0) + 1;
    });
    return counts;
  }
  const counts = getCounts(filteredProducts);

  const brands = type === "tyres" ? tyreBrands : accessoryBrands;

  // Filter items based on search
  const filteredBrands = brands.filter(brand => 
    brand.toLowerCase().includes(brandSearch.toLowerCase())
  );
  const filteredOems = oems.filter(oem => oem.toLowerCase().includes(oemSearch.toLowerCase()));
  const filteredOrigins = origins.filter(origin => origin.toLowerCase().includes(originSearch.toLowerCase()));
  const filteredPromotions = promotions.filter(promotion => promotion.toLowerCase().includes(promotionSearch.toLowerCase()));
  const filteredPatterns = patterns.filter(pattern => pattern.toLowerCase().includes(patternSearch.toLowerCase()));
  const filteredWarranties = warrantyPeriods.filter(warranty => warranty.toLowerCase().includes(warrantySearch.toLowerCase()));
  const filteredPerformances = performances.filter(performance => performance.toLowerCase().includes(performanceSearch.toLowerCase()));

  const handleMultiCheckboxChange = (key: string, value: string, checked: boolean) => {
    const currentValues = filters[key] as string[] || [];
    if (checked) {
      onFilterChange(key, [...currentValues, value]);
    } else {
      onFilterChange(key, currentValues.filter(v => v !== value));
    }
  };

  const handleYearChange = (year: number, checked: boolean) => {
    if (checked) {
      onFilterChange("years", [...filters.years, year]);
    } else {
      onFilterChange("years", filters.years.filter(y => y !== year));
    }
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

  const MultiSelectFilter = ({
    title,
    section,
    items,
    search,
    onSearch,
    selectedItems,
    itemCounts,
  }: {
    title: string;
    section: keyof typeof expandedSections;
    items: string[];
    search: string;
    onSearch: (value: string) => void;
    selectedItems: string[];
    itemCounts: { [key: string]: number };
  }) => (
    <FilterSection title={title} section={section}>
      <div className="space-y-2">
        <Input
          placeholder={`Search ${title.toLowerCase()}...`}
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          className="mb-2"
        />
        <ScrollArea className="h-[150px]">
          <div className="space-y-2 pr-4">
            {items.map((item) => (
              <div key={item} className="flex items-center space-x-2">
                <Checkbox
                  id={`${section}-${item}`}
                  checked={selectedItems.includes(item)}
                  onCheckedChange={(checked) =>
                    handleMultiCheckboxChange(section, item, checked as boolean)
                  }
                  disabled={(itemCounts[item] || 0) === 0 && !selectedItems.includes(item)}
                />
                <Label
                  htmlFor={`${section}-${item}`}
                  className={`text-sm cursor-pointer ${(itemCounts[item] || 0) === 0 && !selectedItems.includes(item) ? 'text-gray-400' : ''}`}
                >
                  {item} ({itemCounts[item] || 0})
                </Label>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
    </FilterSection>
  );

  return (
    <Card className="sticky top-24">
      <CardHeader className="p-4">
        <CardTitle className="font-orbitron text-lg">Filters</CardTitle>
      </CardHeader>
      <CardContent className="p-4 space-y-3">
        {/* Brand Filter */}
        <FilterSection title="Brand" section="brand">
          <div className="space-y-2">
            <Input
              placeholder="Search brands..."
              value={brandSearch}
              onChange={(e) => setBrandSearch(e.target.value)}
              className="mb-2"
            />
            <ScrollArea className="h-[150px]">
              <div className="space-y-2 pr-4">
                <div className="flex items-center space-x-2 pb-2 border-b">
                  <Checkbox 
                    id="all-brands"
                    checked={filters.brand === ""}
                    onCheckedChange={(checked) => 
                      onFilterChange("brand", checked ? "" : filters.brand)
                    }
                  />
                  <Label htmlFor="all-brands" className="text-sm cursor-pointer">
                    All Brands
                  </Label>
                </div>
                {/* Premium Brands Section */}
                <div className="pb-2 border-b">
                  <Label className="text-xs text-muted-foreground mb-1 block">Premium Brands</Label>
                  {filteredBrands
                    .filter(brand => premiumBrands.includes(brand))
                    .map((brand) => (
                      <div key={brand} className="flex items-center space-x-2 py-1">
                        <Checkbox 
                          id={brand}
                          checked={filters.brand === brand}
                          onCheckedChange={(checked) => 
                            onFilterChange("brand", checked ? brand : "")
                          }
                        />
                        <Label htmlFor={brand} className="text-sm cursor-pointer font-medium text-primary">
                          {brand}
                        </Label>
                      </div>
                    ))}
                </div>
                {/* Other Brands */}
                {filteredBrands
                  .filter(brand => !premiumBrands.includes(brand))
                  .map((brand) => (
                    <div key={brand} className="flex items-center space-x-2">
                      <Checkbox 
                        id={brand}
                        checked={filters.brand === brand}
                        onCheckedChange={(checked) => 
                          onFilterChange("brand", checked ? brand : "")
                        }
                      />
                      <Label htmlFor={brand} className="text-sm cursor-pointer">
                        {brand}
                      </Label>
                    </div>
                  ))}
              </div>
            </ScrollArea>
          </div>
        </FilterSection>

        {/* Deals Filter */}
        <FilterSection title="Deals & Offers" section="deals">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="deals-only"
              checked={filters.dealsOnly}
              onCheckedChange={(checked) => onFilterChange("dealsOnly", checked)}
            />
            <Label htmlFor="deals-only" className="text-sm cursor-pointer">
              Show only products with deals ({
                type === "tyres" 
                  ? filteredProducts.filter(p => {
                      const tyre = p as Tyre;
                      return (tyre.promotion && tyre.promotion !== "") || 
                             (tyre.brand === "Continental"); // Continental has deals
                    }).length
                  : filteredProducts.filter(p => {
                      const accessory = p as Accessory;
                      return accessory.discount && accessory.discount > 0;
                    }).length
              })
            </Label>
          </div>
        </FilterSection>

        {type === "accessories" ? (
          <>
            {/* Category Filter for Accessories */}
            <FilterSection title="Category" section="price"> {/* Simplified section key */}
              <RadioGroup
                value={filters.category || ""}
                onValueChange={(value) => onFilterChange("category", value)}
                className="space-y-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="" id="all-categories" />
                  <Label htmlFor="all-categories">All</Label>
                </div>
                {accessoryCategories.map((category) => (
                  <div key={category} className="flex items-center space-x-2">
                    <RadioGroupItem value={category} id={category} />
                    <Label htmlFor={category}>{category}</Label>
                  </div>
                ))}
              </RadioGroup>
            </FilterSection>
          </>
        ) : null}

        {/* Price Filter */}
        <FilterSection title="Price" section="price">
          <PriceFilter
            valueMin={filters.minPrice}
            valueMax={filters.maxPrice}
            boundMin={minPrice}
            boundMax={maxPrice}
            onPriceChange={(newRange) => onFilterChange("priceRange", newRange)}
          />
        </FilterSection>

        {/* Year Filter */}
        <FilterSection title="Year" section="year">
          <ScrollArea className="h-[150px]">
            <div className="space-y-2 pr-4">
              <div className="flex items-center space-x-2 pb-2 border-b">
                <Checkbox 
                  id="all-years"
                  checked={filters.years.length === 0}
                  onCheckedChange={(checked) => 
                    onFilterChange("years", checked ? [] : filters.years)
                  }
                />
                <Label htmlFor="all-years" className="text-sm cursor-pointer">
                  All Years
                </Label>
              </div>
              {tyreYears.map((year) => (
                <div key={year} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`year-${year}`}
                    checked={filters.years.includes(year)}
                    onCheckedChange={(checked) => handleYearChange(year, checked as boolean)}
                  />
                  <Label htmlFor={`year-${year}`} className="text-sm cursor-pointer">
                    {year}
                  </Label>
                </div>
              ))}
            </div>
          </ScrollArea>
        </FilterSection>

        <FilterSection title="Tyre Size" section="tyreSize">
          <RadioGroup 
            value={filters.tyreSize} 
            onValueChange={(value) => onFilterChange("tyreSize", value)}
            className="space-y-2"
          >
            <div className="flex items-center space-x-2 pb-2 border-b">
              <RadioGroupItem value="" id="all-sizes" />
              <Label htmlFor="all-sizes" className="text-sm cursor-pointer">All Sizes</Label>
            </div>
            {tyreSizes.map((size) => (
              <div key={size} className="flex items-center space-x-2">
                <RadioGroupItem value={size} id={`size-${size}`} />
                <Label htmlFor={`size-${size}`} className="text-sm cursor-pointer">{size}</Label>
              </div>
            ))}
          </RadioGroup>
        </FilterSection>

        <FilterSection title="Load Index" section="loadIndex">
          <RadioGroup 
            value={filters.loadIndex} 
            onValueChange={(value) => onFilterChange("loadIndex", value)}
            className="space-y-2"
          >
            <div className="flex items-center space-x-2 pb-2 border-b">
              <RadioGroupItem value="" id="all-load-indexes" />
              <Label htmlFor="all-load-indexes" className="text-sm cursor-pointer">All</Label>
            </div>
            {loadIndexes.map((index) => (
              <div key={index} className="flex items-center space-x-2">
                <RadioGroupItem value={index} id={`load-${index}`} />
                <Label htmlFor={`load-${index}`} className="text-sm cursor-pointer">{index}</Label>
              </div>
            ))}
          </RadioGroup>
        </FilterSection>

        {/* OEM Tyres Filter */}
        {oems.length > 0 && (
          <MultiSelectFilter
            title="OEM Tyres"
            section="oem"
            items={filteredOems}
            search={oemSearch}
            onSearch={setOemSearch}
            selectedItems={filters.oem}
            itemCounts={counts.oem}
          />
        )}

        {/* Origin Filter */}
        {origins.length > 0 && (
          <MultiSelectFilter
            title="Origin"
            section="origin"
            items={filteredOrigins}
            search={originSearch}
            onSearch={setOriginSearch}
            selectedItems={filters.origin}
            itemCounts={counts.origin}
          />
        )}

        {/* RunFlat Filter */}
        {hasRunFlat && (
          <FilterSection title="Run Flat" section="runFlat">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="runflat"
                checked={filters.isRunFlat}
                onCheckedChange={(checked) => onFilterChange("isRunFlat", checked)}
                disabled={(counts.runFlat?.RunFlat || 0) === 0 && !filters.isRunFlat}
              />
              <Label
                htmlFor="runflat"
                className={`text-sm cursor-pointer ${(counts.runFlat?.RunFlat || 0) === 0 && !filters.isRunFlat ? 'text-gray-400' : ''}`}
              >
                RunFlat ({counts.runFlat?.RunFlat || 0})
              </Label>
            </div>
          </FilterSection>
        )}

        {/* Promotions Filter */}
        {promotions.length > 0 && (
          <MultiSelectFilter
            title="Promotions and Offers"
            section="promotion"
            items={filteredPromotions}
            search={promotionSearch}
            onSearch={setPromotionSearch}
            selectedItems={filters.promotion}
            itemCounts={counts.promotion}
          />
        )}

        {/* Pattern Filter */}
        {patterns.length > 0 && (
          <MultiSelectFilter
            title="Pattern"
            section="pattern"
            items={filteredPatterns}
            search={patternSearch}
            onSearch={setPatternSearch}
            selectedItems={filters.pattern}
            itemCounts={counts.pattern}
          />
        )}

        {/* Warranty Filter */}
        {warrantyPeriods.length > 0 && (
          <MultiSelectFilter
            title="Warranty Period"
            section="warrantyPeriod"
            items={filteredWarranties}
            search={warrantySearch}
            onSearch={setWarrantySearch}
            selectedItems={filters.warrantyPeriod}
            itemCounts={counts.warrantyPeriod}
          />
        )}

        {/* Performance Filter */}
        {performances.length > 0 && (
          <MultiSelectFilter
            title="Performance"
            section="performance"
            items={filteredPerformances}
            search={performanceSearch}
            onSearch={setPerformanceSearch}
            selectedItems={filters.performance}
            itemCounts={counts.performance}
          />
        )}

        <Button 
          variant="ghost" 
          onClick={onClearFilters} 
          className="w-full justify-center text-sm text-gray-600 hover:bg-gray-100"
        >
          Clear All Filters
        </Button>
      </CardContent>
    </Card>
  );
}

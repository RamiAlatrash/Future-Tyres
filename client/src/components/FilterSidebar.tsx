import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";

interface FilterSidebarProps {
  filters: any;
  onFilterChange: (key: string, value: any) => void;
  onClearFilters: () => void;
  type: "tyres" | "accessories";
}

export default function FilterSidebar({ filters, onFilterChange, onClearFilters, type }: FilterSidebarProps) {
  const tyreBrands = ["Bridgestone", "Michelin", "Continental", "Goodyear", "Pirelli"];
  const tyreTypes = ["All-Season", "Summer", "Winter", "SUV/4x4"];
  
  const accessoryBrands = ["ARB", "TJM", "Thule", "Yakima"];
  const accessoryCategories = ["Bumpers", "Lighting", "Lift Kits", "Roof Racks", "Wheel Spacers"];

  const brands = type === "tyres" ? tyreBrands : accessoryBrands;
  const categories = type === "tyres" ? tyreTypes : accessoryCategories;
  const categoryLabel = type === "tyres" ? "Type" : "Category";
  const categoryKey = type === "tyres" ? "type" : "category";

  return (
    <Card className="sticky top-24">
      <CardHeader>
        <CardTitle className="font-orbitron">Filters</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Brand Filter */}
        <div>
          <Label className="font-medium text-future-black mb-3 block">Brand</Label>
          <div className="space-y-2">
            {brands.map((brand) => (
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
        </div>
        
        {/* Price Range */}
        <div>
          <Label className="font-medium text-future-black mb-3 block">Price Range</Label>
          <Slider
            value={[filters.minPrice, filters.maxPrice]}
            onValueChange={([min, max]) => {
              onFilterChange("minPrice", min);
              onFilterChange("maxPrice", max);
            }}
            max={type === "tyres" ? 2000 : 10000}
            min={100}
            step={50}
            className="w-full mb-2"
          />
          <div className="flex justify-between text-sm text-gray-600">
            <span>AED {filters.minPrice}</span>
            <span>AED {filters.maxPrice}</span>
          </div>
        </div>
        
        {/* Type/Category Filter */}
        <div>
          <Label className="font-medium text-future-black mb-3 block">{categoryLabel}</Label>
          <RadioGroup 
            value={filters[categoryKey]} 
            onValueChange={(value) => onFilterChange(categoryKey, value)}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="" id="all" />
              <Label htmlFor="all" className="text-sm cursor-pointer">All</Label>
            </div>
            {categories.map((category) => (
              <div key={category} className="flex items-center space-x-2">
                <RadioGroupItem value={category} id={category} />
                <Label htmlFor={category} className="text-sm cursor-pointer">
                  {category}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>
        
        <Button 
          variant="ghost" 
          onClick={onClearFilters}
          className="text-red-500 hover:text-red-700 p-0"
        >
          Clear All Filters
        </Button>
      </CardContent>
    </Card>
  );
}

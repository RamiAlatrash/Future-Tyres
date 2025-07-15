import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useLanguage } from '@/contexts/LanguageContext';
import { Accessory } from '@shared/schema';
import { ChevronDown, ChevronUp } from 'lucide-react';
import React, { useMemo, useState } from 'react';
import { PriceFilter } from './PriceFilter';

interface AccessoryFilterSidebarProps {
    filters: any;
    onFilterChange: (key: string, value: any) => void;
    onClearFilters: () => void;
    allProducts: Accessory[];
}

export default function AccessoryFilterSidebar({
    filters,
    onFilterChange,
    onClearFilters,
    allProducts,
}: AccessoryFilterSidebarProps) {
    const { t } = useLanguage();
    const [expandedSections, setExpandedSections] = useState({
        category: true,
        brand: true,
        price: true,
        deals: false,
    });

    const [brandSearch, setBrandSearch] = useState('');

    const toggleSection = (section: keyof typeof expandedSections) => {
        setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
    };

    const handleMultiCheckboxChange = (key: string, value: string) => {
        const current = filters[key] || [];
        const newSelection = current.includes(value)
            ? current.filter((c: string) => c !== value)
            : [...current, value];
        onFilterChange(key, newSelection);
    };

    const accessoryCategories = [
        "Brakes",
        "Suspension",
        "Exterior",
        "Interior",
        "Rims and Tires",
        "Lighting",
        "Winches",
        "Camping"
    ];

    const allBrands = useMemo(() => Array.from(new Set(allProducts.map(p => p.brand))).sort(), [allProducts]);
    const allCategories = useMemo(() => Array.from(new Set(allProducts.map(p => p.category))).sort(), [allProducts]);

    const selectedCategoryCount = filters.category?.length || 0;
    const allCategoriesCount = allCategories.length;
    const isAllCategoriesSelected = selectedCategoryCount === allCategoriesCount && allCategoriesCount > 0;
    const isIndeterminate = selectedCategoryCount > 0 && selectedCategoryCount < allCategoriesCount;

    const handleSelectAllCategories = () => {
        if (isAllCategoriesSelected) {
            onFilterChange('category', []);
        } else {
            onFilterChange('category', allCategories);
        }
    };

    const allPrices = allProducts.map(p => p.price);
    const minPrice = Math.min(...allPrices, 0);
    const maxPrice = Math.max(...allPrices, 0);

    const counts = useMemo(() => {
        const categoryCounts: Record<string, number> = {};
        const brandCounts: Record<string, number> = {};

        allProducts.forEach(p => {
            if (p.category) categoryCounts[p.category] = (categoryCounts[p.category] || 0) + 1;
            if (p.brand) brandCounts[p.brand] = (brandCounts[p.brand] || 0) + 1;
        });

        return { categoryCounts, brandCounts };
    }, [allProducts]);

    const filteredBrands = allBrands.filter(b => b.toLowerCase().includes(brandSearch.toLowerCase()));

    return (
        <Card className="sticky top-24">
            <CardHeader>
                <CardTitle className="font-orbitron text-lg">Filters</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <FilterSection title="Category" section="category" expanded={expandedSections.category} onToggle={toggleSection}>
                    <ScrollArea className="h-[200px]">
                        <div className="space-y-2 pr-4">
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="cat-select-all"
                                    checked={isAllCategoriesSelected ? true : isIndeterminate ? 'indeterminate' : false}
                                    onCheckedChange={handleSelectAllCategories}
                                />
                                <Label htmlFor="cat-select-all" className="text-sm font-medium cursor-pointer">
                                    {t('accessories.select_all_categories')}
                                </Label>
                            </div>
                            <div className="my-2 border-b" />
                            {accessoryCategories.map(category => (
                                <div key={category} className="flex items-center space-x-2">
                                    <Checkbox
                                        id={`cat-${category}`}
                                        checked={filters.category?.includes(category)}
                                        onCheckedChange={() => handleMultiCheckboxChange('category', category)}
                                    />
                                    <Label htmlFor={`cat-${category}`} className="text-sm font-medium cursor-pointer">
                                        {category} ({counts.categoryCounts[category] || 0})
                                    </Label>
                                </div>
                            ))}
                        </div>
                    </ScrollArea>
                </FilterSection>

                <FilterSection title="Brand" section="brand" expanded={expandedSections.brand} onToggle={toggleSection}>
                    <Input
                        placeholder={t('accessories.search_brands_placeholder')}
                        value={brandSearch}
                        onChange={e => setBrandSearch(e.target.value)}
                        className="mb-2"
                    />
                    <ScrollArea className="h-[200px]">
                        <div className="space-y-2 pr-4">
                            {filteredBrands.map(brand => (
                                <div key={brand} className="flex items-center space-x-2">
                                    <Checkbox
                                        id={`brand-${brand}`}
                                        checked={filters.brand?.includes(brand)}
                                        onCheckedChange={() => handleMultiCheckboxChange('brand', brand)}
                                    />
                                    <Label htmlFor={`brand-${brand}`} className="text-sm font-medium cursor-pointer">
                                        {brand} ({counts.brandCounts[brand] || 0})
                                    </Label>
                                </div>
                            ))}
                        </div>
                    </ScrollArea>
                </FilterSection>

                <FilterSection title="Deals & Offers" section="deals" expanded={expandedSections.deals} onToggle={toggleSection}>
                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="deals-only"
                            checked={filters.dealsOnly || false}
                            onCheckedChange={(checked) => onFilterChange("dealsOnly", checked)}
                        />
                        <Label htmlFor="deals-only" className="text-sm cursor-pointer">
                            Show only products with deals ({
                                allProducts.filter(p => p.discount && p.discount > 0).length
                            })
                        </Label>
                    </div>
                </FilterSection>
                
                <FilterSection title="Price" section="price" expanded={expandedSections.price} onToggle={toggleSection}>
                    <PriceFilter
                        valueMin={filters.priceRange?.[0] ?? minPrice}
                        valueMax={filters.priceRange?.[1] ?? maxPrice}
                        boundMin={minPrice}
                        boundMax={maxPrice}
                        onPriceChange={(newRange) => onFilterChange("priceRange", newRange)}
                    />
                </FilterSection>

                <Button onClick={onClearFilters} variant="ghost" className="w-full justify-center">
                    Clear All Filters
                </Button>
            </CardContent>
        </Card>
    );
}

const FilterSection = ({ title, section, expanded, onToggle, children }: { title: string; section: string; expanded: boolean; onToggle: (section: any) => void; children: React.ReactNode }) => (
    <div className="border rounded-md">
        <button
            onClick={() => onToggle(section)}
            className="w-full flex items-center justify-between p-3 hover:bg-gray-50 transition-colors"
        >
            <Label className="font-medium text-future-black cursor-pointer">{title}</Label>
            {expanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
        </button>
        {expanded && (
            <div className="p-3 border-t bg-gray-50">
                {children}
            </div>
        )}
    </div>
); 
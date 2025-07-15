// src/pages/AccessoriesPage.tsx

import AccessoryFilterSidebar from '@/components/AccessoryFilterSidebar';
import { SimpleBrandList } from "@/components/SimpleBrandList";
import ProductCard from "@/components/ProductCard";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLanguage } from '@/contexts/LanguageContext';
import { allMockAccessories } from "@/data/accessories";
import { Accessory } from "@shared/schema";
import { ChevronLeft, SlidersHorizontal } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useParams, useSearchParams } from "wouter";

const mainCategories = [
    { name: "Brakes", key: 'Brakes', imageUrl: "https://ceika-store.com/cdn/shop/files/CEIKA_Custom_Big_Brake_Kit_heic_444e72d6-b8c1-4e34-a1fe-36f7a78b4b33_5000x.jpg?v=1723455104" },
    { name: "Suspension", key: 'Suspension', imageUrl: "https://www.ramyautomotive.com/media/catalog/category/RAMYautomotive-Suspension_1_1.png" },
    { name: "Exterior", key: 'Exterior', imageUrl: "https://www.ramyautomotive.com/media/catalog/category/RAMYautomotive-exterior_3_1.png" },
    { name: "Interior", key: 'Interior', imageUrl: "https://www.ramyautomotive.com/media/catalog/category/RAMYautomotive-interior_1_2.png" },
    { name: "Rims and Tires", key: 'Rims and Tires', imageUrl: "https://www.ramyautomotive.com/media/catalog/category/RAMYautomotive-rimsandtires_1_1.png" },
    { name: "Lighting", key: 'Lighting', imageUrl: "https://www.ramyautomotive.com/media/catalog/category/RAMYautomotive-lighting_3_2.png" },
    { name: "Winches", key: 'Winches', imageUrl: "https://www.ramyautomotive.com/media/catalog/category/RAMYautomotive-winches_1_3.png" },
    { name: "Camping", key: 'Camping', imageUrl: "https://www.ramyautomotive.com/media/catalog/category/RAMYautomotive-camping_1_2.png" }
];

const categorySlugMap: Record<string, string> = mainCategories.reduce((acc, category) => {
    const slug = category.name.toLowerCase().replace(/ /g, '-').replace(/---/g, '-');
    acc[slug] = category.name;
    return acc;
}, {} as Record<string, string>);

export default function AccessoriesPage() {
    const { t } = useLanguage();
    const [, setLocation] = useLocation();
    const [searchParams] = useSearchParams();
    const params = useParams<{ category?: string }>();
    const isInitialRender = useRef(true);

    const [view, setView] = useState<'categories' | 'products'>('categories');
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [brakeSubcategory, setBrakeSubcategory] = useState<string | null>(null);
    const [filters, setFilters] = useState<Record<string, any>>({});
    const [isFilterSidebarOpen, setIsFilterSidebarOpen] = useState(false);

    // Extract unique brands with counts for the selected category and brake subcategory
    const availableBrands = useMemo(() => {
        let filteredAccessories = allMockAccessories;
        if (selectedCategory) {
            filteredAccessories = filteredAccessories.filter(acc => acc.category === selectedCategory);
        }
        if (selectedCategory === 'Brakes' && brakeSubcategory) {
            filteredAccessories = filteredAccessories.filter(acc => acc.subcategory === brakeSubcategory);
        }
        const brandMap = new Map();
        filteredAccessories.forEach(accessory => {
            if (brandMap.has(accessory.brand)) {
                brandMap.get(accessory.brand).count++;
            } else {
                brandMap.set(accessory.brand, {
                    id: accessory.brand,
                    name: accessory.brand,
                    logo: `https://via.placeholder.com/160x80/ffffff/333333?text=${encodeURIComponent(accessory.brand)}&font=Arial&size=14`,
                    count: 1
                });
            }
        });
        // Only show brands with at least one product
        return Array.from(brandMap.values()).filter(b => b.count > 0).sort((a, b) => a.name.localeCompare(b.name));
    }, [selectedCategory, brakeSubcategory]);

    const handleBrandFilter = (brandId: string | null) => {
        if (brandId) {
            setFilters(prev => ({ ...prev, brand: [brandId] }));
            setView('products');
        } else {
            setFilters(prev => {
                const newFilters = { ...prev };
                delete newFilters.brand;
                return newFilters;
            });
            setView('products');
        }
    };

    const selectedBrand = filters.brand?.[0] || null;

    // Parse URL parameters on mount
    useEffect(() => {
        const searchParam = searchParams.get('productName');
        const categoryParam = params.category;
        const dealsParam = searchParams.get('deals');
        const brandParam = searchParams.get('brand');

        if (searchParam) {
            setFilters(prev => ({ ...prev, search: searchParam }));
            setView('products'); // Automatically switch to products view if a search query is present
        } else if (categoryParam) {
            const categoryName = categorySlugMap[categoryParam];
            if (categoryName) {
                setSelectedCategory(categoryName);
                setBrakeSubcategory(null);
                setFilters(prev => ({
                    ...prev,
                    category: [categoryName]
                }));
                setView('products');
            }
        }
        
        if (brandParam) {
            setFilters(prev => ({ ...prev, brand: [brandParam] }));
            setView('products'); // Automatically switch to products view if brand filter is applied
        }
        
        if (dealsParam === 'true') {
            setFilters(prev => ({ ...prev, dealsOnly: true }));
            setView('products'); // Automatically switch to products view if deals filter is applied
        }
    }, [searchParams, params.category]);
    
    const handleFilterChange = (key: string, value: any) => {
        if (key === 'category' && selectedCategory && !value.includes(selectedCategory)) {
            setSelectedCategory(null);
            setView('categories');
        }

        setFilters(prev => {
            const newFilters = { ...prev };
            if (value === null || (Array.isArray(value) && value.length === 0)) {
                delete newFilters[key];
            } else {
                newFilters[key] = value;
            }
            return newFilters;
        });
    };

    const backToCategories = () => {
        setView('categories');
        setSelectedCategory(null);
        setFilters({});
    };

    const handleCategoryClick = (categoryName: string) => {
        setSelectedCategory(categoryName);
        setBrakeSubcategory(null); // Reset subcategory on new category
        setFilters(prev => {
            const newFilters = { ...prev };
            delete newFilters.brand;
            newFilters.category = [categoryName];
            return newFilters;
        });
        setView('products');
    };



    const handleProductClick = (productId: number) => {
        setLocation(`/accessory/${productId}`, { state: { fromCategory: selectedCategory } });
    };

    const products = useMemo(() => {
        if (view === 'categories') return [];
        return allMockAccessories;
    }, [view]);

    // Filtered products logic
    const filteredProducts = useMemo(() => {
        if (!products.length) return [];
        return products.filter(p => {
            // If category filter is active, only show products in those categories
            const categoryFilter = filters.category;
            if (categoryFilter && categoryFilter.length > 0) {
                if (!categoryFilter.includes(p.category)) return false;
            } else if (selectedCategory) {
                // If a selectedCategory is set (from grid click or URL), only show products from that category
                if (p.category !== selectedCategory) return false;
            }
            // If Brakes and a subcategory is selected, only show products in that subcategory
            if ((selectedCategory === 'Brakes' || (categoryFilter && categoryFilter.includes('Brakes'))) && brakeSubcategory) {
                if (p.category === 'Brakes' && p.subcategory !== brakeSubcategory) return false;
            }
            const brandFilter = filters.brand && filters.brand.length > 0 ? filters.brand : null;
            const priceFilter = filters.priceRange;
            const searchFilter = filters.search;
            const dealsFilter = filters.dealsOnly;
            if (brandFilter && !brandFilter.includes(p.brand)) {
                return false;
            }
            if (priceFilter) {
                const [min, max] = priceFilter;
                if (p.price < min || p.price >= max) {
                    return false;
                }
            }
            if (searchFilter && !p.name.toLowerCase().includes(searchFilter.toLowerCase())) {
                return false;
            }
            if (dealsFilter) {
                const hasDiscount = p.discount && p.discount > 0;
                if (!hasDiscount) return false;
                if (categoryFilter && categoryFilter.length === 1) {
                    if (!categoryFilter.includes(p.category)) return false;
                }
            }
            return true;
        });
    }, [products, filters, selectedCategory, brakeSubcategory]);

    useEffect(() => {
        if (isInitialRender.current) {
            isInitialRender.current = false;
        } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }, [filteredProducts]);

    const categoryNameForTitle = useMemo(() => {
        const categories = filters.category;
        if (categories && categories.length > 1) {
            return categories.join(', ');
        }
        if (categories && categories.length === 1) {
            return categories[0];
        }
        return t('accessories.products');
    }, [filters.category, t]);

    return (
        <div className="container mx-auto px-4 py-8">
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
                        <AccessoryFilterSidebar 
                            filters={filters}
                            onFilterChange={handleFilterChange}
                            onClearFilters={backToCategories}
                            allProducts={allMockAccessories}
                        />
                    </div>
                </div>
            )}

            <Breadcrumb className="mb-8">
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/">{t('nav.home')}</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        {view === 'products' ? (
                            <BreadcrumbLink onClick={backToCategories} className="cursor-pointer hover:underline">{t('nav.accessories')}</BreadcrumbLink>
                        ) : (
                            <BreadcrumbPage>{t('nav.accessories')}</BreadcrumbPage>
                        )}
                    </BreadcrumbItem>
                    {view === 'products' && filters.category && filters.category.length > 0 && (
                        <>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbPage>{categoryNameForTitle}</BreadcrumbPage>
                            </BreadcrumbItem>
                        </>
                    )}
                </BreadcrumbList>
            </Breadcrumb>
            
            {view === 'categories' ? (
                <CategoryGrid onCategorySelect={handleCategoryClick} />
            ) : selectedCategory === 'Brakes' && !brakeSubcategory ? (
                <div className="flex flex-col items-center justify-center min-h-[300px]">
                    <Button
                        variant="outline"
                        className="mb-6"
                        onClick={backToCategories}
                    >
                        <ChevronLeft className="h-4 w-4 mr-2" />
                        Back to All Categories
                    </Button>
                    <h2 className="font-orbitron text-2xl font-bold mb-6">Select a Brake System Option</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 w-full max-w-2xl">
                        {[
                            { label: 'Brake Pad', img: 'https://rcdxb.com/cdn/shop/files/shimano-BP-L05A-RF-01.jpg?v=1751898596' },
                            { label: 'Brake Disc', img: 'https://dubai4wd.com/cdn/shop/products/1BE38EBA-D6A2-441F-83A6-981D9E4547F5_1_102_o_0783c15d-10dd-49f0-ad40-a163a4d230e2_720x.jpg?v=1747977366' },
                            { label: 'Brake Kit', img: 'https://www.powerstop.com/wp-content/uploads/2019/06/power-stop-z36-brake-kit.jpg' }
                        ].map(option => (
                            <button
                                key={option.label}
                                onClick={() => {
                                    setBrakeSubcategory(option.label);
                                    setFilters(prev => {
                                        const newFilters = { ...prev };
                                        delete newFilters.brand;
                                        return newFilters;
                                    });
                                }}
                                className="rounded-xl border border-gray-300 bg-white shadow-md hover:shadow-lg transition p-8 flex flex-col items-center text-center group hover:bg-red-50"
                            >
                                <img src={option.img} alt={option.label} className="w-32 h-32 object-contain mb-4 rounded" />
                                <span className="text-2xl font-semibold mb-2 text-future-black group-hover:text-red-700">{option.label}</span>
                                <span className="text-gray-500 text-sm">{option.label === 'Brake Kit' ? 'Full system' : `Only the ${option.label.toLowerCase()}`}</span>
                            </button>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="flex flex-col lg:flex-row gap-8">
                    <aside className="hidden lg:block lg:w-1/5">
                        <AccessoryFilterSidebar 
                            filters={filters}
                            onFilterChange={handleFilterChange}
                            onClearFilters={backToCategories}
                            allProducts={allMockAccessories}
                        />
                    </aside>
                    <main className="w-full lg:w-4/5">
                        {/* Brand Filter */}
                        <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 backdrop-blur-sm border border-gray-700/30 rounded-xl p-4 shadow-2xl mb-6">
                          <SimpleBrandList 
                            brands={availableBrands}
                            onBrandSelect={handleBrandFilter}
                            selectedBrand={selectedBrand}
                          />
                        </div>
                        <ProductList 
                            products={filteredProducts} 
                            onProductClick={handleProductClick} 
                            categoryName={brakeSubcategory ? `Brakes - ${brakeSubcategory}` : selectedCategory || categoryNameForTitle}
                            onBack={brakeSubcategory ? () => setBrakeSubcategory(null) : backToCategories}
                            backLabel={brakeSubcategory ? 'Back to Brake Options' : undefined}
                            searchTerm={filters.search || ''}
                            onSearchTermChange={(value) => handleFilterChange('search', value)}
                            onMobileFilterClick={() => setIsFilterSidebarOpen(true)}
                            filters={filters}
                            selectedCategory={selectedCategory}
                            brakeSubcategory={brakeSubcategory}
                        />
                    </main>
                </div>
            )}
        </div>
    );
}

const CategoryGrid = ({ onCategorySelect }: { onCategorySelect: (categoryName: string) => void; }) => {
    const { t } = useLanguage();
    return (
        <div>
            <h1 className="font-orbitron text-4xl font-bold text-future-black mb-8">{t('accessories.shop_by_category')}</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {mainCategories.map((category) => (
                    <div key={category.name} onClick={() => onCategorySelect(category.name)} className="cursor-pointer rounded-lg border hover:shadow-lg transition-shadow group">
                        <div className="h-48 overflow-hidden rounded-t-lg bg-gray-100">
                            <img src={category.imageUrl} alt={category.name} className="object-contain w-full h-full group-hover:scale-105 transition-transform duration-300" />
                        </div>
                        <div className="p-4 text-center">
                            <h2 className="text-xl font-semibold">{category.name}</h2>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const ProductList = ({ products, onProductClick, categoryName, onBack, searchTerm, onSearchTermChange, onMobileFilterClick, backLabel, filters, selectedCategory, brakeSubcategory }: { products: Accessory[]; onProductClick: (id: number) => void; categoryName: string; onBack: () => void; searchTerm: string; onSearchTermChange: (term: string) => void; onMobileFilterClick: () => void; backLabel?: string; filters: any; selectedCategory: string | null; brakeSubcategory: string | null; }) => {
    const [sort, setSort] = useState('relevance');
    const { t } = useLanguage();

    const filteredAndSearchedProducts = useMemo(() => {
        return products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }, [products, searchTerm]);

    const sortedProducts = useMemo(() => {
        const sorted = [...filteredAndSearchedProducts];
        if (sort === 'price-asc') sorted.sort((a, b) => a.price - b.price);
        if (sort === 'price-desc') sorted.sort((a, b) => b.price - a.price);
        return sorted;
    }, [filteredAndSearchedProducts, sort]);

    return (
        <div>
            <div className="flex items-center justify-between flex-wrap gap-4 mb-8">
                {/* Main Heading */}
                <h1 className="font-orbitron text-4xl font-bold mb-6">
                    {(() => {
                        if (typeof selectedCategory !== 'undefined' && selectedCategory === 'Brakes' && typeof brakeSubcategory !== 'undefined' && brakeSubcategory) {
                            return `Brakes - ${brakeSubcategory}`;
                        }
                        const categories = filters?.category;
                        if (categories && categories.length > 1) {
                            return categories.join(', ');
                        }
                        if (categories && categories.length === 1) {
                            return categories[0];
                        }
                        return 'All Accessories';
                    })()}
                </h1>
                {categoryName !== "Products" && categoryName !== "Multiple Categories" && (
                    <Button variant="outline" onClick={onBack}>
                        <ChevronLeft className="h-4 w-4 mr-2" />
                        {backLabel || t('accessories.back_to_all_categories')}
                    </Button>
                )}
            </div>



            <div className="flex flex-col lg:flex-row gap-4 mb-8">
                 <Button 
                    variant="outline" 
                    className="lg:hidden flex items-center justify-between text-base text-gray-500 font-normal h-12" 
                    onClick={onMobileFilterClick}
                >
                    <span>Filters</span>
                    <SlidersHorizontal className="h-5 w-5" />
                </Button>
                <Input 
                    placeholder={`Search in ${categoryName}...`}
                    value={searchTerm}
                    onChange={(e) => onSearchTermChange(e.target.value)}
                    className="flex-1 focus:border-electric-blue h-12" 
                />
                <Select value={sort} onValueChange={setSort}>
                    <SelectTrigger className="w-full sm:w-64 h-12">
                        <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="relevance">Relevance</SelectItem>
                        <SelectItem value="price-asc">Price: Low to High</SelectItem>
                        <SelectItem value="price-desc">Price: High to Low</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            {sortedProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {sortedProducts.map((product) => (
                        <ProductCard 
                            key={product.id} 
                            product={product} 
                            type="accessory" 
                            onProductClick={() => onProductClick(product.id)}
                        />
                    ))}
                </div>
            ) : (
                <p>{t('accessories.no_products_found')}</p>
            )}
        </div>
    );
};

import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { allMockAccessories } from "@/data/accessories";
import { useCart } from "@/hooks/useCart";
import { ChevronLeft } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useParams } from "wouter";

const InfoRow = ({ label, value }: { label: string; value: string | number | null | undefined }) => {
    if (value === null || value === undefined || value === '') return null;
    const { language } = useLanguage();
    return (
        <div className={`flex justify-between py-3 border-b border-gray-100 ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
            <span className="font-medium text-gray-600">{label}</span>
            <span className={`text-gray-800 ${language === 'ar' ? 'text-left' : 'text-right'}`}>{value}</span>
        </div>
    );
};

export default function AccessoryDetailPage() {
    const { t, language } = useLanguage();
    const params = useParams();
    const { id } = params;
    const [_, navigate] = useLocation();
    const { addToCart, updateQuantity, cartItems } = useCart();
    const { toast } = useToast();

    const [quantity, setQuantity] = useState(1);
    
    const product = useMemo(() => {
        const productId = id ? parseInt(id, 10) : NaN;
        if (isNaN(productId)) return undefined;
        return allMockAccessories.find(a => a.id === productId);
    }, [id]);

    const imageList = useMemo(() => {
        if (product?.imageUrls) {
            // Check if it's an array directly
            if (Array.isArray(product.imageUrls)) {
                return product.imageUrls;
            }
            // Handle cases where imageUrls might be a single URL string
            if (typeof product.imageUrls === 'string') {
                return product.imageUrls.split(',').map(url => url.trim());
            }
        }
        // Fallback to single imageUrl if imageUrls is not available
        if(product?.imageUrl) {
            return [product.imageUrl];
        }
        return [];
    }, [product]);

    const [mainImage, setMainImage] = useState('');

    useEffect(() => {
        if (imageList.length > 0) {
            setMainImage(imageList[0]);
        }
    }, [imageList]);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [id]);

    if (!product) {
        return (
            <div className="container mx-auto px-4 py-8 text-center">
                <h1 className="text-2xl font-bold">{t('accessory_detail.not_found')}</h1>
                <p className="text-gray-600">{t('accessory_detail.not_found_message')}</p>
            </div>
        );
    }
    
    const totalPrice = (product.price || 0) * quantity;

    const handleQuantityChange = (change: number) => {
        setQuantity(prev => Math.max(1, prev + change));
    };

    const handleAddToCart = () => {
        const existingItem = cartItems.find(
            (item) => item.productId === product.id && item.productType === 'accessory'
        );

        if (existingItem) {
            updateQuantity(existingItem.id, existingItem.quantity + quantity);
        } else {
            addToCart({ ...product, quantity }, 'accessory');
        }

        toast({
            title: t('product.added_to_cart'),
            description: `${quantity}x ${product.name} ${t('product.added_to_cart_desc')}`,
            action: (
                <Button onClick={() => navigate('/cart')} variant="outline">
                    {t('product.view_cart')}
                </Button>
            ),
        });
        setQuantity(1);
    };
    
    return (
        <div className="bg-gray-50/50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className={`flex ${language === 'ar' ? 'justify-start' : 'justify-end'} mb-4`}>
                    <Button variant="outline" onClick={() => window.history.back()}>
                         {language === 'ar' ? (
                            <>
                                {t('accessory_detail.back_to_accessories')}
                                <ChevronLeft className="h-4 w-4 mr-2 transform scale-x-[-1]" />
                            </>
                        ) : (
                             <>
                                <ChevronLeft className="h-4 w-4 mr-2" />
                                {t('accessory_detail.back_to_accessories')}
                            </>
                        )}
                    </Button>
                </div>
                
                <Breadcrumb className="mb-8">
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink asChild><Link to="/">{t('nav.home')}</Link></BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                           <BreadcrumbLink asChild><Link to="/accessories">{t('nav.accessories')}</Link></BreadcrumbLink>
                        </BreadcrumbItem>
                        {product.category && (
                            <>
                                <BreadcrumbSeparator />
                                <BreadcrumbItem>
                                    <BreadcrumbLink asChild><Link to={`/accessories/${product.category.toLowerCase()}`}>{product.category}</Link></BreadcrumbLink>
                                </BreadcrumbItem>
                            </>
                        )}
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage>{product.name}</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
                    {/* Left Column - Images */}
                    <div className="flex flex-col-reverse sm:flex-row gap-4">
                         <div className="flex sm:flex-col gap-2 overflow-x-auto sm:overflow-x-hidden pb-2 sm:pb-0">
                            {imageList.map((img, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setMainImage(img)}
                                    className={`w-20 h-20 flex-shrink-0 rounded-md overflow-hidden border-2 ${mainImage === img ? 'border-red-500' : 'border-transparent'}`}
                                >
                                    <img src={img} alt={`${product.name} thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>
                        <div className="flex-1 h-[400px] bg-white rounded-lg border border-gray-200 flex items-center justify-center overflow-hidden">
                           <img
                                src={mainImage || "/tyre-placeholder.jpg"}
                                alt={product.name}
                                className="w-full h-full object-contain"
                            />
                        </div>
                    </div>

                    {/* Right Column - Product Info and Purchase Options */}
                    <div>
                        <div className="bg-white rounded-lg shadow-sm border border-gray-100">
                             {/* Product Information */}
                            <div className="p-6 border-b border-gray-100">
                                <h1 className={`text-2xl font-bold ${language === 'ar' ? 'text-right' : ''}`}>{product.name}</h1>
                                {product.brand && <p className={`text-lg text-gray-500 ${language === 'ar' ? 'text-right' : ''}`}>{product.brand}</p>}
                                
                                <h2 className={`text-xl font-bold uppercase text-red-600 my-4 ${language === 'ar' ? 'text-right' : ''}`}>
                                    {t('accessory_detail.product_information')}
                                </h2>

                                <div className="space-y-2">
                                    <InfoRow label={t('accessory_detail.category')} value={product.category} />
                                    <InfoRow label={t('accessory_detail.condition')} value={product.condition} />
                                    <InfoRow label={t('accessory_detail.warranty')} value={product.warranty} />
                                    <InfoRow label={t('accessory_detail.sku')} value={product.sku} />
                                </div>
                            </div>
                            
                            {/* Price Box */}
                            <div className={`p-6 ${language === 'ar' ? 'text-right' : ''}`}>
                                <div className="text-green-600 font-medium">{t('product.in_stock')}</div>
                                <div className="text-sm text-gray-600 mt-1">
                                    {t('product.set_of_1_each')}
                                    <br />
                                    {t('product.vat_included')}
                                </div>
                                <div className="text-3xl font-bold mt-2">
                                    {t('product.aed')} {totalPrice.toFixed(2)}
                                </div>

                                {/* Quantity Selector */}
                                <div className="mt-6">
                                    <label className={`block text-sm font-medium text-gray-700 mb-2`}>
                                        {t('product.quantity')}
                                    </label>
                                    <div className={`flex items-center ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
                                        <div className="flex items-center border border-gray-300 rounded-md">
                                             <button onClick={() => handleQuantityChange(-1)} className="px-3 py-1.5 text-gray-600 hover:bg-gray-100 rounded-r-md">
                                                -
                                            </button>
                                            <input
                                                type="number"
                                                min="1"
                                                value={quantity}
                                                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                                                className="w-16 text-center border-x border-gray-300 focus:ring-0 focus:border-gray-300"
                                            />
                                            <button onClick={() => handleQuantityChange(1)} className="px-3 py-1.5 text-gray-600 hover:bg-gray-100 rounded-l-md">
                                                +
                                            </button>
                                        </div>
                                         {product.stock && <span className="mx-4 text-sm text-gray-500">{t('product.items_available', { count: product.stock })}</span>}
                                    </div>
                                </div>

                                {/* Add to Cart Button */}
                                <div className="mt-6">
                                    <Button
                                        onClick={handleAddToCart}
                                        className="w-full bg-black text-white py-3 rounded-md hover:bg-gray-800 transition-colors text-base"
                                        size="lg"
                                    >
                                        {t('product.add_to_cart')}
                                    </Button>
                                </div>
                                
                                {/* Payment Info */}
                                <div className={`mt-4 flex items-center justify-between text-sm text-gray-500 ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
                                    <span>{t('product.pay_installments')}</span>
                                    <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRHlx15NwYiMVvAuA-RxHMnNGAsOJoAe8UQ5A&s" alt="Tabby" className="h-10" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Product Description */}
                {product.description && (
                    <div className="mt-12">
                        <h3 className={`text-xl font-bold ${language === 'ar' ? 'text-right' : ''}`}>{t('product.description_title')}</h3>
                        <p className={`mt-4 text-gray-600 leading-relaxed ${language === 'ar' ? 'text-right' : ''}`}>
                            {product.description}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
} 
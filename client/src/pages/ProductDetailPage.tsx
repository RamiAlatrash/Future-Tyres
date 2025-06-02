import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Star, MapPin, Truck, Wrench, Plus, Minus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { useCart } from "@/hooks/useCart";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProductDetailPage() {
  const params = useParams();
  const { type, id } = params;
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [fitmentOption, setFitmentOption] = useState("partner");
  const { addToCart } = useCart();

  const { data: product, isLoading } = useQuery({
    queryKey: [`/api/${type}s/${id}`],
    enabled: !!type && !!id,
  });

  const { data: reviews = [] } = useQuery({
    queryKey: [`/api/reviews/product/${id}/${type}`],
    enabled: !!id && !!type,
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <Skeleton className="h-96 w-full rounded-lg mb-4" />
            <div className="flex gap-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-20 w-20 rounded-lg" />
              ))}
            </div>
          </div>
          <div className="space-y-6">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-10 w-1/3" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h1>
          <p className="text-gray-600">The product you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  const images = [
    product.imageUrl || "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
    "https://images.unsplash.com/photo-1580273916550-e323be2ae537?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
    "https://images.unsplash.com/photo-1611651338412-8403fa6e3599?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
  ];

  const specifications = product.specifications ? JSON.parse(product.specifications) : {};
  const averageRating = reviews.length > 0 
    ? reviews.reduce((sum: number, review: any) => sum + review.rating, 0) / reviews.length 
    : 0;

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product, type as 'tyre' | 'accessory', fitmentOption);
    }
  };

  const isOutOfStock = product.stock === 0;

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
            <BreadcrumbLink href={`/${type}s`}>
              {type === 'tyre' ? 'Tyres' : 'Accessories'}
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{product.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Product Hero Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
        {/* Image Gallery */}
        <div>
          <div className="relative mb-4">
            <img 
              src={images[selectedImage]}
              alt={product.name}
              className="w-full h-96 object-cover rounded-lg border border-gray-200 hover:border-electric-blue transition-colors"
            />
            <Button 
              variant="ghost" 
              size="sm"
              className="absolute top-4 right-4 bg-black bg-opacity-50 text-white hover:bg-opacity-75"
            >
              🔍 Zoom
            </Button>
          </div>
          <div className="flex gap-2">
            {images.map((image, index) => (
              <img 
                key={index}
                src={image}
                alt={`${product.name} view ${index + 1}`}
                className={`w-20 h-20 object-cover rounded-lg cursor-pointer border-2 ${
                  selectedImage === index ? 'border-electric-blue' : 'border-gray-200'
                }`}
                onClick={() => setSelectedImage(index)}
              />
            ))}
          </div>
        </div>

        {/* Product Details */}
        <div className="space-y-6">
          <div>
            <h1 className="font-orbitron text-3xl font-bold text-future-black mb-2">
              {product.brand} {product.name}
            </h1>
            
            {/* Rating */}
            <div className="flex items-center mb-4">
              <div className="flex text-electric-blue">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star 
                    key={i} 
                    className={`w-5 h-5 ${i < Math.floor(averageRating) ? 'fill-current' : ''}`} 
                  />
                ))}
              </div>
              <span className="ml-2 text-sm text-gray-600">
                ({reviews.length} reviews)
              </span>
            </div>

            <p className="text-3xl font-bold text-electric-blue mb-4">
              AED {product.price.toFixed(2)}
            </p>

            <p className="text-gray-600 mb-6">
              {product.description || "High-quality automotive product with excellent performance and durability."}
            </p>
          </div>

          {/* Fitment Options for Tyres */}
          {type === 'tyre' && (
            <div>
              <Label className="text-base font-medium mb-3 block">Fitment Options</Label>
              <RadioGroup value={fitmentOption} onValueChange={setFitmentOption}>
                <div className="flex items-center space-x-2 p-3 border rounded-lg">
                  <RadioGroupItem value="partner" id="partner" />
                  <MapPin className="w-5 h-5" />
                  <div>
                    <Label htmlFor="partner" className="font-medium">Partner Centre</Label>
                    <p className="text-sm text-gray-600">Select a fitment centre</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2 p-3 border rounded-lg">
                  <RadioGroupItem value="home" id="home" />
                  <Truck className="w-5 h-5" />
                  <div>
                    <Label htmlFor="home" className="font-medium">Home Delivery</Label>
                    <p className="text-sm text-gray-600">AED 50 for delivery & installation</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2 p-3 border rounded-lg">
                  <RadioGroupItem value="mobile" id="mobile" />
                  <Wrench className="w-5 h-5" />
                  <div>
                    <Label htmlFor="mobile" className="font-medium">Mobile Van</Label>
                    <p className="text-sm text-gray-600">AED 80 (Dubai only)</p>
                  </div>
                </div>
              </RadioGroup>
            </div>
          )}

          {/* Quantity Selector */}
          <div>
            <Label className="text-base font-medium mb-3 block">Quantity</Label>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
              >
                <Minus className="w-4 h-4" />
              </Button>
              <span className="w-16 text-center py-2 border border-gray-200 rounded">
                {quantity}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setQuantity(quantity + 1)}
                disabled={quantity >= product.stock}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-sm text-gray-600 mt-1">
              {product.stock} items available
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button 
              size="lg"
              className="w-full bg-orange-500 hover:bg-orange-600 text-white"
              onClick={handleAddToCart}
              disabled={isOutOfStock}
            >
              {isOutOfStock ? "Out of Stock" : "Add to Cart"}
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="w-full border-electric-blue text-electric-blue hover:bg-electric-blue hover:text-white"
              disabled={isOutOfStock}
            >
              Buy Now
            </Button>
          </div>

          {/* Stock Status */}
          <Badge 
            variant={isOutOfStock ? "destructive" : "default"}
            className={`${isOutOfStock ? "bg-red-500" : "bg-green-500"}`}
          >
            {isOutOfStock ? "Out of Stock" : "In Stock"}
          </Badge>
        </div>
      </div>

      {/* Tabbed Content */}
      <Tabs defaultValue="description" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="description">Description</TabsTrigger>
          <TabsTrigger value="specifications">Specifications</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
        </TabsList>
        
        <TabsContent value="description" className="mt-6">
          <Card>
            <CardContent className="p-6">
              <h3 className="font-orbitron text-xl font-bold mb-4">Product Description</h3>
              <div className="prose max-w-none">
                <p className="text-gray-700 leading-relaxed mb-4">
                  {product.description || "This is a high-quality automotive product designed to meet the highest standards of performance and durability."}
                </p>
                
                <h4 className="font-semibold text-lg mb-2">Key Features:</h4>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  <li>Premium quality materials and construction</li>
                  <li>Excellent performance in all conditions</li>
                  <li>Long-lasting durability and reliability</li>
                  <li>Professional installation available</li>
                  <li>Comprehensive warranty coverage</li>
                </ul>

                {type === 'tyre' && (
                  <>
                    <h4 className="font-semibold text-lg mb-2 mt-6">Tyre Technology:</h4>
                    <p className="text-gray-700">
                      Advanced tread compound and design optimized for {product.type?.toLowerCase()} conditions,
                      providing excellent grip, handling, and fuel efficiency.
                    </p>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="specifications" className="mt-6">
          <Card>
            <CardContent className="p-6">
              <h3 className="font-orbitron text-xl font-bold mb-4">Technical Specifications</h3>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-200">
                  <tbody>
                    {type === 'tyre' && (
                      <>
                        <tr className="border border-gray-200">
                          <td className="px-4 py-2 font-medium bg-gray-50">Size</td>
                          <td className="px-4 py-2">{(product as any).size}</td>
                        </tr>
                        <tr className="border border-gray-200">
                          <td className="px-4 py-2 font-medium bg-gray-50">Load Index</td>
                          <td className="px-4 py-2">{(product as any).loadIndex}</td>
                        </tr>
                        <tr className="border border-gray-200">
                          <td className="px-4 py-2 font-medium bg-gray-50">Speed Rating</td>
                          <td className="px-4 py-2">{(product as any).speedRating}</td>
                        </tr>
                        <tr className="border border-gray-200">
                          <td className="px-4 py-2 font-medium bg-gray-50">Type</td>
                          <td className="px-4 py-2">{(product as any).type}</td>
                        </tr>
                      </>
                    )}
                    {type === 'accessory' && (
                      <>
                        <tr className="border border-gray-200">
                          <td className="px-4 py-2 font-medium bg-gray-50">Category</td>
                          <td className="px-4 py-2">{(product as any).category}</td>
                        </tr>
                        <tr className="border border-gray-200">
                          <td className="px-4 py-2 font-medium bg-gray-50">Material</td>
                          <td className="px-4 py-2">{(product as any).material}</td>
                        </tr>
                        <tr className="border border-gray-200">
                          <td className="px-4 py-2 font-medium bg-gray-50">Fitment</td>
                          <td className="px-4 py-2">{(product as any).fitment}</td>
                        </tr>
                        <tr className="border border-gray-200">
                          <td className="px-4 py-2 font-medium bg-gray-50">Warranty</td>
                          <td className="px-4 py-2">{(product as any).warranty}</td>
                        </tr>
                      </>
                    )}
                    <tr className="border border-gray-200">
                      <td className="px-4 py-2 font-medium bg-gray-50">Brand</td>
                      <td className="px-4 py-2">{product.brand}</td>
                    </tr>
                    
                    {Object.entries(specifications).map(([key, value]) => (
                      <tr key={key} className="border border-gray-200">
                        <td className="px-4 py-2 font-medium bg-gray-50 capitalize">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </td>
                        <td className="px-4 py-2">{value as string}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="reviews" className="mt-6">
          <div className="space-y-6">
            {reviews.length > 0 ? (
              reviews.map((review: any) => (
                <Card key={review.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                        <span className="text-gray-600 font-medium">
                          {review.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium">{review.name}</h4>
                          <span className="text-sm text-gray-500">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex text-electric-blue mb-2">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star 
                              key={i} 
                              className={`w-4 h-4 ${i < review.rating ? 'fill-current' : ''}`} 
                            />
                          ))}
                        </div>
                        <p className="text-gray-700">{review.comment}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="p-6 text-center">
                  <p className="text-gray-500">No reviews yet. Be the first to review this product!</p>
                </CardContent>
              </Card>
            )}
            
            <Card>
              <CardContent className="p-6">
                <h3 className="font-orbitron text-xl font-bold mb-4">Write a Review</h3>
                <Button className="bg-electric-blue hover:bg-electric-blue-dark">
                  Write Review
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

import { MapPin, Tool, Truck } from 'lucide-react';
import React, { useState } from 'react';
import { useParams } from 'wouter';

interface FitmentOption {
  id: string;
  label: string;
  description: string;
  price?: number;
  icon: React.ReactNode;
}

const ProductPage: React.FC = () => {
  const [selectedFitment, setSelectedFitment] = useState<string>('partner');
  const [quantity, setQuantity] = useState(1);
  const params = useParams();

  const fitmentOptions: FitmentOption[] = [
    {
      id: 'self',
      label: 'No, I\'ll do it myself',
      description: 'Just the product',
      icon: <Tool className="w-5 h-5" />
    },
    {
      id: 'partner',
      label: 'Partner Centre',
      description: 'Select a fitment centre',
      icon: <MapPin className="w-5 h-5" />
    },
    {
      id: 'home',
      label: 'Home Delivery',
      description: 'AED 50 for delivery & installation',
      price: 50,
      icon: <Truck className="w-5 h-5" />
    },
    {
      id: 'mobile',
      label: 'Mobile Van',
      description: 'AED 80 (Dubai only)',
      price: 80,
      icon: <Tool className="w-5 h-5" />
    }
  ];

  const productDetails = {
    name: 'Bridgestone Turanza T005',
    price: 285.00,
    size: '205/55 R16',
    loadSpeedIndex: '91V',
    manufactoryYear: '2025',
    warranty: '1 Year Warranty',
    sku: 'TYO-B28570171211185K03LR-2025',
    description: 'Premium all-season tyre with excellent wet grip and fuel efficiency',
    images: ['/path/to/image1.jpg', '/path/to/image2.jpg', '/path/to/image3.jpg']
  };

  const handleQuantityChange = (change: number) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1) {
      setQuantity(newQuantity);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Breadcrumb */}
        <nav className="text-sm mb-4">
          <ol className="flex items-center space-x-2">
            <li><a href="/" className="text-gray-500 hover:text-gray-700">Home</a></li>
            <li><span className="text-gray-500">/</span></li>
            <li><a href="/tyres" className="text-gray-500 hover:text-gray-700">Tyres</a></li>
            <li><span className="text-gray-500">/</span></li>
            <li className="text-gray-900">Turanza T005</li>
          </ol>
        </nav>

        {/* Left Column - Images */}
        <div className="w-full md:w-1/2">
          {/* Main Image */}
          <div className="relative h-[400px] bg-white rounded-lg overflow-hidden">
            <img
              src={productDetails.images[0]}
              alt={productDetails.name}
              className="w-full h-full object-contain"
            />
          </div>
          
          {/* Thumbnail Images */}
          <div className="flex gap-2 mt-2">
            {productDetails.images.map((image, index) => (
              <div 
                key={index} 
                className="relative w-24 h-24 bg-white rounded-lg overflow-hidden border border-gray-200 hover:border-blue-500 cursor-pointer transition-colors"
              >
                <img
                  src={image}
                  alt={`${productDetails.name} view ${index + 1}`}
                  className="w-full h-full object-contain"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Right Column - Product Information */}
        <div className="w-full md:w-1/2">
          <div className="bg-white p-6 rounded-lg">
            <h2 className="text-2xl font-bold text-red-600 mb-6">PRODUCT INFORMATION</h2>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-gray-200">
                <span className="text-gray-600">Product Name:</span>
                <span className="font-medium">{productDetails.name}</span>
              </div>
              
              <div className="flex justify-between items-center py-2 border-b border-gray-200">
                <span className="text-gray-600">Tyre Size:</span>
                <span className="font-medium">{productDetails.size}</span>
              </div>
              
              <div className="flex justify-between items-center py-2 border-b border-gray-200">
                <span className="text-gray-600">Load / Speed Index:</span>
                <span className="font-medium">{productDetails.loadSpeedIndex}</span>
              </div>
              
              <div className="flex justify-between items-center py-2 border-b border-gray-200">
                <span className="text-gray-600">Manufactory Year:</span>
                <span className="font-medium">{productDetails.manufactoryYear}</span>
              </div>
              
              <div className="flex justify-between items-center py-2 border-b border-gray-200">
                <span className="text-gray-600">Warranty:</span>
                <span className="font-medium">{productDetails.warranty}</span>
              </div>
              
              <div className="flex justify-between items-center py-2 border-b border-gray-200">
                <span className="text-gray-600">Description:</span>
                <span className="font-medium text-right">{productDetails.description}</span>
              </div>
              
              <div className="flex justify-between items-center py-2 border-b border-gray-200">
                <span className="text-gray-600">SKU:</span>
                <span className="font-medium">{productDetails.sku}</span>
              </div>
            </div>

            <div className="mt-6">
              <div className="text-green-600 font-medium">In Stock</div>
              <div className="text-sm text-gray-600 mt-1">
                Set of 1: AED {productDetails.price.toFixed(2)}
                <br />
                All prices include VAT
              </div>
              <div className="text-3xl font-bold mt-2">
                AED {productDetails.price.toFixed(2)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage; 
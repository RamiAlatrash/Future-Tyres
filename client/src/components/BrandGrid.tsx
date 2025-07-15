import { useLanguage } from '@/contexts/LanguageContext';

interface Brand {
  name: string;
  imageUrl: string;
  count: number;
}

interface BrandGridProps {
  brands: Brand[];
  onBrandSelect: (brandName: string) => void;
  title?: string;
}

export default function BrandGrid({ brands, onBrandSelect, title }: BrandGridProps) {
  const { t } = useLanguage();

  return (
    <div className="mb-16 py-20 bg-gradient-to-b from-gray-900 via-black to-gray-900 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, #dc2626 0%, transparent 50%), 
                           radial-gradient(circle at 75% 75%, #dc2626 0%, transparent 50%)`,
          backgroundSize: '100px 100px'
        }}></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="font-orbitron text-5xl font-black text-white mb-6 tracking-widest uppercase">
            {title || t('shop_by_brand')}
          </h2>
          <div className="w-32 h-1 bg-gradient-to-r from-red-500 to-red-700 mx-auto mb-6 shadow-lg shadow-red-500/50"></div>
          <p className="text-gray-400 text-xl max-w-3xl mx-auto font-light tracking-wide">
            Choose your performance brand
          </p>
        </div>
        
        {/* Centered Brand Logos */}
        <div className="flex flex-wrap justify-center items-center gap-12 lg:gap-16">
          {brands.map((brand, index) => (
            <button
              key={brand.name}
              onClick={() => onBrandSelect(brand.name)}
              className="group relative transform transition-all duration-300 hover:scale-105"
              style={{
                animationDelay: `${index * 150}ms`
              }}
            >
              {/* Main Brand Container */}
              <div className="relative w-40 h-24 lg:w-48 lg:h-28 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl border border-gray-700 hover:border-red-500 transition-all duration-300 overflow-hidden">
                
                {/* Simple Hover Overlay */}
                <div className="absolute inset-0 bg-gray-800 group-hover:bg-gray-750 transition-colors duration-300"></div>
                
                                 {/* Brand Logo */}
                 <div className="absolute inset-0 flex items-center justify-center p-6 z-10">
                   <img
                     src={brand.imageUrl}
                     alt={brand.name}
                     className="max-w-full max-h-full object-contain filter brightness-90 group-hover:brightness-110 transition-all duration-300"
                   />
                 </div>
                 
                 {/* Racing Line */}
                 <div className="absolute bottom-0 left-0 w-full h-1 bg-red-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-center"></div>
              </div>
              
              {/* Brand Name */}
              <div className="mt-6 text-center">
                <h3 className="font-orbitron font-bold text-white text-sm tracking-widest uppercase group-hover:text-red-400 transition-colors duration-300">
                  {brand.name}
                </h3>
                <div className="mt-2 flex items-center justify-center space-x-3">
                  <div className="w-6 h-px bg-gray-600 group-hover:bg-red-500 transition-colors duration-300"></div>
                  <span className="text-xs text-gray-400 font-medium tracking-wider uppercase">
                    {brand.count} {brand.count === 1 ? 'Product' : 'Products'}
                  </span>
                  <div className="w-6 h-px bg-gray-600 group-hover:bg-red-500 transition-colors duration-300"></div>
                </div>
              </div>
            </button>
          ))}
        </div>
        
        {/* Simple Bottom Section */}
        <div className="flex justify-center mt-16">
          <p className="text-gray-400 text-sm font-light tracking-wider uppercase">
            Click any brand to explore their collection
          </p>
        </div>
      </div>
    </div>
  );
} 
import React from 'react';

interface Brand {
  id: string;
  name: string;
  logo?: string;
  count?: number;
}

interface SimpleBrandListProps {
  brands: Brand[];
  onBrandSelect: (brandId: string | null) => void;
  selectedBrand?: string | null;
}

export const SimpleBrandList: React.FC<SimpleBrandListProps> = ({
  brands,
  onBrandSelect,
  selectedBrand
}) => {
  return (
    <div className="w-full">
      <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
        <span className="w-1 h-6 bg-gradient-to-b from-blue-400 to-blue-600 rounded-full mr-3"></span>
        Filter by Brand
      </h3>
      
      <div className="flex flex-wrap gap-2">
        {/* All Brands Option */}
        <button
          onClick={() => onBrandSelect(null)}
          className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
            !selectedBrand
              ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg ring-2 ring-blue-400/30'
              : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50 hover:text-white border border-gray-600/30'
          }`}
        >
          All Brands
        </button>

        {/* Individual Brand Options */}
        {brands.map((brand) => (
          <button
            key={brand.id}
            onClick={() => onBrandSelect(brand.id)}
            className={`flex items-center px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              selectedBrand === brand.id
                ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg ring-2 ring-blue-400/30'
                : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50 hover:text-white border border-gray-600/30'
            }`}
          >
            {/* Remove brand logo image */}
            <span>{brand.name}</span>
            {brand.count !== undefined && (
              <span className="ml-2 text-xs px-2 py-1 bg-gray-600/50 text-gray-300 rounded-full">
                {brand.count}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}; 
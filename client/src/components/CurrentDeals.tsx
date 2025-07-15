import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getCurrentDeals, Deal } from "@/data/deals";
import { Tag } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useLocation } from "wouter";
import ProductCard from "@/components/ProductCard";

export default function CurrentDeals() {
  const [deals] = useState<Deal[]>(() => getCurrentDeals().slice(0, 8)); // Show 8 deals total
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [, navigate] = useLocation();

  // Auto-scroll functionality
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container || deals.length <= 4) return; // Only scroll if more than 4 deals

    let scrollDirection = 1;
    const scrollStep = 1;
    const scrollSpeed = 30; // milliseconds between scroll steps
    let isScrolling = true;

    const autoScroll = () => {
      if (!container || !isScrolling) return;

      const maxScrollLeft = container.scrollWidth - container.clientWidth;
      
      if (container.scrollLeft >= maxScrollLeft - 2) {
        scrollDirection = -1;
      } else if (container.scrollLeft <= 2) {
        scrollDirection = 1;
      }

      container.scrollLeft += scrollDirection * scrollStep;
    };

    const interval = setInterval(autoScroll, scrollSpeed);

    // Pause on hover
    const handleMouseEnter = () => { isScrolling = false; };
    const handleMouseLeave = () => { isScrolling = true; };

    container.addEventListener('mouseenter', handleMouseEnter);
    container.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      clearInterval(interval);
      container.removeEventListener('mouseenter', handleMouseEnter);
      container.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [deals.length]);

  // Navigate to product page with deals filter
  const handleDealClick = (deal: Deal) => {
    if (deal.productType === 'tyre') {
      navigate(`/product/tyre/${deal.productId}`);
    } else if (deal.productType === 'accessory') {
      navigate(`/accessory/${deal.productId}`);
    }
  };

  // Navigate to deals page
  const handleViewAllDeals = () => {
    navigate('/deals');
  };

  if (deals.length === 0) return null;

  return (
    <section className="py-16 bg-gradient-to-r from-red-50 to-orange-50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Tag className="h-6 w-6 text-red-600" />
            <h2 className="font-orbitron text-3xl font-bold text-future-black">
              Current Deals
            </h2>
          </div>
          <p className="text-gray-700 max-w-2xl mx-auto">
            Don't miss out on these limited-time offers on premium tyres and accessories
          </p>
        </div>

        {/* Horizontal Scrolling Deals */}
        <div className="relative max-w-6xl mx-auto">
          <div 
            ref={scrollContainerRef}
            className="flex gap-6 overflow-x-auto scrollbar-hide pb-4 px-4"
            style={{
              scrollBehavior: 'smooth',
              msOverflowStyle: 'none',
              scrollbarWidth: 'none'
            }}
          >
            {deals.map((deal) => (
              <div 
                key={deal.id} 
                className="flex-shrink-0 w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] xl:w-[calc(25%-18px)]"
              >
                <ProductCard
                  product={deal.product}
                  type={deal.productType}
                  layout="uniform"
                  onClick={() => handleDealClick(deal)}
                />
              </div>
            ))}
          </div>
        </div>

        {/* View All Deals Button */}
        <div className="text-center mt-8">
          <Button 
            size="lg"
            className="bg-red-600 hover:bg-red-700 text-white px-8 py-3"
            onClick={handleViewAllDeals}
          >
            View All Deals
          </Button>
        </div>
      </div>


    </section>
  );
} 
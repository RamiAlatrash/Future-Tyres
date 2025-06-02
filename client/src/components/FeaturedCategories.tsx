import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { Car, Lightbulb, Settings, Truck } from "lucide-react";

export default function FeaturedCategories() {
  const categories = [
    {
      title: "Tyres by Brand",
      description: "Premium brands available",
      href: "/tyres",
      icon: Car,
      brands: ["BRIDGE", "GOOD", "MICH"],
    },
    {
      title: "Off-Road Accessories",
      description: "Bumpers, lights, lift kits & more",
      href: "/accessories",
      icons: [Car, Lightbulb, Settings],
    },
    {
      title: "Mobile Fitment",
      description: "We come to you",
      href: "/contact",
      icon: Truck,
      badge: "Dubai Only",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
      {categories.map((category, index) => (
        <Link key={index} href={category.href}>
          <Card className="product-card cursor-pointer text-center">
            <CardContent className="p-8">
              {/* Category 1: Brand logos */}
              {category.brands && (
                <div className="flex justify-center space-x-4 mb-6">
                  {category.brands.map((brand, idx) => (
                    <div 
                      key={idx}
                      className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center grayscale hover:grayscale-0 transition-all"
                    >
                      <span className="text-xs font-bold">{brand}</span>
                    </div>
                  ))}
                </div>
              )}
              
              {/* Category 2: Multiple icons */}
              {category.icons && (
                <div className="flex justify-center space-x-4 mb-6">
                  {category.icons.map((Icon, idx) => (
                    <Icon key={idx} className="w-8 h-8 text-future-black" />
                  ))}
                </div>
              )}
              
              {/* Category 3: Single icon with badge */}
              {category.icon && !category.icons && (
                <div className="relative mb-6">
                  <category.icon className="w-12 h-12 text-future-black mx-auto" />
                  {category.badge && (
                    <span className="absolute -top-2 -right-2 bg-electric-blue text-white text-xs px-2 py-1 rounded-full">
                      {category.badge}
                    </span>
                  )}
                </div>
              )}
              
              <h3 className="font-orbitron text-xl font-bold text-future-black mb-2">
                {category.title}
              </h3>
              <p className="text-gray-600">{category.description}</p>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}

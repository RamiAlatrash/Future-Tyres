import HeroSection from "@/components/HeroSection";
import SearchWidget from "@/components/SearchWidget";
import FeaturedCategories from "@/components/FeaturedCategories";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

export default function HomePage() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const { data: blogPosts = [] } = useQuery({
    queryKey: ["/api/blog"],
  });

  const testimonials = [
    {
      text: "Great service—tyre fitment in 2 hours!",
      author: "Ahmed Al-Rashid",
    },
    {
      text: "Outstanding customer service and quality products.",
      author: "Sarah Johnson",
    },
    {
      text: "Professional mobile fitment service exceeded expectations.",
      author: "Mohammed Hassan",
    },
  ];

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <HeroSection />

      {/* Search Widget */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <SearchWidget />
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <FeaturedCategories />
        </div>
      </section>

      {/* Knowledge Hub Preview */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-orbitron text-4xl font-bold text-future-black mb-4">From the Knowledge Hub</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {blogPosts.slice(0, 3).map((post: any) => (
              <Card key={post.id} className="product-card overflow-hidden">
                <img 
                  src={post.featuredImage || "https://images.unsplash.com/photo-1487754180451-c456f719a1fc?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250"}
                  alt={post.title}
                  className="w-full h-48 object-cover"
                />
                <CardContent className="p-6">
                  <h3 className="font-orbitron font-bold text-future-black mb-3">{post.title}</h3>
                  <p className="text-gray-600 mb-4">{post.excerpt}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                      {new Date(post.publishedAt).toLocaleDateString()}
                    </span>
                    <Link href={`/blog/${post.slug}`}>
                      <span className="text-electric-blue font-medium hover:underline cursor-pointer">
                        Read More
                      </span>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Carousel */}
      <section className="py-20 bg-future-black">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <p className="text-xl italic text-white mb-4">
              "{testimonials[currentTestimonial].text}"
            </p>
            <p className="text-white opacity-75">
              — {testimonials[currentTestimonial].author}
            </p>
            
            <div className="flex justify-center space-x-4 mt-8">
              <Button
                variant="ghost"
                size="sm"
                onClick={prevTestimonial}
                className="text-white hover:text-electric-blue"
              >
                <ChevronLeft className="w-6 h-6" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={nextTestimonial}
                className="text-white hover:text-electric-blue"
              >
                <ChevronRight className="w-6 h-6" />
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function HeroSection() {
  return (
    <section className="hero-bg h-screen flex items-center justify-center text-white">
      <div className="container mx-auto px-4 text-center">
        <h1 className="font-orbitron text-4xl md:text-6xl font-bold mb-6">
          Find the Perfect Tyres & Accessories
        </h1>
        <p className="text-xl md:text-2xl mb-12 max-w-3xl mx-auto">
          Shop by Size, Vehicle, or Browse Our Off-Road Catalog
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <Link href="/tyres">
            <Button 
              size="lg"
              className="bg-electric-blue hover:bg-electric-blue-dark text-white px-8 py-4 text-lg font-medium transform hover:scale-105"
            >
              Search Tyres
            </Button>
          </Link>
          <Link href="/accessories">
            <Button 
              variant="outline"
              size="lg"
              className="bg-transparent border-2 border-electric-blue text-white hover:bg-electric-blue hover:text-white px-8 py-4 text-lg font-medium transform hover:scale-105"
            >
              Shop Accessories
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

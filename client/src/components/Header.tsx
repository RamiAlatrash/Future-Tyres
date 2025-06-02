import { Link, useLocation } from "wouter";
import { ShoppingCart, Menu, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/useCart";
import { useState } from "react";

export default function Header() {
  const [location] = useLocation();
  const { getTotalItems, toggleCart } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const navigation = [
    { name: "Home", href: "/" },
    { name: "Tyres", href: "/tyres" },
    { name: "Accessories", href: "/accessories" },
    { name: "Blog", href: "/blog" },
    { name: "Reviews", href: "/reviews" },
    { name: "Contact", href: "/contact" },
  ];

  const isActive = (href: string) => {
    if (href === "/") return location === "/";
    return location.startsWith(href);
  };

  return (
    <header className="bg-future-black text-white h-20 fixed w-full z-50 shadow-lg">
      <div className="container mx-auto px-4 h-full flex items-center justify-between">
        {/* Logo */}
        <Link href="/">
          <div className="flex items-center space-x-2 cursor-pointer">
            <div 
              className="logo-glitch font-orbitron text-xl font-bold" 
              data-text="FUTURE TYRE TRADING"
            >
              FUTURE TYRE TRADING
            </div>
          </div>
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-8">
          {navigation.map((item) => (
            <Link key={item.name} href={item.href}>
              <span 
                className={`hover:text-electric-blue border-b-2 border-transparent hover:border-electric-blue pb-1 cursor-pointer ${
                  isActive(item.href) ? "text-electric-blue border-electric-blue" : ""
                }`}
              >
                {item.name}
              </span>
            </Link>
          ))}
        </nav>
        
        {/* Auth & Cart */}
        <div className="flex items-center space-x-4">
          <Button 
            variant="ghost" 
            className="hidden lg:inline-flex text-white hover:text-electric-blue"
          >
            <User className="w-4 h-4 mr-2" />
            Login
          </Button>
          
          <Button
            variant="ghost"
            className="relative p-2 hover:text-electric-blue"
            onClick={toggleCart}
          >
            <ShoppingCart className="w-6 h-6" />
            {getTotalItems() > 0 && (
              <span className="absolute -top-1 -right-1 bg-electric-blue text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {getTotalItems()}
              </span>
            )}
          </Button>
          
          {/* Mobile menu button */}
          <Button
            variant="ghost"
            className="lg:hidden p-2 hover:text-electric-blue"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu className="w-6 h-6" />
          </Button>
        </div>
      </div>
      
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <div 
            className="fixed right-0 top-0 h-full w-80 bg-white shadow-2xl transform transition-transform z-50"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b">
              <span className="font-orbitron text-xl font-bold text-future-black">Menu</span>
              <Button
                variant="ghost"
                className="p-2 text-future-black"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                ×
              </Button>
            </div>
            <nav className="flex-1 px-4 py-8 space-y-6">
              {navigation.map((item) => (
                <Link key={item.name} href={item.href}>
                  <div 
                    className="block text-lg text-future-black hover:text-electric-blue cursor-pointer"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.name}
                  </div>
                </Link>
              ))}
              <div className="border-t pt-6 space-y-4">
                <Button className="block text-lg text-future-black hover:text-electric-blue w-full text-left">
                  Login
                </Button>
                <Button className="block text-lg text-future-black hover:text-electric-blue w-full text-left">
                  Register
                </Button>
              </div>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}

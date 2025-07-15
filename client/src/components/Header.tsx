import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/useCart";
import { Menu, ShoppingCart, User } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useLanguage } from '../contexts/LanguageContext';
import { LanguageSelector } from './LanguageSelector';

export default function Header() {
  const [location] = useLocation();
  const { totalItems } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { t, setLanguage } = useLanguage();
  
  const navigation = [
    { name: t('nav.home'), href: "/" },
    { name: t('nav.tyres'), href: "/tyres" },
    { name: t('nav.accessories'), href: "/accessories" },
    // Sale button will be inserted here
    { name: t('nav.reviews'), href: "/reviews" },
    { name: t('nav.contact'), href: "/contact" },
  ];

  const isActive = (href: string) => {
    if (href === "/") return location === "/";
    return location.startsWith(href);
  };

  return (
    <header className="bg-sky-800 text-white h-20 fixed w-full z-50 shadow-lg">
      <div className="container mx-auto px-4 h-full flex items-center justify-between">
        {/* Logo */}
        <Link href="/">
          <div className="flex items-center space-x-2 cursor-pointer">
            <img 
              src="/FutureLogo.png" 
              alt="Future Tyres Logo" 
              className="h-12 w-auto"
            />
            <div 
              className="logo-glitch font-orbitron text-xl font-bold" 
              data-text="FUTURE TYRE TRADING"
            >
              FUTURE TYRE TRADING
            </div>
          </div>
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-x-8">
          {navigation.map((item, idx) => (
            <>
              <Link key={item.name} href={item.href}>
                <span 
                  className={`hover:text-sky-200 border-b-2 border-transparent hover:border-sky-200 pb-1 cursor-pointer ${
                    isActive(item.href) ? "text-sky-200 border-sky-200" : ""
                  }`}
                >
                  {item.name}
                </span>
              </Link>
              {/* Insert Sale link after Accessories */}
              {item.name === t('nav.accessories') && (
                <Link href="/deals">
                  <span
                    className="font-bold text-rose-500 hover:text-rose-600 border-b-2 border-transparent hover:border-rose-600 pb-1 cursor-pointer transition"
                    style={{ minWidth: '90px' }}
                  >
                    Sale
                  </span>
                </Link>
              )}
            </>
          ))}
        </nav>
        
        {/* Auth, Language & Cart */}
        <div className="flex items-center gap-x-4">
          <Link href="/login">
            <Button 
              variant="ghost" 
              className="hidden lg:inline-flex text-white hover:text-sky-200"
            >
              <User className="w-4 h-4 mr-2" />
              {t('nav.login')}
            </Button>
          </Link>
          
          <div className="hidden lg:block">
            <LanguageSelector onLanguageChange={setLanguage} />
          </div>
          
          <Link href="/cart">
            <Button
              variant="ghost"
              className="relative p-2 hover:text-sky-200 text-white"
            >
            <ShoppingCart className="w-6 h-6" />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-sky-700 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {totalItems}
              </span>
            )}
            </Button>
          </Link>
          
          {/* Mobile menu button */}
          <Button
            variant="ghost"
            className="lg:hidden p-2 hover:text-sky-200 text-white"
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
              <span className="font-orbitron text-xl font-bold text-sky-800">Menu</span>
              <Button
                variant="ghost"
                className="p-2 text-sky-800"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                ×
              </Button>
            </div>
            <nav className="flex-1 px-4 py-8 space-y-6">
              {navigation.map((item) => (
                <Link key={item.name} href={item.href}>
                  <div 
                    className="block text-lg text-sky-800 hover:text-sky-600 cursor-pointer"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.name}
                  </div>
                </Link>
              ))}
              <div className="border-t pt-6 space-y-4">
                <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start text-lg text-sky-800 hover:text-sky-600">
                    {t('nav.login')}
                  </Button>
                </Link>
                <div className="px-4">
                  <LanguageSelector onLanguageChange={setLanguage} />
                </div>
              </div>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}

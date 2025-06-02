import { useState } from "react";
import { Link } from "wouter";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps = { isOpen: false, onClose: () => {} }) {
  const navigation = [
    { name: "Home", href: "/" },
    { name: "Tyres", href: "/tyres" },
    { name: "Accessories", href: "/accessories" },
    { name: "Blog", href: "/blog" },
    { name: "Reviews", href: "/reviews" },
    { name: "Contact", href: "/contact" },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-white z-40 lg:hidden">
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between p-4 border-b">
          <span className="font-orbitron text-xl font-bold text-future-black">Menu</span>
          <Button variant="ghost" className="p-2 text-future-black" onClick={onClose}>
            <X className="w-6 h-6" />
          </Button>
        </div>
        <nav className="flex-1 px-4 py-8 space-y-6">
          {navigation.map((item) => (
            <Link key={item.name} href={item.href}>
              <div 
                className="block text-lg text-future-black hover:text-electric-blue cursor-pointer"
                onClick={onClose}
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
  );
}

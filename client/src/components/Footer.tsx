import { Link } from "wouter";
import { MapPin, Phone, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export default function Footer() {
  const [email, setEmail] = useState("");
  const { toast } = useToast();

  const navigation = [
    { name: "Home", href: "/" },
    { name: "Tyres", href: "/tyres" },
    { name: "Accessories", href: "/accessories" },
    { name: "Blog", href: "/blog" },
    { name: "Reviews", href: "/reviews" },
    { name: "Contact", href: "/contact" },
  ];

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    try {
      await apiRequest("POST", "/api/newsletter", { email });
      toast({
        title: "Success!",
        description: "Thank you for subscribing to our newsletter.",
      });
      setEmail("");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to subscribe. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <footer className="bg-gray-800 text-white py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Quick Links */}
          <div>
            <h3 className="font-orbitron text-lg font-bold mb-6">Quick Links</h3>
            <div className="space-y-3">
              {navigation.map((item) => (
                <Link key={item.name} href={item.href}>
                  <span className="block hover:text-electric-blue cursor-pointer">
                    {item.name}
                  </span>
                </Link>
              ))}
            </div>
          </div>
          
          {/* Contact Info */}
          <div>
            <h3 className="font-orbitron text-lg font-bold mb-6">Contact Info</h3>
            <div className="space-y-3">
              <div className="flex items-center">
                <MapPin className="w-5 h-5 mr-3" />
                <span>Sheikh Zayed Road, Dubai, UAE</span>
              </div>
              <div className="flex items-center">
                <Phone className="w-5 h-5 mr-3" />
                <span>+971 4 123 4567</span>
              </div>
              <div className="flex items-center">
                <Mail className="w-5 h-5 mr-3" />
                <span>info@futuretyretrading.ae</span>
              </div>
            </div>
          </div>
          
          {/* Newsletter */}
          <div>
            <h3 className="font-orbitron text-lg font-bold mb-6">Newsletter</h3>
            <p className="text-gray-300 mb-4">Stay updated with our latest offers and automotive tips</p>
            <form onSubmit={handleNewsletterSubmit} className="flex">
              <Input
                type="email"
                placeholder="Your email..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="rounded-r-none text-gray-900"
                required
              />
              <Button 
                type="submit"
                className="bg-electric-blue hover:bg-electric-blue-dark rounded-l-none"
              >
                Subscribe
              </Button>
            </form>
          </div>
        </div>
        
        {/* Copyright */}
        <div className="border-t border-gray-700 pt-8 text-center">
          <p className="text-gray-400">&copy; 2025 Future Tyre Trading. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
}

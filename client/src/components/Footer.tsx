import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Mail, MapPin, Phone } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";

export default function Footer() {
  const { t } = useLanguage();
  const [email, setEmail] = useState("");
  const { toast } = useToast();

  const navigation = [
    { name: t('nav.home'), href: "/" },
    { name: t('nav.tyres'), href: "/tyres" },
    { name: t('nav.accessories'), href: "/accessories" },
    { name: t('nav.reviews'), href: "/reviews" },
    { name: t('nav.contact'), href: "/contact" },
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
            <h3 className="font-orbitron text-lg font-bold mb-6">{t('footer.links.quick')}</h3>
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
            <h3 className="font-orbitron text-lg font-bold mb-6">{t('footer.contact.title')}</h3>
            <div className="space-y-3">
              <div className="flex items-center">
                <MapPin className="w-5 h-5 mr-3" />
                <span>{t('contact.address.content')}</span>
              </div>
              <div className="flex items-center">
                <Phone className="w-5 h-5 mr-3" />
                <span>{t('contact.phone.content')}</span>
              </div>
              <div className="flex items-center">
                <Mail className="w-5 h-5 mr-3" />
                <span>{t('contact.email.content')}</span>
              </div>
            </div>
          </div>
          
          {/* Newsletter */}
          <div>
            <h3 className="font-orbitron text-lg font-bold mb-6">{t('footer.newsletter.title')}</h3>
            <p className="text-gray-300 mb-4">{t('footer.newsletter.subtitle')}</p>
            <form onSubmit={handleNewsletterSubmit} className="flex">
              <Input
                type="email"
                placeholder={t('footer.newsletter.email.placeholder')}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="rounded-r-none text-gray-900"
                required
              />
              <Button type="submit" className="bg-electric-blue hover:bg-electric-blue-dark rounded-l-none">
                {t('footer.newsletter.button')}
              </Button>
            </form>
          </div>
        </div>
        
        {/* Copyright */}
        <div className="border-t border-gray-700 pt-8 text-center">
          <p className="text-gray-400">{t('footer.copyright')}</p>
        </div>
      </div>
    </footer>
  );
}

// src/pages/HomePage.tsx

import SearchWidget from "@/components/SearchWidget";
import CurrentDeals from "@/components/CurrentDeals";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import {
    ChevronLeft,
    ChevronRight,
    Clock,
    Mail,
    MapPin,
    MessageCircle,
    MessageSquare,
    Phone,
    X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link } from "wouter";

// —————————————————————————————————————————————————————————————————————————
// 0) Header with Logo and Home Link
// —————————————————————————————————————————————————————————————————————————
function Header() {
  return (
    <header className="fixed top-0 left-0 w-full bg-white shadow-sm z-30">
      <div className="container mx-auto px-4 py-3 flex items-center">
        {/* Clickable logo that scrolls to top */} 
        <a href="#top" className="flex items-center">
          <img
            src="/FutureLogo.png"
            alt="Future Tyre Trading Logo"
            className="h-10 w-auto"
          />
          <span className="ml-3 font-orbitron text-2xl text-future-black">
            Future Tyre Trading
          </span>
        </a>
      </div>
    </header>
  );
}

// —————————————————————————————————————————————————————————————————————————
// 1) Notification Popup (Sign-up for 10% Off)
// —————————————————————————————————————————————————————————————————————————
function SignupModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const modalRef = useRef<HTMLDivElement>(null);

  // Close if click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div
        ref={modalRef}
        className="relative bg-white rounded-lg shadow-lg max-w-sm w-full p-6 animate-fadeIn"
      >
        {/* Close "X" Icon */}
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
          onClick={onClose}
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        <h2 className="text-2xl font-bold text-future-black mb-4 text-center">
          Welcome to Future Tyre Trading
        </h2>
        <p className="text-gray-700 mb-6 text-center">
          Sign up now and get{" "}
          <span className="text-electric-blue font-semibold">10% off</span> on
          your first order!
        </p>
        <input
          type="email"
          placeholder="Enter your email"
          className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-electric-blue"
        />
        <Button
          className="w-full bg-electric-blue hover:bg-electric-blue-dark text-white"
          onClick={() => {
            alert("Thank you for signing up! We've sent you a 10% coupon.");
            onClose();
          }}
        >
          Sign Up
        </Button>
        <button
          className="mt-4 text-sm text-gray-500 hover:text-gray-700 block mx-auto"
          onClick={onClose}
        >
          No, thanks
        </button>
      </div>
    </div>
  );
}

// Tailwind animations (add these to your global CSS / tailwind.config.js):
/*
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
@keyframes fadeInDown {
  from { opacity: 0; transform: translateY(-20px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fadeIn { animation: fadeIn 0.3s ease-out; }
.animate-fadeInDown { animation: fadeInDown 0.6s ease-out; }
.animate-fadeInUp { animation: fadeInUp 0.6s ease-out; }
*/

// —————————————————————————————————————————————————————————————————————————
// 2) Hero Carousel Section
// —————————————————————————————————————————————————————————————————————————
function HeroSection() {
  const { t } = useLanguage();
  // Updated slide images with slight black overlay
  const slides = [
    "https://static.tyresonline.ae/static/version1747975257/frontend/Hditsol/tyresonline/en_US/images/banner/welcome-to-tyres-online-uae.webp",
    "https://www.ramyautomotive.com/media/weltpixel/owlcarouselslider/images/4/x/4x4_banner-1-pc_banner_e.png",
    "https://www.ramyautomotive.com/media/weltpixel/owlcarouselslider/images/b/r/brand_banner-1-pc_banner_e.png",
  ];

  // Updated brand logos
  const brandLogos = [
    "https://brandlogos.net/wp-content/uploads/2014/10/pirelli-logo_brandlogos.net_dlsz9.png",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Bridgestone_logo.svg/2560px-Bridgestone_logo.svg.png",
    "https://www.cdnlogo.com/logos/m/70/michelin.svg",
    "https://purepng.com/public/uploads/large/purepng.com-goodyear-logologobrand-logoiconslogos-251519940623n2qz5.png",
    "https://www.cdnlogo.com/logos/c/82/continental.svg",
  ];

  const [currentSlide, setCurrentSlide] = useState(0);
  const length = slides.length;

  // Auto‐advance every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev === length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(timer);
  }, [length]);

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? length - 1 : prev - 1));
  };
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === length - 1 ? 0 : prev + 1));
  };

  return (
    <section id="top" className="relative h-screen overflow-hidden">
      {/* Slides */}
      {slides.map((url, idx) => (
        <div
          key={idx}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            idx === currentSlide
              ? "opacity-100"
              : "opacity-0 pointer-events-none"
          }`}
        >
          <img
            src={url}
            alt={`Slide ${idx + 1}`}
            className="w-full h-full object-cover"
          />
          {/* Semi‐transparent black overlay */}
          <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        </div>
      ))}

      {/* Left/Right arrow controls */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-70 hover:bg-opacity-90 rounded-full p-2 shadow-md transition z-20"
      >
        <ChevronLeft className="h-6 w-6 text-gray-800" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-70 hover:bg-opacity-90 rounded-full p-2 shadow-md transition z-20"
      >
        <ChevronRight className="h-6 w-6 text-gray-800" />
      </button>

      {/* Overlay content (logos, headings, search bar) */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
        {/* Manufacturer Logos */}
        <div className="flex flex-wrap justify-center items-center gap-x-8 gap-y-4 mb-8 opacity-90 animate-fadeInDown">
          {brandLogos.map((src, i) => (
            <div key={i} className="w-28 h-12 flex justify-center items-center">
                <img
                    src={src}
                    alt={`Brand ${i}`}
                    className="max-h-full max-w-full object-contain"
                />
            </div>
          ))}
        </div>

        <h1 className="font-orbitron text-5xl md:text-6xl font-bold text-white mb-4 animate-fadeInDown">
          {t('home.hero.title')}
        </h1>
        <div className="relative w-full max-w-lg animate-fadeInUp delay-100">
          <p className="text-xl text-gray-200 mb-4">{t('home.hero.subtitle')}</p>
          <p className="text-gray-300 mb-8">{t('home.hero.brands')}</p>

          {/* Render the SearchWidget component here instead of the input */}
          <SearchWidget searchType="tyre" />

        </div>
      </div>

      {/* Floating "Google Reviews" badge */}
      <div className="fixed bottom-4 left-4 bg-white rounded-lg shadow-lg px-4 py-2 flex items-center space-x-2 opacity-95">
        <div className="flex items-center space-x-1">
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/800px-Google_%22G%22_logo.svg.png"
          alt="Google"
            className="h-5 w-5"
        />
          <span className="text-lg font-bold text-future-black">4.9</span>
        </div>
        <div className="flex items-center space-x-0.5">
          {Array.from({ length: 5 }).map((_, i) => (
              <svg
                key={i}
              className="h-4 w-4 text-yellow-400 fill-current"
              viewBox="0 0 24 24"
              >
              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
              </svg>
            ))}
        </div>
      </div>
    </section>
  );
}

// —————————————————————————————————————————————————————————————————————————
// 3) Step-by-Step Purchase Flow Section
// —————————————————————————————————————————————————————————————————————————
function StepByStepSection() {
  const { t } = useLanguage();
  // Updated with actual Unsplash image URLs
  const steps = [
    {
      img: "https://images.unsplash.com/photo-1559674697-7ebabb38c369?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fHRpcmVzfGVufDB8fDB8fHww",
      title: t('home.steps.1.title'),
    },
    {
      img: "https://images.unsplash.com/photo-1593699199342-59b40e08f0ac?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dGlyZSUyMHNob3B8ZW58MHx8MHx8fDA%3D",
      title: t('home.steps.2.title'),
    },
    {
      img: "https://plus.unsplash.com/premium_photo-1673886205989-24c637783c60?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8Y2FyJTIwcGFya2tpbmclMjBjYXJ8ZW58MHx8MHx8fDA%3D%3D",
      title: t('home.steps.3.title'),
    },
    {
      img: "https://images.unsplash.com/photo-1608286022625-bc07f7a21154?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fG9ubGluZSUyMHBheW1lbnR8ZW58MHx8MHx8fDA%3D",
      title: t('home.steps.4.title'),
    },
    {
      img: "https://images.unsplash.com/photo-1623564493214-6137dff043ad?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fGNhciUyMHdoZWVsfGVufDB8fDB8fHww",
      title: t('home.steps.5.title'),
    },
  ];

  return (
    <section className="py-24 bg-gray-100">
      <div className="container mx-auto px-4">
        <h2 className="font-orbitron text-4xl font-bold text-future-black mb-8 text-center relative">
          {t('home.steps.title')}
          {/* Underline that animates in on mount */}
          <span className="block h-1 bg-sky-800 w-0 mx-auto mt-2 animate-underline"></span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
          {steps.map((step, idx) => (
            <div
              key={idx}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition animate-fadeInUp delay-[calc(100ms*var(--idx))]"
              style={{ "--idx": idx } as React.CSSProperties}
            >
              <img
                src={step.img}
                alt={step.title}
                className="w-full h-40 object-cover"
              />
              <div className="p-4 text-center">
                <h3 className="font-orbitron font-semibold text-future-black">
                  {step.title}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Tailwind keyframes (add to global CSS or tailwind.config.js):
/*
@keyframes underline {
  from { width: 0; }
  to { width: 6rem; }
}
.animate-underline { animation: underline 0.6s ease-out forwards; }
*/

// —————————————————————————————————————————————————————————————————————————
// 4) Explore Premium Accessories Section
// —————————————————————————————————————————————————————————————————————————
function AccessoriesPromoSection() {
  const { t } = useLanguage();
  // First four accessory categories (for preview only)
  const previewAccessories = [
    {
      title: t('home.accessories.drivetrain'),
      img: "https://www.ramyautomotive.com/media/catalog/category/RAMYautomotive-drivetrain_1_1.png",
      link: "/accessories/drivetrain",
    },
    {
      title: t('home.accessories.engine'),
      img: "https://www.ramyautomotive.com/media/catalog/category/RAMYautomotive-engineperformance_3_2.png",
      link: "/accessories/engine-performance",
    },
    {
      title: t('home.accessories.exterior'),
      img: "https://www.ramyautomotive.com/media/catalog/category/RAMYautomotive-exterior_3_1.png",
      link: "/accessories/exterior",
    },
    {
      title: t('home.accessories.suspension'),
      img: "https://www.ramyautomotive.com/media/catalog/category/RAMYautomotive-Suspension_1_1.png",
      link: "/accessories/suspension",
    },
  ];

  return (
    <section className="py-24 bg-sky-50">
      <div className="container mx-auto px-4 flex flex-col lg:flex-row items-center lg:items-start gap-8">
        {/* Left: Text + Button */}
        <div className="lg:w-1/3 animate-fadeInLeft text-center lg:text-left">
          <h2 className="font-orbitron text-4xl font-bold text-future-black mb-4">
            {t('home.accessories.title')}
          </h2>
          <p className="text-gray-700 mb-6">
            {t('home.accessories.subtitle')}
          </p>
          <Link href="/accessories">
            <Button className="bg-sky-800 hover:bg-sky-900 text-white px-6 py-3 transition">
              {t('home.accessories.button')}
            </Button>
          </Link>
        </div>

        {/* Right: Preview Grid of 4 Categories */}
        <div className="lg:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-6">
          {previewAccessories.map((item, idx) => (
            <Link key={idx} href={item.link}>
              <Card className="overflow-hidden hover:shadow-lg transition animate-fadeInUp delay-[calc(100ms*var(--idx))]"
                style={{ "--idx": idx } as React.CSSProperties}
              >
                <img
                  src={item.img}
                  alt={item.title}
                  className="w-full h-48 object-contain bg-white"
                />
                <CardContent className="p-4 text-center">
                  <h3 className="font-orbitron font-semibold text-future-black mb-2">
                    {item.title}
                  </h3>
                  <Button size="sm" className="bg-electric-blue text-white">
                    Show now
                  </Button>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

// —————————————————————————————————————————————————————————————————————————
// 5) Services Section
// —————————————————————————————————————————————————————————————————————————
function ServicesSection() {
  const { t } = useLanguage();
  const services = [
    {
      icon: "https://cdn-icons-png.freepik.com/512/9211/9211965.png", // updated Shop Tyres icon
      title: t('home.services.buy.title'),
      desc: t('home.services.buy.desc'),
    },
    {
      icon: "https://img.icons8.com/fluency/64/ffffff/delivery.png",
      title: t('home.services.fitment.title'),
      desc: t('home.services.fitment.desc'),
    },
    {
      icon: "https://img.icons8.com/fluency/64/ffffff/shopping-cart.png",
      title: t('home.services.shop.title'),
      desc: t('home.services.shop.desc'),
    },
  ];

  return (
    <section className="py-24 bg-sky-800">
      <div className="container mx-auto px-4">
        <h2 className="font-orbitron text-4xl font-bold text-white text-center mb-8 animate-fadeInDown">
          {t('home.services.title')}
          <span className="block h-1 bg-white w-0 mx-auto mt-2 animate-underline-white"></span>
        </h2>
        <p className="text-white text-lg text-center max-w-2xl mx-auto mb-12">
          {t('home.services.subtitle')}
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {services.map((svc, idx) => (
            <div
              key={svc.title}
              className="text-center bg-sky-900 rounded-lg p-6 hover:bg-sky-950 transition animate-fadeInUp delay-[calc(100ms*var(--idx))]"
              style={{ "--idx": idx } as React.CSSProperties}
            >
              <div className="mx-auto mb-4 h-16 w-16">
                <img src={svc.icon} alt={svc.title} className="w-full h-full" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">{svc.title}</h3>
              <p className="text-white opacity-90">{svc.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Tailwind keyframes for white underline:
/*
@keyframes underlineWhite {
  from { width: 0; }
  to { width: 6rem; }
}
.animate-underline-white { animation: underlineWhite 0.6s ease-out forwards; }
*/

// —————————————————————————————————————————————————————————————————————————
// 6) Authorized Tyre Brands Section
// —————————————————————————————————————————————————————————————————————————
function TyreBrandsSection() {
  const { t } = useLanguage();

  return (
    <section className="py-24 bg-gray-50">
      <div className="container mx-auto px-4 text-center">
        <h2 className="font-orbitron text-4xl font-bold text-future-black mb-4 animate-fadeInDown">
          {t('tyre_brands.title')}
          <span className="block h-1 bg-sky-800 w-0 mx-auto mt-2 animate-underline"></span>
        </h2>
        <p className="text-gray-700 mb-8 max-w-2xl mx-auto animate-fadeInUp">
          {t('tyre_brands.subtitle')}
        </p>
        <div className="flex justify-center items-center max-w-4xl mx-auto animate-fadeInUp delay-100">
          <img
            src="/logo - Brand.png"
            alt="Authorized Tyre Brands"
            className="max-w-full h-auto"
          />
        </div>
        <div className="mt-8 animate-fadeInUp delay-200">
          <Button className="bg-sky-800 hover:bg-sky-900 text-white px-6 py-3 transition">
            {t('tyre_brands.see_all_brands')}
          </Button>
        </div>
      </div>
    </section>
  );
}

// —————————————————————————————————————————————————————————————————————————
// 7) Car Brands Section
// —————————————————————————————————————————————————————————————————————————
function CarBrandsSection() {
  const { t } = useLanguage();
  // Authentic car brand logos from a reliable CDN, with corrected names
  const carLogos = [
    "https://cdn.simpleicons.org/audi/000",
    "https://cdn.simpleicons.org/bmw/000",
    "https://cdn.simpleicons.org/chevrolet/000",
    "https://cdn.simpleicons.org/ford/000",
    "https://cdn.simpleicons.org/honda/000",
    "https://cdn.simpleicons.org/hyundai/000",
    "https://cdn.simpleicons.org/jeep/000",
    "https://cdn.simpleicons.org/kia/000",
    "https://cdn.simpleicons.org/mazda/000",
    "https://cdn.simpleicons.org/mitsubishi/000",
    "https://cdn.simpleicons.org/nissan/000",
    "https://cdn.simpleicons.org/porsche/000",
    "https://cdn.simpleicons.org/subaru/000",
    "https://cdn.simpleicons.org/tesla/000",
    "https://cdn.simpleicons.org/toyota/000",
    "https://cdn.simpleicons.org/volkswagen/000",
    "https://cdn.simpleicons.org/volvo/000",
    "https://cdn.simpleicons.org/ferrari/000",
  ];

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4 text-center">
        <h2 className="font-orbitron text-4xl font-bold text-future-black mb-4 animate-fadeInDown">
          {t('car_brands.title')}
          <span className="block h-1 bg-sky-800 w-0 mx-auto mt-2 animate-underline"></span>
        </h2>
        <p className="text-gray-700 mb-8 max-w-2xl mx-auto animate-fadeInUp">
          {t('car_brands.subtitle')}
        </p>
        <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-5 lg:grid-cols-7 gap-8 items-center max-w-5xl mx-auto animate-fadeInUp delay-100">
          {carLogos.map((logo, idx) => (
            <img
              key={idx}
              src={logo}
              alt={t('car_brands.alt_text')}
              className="h-12 object-contain mx-auto opacity-90 hover:opacity-100 transition"
            />
          ))}
        </div>
        <div className="mt-8 animate-fadeInUp delay-200">
          <Button className="bg-sky-800 hover:bg-sky-900 text-white px-6 py-3 transition">
            {t('car_brands.all_car_brands')}
          </Button>
        </div>
      </div>
    </section>
  );
}

// —————————————————————————————————————————————————————————————————————————
// 8) "Where to Find Us" Location Section
// —————————————————————————————————————————————————————————————————————————
function LocationSection() {
  const { t } = useLanguage();
const locations = [
  {
    name: "Future Tyres Trading - Al Quoz",
    address: "Al Quoz Industrial Area 4, Dubai, UAE",
    phone: "+971 4 123 4567",
    whatsapp: "+971 50 123 4567",
    email: "alquoz@futuretyres.ae",
    hours: {
      weekdays: "9:00 AM - 8:00 PM",
      saturday: "10:00 AM - 6:00 PM",
      sunday: "Closed",
    },
    mapUrl:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3610.9061851255683!2d55.2372!3d25.1307!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5f6b46618b8a19%3A0x7f8115c21d4e7e5a!2sAl%20Quoz%20Industrial%20Area%204%20-%20Dubai!5e0!3m2!1sen!2sae!4v1710612345678!5m2!1sen!2sae",
  },
  {
    name: "Future Tyres Trading - Deira",
    address: "Naif Road, Deira, Dubai, UAE",
    phone: "+971 4 234 5678",
    whatsapp: "+971 50 234 5678",
    email: "deira@futuretyres.ae",
    hours: {
      weekdays: "9:00 AM - 9:00 PM",
      saturday: "10:00 AM - 7:00 PM",
      sunday: "Closed",
    },
    mapUrl:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3608.2661512345678!2d55.3023!3d25.2743!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5f5c5c5c5c5c5c%3A0x7f8115c21d4e7e5a!2sNaif%20Rd%20-%20Dubai!5e0!3m2!1sen!2sae!4v1710612345678!5m2!1sen!2sae",
  },
  {
    name: "Future Tyres Trading - Sharjah",
    address: "Industrial Area 12, Sharjah, UAE",
    phone: "+971 6 345 6789",
    whatsapp: "+971 50 345 6789",
    email: "sharjah@futuretyres.ae",
    hours: {
      weekdays: "9:00 AM - 8:00 PM",
      saturday: "10:00 AM - 6:00 PM",
      sunday: "Closed",
    },
    mapUrl:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3606.123456789012!2d55.4123!3d25.3234!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5f6b46618b8a19%3A0x7f8115c21d4e7e5a!2sIndustrial%20Area%2012%20-%20Sharjah!5e0!3m2!1sen!2sae!4v1710612345678!5m2!1sen!2sae",
  },
];

  return (
    <section className="py-24 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="font-orbitron text-4xl font-bold text-center mb-8 animate-fadeInDown">
          {t('home.locations.title')}
          <span className="block h-1 bg-red-600 w-0 mx-auto mt-2 animate-underline"></span>
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto animate-fadeInUp delay-100">
          {locations.map((location, index) => (
            <Card key={index} className="overflow-hidden">
              <div className="aspect-video w-full">
                <iframe
                  src={location.mapUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full h-full"
                ></iframe>
              </div>
              <CardContent className="p-6">
                <h3 className="font-orbitron text-xl font-bold mb-2">
                  {location.name}
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <MapPin className="w-5 h-5 text-blue-600 mt-1" />
                    <p className="text-gray-600 flex-1">
                      {location.address}
                    </p>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Clock className="w-5 h-5 text-blue-600 mt-1" />
                    <div className="flex-1">
                      <p className="text-gray-600">
                        Monday - Friday: {location.hours.weekdays}
                      </p>
                      <p className="text-gray-600">
                        Saturday: {location.hours.saturday}
                      </p>
                      <p className="text-gray-600">
                        Sunday: {location.hours.sunday}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center space-x-3">
                      <Phone className="w-5 h-5 text-blue-600" />
                      <a
                        href={`tel:${location.phone}`}
                        className="text-gray-600 hover:text-blue-600"
                      >
                        {location.phone}
                      </a>
                    </div>

                    <div className="flex items-center space-x-3">
                      <MessageSquare className="w-5 h-5 text-blue-600" />
                      <a
                        href={`https://wa.me/${location.whatsapp.replace(
                          /[^0-9]/g,
                          ""
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-600 hover:text-blue-600"
                      >
                        WhatsApp
                      </a>
                    </div>

                    <div className="flex items-center space-x-3">
                      <Mail className="w-5 h-5 text-blue-600" />
                      <a
                        href={`mailto:${location.email}`}
                        className="text-gray-600 hover:text-blue-600"
                      >
                        {location.email}
                      </a>
                    </div>
                  </div>

                  <Button
                    className="w-full mt-4"
                    onClick={() =>
                      window.open(
                        `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                          location.address
                        )}`,
                        "_blank"
                      )
                    }
                  >
                    {t('home.locations.button')}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

// —————————————————————————————————————————————————————————————————————————
// 9) Blog Section
// —————————————————————————————————————————————————————————————————————————
function BlogSection() {
  const { t } = useLanguage();
  // Mock data for blog previews
  const blogPosts = [
    {
      id: 1,
      title: "5 Thailand Tyre Brands That You'd Want to Buy in UAE",
      imageUrl: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&auto=format&fit=crop",
      slug: "/blog/thailand-tyre-brands-uae",
    },
    {
      id: 3,
      title: "Our Experts Reveal the 5 Best Summer Tyres for Driving in UAE",
      imageUrl: "https://images.unsplash.com/photo-1502877338535-766e1452684a?w=800&auto=format&fit=crop",
      slug: "/blog/best-summer-tyres-uae",
    },
  ];

  return (
    <section className="py-24 bg-gray-50">
      <div className="container mx-auto px-4 text-center">
        <h2 className="font-orbitron text-4xl font-bold text-future-black mb-4 animate-fadeInDown">
          {t('blog.title')}
          <span className="block h-1 bg-red-600 w-0 mx-auto mt-2 animate-underline"></span>
        </h2>
        <p className="text-gray-700 mb-8 max-w-2xl mx-auto animate-fadeInUp">
          {t('blog.subtitle')}
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto animate-fadeInUp delay-100">
          {blogPosts.map((post, idx) => (
            <Card
              key={post.id}
              className="overflow-hidden hover:shadow-lg transition animate-fadeInUp delay-[calc(100ms*var(--idx))]"
              style={{ "--idx": idx } as React.CSSProperties}
            >
              <img
                src={post.imageUrl}
                alt={post.title}
                className="w-full h-48 object-cover"
              />
              <CardContent className="p-4">
                <h3 className="font-orbitron text-lg font-semibold text-future-black">
                  {post.title}
                </h3>
                <div className="mt-4 text-right">
                  <Link href={post.slug}>
                    <span className="text-electric-blue font-medium hover:underline cursor-pointer">
                      {t('blog.read_more')}
                    </span>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="mt-8 animate-fadeInUp delay-200">
          <Button className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 transition">
            {t('blog.all_posts')}
          </Button>
        </div>
      </div>
    </section>
  );
}

// —————————————————————————————————————————————————————————————————————————
// 10) Floating Contact Button
// —————————————————————————————————————————————————————————————————————————
function FloatingContactButton() {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="fixed bottom-6 right-6 z-50 animate-fadeInUp">
      <a
        href="/contact-us"
        className="bg-electric-blue hover:bg-electric-blue-dark text-white rounded-full p-4 shadow-lg flex items-center justify-center transition"
        title="Contact Us / Live Chat"
      >
        <MessageCircle className="h-6 w-6" />
      </a>
    </div>
  );
}

// —————————————————————————————————————————————————————————————————————————
// Main HomePage Component
// —————————————————————————————————————————————————————————————————————————
export default function HomePage() {
  console.log("HomePage component rendered with latest changes.");
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => { setIsSignupModalOpen(true); }, 500);
    return () => clearTimeout(timer);
  }, []);
  return (
    <div className="font-sans antialiased text-gray-800">
      <Header />
      <main>
      <HeroSection />
      <StepByStepSection />
      <CurrentDeals />
      <AccessoriesPromoSection />
      <ServicesSection />
      <TyreBrandsSection />
      <CarBrandsSection />
      <LocationSection />
      <BlogSection />
      </main>
      <FloatingContactButton />
    </div>
  );
}

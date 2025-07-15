import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { allMockAccessories } from "@/data/accessories";
import { useCart } from "@/hooks/useCart";
import { Accessory, Tyre } from "@shared/schema";
import { ChevronLeft, MapPin, Truck, Wrench } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useParams } from "wouter";

interface FitmentOption {
  id: string;
  label: string;
  description: string;
  price?: number;
  icon: React.ReactNode;
}

// Static data for demo - should be consistent with TyresPage
const staticTyres: Tyre[] = [
  {
    id: 1,
    name: "RY01",
    brand: "Yokohama",
    size: "205/55 R16",
    price: 730,
    stock: 15,
    type: "All-Season",
    loadIndex: "113/11N",
    speedRating: "V",
    description: "Yokohama 700 R16 113/11N RY01 2025",
    imageUrl: "https://media.tyresonline.ae/media/catalog/product/cache/d076a6223bdc9b8e92b898db02389938/tyresonline-tyres/yokohamary01.jpg",
    specifications: JSON.stringify({ warranty: "1 year warranty" }),
    year: 2025,
    sku: null,
    brandImageUrl: "https://media.tyresonline.ae/media/mgs_brand/y/o/yokoma.png",
    oem: null,
    origin: "Japan",
    isRunFlat: false,
    promotion: null,
    pattern: "RY01",
    warrantyPeriod: "1 Year Warranty",
    performance: "All-Season",
  },
  {
    id: 2,
    name: "Geolandar G056 TL",
    brand: "Yokohama",
    size: "275/70 R16",
    price: 615,
    stock: 8,
    type: null,
    loadIndex: "114",
    speedRating: "H",
    description: "Yokohama 275/70 R16 114H Geolandar G056 TL 2025",
    imageUrl: "https://media.tyresonline.ae/media/catalog/product/cache/d076a6223bdc9b8e92b898db02389938/i/m/image_2024-01-20_145143813.png",
    specifications: JSON.stringify({ warranty: "1 Year Warranty" }),
    year: 2025,
    sku: "TYO-Y2757016114HGEG056TL-2025",
    brandImageUrl: "https://media.tyresonline.ae/media/mgs_brand/y/o/yokoma.png",
    oem: null,
    origin: "Japan",
    isRunFlat: false,
    promotion: "20% Off",
    pattern: "Geolandar G056",
    warrantyPeriod: "1 Year Warranty",
    performance: "Highway",
  },
  {
    id: 3,
    name: "Geolandar G057",
    brand: "Yokohama",
    size: "275/60 R20",
    price: 804,
    stock: 10,
    type: null,
    loadIndex: "115",
    speedRating: "H",
    description: "Yokohama 275/60 R20 115H Geolandar G057 2025",
    imageUrl: "https://media.tyresonline.ae/media/catalog/product/cache/d076a6223bdc9b8e92b898db02389938/car-tyres/yokohama_geolandar_x_cv_g057.jpg",
    specifications: JSON.stringify({ warranty: "1 Year Warranty" }),
    year: 2025,
    sku: "TYO-Y2756020115HGEG057-2025",
    brandImageUrl: "https://media.tyresonline.ae/media/mgs_brand/y/o/yokoma.png",
    oem: null,
    origin: "Japan",
    isRunFlat: false,
    promotion: null,
    pattern: "Geolandar G057",
    warrantyPeriod: "1 Year Warranty",
    performance: "Highway",
  },
  {
    id: 4,
    name: "Geolandar A/T G015",
    brand: "Yokohama",
    size: "235/75 R15",
    price: 525,
    stock: 10,
    type: null,
    loadIndex: "109",
    speedRating: "H",
    description: "Yokohama 235/75 R15 109H Geolandar A/T G015 2025",
    imageUrl: "https://media.tyresonline.ae/media/catalog/product/cache/d076a6223bdc9b8e92b898db02389938/car-tyres/yokohama_geolandar_at_g015.jpg",
    specifications: JSON.stringify({ warranty: "1 Year Warranty" }),
    year: 2025,
    sku: "TYO-Y2357515109HGEAG015-2025",
    brandImageUrl: "https://media.tyresonline.ae/media/mgs_brand/y/o/yokoma.png",
    oem: null,
    origin: "Japan",
    isRunFlat: false,
    promotion: null,
    pattern: "Geolandar A/T G015",
    warrantyPeriod: "1 Year Warranty",
    performance: "Off Road",
  },
  {
    id: 5,
    name: "Terramax H/T",
    brand: "Sailun",
    size: "205 R16C",
    price: 328,
    stock: 10,
    type: null,
    loadIndex: "110/108",
    speedRating: "Q",
    description: "Sailun 205 R16C 110/108Q Terramax H/T 2025",
    imageUrl: "https://media.tyresonline.ae/media/catalog/product/cache/d076a6223bdc9b8e92b898db02389938/t/y/tyre_sample_avqcolugt3udy4hl_1_1.jpg",
    specifications: JSON.stringify({ warranty: "1 Year Warranty" }),
    year: 2025,
    sku: "TYO-S20516C110108QTEH-2025",
    brandImageUrl: "https://media.tyresonline.ae/media/mgs_brand/s/a/sailun.png",
    oem: null,
    origin: "China",
    isRunFlat: false,
    promotion: null,
    pattern: "Terramax H/T",
    warrantyPeriod: "1 Year Warranty",
    performance: "Highway",
  },
  {
    id: 6,
    name: "EXTMILE SL87N",
    brand: "Sailun",
    size: "195 R15C",
    price: 213,
    stock: 10,
    type: null,
    loadIndex: "106/104",
    speedRating: "R",
    description: "Sailun 195 R15C 106/104R EXTMILE SL87N 2025",
    imageUrl: "https://media.tyresonline.ae/media/catalog/product/cache/d076a6223bdc9b8e92b898db02389938/tyresonline-tyres/EXTMILE-SL87N.png",
    specifications: JSON.stringify({ warranty: "1 Year Warranty" }),
    year: 2025,
    sku: "TYO-S19515C106104REXSL87N-2025",
    brandImageUrl: "https://media.tyresonline.ae/media/mgs_brand/s/a/sailun.png",
    oem: null,
    origin: "China",
    isRunFlat: false,
    promotion: null,
    pattern: "EXTMILE SL87N",
    warrantyPeriod: "1 Year Warranty",
    performance: "Commercial",
  },
  {
    id: 7,
    name: "Terramax H/T",
    brand: "Sailun",
    size: "31x10.50 R15",
    price: 341,
    stock: 10,
    type: null,
    loadIndex: "109",
    speedRating: "T",
    description: "Sailun 31X10.50 R15 109T Terramax H/T 2025",
    imageUrl: "https://media.tyresonline.ae/media/catalog/product/cache/d076a6223bdc9b8e92b898db02389938/t/y/tyre_sample_avqcolugt3udy4hl_1_1.jpg",
    specifications: JSON.stringify({ warranty: "1 Year Warranty" }),
    year: 2025,
    sku: "TYO-S31X10.5015109TTEH-2025",
    brandImageUrl: "https://media.tyresonline.ae/media/mgs_brand/s/a/sailun.png",
    oem: null,
    origin: "China",
    isRunFlat: false,
    promotion: "Lowest Price In UAE",
    pattern: "Terramax H/T",
    warrantyPeriod: "1 Year Warranty",
    performance: "Off Road",
  },
  {
    id: 8,
    name: "P Zero N1",
    brand: "Pirelli",
    size: "295/35 21",
    price: 1226,
    stock: 10,
    type: null,
    loadIndex: "103",
    speedRating: "Y",
    description: "Pirelli 295/35 ZR21 103Y P Zero N1 2025",
    imageUrl: "https://media.tyresonline.ae/media/catalog/product/cache/d076a6223bdc9b8e92b898db02389938/car-tyres/pirelli_p_zero.jpg",
    specifications: JSON.stringify({ warranty: "1 Year Warranty" }),
    year: 2025,
    sku: "TYO-P29535Z21103YPZEN1-2025",
    brandImageUrl: "https://media.tyresonline.ae/media/mgs_brand/p/i/pirelli.png",
    oem: "Porsche",
    origin: "Italy",
    isRunFlat: false,
    promotion: null,
    pattern: "P Zero",
    warrantyPeriod: "3 Years Warranty",
    performance: "Summer",
  },
  {
    id: 9,
    name: "Roadian GTX",
    brand: "Nexen",
    size: "235/65 R17",
    price: 442,
    stock: 10,
    type: null,
    loadIndex: "104",
    speedRating: "H",
    description: "Nexen 235/65 R17 104H Roadian GTX 2025",
    imageUrl: "https://media.tyresonline.ae/media/catalog/product/cache/d076a6223bdc9b8e92b898db02389938/6/3/634e6b4bfc197f3cdf638712-nexen-roadian-gtx-all-season-tire_1_.jpg",
    specifications: JSON.stringify({ warranty: "1 Year Warranty" }),
    year: 2025,
    sku: "TYO-N2356517104HROGT-2025",
    brandImageUrl: "https://media.tyresonline.ae/media/mgs_brand/n/e/nexen.png",
    oem: null,
    origin: "South Korea",
    isRunFlat: false,
    promotion: null,
    pattern: "Roadian GTX",
    warrantyPeriod: "1 Year Warranty",
    performance: "All-Season",
  },
  {
    id: 10,
    name: "Roadian HTX2",
    brand: "Nexen",
    size: "225/70 R16",
    price: 358,
    stock: 10,
    type: null,
    loadIndex: "103",
    speedRating: "T",
    description: "Nexen 225/70 R16 103T Roadian HTX2 2025",
    imageUrl: "https://media.tyresonline.ae/media/catalog/product/cache/d076a6223bdc9b8e92b898db02389938/car-tyres/nexen_roadian_ht.jpg",
    specifications: JSON.stringify({ warranty: "1 Year Warranty" }),
    year: 2025,
    sku: "TYO-N2257016103TROHTX2-2025",
    brandImageUrl: "https://media.tyresonline.ae/media/mgs_brand/n/e/nexen.png",
    oem: null,
    origin: "South Korea",
    isRunFlat: false,
    promotion: null,
    pattern: "Roadian HTX2",
    warrantyPeriod: "1 Year Warranty",
    performance: "Highway",
  },
  {
    id: 11,
    name: "Pilot Sport 4 SUV RG",
    brand: "Michelin",
    size: "295/35 21",
    price: 1165,
    stock: 10,
    type: null,
    loadIndex: "107",
    speedRating: "Y",
    description: "Michelin 295/35 R21 107Y Pilot Sport 4 SUV RG 2025",
    imageUrl: "https://media.tyresonline.ae/media/catalog/product/cache/d076a6223bdc9b8e92b898db02389938/car-tyres/michelin_pilot_sport_4.jpg",
    specifications: JSON.stringify({ warranty: "1 Year Warranty" }),
    year: 2025,
    sku: "TYO-M2953521107YPISP4SURG-2025",
    brandImageUrl: "https://media.tyresonline.ae/media/mgs_brand/m/i/michelin_logo_cropped_full_height.jpg",
    oem: null,
    origin: "France",
    isRunFlat: false,
    promotion: null,
    pattern: "Pilot Sport 4 SUV",
    warrantyPeriod: "3 Years Warranty",
    performance: "Summer",
  },
  {
    id: 12,
    name: "LT A/S",
    brand: "Michelin",
    size: "285/50 R20",
    price: 1175,
    stock: 10,
    type: "All-Season",
    loadIndex: "116",
    speedRating: "H",
    description: "Michelin 285/50 R20 116H LT A/S 2025",
    imageUrl: "https://media.tyresonline.ae/media/catalog/product/cache/d076a6223bdc9b8e92b898db02389938/y/h/yhgffgfd.jpg",
    specifications: JSON.stringify({ warranty: "1 Year Warranty" }),
    year: 2025,
    sku: "TYO-M2855020116HLTA-2025",
    brandImageUrl: "https://media.tyresonline.ae/media/mgs_brand/m/i/michelin_logo_cropped_full_height.jpg",
    oem: null,
    origin: "France",
    isRunFlat: false,
    promotion: "20% Off",
    pattern: "LT A/S",
    warrantyPeriod: "3 Years Warranty",
    performance: "All-Season",
  },
  {
    id: 13,
    name: "LTX AT2",
    brand: "Michelin",
    size: "275/70 R18",
    price: 1259,
    stock: 10,
    type: null,
    loadIndex: "125/122",
    speedRating: "S",
    description: "Michelin 275/70 R18 125/122S LTX AT2 2025",
    imageUrl: "https://media.tyresonline.ae/media/catalog/product/cache/d076a6223bdc9b8e92b898db02389938/car-tyres/michelin_ltx_at2.jpg",
    specifications: JSON.stringify({ warranty: "1 Year Warranty" }),
    year: 2025,
    sku: "TYO-M2757018125122SLTAT2-2025",
    brandImageUrl: "https://media.tyresonline.ae/media/mgs_brand/m/i/michelin_logo_cropped_full_height.jpg",
    oem: null,
    origin: "France",
    isRunFlat: false,
    promotion: null,
    pattern: "LTX AT2",
    warrantyPeriod: "3 Years Warranty",
    performance: "Off Road",
  },
  {
    id: 14,
    name: "LT A/S",
    brand: "Michelin",
    size: "275/50 R22",
    price: 1299,
    stock: 10,
    type: "All-Season",
    loadIndex: "115",
    speedRating: "H",
    description: "Michelin 275/50 R22 115H LT A/S 2025",
    imageUrl: "https://media.tyresonline.ae/media/catalog/product/cache/d076a6223bdc9b8e92b898db02389938/y/h/yhgffgfd.jpg",
    specifications: JSON.stringify({ warranty: "1 Year Warranty" }),
    year: 2025,
    sku: "TYO-M2755022115HLTA-2025",
    brandImageUrl: "https://media.tyresonline.ae/media/mgs_brand/m/i/michelin_logo_cropped_full_height.jpg",
    oem: null,
    origin: "France",
    isRunFlat: false,
    promotion: null,
    pattern: "LT A/S",
    warrantyPeriod: "3 Years Warranty",
    performance: "All-Season",
  },
  {
    id: 15,
    name: "LT A/S 2",
    brand: "Michelin",
    size: "265/50 R22",
    price: 1518,
    stock: 10,
    type: "All-Season",
    loadIndex: "112",
    speedRating: "H",
    description: "Michelin 265/50 R22 112H LT A/S 2 2025",
    imageUrl: "https://media.tyresonline.ae/media/catalog/product/cache/d076a6223bdc9b8e92b898db02389938/y/h/yhgffgfd.jpg",
    specifications: JSON.stringify({ warranty: "1 Year Warranty" }),
    year: 2025,
    sku: "TYO-M2655022112HLTA2-2025",
    brandImageUrl: "https://media.tyresonline.ae/media/mgs_brand/m/i/michelin_logo_cropped_full_height.jpg",
    oem: null,
    origin: "France",
    isRunFlat: false,
    promotion: null,
    pattern: "LT A/S 2",
    warrantyPeriod: "3 Years Warranty",
    performance: "All-Season",
  },
  {
    id: 16,
    name: "Pilot Sport 4S",
    brand: "Michelin",
    size: "265/35 19",
    price: 1461,
    stock: 10,
    type: null,
    loadIndex: "98",
    speedRating: "Y",
    description: "Michelin 265/35 R19 98Y Pilot Sport 4S 2025",
    imageUrl: "https://media.tyresonline.ae/media/catalog/product/cache/d076a6223bdc9b8e92b898db02389938/car-tyres/michelin_pilot_sport_4s.jpg",
    specifications: JSON.stringify({ warranty: "1 Year Warranty" }),
    year: 2025,
    sku: "TYO-M265351998YPISP4S-2025",
    brandImageUrl: "https://media.tyresonline.ae/media/mgs_brand/m/i/michelin_logo_cropped_full_height.jpg",
    oem: null,
    origin: "France",
    isRunFlat: false,
    promotion: null,
    pattern: "Pilot Sport 4S",
    warrantyPeriod: "3 Years Warranty",
    performance: "Summer",
  },
  {
    id: 17,
    name: "Pilot Sport EV GOE",
    brand: "Michelin",
    size: "255/45 20",
    price: 1572,
    stock: 10,
    type: null,
    loadIndex: "105",
    speedRating: "W",
    description: "Michelin 255/45 R20 105W Pilot Sport EV GOE 2025",
    imageUrl: "https://media.tyresonline.ae/media/catalog/product/cache/d076a6223bdc9b8e92b898db02389938/tyresonline-tyres/pilot-sport-ev.jpeg",
    specifications: JSON.stringify({ warranty: "1 Year Warranty" }),
    year: 2025,
    sku: "TYO-M2554520105WPISPEVGO-2025",
    brandImageUrl: "https://media.tyresonline.ae/media/mgs_brand/m/i/michelin_logo_cropped_full_height.jpg",
    oem: "Genesis",
    origin: "Hungary",
    isRunFlat: false,
    promotion: null,
    pattern: "Pilot Sport EV",
    warrantyPeriod: "3 Years Warranty",
    performance: "Electric Vehicle",
  },
  {
    id: 18,
    name: "Pilot Sport 4 SUV GOE",
    brand: "Michelin",
    size: "255/40 21",
    price: 1766,
    stock: 10,
    type: null,
    loadIndex: "102",
    speedRating: "Y",
    description: "Michelin 255/40 R21 102Y Pilot Sport 4 SUV GOE 2025",
    imageUrl: "https://media.tyresonline.ae/media/catalog/product/cache/d076a6223bdc9b8e92b898db02389938/car-tyres/michelin_pilot_sport_4.jpg",
    specifications: JSON.stringify({ warranty: "1 Year Warranty" }),
    year: 2025,
    sku: "TYO-M2554021102YPISP4SUGO-2025",
    brandImageUrl: "https://media.tyresonline.ae/media/mgs_brand/m/i/michelin_logo_cropped_full_height.jpg",
    oem: "Genesis",
    origin: "Hungary",
    isRunFlat: false,
    promotion: null,
    pattern: "Pilot Sport 4 SUV",
    warrantyPeriod: "3 Years Warranty",
    performance: "Summer",
  },
  {
    id: 19,
    name: "Pilot Sport 5 EV ACOUSTIC T0",
    brand: "Michelin",
    size: "255/40 20",
    price: 1596,
    stock: 10,
    type: null,
    loadIndex: "101",
    speedRating: "W",
    description: "Michelin 255/40 R20 101W Pilot Sport 5 EV ACOUSTIC T0 2025",
    imageUrl: "https://media.tyresonline.ae/media/catalog/product/cache/d076a6223bdc9b8e92b898db02389938/tyresonline-tyres/michelin-pilot-sport-5.jpg",
    specifications: JSON.stringify({ warranty: "1 Year Warranty" }),
    year: 2025,
    sku: "TYO-M2554020101WPISP5EVACT0-2025",
    brandImageUrl: "https://media.tyresonline.ae/media/mgs_brand/m/i/michelin_logo_cropped_full_height.jpg",
    oem: "Tesla",
    origin: "Hungary",
    isRunFlat: false,
    promotion: null,
    pattern: "Pilot Sport 5",
    warrantyPeriod: "3 Years Warranty",
    performance: "Electric Vehicle",
  },
  {
    id: 20,
    name: "Runflat Pilot Sport 4S XL TL",
    brand: "Michelin",
    size: "245/40 20",
    price: 1410,
    stock: 10,
    type: null,
    loadIndex: "99",
    speedRating: "Y",
    description: "Michelin 245/40 ZR20 99Y Runflat Pilot Sport 4S XL TL 2025",
    imageUrl: "https://media.tyresonline.ae/media/catalog/product/cache/d076a6223bdc9b8e92b898db02389938/car-tyres/michelin_pilot_sport_4s.jpg",
    specifications: JSON.stringify({ warranty: "1 Year Warranty" }),
    year: 2025,
    sku: "TYO-M24540Z2099YRUPISP4SXLTL-2025",
    brandImageUrl: "https://media.tyresonline.ae/media/mgs_brand/m/i/michelin_logo_cropped_full_height.jpg",
    oem: null,
    origin: "France",
    isRunFlat: true,
    promotion: null,
    pattern: "Pilot Sport 4S",
    warrantyPeriod: "3 Years Warranty",
    performance: "Summer",
  }
];

const SpecificationItem = ({ label, value }: { label: string, value?: string | number | null }) => (
    <div className="flex justify-between border-b py-3">
        <span className="font-medium text-gray-600">{label}</span>
        <span className="text-gray-800">{value || 'N/A'}</span>
    </div>
);

export default function ProductDetailPage() {
  const params = useParams();
  const [location] = useLocation();
  const { toast } = useToast();
  const { addToCart } = useCart();
  const { t } = useLanguage();

  const [product, setProduct] = useState<Tyre | Accessory | null>(null);
  const [productType, setProductType] = useState<'tyre' | 'accessory' | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedFitment, setSelectedFitment] = useState<string | null>(null);
  
  const imageRef = useRef<HTMLImageElement>(null);
  const [isZooming, setIsZooming] = useState(false);
  const [transform, setTransform] = useState('scale(1) translate(0, 0)');

  const searchParams = new URLSearchParams(location.search);
  const fromDeals = searchParams.get('from') === 'deals';

  useEffect(() => {
    const { type, id } = params;
    if (!id || !type) return;

    let foundProduct: Tyre | Accessory | undefined;
    if (type === 'tyre') {
      foundProduct = staticTyres.find(t => t.id === parseInt(id, 10));
      setProductType('tyre');
    } else if (type === 'accessory') {
      foundProduct = allMockAccessories.find(a => a.id === parseInt(id, 10));
      setProductType('accessory');
    }

    if (foundProduct) {
      setProduct(foundProduct);
    } else {
      setError('Product not found');
    }

    setIsLoading(false);
  }, [params.id, params.type]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [params.id]);

  const basePrice = product?.price || 0;
  const totalPrice = basePrice * quantity;
  const [showCartNotification, setShowCartNotification] = useState(false);

  const fitmentOptions: FitmentOption[] = [
    {
      id: 'self',
      label: 'No, I\'ll do it myself',
      description: 'Just the product',
      icon: <Wrench className="w-5 h-5" />
    },
    {
      id: 'partner',
      label: 'Partner Centre',
      description: 'Select a fitment centre',
      icon: <MapPin className="w-5 h-5" />
    },
    {
      id: 'home',
      label: 'Home Delivery',
      description: 'AED 50 for delivery & installation',
      price: 50,
      icon: <Truck className="w-5 h-5" />
    },
    {
      id: 'mobile',
      label: 'Mobile Van',
      description: 'AED 80 (Dubai only)',
      price: 80,
      icon: <Wrench className="w-5 h-5" />
    }
  ];

  const specifications = useMemo(() => {
    if (!product?.specifications) {
      return {};
    }
    try {
      return JSON.parse(product.specifications);
    } catch (e) {
      return product.specifications.split('\\n').reduce((acc, line) => {
        const [key, ...valueParts] = line.split(':');
        if (key && valueParts.length > 0) {
          acc[key.trim()] = valueParts.join(':').trim();
        }
        return acc;
      }, {} as Record<string, string>);
    }
  }, [product?.specifications]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h1>
          <p className="text-gray-600">The product you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  const handleQuantityChange = (change: number) => {
    const newQuantity = Math.max(1, quantity + change);
    setQuantity(newQuantity);
  };

  const handleAddToCart = () => {
    if (!product || !productType) return;

    addToCart({ ...product, quantity }, productType, selectedFitment);

    toast({
      title: t('product.added_to_cart'),
      description: `${quantity}x ${product.name} has been added to your cart.`,
      action: (
        <Button onClick={() => window.history.back()} variant="outline">
          Back to Deals
        </Button>
      ),
    });

    setQuantity(1);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageRef.current) return;
    
    const { left, top, width, height } = imageRef.current.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    
    // Define dead zones (15% from each edge)
    const deadZoneSize = 15;
    const isInHorizontalDeadZone = x <= deadZoneSize || x >= (100 - deadZoneSize);
    
    // Update zoom state based on dead zone
    setIsZooming(!isInHorizontalDeadZone);
    
    // Only update zoom position if not in dead zone
    if (!isInHorizontalDeadZone) {
      setTransform(`scale(2) translate(-${x}%, -${y}%)`);
    }
  };

  const handleMouseLeave = () => {
    setIsZooming(false);
    setTransform('scale(1) translate(0, 0)');
  };

  const averageRating = 0; // Static value as we removed reviews

  return (
    <div className="bg-gray-50/50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button variant="outline" onClick={() => window.history.back()} className="mb-4">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to All Deals
          </Button>
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/deals">Deals</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{product.name}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Column - Images */}
          <div>
            {/* Brand */}
            <div className="mb-4">
              <h3 className="text-2xl font-bold">{product.brand}</h3>
            </div>

            {/* Image Gallery */}
            <div 
              ref={imageRef}
              className="overflow-hidden rounded-lg relative group h-[400px]"
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            >
              <img
                src={product.imageUrl || "/tyre-placeholder.jpg"}
                alt={`${product.name} view`}
                className={`w-full h-full object-contain rounded-lg transition-transform duration-200 ${
                  isZooming ? 'scale-150' : 'scale-100'
                }`}
                style={{
                  transform: transform,
                  cursor: isZooming ? "zoom-out" : "zoom-in"
                }}
              />
            </div>
          </div>

          {/* Right Column - Product Info and Purchase Options */}
          <div>
            {/* Product Information */}
            <div className="bg-white rounded-t-lg shadow-sm border border-b-0 border-gray-100 p-6">
              {'brandImageUrl' in product && product.brandImageUrl && (
                <div className="mb-4">
                  <img src={product.brandImageUrl} alt={`${product.brand} logo`} className="h-10" />
                </div>
              )}
              <h2 className="text-xl font-bold mb-4 text-red-600">{t('product.info_title')}</h2>
              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">{t('product.name')}:</span>
                  <span className="font-medium">{product.name}</span>
                </div>
                <div className="space-y-3 mt-6">
                  {'oem' in product && product.oem && (
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">{t('product.oem')}:</span>
                      <span className="font-medium">{product.oem}</span>
                    </div>
                  )}
                  {'origin' in product && product.origin && (
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">{t('product.origin')}:</span>
                      <span className="font-medium">{product.origin}</span>
                    </div>
                  )}
                  {'isRunFlat' in product && product.isRunFlat && (
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">{t('product.run_flat')}:</span>
                      <span className="font-medium">Yes</span>
                    </div>
                  )}
                  {'category' in product && product.category && (
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">{t('product.category')}:</span>
                      <span className="font-medium">{product.category}</span>
                    </div>
                  )}
                  {'model' in product && product.model && (
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">{t('product.model')}:</span>
                      <span className="font-medium">{product.model}</span>
                    </div>
                  )}
                  {'material' in product && product.material && (
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">{t('product.material')}:</span>
                      <span className="font-medium">{product.material}</span>
                    </div>
                  )}
                  {'condition' in product && product.condition && (
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">{t('product.condition')}:</span>
                      <span className="font-medium">{product.condition}</span>
                    </div>
                  )}
                  {'warranty' in product && product.warranty && (
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">{t('product.warranty')}:</span>
                      <span className="font-medium">{product.warranty}</span>
                    </div>
                  )}
                  {'sku' in product && product.sku && (
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">{t('product.sku')}:</span>
                      <span className="font-medium">{product.sku}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Price Box */}
            <div className="bg-white rounded-b-lg shadow-sm border border-t-0 border-gray-100 p-6">
              <div className="text-green-600 font-medium">{t('product.in_stock')}</div>
              <div className="text-sm text-gray-600 mt-2">
                {t('product.set_of_1', { price: (product as any).originalPrice || product.price })}
                <br />
                {t('product.vat_included')}
              </div>
              <div className="text-3xl font-bold mt-2">
                AED {totalPrice.toFixed(2)}
              </div>

              {/* Quantity Selector */}
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('product.quantity')}
                </label>
                <div className="flex items-center">
                  <div className="flex items-center border border-gray-300 rounded-md">
                    <button
                      onClick={() => handleQuantityChange(-1)}
                      className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      min="1"
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-16 text-center border-0 focus:ring-0"
                    />
                    <button
                      onClick={() => handleQuantityChange(1)}
                      className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                    >
                      +
                    </button>
                  </div>
                  <span className="ml-4 text-sm text-gray-500">{t('product.items_available', { count: product.stock })}</span>
                </div>
              </div>

              {/* Add to Cart Button */}
              <div className="mt-6">
                <button
                  onClick={handleAddToCart}
                  className="w-full bg-black text-white py-3 rounded-md hover:bg-gray-800 transition-colors"
                >
                  {t('product.add_to_cart')}
                </button>
              </div>

              {/* Tabby Payment Info */}
              <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
                <span>{t('product.pay_installments')}</span>
                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRHlx15NwYiMVvAuA-RxHMnNGAsOJoAe8UQ5A&s" alt="Tabby" className="h-10" />
              </div>
            </div>

            {/* Product Description */}
            <div className="mt-8">
              <h3 className="text-lg font-bold">{t('product.description_title')}</h3>
              <p className="mt-2 text-gray-600">
                {product.description || "Premium all-season tyre with excellent wet grip and fuel efficiency"}
              </p>
            </div>
          </div>
        </div>

        {/* Cart Notification */}
        {showCartNotification && (
          <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-md shadow-lg z-50">
            {quantity}x Turanza T005 has been added to your cart.
          </div>
        )}
      </div>
    </div>
  );
} 
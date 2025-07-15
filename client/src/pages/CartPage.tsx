import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCart } from '@/hooks/useCart';
import { Car, X } from 'lucide-react';
import { useState } from 'react';
import { Link, useLocation } from 'wouter';

const CartPage = () => {
  const { cartItems, updateQuantity, removeFromCart, getSubtotal, getFitmentFee, getTotal, setGlobalFitmentOption, isFitmentActive } = useCart();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { t } = useLanguage();

  const [selectedMake, setSelectedMake] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [vehiclePlate, setVehiclePlate] = useState("");
  const [fitmentDate, setFitmentDate] = useState("");
  const [fitmentTime, setFitmentTime] = useState("");
  const [fitmentCity, setFitmentCity] = useState("");
  const [serviceFee, setServiceFee] = useState(0);

  const vehicleData: { [key: string]: string[] } = {
    toyota: ["Camry", "Corolla", "Land Cruiser", "Hilux"],
    nissan: ["Patrol", "Altima", "Kicks", "Sunny"],
    ford: ["F-150", "Mustang", "Explorer", "Edge"],
    mercedes: ["C-Class", "E-Class", "S-Class", "G-Class"],
    bmw: ["3 Series", "5 Series", "X5", "X7"],
  };

  const makes = Object.keys(vehicleData);
  const models = selectedMake ? vehicleData[selectedMake] : [];

  const hasFitmentProduct = cartItems.some(item => item.productType === 'tyre' || item.productType === 'accessory');

  const cityOptions = [
    { value: "Dubai", label: "Dubai" },
    { value: "Abu Dhabi", label: "Abu Dhabi" },
    { value: "Sharjah", label: "Sharjah" },
    { value: "Ajman", label: "Ajman" },
    { value: "RAK", label: "Ras Al Khaimah" },
    { value: "Umm Al Quwain", label: "Umm Al Quwain" },
    { value: "Fujairah", label: "Fujairah" },
    { value: "Other", label: "Other" },
  ];

  const handleCityChange = (city: string) => {
    setFitmentCity(city);
    if (city === "Dubai") {
      setServiceFee(0);
    } else if (city === "Abu Dhabi") {
      setServiceFee(500);
    } else if (["Sharjah", "Ajman", "RAK", "Umm Al Quwain", "Fujairah", "Other"].includes(city)) {
      setServiceFee(150);
    } else {
      setServiceFee(0);
    }
  };

  const validateFitmentInfo = () => {
    if (!isFitmentActive) return true;

    if (!vehiclePlate) {
      toast({
        title: t('cart.required_field'),
        description: t('cart.enter_vehicle_plate_number'),
        variant: "destructive"
      });
      return false;
    }

    if (!selectedMake) {
      toast({
        title: t('cart.required_field'),
        description: t('cart.select_vehicle_make'),
        variant: "destructive"
      });
      return false;
    }

    if (!selectedModel) {
      toast({
        title: t('cart.required_field'),
        description: t('cart.select_vehicle_model'),
        variant: "destructive"
      });
      return false;
    }

    if (!selectedYear) {
      toast({
        title: t('cart.required_field'),
        description: t('cart.select_vehicle_year'),
        variant: "destructive"
      });
      return false;
    }
    if (!fitmentDate) {
      toast({
        title: t('cart.required_field'),
        description: 'Please select a fitment date.',
        variant: "destructive"
      });
      return false;
    }
    if (!fitmentTime) {
      toast({
        title: t('cart.required_field'),
        description: 'Please select a fitment time.',
        variant: "destructive"
      });
      return false;
    }

    return true;
  };

  const handleProceedToCheckout = () => {
    if (validateFitmentInfo()) {
      setLocation('/checkout');
    }
  };

  const getVAT = () => {
    return (getSubtotal() + serviceFee) * 0.05;
  };

  return (
    <div className="container mx-auto px-4 py-8 bg-white">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold tracking-wider">{t('cart.shopping_cart')}</h1>
        <Link href="/">
          <Button variant="outline" className="mt-2 text-sm font-semibold tracking-widest border-black">{t('cart.continue_shopping')}</Button>
        </Link>
      </div>

      {cartItems.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-500">{t('cart.empty_cart_message')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {/* Cart Items Header */}
            <div className="hidden lg:grid grid-cols-5 gap-4 font-semibold text-gray-500 mb-4 px-4">
              <div className="col-span-2">{t('cart.item')}</div>
              <div>{t('cart.price')}</div>
              <div>{t('cart.qty')}</div>
              <div>{t('cart.item_total')}</div>
            </div>

            {/* Cart Items */}
            <div className="border rounded-lg shadow-sm">
              {cartItems.map((item) => (
                <div key={item.id} className="grid grid-cols-1 lg:grid-cols-5 gap-4 items-center p-4 border-b last:border-b-0">
                  <div className="col-span-2 flex items-center space-x-4">
                    <div className="w-20 h-20 flex-shrink-0">
                      <img 
                        src={item.imageUrl || '/tyre-placeholder.jpg'}
                        alt={item.name}
                        className="w-full h-full object-cover rounded-md"
                      />
                    </div>
                    <div>
                      <p className="font-semibold">{item.brand} {item.name}</p>
                      <p className="text-sm text-gray-600">{item.size}</p>
                    </div>
                  </div>
                  <div className="font-semibold">AED {item.price.toFixed(2)}</div>
                  <div>
                    <select 
                      value={item.quantity} 
                      onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                      className="border rounded-md p-2"
                    >
                      {Array.from({ length: 20 }, (_, i) => i + 1).map(i => (
                        <option key={i} value={i}>{i}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex items-center justify-end gap-4 text-right">
                    <span className="font-semibold">AED {(item.price * item.quantity).toFixed(2)}</span>
                    <Button variant="ghost" size="icon" onClick={() => removeFromCart(item.id)} className="text-gray-500 hover:text-red-500">
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {/* Fitment Section */}
            {hasFitmentProduct && (
            <div className="border rounded-lg shadow-sm mt-8 p-6">
              <h3 className="font-semibold mb-4">{t('cart.with_fitment_question')}</h3>
              <RadioGroup 
                value={isFitmentActive ? 'yes' : 'no'} 
                onValueChange={(value) => {
                  setGlobalFitmentOption(value === 'yes');
                }}
                className="flex space-x-4 mb-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="fitment-yes" />
                  <Label htmlFor="fitment-yes">{t('cart.yes')}</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="fitment-no" />
                  <Label htmlFor="fitment-no">{t('cart.no')}</Label>
                </div>
              </RadioGroup>
              {isFitmentActive && (
                <div>
                  {/* Vehicle Information Section */}
                  <div className="mt-6 border rounded-lg p-6 bg-gray-50">
                    <h4 className="font-semibold mb-4 flex items-center"><Car className="mr-2 h-5 w-5" /> {t('cart.vehicle_information')}</h4>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="plate">{t('cart.vehicle_plate_required')}</Label>
                          <Input 
                            id="plate" 
                            placeholder={t('cart.enter_vehicle_plate_placeholder')} 
                            required
                            value={vehiclePlate}
                            onChange={(e) => setVehiclePlate(e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="make">{t('cart.make_required')}</Label>
                          <Select onValueChange={setSelectedMake} value={selectedMake}>
                            <SelectTrigger id="make">
                              <SelectValue placeholder={t('cart.select_make_placeholder')} />
                            </SelectTrigger>
                            <SelectContent>
                              {makes.map(make => (
                                <SelectItem key={make} value={make}>
                                  {make.charAt(0).toUpperCase() + make.slice(1)}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="model">{t('cart.model_required')}</Label>
                          <Select 
                            onValueChange={setSelectedModel} 
                            value={selectedModel} 
                            disabled={!selectedMake}
                          >
                            <SelectTrigger id="model">
                              <SelectValue placeholder={t('cart.select_model_placeholder')} />
                            </SelectTrigger>
                            <SelectContent>
                              {models.map(model => (
                                <SelectItem key={model} value={model}>{model}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="year">{t('cart.year_required')}</Label>
                          <Select 
                            onValueChange={setSelectedYear} 
                            value={selectedYear} 
                            disabled={!selectedModel}
                          >
                            <SelectTrigger id="year">
                              <SelectValue placeholder={t('cart.select_year_placeholder')} />
                            </SelectTrigger>
                            <SelectContent>
                              {Array.from({ length: 40 }, (_, i) => new Date().getFullYear() - i).map(year => (
                                <SelectItem key={year} value={String(year)}>{year}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      {/* City Selector */}
                      <div className="space-y-2">
                        <Label htmlFor="fitment-city">Select City for Fitment</Label>
                        <Select value={fitmentCity} onValueChange={handleCityChange} required>
                          <SelectTrigger>
                            <SelectValue placeholder="Select City" />
                          </SelectTrigger>
                          <SelectContent>
                            {cityOptions.map(city => (
                              <SelectItem key={city.value} value={city.value}>{city.label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                  {/* Fitment Date and Time Section */}
                  <div className="mt-6 border rounded-lg p-6 bg-gray-50">
                    <h4 className="font-semibold mb-4">Select Fitment Date & Time</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="fitment-date">Date</Label>
                        <Input
                          id="fitment-date"
                          type="date"
                          value={fitmentDate}
                          onChange={e => setFitmentDate(e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="fitment-time">Time</Label>
                        <Input
                          id="fitment-time"
                          type="time"
                          value={fitmentTime}
                          onChange={e => setFitmentTime(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            )}
          </div>

          {/* Summary and Checkout */}
          <div className="lg:col-span-1 space-y-6">
            <div className="border rounded-lg shadow-sm p-6 bg-gray-50">
              <h3 className="font-bold text-lg mb-4 text-center">{t('cart.discount_codes')}</h3>
              <div className="flex">
                <Input placeholder={t('cart.enter_discount_code_placeholder')} className="rounded-r-none"/>
                <Button className="bg-black text-white rounded-l-none">{t('cart.apply_button')}</Button>
              </div>
            </div>

            <div className="border rounded-lg shadow-sm p-6 bg-gray-50">
              <h3 className="font-bold text-lg mb-4">{t('cart.summary')}</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>{t('cart.items_total')}:</span>
                  <span className="font-semibold">AED {getSubtotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>{t('cart.installation_fee')}:</span>
                  <span className="font-semibold">AED {serviceFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>{t('cart.vat')}:</span>
                  <span className="font-semibold">AED {getVAT().toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-xl border-t pt-3 mt-3">
                  <span>{t('cart.grand_total')}</span>
                  <span>AED {(getSubtotal() + serviceFee + getVAT()).toFixed(2)}</span>
                </div>
              </div>
            </div>
            <div className="mt-8">
              <Button 
                className="w-full bg-red-600 hover:bg-red-700 text-white py-6 text-lg"
                onClick={handleProceedToCheckout}
                disabled={cartItems.length === 0}
              >
                {t('cart.proceed_to_checkout')}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;


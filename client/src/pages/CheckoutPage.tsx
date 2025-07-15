import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCart } from '@/hooks/useCart';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { CalendarIcon, CreditCard } from 'lucide-react';
import { useState } from 'react';
import { useLocation } from 'wouter';

const CheckoutPage = () => {
    const { t } = useLanguage();
    const { cartItems, getSubtotal, getFitmentFee, getVAT, getTotal } = useCart();
  const [deliveryMethod, setDeliveryMethod] = useState('ship');
    const [selectedLocation, setSelectedLocation] = useState('sharjah');
    const [paymentMethod, setPaymentMethod] = useState('card');
  const [pickupDate, setPickupDate] = useState<Date | undefined>(new Date());
  const [pickupTime, setPickupTime] = useState<string | undefined>();
  const [shippingCity, setShippingCity] = useState<string | undefined>();
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  // Shipping Information State
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [address1, setAddress1] = useState('');
  const [address2, setAddress2] = useState('');
  const [area, setArea] = useState('');

  // Payment Information State
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardName, setCardName] = useState('');

  const uaeCities = [
    'Abu Dhabi',
    'Dubai',
    'Sharjah',
    'Ajman',
    'Umm Al Quwain',
    'Ras Al Khaimah',
    'Fujairah',
  ];

  const timeSlots = [
    '10:00 AM - 11:30 AM',
    '11:30 AM - 01:00 PM',
    '01:00 PM - 02:30 PM',
    '02:30 PM - 04:00 PM',
    '04:00 PM - 05:30 PM',
    '05:30 PM - 07:00 PM',
  ];

  const pickupLocations = [
    {
      id: 'sharjah',
      name: 'Future Tyres Trading - Sharjah',
      address: 'Industrial Area 12, Sharjah, UAE',
    },
    {
      id: 'deira',
      name: 'Future Tyres Trading - Deira',
      address: 'Naif Road, Deira, Dubai, UAE',
    },
    {
      id: 'alquoz',
      name: 'Future Tyres Trading - Al Quoz',
      address: 'Al Quoz Industrial Area 4, Dubai, UAE',
    },
  ];

  const validateShippingInfo = () => {
    if (deliveryMethod === 'ship') {
      if (!firstName) {
        toast({
                    title: t('checkout.validation.required_field'),
                    description: t('checkout.validation.first_name'),
          variant: "destructive"
        });
        return false;
      }
      if (!lastName) {
        toast({
                    title: t('checkout.validation.required_field'),
                    description: t('checkout.validation.last_name'),
          variant: "destructive"
        });
        return false;
      }
      if (!address1) {
        toast({
                    title: t('checkout.validation.required_field'),
                    description: t('checkout.validation.address1'),
          variant: "destructive"
        });
        return false;
      }
      if (!shippingCity) {
        toast({
                    title: t('checkout.validation.required_field'),
                    description: t('checkout.validation.city'),
          variant: "destructive"
        });
        return false;
      }
      if (!area) {
        toast({
                    title: t('checkout.validation.required_field'),
                    description: t('checkout.validation.area'),
          variant: "destructive"
        });
        return false;
      }
    } else if (deliveryMethod === 'pickup') {
      if (!pickupDate) {
        toast({
                    title: t('checkout.validation.required_field'),
                    description: t('checkout.validation.pickup_date'),
          variant: "destructive"
        });
        return false;
      }
      if (!pickupTime) {
        toast({
                    title: t('checkout.validation.required_field'),
                    description: t('checkout.validation.pickup_time'),
          variant: "destructive"
        });
        return false;
      }
      if (!selectedLocation) {
        toast({
                    title: t('checkout.validation.required_field'),
                    description: t('checkout.validation.pickup_location'),
          variant: "destructive"
        });
        return false;
      }
    }
    return true;
  };

  const validatePaymentInfo = () => {
    if (paymentMethod === 'card') {
      if (!cardNumber || cardNumber.length < 16) {
        toast({
                    title: t('checkout.validation.invalid_card_number'),
                    description: t('checkout.validation.card_number'),
          variant: "destructive"
        });
        return false;
      }
      if (!expiryDate) {
        toast({
                    title: t('checkout.validation.required_field'),
                    description: t('checkout.validation.expiry_date'),
          variant: "destructive"
        });
        return false;
      }
      if (!cvv || cvv.length < 3) {
        toast({
                    title: t('checkout.validation.invalid_cvv'),
                    description: t('checkout.validation.cvv'),
          variant: "destructive"
        });
        return false;
      }
      if (!cardName) {
        toast({
                    title: t('checkout.validation.required_field'),
                    description: t('checkout.validation.card_name'),
          variant: "destructive"
        });
        return false;
      }
    }
    // For Tamara and Tabby, validation will happen on their side
    // For COD, no additional validation needed
    return true;
  };

  const handlePlaceOrder = () => {
    if (!validateShippingInfo()) return;
    if (!validatePaymentInfo()) return;

    // If all validations pass
    toast({
            title: t('checkout.success.title'),
            description: t('checkout.success.description'),
    });
    
    // Redirect to confirmation page or home
    setLocation('/order-confirmation');
  };

  return (
    <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6 font-orbitron">{t('checkout.title')}</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Card>
            <CardHeader>
                            <CardTitle>{t('checkout.delivery_method.title')}</CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup value={deliveryMethod} onValueChange={setDeliveryMethod} className="space-y-2">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="ship" id="ship" />
                                    <Label htmlFor="ship">{t('checkout.delivery_method.ship')}</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="pickup" id="pickup" />
                                    <Label htmlFor="pickup">{t('checkout.delivery_method.pickup')}</Label>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>

          {deliveryMethod === 'ship' && (
            <Card>
              <CardHeader>
                                <CardTitle>{t('checkout.shipping_info.title')}</CardTitle>
              </CardHeader>
              <CardContent>
                <form className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                                            <Label htmlFor="firstName">{t('checkout.shipping_info.first_name')}</Label>
                      <Input 
                        id="firstName" 
                                                placeholder={t('checkout.shipping_info.first_name_placeholder')}
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                                            <Label htmlFor="lastName">{t('checkout.shipping_info.last_name')}</Label>
                      <Input 
                        id="lastName" 
                                                placeholder={t('checkout.shipping_info.last_name_placeholder')}
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                                        <Label htmlFor="address1">{t('checkout.shipping_info.address1')}</Label>
                                        <Input id="address1" placeholder={t('checkout.shipping_info.address1_placeholder')} value={address1} onChange={(e) => setAddress1(e.target.value)} required />
                  </div>
                  <div className="space-y-2">
                                        <Label htmlFor="address2">{t('checkout.shipping_info.address2')}</Label>
                                        <Input id="address2" placeholder={t('checkout.shipping_info.address2_placeholder')} value={address2} onChange={(e) => setAddress2(e.target.value)} />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                                            <Label htmlFor="area">{t('checkout.shipping_info.area')}</Label>
                                            <Input id="area" placeholder={t('checkout.shipping_info.area_placeholder')} value={area} onChange={(e) => setArea(e.target.value)} required />
                    </div>
                    <div className="space-y-2">
                                            <Label htmlFor="city">{t('checkout.shipping_info.city')}</Label>
                                            <Select onValueChange={setShippingCity} value={shippingCity}>
                                                <SelectTrigger id="city"><SelectValue placeholder={t('checkout.shipping_info.city_placeholder')} /></SelectTrigger>
                                                <SelectContent>{uaeCities.map(city => (<SelectItem key={city} value={city}>{city}</SelectItem>))}</SelectContent>
                                            </Select>
                    </div>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {deliveryMethod === 'pickup' && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>{t('checkout.pickup_info.title')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup value={selectedLocation} onValueChange={setSelectedLocation}>
                    {pickupLocations.map((location) => (
                      <div key={location.id} className="flex items-center space-x-2 border p-4 rounded-md">
                        <RadioGroupItem value={location.id} id={location.id} />
                        <Label htmlFor={location.id} className="flex flex-col">
                          <span className="font-semibold">{location.name}</span>
                          <span className="text-sm text-muted-foreground">{location.address}</span>
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>{t('checkout.pickup_info.schedule_title')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="pickup-date">{t('checkout.pickup_info.date')}</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !pickupDate && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {pickupDate ? format(pickupDate, "PPP") : <span>{t('checkout.pickup_info.date_placeholder')}</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={pickupDate}
                            onSelect={setPickupDate}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="pickup-time">{t('checkout.pickup_info.time')}</Label>
                      <Select value={pickupTime} onValueChange={setPickupTime}>
                        <SelectTrigger id="pickup-time">
                          <SelectValue placeholder={t('checkout.pickup_info.time_placeholder')} />
                        </SelectTrigger>
                        <SelectContent>
                          {timeSlots.map(slot => (
                            <SelectItem key={slot} value={slot}>{slot}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          <Card>
            <CardHeader>
                            <CardTitle>{t('checkout.payment.title')}</CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-4">
                                <div className="border p-4 rounded-lg">
                                    <div className="flex items-center space-x-3">
                    <RadioGroupItem value="card" id="card" />
                                        <Label htmlFor="card" className="flex items-center"><CreditCard className="mr-2 h-5 w-5" />{t('checkout.payment.card')}</Label>
                  </div>
                  {paymentMethod === 'card' && (
                                        <div className="mt-4 space-y-4 pl-8">
                      <div className="space-y-2">
                                                <Label htmlFor="cardNumber">{t('checkout.payment.card_number')}</Label>
                        <Input 
                          id="cardNumber" 
                                                    placeholder={t('checkout.payment.card_number_placeholder')}
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, '').slice(0, 16))}
                          required
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                                                    <Label htmlFor="expiryDate">{t('checkout.payment.expiry')}</Label>
                          <Input 
                            id="expiryDate" 
                                                        placeholder={t('checkout.payment.expiry_placeholder')}
                            value={expiryDate}
                            onChange={(e) => setExpiryDate(e.target.value)}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                                                    <Label htmlFor="cvv">{t('checkout.payment.cvv')}</Label>
                          <Input 
                            id="cvv" 
                                                        placeholder={t('checkout.payment.cvv_placeholder')}
                            value={cvv}
                            onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 3))}
                            required
                            type="password"
                            maxLength={3}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                                                <Label htmlFor="cardName">{t('checkout.payment.card_name')}</Label>
                        <Input 
                          id="cardName" 
                                                    placeholder={t('checkout.payment.card_name_placeholder')}
                          value={cardName}
                          onChange={(e) => setCardName(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                  )}
                </div>
                                <div className="border p-4 rounded-lg">
                                    <div className="flex items-center space-x-3">
                    <RadioGroupItem value="tamara" id="tamara" />
                                        <Label htmlFor="tamara" className="flex items-center"><img src="https://cdn.tamara.co/assets/png/tamara-logo-badge-en.png" alt="Tamara" className="h-6" />{t('checkout.payment.tamara')}</Label>
                  </div>
                  {paymentMethod === 'tamara' && (
                                        <div className="pt-4 mt-4 text-center">
                                            <p className="text-sm text-gray-600">{t('checkout.payment.tamara_desc')}</p>
                    </div>
                  )}
                </div>
                                <div className="border p-4 rounded-lg">
                                    <div className="flex items-center space-x-3">
                    <RadioGroupItem value="tabby" id="tabby" />
                                        <Label htmlFor="tabby" className="flex items-center"><span>{t('checkout.payment.tabby')}</span><img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRHlx15NwYiMVvAuA-RxHMnNGAsOJoAe8UQ5A&s" alt="Tabby" className="h-8" /></Label>
                  </div>
                  {paymentMethod === 'tabby' && (
                    <div className="mt-4 pl-8 text-sm text-gray-500">
                                            <p className="text-sm text-gray-600">{t('checkout.payment.tabby_description')}</p>
                    </div>
                  )}
                </div>
              </RadioGroup>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
                            <CardTitle>{t('checkout.summary.title')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex space-x-4">
                    <div className="w-16 h-16 flex-shrink-0">
                      <img 
                        src={item.imageUrl || '/tyre-placeholder.jpg'}
                        alt={item.name}
                        className="w-full h-full object-cover rounded-md"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{item.brand} {item.name}</p>
                      <p className="text-sm text-gray-500">{item.size}</p>
                      <div className="flex justify-between mt-1">
                        <span className="text-sm">Qty: {item.quantity}</span>
                        <span className="font-medium">AED {(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="flex justify-between">
                                    <span>{t('checkout.summary.items_total')}</span>
                  <span>AED {getSubtotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                                    <span>{t('checkout.summary.installation_fee')}</span>
                  <span>AED {getFitmentFee().toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                                    <span>{t('checkout.summary.vat')}</span>
                  <span>AED {getVAT().toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold">
                                    <span>{t('checkout.summary.total')}</span>
                  <span>AED {getTotal().toFixed(2)}</span>
                </div>
              </div>

              <Button 
                className="w-full bg-black text-white" 
                size="lg"
                onClick={handlePlaceOrder}
                disabled={cartItems.length === 0}
              >
                                {t('checkout.summary.place_order_btn')}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;



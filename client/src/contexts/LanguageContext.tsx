import { createContext, ReactNode, useContext, useState } from 'react';

type Language = 'en' | 'ar';

// Define a type for all possible translation keys
type TranslationKey =
  | 'nav.home' | 'nav.tyres' | 'nav.accessories' | 'nav.reviews' | 'nav.contact' | 'nav.login'
  | 'hero.title' | 'hero.subtitle' | 'search.placeholder'
  | 'width' | 'aspect_ratio' | 'rim_size' | 'height' | 'current_size_selection'
  | 'contact.title' | 'contact.subtitle'
  | 'contact.address.title' | 'contact.address.content' | 'contact.address.desc'
  | 'contact.phone.title' | 'contact.phone.content' | 'contact.phone.desc'
  | 'contact.email.title' | 'contact.email.content' | 'contact.email.desc'
  | 'contact.hours.title' | 'contact.hours.content' | 'contact.hours.desc'
  | 'contact.form.title' | 'contact.form.name' | 'contact.form.name.placeholder'
  | 'contact.form.email' | 'contact.form.email.placeholder' | 'contact.form.subject' | 'contact.form.subject.placeholder'
  | 'contact.form.message' | 'contact.form.message.placeholder' | 'contact.form.button' | 'contact.form.button.sending'
  | 'contact.locations.title' | 'contact.locations.dubai' | 'contact.locations.abudhabi' | 'contact.locations.sharjah'
  | 'contact.map.title' | 'contact.map.desc'
  | 'footer.newsletter.title' | 'footer.newsletter.subtitle' | 'footer.newsletter.email.placeholder' | 'footer.newsletter.button'
  | 'footer.links.quick' | 'footer.contact.title' | 'footer.copyright'
  | 'reviews.title' | 'reviews.based_on' | 'reviews.based_on_singular' | 'reviews.based_on_plural'
  | 'reviews.leave_a_review' | 'reviews.form.name' | 'reviews.form.name.placeholder'
  | 'reviews.form.email' | 'reviews.form.email.placeholder' | 'reviews.form.rating'
  | 'reviews.form.your_review' | 'reviews.form.your_review.placeholder' | 'reviews.form.button'
  | 'reviews.helpful' | 'reviews.yes' | 'reviews.no'
  | 'home.hero.title' | 'home.hero.subtitle' | 'home.hero.brands' | 'home.hero.search_placeholder'
  | 'home.steps.title'
  | 'home.steps.1.title' | 'home.steps.2.title' | 'home.steps.3.title' | 'home.steps.4.title' | 'home.steps.5.title'
  | 'home.accessories.title' | 'home.accessories.subtitle' | 'home.accessories.button'
  | 'home.accessories.drivetrain' | 'home.accessories.engine' | 'home.accessories.exterior' | 'home.accessories.suspension'
  | 'home.services.title' | 'home.services.subtitle'
  | 'home.services.buy.title' | 'home.services.buy.desc'
  | 'home.services.fitment.title' | 'home.services.fitment.desc'
  | 'home.services.shop.title' | 'home.services.shop.desc'
  | 'home.brands.title' | 'home.brands.subtitle' | 'home.brands.button'
  | 'home.cars.title' | 'home.cars.subtitle' | 'home.cars.button'
  | 'home.locations.title' | 'home.locations.button'
  | 'home.blog.title' | 'home.blog.subtitle' | 'home.blog.button'
  | 'product.back_to_all'
  | 'product.info_title' | 'product.name' | 'product.origin' | 'product.sku'
  | 'product.in_stock' | 'product.out_of_stock'
  | 'product.set_of_1' | 'product.vat_included'
  | 'product.quantity' | 'product.items_available'
  | 'product.add_to_cart' | 'product.pay_in_installments'
  | 'product.description_title' | 'product.specifications_title'
  | 'product.warranty' | 'product.year' | 'product.speed_rating' | 'product.load_index' | 'product.oem'
  | 'product.fitment_options' | 'product.partner_centers' | 'product.partner_centers_desc'
  | 'product.home_service' | 'product.home_service_desc'
  | 'product.van_service' | 'product.van_service_desc'
  | 'product.related_products'
  | 'product.not_found' | 'product.not_exist' | 'product.view_cart' | 'product.pay_installments'
  | 'product.added_to_cart' | 'product.added_to_cart_desc'
  | 'product.run_flat' | 'product.category'
  | 'product.set_of_1_each' | 'product.aed'
  // Cart Page Translations
  | 'cart.shopping_cart'
  | 'cart.continue_shopping'
  | 'cart.empty_cart_message'
  | 'cart.item'
  | 'cart.price'
  | 'cart.qty'
  | 'cart.item_total'
  | 'cart.with_fitment_question'
  | 'cart.yes'
  | 'cart.no'
  | 'cart.with_fitment_delivery_message'
  | 'cart.select_fitting_location'
  | 'cart.select_mobile_van_or_garage_placeholder'
  | 'cart.vehicle_information'
  | 'cart.vin_number'
  | 'cart.enter_vin_number_placeholder'
  | 'cart.vehicle_plate_required'
  | 'cart.enter_vehicle_plate_placeholder'
  | 'cart.make_required'
  | 'cart.select_make_placeholder'
  | 'cart.model_required'
  | 'cart.select_model_placeholder'
  | 'cart.year_required'
  | 'cart.select_year_placeholder'
  | 'cart.discount_codes'
  | 'cart.enter_discount_code_placeholder'
  | 'cart.apply_button'
  | 'cart.summary'
  | 'cart.items_total'
  | 'cart.installation_fee'
  | 'cart.vat'
  | 'cart.grand_total'
  | 'cart.proceed_to_checkout'
  | 'cart.required_field'
  | 'cart.enter_vehicle_plate_number'
  | 'cart.select_vehicle_make'
  | 'cart.select_vehicle_model'
  | 'cart.select_vehicle_year'
  | 'cart.select_fitting_location_toast'
  // Checkout Page Translations
  | 'checkout.title' | 'checkout.delivery_method.title' | 'checkout.delivery_method.ship' | 'checkout.delivery_method.pickup'
  | 'checkout.shipping_info.title' | 'checkout.shipping_info.first_name' | 'checkout.shipping_info.first_name_placeholder'
  | 'checkout.shipping_info.last_name' | 'checkout.shipping_info.last_name_placeholder'
  | 'checkout.shipping_info.address1' | 'checkout.shipping_info.address1_placeholder'
  | 'checkout.shipping_info.address2' | 'checkout.shipping_info.address2_placeholder'
  | 'checkout.shipping_info.area' | 'checkout.shipping_info.area_placeholder' | 'checkout.shipping_info.city' | 'checkout.shipping_info.city_placeholder'
  | 'checkout.pickup_info.title' | 'checkout.pickup_info.date' | 'checkout.pickup_info.time' | 'checkout.pickup_info.time_placeholder'
  | 'checkout.pickup_info.location' | 'checkout.pickup_info.location_placeholder' | 'checkout.pickup_info.schedule_title'
  | 'checkout.payment.title' | 'checkout.payment.card' | 'checkout.payment.card_number' | 'checkout.payment.card_number_placeholder'
  | 'checkout.payment.expiry' | 'checkout.payment.expiry_placeholder' | 'checkout.payment.cvv' | 'checkout.payment.cvv_placeholder'
  | 'checkout.payment.card_name' | 'checkout.payment.card_name_placeholder'
  | 'checkout.payment.tamara' | 'checkout.payment.tamara_desc'
  | 'checkout.payment.tabby'
  | 'checkout.summary.title' | 'checkout.summary.place_order_btn'
  | 'checkout.summary.items_total' | 'checkout.summary.installation_fee' | 'checkout.summary.vat' | 'checkout.summary.total'
  | 'checkout.validation.required_field' | 'checkout.validation.first_name' | 'checkout.validation.last_name' | 'checkout.validation.address'
  | 'checkout.validation.city' | 'checkout.validation.area' | 'checkout.validation.pickup_date' | 'checkout.validation.pickup_time' | 'checkout.validation.pickup_location'
  | 'checkout.validation.invalid_card' | 'checkout.validation.card_expiry' | 'checkout.validation.invalid_cvv' | 'checkout.validation.card_name'
  | 'checkout.success.title' | 'checkout.success.description'
  | 'services.see_all_services'
  | 'services.balancing.desc' | 'services.puncture_repair.title' | 'services.puncture_repair.desc'
  | 'tyre_brands.title' | 'tyre_brands.subtitle' | 'tyre_brands.alt_text' | 'tyre_brands.see_all_brands'
  | 'car_brands.title' | 'car_brands.subtitle' | 'car_brands.alt_text' | 'car_brands.see_all_brands' | 'car_brands.all_car_brands'
  | 'blog.title' | 'blog.subtitle'
  | 'blog.post1.title' | 'blog.post1.desc' | 'blog.post1.author'
  | 'blog.read_more' | 'blog.all_posts'
  | 'footer.quick_links' | 'footer.contact_info' | 'footer.newsletter' | 'footer.newsletter_placeholder' | 'footer.subscribe'
  | 'footer.rights_reserved' | 'footer.home' | 'footer.tyres' | 'footer.accessories'
  | 'footer.reviews' | 'footer.contact' | 'footer.address' | 'footer.phone' | 'footer.email'
  | 'withFitment' | 'yes' | 'no' | 'fitmentDeliver' | 'selectFittingLocation' | 'selectFitmentGarage' 
  | 'vehicleInfo' | 'enterVin' | 'vehiclePlate' | 'enterVehiclePlate' | 'make' 
  | 'selectMake' | 'model' | 'selectModel' | 'year' | 'selectYear'
  | 'specialDeal' | 'specialDealOffer'
  | 'home.search.by_size' | 'home.search.by_product_name' | 'home.search.size_placeholder' | 'home.search.product_name_placeholder'
  | 'search'
  // Tyres Page Translations
  | 'tyresPage.shop_tyres'
  // Accessories Page Translations
  | 'accessories.shop_by_category'
  | 'accessories.back_to_all_categories'
  | 'accessories.no_products_found'
  | 'accessories.search_in_category_placeholder'
  | 'accessories.category.engine_performance'
  | 'accessories.category.drivetrain'
  | 'accessories.category.suspension'
  | 'accessories.category.exterior'
  | 'accessories.category.interior'
  | 'accessories.category.rims_and_tires'
  | 'accessories.category.lighting'
  | 'accessories.category.winches'
  | 'accessories.category.equipment'
  | 'accessories.category.car_care_diy'
  | 'accessories.category.car_care_professional'
  | 'accessories.category.camping'
  | 'accessories.multiple_categories'
  | 'accessories.select_all_categories'
  | 'accessories.products'
  | 'accessories.search_brands_placeholder'
  | 'search_tyre_size_placeholder'
  | 'go_back'
  | 'reset'
  | 'accessory_detail.product_information'
  | 'accessory_detail.product_name'
  | 'accessory_detail.category'
  | 'accessory_detail.condition'
  | 'accessory_detail.warranty'
  | 'accessory_detail.sku'
  | 'accessory_detail.urls'
  | 'accessory_detail.in_stock'
  | 'accessory_detail.add_to_cart'
  | 'accessory_detail.back_to_accessories'
  | 'accessory_detail.not_found' | 'accessory_detail.not_found_message'
  | 'shop_by_brand' | 'product' | 'products';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKey) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Use a Record type for stricter translations object
const translations: Record<Language, Record<TranslationKey, string>> = {
  en: {
    'nav.home': 'Home',
    'nav.tyres': 'Tyres',
    'nav.accessories': 'Accessories',
    'nav.reviews': 'Reviews',
    'nav.contact': 'Contact',
    'nav.login': 'Login',
    'hero.title': 'BUY TYRES ONLINE',
    'hero.subtitle': 'The easiest way to buy and install tyres online, anywhere in the UAE.',
    'search.placeholder': 'Search Tyres by Size or Vehicle',
    'width': 'Width',
    'aspect_ratio': 'Aspect Ratio',
    'rim_size': 'Rim Size',
    'height': 'Height',
    'current_size_selection': 'Current Size Selection',
    // Contact Page Translations
    'contact.title': 'Contact Us',
    'contact.subtitle': 'Get in touch with our automotive experts for any questions about tyres, accessories, or services',
    'contact.address.title': 'Address',
    'contact.address.content': 'Sheikh Zayed Road, Dubai, UAE',
    'contact.address.desc': 'Visit our main showroom',
    'contact.phone.title': 'Phone',
    'contact.phone.content': '+971 4 123 4567',
    'contact.phone.desc': 'Call us for immediate assistance',
    'contact.email.title': 'Email',
    'contact.email.content': 'info@futuretyretrading.ae',
    'contact.email.desc': 'Send us an email anytime',
    'contact.hours.title': 'Business Hours',
    'contact.hours.content': 'Mon-Fri: 8AM-8PM',
    'contact.hours.desc': 'Sat: 8AM-6PM, Sun: 10AM-4PM',
    'contact.form.title': 'Send us a Message',
    'contact.form.name': 'Name',
    'contact.form.name.placeholder': 'Your name',
    'contact.form.email': 'Email',
    'contact.form.email.placeholder': 'your@email.com',
    'contact.form.subject': 'Subject',
    'contact.form.subject.placeholder': 'What can we help you with?',
    'contact.form.message': 'Message',
    'contact.form.message.placeholder': 'Please describe your inquiry in detail...',
    'contact.form.button': 'Send Message',
    'contact.form.button.sending': 'Sending...',
    'contact.locations.title': 'Our Locations',
    'contact.locations.dubai': 'Dubai Main Branch',
    'contact.locations.abudhabi': 'Abu Dhabi Branch',
    'contact.locations.sharjah': 'Sharjah Branch',
    'contact.map.title': 'Interactive Map',
    'contact.map.desc': 'Click markers for location details',
    // Footer Translations
    'footer.newsletter.title': 'Newsletter',
    'footer.newsletter.subtitle': 'Stay updated with our latest offers and automotive tips',
    'footer.newsletter.email.placeholder': 'Your email',
    'footer.newsletter.button': 'Subscribe',
    'footer.links.quick': 'Quick Links',
    'footer.contact.title': 'Contact Info',
    'footer.copyright': 'Future Tyre Trading. All Rights Reserved {year}',
    // Reviews Page Translations
    'reviews.title': 'Customer Reviews',
    'reviews.based_on': 'Based on',
    'reviews.based_on_singular': 'review',
    'reviews.based_on_plural': 'reviews',
    'reviews.leave_a_review': 'Leave a Review',
    'reviews.form.name': 'Name',
    'reviews.form.name.placeholder': 'Your name',
    'reviews.form.email': 'Email',
    'reviews.form.email.placeholder': 'your@email.com',
    'reviews.form.rating': 'Rating',
    'reviews.form.your_review': 'Your Review',
    'reviews.form.your_review.placeholder': 'Share your experience with our products and services...',
    'reviews.form.button': 'Submit Review',
    'reviews.helpful': 'Was this review helpful?',
    'reviews.yes': 'Yes',
    'reviews.no': 'No',
    // HomePage - Hero Section
    'home.hero.title': 'BUY TYRES ONLINE',
    'home.hero.subtitle': 'The easiest way to buy and install tyres online, anywhere in the UAE.',
    'home.hero.brands': '60+ Authorized Tyre Brands',
    'home.hero.search_placeholder': 'Search Tyres by Size or Vehicle',
    // Search Widget Translations
    'home.search.by_size': 'By Tires Size',
    'home.search.by_product_name': 'By Product Name',
    'home.search.size_placeholder': 'Search Tyre by Size',
    'home.search.product_name_placeholder': 'e.g. Michelin Primacy 4',
    'search': 'Search',
    // HomePage - Step-by-Step
    'home.steps.title': 'How to Purchase a Tyre',
    'home.steps.1.title': 'Step 1: Find Your Tyre Size',
    'home.steps.2.title': 'Step 2: Select Tyre Model',
    'home.steps.3.title': 'Step 3: Add to Cart',
    'home.steps.4.title': 'Step 4: Checkout & Pay',
    'home.steps.5.title': 'Step 5: Book Fitment',
    // HomePage - Accessories Promo
    'home.accessories.title': 'Explore Premium Accessories',
    'home.accessories.subtitle': 'We carry everything from bumpers and winches to lighting and interior gear. Customize and protect your vehicle with our hand-picked accessories',
    'home.accessories.button': 'Shop Accessories',
    'home.accessories.drivetrain': 'Drivetrain',
    'home.accessories.engine': 'Engine Performance',
    'home.accessories.exterior': 'Exterior',
    'home.accessories.suspension': 'Suspension',
    // HomePage - Services Section
    'home.services.title': 'BUY TYRES ONLINE',
    'home.services.subtitle': 'The easiest way to buy and install tyres online, anywhere in the UAE',
    'home.services.buy.title': 'Buy Tyres',
    'home.services.buy.desc': 'Easy checkout and secure payment options.',
    'home.services.fitment.title': 'Tyre Fitment',
    'home.services.fitment.desc': 'Select partner installers or get our Mobile Fitment Van Service.',
    'home.services.shop.title': 'Shop Tyres',
    'home.services.shop.desc': 'Search by tyre size or vehicle details, select quantity and add to cart.',
    // HomePage - Brands Sections
    'home.brands.title': 'AUTHORIZED TYRE BRANDS',
    'home.brands.subtitle': 'We have brands for every taste and need. From globally established, award-winning and innovative brands to newcomers making their mark.',
    'home.brands.button': 'SEE ALL BRANDS',
    'home.cars.title': 'THE RIGHT TYRES FOR YOUR VEHICLE',
    'home.cars.subtitle': 'Looking for the perfect tyres for your car? We have got you covered! Browse through our wide selection of tyres for most brands and models to find the perfect fit for your vehicle.',
    'home.cars.button': 'ALL CAR BRANDS',
    // HomePage - Location & Blog
    'home.locations.title': 'Find Us Here',
    'home.locations.button': 'Get Directions',
    'home.blog.title': 'TYRESONLINE BLOG',
    'home.blog.subtitle': 'Everything you need to know about tyres and anything automotive.',
    'home.blog.button': 'ALL POSTS',
    // Product Detail Page Translations
    'product.back_to_all': 'Back to All Tyres',
    'product.info_title': 'PRODUCT INFORMATION',
    'product.name': 'Product Name',
    'product.origin': 'Origin',
    'product.sku': 'SKU',
    'product.in_stock': 'In Stock',
    'product.out_of_stock': 'Out of Stock',
    'product.set_of_1': 'Set of 1',
    'product.vat_included': 'All prices include VAT',
    'product.quantity': 'Quantity',
    'product.items_available': 'Items available',
    'product.add_to_cart': 'Add to Cart',
    'product.pay_in_installments': 'Pay in 4 installments',
    'product.description_title': 'Product Description',
    'product.specifications_title': 'Specifications',
    'product.warranty': 'Warranty',
    'product.year': 'Year',
    'product.speed_rating': 'Speed Rating',
    'product.load_index': 'Load Index',
    'product.oem': 'OEM',
    'product.fitment_options': 'Fitment Options',
    'product.partner_centers': 'Partner Fitting Center',
    'product.partner_centers_desc': 'Select one of our partner centers',
    'product.home_service': 'Home Service',
    'product.home_service_desc': 'We come to you (AED 50)',
    'product.van_service': 'Mobile Van',
    'product.van_service_desc': 'Dubai only (AED 80)',
    'product.related_products': 'Related Products',
    'product.not_found': 'Product Not Found',
    'product.not_exist': 'The product you are looking for does not exist.',
    'product.view_cart': 'View Cart',
    'product.pay_installments': 'Pay in 4 installments',
    'product.added_to_cart': 'Added to cart',
    'product.added_to_cart_desc': 'has been added to your cart.',
    'product.run_flat': 'Run Flat',
    'product.category': 'Category',
    'product.set_of_1_each': 'Set of 1, each',
    'product.aed': 'AED',
    // Cart Page Translations
    'cart.shopping_cart': 'Shopping Cart',
    'cart.continue_shopping': 'Continue Shopping',
    'cart.empty_cart_message': 'Your cart is currently empty.',
    'cart.item': 'Item',
    'cart.price': 'Price',
    'cart.qty': 'Qty',
    'cart.item_total': 'Item(s) Total',
    'cart.with_fitment_question': 'WITH FITMENT?',
    'cart.yes': 'Yes',
    'cart.no': 'No',
    'cart.with_fitment_delivery_message': 'WITH FITMENT - DELIVER TO FITTING LOCATION',
    'cart.select_fitting_location': 'SELECT FITTING LOCATION',
    'cart.select_mobile_van_or_garage_placeholder': 'SELECT HERE, MOBILE VAN OR FITMENT GARAGE',
    'cart.vehicle_information': 'VEHICLE INFORMATION',
    'cart.vin_number': 'VIN Number',
    'cart.enter_vin_number_placeholder': 'Enter VIN Number',
    'cart.vehicle_plate_required': 'Vehicle Plate *',
    'cart.enter_vehicle_plate_placeholder': 'Enter Vehicle Plate',
    'cart.make_required': 'Make *',
    'cart.select_make_placeholder': 'Select Make',
    'cart.model_required': 'Model *',
    'cart.select_model_placeholder': 'Select Model',
    'cart.year_required': 'Year *',
    'cart.select_year_placeholder': 'Select Year',
    'cart.discount_codes': 'DISCOUNT CODES',
    'cart.enter_discount_code_placeholder': 'Enter your discount code',
    'cart.apply_button': 'APPLY',
    'cart.summary': 'SUMMARY',
    'cart.items_total': 'ITEM(S) TOTAL',
    'cart.installation_fee': 'Installation Fee',
    'cart.vat': 'VAT (5%)',
    'cart.grand_total': 'Grand Total',
    'cart.proceed_to_checkout': 'PROCEED TO CHECKOUT',
    'cart.required_field': 'Required Field',
    'cart.enter_vehicle_plate_number': 'Please enter your vehicle plate number',
    'cart.select_vehicle_make': 'Please select your vehicle make',
    'cart.select_vehicle_model': 'Please select your vehicle model',
    'cart.select_vehicle_year': 'Please select your vehicle year',
    'cart.select_fitting_location_toast': 'Please select a fitting location',
    // Checkout Page Translations
    'checkout.title': 'Checkout',
    'checkout.delivery_method.title': 'Delivery Method',
    'checkout.delivery_method.ship': 'Ship to Address',
    'checkout.delivery_method.pickup': 'Pickup from Store',
    'checkout.shipping_info.title': 'Shipping Information',
    'checkout.shipping_info.first_name': 'First Name',
    'checkout.shipping_info.first_name_placeholder': 'Enter first name',
    'checkout.shipping_info.last_name': 'Last Name',
    'checkout.shipping_info.last_name_placeholder': 'Enter last name',
    'checkout.shipping_info.address1': 'Address Line 1',
    'checkout.shipping_info.address1_placeholder': 'Enter address line 1',
    'checkout.shipping_info.address2': 'Address Line 2',
    'checkout.shipping_info.address2_placeholder': 'Enter address line 2',
    'checkout.shipping_info.area': 'Area',
    'checkout.shipping_info.area_placeholder': 'Select your area',
    'checkout.shipping_info.city': 'City',
    'checkout.shipping_info.city_placeholder': 'Select your city',
    'checkout.pickup_info.title': 'Pickup Information',
    'checkout.pickup_info.date': 'Pickup Date',
    'checkout.pickup_info.time': 'Pickup Time',
    'checkout.pickup_info.time_placeholder': 'Select pickup time',
    'checkout.pickup_info.location': 'Pickup Location',
    'checkout.pickup_info.location_placeholder': 'Select pickup location',
    'checkout.pickup_info.schedule_title': 'Schedule Your Pickup',
    'checkout.payment.title': 'Payment Method',
    'checkout.payment.card': 'Credit/Debit Card',
    'checkout.payment.card_number': 'Card Number',
    'checkout.payment.card_number_placeholder': 'Enter card number',
    'checkout.payment.expiry': 'Expiry Date',
    'checkout.payment.expiry_placeholder': 'MM/YY',
    'checkout.payment.cvv': 'CVV',
    'checkout.payment.cvv_placeholder': 'Enter CVV',
    'checkout.payment.card_name': 'Name on Card',
    'checkout.payment.card_name_placeholder': 'Enter name on card',
    'checkout.payment.tamara': 'Tamara',
    'checkout.payment.tamara_desc': 'Pay in 3 interest-free installments',
    'checkout.payment.tabby': 'Tabby',
    'checkout.summary.title': 'Order Summary',
    'checkout.summary.place_order_btn': 'Place Order',
    'checkout.summary.items_total': 'Items Total',
    'checkout.summary.installation_fee': 'Installation Fee',
    'checkout.summary.vat': 'VAT',
    'checkout.summary.total': 'Total',
    'checkout.validation.required_field': 'This field is required.',
    'checkout.validation.first_name': 'First name is required.',
    'checkout.validation.last_name': 'Last name is required.',
    'checkout.validation.address': 'Address is required.',
    'checkout.validation.city': 'City is required.',
    'checkout.validation.area': 'Area is required.',
    'checkout.validation.pickup_date': 'Pickup date is required.',
    'checkout.validation.pickup_time': 'Pickup time is required.',
    'checkout.validation.pickup_location': 'Pickup location is required.',
    'checkout.validation.invalid_card': 'Invalid card number.',
    'checkout.validation.card_expiry': 'Expiry date is invalid.',
    'checkout.validation.invalid_cvv': 'Invalid CVV.',
    'checkout.validation.card_name': 'Name on card is required.',
    'checkout.success.title': 'Order Placed Successfully!',
    'checkout.success.description': 'Thank you for your purchase. Your order has been placed and will be processed shortly.',
    'services.see_all_services': 'See All Services',
    'services.balancing.desc': 'Wheel balancing ensures smooth rotation, prolonging tyre life and improving handling. Essential for safety and comfort.',
    'services.puncture_repair.title': 'Puncture Repair',
    'services.puncture_repair.desc': 'Professional puncture repair services to get you back on the road safely and quickly.',
    'tyre_brands.title': 'AUTHORIZED TYRE BRANDS',
    'tyre_brands.subtitle': 'We have brands for every taste and need. From globally established, award-winning and innovative brands to newcomers making their mark.',
    'tyre_brands.alt_text': 'Tyre Brand Logo',
    'tyre_brands.see_all_brands': 'SEE ALL BRANDS',
    'car_brands.title': 'THE RIGHT TYRES FOR YOUR VEHICLE',
    'car_brands.subtitle': 'Looking for the perfect tyres for your car? We have got you covered! Browse through our wide selection of tyres for most brands and models to find the perfect fit for your vehicle.',
    'car_brands.alt_text': 'Car Brand Logo',
    'car_brands.see_all_brands': 'SEE ALL BRANDS',
    'car_brands.all_car_brands': 'ALL CAR BRANDS',
    'blog.title': 'TYRESONLINE BLOG',
    'blog.subtitle': 'Everything you need to know about tyres and anything automotive.',
    'blog.post1.title': 'The Importance of Regular Tyre Maintenance',
    'blog.post1.desc': 'Learn why routine tyre checks are crucial for your safety and vehicle performance.',
    'blog.post1.author': 'By John Doe',
    'blog.read_more': 'Read More',
    'blog.all_posts': 'ALL POSTS',
    'footer.quick_links': 'Quick Links',
    'footer.contact_info': 'Contact Info',
    'footer.newsletter': 'Newsletter',
    'footer.newsletter_placeholder': 'Enter your email',
    'footer.subscribe': 'Subscribe',
    'footer.rights_reserved': 'Future Tyre Trading. All Rights Reserved {year}',
    'footer.home': 'Home',
    'footer.tyres': 'Tyres',
    'footer.accessories': 'Accessories',
    'footer.reviews': 'Reviews',
    'footer.contact': 'Contact',
    'footer.address': 'Address',
    'footer.phone': 'Phone',
    'footer.email': 'Email',
    'withFitment': 'With Fitment',
    'yes': 'Yes',
    'no': 'No',
    'fitmentDeliver': 'WITH FITMENT - DELIVER TO FITTING LOCATION',
    'selectFittingLocation': 'SELECT FITTING LOCATION',
    'selectFitmentGarage': 'SELECT HERE, MOBILE VAN OR FITMENT GARAGE',
    'vehicleInfo': 'VEHICLE INFORMATION',
    'enterVin': 'Enter VIN Number',
    'vehiclePlate': 'Vehicle Plate',
    'enterVehiclePlate': 'Enter Vehicle Plate',
    'make': 'Make',
    'selectMake': 'Select Make',
    'model': 'Model',
    'selectModel': 'Select Model',
    'year': 'Year',
    'selectYear': 'Select Year',
    'specialDeal': 'SPECIAL DEAL',
    'specialDealOffer': 'Get 20% off on all accessories!',
    'home.search.by_size': 'By Tires Size',
    'home.search.by_product_name': 'By Product Name',
    'home.search.size_placeholder': 'Search Tyre by Size',
    'home.search.product_name_placeholder': 'e.g. Michelin Primacy 4',
    'search': 'Search',
    // Tyres Page Translations
    'tyresPage.shop_tyres': 'Shop Tyres',
    // Accessories Page Translations
    'accessories.shop_by_category': 'Shop by Category',
    'accessories.back_to_all_categories': 'Back to All Categories',
    'accessories.no_products_found': 'No products found for this category.',
    'accessories.search_in_category_placeholder': 'Search in {categoryName}...',
    'accessories.category.engine_performance': 'Engine Performance',
    'accessories.category.drivetrain': 'Drivetrain',
    'accessories.category.suspension': 'Suspension',
    'accessories.category.exterior': 'Exterior',
    'accessories.category.interior': 'Interior',
    'accessories.category.rims_and_tires': 'Rims',
    'accessories.category.lighting': 'Lighting',
    'accessories.category.winches': 'Winches',
    'accessories.category.equipment': 'Equipment',
    'accessories.category.car_care_diy': 'Car Care - DIY',
    'accessories.category.car_care_professional': 'Car Care - Professional',
    'accessories.category.camping': 'Camping',
    'accessories.multiple_categories': 'Multiple Categories',
    'accessories.select_all_categories': 'Select All',
    'accessories.products': 'Products',
    'accessories.search_brands_placeholder': 'Search brands...',
    'search_tyre_size_placeholder': 'Search Tyre Size e.g 1956515 or 195/65 R15',
    'go_back': 'Go Back',
    'reset': 'Reset',
    'accessory_detail.product_information': 'Product Information',
    'accessory_detail.product_name': 'Product Name',
    'accessory_detail.category': 'Category',
    'accessory_detail.condition': 'Condition',
    'accessory_detail.warranty': 'Warranty',
    'accessory_detail.sku': 'SKU',
    'accessory_detail.urls': 'Image URLs',
    'accessory_detail.in_stock': 'In Stock',
    'accessory_detail.add_to_cart': 'Add to Cart',
    'accessory_detail.back_to_accessories': 'Back to Accessories',
    'accessory_detail.not_found': 'Accessory Not Found',
    'accessory_detail.not_found_message': 'The accessory you are looking for could not be found.',
    'shop_by_brand': 'Shop by Brand',
    'product': 'Product',
    'products': 'Products',
  },
  ar: {
    'nav.home': 'الرئيسية',
    'nav.tyres': 'الإطارات',
    'nav.accessories': 'الإكسسوارات',
    'nav.reviews': 'التقييمات',
    'nav.contact': 'اتصل بنا',
    'nav.login': 'تسجيل الدخول',
    'hero.title': 'اشتري الإطارات عبر الإنترنت',
    'hero.subtitle': 'أسهل طريقة لشراء وتركيب الإطارات عبر الإنترنت، في أي مكان في الإمارات.',
    'search.placeholder': 'البحث عن الإطارات حسب الحجم أو المركبة',
    'width': 'العرض',
    'aspect_ratio': 'نسبة الارتفاع',
    'rim_size': 'حجم الجنط',
    'height': 'الارتفاع',
    'current_size_selection': 'تحديد الحجم الحالي',
    // Contact Page Translations
    'contact.title': 'اتصل بنا',
    'contact.subtitle': 'تواصل مع خبراء السيارات لدينا لأي أسئلة حول الإطارات، الإكسسوارات، أو الخدمات',
    'contact.address.title': 'العنوان',
    'contact.address.content': 'شارع الشيخ زايد، دبي، الإمارات العربية المتحدة',
    'contact.address.desc': 'قم بزيارة معرضنا الرئيسي',
    'contact.phone.title': 'الهاتف',
    'contact.phone.content': '+971 4 123 4567',
    'contact.phone.desc': 'اتصل بنا للحصول على مساعدة فورية',
    'contact.email.title': 'البريد الإلكتروني',
    'contact.email.content': 'info@futuretyretrading.ae',
    'contact.email.desc': 'أرسل لنا بريدًا إلكترونيًا في أي وقت',
    'contact.hours.title': 'ساعات العمل',
    'contact.hours.content': 'الإثنين - الجمعة: 8 صباحًا - 8 مساءً',
    'contact.hours.desc': 'السبت: 8 صباحًا - 6 مساءً، الأحد: 10 صباحًا - 4 مساءً',
    'contact.form.title': 'أرسل لنا رسالة',
    'contact.form.name': 'الاسم',
    'contact.form.name.placeholder': 'اسمك',
    'contact.form.email': 'البريد الإلكتروني',
    'contact.form.email.placeholder': 'your@email.com',
    'contact.form.subject': 'الموضوع',
    'contact.form.subject.placeholder': 'بماذا يمكننا مساعدتك؟',
    'contact.form.message': 'الرسالة',
    'contact.form.message.placeholder': 'الرجاء وصف استفسارك بالتفصيل...',
    'contact.form.button': 'إرسال الرسالة',
    'contact.form.button.sending': 'جاري الإرسال...',
    'contact.locations.title': 'مواقعنا',
    'contact.locations.dubai': 'فرع دبي الرئيسي',
    'contact.locations.abudhabi': 'فرع أبوظبي',
    'contact.locations.sharjah': 'فرع الشارقة',
    'contact.map.title': 'خريطة تفاعلية',
    'contact.map.desc': 'انقر على العلامات للحصول على تفاصيل الموقع',
    // Footer Translations
    'footer.newsletter.title': 'النشرة الإخبارية',
    'footer.newsletter.subtitle': 'ابقَ على اطلاع بأحدث عروضنا ونصائح السيارات',
    'footer.newsletter.email.placeholder': 'بريدك الإلكتروني',
    'footer.newsletter.button': 'اشترك',
    'footer.links.quick': 'روابط سريعة',
    'footer.contact.title': 'معلومات الاتصال',
    'footer.copyright': 'Future Tyre Trading. جميع الحقون محفوظة {year}',
    // Reviews Page Translations
    'reviews.title': 'تقييمات العملاء',
    'reviews.based_on': 'بناءً على',
    'reviews.based_on_singular': 'تقييم',
    'reviews.based_on_plural': 'تقييمات',
    'reviews.leave_a_review': 'اترك تقييمًا',
    'reviews.form.name': 'الاسم',
    'reviews.form.name.placeholder': 'اسمك',
    'reviews.form.email': 'البريد الإلكتروني',
    'reviews.form.email.placeholder': 'your@email.com',
    'reviews.form.rating': 'التقييم',
    'reviews.form.your_review': 'تقييمك',
    'reviews.form.your_review.placeholder': 'شارك تجربتك مع منتجاتنا وخدماتنا...',
    'reviews.form.button': 'إرسال التقييم',
    'reviews.helpful': 'هل كان هذا التقييم مفيدًا؟',
    'reviews.yes': 'نعم',
    'reviews.no': 'لا',
    // HomePage - Hero Section
    'home.hero.title': 'اشتري الإطارات عبر الإنترنت',
    'home.hero.subtitle': 'أسهل طريقة لشراء وتركيب الإطارات عبر الإنترنت، في أي مكان في الإمارات.',
    'home.hero.brands': 'أكثر من 60 علامة تجارية للإطارات المعتمدة',
    'home.hero.search_placeholder': 'البحث عن الإطارات حسب الحجم أو المركبة',
    // Search Widget Translations
    'home.search.by_size': 'حسب حجم الإطار',
    'home.search.by_product_name': 'حسب اسم المنتج',
    'home.search.size_placeholder': 'البحث عن الإطارات حسب الحجم',
    'home.search.product_name_placeholder': 'مثال: ميشلان برايمسي 4',
    'search': 'بحث',
    // HomePage - Step-by-Step
    'home.steps.title': 'كيفية شراء إطار',
    'home.steps.1.title': 'الخطوة 1: ابحث عن حجم إطارك',
    'home.steps.2.title': 'الخطوة 2: اختر موديل الإطار',
    'home.steps.3.title': 'الخطوة 3: أضف إلى السلة',
    'home.steps.4.title': 'الخطوة 4: الدفع',
    'home.steps.5.title': 'الخطوة 5: حجز التركيب',
    // HomePage - Accessories Promo
    'home.accessories.title': 'اكتشف الإكسسوارات الفاخرة',
    'home.accessories.subtitle': 'نحن نقدم كل شيء من المصدات ونشات الرفع إلى الإضاءة والمعدات الداخلية. قم بتخصيص وحماية سيارتك من خلال إكسسواراتنا المختارة بعناية',
    'home.accessories.button': 'تسوق الإكسسوارات',
    'home.accessories.drivetrain': 'نظام الدفع',
    'home.accessories.engine': 'أداء المحرك',
    'home.accessories.exterior': 'الخارجي',
    'home.accessories.suspension': 'التعليق',
    // HomePage - Services Section
    'home.services.title': 'اشتري الإطارات عبر الإنترنت',
    'home.services.subtitle': 'أسهل طريقة لشراء وتركيب الإطارات عبر الإنترنت، في أي مكان في الإمارات',
    'home.services.buy.title': 'شراء الإطارات',
    'home.services.buy.desc': 'خيارات دفع سهلة وآمنة.',
    'home.services.fitment.title': 'تركيب الإطارات',
    'home.services.fitment.desc': 'اختر مراكز التركيب الشريكة أو احصل على خدمة فان التركيب المتنقلة.',
    'home.services.shop.title': 'تسوق الإطارات',
    'home.services.shop.desc': 'ابحث حسب حجم الإطار أو تفاصيل السيارة، حدد الكمية وأضف إلى السلة.',
    // HomePage - Brands Sections
    'home.brands.title': 'العلامات التجارية المعتمدة للإطارات',
    'home.brands.subtitle': 'لدينا علامات تجارية لكل ذوق واحتياج. من العلامات التجارية العالمية المرموقة والحائزة على جوائز والمبتكرة إلى الوافدين الجدد الذين يصنعون بصمتهم.',
    'home.brands.button': 'شاهد جميع العلامات التجارية',
    'home.cars.title': 'الإطارات المناسبة لسيارتك',
    'home.cars.subtitle': 'هل تبحث عن الإطارات المثالية لسيارتك؟ لقد قمنا بتغطيتك! تصفح مجموعتنا الواسعة من الإطارات لمعظم الماركات والموديلات لتجد المقاس المثالي لسيارتك.',
    'home.cars.button': 'جميع ماركات السيارات',
    // HomePage - Location & Blog
    'home.locations.title': 'تجدنا هنا',
    'home.locations.button': 'احصل على الاتجاهات',
    'home.blog.title': 'مدونة TYRESONLINE',
    'home.blog.subtitle': 'كل ما تحتاج لمعرفته عن الإطارات وكل ما يتعلق بالسيارات.',
    'home.blog.button': 'جميع المشاركات',
    // Product Detail Page Translations
    'product.back_to_all': 'العودة إلى جميع الإطارات',
    'product.info_title': 'معلومات المنتج',
    'product.name': 'اسم المنتج',
    'product.origin': 'المنشأ',
    'product.sku': 'رمز المنتج',
    'product.in_stock': 'متوفر في المخزون',
    'product.out_of_stock': 'غير متوفر في المخزون',
    'product.set_of_1': 'طقم من 1',
    'product.vat_included': 'جميع الأسعار شاملة ضريبة القيمة المضافة',
    'product.quantity': 'الكمية',
    'product.items_available': 'العناصر المتاحة',
    'product.add_to_cart': 'أضف إلى السلة',
    'product.pay_in_installments': 'ادفع على 4 دفعات',
    'product.description_title': 'وصف المنتج',
    'product.specifications_title': 'المواصفات',
    'product.warranty': 'الضمان',
    'product.year': 'السنة',
    'product.speed_rating': 'معدل السرعة',
    'product.load_index': 'مؤشر الحمولة',
    'product.oem': 'المصنع الأصلي',
    'product.fitment_options': 'خيارات التركيب',
    'product.partner_centers': 'مركز تركيب شريك',
    'product.partner_centers_desc': 'اختر أحد مراكزنا الشريكة',
    'product.home_service': 'خدمة منزلية',
    'product.home_service_desc': 'نصل إليك (50 درهمًا إماراتيًا)',
    'product.van_service': 'شاحنة متنقلة',
    'product.van_service_desc': 'دبي فقط (80 درهمًا إماراتيًا)',
    'product.related_products': 'منتجات ذات صلة',
    'product.not_found': 'المنتج غير موجود',
    'product.not_exist': 'المنتج الذي تبحث عنه غير موجود.',
    'product.view_cart': 'عرض السلة',
    'product.pay_installments': 'ادفع بالتقسيط.',
    'product.added_to_cart': 'أضيف إلى السلة',
    'product.added_to_cart_desc': 'تمت إضافته إلى سلتك.',
    'product.run_flat': 'تشغيل مسطح',
    'product.category': 'الفئة',
    'product.set_of_1_each': 'مجموعة من 1، لكل منها',
    'product.aed': 'د.إ',
    // Cart Page Translations
    'cart.shopping_cart': 'سلة التسوق',
    'cart.continue_shopping': 'متابعة التسوق',
    'cart.empty_cart_message': 'عربة التسوق فارغة حاليًا.',
    'cart.item': 'العنصر',
    'cart.price': 'السعر',
    'cart.qty': 'الكمية',
    'cart.item_total': 'إجمالي العناصر',
    'cart.with_fitment_question': 'مع التركيب؟',
    'cart.yes': 'نعم',
    'cart.no': 'لا',
    'cart.with_fitment_delivery_message': 'مع التركيب - توصيل إلى موقع التركيب',
    'cart.select_fitting_location': 'تحديد موقع التركيب',
    'cart.select_mobile_van_or_garage_placeholder': 'اختر هنا، فان متنقل أو ورشة تركيب',
    'cart.vehicle_information': 'معلومات المركبة',
    'cart.vin_number': 'رقم الشاسيه (VIN)',
    'cart.enter_vin_number_placeholder': 'أدخل رقم الشاسيه',
    'cart.vehicle_plate_required': 'رقم لوحة المركبة *',
    'cart.enter_vehicle_plate_placeholder': 'أدخل رقم لوحة المركبة',
    'cart.make_required': 'الصنع *',
    'cart.select_make_placeholder': 'اختر الصنع',
    'cart.model_required': 'الموديل *',
    'cart.select_model_placeholder': 'اختر الموديل',
    'cart.year_required': 'السنة *',
    'cart.select_year_placeholder': 'اختر السنة',
    'cart.discount_codes': 'رموز الخصم',
    'cart.enter_discount_code_placeholder': 'أدخل رمز الخصم الخاص بك',
    'cart.apply_button': 'تطبيق',
    'cart.summary': 'الملخص',
    'cart.items_total': 'إجمالي العناصر',
    'cart.installation_fee': 'رسوم التركيب',
    'cart.vat': 'ضريبة القيمة المضافة (5%)',
    'cart.grand_total': 'الإجمالي الكلي',
    'cart.proceed_to_checkout': 'المتابعة إلى الدفع',
    'cart.required_field': 'حقل مطلوب',
    'cart.enter_vehicle_plate_number': 'الرجاء إدخال رقم لوحة المركبة',
    'cart.select_vehicle_make': 'الرجاء اختيار نوع مركبتك',
    'cart.select_vehicle_model': 'الرجاء اختيار طراز مركبتك',
    'cart.select_vehicle_year': 'الرجاء اختيار سنة مركبتك',
    'cart.select_fitting_location_toast': 'الرجاء اختيار موقع التركيب',
    // Checkout Page Translations
    'checkout.title': 'الدفع',
    'checkout.delivery_method.title': 'طريقة التوصيل',
    'checkout.delivery_method.ship': 'الشحن إلى العنوان',
    'checkout.delivery_method.pickup': 'الاستلام من المتجر',
    'checkout.shipping_info.title': 'معلومات الشحن',
    'checkout.shipping_info.first_name': 'الاسم الأول',
    'checkout.shipping_info.first_name_placeholder': 'أدخل الاسم الأول',
    'checkout.shipping_info.last_name': 'اسم العائلة',
    'checkout.shipping_info.last_name_placeholder': 'أدخل اسم العائلة',
    'checkout.shipping_info.address1': 'العنوان 1',
    'checkout.shipping_info.address1_placeholder': 'أدخل سطر العنوان 1',
    'checkout.shipping_info.address2': 'العنوان 2',
    'checkout.shipping_info.address2_placeholder': 'أدخل سطر العنوان 2',
    'checkout.shipping_info.area': 'المنطقة',
    'checkout.shipping_info.area_placeholder': 'اختر منطقتك',
    'checkout.shipping_info.city': 'المدينة',
    'checkout.shipping_info.city_placeholder': 'اختر مدينتك',
    'checkout.pickup_info.title': 'معلومات الاستلام',
    'checkout.pickup_info.date': 'تاريخ الاستلام',
    'checkout.pickup_info.time': 'وقت الاستلام',
    'checkout.pickup_info.time_placeholder': 'اختر وقت الاستلام',
    'checkout.pickup_info.location': 'موقع الاستلام',
    'checkout.pickup_info.location_placeholder': 'اختر موقع الاستلام',
    'checkout.pickup_info.schedule_title': 'حدد موعد الاستلام الخاص بك',
    'checkout.payment.title': 'طريقة الدفع',
    'checkout.payment.card': 'بطاقة ائتمان/خصم',
    'checkout.payment.card_number': 'رقم البطاقة',
    'checkout.payment.card_number_placeholder': 'أدخل رقم البطاقة',
    'checkout.payment.expiry': 'تاريخ انتهاء الصلاحية',
    'checkout.payment.expiry_placeholder': 'شهر/سنة',
    'checkout.payment.cvv': 'CVV',
    'checkout.payment.cvv_placeholder': 'أدخل CVV',
    'checkout.payment.card_name': 'الاسم على البطاقة',
    'checkout.payment.card_name_placeholder': 'أدخل الاسم على البطاقة',
    'checkout.payment.tamara': 'تمارا',
    'checkout.payment.tamara_desc': 'ادفع على 3 أقساط بدون فوائد',
    'checkout.payment.tabby': 'تابي',
    'checkout.summary.title': 'ملخص الطلب',
    'checkout.summary.place_order_btn': 'إرسال الطلب',
    'checkout.summary.items_total': 'إجمالي العناصر',
    'checkout.summary.installation_fee': 'رسوم التركيب',
    'checkout.summary.vat': 'ضريبة القيمة المضافة',
    'checkout.summary.total': 'المجموع',
    'checkout.validation.required_field': 'هذا الحقل مطلوب.',
    'checkout.validation.first_name': 'الاسم الأول مطلوب.',
    'checkout.validation.last_name': 'اسم العائلة مطلوب.',
    'checkout.validation.address': 'العنوان مطلوب.',
    'checkout.validation.city': 'المدينة مطلوبة.',
    'checkout.validation.area': 'المنطقة مطلوبة.',
    'checkout.validation.pickup_date': 'تاريخ الاستلام مطلوب.',
    'checkout.validation.pickup_time': 'وقت الاستلام مطلوب.',
    'checkout.validation.pickup_location': 'موقع الاستلام مطلوب.',
    'checkout.validation.invalid_card': 'رقم البطاقة غير صالح.',
    'checkout.validation.card_expiry': 'تاريخ انتهاء الصلاحية غير صالح.',
    'checkout.validation.invalid_cvv': 'CVV غير صالح.',
    'checkout.validation.card_name': 'الاسم على البطاقة مطلوب.',
    'checkout.success.title': 'تم تقديم الطلب بنجاح!',
    'checkout.success.description': 'شكرًا لك على مشترياتك. تم تقديم طلبك وستتم معالجته قريبًا.',
    'services.see_all_services': 'مشاهدة جميع الخدمات',
    'services.balancing.desc': 'يضمن موازنة العجلات دورانًا سلسًا، مما يطيل عمر الإطارات ويحسن التعامل. ضروري للسلامة والراحة.',
    'services.puncture_repair.title': 'إصلاح الثقوب',
    'services.puncture_repair.desc': 'خدمات إصلاح الثقوب الاحترافية لإعادتك إلى الطريق بأمان وسرعة.',
    'tyre_brands.title': 'العلامات التجارية المعتمدة للإطارات',
    'tyre_brands.subtitle': 'لدينا علامات تجارية لكل ذوق واحتياج. من العلامات التجارية العالمية المرموقة والحائزة على جوائز والمبتكرة إلى الوافدين الجدد الذين يصنعون بصمتهم.',
    'tyre_brands.alt_text': 'شعار ماركة الإطارات',
    'tyre_brands.see_all_brands': 'شاهد جميع العلامات التجارية',
    'car_brands.title': 'الإطارات المناسبة لسيارتك',
    'car_brands.subtitle': 'هل تبحث عن الإطارات المثالية لسيارتك؟ لقد قمنا بتغطيتك! تصفح مجموعتنا الواسعة من الإطارات لمعظم الماركات والموديلات لتجد المقاس المثالي لسيارتك.',
    'car_brands.alt_text': 'شعار ماركة السيارة',
    'car_brands.see_all_brands': 'شاهد جميع العلامات التجارية',
    'car_brands.all_car_brands': 'جميع ماركات السيارات',
    'blog.title': 'مدونة TYRESONLINE',
    'blog.subtitle': 'كل ما تحتاج لمعرفته عن الإطارات وكل ما يتعلق بالسيارات.',
    'blog.post1.title': 'أهمية الصيانة الدورية للإطارات',
    'blog.post1.desc': 'تعرف على سبب أهمية الفحوصات الدورية للإطارات لسلامتك وأداء سيارتك.',
    'blog.post1.author': 'بواسطة جون دو',
    'blog.read_more': 'اقرأ المزيد',
    'blog.all_posts': 'جميع المشاركات',
    'footer.quick_links': 'روابط سريعة',
    'footer.contact_info': 'معلومات الاتصال',
    'footer.newsletter': 'النشرة الإخبارية',
    'footer.newsletter_placeholder': 'أدخل بريدك الإلكتروني',
    'footer.subscribe': 'اشترك',
    'footer.rights_reserved': 'Future Tyre Trading. جميع الحقون محفوظة {year}',
    'footer.home': 'الرئيسية',
    'footer.tyres': 'الإطارات',
    'footer.accessories': 'الإكسسوارات',
    'footer.reviews': 'التقييمات',
    'footer.contact': 'اتصل بنا',
    'footer.address': 'العنوان',
    'footer.phone': 'الهاتف',
    'footer.email': 'البريد الإلكتروني',
    'withFitment': 'مع التركيب',
    'yes': 'نعم',
    'no': 'لا',
    'fitmentDeliver': 'مع التركيب - توصيل إلى موقع التركيب',
    'selectFittingLocation': 'تحديد موقع التركيب',
    'selectFitmentGarage': 'اختر هنا، فان متنقل أو ورشة تركيب',
    'vehicleInfo': 'معلومات المركبة',
    'enterVin': 'أدخل رقم الشاسيه',
    'vehiclePlate': 'رقم لوحة المركبة',
    'enterVehiclePlate': 'أدخل رقم لوحة المركبة',
    'make': 'الصنع',
    'selectMake': 'اختر الصنع',
    'model': 'الموديل',
    'selectModel': 'اختر الموديل',
    'year': 'السنة',
    'selectYear': 'اختر السنة',
    'specialDeal': 'صفقة خاصة',
    'specialDealOffer': 'احصل على خصم 20% على جميع الإكسسوارات!',
    'home.search.by_size': 'حسب حجم الإطار',
    'home.search.by_product_name': 'حسب اسم المنتج',
    'home.search.size_placeholder': 'البحث عن الإطارات حسب الحجم',
    'home.search.product_name_placeholder': 'مثال: ميشلان برايمسي 4',
    'search': 'بحث',
    // Tyres Page Translations
    'tyresPage.shop_tyres': 'تسوق الإطارات',
    // Accessories Page Translations
    'accessories.shop_by_category': 'تسوق حسب الفئة',
    'accessories.back_to_all_categories': 'العودة إلى كل الفئات',
    'accessories.no_products_found': 'لم يتم العثور على منتجات.',
    'accessories.search_in_category_placeholder': 'ابحث في {categoryName}...',
    'accessories.category.engine_performance': 'أداء المحرك',
    'accessories.category.drivetrain': 'نظام الدفع',
    'accessories.category.suspension': 'نظام التعليق',
    'accessories.category.exterior': 'الخارجية',
    'accessories.category.interior': 'الداخلية',
    'accessories.category.rims_and_tires': 'الجنوط',
    'accessories.category.lighting': 'الإضاءة',
    'accessories.category.winches': 'الروافع',
    'accessories.category.equipment': 'المعدات',
    'accessories.category.car_care_diy': 'العناية بالسيارة - بنفسك',
    'accessories.category.car_care_professional': 'العناية بالسيارة - للمحترفين',
    'accessories.category.camping': 'التخييم',
    'accessories.multiple_categories': 'فئات متعددة',
    'accessories.select_all_categories': 'تحديد الكل',
    'accessories.products': 'المنتجات',
    'accessories.search_brands_placeholder': 'ابحث عن الماركات...',
    'search_tyre_size_placeholder': 'ابحث عن حجم الإطار، مثال: 1956515 أو 195/65 R15',
    'go_back': 'ارجع',
    'reset': 'إعادة تعيين',
    'accessory_detail.product_information': 'معلومات المنتج',
    'accessory_detail.product_name': 'اسم المنتج',
    'accessory_detail.category': 'الفئة',
    'accessory_detail.condition': 'الحالة',
    'accessory_detail.warranty': 'الضمان',
    'accessory_detail.sku': 'SKU',
    'accessory_detail.urls': 'روابط الصور',
    'accessory_detail.in_stock': 'متوفر في المخزون',
    'accessory_detail.add_to_cart': 'أضف إلى السلة',
    'accessory_detail.back_to_accessories': 'العودة إلى الإكسسوارات',
    'accessory_detail.not_found': 'الإكسسوار غير موجود',
    'accessory_detail.not_found_message': 'لم يتم العثور على الإكسسوار الذي تبحث عنه.',
    'shop_by_brand': 'تسوق حسب الماركة',
    'product': 'منتج',
    'products': 'منتجات',
  },
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: TranslationKey): string => {
    // Replace {year} placeholder with the current year
    const text = translations[language][key] || key;
    if (key === 'footer.copyright') {
      return text.replace('{year}', new Date().getFullYear().toString());
    }
    return text;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
} 
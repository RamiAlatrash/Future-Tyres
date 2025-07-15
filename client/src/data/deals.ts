import { Tyre, Accessory } from "@shared/schema";
import { staticTyres } from "./tyres";
import { allMockAccessories } from "./accessories";

export interface Deal {
  id: string;
  title: string;
  description: string;
  discountPercent: number;
  originalPrice: number;
  salePrice: number;
  imageUrl: string;
  productId: number;
  productType: 'tyre' | 'accessory';
  product: Tyre | Accessory;
  badgeText: string;
  validUntil?: string;
}

// Get tyres with promotions
const getTyreDeals = (): Deal[] => {
  const tyreDeals: Deal[] = [];
  
  // Continental tyres with 25% discount - use same logic as TyresPage
  const continentalTyres = staticTyres.filter(tyre => tyre.brand === "Continental");
  continentalTyres.forEach((tyre, index) => {
    const discountPercent = 25;
    const salePrice = Math.round(tyre.price * 0.75); // Exact same calculation as TyresPage
    const processedTyre = {
      ...tyre,
      originalPrice: tyre.price,
      price: salePrice
    };
    tyreDeals.push({
      id: `tyre-deal-${tyre.id}`,
      title: `${tyre.brand} ${tyre.name}`,
      description: `Premium ${tyre.type || 'All-Season'} tyre ${tyre.size}`,
      discountPercent,
      originalPrice: tyre.price,
      salePrice,
      imageUrl: tyre.imageUrl || '/tyre-placeholder.jpg',
      productId: tyre.id,
      productType: 'tyre',
      product: processedTyre, // Use processed tyre with correct pricing
      badgeText: `${discountPercent}% OFF`,
      validUntil: "Limited Time"
    });
  });

  // Tyres with existing promotions - use consistent pricing logic
  const promotionalTyres = staticTyres.filter(tyre => tyre.promotion && tyre.promotion !== "" && tyre.brand !== "Continental");
  promotionalTyres.forEach(tyre => {
    const discountPercent = tyre.promotion === "20% Off" ? 20 : 15; // Extract or set default discount
    const salePrice = Math.round(tyre.price * (1 - discountPercent / 100));
    const originalPrice = Math.round(tyre.price / (1 - discountPercent / 100)); // Calculate original price
    const processedTyre = {
      ...tyre,
      originalPrice: originalPrice,
      price: tyre.price // Keep current price as sale price
    };
    tyreDeals.push({
      id: `tyre-promo-${tyre.id}`,
      title: `${tyre.brand} ${tyre.name}`,
      description: `${tyre.type || 'All-Season'} tyre ${tyre.size}`,
      discountPercent,
      originalPrice: originalPrice,
      salePrice: tyre.price,
      imageUrl: tyre.imageUrl || '/tyre-placeholder.jpg',
      productId: tyre.id,
      productType: 'tyre',
      product: processedTyre,
      badgeText: tyre.promotion,
      validUntil: "Limited Time"
    });
  });

  return tyreDeals;
};

// Get accessories with discounts
const getAccessoryDeals = (): Deal[] => {
  const accessoryDeals: Deal[] = [];
  
  // Add discounts to some selected accessories
  const discountedAccessories = [
    { ...allMockAccessories[0], discount: 15 }, // Jeep Wrangler Exhaust
    { ...allMockAccessories[1], discount: 20 }, // Ford F150 Lift Kit  
    { ...allMockAccessories[2], discount: 25 }, // Toyota Tacoma Bull Bar
    { ...allMockAccessories[3], discount: 10 }, // Jeep Wrangler LED Light Bar
  ];

  discountedAccessories.forEach(accessory => {
    if (accessory.discount && accessory.discount > 0) {
      // Use the current price as sale price and calculate what original would be
      const salePrice = accessory.price;
      const originalPrice = accessory.originalPrice || Math.round(accessory.price / (1 - accessory.discount / 100));
      const processedAccessory = {
        ...accessory,
        originalPrice: originalPrice,
        price: salePrice
      };
      accessoryDeals.push({
        id: `accessory-deal-${accessory.id}`,
        title: accessory.name,
        description: `${accessory.category} - ${accessory.brand}`,
        discountPercent: accessory.discount,
        originalPrice: originalPrice,
        salePrice,
        imageUrl: accessory.imageUrl || '/accessory-placeholder.jpg',
        productId: accessory.id,
        productType: 'accessory',
        product: processedAccessory,
        badgeText: `${accessory.discount}% OFF`,
        validUntil: "Limited Time"
      });
    }
  });

  return accessoryDeals;
};

// Combined deals from both tyres and accessories
export const getCurrentDeals = (): Deal[] => {
  const tyreDeals = getTyreDeals();
  const accessoryDeals = getAccessoryDeals();
  
  // Shuffle and return a selection of deals
  const allDeals = [...tyreDeals, ...accessoryDeals];
  return allDeals.sort(() => Math.random() - 0.5); // Shuffle the deals
};

// Get deals by type
export const getTyreDealsOnly = (): Deal[] => getTyreDeals();
export const getAccessoryDealsOnly = (): Deal[] => getAccessoryDeals();

// Check if a product has a deal
export const hasActiveDeal = (productId: number, productType: 'tyre' | 'accessory'): boolean => {
  const allDeals = getCurrentDeals();
  return allDeals.some(deal => deal.productId === productId && deal.productType === productType);
};

// Get deal for a specific product
export const getDealForProduct = (productId: number, productType: 'tyre' | 'accessory'): Deal | null => {
  const allDeals = getCurrentDeals();
  return allDeals.find(deal => deal.productId === productId && deal.productType === productType) || null;
}; 
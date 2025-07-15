import {
    type Accessory,
    type CartItem,
    type ContactMessage,
    type InsertAccessory,
    type InsertCartItem,
    type InsertContactMessage,
    type InsertNewsletterSubscriber,
    type InsertReview,
    type InsertTyre,
    type InsertUser,
    type NewsletterSubscriber,
    type Review,
    type Tyre,
    type User
} from "@shared/schema";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Tyres
  getTyres(): Promise<Tyre[]>;
  getTyre(id: number): Promise<Tyre | undefined>;
  createTyre(tyre: InsertTyre): Promise<Tyre>;
  searchTyres(filters: {
    brand?: string;
    size?: string;
    type?: string;
    minPrice?: number;
    maxPrice?: number;
    search?: string;
  }): Promise<Tyre[]>;

  // Accessories
  getAccessories(): Promise<Accessory[]>;
  getAccessory(id: number): Promise<Accessory | undefined>;
  createAccessory(accessory: InsertAccessory): Promise<Accessory>;
  searchAccessories(filters: {
    brand?: string;
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    search?: string;
  }): Promise<Accessory[]>;

  // Cart
  getCartItems(sessionId: string): Promise<CartItem[]>;
  addToCart(item: InsertCartItem): Promise<CartItem>;
  updateCartItem(id: number, quantity: number): Promise<CartItem | undefined>;
  removeFromCart(id: number): Promise<boolean>;
  clearCart(sessionId: string): Promise<boolean>;



  // Reviews
  getReviews(): Promise<Review[]>;
  getReviewsByProduct(productId: number, productType: string): Promise<Review[]>;
  createReview(review: InsertReview): Promise<Review>;

  // Contact
  createContactMessage(message: InsertContactMessage): Promise<ContactMessage>;
  
  // Newsletter
  subscribeNewsletter(subscriber: InsertNewsletterSubscriber): Promise<NewsletterSubscriber>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User> = new Map();
  private tyres: Map<number, Tyre> = new Map();
  private accessories: Map<number, Accessory> = new Map();
  private cartItems: Map<number, CartItem> = new Map();

  private reviews: Map<number, Review> = new Map();
  private contactMessages: Map<number, ContactMessage> = new Map();
  private newsletterSubscribers: Map<number, NewsletterSubscriber> = new Map();
  
  private currentId = 1;

  constructor() {
    this.seedData();
  }

  private seedData() {
    // Seed tyres data
    const tyreSeedData: Omit<Tyre, 'id'>[] = [
      {
        name: "Turanza T005",
        brand: "Bridgestone",
        size: "205/55 R16",
        price: 285,
        stock: 15,
        type: "All-Season",
        loadIndex: "91V",
        speedRating: "V",
        description: "Premium all-season tyre with excellent wet grip and fuel efficiency",
        imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300",
        specifications: JSON.stringify({
          construction: "Radial",
          sidewall: "Black sidewall",
          warranty: "60,000 km"
        })
      },
      {
        name: "Pilot Sport 4",
        brand: "Michelin",
        size: "225/45 R17",
        price: 420,
        stock: 8,
        type: "Summer",
        loadIndex: "94Y",
        speedRating: "Y",
        description: "High-performance summer tyre for sports cars",
        imageUrl: "https://images.unsplash.com/photo-1580273916550-e323be2ae537?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300",
        specifications: JSON.stringify({
          construction: "Radial",
          sidewall: "Black sidewall",
          warranty: "40,000 km"
        })
      },
      {
        name: "CrossContact ATR",
        brand: "Continental",
        size: "265/70 R16",
        price: 380,
        stock: 0,
        type: "SUV/4x4",
        loadIndex: "112H",
        speedRating: "H",
        description: "All-terrain tyre for SUVs and light trucks",
        imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300",
        specifications: JSON.stringify({
          construction: "Radial",
          sidewall: "Black sidewall",
          warranty: "80,000 km"
        })
      },
      {
        name: "Eagle F1 Asymmetric 5",
        brand: "Goodyear",
        size: "235/40 R18",
        price: 450,
        stock: 12,
        type: "Summer",
        loadIndex: "95Y",
        speedRating: "Y",
        description: "Ultra high-performance summer tyre offering superb grip and handling.",
        imageUrl: "https://images.unsplash.com/photo-1621293044902-c220a8804iba?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300",
        specifications: JSON.stringify({
          construction: "Radial",
          sidewall: "Black sidewall",
          warranty: "35,000 km"
        })
      },
      {
        name: "P Zero",
        brand: "Pirelli",
        size: "245/35 R20",
        price: 620,
        stock: 7,
        type: "Summer",
        loadIndex: "95Y",
        speedRating: "Y",
        description: "The iconic P ZERO™ is the point of reference for the ultra high performance segment.",
        imageUrl: "https://images.unsplash.com/photo-1599548403346-38d8b3ea4a22?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300",
        specifications: JSON.stringify({
          construction: "Radial",
          sidewall: "Black sidewall",
          warranty: "30,000 km"
        })
      },
      {
        name: "WeatherGrip",
        brand: "Bridgestone",
        size: "215/60 R16",
        price: 320,
        stock: 20,
        type: "All-Season",
        loadIndex: "95H",
        speedRating: "H",
        description: "A reliable all-season tyre for confident wet performance.",
        imageUrl: "https://images.unsplash.com/photo-1619452354813-a7657a04911b?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300",
        specifications: JSON.stringify({
          construction: "Radial",
          sidewall: "Black sidewall",
          warranty: "105,000 km"
        })
      },
      {
        name: "Assurance WeatherReady",
        brand: "Goodyear",
        size: "195/65 R15",
        price: 290,
        stock: 25,
        type: "All-Season",
        loadIndex: "91H",
        speedRating: "H",
        description: "Our best all-weather traction, for Mother Nature's worst.",
        imageUrl: "https://images.unsplash.com/photo-1607582278337-3674e34a3666?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300",
        specifications: JSON.stringify({
          construction: "Radial",
          sidewall: "Black sidewall",
          warranty: "95,000 km"
        })
      },
      {
        name: "Cinturato P7 All Season",
        brand: "Pirelli",
        size: "225/50 R17",
        price: 390,
        stock: 18,
        type: "All-Season",
        loadIndex: "94V",
        speedRating: "V",
        description: "The high performance All Season tyre for cars and crossovers.",
        imageUrl: "https://images.unsplash.com/photo-1583121274602-3e2820c69888?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300",
        specifications: JSON.stringify({
          construction: "Radial",
          sidewall: "Black sidewall",
          warranty: "110,000 km"
        })
      },
      {
        name: "Blizzak WS90",
        brand: "Bridgestone",
        size: "215/55 R17",
        price: 350,
        stock: 14,
        type: "Winter",
        loadIndex: "94H",
        speedRating: "H",
        description: "Confident stopping power on ice for cars and minivans.",
        imageUrl: "https://images.unsplash.com/photo-1614162192795-445771c7c5a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300",
        specifications: JSON.stringify({
          construction: "Radial",
          sidewall: "Black sidewall",
          warranty: "N/A"
        })
      },
      {
        name: "WinterContact SI",
        brand: "Continental",
        size: "205/60 R16",
        price: 330,
        stock: 10,
        type: "Winter",
        loadIndex: "92H",
        speedRating: "H",
        description: "Excellent grip in cold conditions, plus enhanced traction in snow.",
        imageUrl: "https://images.unsplash.com/photo-1517581177682-a085bb7ffb73?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300",
        specifications: JSON.stringify({
          construction: "Radial",
          sidewall: "Black sidewall",
          warranty: "N/A"
        })
      }
    ];

    tyreSeedData.forEach(tyre => {
      const id = this.currentId++;
      this.tyres.set(id, { ...tyre, id });
    });

    // Seed accessories data
    const accessorySeedData: Omit<Accessory, 'id'>[] = [
      {
        name: "LED Light Bar 50\"",
        brand: "ARB",
        category: "Lighting",
        price: 850,
        stock: 5,
        material: "Aircraft-grade aluminum",
        fitment: "Universal mounting",
        warranty: "3 years",
        description: "High-intensity LED light bar for off-road adventures",
        imageUrl: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        specifications: JSON.stringify({
          power: "300W",
          lumens: "30,000",
          beamPattern: "Combo"
        })
      },
      {
        name: "Steel Front Bumper",
        brand: "TJM",
        category: "Bumpers",
        price: 2450,
        stock: 3,
        material: "4mm Steel",
        fitment: "Toyota Land Cruiser 200 Series",
        warranty: "5 years",
        description: "Heavy-duty front bumper with winch mount",
        imageUrl: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        specifications: JSON.stringify({
          weight: "65kg",
          winchCapacity: "12,000 lbs",
          finish: "Powder coated"
        })
      }
    ];

    accessorySeedData.forEach(accessory => {
      const id = this.currentId++;
      this.accessories.set(id, { ...accessory, id });
    });


  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Tyre methods
  async getTyres(): Promise<Tyre[]> {
    return Array.from(this.tyres.values());
  }

  async getTyre(id: number): Promise<Tyre | undefined> {
    return this.tyres.get(id);
  }

  async createTyre(insertTyre: InsertTyre): Promise<Tyre> {
    const id = this.currentId++;
    const tyre: Tyre = {
      stock: 0,
      loadIndex: null,
      speedRating: null,
      description: null,
      imageUrl: null,
      specifications: null,
      ...insertTyre,
      id,
    };
    this.tyres.set(id, tyre);
    return tyre;
  }

  async searchTyres(filters: {
    brand?: string;
    size?: string;
    type?: string;
    minPrice?: number;
    maxPrice?: number;
    search?: string;
  }): Promise<Tyre[]> {
    let tyres = Array.from(this.tyres.values());

    if (filters.brand) {
      tyres = tyres.filter(t => t.brand.toLowerCase().includes(filters.brand!.toLowerCase()));
    }
    if (filters.size) {
      tyres = tyres.filter(t => t.size.includes(filters.size!));
    }
    if (filters.type) {
      tyres = tyres.filter(t => t.type === filters.type);
    }
    if (filters.minPrice !== undefined) {
      tyres = tyres.filter(t => t.price >= filters.minPrice!);
    }
    if (filters.maxPrice !== undefined) {
      tyres = tyres.filter(t => t.price <= filters.maxPrice!);
    }
    if (filters.search) {
      const search = filters.search.toLowerCase();
      tyres = tyres.filter(t => 
        t.name.toLowerCase().includes(search) ||
        t.brand.toLowerCase().includes(search) ||
        t.size.toLowerCase().includes(search)
      );
    }

    return tyres;
  }

  // Accessory methods
  async getAccessories(): Promise<Accessory[]> {
    return Array.from(this.accessories.values());
  }

  async getAccessory(id: number): Promise<Accessory | undefined> {
    return this.accessories.get(id);
  }

  async createAccessory(insertAccessory: InsertAccessory): Promise<Accessory> {
    const id = this.currentId++;
    const accessory: Accessory = {
      stock: 0,
      description: null,
      imageUrl: null,
      specifications: null,
      material: null,
      fitment: null,
      warranty: null,
      ...insertAccessory,
      id,
    };
    this.accessories.set(id, accessory);
    return accessory;
  }

  async searchAccessories(filters: {
    brand?: string;
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    search?: string;
  }): Promise<Accessory[]> {
    let accessories = Array.from(this.accessories.values());

    if (filters.brand) {
      accessories = accessories.filter(a => a.brand.toLowerCase().includes(filters.brand!.toLowerCase()));
    }
    if (filters.category) {
      accessories = accessories.filter(a => a.category === filters.category);
    }
    if (filters.minPrice !== undefined) {
      accessories = accessories.filter(a => a.price >= filters.minPrice!);
    }
    if (filters.maxPrice !== undefined) {
      accessories = accessories.filter(a => a.price <= filters.maxPrice!);
    }
    if (filters.search) {
      const search = filters.search.toLowerCase();
      accessories = accessories.filter(a => 
        a.name.toLowerCase().includes(search) ||
        a.brand.toLowerCase().includes(search) ||
        a.category.toLowerCase().includes(search)
      );
    }

    return accessories;
  }

  // Cart methods
  async getCartItems(sessionId: string): Promise<CartItem[]> {
    return Array.from(this.cartItems.values()).filter(item => item.sessionId === sessionId);
  }

  async addToCart(insertItem: InsertCartItem): Promise<CartItem> {
    const id = this.currentId++;
    const item: CartItem = {
      quantity: 1,
      fitmentOption: null,
      ...insertItem,
      id,
    };
    this.cartItems.set(id, item);
    return item;
  }

  async updateCartItem(id: number, quantity: number): Promise<CartItem | undefined> {
    const item = this.cartItems.get(id);
    if (item) {
      item.quantity = quantity;
      this.cartItems.set(id, item);
      return item;
    }
    return undefined;
  }

  async removeFromCart(id: number): Promise<boolean> {
    return this.cartItems.delete(id);
  }

  async clearCart(sessionId: string): Promise<boolean> {
    const items = Array.from(this.cartItems.entries()).filter(([_, item]) => item.sessionId === sessionId);
    items.forEach(([id]) => this.cartItems.delete(id));
    return true;
  }



  // Review methods
  async getReviews(): Promise<Review[]> {
    return Array.from(this.reviews.values()).filter(review => review.isApproved);
  }

  async getReviewsByProduct(productId: number, productType: string): Promise<Review[]> {
    return Array.from(this.reviews.values()).filter(
      review => review.productId === productId && review.productType === productType && review.isApproved
    );
  }

  async createReview(insertReview: InsertReview): Promise<Review> {
    const id = this.currentId++;
    const review: Review = {
      productId: null,
      productType: null,
      ...insertReview,
      id,
      createdAt: new Date(),
      isApproved: false, // Reviews need approval
    };
    this.reviews.set(id, review);
    return review;
  }

  // Contact methods
  async createContactMessage(insertMessage: InsertContactMessage): Promise<ContactMessage> {
    const id = this.currentId++;
    const message: ContactMessage = { 
      ...insertMessage, 
      id, 
      createdAt: new Date(),
      isRead: false
    };
    this.contactMessages.set(id, message);
    return message;
  }

  // Newsletter methods
  async subscribeNewsletter(insertSubscriber: InsertNewsletterSubscriber): Promise<NewsletterSubscriber> {
    const id = this.currentId++;
    const subscriber: NewsletterSubscriber = { 
      ...insertSubscriber, 
      id, 
      subscribedAt: new Date(),
      isActive: true
    };
    this.newsletterSubscribers.set(id, subscriber);
    return subscriber;
  }
}

export const storage = new MemStorage();

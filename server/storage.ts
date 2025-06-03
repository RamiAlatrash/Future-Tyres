import { 
  users, tyres, accessories, cartItems, reviews, contactMessages, newsletterSubscribers,
  type User, type InsertUser, type Tyre, type InsertTyre, type Accessory, type InsertAccessory,
  type CartItem, type InsertCartItem, type Review, type InsertReview,
  type ContactMessage, type InsertContactMessage, type NewsletterSubscriber, type InsertNewsletterSubscriber
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
    const tyre: Tyre = { ...insertTyre, id };
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
    const accessory: Accessory = { ...insertAccessory, id };
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
    const item: CartItem = { ...insertItem, id };
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
      ...insertReview, 
      id, 
      createdAt: new Date(),
      isApproved: false // Reviews need approval
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

import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertTyreSchema, insertAccessorySchema, insertCartItemSchema, 
  insertReviewSchema, insertContactMessageSchema,
  insertNewsletterSubscriberSchema
} from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Tyres routes
  app.get("/api/tyres", async (req, res) => {
    try {
      const filters = {
        brand: req.query.brand as string,
        size: req.query.size as string,
        type: req.query.type as string,
        minPrice: req.query.minPrice ? parseFloat(req.query.minPrice as string) : undefined,
        maxPrice: req.query.maxPrice ? parseFloat(req.query.maxPrice as string) : undefined,
        search: req.query.search as string,
      };
      
      const tyres = await storage.searchTyres(filters);
      res.json(tyres);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch tyres" });
    }
  });

  app.get("/api/tyres/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const tyre = await storage.getTyre(id);
      if (!tyre) {
        return res.status(404).json({ message: "Tyre not found" });
      }
      res.json(tyre);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch tyre" });
    }
  });

  app.post("/api/tyres", async (req, res) => {
    try {
      const data = insertTyreSchema.parse(req.body);
      const tyre = await storage.createTyre(data);
      res.status(201).json(tyre);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create tyre" });
    }
  });

  // Accessories routes
  app.get("/api/accessories", async (req, res) => {
    try {
      const filters = {
        brand: req.query.brand as string,
        category: req.query.category as string,
        minPrice: req.query.minPrice ? parseFloat(req.query.minPrice as string) : undefined,
        maxPrice: req.query.maxPrice ? parseFloat(req.query.maxPrice as string) : undefined,
        search: req.query.search as string,
      };
      
      const accessories = await storage.searchAccessories(filters);
      res.json(accessories);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch accessories" });
    }
  });

  app.get("/api/accessories/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const accessory = await storage.getAccessory(id);
      if (!accessory) {
        return res.status(404).json({ message: "Accessory not found" });
      }
      res.json(accessory);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch accessory" });
    }
  });

  // Cart routes
  app.get("/api/cart/:sessionId", async (req, res) => {
    try {
      const { sessionId } = req.params;
      const items = await storage.getCartItems(sessionId);
      res.json(items);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch cart items" });
    }
  });

  app.post("/api/cart", async (req, res) => {
    try {
      const data = insertCartItemSchema.parse(req.body);
      const item = await storage.addToCart(data);
      res.status(201).json(item);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to add to cart" });
    }
  });

  app.put("/api/cart/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { quantity } = req.body;
      
      if (!quantity || quantity < 1) {
        return res.status(400).json({ message: "Invalid quantity" });
      }
      
      const item = await storage.updateCartItem(id, quantity);
      if (!item) {
        return res.status(404).json({ message: "Cart item not found" });
      }
      res.json(item);
    } catch (error) {
      res.status(500).json({ message: "Failed to update cart item" });
    }
  });

  app.delete("/api/cart/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.removeFromCart(id);
      if (!success) {
        return res.status(404).json({ message: "Cart item not found" });
      }
      res.json({ message: "Item removed from cart" });
    } catch (error) {
      res.status(500).json({ message: "Failed to remove from cart" });
    }
  });

  app.delete("/api/cart/session/:sessionId", async (req, res) => {
    try {
      const { sessionId } = req.params;
      await storage.clearCart(sessionId);
      res.json({ message: "Cart cleared" });
    } catch (error) {
      res.status(500).json({ message: "Failed to clear cart" });
    }
  });



  // Reviews routes
  app.get("/api/reviews", async (req, res) => {
    try {
      const reviews = await storage.getReviews();
      res.json(reviews);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch reviews" });
    }
  });

  app.get("/api/reviews/product/:productId/:productType", async (req, res) => {
    try {
      const productId = parseInt(req.params.productId);
      const { productType } = req.params;
      const reviews = await storage.getReviewsByProduct(productId, productType);
      res.json(reviews);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch product reviews" });
    }
  });

  app.post("/api/reviews", async (req, res) => {
    try {
      const data = insertReviewSchema.parse(req.body);
      const review = await storage.createReview(data);
      res.status(201).json(review);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create review" });
    }
  });

  // Contact routes
  app.post("/api/contact", async (req, res) => {
    try {
      const data = insertContactMessageSchema.parse(req.body);
      const message = await storage.createContactMessage(data);
      res.status(201).json(message);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to send message" });
    }
  });

  // Newsletter routes
  app.post("/api/newsletter", async (req, res) => {
    try {
      const data = insertNewsletterSubscriberSchema.parse(req.body);
      const subscriber = await storage.subscribeNewsletter(data);
      res.status(201).json(subscriber);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to subscribe to newsletter" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

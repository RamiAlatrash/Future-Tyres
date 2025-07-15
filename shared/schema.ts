import { boolean, integer, pgTable, real, serial, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const tyres = pgTable("tyres", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  brand: text("brand").notNull(),
  size: text("size").notNull(),
  price: real("price").notNull(),
  stock: integer("stock").notNull().default(0),
  type: text("type"), // All-Season, Summer, Winter, SUV/4x4
  loadIndex: text("load_index"),
  speedRating: text("speed_rating"),
  description: text("description"),
  imageUrl: text("image_url"),
  specifications: text("specifications"), // JSON string
  year: integer("year"),
  sku: text("sku"),
  brandImageUrl: text("brand_image_url"),
  oem: text("oem"),
  origin: text("origin"),
  isRunFlat: boolean("is_run_flat").default(false),
  promotion: text("promotion"),
  pattern: text("pattern"),
  warrantyPeriod: text("warranty_period"),
  performance: text("performance"),
});

export const accessories = pgTable("accessories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  brand: text("brand").notNull(),
  category: text("category").notNull(), // Bumpers, Lighting, Lift Kits, Roof Racks, Wheel Spacers
  price: real("price").notNull(),
  stock: integer("stock").notNull().default(0),
  material: text("material"),
  fitment: text("fitment"),
  warranty: text("warranty"),
  description: text("description"),
  imageUrl: text("image_url"),
  specifications: text("specifications"), // JSON string
});

export const cartItems = pgTable("cart_items", {
  id: serial("id").primaryKey(),
  sessionId: text("session_id").notNull(),
  productId: integer("product_id").notNull(),
  productType: text("product_type").notNull(), // 'tyre' or 'accessory'
  quantity: integer("quantity").notNull().default(1),
  fitmentOption: text("fitment_option"), // 'partner', 'home', 'mobile'
});

export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  rating: integer("rating").notNull(),
  comment: text("comment").notNull(),
  productId: integer("product_id"),
  productType: text("product_type"), // 'tyre', 'accessory', or null for general
  isApproved: boolean("is_approved").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const contactMessages = pgTable("contact_messages", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  isRead: boolean("is_read").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const newsletterSubscribers = pgTable("newsletter_subscribers", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  isActive: boolean("is_active").default(true),
  subscribedAt: timestamp("subscribed_at").defaultNow(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({ id: true });
export const insertTyreSchema = createInsertSchema(tyres).omit({ id: true });
export const insertAccessorySchema = createInsertSchema(accessories).omit({ id: true });
export const insertCartItemSchema = createInsertSchema(cartItems).omit({ id: true });

export const insertReviewSchema = createInsertSchema(reviews).omit({ id: true, createdAt: true, isApproved: true });
export const insertContactMessageSchema = createInsertSchema(contactMessages).omit({ id: true, createdAt: true, isRead: true });
export const insertNewsletterSubscriberSchema = createInsertSchema(newsletterSubscribers).omit({ id: true, subscribedAt: true });

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Tyre = typeof tyres.$inferSelect;
export type InsertTyre = z.infer<typeof insertTyreSchema>;

// The DB schema type for accessories
export type DbAccessory = typeof accessories.$inferSelect;

export type InsertAccessory = z.infer<typeof insertAccessorySchema>;

export type Review = typeof reviews.$inferSelect;
export type InsertReview = z.infer<typeof insertReviewSchema>;
export type ContactMessage = typeof contactMessages.$inferSelect;
export type InsertContactMessage = z.infer<typeof insertContactMessageSchema>;
export type NewsletterSubscriber = typeof newsletterSubscribers.$inferSelect;
export type InsertNewsletterSubscriber = z.infer<typeof insertNewsletterSubscriberSchema>;

export const AccessorySchema = z.object({
  id: z.number(),
  name: z.string(),
  category: z.string(),
  subCategory: z.string().nullable(),
  brand: z.string(),
  brandImageUrl: z.string().optional().nullable(),
  price: z.number(),
  originalPrice: z.number().nullable(),
  discount: z.number().nullable(),
  condition: z.string().nullable(),
  model: z.string().nullable(),
  suitableFor: z.string().nullable(),
  carType: z.string().nullable(),
  material: z.string().nullable(),
  warranty: z.string().nullable(),
  imageUrl: z.string().nullable(),
  imageUrls: z.array(z.string()).optional().nullable(),
  description: z.string().nullable(),
  sku: z.string().nullable(),
  available: z.boolean(),
  stock: z.number(),
  fitment: z.string().nullable(),
  specifications: z.string().nullable(),
});

export type Accessory = z.infer<typeof AccessorySchema>;

export interface BlogCategory {
  name: string
  slug: string
  description: string
}

export const blogCategories: BlogCategory[] = [
  {
    name: "Tyre Guides",
    slug: "tyre-guides", 
    description: "Expert advice on tyre selection, maintenance, and care"
  },
  {
    name: "Off-Road Tips",
    slug: "off-road-tips",
    description: "Essential guides for off-road adventures and vehicle preparation"
  },
  {
    name: "Maintenance",
    slug: "maintenance", 
    description: "Keep your vehicle in top condition with our maintenance guides"
  },
  {
    name: "Industry News",
    slug: "industry-news",
    description: "Latest news and trends from the automotive industry"
  }
]

export const blogTags = [
  "Tyre Safety",
  "Desert Driving", 
  "Vehicle Maintenance",
  "Off-Road",
  "UAE Driving",
  "Tyre Technology",
  "4WD Tips",
  "Winter Tyres",
  "Performance Tyres",
  "Eco Driving"
]

export const authors = [
  {
    name: "Ahmed Al-Rashid",
    role: "Senior Automotive Technician",
    bio: "With over 15 years in the automotive industry, Ahmed specializes in tyre technology and vehicle maintenance.",
    avatar: "/avatars/ahmed.jpg"
  },
  {
    name: "Sarah Johnson", 
    role: "Off-Road Specialist",
    bio: "Sarah is an experienced off-road driver and mechanical engineer who loves exploring the UAE's desert landscape.",
    avatar: "/avatars/sarah.jpg"
  },
  {
    name: "Mohammed Hassan",
    role: "Technical Writer",
    bio: "Mohammed combines his passion for cars with technical writing to create helpful guides for vehicle owners.",
    avatar: "/avatars/mohammed.jpg"
  }
]

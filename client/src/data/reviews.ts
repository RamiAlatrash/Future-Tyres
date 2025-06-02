export interface TestimonialData {
  id: string
  name: string
  rating: number
  comment: string
  date: string
  productType?: 'tyre' | 'accessory' | 'service'
  verified: boolean
}

export const featuredTestimonials: TestimonialData[] = []

export const reviewStats = {
  totalReviews: 0,
  averageRating: 0,
  ratingDistribution: {
    5: 0,
    4: 0, 
    3: 0,
    2: 0,
    1: 0
  }
}

export const commonReviewTopics = [
  "Quality",
  "Service", 
  "Installation",
  "Delivery",
  "Value for Money",
  "Product Performance",
  "Customer Support",
  "Warranty"
]

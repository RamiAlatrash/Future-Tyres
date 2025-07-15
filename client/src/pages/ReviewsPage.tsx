import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { calculateStarRating, formatDate } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Star, ThumbsDown, ThumbsUp, User } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const reviewSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  rating: z.number().min(1, "Please select a rating").max(5),
  comment: z.string().min(10, "Comment must be at least 10 characters"),
});

type ReviewFormData = z.infer<typeof reviewSchema>;

const staticReviews = [
  {
    id: 1,
    name: "John Doe",
    rating: 5,
    comment: "Excellent service and top-quality tyres. The staff was knowledgeable and helped me choose the perfect set for my SUV. The new tyres handle great in both wet and dry conditions. Highly recommended!",
    createdAt: "2024-05-20T10:00:00Z",
    product: "Michelin Pilot Sport 4",
    likes: 12,
    dislikes: 1,
  },
  {
    id: 2,
    name: "Jane Smith",
    rating: 4,
    comment: "Good prices and a decent selection. The online booking was easy, but the wait time at the fitment center was a bit long. Overall, a positive experience and the tyres are performing well.",
    createdAt: "2024-05-18T14:30:00Z",
    product: "Bridgestone Turanza T005",
    likes: 8,
    dislikes: 0,
  },
  {
    id: 3,
    name: "Ahmed Al-Mansoori",
    rating: 5,
    comment: "Fantastic customer service from start to finish. They helped me find the right all-terrain tyres for my off-road adventures. The team is professional and the quality is unmatched. Will definitely be back!",
    createdAt: "2024-05-15T09:00:00Z",
    product: "Continental CrossContact ATR",
    likes: 25,
    dislikes: 2,
  },
  { id: 4, name: "Emily Carter", rating: 5, comment: "Five stars!", createdAt: "2024-05-14T09:00:00Z", product: "Pirelli P Zero", likes: 10, dislikes: 0 },
  { id: 5, name: "Michael Brown", rating: 5, comment: "Absolutely the best.", createdAt: "2024-05-13T09:00:00Z", product: "Pirelli P Zero", likes: 15, dislikes: 0 },
  { id: 6, name: "Sarah Wilson", rating: 5, comment: "Top notch service.", createdAt: "2024-05-12T09:00:00Z", product: "Pirelli P Zero", likes: 20, dislikes: 0 },
  { id: 7, name: "David Johnson", rating: 5, comment: "So fast and reliable.", createdAt: "2024-05-11T09:00:00Z", product: "Pirelli P Zero", likes: 13, dislikes: 0 },
  { id: 8, name: "Laura Martinez", rating: 5, comment: "Impressed with the quality.", createdAt: "2024-05-10T09:00:00Z", product: "Pirelli P Zero", likes: 18, dislikes: 1 },
  { id: 9, name: "James Taylor", rating: 5, comment: "Will use again for sure.", createdAt: "2024-05-09T09:00:00Z", product: "Pirelli P Zero", likes: 22, dislikes: 0 },
  { id: 10, name: "John Doe Clone", rating: 5, comment: "Excellent service and top-quality tyres. The staff was knowledgeable and helped me choose the perfect set for my SUV. The new tyres handle great in both wet and dry conditions. Highly recommended!", createdAt: "2024-05-20T10:00:00Z", product: "Michelin Pilot Sport 4", likes: 12, dislikes: 1, },
];

export default function ReviewsPage() {
  const { t } = useLanguage();
  const [selectedRating, setSelectedRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const { toast } = useToast();
  const [reviews, setReviews] = useState(staticReviews);

  const form = useForm<ReviewFormData>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      name: "",
      email: "",
      rating: 0,
      comment: "",
    },
  });

  const onSubmit = (data: ReviewFormData) => {
    const newReview = {
      id: reviews.length + 1,
      ...data,
      createdAt: new Date().toISOString(),
      product: "General Feedback",
      likes: 0,
      dislikes: 0,
    };
    setReviews([newReview, ...reviews]);
    toast({
      title: t('reviews.thank_you'),
      description: t('reviews.submitted'),
    });
    form.reset();
    setSelectedRating(0);
  };

  // Calculate review statistics
  const totalReviews = reviews.length;
  const averageRating = totalReviews > 0 
    ? reviews.reduce((sum: number, review: any) => sum + review.rating, 0) / totalReviews 
    : 0;

  const ratingDistribution = [5, 4, 3, 2, 1].map(rating => ({
    rating,
    count: reviews.filter((review: any) => review.rating === rating).length,
    percentage: totalReviews > 0 
      ? (reviews.filter((review: any) => review.rating === rating).length / totalReviews) * 100 
      : 0
  }));

  const { fullStars, halfStar, emptyStars } = calculateStarRating(averageRating);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem><BreadcrumbLink href="/">{t('nav.home')}</BreadcrumbLink></BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem><BreadcrumbPage>{t('nav.reviews')}</BreadcrumbPage></BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Page Header */}
      <div className="text-center mb-12">
        <h1 className="font-orbitron text-4xl font-bold text-future-black mb-4">{t('reviews.title')}</h1>
        
        {/* Overall Rating */}
        <div className="flex flex-col items-center justify-center mb-4">
          <div className="flex items-center p-2 rounded-lg bg-white shadow-md">
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/800px-Google_%22G%22_logo.svg.png" alt="Google" className="w-6 h-6 mr-3" />
            <div className="text-2xl font-bold text-future-black mr-3">
              {averageRating.toFixed(1)}
            </div>
            <div className="flex text-yellow-400">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="w-6 h-6 fill-current" />
              ))}
            </div>
          </div>
          <div className="text-gray-600 mt-2">
            {t('reviews.based_on')} {totalReviews} {totalReviews === 1 ? t('reviews.based_on_singular') : t('reviews.based_on_plural')}
          </div>
        </div>

        {/* Rating Distribution */}
        <div className="max-w-md mx-auto mb-8">
          {ratingDistribution.map(({ rating, count, percentage }) => (
            <div key={rating} className="flex items-center gap-2 mb-2">
              <span className="text-sm w-8">{rating} ★</span>
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-electric-blue h-2 rounded-full transition-all duration-300"
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <span className="text-sm text-gray-600 w-8">{count}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Review Submission Form */}
        <div className="lg:col-span-1">
          <Card className="sticky top-24">
            <CardHeader><CardTitle className="font-orbitron">{t('reviews.leave_a_review')}</CardTitle></CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField control={form.control} name="name" render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('reviews.form.name')}</FormLabel>
                      <FormControl><Input placeholder={t('reviews.form.name.placeholder')} {...field} /></FormControl>
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="email" render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('reviews.form.email')}</FormLabel>
                      <FormControl><Input type="email" placeholder={t('reviews.form.email.placeholder')} {...field} /></FormControl>
                    </FormItem>
                  )} />
                  <div>
                    <Label>{t('reviews.form.rating')}</Label>
                    <div className="flex gap-1 mt-2">
                      {[1, 2, 3, 4, 5].map((rating) => (
                        <button
                          key={rating}
                          type="button"
                          className={`text-2xl transition-colors ${
                            rating <= (hoverRating || selectedRating)
                              ? "text-electric-blue"
                              : "text-gray-300"
                          }`}
                          onClick={() => {
                            setSelectedRating(rating);
                            form.setValue("rating", rating);
                          }}
                          onMouseEnter={() => setHoverRating(rating)}
                          onMouseLeave={() => setHoverRating(0)}
                        >
                          <Star className="w-8 h-8 fill-current" />
                        </button>
                      ))}
                    </div>
                    {form.formState.errors.rating && (
                      <p className="text-red-500 text-sm mt-1">
                        {form.formState.errors.rating.message}
                      </p>
                    )}
                  </div>
                  <FormField control={form.control} name="comment" render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('reviews.form.your_review')}</FormLabel>
                      <FormControl><Textarea placeholder={t('reviews.form.your_review.placeholder')} rows={4} {...field} /></FormControl>
                    </FormItem>
                  )} />
                  <Button type="submit" size="lg" className="w-full bg-electric-blue hover:bg-electric-blue-dark">
                    {t('reviews.form.button')}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>

        {/* Reviews List */}
        <div className="lg:col-span-2 space-y-6">
          {reviews.map((review) => (
            <Card key={review.id} className="overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-gray-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h4 className="font-medium text-future-black">{review.name}</h4>
                        <div className="flex items-center gap-2">
                          <div className="flex text-electric-blue">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star 
                                key={i} 
                                className={`w-4 h-4 ${i < review.rating ? 'fill-current' : ''}`} 
                              />
                            ))}
                          </div>
                          <span className="text-sm text-gray-500">
                            {formatDate(review.createdAt)}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-gray-700 mb-4 leading-relaxed">
                      {review.comment}
                    </p>
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-end text-sm text-gray-500">
                  <span>{t('reviews.helpful')}</span>
                  <Button variant="ghost" size="sm" className="ml-2">
                    <ThumbsUp className="w-4 h-4 mr-1" /> {t('reviews.yes')} ({review.likes})
                  </Button>
                  <Button variant="ghost" size="sm" className="ml-1">
                    <ThumbsDown className="w-4 h-4 mr-1" /> {t('reviews.no')} ({review.dislikes})
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

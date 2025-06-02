import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Star, ThumbsUp, ThumbsDown, User } from "lucide-react";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { formatDate, calculateStarRating } from "@/lib/utils";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

const reviewSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  rating: z.number().min(1, "Please select a rating").max(5),
  comment: z.string().min(10, "Comment must be at least 10 characters"),
});

type ReviewFormData = z.infer<typeof reviewSchema>;

export default function ReviewsPage() {
  const [selectedRating, setSelectedRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: reviews = [], isLoading } = useQuery({
    queryKey: ["/api/reviews"],
  });

  const form = useForm<ReviewFormData>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      name: "",
      email: "",
      rating: 0,
      comment: "",
    },
  });

  const createReviewMutation = useMutation({
    mutationFn: (data: ReviewFormData) => apiRequest("POST", "/api/reviews", data),
    onSuccess: () => {
      toast({
        title: "Thank you for your review!",
        description: "Your review has been submitted and is pending approval.",
      });
      form.reset();
      setSelectedRating(0);
      queryClient.invalidateQueries({ queryKey: ["/api/reviews"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to submit review. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: ReviewFormData) => {
    createReviewMutation.mutate({ ...data, rating: selectedRating });
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
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Reviews</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Page Header */}
      <div className="text-center mb-12">
        <h1 className="font-orbitron text-4xl font-bold text-future-black mb-4">Customer Reviews</h1>
        
        {/* Overall Rating */}
        <div className="flex items-center justify-center mb-4">
          <div className="flex text-electric-blue text-2xl mr-4">
            {Array.from({ length: fullStars }).map((_, i) => (
              <Star key={i} className="w-8 h-8 fill-current" />
            ))}
            {halfStar && <Star className="w-8 h-8 fill-current opacity-50" />}
            {Array.from({ length: emptyStars }).map((_, i) => (
              <Star key={i + fullStars + (halfStar ? 1 : 0)} className="w-8 h-8" />
            ))}
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-future-black">
              {averageRating.toFixed(1)}
            </div>
            <div className="text-gray-600">
              Based on {totalReviews} review{totalReviews !== 1 ? 's' : ''}
            </div>
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
            <CardHeader>
              <CardTitle className="font-orbitron">Leave a Review</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Your name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="your@email.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div>
                    <Label>Rating</Label>
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

                  <FormField
                    control={form.control}
                    name="comment"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Your Review</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Share your experience with our products and services..."
                            rows={4}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button 
                    type="submit" 
                    className="w-full bg-electric-blue hover:bg-electric-blue-dark"
                    disabled={createReviewMutation.isPending}
                  >
                    {createReviewMutation.isPending ? "Submitting..." : "Submit Review"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>

        {/* Reviews List */}
        <div className="lg:col-span-2">
          <div className="space-y-6">
            {isLoading ? (
              <div>Loading reviews...</div>
            ) : reviews.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <div className="text-gray-500 mb-4">
                    <Star className="w-16 h-16 mx-auto mb-4 opacity-30" />
                    <h3 className="text-xl font-medium mb-2">No reviews yet</h3>
                    <p>Be the first to share your experience with our products and services!</p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              reviews.map((review: any) => (
                <Card key={review.id}>
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
                        
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span>Was this review helpful?</span>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="text-electric-blue hover:text-electric-blue-dark"
                          >
                            <ThumbsUp className="w-4 h-4 mr-1" />
                            Yes
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="text-gray-500 hover:text-gray-700"
                          >
                            <ThumbsDown className="w-4 h-4 mr-1" />
                            No
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

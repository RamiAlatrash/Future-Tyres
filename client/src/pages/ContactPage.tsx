import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  subject: z.string().min(5, "Subject must be at least 5 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactFormData = z.infer<typeof contactSchema>;

export default function ContactPage() {
  const { toast } = useToast();

  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  const sendMessageMutation = useMutation({
    mutationFn: (data: ContactFormData) => apiRequest("POST", "/api/contact", data),
    onSuccess: () => {
      toast({
        title: "Message sent successfully!",
        description: "Thank you for contacting us. We'll get back to you soon.",
      });
      form.reset();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: ContactFormData) => {
    sendMessageMutation.mutate(data);
  };

  const contactInfo = [
    {
      icon: MapPin,
      title: "Address",
      content: "Sheikh Zayed Road, Dubai, UAE",
      description: "Visit our main showroom"
    },
    {
      icon: Phone,
      title: "Phone",
      content: "+971 4 123 4567",
      description: "Call us for immediate assistance"
    },
    {
      icon: Mail,
      title: "Email",
      content: "info@futuretyretrading.ae",
      description: "Send us an email anytime"
    },
    {
      icon: Clock,
      title: "Business Hours",
      content: "Mon-Fri: 8AM-8PM",
      description: "Sat: 8AM-6PM, Sun: 10AM-4PM"
    }
  ];

  const locations = [
    {
      name: "Dubai Main Branch",
      address: "Sheikh Zayed Road, Dubai",
      phone: "+971 4 123 4567",
      hours: "Mon-Sun: 8AM-8PM"
    },
    {
      name: "Abu Dhabi Branch",
      address: "Khalifa Street, Abu Dhabi",
      phone: "+971 2 234 5678",
      hours: "Mon-Sun: 8AM-8PM"
    },
    {
      name: "Sharjah Branch",
      address: "Industrial Area, Sharjah",
      phone: "+971 6 345 6789",
      hours: "Mon-Sat: 8AM-7PM"
    }
  ];

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
            <BreadcrumbPage>Contact</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Page Header */}
      <div className="text-center mb-12">
        <h1 className="font-orbitron text-4xl font-bold text-future-black mb-4">Contact Us</h1>
        <p className="text-gray-600 text-xl max-w-3xl mx-auto">
          Get in touch with our automotive experts for any questions about tyres, accessories, or services
        </p>
      </div>

      {/* Contact Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {contactInfo.map((info, index) => (
          <Card key={index} className="text-center">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-electric-blue rounded-full flex items-center justify-center mx-auto mb-4">
                <info.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-orbitron font-bold text-lg mb-2">{info.title}</h3>
              <p className="text-future-black font-medium mb-1">{info.content}</p>
              <p className="text-gray-600 text-sm">{info.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Contact Form */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="font-orbitron text-2xl">Send us a Message</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  </div>

                  <FormField
                    control={form.control}
                    name="subject"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Subject</FormLabel>
                        <FormControl>
                          <Input placeholder="What can we help you with?" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Message</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Please describe your inquiry in detail..."
                            rows={6}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button 
                    type="submit" 
                    size="lg"
                    className="w-full bg-electric-blue hover:bg-electric-blue-dark"
                    disabled={sendMessageMutation.isPending}
                  >
                    {sendMessageMutation.isPending ? "Sending..." : "Send Message"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>

        {/* Map and Locations */}
        <div className="space-y-8">
          {/* Interactive Map Placeholder */}
          <Card>
            <CardContent className="p-0">
              <div className="h-64 bg-gradient-to-br from-electric-blue to-electric-blue-dark flex items-center justify-center text-white rounded-lg">
                <div className="text-center">
                  <MapPin className="w-12 h-12 mx-auto mb-4" />
                  <h3 className="text-xl font-orbitron font-bold mb-2">Interactive Map</h3>
                  <p className="text-sm opacity-75">Click markers for location details</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Our Locations */}
          <Card>
            <CardHeader>
              <CardTitle className="font-orbitron">Our Locations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {locations.map((location, index) => (
                  <div key={index} className="border-b border-gray-200 last:border-b-0 pb-4 last:pb-0">
                    <h4 className="font-orbitron font-bold text-lg text-future-black mb-2">
                      {location.name}
                    </h4>
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-2" />
                        <span>{location.address}</span>
                      </div>
                      <div className="flex items-center">
                        <Phone className="w-4 h-4 mr-2" />
                        <span>{location.phone}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-2" />
                        <span>{location.hours}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Fitment Services */}
          <Card>
            <CardHeader>
              <CardTitle className="font-orbitron">Fitment Services</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-electric-blue rounded-full flex items-center justify-center mt-1">
                    <MapPin className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h4 className="font-medium">Partner Fitment Centers</h4>
                    <p className="text-sm text-gray-600">Professional installation at our partner locations across UAE</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-electric-blue rounded-full flex items-center justify-center mt-1">
                    <Phone className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h4 className="font-medium">Home Service</h4>
                    <p className="text-sm text-gray-600">We come to you! AED 50 delivery and installation fee</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-electric-blue rounded-full flex items-center justify-center mt-1">
                    <Mail className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h4 className="font-medium">Mobile Van Service</h4>
                    <p className="text-sm text-gray-600">Full-service mobile workshop (Dubai only) - AED 80</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

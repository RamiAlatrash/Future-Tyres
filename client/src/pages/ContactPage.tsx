import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  subject: z.string().min(5, "Subject must be at least 5 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactFormData = z.infer<typeof contactSchema>;

export default function ContactPage() {
  const { t } = useLanguage();
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
    { icon: MapPin, title: t('contact.address.title'), content: t('contact.address.content'), description: t('contact.address.desc') },
    { icon: Phone, title: t('contact.phone.title'), content: t('contact.phone.content'), description: t('contact.phone.desc') },
    { icon: Mail, title: t('contact.email.title'), content: t('contact.email.content'), description: t('contact.email.desc') },
    { icon: Clock, title: t('contact.hours.title'), content: t('contact.hours.content'), description: t('contact.hours.desc') }
  ];

  const locations = [
    { name: t('contact.locations.dubai'), address: "Sheikh Zayed Road, Dubai", phone: "+971 4 123 4567", hours: "Mon-Sun: 8AM-8PM" },
    { name: t('contact.locations.abudhabi'), address: "Khalifa Street, Abu Dhabi", phone: "+971 2 234 5678", hours: "Mon-Sun: 8AM-8PM" },
    { name: t('contact.locations.sharjah'), address: "Industrial Area, Sharjah", phone: "+971 6 345 6789", hours: "Mon-Sat: 8AM-7PM" }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem><BreadcrumbLink href="/">{t('nav.home')}</BreadcrumbLink></BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem><BreadcrumbPage>{t('nav.contact')}</BreadcrumbPage></BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Page Header */}
      <div className="text-center mb-12">
        <h1 className="font-orbitron text-4xl font-bold text-future-black mb-4">{t('contact.title')}</h1>
        <p className="text-gray-600 text-xl max-w-3xl mx-auto">{t('contact.subtitle')}</p>
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
              <CardTitle className="font-orbitron text-2xl">{t('contact.form.title')}</CardTitle>
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
                          <FormLabel>{t('contact.form.name')}</FormLabel>
                          <FormControl>
                            <Input placeholder={t('contact.form.name.placeholder')} {...field} />
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
                          <FormLabel>{t('contact.form.email')}</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder={t('contact.form.email.placeholder')} {...field} />
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
                        <FormLabel>{t('contact.form.subject')}</FormLabel>
                        <FormControl>
                          <Input placeholder={t('contact.form.subject.placeholder')} {...field} />
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
                        <FormLabel>{t('contact.form.message')}</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder={t('contact.form.message.placeholder')}
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
                    {sendMessageMutation.isPending ? t('contact.form.button.sending') : t('contact.form.button')}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>

        {/* Map and Locations */}
        <div className="space-y-8">
          {/* Our Locations */}
          <Card>
            <CardHeader>
              <CardTitle className="font-orbitron">{t('contact.locations.title')}</CardTitle>
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
        </div>
      </div>
    </div>
  );
}

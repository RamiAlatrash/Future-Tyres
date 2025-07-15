import Footer from "@/components/Footer";
import Header from "@/components/Header";
import ScrollToTop from "@/components/ScrollToTop";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import WhatsAppChat from '@/components/WhatsAppChat';
import { CartProvider } from "@/hooks/useCart";
import AccessoriesPage from "@/pages/AccessoriesPage";
import AccessoryDetailPage from "@/pages/AccessoryDetailPage";
import AdminLoginPage from "@/pages/AdminLoginPage";
import CartPage from "@/pages/CartPage";
import CheckoutPage from "@/pages/CheckoutPage";
import ContactPage from "@/pages/ContactPage";
import DealsPage from "@/pages/DealsPage";
import DealProductDetailPage from "@/pages/DealProductDetailPage";
import ForgotPasswordPage from "@/pages/ForgotPasswordPage";
import HomePage from "@/pages/HomePage";
import LoginPage from "@/pages/LoginPage";
import NotFound from "@/pages/not-found";
import ProductDetailPage from "@/pages/ProductDetailPage";
import RegisterPage from "@/pages/RegisterPage";
import ReviewsPage from "@/pages/ReviewsPage";
import SearchPage from "@/pages/SearchPage";
import TyresPage from "@/pages/TyresPage";
import { QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router } from 'react-router-dom';
import { Route, Switch } from "wouter";
import { LanguageProvider } from './contexts/LanguageContext';
import { queryClient } from "./lib/queryClient";

function AppRoutes() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <ScrollToTop />
      <main className="pt-20">
        <Switch>
          <Route path="/" component={HomePage} />
          <Route path="/tyres" component={TyresPage} />
          <Route path="/deals" component={DealsPage} />
          <Route path="/deal/:type/:id" component={DealProductDetailPage} />
          <Route path="/search" component={SearchPage} />
          <Route path="/accessories/:category?" component={AccessoriesPage} />
          <Route path="/product/:type/:id" component={ProductDetailPage} />
          <Route path="/accessory/:id" component={AccessoryDetailPage} />
          <Route path="/checkout" component={CheckoutPage} />
          <Route path="/cart" component={CartPage} />
          <Route path="/reviews" component={ReviewsPage} />
          <Route path="/contact" component={ContactPage} />
          <Route path="/login" component={LoginPage} />
          <Route path="/admin/login" component={AdminLoginPage} />
          <Route path="/register" component={RegisterPage} />
          <Route path="/forgot-password" component={ForgotPasswordPage} />
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <LanguageProvider>
      <Router>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <CartProvider>
              <AppRoutes />
          <Toaster />
          <WhatsAppChat />
        </CartProvider>
      </TooltipProvider>
    </QueryClientProvider>
      </Router>
    </LanguageProvider>
  );
}

export default App;

import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import HomePage from "@/pages/HomePage";
import TyresPage from "@/pages/TyresPage";
import AccessoriesPage from "@/pages/AccessoriesPage";
import ProductDetailPage from "@/pages/ProductDetailPage";
import BlogPage from "@/pages/BlogPage";
import ReviewsPage from "@/pages/ReviewsPage";
import ContactPage from "@/pages/ContactPage";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ShoppingCart from "@/components/ShoppingCart";
import MobileMenu from "@/components/MobileMenu";

function Router() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <MobileMenu />
      <ShoppingCart />
      
      <main className="pt-20">
        <Switch>
          <Route path="/" component={HomePage} />
          <Route path="/tyres" component={TyresPage} />
          <Route path="/accessories" component={AccessoriesPage} />
          <Route path="/product/:type/:id" component={ProductDetailPage} />
          <Route path="/blog" component={BlogPage} />
          <Route path="/reviews" component={ReviewsPage} />
          <Route path="/contact" component={ContactPage} />
          <Route component={NotFound} />
        </Switch>
      </main>
      
      <Footer />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;

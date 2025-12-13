import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Splash from "./pages/Splash";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import Orders from "./pages/Orders";
import Contact from "./pages/Contact";
import Profile from "./pages/Profile";
import Scan from "./pages/Scan";
import PriceList from "./pages/PriceList";
import Booking from "./pages/Booking";
import Location from "./pages/Location";
import Art from "./pages/Art";
import NeedThings from "./pages/NeedThings";
import Billing from "./pages/Billing";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Splash />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/home" element={<Home />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/scan" element={<Scan />} />
          <Route path="/price-list" element={<PriceList />} />
          <Route path="/booking" element={<Booking />} />
          <Route path="/location" element={<Location />} />
          <Route path="/art" element={<Art />} />
          <Route path="/need-things" element={<NeedThings />} />
          <Route path="/billing" element={<Billing />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

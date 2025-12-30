import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Splash from "./pages/Splash";
import Login from "./pages/Auth";
import Signup from "./pages/Signup";
import AdminLogin from "./pages/AdminLogin";
import DeliveryLogin from "./pages/DeliveryLogin";
import Home from "./pages/Home";
import Orders from "./pages/Orders";
import Contact from "./pages/Contact";
import Profile from "./pages/Profile";
import ProfileEdit from "./pages/ProfileEdit";
import Scan from "./pages/Scan";
import PriceList from "./pages/PriceList";
import Booking from "./pages/Booking";
import Location from "./pages/Location";
import Art from "./pages/Art";
import NeedThings from "./pages/NeedThings";
import Billing from "./pages/Billing";
import NotFound from "./pages/NotFound";
import AdminDashboard from "./pages/AdminDashboard";
import DeliveryPartnerDashboard from "./pages/DeliveryPartnerDashboard";
import Rewards from "./pages/Rewards";
import Notifications from "./pages/Notifications";
import Addresses from "./pages/Addresses";
import Privacy from "./pages/Privacy";
import Settings from "./pages/Settings";

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
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/delivery-login" element={<DeliveryLogin />} />
          <Route path="/home" element={<Home />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/profile/edit" element={<ProfileEdit />} />
          <Route path="/scan" element={<Scan />} />
          <Route path="/price-list" element={<PriceList />} />
          <Route path="/booking" element={<Booking />} />
          <Route path="/location" element={<Location />} />
          <Route path="/art" element={<Art />} />
          <Route path="/need-things" element={<NeedThings />} />
          <Route path="/billing" element={<Billing />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/delivery" element={<DeliveryPartnerDashboard />} />
          <Route path="/rewards" element={<Rewards />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/addresses" element={<Addresses />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Scan, 
  List, 
  CalendarCheck, 
  MapPin, 
  Palette, 
  Package,
  Receipt,
  User
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import AppLayout from "@/components/layout/AppLayout";

interface FeatureItem {
  icon: React.ElementType;
  label: string;
  path: string;
}

const features: FeatureItem[] = [
  { icon: Scan, label: "Scan / find", path: "/scan" },
  { icon: List, label: "Price list", path: "/price-list" },
  { icon: CalendarCheck, label: "Booking", path: "/booking" },
  { icon: MapPin, label: "Location", path: "/location" },
  { icon: Palette, label: "Art from waste", path: "/art" },
  { icon: Package, label: "Need things", path: "/need-things" },
  { icon: Receipt, label: "Billing", path: "/billing" },
];

const Home = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/login");
        return;
      }
      
      const firstName = session.user.user_metadata?.first_name || "";
      setUserName(firstName);
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        navigate("/login");
      } else {
        const firstName = session.user.user_metadata?.first_name || "";
        setUserName(firstName);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 },
    },
  };

  return (
    <AppLayout>
      {/* Header */}
      <header className="gradient-hero px-4 pt-4 pb-6 safe-top">
        <div className="flex items-center justify-between">
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            onClick={() => navigate("/profile")}
            className="w-12 h-12 rounded-xl bg-card/20 backdrop-blur-sm flex items-center justify-center border border-primary-foreground/20"
          >
            <User className="text-primary-foreground" size={24} />
          </motion.button>
          {userName && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-primary-foreground font-medium"
            >
              Hi, {userName}!
            </motion.span>
          )}
        </div>
      </header>

      {/* Main Content */}
      <div className="px-4 py-6">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-3 gap-4"
        >
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.button
                key={feature.label}
                variants={itemVariants}
                onClick={() => navigate(feature.path)}
                className="flex flex-col items-center gap-3 p-4 bg-card rounded-2xl shadow-card hover:shadow-lg transition-all duration-200 active:scale-95"
              >
                <div className="feature-icon">
                  <Icon size={24} strokeWidth={1.5} />
                </div>
                <span className="text-xs font-medium text-foreground text-center leading-tight">
                  {feature.label}
                </span>
              </motion.button>
            );
          })}
        </motion.div>

        {/* Quick Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="mt-8"
        >
          <h2 className="text-lg font-semibold text-foreground mb-4">Your Impact</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-card rounded-2xl p-4 shadow-card">
              <div className="text-2xl font-bold text-primary">0 kg</div>
              <div className="text-sm text-muted-foreground">Waste Recycled</div>
            </div>
            <div className="bg-card rounded-2xl p-4 shadow-card">
              <div className="text-2xl font-bold text-success">0 kg</div>
              <div className="text-sm text-muted-foreground">CO₂ Saved</div>
            </div>
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="mt-6"
        >
          <h2 className="text-lg font-semibold text-foreground mb-4">Recent Activity</h2>
          <div className="bg-card rounded-2xl p-6 shadow-card text-center">
            <div className="text-muted-foreground text-sm">
              No recent pickups. Schedule your first pickup!
            </div>
            <button
              onClick={() => navigate("/booking")}
              className="mt-4 px-6 py-2 rounded-xl gradient-primary text-primary-foreground font-medium text-sm"
            >
              Schedule Pickup
            </button>
          </div>
        </motion.div>
      </div>
    </AppLayout>
  );
};

export default Home;

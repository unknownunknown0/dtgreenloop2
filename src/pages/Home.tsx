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
  User,
  Leaf
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import AppLayout from "@/components/layout/AppLayout";
import greenLoopLogo from "@/assets/green-loop-logo.jpg";

interface FeatureItem {
  icon: React.ElementType;
  label: string;
  path: string;
  color: string;
}

const features: FeatureItem[] = [
  { icon: Scan, label: "Scan / find", path: "/scan", color: "from-blue-500 to-cyan-500" },
  { icon: List, label: "Price list", path: "/price-list", color: "from-green-500 to-emerald-500" },
  { icon: CalendarCheck, label: "Booking", path: "/booking", color: "from-purple-500 to-violet-500" },
  { icon: MapPin, label: "Location", path: "/location", color: "from-orange-500 to-amber-500" },
  { icon: Palette, label: "Art from waste", path: "/art", color: "from-pink-500 to-rose-500" },
  { icon: Package, label: "Need things", path: "/need-things", color: "from-teal-500 to-cyan-500" },
  { icon: Receipt, label: "Billing", path: "/billing", color: "from-indigo-500 to-blue-500" },
];

interface Stats {
  totalRecycled: number;
  co2Saved: number;
  rewardPoints: number;
  pickupCount: number;
}

const Home = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const [stats, setStats] = useState<Stats>({ totalRecycled: 0, co2Saved: 0, rewardPoints: 0, pickupCount: 0 });

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/login");
        return;
      }
      
      const firstName = session.user.user_metadata?.first_name || "";
      setUserName(firstName);

      // Fetch user stats
      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", session.user.id)
        .maybeSingle();

      const { count: pickupCount } = await supabase
        .from("pickups")
        .select("*", { count: "exact", head: true })
        .eq("user_id", session.user.id);

      setStats({
        totalRecycled: profile?.total_recycled_kg || 0,
        co2Saved: profile?.total_co2_saved_kg || 0,
        rewardPoints: profile?.reward_points || 0,
        pickupCount: pickupCount || 0,
      });
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
        staggerChildren: 0.08,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.3 },
    },
  };

  return (
    <AppLayout>
      {/* Header */}
      <header className="gradient-hero px-4 pt-4 pb-8 safe-top">
        <div className="flex items-center justify-between">
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, type: "spring" }}
            className="flex items-center gap-3"
          >
            <img 
              src={greenLoopLogo} 
              alt="Green Loop" 
              className="w-12 h-12 rounded-xl object-contain bg-card/20 backdrop-blur-sm p-1"
            />
            <div>
              <h1 className="text-lg font-bold text-primary-foreground">Green Loop</h1>
              {userName && (
                <p className="text-primary-foreground/80 text-sm">Hi, {userName}!</p>
              )}
            </div>
          </motion.div>
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            onClick={() => navigate("/profile")}
            className="w-11 h-11 rounded-xl bg-card/20 backdrop-blur-sm flex items-center justify-center border border-primary-foreground/20"
          >
            <User className="text-primary-foreground" size={22} />
          </motion.button>
        </div>
      </header>

      {/* Main Content */}
      <div className="px-4 py-5 -mt-4">
        {/* Features Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-3 gap-3"
        >
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <motion.button
                key={feature.label}
                variants={itemVariants}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate(feature.path)}
                className="flex flex-col items-center gap-2 p-4 bg-card rounded-2xl shadow-card hover:shadow-lg transition-all duration-200"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center shadow-md`}>
                  <Icon size={22} className="text-white" strokeWidth={2} />
                </div>
                <span className="text-xs font-medium text-foreground text-center leading-tight">
                  {feature.label}
                </span>
              </motion.button>
            );
          })}
        </motion.div>

        {/* Impact Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="mt-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <Leaf className="text-primary" size={20} />
            <h2 className="text-lg font-semibold text-foreground">Your Impact</h2>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl p-4 border border-primary/20">
              <div className="text-2xl font-bold text-primary">{stats.totalRecycled} kg</div>
              <div className="text-sm text-muted-foreground">Waste Recycled</div>
            </div>
            <div className="bg-gradient-to-br from-success/10 to-success/5 rounded-2xl p-4 border border-success/20">
              <div className="text-2xl font-bold text-success">{stats.co2Saved} kg</div>
              <div className="text-sm text-muted-foreground">CO₂ Saved</div>
            </div>
            <div className="bg-gradient-to-br from-warning/10 to-warning/5 rounded-2xl p-4 border border-warning/20">
              <div className="text-2xl font-bold text-warning">{stats.rewardPoints}</div>
              <div className="text-sm text-muted-foreground">Reward Points</div>
            </div>
            <div className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 rounded-2xl p-4 border border-blue-500/20">
              <div className="text-2xl font-bold text-blue-500">{stats.pickupCount}</div>
              <div className="text-sm text-muted-foreground">Total Pickups</div>
            </div>
          </div>
        </motion.div>

        {/* Quick Action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="mt-6"
        >
          <button
            onClick={() => navigate("/booking")}
            className="w-full py-4 rounded-2xl gradient-primary text-primary-foreground font-semibold text-base flex items-center justify-center gap-2 shadow-lg"
          >
            <CalendarCheck size={20} />
            Schedule a Pickup
          </button>
        </motion.div>
      </div>
    </AppLayout>
  );
};

export default Home;

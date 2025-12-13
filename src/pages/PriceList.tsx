import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { TrendingUp, Info } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import AppLayout from "@/components/layout/AppLayout";

interface WastePrice {
  id: string;
  waste_type: string;
  price_per_kg: number;
  description: string | null;
  co2_saved_per_kg: number | null;
  reward_points_per_kg: number | null;
  icon: string | null;
}

const PriceList = () => {
  const navigate = useNavigate();
  const [prices, setPrices] = useState<WastePrice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/login");
        return;
      }
      fetchPrices();
    };

    checkAuth();
  }, [navigate]);

  const fetchPrices = async () => {
    try {
      const { data, error } = await supabase
        .from("waste_prices")
        .select("*")
        .order("price_per_kg", { ascending: false });

      if (error) throw error;
      setPrices(data || []);
    } catch (error) {
      console.error("Error fetching prices:", error);
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      {/* Header */}
      <header className="gradient-hero px-4 pt-4 pb-8 safe-top">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl font-bold text-primary-foreground"
        >
          Price List
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-primary-foreground/80 text-sm mt-1"
        >
          Current rates for recyclable materials
        </motion.p>
      </header>

      {/* Content */}
      <div className="px-4 -mt-4 pb-6">
        {/* Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-primary/10 to-success/10 rounded-2xl p-4 mb-6 flex items-start gap-3"
        >
          <Info className="text-primary flex-shrink-0 mt-0.5" size={20} />
          <p className="text-sm text-muted-foreground">
            Prices may vary based on material quality and market conditions. 
            Earn bonus points for clean, sorted materials!
          </p>
        </motion.div>

        {/* Price Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-3"
        >
          {prices.map((item) => (
            <motion.div
              key={item.id}
              variants={itemVariants}
              className="bg-card rounded-2xl p-4 shadow-card"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center text-2xl">
                    {item.icon || "♻️"}
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground capitalize">
                      {item.waste_type.replace("-", " ")}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {item.description || "Recyclable material"}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 text-primary">
                    <TrendingUp size={16} />
                    <span className="text-lg font-bold">₹{item.price_per_kg}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">per kg</p>
                </div>
              </div>

              {/* Additional Info */}
              <div className="flex items-center gap-4 mt-4 pt-4 border-t border-border">
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground">CO₂ Saved</p>
                  <p className="text-sm font-medium text-success">
                    {item.co2_saved_per_kg || 0} kg/kg
                  </p>
                </div>
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground">Reward Points</p>
                  <p className="text-sm font-medium text-warning">
                    {item.reward_points_per_kg || 1} pts/kg
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {prices.length === 0 && (
          <div className="bg-card rounded-2xl p-8 shadow-card text-center">
            <p className="text-muted-foreground">No price data available</p>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default PriceList;

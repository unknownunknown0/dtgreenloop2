import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Receipt, 
  Download, 
  Calendar, 
  Package, 
  IndianRupee,
  ChevronRight,
  FileText
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import AppLayout from "@/components/layout/AppLayout";
import { format } from "date-fns";

interface Pickup {
  id: string;
  waste_type: string;
  pickup_date: string;
  status: string;
  actual_weight_kg: number | null;
  final_price: number | null;
  created_at: string;
}

const Billing = () => {
  const navigate = useNavigate();
  const [pickups, setPickups] = useState<Pickup[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalEarnings, setTotalEarnings] = useState(0);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/login");
        return;
      }
      fetchBillingHistory(session.user.id);
    };

    checkAuth();
  }, [navigate]);

  const fetchBillingHistory = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("pickups")
        .select("*")
        .eq("user_id", userId)
        .in("status", ["completed"])
        .order("pickup_date", { ascending: false });

      if (error) throw error;
      
      setPickups(data || []);
      
      // Calculate total earnings
      const total = (data || []).reduce((sum, pickup) => {
        return sum + (pickup.final_price || 0);
      }, 0);
      setTotalEarnings(total);
    } catch (error) {
      console.error("Error fetching billing:", error);
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
      <header className="gradient-hero px-4 pt-4 pb-12 safe-top">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl font-bold text-primary-foreground"
        >
          Billing
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-primary-foreground/80 text-sm mt-1"
        >
          Your earnings & transaction history
        </motion.p>
      </header>

      {/* Content */}
      <div className="px-4 -mt-8 pb-6">
        {/* Total Earnings Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-2xl p-6 shadow-card mb-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Earnings</p>
              <div className="flex items-center gap-1 mt-1">
                <IndianRupee className="text-primary" size={28} />
                <span className="text-3xl font-bold text-foreground">
                  {totalEarnings.toFixed(2)}
                </span>
              </div>
            </div>
            <div className="w-14 h-14 rounded-2xl gradient-primary flex items-center justify-center">
              <Receipt className="text-primary-foreground" size={28} />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mt-6 pt-4 border-t border-border">
            <div>
              <p className="text-xs text-muted-foreground">Completed Pickups</p>
              <p className="text-xl font-bold text-foreground">{pickups.length}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">This Month</p>
              <p className="text-xl font-bold text-success">
                ₹{pickups
                  .filter(p => {
                    const pickupDate = new Date(p.pickup_date);
                    const now = new Date();
                    return pickupDate.getMonth() === now.getMonth() && 
                           pickupDate.getFullYear() === now.getFullYear();
                  })
                  .reduce((sum, p) => sum + (p.final_price || 0), 0)
                  .toFixed(2)}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Transaction History */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">Transaction History</h2>
          <button className="text-sm text-primary font-medium flex items-center gap-1">
            <Download size={14} />
            Export
          </button>
        </div>

        {pickups.length > 0 ? (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-3"
          >
            {pickups.map((pickup) => (
              <motion.div
                key={pickup.id}
                variants={itemVariants}
                className="bg-card rounded-2xl p-4 shadow-card"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center">
                      <Package className="text-success" size={20} />
                    </div>
                    <div>
                      <h3 className="font-medium text-foreground capitalize">
                        {pickup.waste_type.replace("-", " ")}
                      </h3>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Calendar size={10} />
                        {format(new Date(pickup.pickup_date), "MMM d, yyyy")}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-success">
                      +₹{(pickup.final_price || 0).toFixed(2)}
                    </p>
                    {pickup.actual_weight_kg && (
                      <p className="text-xs text-muted-foreground">
                        {pickup.actual_weight_kg} kg
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card rounded-2xl p-8 shadow-card text-center"
          >
            <FileText className="mx-auto text-muted-foreground mb-4" size={48} />
            <h2 className="text-lg font-semibold text-foreground mb-2">
              No Transactions Yet
            </h2>
            <p className="text-muted-foreground text-sm mb-6">
              Complete your first pickup to start earning
            </p>
            <button
              onClick={() => navigate("/booking")}
              className="px-6 py-3 rounded-xl gradient-primary text-primary-foreground font-medium inline-flex items-center gap-2"
            >
              Schedule Pickup
              <ChevronRight size={18} />
            </button>
          </motion.div>
        )}
      </div>
    </AppLayout>
  );
};

export default Billing;

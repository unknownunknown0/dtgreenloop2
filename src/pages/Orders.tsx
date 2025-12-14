import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Package, Clock, CheckCircle, XCircle, Truck, Calendar } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import AppLayout from "@/components/layout/AppLayout";
import { format } from "date-fns";

interface Pickup {
  id: string;
  status: string;
  waste_type: string;
  estimated_weight_kg: number | null;
  pickup_date: string;
  pickup_time_slot: string | null;
  address: string;
  created_at: string;
}

const Orders = () => {
  const navigate = useNavigate();
  const [pickups, setPickups] = useState<Pickup[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPickups = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/login");
        return;
      }

      const { data, error } = await supabase
        .from("pickups")
        .select("*")
        .eq("user_id", session.user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching pickups:", error);
      } else {
        setPickups(data || []);
      }
      setLoading(false);
    };

    fetchPickups();

    // Real-time subscription
    const channel = supabase
      .channel("pickups-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "pickups" },
        () => fetchPickups()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [navigate]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="text-warning" size={20} />;
      case "assigned":
        return <Truck className="text-primary" size={20} />;
      case "in_progress":
        return <Package className="text-blue-500" size={20} />;
      case "completed":
        return <CheckCircle className="text-success" size={20} />;
      case "cancelled":
        return <XCircle className="text-destructive" size={20} />;
      default:
        return <Clock className="text-muted-foreground" size={20} />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-warning/10 text-warning";
      case "assigned":
        return "bg-primary/10 text-primary";
      case "in_progress":
        return "bg-blue-500/10 text-blue-500";
      case "completed":
        return "bg-success/10 text-success";
      case "cancelled":
        return "bg-destructive/10 text-destructive";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const formatStatus = (status: string) => {
    return status.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
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
          My Pickups
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-primary-foreground/80 text-sm mt-1"
        >
          Track your waste pickups
        </motion.p>
      </header>

      {/* Content */}
      <div className="px-4 -mt-4 pb-6">
        {pickups.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card rounded-2xl p-8 shadow-card text-center"
          >
            <Package className="mx-auto text-muted-foreground mb-4" size={48} />
            <h2 className="text-lg font-semibold text-foreground mb-2">
              No Pickups Yet
            </h2>
            <p className="text-muted-foreground text-sm mb-6">
              Schedule your first waste pickup to get started
            </p>
            <button
              onClick={() => navigate("/booking")}
              className="px-8 py-3 rounded-xl gradient-primary text-primary-foreground font-medium"
            >
              Schedule Pickup
            </button>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            {pickups.map((pickup, index) => (
              <motion.div
                key={pickup.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-card rounded-2xl p-4 shadow-card"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center text-2xl">
                      {pickup.waste_type === "plastics" && "🧴"}
                      {pickup.waste_type === "e-waste" && "📱"}
                      {pickup.waste_type === "metals" && "🔧"}
                      {pickup.waste_type === "organic" && "🍂"}
                      {pickup.waste_type === "sea-waste" && "🌊"}
                      {pickup.waste_type === "paper" && "📄"}
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground capitalize">
                        {pickup.waste_type.replace("-", " ")}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {pickup.estimated_weight_kg ? `${pickup.estimated_weight_kg} kg` : "Weight TBD"}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(
                      pickup.status
                    )}`}
                  >
                    {getStatusIcon(pickup.status)}
                    {formatStatus(pickup.status)}
                  </span>
                </div>

                <div className="flex items-center gap-4 text-sm text-muted-foreground pt-3 border-t border-border">
                  <div className="flex items-center gap-1">
                    <Calendar size={14} />
                    {format(new Date(pickup.pickup_date), "MMM d, yyyy")}
                  </div>
                  {pickup.pickup_time_slot && (
                    <div className="flex items-center gap-1">
                      <Clock size={14} />
                      {pickup.pickup_time_slot}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </AppLayout>
  );
};

export default Orders;

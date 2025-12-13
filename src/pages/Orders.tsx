import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Package, Clock, CheckCircle, XCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import AppLayout from "@/components/layout/AppLayout";

interface Order {
  id: string;
  status: "pending" | "scheduled" | "completed" | "cancelled";
  wasteType: string;
  estimatedWeight: string;
  pickupDate: string;
  createdAt: string;
}

const Orders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/login");
        return;
      }
      setLoading(false);
    };

    checkAuth();
  }, [navigate]);

  const getStatusIcon = (status: Order["status"]) => {
    switch (status) {
      case "pending":
        return <Clock className="text-warning" size={20} />;
      case "scheduled":
        return <Package className="text-primary" size={20} />;
      case "completed":
        return <CheckCircle className="text-success" size={20} />;
      case "cancelled":
        return <XCircle className="text-destructive" size={20} />;
    }
  };

  const getStatusColor = (status: Order["status"]) => {
    switch (status) {
      case "pending":
        return "bg-warning/10 text-warning";
      case "scheduled":
        return "bg-primary/10 text-primary";
      case "completed":
        return "bg-success/10 text-success";
      case "cancelled":
        return "bg-destructive/10 text-destructive";
    }
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
          My Orders
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
      <div className="px-4 -mt-4">
        {orders.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card rounded-2xl p-8 shadow-card text-center"
          >
            <Package className="mx-auto text-muted-foreground mb-4" size={48} />
            <h2 className="text-lg font-semibold text-foreground mb-2">
              No Orders Yet
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
            {orders.map((order, index) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-card rounded-2xl p-4 shadow-card"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-foreground">
                      {order.wasteType}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {order.estimatedWeight}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(
                      order.status
                    )}`}
                  >
                    {getStatusIcon(order.status)}
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    Pickup: {order.pickupDate}
                  </span>
                  <button className="text-primary font-medium">
                    View Details
                  </button>
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

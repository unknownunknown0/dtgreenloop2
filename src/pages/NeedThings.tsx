import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Package, Tag, Check, ShoppingBag } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import AppLayout from "@/components/layout/AppLayout";
import { useToast } from "@/hooks/use-toast";

interface NeedItem {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  category: string | null;
  price: number | null;
  quantity: number | null;
  is_available: boolean | null;
}

const NeedThings = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [items, setItems] = useState<NeedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = ["containers", "bags", "tools", "bins", "accessories"];

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/login");
        return;
      }
      fetchItems();
    };

    checkAuth();
  }, [navigate]);

  const fetchItems = async () => {
    try {
      const { data, error } = await supabase
        .from("need_things")
        .select("*")
        .eq("is_available", true)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setItems(data || []);
    } catch (error) {
      console.error("Error fetching items:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOrder = (item: NeedItem) => {
    toast({
      title: "Order Placed!",
      description: `"${item.title}" will be delivered with your next pickup`,
    });
  };

  const filteredItems = selectedCategory
    ? items.filter((item) => item.category === selectedCategory)
    : items;

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
          Need Things
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-primary-foreground/80 text-sm mt-1"
        >
          Eco-friendly supplies for your home
        </motion.p>
      </header>

      {/* Content */}
      <div className="px-4 -mt-4 pb-6">
        {/* Categories */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-2xl p-4 shadow-card mb-6"
        >
          <div className="flex gap-2 overflow-x-auto pb-2">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                !selectedCategory
                  ? "gradient-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-accent"
              }`}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap capitalize transition-all ${
                  selectedCategory === cat
                    ? "gradient-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-accent"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Info Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-r from-success/10 to-primary/10 rounded-2xl p-4 mb-6 flex items-center gap-3"
        >
          <Check className="text-success flex-shrink-0" size={20} />
          <p className="text-sm text-muted-foreground">
            Free delivery with your next scheduled pickup!
          </p>
        </motion.div>

        {/* Items Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-2 gap-4"
        >
          {filteredItems.map((item) => (
            <motion.div
              key={item.id}
              variants={itemVariants}
              className="bg-card rounded-2xl shadow-card overflow-hidden"
            >
              <div className="aspect-square bg-gradient-to-br from-muted to-accent flex items-center justify-center relative">
                {item.image_url ? (
                  <img
                    src={item.image_url}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Package size={48} className="text-muted-foreground/50" />
                )}
                {item.category && (
                  <div className="absolute top-2 left-2 px-2 py-1 rounded-lg bg-card/90 backdrop-blur-sm text-xs font-medium text-foreground capitalize flex items-center gap-1">
                    <Tag size={10} />
                    {item.category}
                  </div>
                )}
              </div>
              <div className="p-3">
                <h3 className="font-semibold text-foreground text-sm truncate">
                  {item.title}
                </h3>
                {item.description && (
                  <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                    {item.description}
                  </p>
                )}
                <div className="flex items-center justify-between mt-3">
                  {item.price ? (
                    <span className="text-lg font-bold text-primary">₹{item.price}</span>
                  ) : (
                    <span className="text-sm font-medium text-success">Free</span>
                  )}
                  <button
                    onClick={() => handleOrder(item)}
                    className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center"
                  >
                    <ShoppingBag size={16} className="text-primary-foreground" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {filteredItems.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card rounded-2xl p-8 shadow-card text-center"
          >
            <Package className="mx-auto text-muted-foreground mb-4" size={48} />
            <h2 className="text-lg font-semibold text-foreground mb-2">
              No Items Found
            </h2>
            <p className="text-muted-foreground text-sm">
              {selectedCategory
                ? "No items in this category yet"
                : "Check back soon for new items!"}
            </p>
          </motion.div>
        )}
      </div>
    </AppLayout>
  );
};

export default NeedThings;

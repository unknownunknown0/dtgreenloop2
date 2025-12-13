import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Palette, Heart, ShoppingCart, User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import AppLayout from "@/components/layout/AppLayout";
import { useToast } from "@/hooks/use-toast";

interface ArtItem {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  materials_used: string[] | null;
  is_for_sale: boolean | null;
  price: number | null;
  creator_name: string | null;
}

const Art = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [artItems, setArtItems] = useState<ArtItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/login");
        return;
      }
      fetchArtItems();
    };

    checkAuth();
  }, [navigate]);

  const fetchArtItems = async () => {
    try {
      const { data, error } = await supabase
        .from("art_items")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setArtItems(data || []);
    } catch (error) {
      console.error("Error fetching art items:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInterest = (item: ArtItem) => {
    toast({
      title: "Interest Registered!",
      description: `We'll notify you about "${item.title}"`,
    });
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
          Art from Waste
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-primary-foreground/80 text-sm mt-1"
        >
          Beautiful creations from recycled materials
        </motion.p>
      </header>

      {/* Content */}
      <div className="px-4 -mt-4 pb-6">
        {/* Featured Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl p-5 mb-6"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <Palette className="text-white" size={24} />
            </div>
            <div>
              <h2 className="font-semibold text-foreground">Support Eco Artists</h2>
              <p className="text-sm text-muted-foreground">
                Every purchase supports sustainable creativity
              </p>
            </div>
          </div>
        </motion.div>

        {/* Art Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-2 gap-4"
        >
          {artItems.map((item) => (
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
                  <Palette size={48} className="text-muted-foreground/50" />
                )}
                {item.is_for_sale && item.price && (
                  <div className="absolute top-2 right-2 px-2 py-1 rounded-lg bg-primary text-primary-foreground text-xs font-bold">
                    ₹{item.price}
                  </div>
                )}
              </div>
              <div className="p-3">
                <h3 className="font-semibold text-foreground text-sm truncate">
                  {item.title}
                </h3>
                {item.creator_name && (
                  <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                    <User size={10} />
                    {item.creator_name}
                  </p>
                )}
                {item.materials_used && item.materials_used.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {item.materials_used.slice(0, 2).map((material) => (
                      <span
                        key={material}
                        className="px-1.5 py-0.5 rounded bg-accent text-xs text-accent-foreground"
                      >
                        {material}
                      </span>
                    ))}
                  </div>
                )}
                <button
                  onClick={() => handleInterest(item)}
                  className="w-full mt-3 py-2 rounded-lg bg-accent text-accent-foreground text-xs font-medium flex items-center justify-center gap-1 hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  <Heart size={12} />
                  I'm Interested
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {artItems.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card rounded-2xl p-8 shadow-card text-center"
          >
            <Palette className="mx-auto text-muted-foreground mb-4" size={48} />
            <h2 className="text-lg font-semibold text-foreground mb-2">
              Coming Soon
            </h2>
            <p className="text-muted-foreground text-sm">
              Artists are creating beautiful pieces. Check back soon!
            </p>
          </motion.div>
        )}
      </div>
    </AppLayout>
  );
};

export default Art;

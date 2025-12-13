import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Clock, Navigation, ExternalLink } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import AppLayout from "@/components/layout/AppLayout";

interface RecyclingCompany {
  id: string;
  name: string;
  address: string | null;
  phone: string | null;
  email: string | null;
  waste_types: string[];
  latitude: number | null;
  longitude: number | null;
}

const Location = () => {
  const navigate = useNavigate();
  const [companies, setCompanies] = useState<RecyclingCompany[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/login");
        return;
      }
      fetchCompanies();
    };

    checkAuth();
  }, [navigate]);

  const fetchCompanies = async () => {
    try {
      const { data, error } = await supabase
        .from("recycling_companies")
        .select("*")
        .eq("is_active", true);

      if (error) throw error;
      setCompanies(data || []);
    } catch (error) {
      console.error("Error fetching companies:", error);
    } finally {
      setLoading(false);
    }
  };

  const openInMaps = (company: RecyclingCompany) => {
    if (company.latitude && company.longitude) {
      window.open(
        `https://www.google.com/maps?q=${company.latitude},${company.longitude}`,
        "_blank"
      );
    } else if (company.address) {
      window.open(
        `https://www.google.com/maps/search/${encodeURIComponent(company.address)}`,
        "_blank"
      );
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
          Recycling Centers
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-primary-foreground/80 text-sm mt-1"
        >
          Find centers near you
        </motion.p>
      </header>

      {/* Content */}
      <div className="px-4 -mt-4 pb-6">
        {/* Map Placeholder */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-2xl shadow-card overflow-hidden mb-6"
        >
          <div className="aspect-video bg-gradient-to-br from-primary/20 to-success/20 flex items-center justify-center relative">
            <div className="text-center">
              <Navigation size={48} className="text-primary mx-auto mb-2" />
              <p className="text-muted-foreground text-sm">Interactive map</p>
              <p className="text-xs text-muted-foreground">Tap a center below for directions</p>
            </div>
            {/* Decorative map dots */}
            <div className="absolute top-1/4 left-1/4 w-4 h-4 rounded-full bg-primary animate-pulse" />
            <div className="absolute top-1/3 right-1/3 w-3 h-3 rounded-full bg-success animate-pulse" />
            <div className="absolute bottom-1/3 left-1/2 w-4 h-4 rounded-full bg-warning animate-pulse" />
          </div>
        </motion.div>

        {/* Recycling Centers List */}
        <h2 className="text-lg font-semibold text-foreground mb-4">
          Nearby Centers ({companies.length})
        </h2>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-4"
        >
          {companies.map((company) => (
            <motion.div
              key={company.id}
              variants={itemVariants}
              className="bg-card rounded-2xl p-4 shadow-card"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground">{company.name}</h3>
                  {company.address && (
                    <p className="text-sm text-muted-foreground flex items-start gap-1 mt-1">
                      <MapPin size={14} className="mt-0.5 flex-shrink-0" />
                      {company.address}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => openInMaps(company)}
                  className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center"
                >
                  <ExternalLink size={18} className="text-primary" />
                </button>
              </div>

              {/* Waste Types */}
              {company.waste_types && company.waste_types.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {company.waste_types.map((type) => (
                    <span
                      key={type}
                      className="px-2 py-1 rounded-lg bg-accent text-xs font-medium text-accent-foreground capitalize"
                    >
                      {type.replace("-", " ")}
                    </span>
                  ))}
                </div>
              )}

              {/* Contact Info */}
              <div className="flex gap-4 pt-3 border-t border-border">
                {company.phone && (
                  <a
                    href={`tel:${company.phone}`}
                    className="flex items-center gap-1 text-sm text-primary"
                  >
                    <Phone size={14} />
                    Call
                  </a>
                )}
                {company.email && (
                  <a
                    href={`mailto:${company.email}`}
                    className="flex items-center gap-1 text-sm text-primary"
                  >
                    <Mail size={14} />
                    Email
                  </a>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {companies.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card rounded-2xl p-8 shadow-card text-center"
          >
            <MapPin className="mx-auto text-muted-foreground mb-4" size={48} />
            <h2 className="text-lg font-semibold text-foreground mb-2">
              No Centers Found
            </h2>
            <p className="text-muted-foreground text-sm">
              We're expanding our network. Check back soon!
            </p>
          </motion.div>
        )}
      </div>
    </AppLayout>
  );
};

export default Location;

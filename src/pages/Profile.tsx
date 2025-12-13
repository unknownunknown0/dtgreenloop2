import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Settings, 
  Bell, 
  Shield, 
  LogOut,
  ChevronRight,
  Award,
  Leaf
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import AppLayout from "@/components/layout/AppLayout";
import { useToast } from "@/hooks/use-toast";

const Profile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<{
    email: string;
    firstName: string;
    lastName: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/login");
        return;
      }
      
      setUser({
        email: session.user.email || "",
        firstName: session.user.user_metadata?.first_name || "",
        lastName: session.user.user_metadata?.last_name || "",
      });
      setLoading(false);
    };

    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        navigate("/login");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Logged out",
      description: "See you soon!",
    });
    navigate("/login");
  };

  const menuItems = [
    { icon: User, label: "Edit Profile", path: "/profile/edit" },
    { icon: Bell, label: "Notifications", path: "/notifications" },
    { icon: MapPin, label: "Saved Addresses", path: "/addresses" },
    { icon: Award, label: "Rewards", path: "/rewards" },
    { icon: Shield, label: "Privacy & Security", path: "/privacy" },
    { icon: Settings, label: "Settings", path: "/settings" },
  ];

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
          Profile
        </motion.h1>
      </header>

      {/* Profile Card */}
      <div className="px-4 -mt-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-2xl p-6 shadow-card"
        >
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full gradient-primary flex items-center justify-center">
              <User className="text-primary-foreground" size={32} />
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-foreground">
                {user?.firstName} {user?.lastName}
              </h2>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Mail size={14} />
                {user?.email}
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-border">
            <div className="text-center">
              <div className="text-xl font-bold text-primary">0</div>
              <div className="text-xs text-muted-foreground">Pickups</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-success">0 kg</div>
              <div className="text-xs text-muted-foreground">Recycled</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-warning">0</div>
              <div className="text-xs text-muted-foreground">Points</div>
            </div>
          </div>
        </motion.div>

        {/* Eco Impact Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-r from-success/20 to-primary/20 rounded-2xl p-4 mt-4"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-success/20 flex items-center justify-center">
              <Leaf className="text-success" size={20} />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">Your Eco Impact</p>
              <p className="text-xs text-muted-foreground">
                Start recycling to see your environmental impact!
              </p>
            </div>
          </div>
        </motion.div>

        {/* Menu Items */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card rounded-2xl mt-4 shadow-card overflow-hidden"
        >
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <button
                key={item.label}
                onClick={() => navigate(item.path)}
                className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors border-b border-border last:border-b-0"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center">
                    <Icon size={20} className="text-primary" />
                  </div>
                  <span className="font-medium text-foreground">{item.label}</span>
                </div>
                <ChevronRight size={20} className="text-muted-foreground" />
              </button>
            );
          })}
        </motion.div>

        {/* Logout Button */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 mt-6 mb-6 py-4 rounded-xl bg-destructive/10 text-destructive font-medium"
        >
          <LogOut size={20} />
          Log Out
        </motion.button>
      </div>
    </AppLayout>
  );
};

export default Profile;

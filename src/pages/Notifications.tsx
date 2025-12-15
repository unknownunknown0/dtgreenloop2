import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Bell, BellOff, Truck, Gift, AlertCircle, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface NotificationSetting {
  id: string;
  title: string;
  description: string;
  enabled: boolean;
  icon: typeof Bell;
}

const Notifications = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [settings, setSettings] = useState<NotificationSetting[]>([
    { id: "pickup", title: "Pickup Reminders", description: "Get notified before scheduled pickups", enabled: true, icon: Truck },
    { id: "rewards", title: "Reward Updates", description: "Know when you earn new points", enabled: true, icon: Gift },
    { id: "status", title: "Order Status", description: "Track your pickup progress", enabled: true, icon: CheckCircle },
    { id: "promotions", title: "Promotions", description: "Special offers and discounts", enabled: false, icon: AlertCircle },
  ]);

  const toggleSetting = (id: string) => {
    setSettings(prev => prev.map(s => 
      s.id === id ? { ...s, enabled: !s.enabled } : s
    ));
    toast({
      title: "Settings Updated",
      description: "Your notification preferences have been saved",
    });
  };

  const notifications = [
    { id: "1", title: "Pickup Completed", message: "Your plastics pickup was completed successfully", time: "2 hours ago", read: false },
    { id: "2", title: "Points Earned", message: "You earned 50 points from your last pickup", time: "5 hours ago", read: false },
    { id: "3", title: "New Reward Available", message: "You can now redeem ₹50 cashback!", time: "1 day ago", read: true },
    { id: "4", title: "Pickup Scheduled", message: "Your e-waste pickup is scheduled for tomorrow", time: "2 days ago", read: true },
  ];

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

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="gradient-hero px-4 pt-4 pb-8 safe-top">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/profile")}
            className="w-10 h-10 rounded-xl bg-card/20 backdrop-blur-sm flex items-center justify-center"
          >
            <ArrowLeft className="text-primary-foreground" size={20} />
          </button>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xl font-bold text-primary-foreground"
          >
            Notifications
          </motion.h1>
        </div>
      </header>

      <div className="px-4 -mt-4 pb-6">
        {/* Recent Notifications */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-2xl shadow-card mb-6 overflow-hidden"
        >
          <div className="p-4 border-b border-border">
            <h2 className="font-semibold text-foreground">Recent</h2>
          </div>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {notifications.map((notif) => (
              <motion.div
                key={notif.id}
                variants={itemVariants}
                className={`p-4 border-b border-border last:border-0 ${!notif.read ? 'bg-accent/30' : ''}`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-2 h-2 rounded-full mt-2 ${!notif.read ? 'bg-primary' : 'bg-muted'}`} />
                  <div className="flex-1">
                    <h3 className="font-medium text-foreground text-sm">{notif.title}</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">{notif.message}</p>
                    <p className="text-xs text-muted-foreground/60 mt-1">{notif.time}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Notification Settings */}
        <h2 className="text-lg font-semibold text-foreground mb-4">Preferences</h2>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card rounded-2xl shadow-card overflow-hidden"
        >
          {settings.map((setting, index) => {
            const Icon = setting.icon;
            return (
              <div
                key={setting.id}
                className={`p-4 flex items-center justify-between ${index < settings.length - 1 ? 'border-b border-border' : ''}`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center">
                    <Icon size={20} className="text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground text-sm">{setting.title}</h3>
                    <p className="text-xs text-muted-foreground">{setting.description}</p>
                  </div>
                </div>
                <button
                  onClick={() => toggleSetting(setting.id)}
                  className={`w-12 h-7 rounded-full transition-all ${
                    setting.enabled ? 'bg-primary' : 'bg-muted'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full bg-white shadow transition-transform ${
                    setting.enabled ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
};

export default Notifications;

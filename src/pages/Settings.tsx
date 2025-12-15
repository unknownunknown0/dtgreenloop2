import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  ArrowLeft, 
  Settings as SettingsIcon, 
  Moon, 
  Sun, 
  Globe, 
  Bell, 
  Shield, 
  HelpCircle,
  Info,
  LogOut,
  ChevronRight,
  Smartphone
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Settings = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState("English");

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Logged Out",
      description: "See you next time!",
    });
    navigate("/login");
  };

  const settingsGroups = [
    {
      title: "Preferences",
      items: [
        {
          icon: darkMode ? Moon : Sun,
          label: "Dark Mode",
          value: darkMode ? "On" : "Off",
          action: () => {
            setDarkMode(!darkMode);
            toast({ title: "Coming Soon", description: "Dark mode will be available soon" });
          },
          toggle: true
        },
        {
          icon: Globe,
          label: "Language",
          value: language,
          action: () => {
            toast({ title: "Coming Soon", description: "More languages coming soon" });
          }
        },
        {
          icon: Smartphone,
          label: "App Version",
          value: "1.0.0",
          action: null
        }
      ]
    },
    {
      title: "Account",
      items: [
        {
          icon: Bell,
          label: "Notifications",
          action: () => navigate("/notifications")
        },
        {
          icon: Shield,
          label: "Privacy & Security",
          action: () => navigate("/privacy")
        }
      ]
    },
    {
      title: "Support",
      items: [
        {
          icon: HelpCircle,
          label: "Help Center",
          action: () => navigate("/contact")
        },
        {
          icon: Info,
          label: "About",
          action: () => {
            toast({ title: "Green Loop", description: "Making recycling easy and rewarding" });
          }
        }
      ]
    }
  ];

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
            Settings
          </motion.h1>
        </div>
      </header>

      <div className="px-4 -mt-4 pb-6">
        {settingsGroups.map((group, groupIndex) => (
          <motion.div
            key={group.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: groupIndex * 0.1 }}
            className="mb-6"
          >
            <h2 className="text-sm font-semibold text-muted-foreground mb-3 px-1">
              {group.title}
            </h2>
            <div className="bg-card rounded-2xl shadow-card overflow-hidden">
              {group.items.map((item, index) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.label}
                    onClick={item.action || undefined}
                    disabled={!item.action}
                    className={`w-full p-4 flex items-center justify-between ${
                      index < group.items.length - 1 ? 'border-b border-border' : ''
                    } ${item.action ? 'hover:bg-accent/50' : ''} transition-colors`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center">
                        <Icon size={20} className="text-primary" />
                      </div>
                      <span className="font-medium text-foreground">{item.label}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {item.value && (
                        <span className="text-sm text-muted-foreground">{item.value}</span>
                      )}
                      {item.toggle ? (
                        <div className={`w-12 h-7 rounded-full transition-all ${
                          darkMode ? 'bg-primary' : 'bg-muted'
                        }`}>
                          <div className={`w-5 h-5 rounded-full bg-white shadow transition-transform mt-1 ${
                            darkMode ? 'translate-x-6' : 'translate-x-1'
                          }`} />
                        </div>
                      ) : item.action && (
                        <ChevronRight size={18} className="text-muted-foreground" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </motion.div>
        ))}

        {/* Logout Button */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          onClick={handleLogout}
          className="w-full bg-destructive/10 rounded-2xl p-4 flex items-center justify-center gap-3"
        >
          <LogOut size={20} className="text-destructive" />
          <span className="font-medium text-destructive">Log Out</span>
        </motion.button>

        {/* App Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-8"
        >
          <p className="text-sm text-muted-foreground">Green Loop v1.0.0</p>
          <p className="text-xs text-muted-foreground/60 mt-1">Made with ♻️ for a greener planet</p>
        </motion.div>
      </div>
    </div>
  );
};

export default Settings;

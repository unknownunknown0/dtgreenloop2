import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Gift, Star, Trophy, Sparkles, ChevronRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface RewardItem {
  id: string;
  title: string;
  points: number;
  description: string;
  icon: string;
}

const rewards: RewardItem[] = [
  { id: "1", title: "₹50 Cash Back", points: 500, description: "Direct bank transfer", icon: "💰" },
  { id: "2", title: "Free Pickup", points: 300, description: "Skip the queue", icon: "🚚" },
  { id: "3", title: "Eco Tote Bag", points: 800, description: "Sustainable fashion", icon: "👜" },
  { id: "4", title: "Plant a Tree", points: 200, description: "We'll plant it for you", icon: "🌳" },
  { id: "5", title: "₹100 Cash Back", points: 900, description: "Direct bank transfer", icon: "💵" },
  { id: "6", title: "Premium Membership", points: 1500, description: "1 month free", icon: "⭐" },
];

const Rewards = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [userPoints, setUserPoints] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPoints = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/login");
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("reward_points")
        .eq("user_id", session.user.id)
        .single();

      if (profile) {
        setUserPoints(profile.reward_points || 0);
      }
      setLoading(false);
    };

    fetchPoints();
  }, [navigate]);

  const handleRedeem = (reward: RewardItem) => {
    if (userPoints < reward.points) {
      toast({
        title: "Insufficient Points",
        description: `You need ${reward.points - userPoints} more points`,
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Reward Redeemed!",
      description: `${reward.title} will be processed soon`,
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
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="gradient-hero px-4 pt-4 pb-12 safe-top">
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
            Rewards
          </motion.h1>
        </div>
      </header>

      <div className="px-4 -mt-8 pb-6">
        {/* Points Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-2xl p-6 shadow-card mb-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Available Points</p>
              <div className="flex items-center gap-2 mt-1">
                <Star className="text-warning fill-warning" size={28} />
                <span className="text-3xl font-bold text-foreground">{userPoints}</span>
              </div>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-warning to-amber-500 flex items-center justify-center">
              <Trophy className="text-white" size={28} />
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-border">
            <div className="flex items-center gap-2">
              <Sparkles className="text-primary" size={16} />
              <p className="text-sm text-muted-foreground">
                Keep recycling to earn more points!
              </p>
            </div>
          </div>
        </motion.div>

        {/* Rewards List */}
        <h2 className="text-lg font-semibold text-foreground mb-4">Redeem Rewards</h2>
        
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-3"
        >
          {rewards.map((reward) => {
            const canRedeem = userPoints >= reward.points;
            return (
              <motion.div
                key={reward.id}
                variants={itemVariants}
                className="bg-card rounded-2xl p-4 shadow-card"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center text-2xl">
                    {reward.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground">{reward.title}</h3>
                    <p className="text-xs text-muted-foreground">{reward.description}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <Star className="text-warning fill-warning" size={12} />
                      <span className="text-sm font-medium text-foreground">{reward.points} pts</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleRedeem(reward)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                      canRedeem
                        ? "gradient-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    Redeem
                  </button>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* How to Earn */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-6 bg-gradient-to-r from-primary/10 to-success/10 rounded-2xl p-4"
        >
          <div className="flex items-center gap-2 mb-3">
            <Gift className="text-primary" size={20} />
            <h3 className="font-semibold text-foreground">How to Earn Points</h3>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground flex items-center gap-2">
              <ChevronRight size={14} className="text-primary" />
              1 point per kg of recyclables
            </p>
            <p className="text-sm text-muted-foreground flex items-center gap-2">
              <ChevronRight size={14} className="text-primary" />
              Bonus for e-waste: 2x points
            </p>
            <p className="text-sm text-muted-foreground flex items-center gap-2">
              <ChevronRight size={14} className="text-primary" />
              Referral bonus: 100 points
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Rewards;

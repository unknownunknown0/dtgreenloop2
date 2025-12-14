import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronUp } from "lucide-react";
import greenLoopLogo from "@/assets/green-loop-logo.jpg";

const Splash = () => {
  const navigate = useNavigate();
  const [showSwipe, setShowSwipe] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowSwipe(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleSwipe = () => {
    navigate("/login");
  };

  return (
    <div 
      className="min-h-screen gradient-hero flex flex-col items-center justify-between py-12 px-6 safe-top safe-bottom overflow-hidden"
      onClick={handleSwipe}
    >
      {/* Logo Section */}
      <div className="flex-1 flex items-center justify-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="bg-card rounded-3xl p-4 shadow-xl"
        >
          <img 
            src={greenLoopLogo} 
            alt="Green Loop Logo" 
            className="w-40 h-40 object-contain rounded-2xl"
          />
        </motion.div>
      </div>

      {/* Text Section */}
      <AnimatePresence>
        {showSwipe && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-center mb-8"
          >
            <h1 className="text-3xl font-bold text-primary-foreground mb-2">
              <span className="font-semibold">Swipe up</span>
              <span className="font-light"> to</span>
            </h1>
            <h2 className="text-3xl font-bold text-primary-foreground">
              transform waste
            </h2>
            <h2 className="text-3xl font-bold text-primary-foreground">
              into value
            </h2>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Swipe Indicator */}
      <AnimatePresence>
        {showSwipe && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="flex flex-col items-center"
          >
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              className="text-primary-foreground/90"
            >
              <ChevronUp size={32} strokeWidth={2} />
              <ChevronUp size={32} strokeWidth={2} className="-mt-4" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Splash;

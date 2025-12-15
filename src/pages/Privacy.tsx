import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Shield, Eye, Lock, FileText, UserX, ChevronRight } from "lucide-react";

const Privacy = () => {
  const navigate = useNavigate();

  const sections = [
    {
      icon: Eye,
      title: "Data We Collect",
      items: [
        "Personal information (name, email, phone)",
        "Address for pickup services",
        "Waste recycling history",
        "Device information for app functionality"
      ]
    },
    {
      icon: Lock,
      title: "How We Protect Your Data",
      items: [
        "End-to-end encryption for sensitive data",
        "Secure cloud storage with regular backups",
        "Regular security audits",
        "Access controls and authentication"
      ]
    },
    {
      icon: FileText,
      title: "How We Use Your Data",
      items: [
        "To provide waste pickup services",
        "To calculate and award reward points",
        "To improve our services",
        "To send important notifications"
      ]
    },
    {
      icon: UserX,
      title: "Your Rights",
      items: [
        "Request access to your data",
        "Request deletion of your account",
        "Opt-out of marketing communications",
        "Export your data"
      ]
    }
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
            Privacy Policy
          </motion.h1>
        </div>
      </header>

      <div className="px-4 -mt-4 pb-6">
        {/* Header Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-2xl p-5 shadow-card mb-6"
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
              <Shield className="text-primary-foreground" size={28} />
            </div>
            <div>
              <h2 className="font-semibold text-foreground">Your Privacy Matters</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Last updated: December 2024
              </p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mt-4">
            We are committed to protecting your personal information and being transparent about how we collect, use, and share your data.
          </p>
        </motion.div>

        {/* Privacy Sections */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-4"
        >
          {sections.map((section, index) => {
            const Icon = section.icon;
            return (
              <motion.div
                key={section.title}
                variants={itemVariants}
                className="bg-card rounded-2xl p-5 shadow-card"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center">
                    <Icon size={20} className="text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground">{section.title}</h3>
                </div>
                <div className="space-y-3">
                  {section.items.map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <ChevronRight size={14} className="text-primary mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-muted-foreground">{item}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Contact Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-6 bg-gradient-to-r from-primary/10 to-success/10 rounded-2xl p-5"
        >
          <h3 className="font-semibold text-foreground mb-2">Questions?</h3>
          <p className="text-sm text-muted-foreground mb-4">
            If you have any questions about our privacy policy, please contact us.
          </p>
          <button
            onClick={() => navigate("/contact")}
            className="px-4 py-2 rounded-xl gradient-primary text-primary-foreground text-sm font-medium"
          >
            Contact Support
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default Privacy;

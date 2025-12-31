import { useState } from "react";
import { motion } from "framer-motion";
import { Phone, Mail, MapPin, Send, MessageCircle } from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";
import { useToast } from "@/hooks/use-toast";

const Contact = () => {
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !email || !message) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast({
      title: "Message Sent!",
      description: "We'll get back to you soon",
    });
    
    setName("");
    setEmail("");
    setMessage("");
    setLoading(false);
  };

  const contactInfo = [
    { icon: Phone, label: "Phone", value: "+91 9876543210" },
    { icon: Mail, label: "Email", value: "support@greenloop.com" },
    { icon: MapPin, label: "Address", value: "123 Green Street, Saravanapatti" },
  ];

  return (
    <AppLayout>
      {/* Header */}
      <header className="gradient-hero px-4 pt-4 pb-8 safe-top">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl font-bold text-primary-foreground"
        >
          Contact Us
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-primary-foreground/80 text-sm mt-1"
        >
          We're here to help
        </motion.p>
      </header>

      {/* Content */}
      <div className="px-4 -mt-4 pb-6">
        {/* Contact Info Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-2xl p-4 shadow-card mb-6"
        >
          <div className="space-y-4">
            {contactInfo.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  className="flex items-center gap-4"
                >
                  <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center">
                    <Icon size={20} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">{item.label}</p>
                    <p className="text-sm font-medium text-foreground">{item.value}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Contact Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-card rounded-2xl p-6 shadow-card"
        >
          <div className="flex items-center gap-2 mb-6">
            <MessageCircle className="text-primary" size={24} />
            <h2 className="text-lg font-semibold text-foreground">Send us a message</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input-field"
              disabled={loading}
            />
            <input
              type="email"
              placeholder="Your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field"
              disabled={loading}
            />
            <textarea
              placeholder="Your message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              className="input-field resize-none"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading}
              className="btn-primary flex items-center justify-center gap-2"
            >
              <Send size={18} />
              {loading ? "Sending..." : "Send Message"}
            </button>
          </form>
        </motion.div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-6"
        >
          <h2 className="text-lg font-semibold text-foreground mb-4">
            Frequently Asked Questions
          </h2>
          <div className="space-y-3">
            {[
              { q: "How do I schedule a pickup?", a: "Go to Booking from the home screen and select your preferred date and time." },
              { q: "What types of waste do you accept?", a: "We accept plastics, e-waste, metals, organic waste, and sea waste." },
              { q: "How are rewards calculated?", a: "You earn points based on the weight and type of recyclable materials." },
            ].map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                className="bg-card rounded-xl p-4 shadow-sm"
              >
                <h3 className="font-medium text-foreground text-sm mb-1">{faq.q}</h3>
                <p className="text-xs text-muted-foreground">{faq.a}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </AppLayout>
  );
};

export default Contact;

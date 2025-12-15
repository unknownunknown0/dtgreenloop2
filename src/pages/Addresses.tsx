import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, MapPin, Plus, Home, Building, Trash2, Check, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Address {
  id: string;
  label: string;
  address: string;
  isDefault: boolean;
  icon: typeof Home;
}

const Addresses = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newAddress, setNewAddress] = useState({ label: "", address: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchAddress = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/login");
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("address")
        .eq("user_id", session.user.id)
        .single();

      if (profile?.address) {
        setAddresses([
          { id: "1", label: "Home", address: profile.address, isDefault: true, icon: Home }
        ]);
      }
      setLoading(false);
    };

    fetchAddress();
  }, [navigate]);

  const handleAddAddress = async () => {
    if (!newAddress.label || !newAddress.address) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    setSaving(true);
    
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    // If this is the first address, save it to profile
    if (addresses.length === 0) {
      await supabase
        .from("profiles")
        .update({ address: newAddress.address })
        .eq("user_id", session.user.id);
    }

    setAddresses(prev => [...prev, {
      id: Date.now().toString(),
      label: newAddress.label,
      address: newAddress.address,
      isDefault: addresses.length === 0,
      icon: newAddress.label.toLowerCase().includes("work") ? Building : Home
    }]);

    setNewAddress({ label: "", address: "" });
    setShowAddForm(false);
    setSaving(false);
    
    toast({
      title: "Address Added",
      description: "Your new address has been saved",
    });
  };

  const setAsDefault = async (id: string) => {
    const address = addresses.find(a => a.id === id);
    if (!address) return;

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    await supabase
      .from("profiles")
      .update({ address: address.address })
      .eq("user_id", session.user.id);

    setAddresses(prev => prev.map(a => ({
      ...a,
      isDefault: a.id === id
    })));

    toast({
      title: "Default Address Updated",
      description: `${address.label} is now your default address`,
    });
  };

  const deleteAddress = (id: string) => {
    setAddresses(prev => prev.filter(a => a.id !== id));
    toast({
      title: "Address Removed",
      description: "The address has been deleted",
    });
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
            My Addresses
          </motion.h1>
        </div>
      </header>

      <div className="px-4 -mt-4 pb-6">
        {/* Add New Address Button */}
        {!showAddForm && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={() => setShowAddForm(true)}
            className="w-full bg-card rounded-2xl p-4 shadow-card mb-4 flex items-center gap-3 border-2 border-dashed border-primary/30 hover:border-primary/50 transition-colors"
          >
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Plus size={20} className="text-primary" />
            </div>
            <span className="font-medium text-foreground">Add New Address</span>
          </motion.button>
        )}

        {/* Add Address Form */}
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card rounded-2xl p-5 shadow-card mb-4"
          >
            <h2 className="font-semibold text-foreground mb-4">New Address</h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-muted-foreground block mb-2">Label (e.g., Home, Work)</label>
                <input
                  type="text"
                  value={newAddress.label}
                  onChange={(e) => setNewAddress(prev => ({ ...prev, label: e.target.value }))}
                  placeholder="Home"
                  className="input-field"
                />
              </div>
              <div>
                <label className="text-sm text-muted-foreground block mb-2">Full Address</label>
                <textarea
                  value={newAddress.address}
                  onChange={(e) => setNewAddress(prev => ({ ...prev, address: e.target.value }))}
                  placeholder="Enter your complete address"
                  rows={3}
                  className="input-field resize-none"
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowAddForm(false)}
                  className="flex-1 py-3 rounded-xl border-2 border-border bg-card text-foreground font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddAddress}
                  disabled={saving}
                  className="flex-1 py-3 rounded-xl gradient-primary text-primary-foreground font-medium flex items-center justify-center gap-2"
                >
                  {saving ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <>
                      <Check size={18} />
                      Save
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Addresses List */}
        <div className="space-y-3">
          {addresses.map((addr, index) => {
            const Icon = addr.icon;
            return (
              <motion.div
                key={addr.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-card rounded-2xl p-4 shadow-card"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center">
                    <Icon size={20} className="text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-foreground">{addr.label}</h3>
                      {addr.isDefault && (
                        <span className="px-2 py-0.5 rounded-full bg-primary/10 text-xs font-medium text-primary">
                          Default
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{addr.address}</p>
                    
                    <div className="flex gap-4 mt-3">
                      {!addr.isDefault && (
                        <button
                          onClick={() => setAsDefault(addr.id)}
                          className="text-xs text-primary font-medium"
                        >
                          Set as Default
                        </button>
                      )}
                      <button
                        onClick={() => deleteAddress(addr.id)}
                        className="text-xs text-destructive font-medium flex items-center gap-1"
                      >
                        <Trash2 size={12} />
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {addresses.length === 0 && !showAddForm && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card rounded-2xl p-8 shadow-card text-center"
          >
            <MapPin className="mx-auto text-muted-foreground mb-4" size={48} />
            <h2 className="text-lg font-semibold text-foreground mb-2">No Addresses</h2>
            <p className="text-muted-foreground text-sm">
              Add your first address for faster pickups
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Addresses;

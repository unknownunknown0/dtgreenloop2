import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Package, 
  Scale,
  ChevronRight,
  Check
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import AppLayout from "@/components/layout/AppLayout";
import { useToast } from "@/hooks/use-toast";
import { format, addDays } from "date-fns";

const wasteTypes = [
  { id: "plastics", label: "Plastics", icon: "🧴" },
  { id: "e-waste", label: "E-Waste", icon: "📱" },
  { id: "metals", label: "Metals", icon: "🔧" },
  { id: "organic", label: "Organic", icon: "🍂" },
  { id: "sea-waste", label: "Sea Waste", icon: "🌊" },
  { id: "paper", label: "Paper", icon: "📄" },
];

const timeSlots = [
  "9:00 AM - 11:00 AM",
  "11:00 AM - 1:00 PM",
  "2:00 PM - 4:00 PM",
  "4:00 PM - 6:00 PM",
];

const Booking = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  
  const [step, setStep] = useState(1);
  const [selectedWasteType, setSelectedWasteType] = useState<string>(
    (location.state as any)?.wasteType || ""
  );
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState("");
  const [address, setAddress] = useState("");
  const [estimatedWeight, setEstimatedWeight] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/login");
        return;
      }
      setUserId(session.user.id);
      
      // Try to get user's saved address
      const { data: profile } = await supabase
        .from("profiles")
        .select("address")
        .eq("user_id", session.user.id)
        .single();
      
      if (profile?.address) {
        setAddress(profile.address);
      }
    };

    checkAuth();
  }, [navigate]);

  const availableDates = Array.from({ length: 7 }, (_, i) => addDays(new Date(), i + 1));

  const handleSubmit = async () => {
    if (!userId || !selectedWasteType || !selectedDate || !selectedTime || !address) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.from("pickups").insert({
        user_id: userId,
        waste_type: selectedWasteType,
        pickup_date: format(selectedDate, "yyyy-MM-dd"),
        pickup_time_slot: selectedTime,
        address: address,
        estimated_weight_kg: estimatedWeight ? parseFloat(estimatedWeight) : null,
        notes: notes || null,
        status: "pending",
      });

      if (error) throw error;

      toast({
        title: "Pickup Scheduled!",
        description: "We'll notify you when a collector is assigned",
      });
      
      navigate("/orders");
    } catch (error) {
      console.error("Booking error:", error);
      toast({
        title: "Booking Failed",
        description: "Please try again",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    if (step === 1 && !selectedWasteType) {
      toast({ title: "Select a waste type", variant: "destructive" });
      return;
    }
    if (step === 2 && (!selectedDate || !selectedTime)) {
      toast({ title: "Select date and time", variant: "destructive" });
      return;
    }
    if (step === 3 && !address) {
      toast({ title: "Enter pickup address", variant: "destructive" });
      return;
    }
    if (step < 4) setStep(step + 1);
  };

  return (
    <AppLayout>
      {/* Header */}
      <header className="gradient-hero px-4 pt-4 pb-8 safe-top">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl font-bold text-primary-foreground"
        >
          Schedule Pickup
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-primary-foreground/80 text-sm mt-1"
        >
          Book a waste collection
        </motion.p>
      </header>

      <div className="px-4 -mt-4 pb-6">
        {/* Progress Steps */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-2xl p-4 shadow-card mb-6"
        >
          <div className="flex justify-between items-center">
            {[1, 2, 3, 4].map((s) => (
              <div key={s} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                    step >= s
                      ? "gradient-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {step > s ? <Check size={16} /> : s}
                </div>
                {s < 4 && (
                  <div
                    className={`w-12 h-1 mx-1 rounded-full transition-all ${
                      step > s ? "bg-primary" : "bg-muted"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 px-1">
            <span className="text-xs text-muted-foreground">Type</span>
            <span className="text-xs text-muted-foreground">Schedule</span>
            <span className="text-xs text-muted-foreground">Address</span>
            <span className="text-xs text-muted-foreground">Confirm</span>
          </div>
        </motion.div>

        {/* Step Content */}
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="bg-card rounded-2xl p-5 shadow-card"
        >
          {/* Step 1: Waste Type */}
          {step === 1 && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Package className="text-primary" size={24} />
                <h2 className="text-lg font-semibold text-foreground">Select Waste Type</h2>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {wasteTypes.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setSelectedWasteType(type.id)}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      selectedWasteType === type.id
                        ? "border-primary bg-accent"
                        : "border-border bg-card hover:border-primary/50"
                    }`}
                  >
                    <span className="text-3xl block mb-2">{type.icon}</span>
                    <span className="text-sm font-medium text-foreground">{type.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Date & Time */}
          {step === 2 && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="text-primary" size={24} />
                <h2 className="text-lg font-semibold text-foreground">Select Date & Time</h2>
              </div>
              
              <p className="text-sm text-muted-foreground mb-3">Select Date</p>
              <div className="flex gap-2 overflow-x-auto pb-2 mb-6">
                {availableDates.map((date) => (
                  <button
                    key={date.toISOString()}
                    onClick={() => setSelectedDate(date)}
                    className={`flex-shrink-0 w-16 p-3 rounded-xl border-2 transition-all ${
                      selectedDate?.toDateString() === date.toDateString()
                        ? "border-primary bg-accent"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <p className="text-xs text-muted-foreground">{format(date, "EEE")}</p>
                    <p className="text-lg font-bold text-foreground">{format(date, "d")}</p>
                    <p className="text-xs text-muted-foreground">{format(date, "MMM")}</p>
                  </button>
                ))}
              </div>

              <p className="text-sm text-muted-foreground mb-3 flex items-center gap-2">
                <Clock size={16} />
                Select Time Slot
              </p>
              <div className="grid grid-cols-2 gap-3">
                {timeSlots.map((time) => (
                  <button
                    key={time}
                    onClick={() => setSelectedTime(time)}
                    className={`p-3 rounded-xl border-2 text-sm font-medium transition-all ${
                      selectedTime === time
                        ? "border-primary bg-accent text-primary"
                        : "border-border text-foreground hover:border-primary/50"
                    }`}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Address */}
          {step === 3 && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="text-primary" size={24} />
                <h2 className="text-lg font-semibold text-foreground">Pickup Details</h2>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-muted-foreground block mb-2">
                    Pickup Address *
                  </label>
                  <textarea
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Enter your complete address"
                    rows={3}
                    className="input-field resize-none"
                  />
                </div>

                <div>
                  <label className="text-sm text-muted-foreground block mb-2 flex items-center gap-2">
                    <Scale size={16} />
                    Estimated Weight (optional)
                  </label>
                  <input
                    type="number"
                    value={estimatedWeight}
                    onChange={(e) => setEstimatedWeight(e.target.value)}
                    placeholder="e.g., 5"
                    className="input-field"
                  />
                  <p className="text-xs text-muted-foreground mt-1">in kilograms</p>
                </div>

                <div>
                  <label className="text-sm text-muted-foreground block mb-2">
                    Additional Notes (optional)
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Any special instructions?"
                    rows={2}
                    className="input-field resize-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Confirmation */}
          {step === 4 && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Check className="text-primary" size={24} />
                <h2 className="text-lg font-semibold text-foreground">Confirm Booking</h2>
              </div>
              
              <div className="space-y-4">
                <div className="bg-accent/50 rounded-xl p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-2xl">
                      {wasteTypes.find((t) => t.id === selectedWasteType)?.icon}
                    </span>
                    <div>
                      <p className="text-sm text-muted-foreground">Waste Type</p>
                      <p className="font-semibold text-foreground capitalize">
                        {selectedWasteType.replace("-", " ")}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 mb-3">
                    <Calendar size={24} className="text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">Pickup Date</p>
                      <p className="font-semibold text-foreground">
                        {selectedDate ? format(selectedDate, "EEEE, MMMM d, yyyy") : "-"}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 mb-3">
                    <Clock size={24} className="text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">Time Slot</p>
                      <p className="font-semibold text-foreground">{selectedTime}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <MapPin size={24} className="text-primary flex-shrink-0" />
                    <div>
                      <p className="text-sm text-muted-foreground">Address</p>
                      <p className="font-medium text-foreground">{address}</p>
                    </div>
                  </div>
                  
                  {estimatedWeight && (
                    <div className="flex items-center gap-3 mt-3">
                      <Scale size={24} className="text-primary" />
                      <div>
                        <p className="text-sm text-muted-foreground">Est. Weight</p>
                        <p className="font-semibold text-foreground">{estimatedWeight} kg</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </motion.div>

        {/* Navigation Buttons */}
        <div className="flex gap-3 mt-6">
          {step > 1 && (
            <button
              onClick={() => setStep(step - 1)}
              className="flex-1 py-3.5 rounded-xl border-2 border-border bg-card text-foreground font-medium"
            >
              Back
            </button>
          )}
          
          {step < 4 ? (
            <button
              onClick={nextStep}
              className="flex-1 py-3.5 rounded-xl gradient-primary text-primary-foreground font-medium flex items-center justify-center gap-2"
            >
              Continue
              <ChevronRight size={18} />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="flex-1 py-3.5 rounded-xl gradient-primary text-primary-foreground font-medium disabled:opacity-70"
            >
              {loading ? "Booking..." : "Confirm Booking"}
            </button>
          )}
        </div>
      </div>
    </AppLayout>
  );
};

export default Booking;

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import greenLoopLogo from "@/assets/green-loop-logo.jpg";

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast({
          title: "Login Failed",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      // Check user role and redirect accordingly
      const { data: roleData } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', data.user.id)
        .single();

      toast({
        title: "Welcome back!",
        description: "Login successful",
      });

      // Redirect based on role
      if (roleData?.role === 'admin') {
        navigate("/admin");
      } else if (roleData?.role === 'delivery_partner') {
        navigate("/delivery");
      } else {
        navigate("/home");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header Section */}
      <div className="gradient-hero pt-10 pb-24 px-6 safe-top">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center"
        >
          <img 
            src={greenLoopLogo} 
            alt="Green Loop Logo" 
            className="w-24 h-24 object-contain rounded-xl mb-4"
          />
          <h1 className="text-2xl font-semibold text-primary-foreground">Hello,</h1>
          <h2 className="text-2xl font-bold text-primary-foreground">Welcome to Green Loop!</h2>
        </motion.div>
      </div>

      {/* Form Card */}
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="flex-1 bg-card -mt-8 rounded-t-[2rem] px-6 pt-8 pb-12"
      >
        {/* Drag Handle */}
        <div className="flex justify-center mb-6">
          <div className="w-12 h-1.5 bg-muted-foreground/30 rounded-full" />
        </div>

        <h3 className="text-xl font-semibold text-center text-foreground mb-8">
          Enter to your account
        </h3>

        <form onSubmit={handleLogin} className="space-y-4">
          {/* Email Input */}
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
            <input
              type="email"
              placeholder="Email or mobile number"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field pl-12"
              disabled={loading}
            />
          </div>

          {/* Password Input */}
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field pl-12 pr-12"
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {/* Forgot Password */}
          <div className="text-right">
            <Link 
              to="/forgot-password" 
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              Forgot password?
            </Link>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className="btn-primary mt-6 disabled:opacity-70"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          {/* Create Account Button */}
          <Link to="/signup">
            <button type="button" className="btn-secondary mt-3">
              Create new account
            </button>
          </Link>
        </form>

        {/* Role-based Login Options */}
        <div className="mt-6 space-y-3">
          <div className="flex items-center gap-2">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-muted-foreground">Other Login Options</span>
            <div className="flex-1 h-px bg-border" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <a href="https://dtadmingreenloop.lovable.app">
              <button
                type="button"
                className="w-full py-3 px-4 bg-gradient-to-r from-amber-500 to-orange-600 text-white text-sm font-medium rounded-xl hover:shadow-lg transition-all"
              >
                Admin Login
              </button>
            </a>
            <a href="https://delivery.greenloop.com">
              <button
                type="button"
                className="w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-sm font-medium rounded-xl hover:shadow-lg transition-all"
              >
                Partner Login
              </button>
            </a>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;

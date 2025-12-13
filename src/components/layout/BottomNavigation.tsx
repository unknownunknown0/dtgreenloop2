import { Link, useLocation } from "react-router-dom";
import { Home, ClipboardList, MessageCircle, User } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { path: "/home", icon: Home, label: "Home" },
  { path: "/orders", icon: ClipboardList, label: "Orders" },
  { path: "/contact", icon: MessageCircle, label: "Contact Us" },
  { path: "/profile", icon: User, label: "Profile" },
];

const BottomNavigation = () => {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border safe-bottom z-50">
      <div className="flex items-center justify-around py-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "bottom-nav-item flex-1",
                isActive && "active"
              )}
            >
              <Icon 
                size={22} 
                strokeWidth={isActive ? 2.5 : 2}
                className={cn(
                  "transition-colors duration-200",
                  isActive ? "text-primary" : "text-muted-foreground"
                )}
              />
              <span 
                className={cn(
                  "text-xs mt-1 font-medium transition-colors duration-200",
                  isActive ? "text-primary" : "text-muted-foreground"
                )}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNavigation;

import { useLocation } from "wouter";
import { Sparkles, Calendar, ShoppingBag, BookOpen, MessageSquare, User, LogOut, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

export function Navigation() {
  const [location, setLocation] = useLocation();
  const { isAuthenticated, isLoading } = useAuth();

  const navItems = [
    { path: "/", label: "Home", icon: Sparkles },
    { path: "/rituals", label: "Rituals", icon: Sparkles },
    { path: "/shop", label: "Shop", icon: ShoppingBag },
    { path: "/journal", label: "Journal", icon: BookOpen },
    { path: "/metamuse", label: "MetaMuse", icon: MessageSquare },
    { path: "/events", label: "Events", icon: Calendar },
    { path: "/account", label: "Account", icon: User },
  ];

  const handleAuth = () => {
    if (isAuthenticated) {
      window.location.href = "/api/logout";
    } else {
      window.location.href = "/api/login";
    }
  };

  return (
    <nav className="sticky top-0 z-50 w-full backdrop-blur-xl bg-background/80 border-b border-border shadow-lg neon-glow-subtle">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <button
            onClick={() => setLocation("/")}
            className="text-2xl font-serif font-bold text-gradient-violet cursor-pointer hover-elevate active-elevate-2 px-3 py-2 rounded-md"
            data-testid="link-home"
          >
            MetaHers Mind Spa
          </button>

          {isAuthenticated && (
            <div className="hidden md:flex items-center space-x-1">
              {navItems.slice(1).map((item) => {
                const Icon = item.icon;
                const isActive = location === item.path || 
                  (item.path !== "/" && location.startsWith(item.path));
                
                return (
                  <Button
                    key={item.path}
                    onClick={() => setLocation(item.path)}
                    variant={isActive ? "default" : "ghost"}
                    size="sm"
                    className="gap-2"
                    data-testid={`link-${item.label.toLowerCase()}`}
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </Button>
                );
              })}
              <Button
                onClick={handleAuth}
                variant="ghost"
                size="sm"
                className="gap-2 ml-2"
                data-testid="button-logout"
              >
                <LogOut className="w-4 h-4" />
                Log Out
              </Button>
            </div>
          )}

          {!isAuthenticated && !isLoading && (
            <div className="hidden md:flex items-center">
              <Button
                onClick={handleAuth}
                variant="default"
                size="sm"
                className="gap-2"
                data-testid="button-login-nav"
              >
                <LogIn className="w-4 h-4" />
                Sign In
              </Button>
            </div>
          )}

          {isAuthenticated && (
            <div className="md:hidden flex items-center">
              <select 
                className="backdrop-blur-md bg-card/50 rounded-md px-3 py-2 text-sm border border-border text-foreground"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                data-testid="select-mobile-nav"
              >
                {navItems.map((item) => (
                  <option key={item.path} value={item.path}>
                    {item.label}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

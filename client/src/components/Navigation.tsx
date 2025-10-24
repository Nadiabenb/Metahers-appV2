import { useLocation } from "wouter";
import { Sparkles, Calendar, ShoppingBag, BookOpen, MessageSquare, User, LogOut, LogIn, Newspaper, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";

export function Navigation() {
  const [location, setLocation] = useLocation();
  const { isAuthenticated, isLoading } = useAuth();

  const navItems = [
    { path: "/", label: "Home", icon: Sparkles, pro: false },
    { path: "/rituals", label: "Rituals", icon: Sparkles, pro: false },
    { path: "/glow-up", label: "Glow-Up", icon: TrendingUp, pro: true },
    { path: "/shop", label: "Shop", icon: ShoppingBag, pro: false },
    { path: "/journal", label: "Journal", icon: BookOpen, pro: false },
    { path: "/blog", label: "Blog", icon: Newspaper, pro: false },
    { path: "/metamuse", label: "MetaMuse", icon: MessageSquare, pro: false },
    { path: "/events", label: "Events", icon: Calendar, pro: false },
    { path: "/account", label: "Account", icon: User, pro: false },
  ];

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
      
      if (response.ok) {
        window.location.href = "/";
      }
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleLogin = () => {
    window.location.href = "/login";
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
                    {item.pro && (
                      <Badge variant="secondary" className="ml-1 text-xs px-1.5 py-0">
                        PRO
                      </Badge>
                    )}
                  </Button>
                );
              })}
              <Button
                onClick={handleLogout}
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
            <div className="flex items-center gap-2">
              <Button
                onClick={() => setLocation("/blog")}
                variant="ghost"
                size="sm"
                className="gap-2"
                data-testid="link-blog"
              >
                <Newspaper className="w-4 h-4" />
                Blog
              </Button>
              <Button
                onClick={() => setLocation("/shop")}
                variant="ghost"
                size="sm"
                className="gap-2"
                data-testid="link-shop"
              >
                <ShoppingBag className="w-4 h-4" />
                Shop
              </Button>
              <Button
                onClick={handleLogin}
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
                    {item.label}{item.pro ? " (PRO)" : ""}
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

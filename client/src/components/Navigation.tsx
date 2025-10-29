import { useState } from "react";
import { useLocation } from "wouter";
import { Sparkles, Calendar, ShoppingBag, BookOpen, MessageSquare, User, LogOut, LogIn, Newspaper, TrendingUp, Compass, Menu, X, Crown, Zap, Code2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useAuth } from "@/hooks/useAuth";
import { trackCTAClick } from "@/lib/analytics";

export function Navigation() {
  const [location, setLocation] = useLocation();
  const { isAuthenticated, isLoading } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Public pages accessible to everyone
  const publicNavItems = [
    { path: "/discover", label: "Discover", icon: Compass, pro: false },
    { path: "/rituals", label: "Rituals", icon: Sparkles, pro: false },
    { path: "/ai-builder", label: "AI Builder", icon: Code2, pro: false, highlight: true },
    { path: "/vip-cohort", label: "VIP Retreat", icon: Crown, pro: false },
    { path: "/daily", label: "Daily", icon: Zap, pro: false },
    { path: "/blog", label: "Blog", icon: Newspaper, pro: false },
    { path: "/shop", label: "Shop", icon: ShoppingBag, pro: false },
  ];

  // Authenticated-only pages
  const authNavItems = [
    { path: "/journal", label: "Journal", icon: BookOpen, pro: false },
    { path: "/glow-up", label: "Glow-Up", icon: TrendingUp, pro: true },
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

  const handleNavClick = (path: string, label?: string) => {
    // Track navigation clicks for key conversion paths
    if (label && ['Discover', 'AI Builder', 'VIP Retreat', 'Shop', 'Blog'].includes(label)) {
      trackCTAClick(`nav_${label.toLowerCase().replace(' ', '_')}`, path);
    }
    setLocation(path);
    setMobileMenuOpen(false);
  };

  const NavItem = ({ item, isActive }: { item: typeof publicNavItems[0], isActive: boolean }) => {
    const Icon = item.icon;
    return (
      <Button
        onClick={() => handleNavClick(item.path, item.label)}
        variant={isActive ? "default" : "ghost"}
        size="sm"
        className={`gap-2 w-full sm:w-auto justify-start sm:justify-center ${item.highlight ? 'text-primary hover:text-primary' : ''}`}
        data-testid={`link-${item.label.toLowerCase().replace(' ', '-')}`}
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
  };

  return (
    <nav className="sticky top-0 z-50 w-full backdrop-blur-xl bg-background/80 border-b border-border shadow-lg neon-glow-subtle">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button
            onClick={() => handleNavClick("/")}
            className="text-xl sm:text-2xl font-serif font-bold text-gradient-violet cursor-pointer hover-elevate active-elevate-2 px-3 py-2 rounded-md"
            data-testid="link-home"
          >
            <span className="hidden sm:inline">MetaHers Mind Spa</span>
            <span className="sm:hidden">MetaHers</span>
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {/* Public pages - always visible */}
            {publicNavItems.map((item) => {
              const isActive = location === item.path || 
                (item.path !== "/" && location.startsWith(item.path));
              return <NavItem key={item.path} item={item} isActive={isActive} />;
            })}

            {/* Authenticated pages */}
            {isAuthenticated && authNavItems.map((item) => {
              const isActive = location === item.path || 
                (item.path !== "/" && location.startsWith(item.path));
              return <NavItem key={item.path} item={item} isActive={isActive} />;
            })}

            {/* Auth buttons */}
            {!isAuthenticated && !isLoading && (
              <Button
                onClick={() => {
                  trackCTAClick('nav_login', '/login');
                  setLocation("/login");
                }}
                variant="default"
                size="sm"
                className="gap-2 ml-2"
                data-testid="button-login-nav"
              >
                <LogIn className="w-4 h-4" />
                Sign In
              </Button>
            )}

            {isAuthenticated && (
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
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon"
                  data-testid="button-mobile-menu"
                >
                  {mobileMenuOpen ? (
                    <X className="w-5 h-5" />
                  ) : (
                    <Menu className="w-5 h-5" />
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[280px] sm:w-[350px]">
                <div className="flex flex-col h-full">
                  <div className="mb-6 pt-6">
                    <h2 className="font-serif text-2xl font-bold text-gradient-violet">
                      Menu
                    </h2>
                  </div>

                  <div className="flex-1 flex flex-col gap-2 overflow-y-auto">
                    {/* Public pages */}
                    <div className="space-y-1">
                      {publicNavItems.map((item) => {
                        const isActive = location === item.path || 
                          (item.path !== "/" && location.startsWith(item.path));
                        return <NavItem key={item.path} item={item} isActive={isActive} />;
                      })}
                    </div>

                    {/* Authenticated pages */}
                    {isAuthenticated && (
                      <>
                        <div className="border-t border-border my-4" />
                        <div className="space-y-1">
                          {authNavItems.map((item) => {
                            const isActive = location === item.path || 
                              (item.path !== "/" && location.startsWith(item.path));
                            return <NavItem key={item.path} item={item} isActive={isActive} />;
                          })}
                        </div>
                      </>
                    )}
                  </div>

                  {/* Auth buttons at bottom */}
                  <div className="border-t border-border pt-4 mt-4 space-y-2">
                    {!isAuthenticated && !isLoading && (
                      <>
                        <Button
                          onClick={() => {
                            trackCTAClick('nav_login_mobile', '/login');
                            handleNavClick("/login");
                          }}
                          variant="default"
                          size="sm"
                          className="w-full gap-2"
                          data-testid="button-mobile-login"
                        >
                          <LogIn className="w-4 h-4" />
                          Sign In
                        </Button>
                        <Button
                          onClick={() => {
                            trackCTAClick('nav_signup_mobile', '/signup');
                            handleNavClick("/signup");
                          }}
                          variant="outline"
                          size="sm"
                          className="w-full gap-2"
                          data-testid="button-mobile-signup"
                        >
                          Create Account
                        </Button>
                      </>
                    )}

                    {isAuthenticated && (
                      <Button
                        onClick={handleLogout}
                        variant="ghost"
                        size="sm"
                        className="w-full gap-2"
                        data-testid="button-mobile-logout"
                      >
                        <LogOut className="w-4 h-4" />
                        Log Out
                      </Button>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}

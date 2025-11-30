import { useState } from "react";
import { useLocation, Link } from "wouter";
import { Sparkles, Calendar, ShoppingBag, BookOpen, MessageSquare, User, LogOut, LogIn, Newspaper, TrendingUp, Compass, Menu, X, Crown, Zap, Code2, Edit3, Briefcase, ArrowUpCircle, Target, ChevronDown, Globe, Layers, LayoutDashboard, Shield, Camera, Users } from "lucide-react";
import { SiWhatsapp } from "react-icons/si";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { GlobalSearch } from "@/components/GlobalSearch";
import { useAuth } from "@/hooks/useAuth";
import { trackCTAClick } from "@/lib/analytics";
import { motion, AnimatePresence } from "framer-motion";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export function Navigation() {
  const [location, setLocation] = useLocation();
  const { isAuthenticated, isLoading, user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);

  const navCategories = {
    "Featured": [
      { path: "/retreat", label: "Free AI Retreat", icon: Sparkles },
      { path: "/world", label: "MetaHers World", icon: Globe },
      { path: "/founders-sanctuary", label: "Founder's Sanctuary", icon: Crown },
      ...(isAuthenticated ? [
        { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
      ] : []),
    ],
    "AI & Tools": [
      { path: "/playground", label: "AI Playground", icon: Sparkles },
      { path: "/career-path", label: "Career Path", icon: Target },
      { path: "/ai-mastery", label: "AI Mastery Program", icon: TrendingUp },
      { path: "/ai-glow-up-program", label: "AI Glow-Up", icon: TrendingUp, pro: true },
      { path: "/companion", label: "AI Companion", icon: MessageSquare },
    ],
    "Learn & Grow": [
      { path: "/discover", label: "Discover", icon: Compass },
      { path: "/rituals", label: "Rituals", icon: Zap },
      { path: "/app-atelier", label: "App Atelier", icon: Code2 },
      { path: "/blog", label: "Blog & Resources", icon: BookOpen },
    ],
    ...(isAuthenticated ? {
      "Your Space": [
        { path: "/journal", label: "Journal", icon: BookOpen },
        { path: "/thought-leadership", label: "30-Day Journey", icon: Edit3, pro: true },
        { path: "/events", label: "Events", icon: Calendar },
        { path: "/shop", label: "Shop", icon: ShoppingBag },
        { path: "/retro-camera", label: "Retro Camera", icon: Camera },
      ],
    } : {
      "Community": [
        { path: "/circle", label: "Circle", icon: Users },
      ],
      "More": [
        { path: "/shop", label: "Shop", icon: ShoppingBag },
        { path: "/retro-camera", label: "Retro Camera", icon: Camera },
        { path: "/vip-cohort", label: "VIP Cohort", icon: Crown },
        { path: "/executive", label: "Executive", icon: Briefcase },
        { path: "/ai-prompts", label: "AI Prompts", icon: Code2 },
      ],
    }),
    ...(user && "isAdmin" in user && user.isAdmin ? {
      "Admin": [
        { path: "/admin", label: "Admin Dashboard", icon: Shield },
      ],
    } : {}),
  };

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
    if (label && ['Discover', 'AI Builder', 'VIP Retreat', 'Shop', 'Blog'].includes(label)) {
      trackCTAClick(`nav_${label.toLowerCase().replace(' ', '_')}`, path);
    }
    setLocation(path);
    setMobileMenuOpen(false);
    setMegaMenuOpen(false);
  };

  const MegaMenuCard = ({ item }: { item: any }) => {
    const Icon = item.icon;
    const isActive = location === item.path || 
      (item.path !== "/" && location.startsWith(item.path));

    return (
      <motion.button
        onClick={() => handleNavClick(item.path, item.label)}
        className={`relative group w-full p-3 text-left transition-all ${
          isActive 
            ? 'bg-gray-100' 
            : 'hover:bg-gray-50'
        }`}
        data-testid={`mega-nav-${item.label.toLowerCase().replace(' ', '-')}`}
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-black flex items-center justify-center flex-shrink-0">
            <Icon className="w-4 h-4 text-white" />
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-black flex items-center gap-2">
              {item.label}
              {item.pro && (
                <Badge className="text-[10px] px-1 py-0 bg-purple-100 text-purple-700 border-0">
                  PRO
                </Badge>
              )}
            </p>
          </div>
        </div>
      </motion.button>
    );
  };

  const MobileNavItem = ({ item }: { item: any }) => {
    const Icon = item.icon;
    const isActive = location === item.path || 
      (item.path !== "/" && location.startsWith(item.path));

    return (
      <button
        onClick={() => handleNavClick(item.path, item.label)}
        className={`w-full flex items-center gap-3 p-3 transition-all ${
          isActive 
            ? 'bg-gray-100' 
            : 'hover:bg-gray-50'
        }`}
        data-testid={`mobile-nav-${item.label.toLowerCase().replace(' ', '-')}`}
      >
        <div className="w-10 h-10 bg-black flex items-center justify-center flex-shrink-0">
          <Icon className="w-5 h-5 text-white" />
        </div>

        <span className="font-medium text-black flex-1 text-left">
          {item.label}
        </span>

        {item.pro && (
          <Badge className="text-xs px-1.5 py-0 bg-purple-100 text-purple-700 border-0">
            PRO
          </Badge>
        )}
      </button>
    );
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button
            onClick={() => handleNavClick("/")}
            className="text-xl sm:text-2xl font-semibold text-black tracking-tight cursor-pointer"
            data-testid="link-home"
          >
            MetaHers
          </button>

          {/* Desktop Navigation - Center */}
          <div className="hidden lg:flex items-center gap-6 flex-1">
            {/* Global Search */}
            <div className="flex-1 max-w-sm">
              <GlobalSearch />
            </div>

            {/* Explore Menu Button */}
            <div className="relative">
              <Button
                onClick={() => setMegaMenuOpen(!megaMenuOpen)}
                variant="ghost"
                size="sm"
                className="gap-1 text-gray-700 hover:text-black uppercase tracking-wider text-sm font-medium"
                data-testid="button-explore-menu"
              >
                Explore
                <ChevronDown className={`w-4 h-4 transition-transform ${megaMenuOpen ? 'rotate-180' : ''}`} />
              </Button>

              {/* Mega Menu Dropdown */}
              <AnimatePresence>
                {megaMenuOpen && (
                  <>
                    {/* Backdrop */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="fixed inset-0 bg-black/10 z-40"
                      onClick={() => setMegaMenuOpen(false)}
                    />

                    {/* Mega Menu Content */}
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.15 }}
                      className="absolute top-full right-0 mt-2 w-[700px] max-w-[calc(100vw-2rem)] bg-white border border-gray-200 shadow-xl z-50"
                    >
                      {/* 3-Column Grid Layout */}
                      <div className="grid grid-cols-3 divide-x divide-gray-100">
                        {Object.entries(navCategories).map(([category, items]) => (
                          items.length > 0 && (
                            <div key={category} className="p-4">
                              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-3">
                                {category}
                              </h3>
                              <div className="space-y-1">
                                {items.map((item) => (
                                  <MegaMenuCard key={item.path} item={item} />
                                ))}
                              </div>
                            </div>
                          )
                        ))}
                      </div>

                      {/* Quick Actions Footer */}
                      <div className="border-t border-gray-100 p-4 bg-gray-50">
                        <div className="flex items-center justify-between gap-4">
                          <button
                            onClick={() => handleNavClick("/upgrade")}
                            className="alo-button text-xs flex-1 flex items-center justify-center gap-2"
                            data-testid="mega-nav-pricing"
                          >
                            <Crown className="w-4 h-4" />
                            View Membership
                          </button>
                          {isAuthenticated && (
                            <button
                              onClick={() => handleNavClick("/account")}
                              className="alo-button-outline text-xs flex-1 flex items-center justify-center gap-2"
                              data-testid="mega-nav-account"
                            >
                              <User className="w-4 h-4" />
                              Account
                            </button>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Desktop Auth & Actions - Right */}
          <div className="hidden lg:flex items-center gap-4">
            {/* Auth buttons */}
            {!isAuthenticated && !isLoading && (
              <Button
                onClick={() => {
                  trackCTAClick('nav_login', '/login');
                  setLocation("/login");
                }}
                className="bg-black text-white hover:bg-gray-900 uppercase tracking-wider text-xs font-medium"
                size="sm"
                data-testid="button-login-nav"
              >
                Sign In
              </Button>
            )}

            {isAuthenticated && (
              <Button
                onClick={handleLogout}
                variant="ghost"
                size="sm"
                className="gap-2 text-gray-700 hover:text-black uppercase tracking-wider text-xs"
                data-testid="button-logout"
              >
                <LogOut className="w-4 h-4" />
                Log Out
              </Button>
            )}

            {/* WhatsApp Retreat Link */}
            <Tooltip>
              <TooltipTrigger asChild>
                <a
                  href="https://chat.whatsapp.com/Gc0QaGWvbCUJFytDiaRwRZ?mode=wwt"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackCTAClick('nav_whatsapp_retreat', 'whatsapp_retreat', 'free')}
                  data-testid="button-whatsapp-nav"
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-[#25D366] hover:text-[#128C7E]"
                  >
                    <SiWhatsapp className="w-5 h-5" />
                  </Button>
                </a>
              </TooltipTrigger>
              <TooltipContent>
                <p>Join Free AI Retreat</p>
              </TooltipContent>
            </Tooltip>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon"
                  aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
                  aria-expanded={mobileMenuOpen}
                  data-testid="button-mobile-menu"
                  className="text-black"
                >
                  {mobileMenuOpen ? (
                    <X className="w-5 h-5" />
                  ) : (
                    <Menu className="w-5 h-5" />
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[280px] sm:w-[350px] p-0 bg-white">
                <div className="flex flex-col h-full p-4">
                  <div className="mb-6 pt-2 border-b border-gray-100 pb-4">
                    <h2 className="text-2xl font-semibold text-black">
                      Menu
                    </h2>
                  </div>

                  <div className="flex-1 flex flex-col gap-1 overflow-y-auto pr-2">
                    {Object.entries(navCategories).map(([category, items]) => (
                      items.length > 0 && (
                        <div key={category} className="mb-4">
                          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-3">
                            {category}
                          </h3>
                          <div className="space-y-1">
                            {items.map((item) => (
                              <MobileNavItem key={item.path} item={item} />
                            ))}
                          </div>
                        </div>
                      )
                    ))}

                    {/* Pricing link */}
                    <div className="border-t border-gray-100 pt-3 mt-2">
                      <MobileNavItem item={{
                        path: "/upgrade",
                        label: "Membership",
                        icon: ArrowUpCircle,
                      }} />
                    </div>

                    {/* WhatsApp Retreat */}
                    <a
                      href="https://chat.whatsapp.com/Gc0QaGWvbCUJFytDiaRwRZ?mode=wwt"
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => trackCTAClick('mobile_whatsapp_retreat', 'whatsapp_retreat', 'free')}
                      className="block mt-2"
                      data-testid="link-mobile-whatsapp"
                    >
                      <div className="flex items-center gap-3 p-3 bg-[#25D366]/10 transition-all hover:bg-[#25D366]/20">
                        <div className="w-10 h-10 bg-[#25D366] flex items-center justify-center flex-shrink-0">
                          <SiWhatsapp className="w-5 h-5 text-white" />
                        </div>
                        <span className="font-medium text-black flex-1 text-left">
                          Free AI Retreat
                        </span>
                        <Badge className="text-xs px-1.5 py-0 bg-[#25D366] text-white border-0">
                          FREE
                        </Badge>
                      </div>
                    </a>

                    {isAuthenticated && (
                      <MobileNavItem item={{
                        path: "/account",
                        label: "Account",
                        icon: User,
                      }} />
                    )}

                    <MobileNavItem item={{
                      path: "/companion",
                      label: "AI Companion",
                      icon: Sparkles,
                    }} />
                  </div>

                  {/* Auth buttons at bottom */}
                  <div className="border-t border-gray-100 pt-4 mt-auto space-y-2">
                    {!isAuthenticated && !isLoading && (
                      <>
                        <Button
                          onClick={() => {
                            trackCTAClick('nav_login_mobile', '/login');
                            handleNavClick("/login");
                          }}
                          size="sm"
                          className="w-full bg-black text-white hover:bg-gray-900 uppercase tracking-wider text-xs font-medium"
                          data-testid="button-mobile-login"
                        >
                          <LogIn className="w-4 h-4 mr-2" />
                          Sign In
                        </Button>
                        <Button
                          onClick={() => {
                            trackCTAClick('nav_signup_mobile', '/signup');
                            handleNavClick("/signup");
                          }}
                          variant="outline"
                          size="sm"
                          className="w-full border-black text-black hover:bg-gray-100 uppercase tracking-wider text-xs font-medium"
                          data-testid="button-mobile-signup"
                        >
                          Create Account
                        </Button>
                      </>
                    )}

                    {isAuthenticated && (
                      <Button
                        onClick={handleLogout}
                        variant="outline"
                        size="sm"
                        className="w-full border-gray-300 text-gray-700 hover:bg-gray-100 uppercase tracking-wider text-xs"
                        data-testid="button-mobile-logout"
                      >
                        <LogOut className="w-4 h-4 mr-2" />
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

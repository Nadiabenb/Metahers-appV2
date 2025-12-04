import { useState } from "react";
import { useLocation, Link } from "wouter";
import { Sparkles, Calendar, ShoppingBag, BookOpen, MessageSquare, User, LogOut, LogIn, Newspaper, TrendingUp, Compass, Menu, X, Crown, Zap, Code2, Edit3, Briefcase, ArrowUpCircle, Target, ChevronDown, Globe, Layers, LayoutDashboard, Shield, Camera, Users, Sun } from "lucide-react";
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
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  const menuSections = {
    "Featured": {
      icon: Sparkles,
      items: [
        { path: "/retreat", label: "Free AI Retreat", icon: Sparkles, desc: "Join our community" },
        { path: "/world", label: "MetaHers World", icon: Globe, desc: "Digital hub" },
        { path: "/founders-sanctuary", label: "Founder's Sanctuary", icon: Crown, desc: "Premium space" },
        ...(isAuthenticated ? [
          { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard, desc: "Your workspace" },
        ] : []),
      ],
    },
    "AI & Tools": {
      icon: TrendingUp,
      items: [
        { path: "/learning-hub", label: "Learning Hub", icon: BookOpen, desc: "AI Mastery curriculum", pro: true },
        { path: "/playground", label: "AI Playground", icon: Sparkles, desc: "Explore AI" },
        { path: "/ai-mastery", label: "AI Mastery Program", icon: TrendingUp, desc: "Master AI tools" },
        { path: "/ai-glow-up-program", label: "AI Glow-Up", icon: TrendingUp, desc: "Transform yourself", pro: true },
        { path: "/career-path", label: "Career Path Generator", icon: Target, desc: "Plan your path" },
        { path: "/companion", label: "AI Companion", icon: MessageSquare, desc: "Chat & learn" },
      ],
    },
    "Learn & Grow": {
      icon: BookOpen,
      items: [
        { path: "/discover", label: "Discover", icon: Compass, desc: "Explore content" },
        { path: "/vision-board", label: "Vision Board 2026", icon: Sparkles, desc: "Create your vision" },
        { path: "/rituals", label: "Rituals", icon: Zap, desc: "Transform daily" },
        { path: "/app-atelier", label: "App Atelier", icon: Code2, desc: "Build apps" },
        { path: "/blog", label: "Blog & Resources", icon: BookOpen, desc: "Read insights" },
      ],
    },
    "Community": {
      icon: Users,
      items: [
        { path: "/circle", label: "Circle", icon: Users, desc: "Connect with others" },
        { path: "/shop", label: "Shop", icon: ShoppingBag, desc: "Browse products" },
        { path: "/retro-camera", label: "Retro Camera", icon: Camera, desc: "Capture moments" },
        { path: "/vip-cohort", label: "VIP Cohort", icon: Crown, desc: "Exclusive access" },
      ],
    },
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

  const handleNavClick = (path: string) => {
    setLocation(path);
    setMobileMenuOpen(false);
    setActiveMenu(null);
  };

  const MenuItemCard = ({ item }: { item: any }) => {
    const Icon = item.icon;
    const isActive = location === item.path || 
      (item.path !== "/" && location.startsWith(item.path));

    return (
      <motion.button
        onClick={() => {
          // Check if Pro feature and user is not Pro
          if ("pro" in item && item.pro && (!isAuthenticated || !user?.isPro)) {
            handleNavClick("/upgrade");
          } else {
            handleNavClick(item.path);
          }
        }}
        className={`w-full p-3 text-left rounded-md transition-all ${
          isActive 
            ? 'bg-purple-50 border border-purple-200' 
            : 'hover:bg-gray-50 border border-transparent'
        }`}
        data-testid={`nav-${item.label.toLowerCase().replace(' ', '-')}`}
      >
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 bg-black flex items-center justify-center flex-shrink-0 rounded">
            <Icon className="w-4 h-4 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-black flex items-center gap-2">
              {item.label}
              {item.pro && (
                <Badge className="text-[10px] px-1 py-0 bg-purple-100 text-purple-700 border-0">
                  PRO
                </Badge>
              )}
            </p>
            <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
          </div>
        </div>
      </motion.button>
    );
  };

  const MenuSection = ({ section, items }: { section: string; items: any[] }) => {
    const SectionIcon = menuSections[section as keyof typeof menuSections]?.icon || Sparkles;

    return (
      <div className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-6 h-6 bg-black flex items-center justify-center rounded">
            <SectionIcon className="w-3 h-3 text-white" />
          </div>
          <h3 className="text-sm font-bold text-black uppercase tracking-wider">{section}</h3>
        </div>
        <div className="space-y-2">
          {items.map((item) => (
            <MenuItemCard key={item.path} item={item} />
          ))}
        </div>
      </div>
    );
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-white border-b border-gray-200">
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

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-2 flex-1 mx-8">
            {/* Global Search */}
            <div className="flex-1 max-w-sm">
              <GlobalSearch />
            </div>

            {/* Main Menu Items */}
            <div className="flex items-center gap-2">
              {Object.entries(menuSections).map(([section, config]) => (
                <div key={section} className="relative">
                  <Button
                    onClick={() => setActiveMenu(activeMenu === section ? null : section)}
                    variant="ghost"
                    size="sm"
                    className="gap-1 text-gray-700 hover:text-black uppercase tracking-wider text-xs font-semibold"
                    data-testid={`button-nav-${section.toLowerCase().replace(' ', '-')}`}
                  >
                    {section}
                    <ChevronDown className={`w-3 h-3 transition-transform ${activeMenu === section ? 'rotate-180' : ''}`} />
                  </Button>

                  {/* Dropdown Menu */}
                  <AnimatePresence>
                    {activeMenu === section && (
                      <>
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="fixed inset-0 z-40"
                          onClick={() => setActiveMenu(null)}
                        />
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.1 }}
                          className="absolute top-full left-0 mt-2 w-[320px] bg-white border border-gray-200 rounded-lg shadow-lg z-50"
                        >
                          <MenuSection section={section} items={config.items} />
                          {section === "Featured" && (
                            <div className="border-t border-gray-100 p-4 bg-gray-50">
                              <Button
                                onClick={() => handleNavClick("/upgrade")}
                                className="w-full bg-black hover:bg-gray-900 text-white text-xs uppercase tracking-wider font-semibold"
                                size="sm"
                                data-testid="nav-membership"
                              >
                                <Crown className="w-3 h-3 mr-2" />
                                View Membership
                              </Button>
                            </div>
                          )}
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>

          {/* Desktop Right Actions */}
          <div className="hidden lg:flex items-center gap-3">
            {!isAuthenticated && !isLoading && (
              <Button
                onClick={() => {
                  trackCTAClick('nav_login', '/login');
                  handleNavClick("/login");
                }}
                className="bg-black text-white hover:bg-gray-900 uppercase tracking-wider text-xs font-semibold"
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

            {/* WhatsApp */}
            <Tooltip>
              <TooltipTrigger asChild>
                <a
                  href="https://chat.whatsapp.com/Gc0QaGWvbCUJFytDiaRwRZ?mode=wwt"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackCTAClick('nav_whatsapp', 'whatsapp')}
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

          {/* Mobile Menu */}
          <div className="lg:hidden">
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="text-black"
                  data-testid="button-mobile-menu"
                >
                  {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[320px] p-0 bg-white">
                <div className="flex flex-col h-full p-4">
                  <div className="mb-6 pt-2 border-b border-gray-100 pb-4">
                    <h2 className="text-2xl font-semibold text-black">Menu</h2>
                  </div>

                  <div className="flex-1 overflow-y-auto space-y-6">
                    {Object.entries(menuSections).map(([section, config]) => (
                      <div key={section}>
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-6 h-6 bg-black flex items-center justify-center rounded">
                            <config.icon className="w-3 h-3 text-white" />
                          </div>
                          <h3 className="text-xs font-bold text-black uppercase tracking-wider">{section}</h3>
                        </div>
                        <div className="space-y-2 pl-2">
                          {config.items.map((item) => (
                            <button
                              key={item.path}
                              onClick={() => {
                                // Check if Pro feature and user is not Pro
                                if ("pro" in item && item.pro && (!isAuthenticated || !user?.isPro)) {
                                  handleNavClick("/upgrade");
                                } else {
                                  handleNavClick(item.path);
                                }
                              }}
                              className="w-full text-left p-2 rounded hover:bg-gray-100 transition-colors"
                              data-testid={`mobile-nav-${item.label.toLowerCase().replace(' ', '-')}`}
                            >
                              <p className="text-sm font-medium text-black flex items-center gap-2">
                                {item.label}
                                {"pro" in item && item.pro && <Badge className="text-[10px] px-1 bg-purple-100 text-purple-700 border-0">PRO</Badge>}
                              </p>
                              <p className="text-xs text-gray-500">{item.desc}</p>
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Mobile Bottom Actions */}
                  <div className="border-t border-gray-100 pt-4 mt-auto space-y-2">
                    {!isAuthenticated && !isLoading && (
                      <>
                        <Button
                          onClick={() => {
                            trackCTAClick('nav_login_mobile', '/login');
                            handleNavClick("/login");
                          }}
                          size="sm"
                          className="w-full bg-black text-white hover:bg-gray-900 uppercase tracking-wider text-xs font-semibold"
                          data-testid="button-mobile-login"
                        >
                          <LogIn className="w-4 h-4 mr-2" />
                          Sign In
                        </Button>
                        <Button
                          onClick={() => handleNavClick("/signup")}
                          variant="outline"
                          size="sm"
                          className="w-full border-black text-black hover:bg-gray-50 uppercase tracking-wider text-xs font-semibold"
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

import { useState } from "react";
import { useLocation, Link } from "wouter";
import { Sparkles, Calendar, ShoppingBag, BookOpen, MessageSquare, User, LogOut, LogIn, Newspaper, TrendingUp, Compass, Menu, X, Crown, Zap, Code2, Edit3, Briefcase, ArrowUpCircle, Target, ChevronDown, Globe, Layers, LayoutDashboard, Shield, Camera, Users, Sun, Bot, Ship, Anchor } from "lucide-react";
import { SiWhatsapp } from "react-icons/si";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { GlobalSearch } from "@/components/GlobalSearch";
import { useAuth } from "@/hooks/useAuth";
import { trackCTAClick } from "@/lib/analytics";
import { motion, AnimatePresence } from "framer-motion";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const DARK_BG = "#0A0614";
const DARK_CARD = "#0D0A1A";
const LAVENDER = "#C8A2D8";
const PINK = "#EC4899";

export function Navigation() {
  const [location, setLocation] = useLocation();
  const { isAuthenticated, isLoading, user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  const menuSections = {
    "Your Journey": {
      icon: Sparkles,
      items: [
        ...(isAuthenticated ? [
          { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard, desc: "Your personalized hub" },
        ] : []),
        { path: "/vision-board", label: "Vision Board", icon: Sparkles, desc: "Free entry point" },
      ],
    },
    "Core Membership": {
      icon: BookOpen,
      items: [
        { path: "/learning-hub", label: "Learning Hub", icon: BookOpen, desc: "9 Worlds curriculum", pro: false },
        { path: "/metamuse", label: "MetaMuse AI", icon: Sparkles, desc: "Your AI companion", pro: true },
        { path: "/journal", label: "Journal", icon: Edit3, desc: "Track your growth", pro: true },
      ],
    },
    "Premium Cohort": {
      icon: Crown,
      items: [
        { path: "/ai-mastery", label: "AI Mastery Program", icon: TrendingUp, desc: "12-week intensive", pro: false },
        { path: "/app-atelier", label: "App Atelier", icon: Code2, desc: "Build with AI", pro: false },
        { path: "/agency", label: "AI Agency", icon: Bot, desc: "Your digital agency team", pro: false },
      ],
    },
    "Voyages": {
      icon: Anchor,
      items: [
        { path: "/voyages", label: "All Voyages", icon: Ship, desc: "Newport Beach experiences" },
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
        className="w-full p-3 text-left rounded-md transition-all border"
        style={{
          background: isActive ? 'rgba(200,162,216,0.15)' : 'transparent',
          borderColor: isActive ? LAVENDER : 'rgba(255,255,255,0.1)',
          color: '#ffffff'
        }}
        data-testid={`nav-${item.label.toLowerCase().replace(' ', '-')}`}
      >
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 flex items-center justify-center flex-shrink-0 rounded" style={{ background: PINK }}>
            <Icon className="w-4 h-4 text-black" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold flex items-center gap-2" style={{ color: '#ffffff' }}>
              {item.label}
              {item.pro && (
                <Badge className="text-[10px] px-1 py-0 border-0" style={{ background: LAVENDER, color: '#0A0614' }}>
                  PRO
                </Badge>
              )}
            </p>
            <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.6)' }}>{item.desc}</p>
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
          <div className="w-6 h-6 flex items-center justify-center rounded" style={{ background: PINK }}>
            <SectionIcon className="w-3 h-3 text-black" />
          </div>
          <h3 className="text-sm font-bold uppercase tracking-wider" style={{ color: '#ffffff' }}>{section}</h3>
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
    <nav className="sticky top-0 z-50 w-full border-b" style={{ background: DARK_BG, borderColor: 'rgba(255,255,255,0.1)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button
            onClick={() => handleNavClick("/")}
            className="text-xl sm:text-2xl font-semibold tracking-tight cursor-pointer"
            style={{ color: '#ffffff' }}
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
                    className="gap-1 uppercase tracking-wider text-xs font-semibold"
                    style={{ color: 'rgba(255,255,255,0.7)' }}
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
                          className="absolute top-full left-0 mt-2 w-[320px] rounded-lg shadow-lg z-50"
                          style={{ background: DARK_CARD, borderColor: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.1)' }}
                        >
                          <MenuSection section={section} items={config.items} />
                          {section === "Featured" && (
                            <div className="p-4" style={{ borderTop: '1px solid rgba(255,255,255,0.1)', background: 'rgba(200,162,216,0.1)' }}>
                              <Button
                                onClick={() => handleNavClick("/upgrade")}
                                className="w-full text-white text-xs uppercase tracking-wider font-semibold"
                                style={{ background: PINK }}
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
                className="text-white uppercase tracking-wider text-xs font-semibold"
                style={{ background: PINK }}
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
                className="gap-2 uppercase tracking-wider text-xs"
                style={{ color: 'rgba(255,255,255,0.7)' }}
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
                  style={{ color: '#ffffff' }}
                  data-testid="button-mobile-menu"
                >
                  {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[320px] p-0" style={{ background: DARK_CARD }}>
                <div className="flex flex-col h-full p-4">
                  <div className="mb-6 pt-2 pb-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                    <h2 className="text-2xl font-semibold" style={{ color: '#ffffff' }}>Menu</h2>
                  </div>

                  <div className="flex-1 overflow-y-auto space-y-6">
                    {Object.entries(menuSections).map(([section, config]) => (
                      <div key={section}>
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-6 h-6 flex items-center justify-center rounded" style={{ background: PINK }}>
                            <config.icon className="w-3 h-3 text-black" />
                          </div>
                          <h3 className="text-xs font-bold uppercase tracking-wider" style={{ color: '#ffffff' }}>{section}</h3>
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
                              className="w-full text-left p-2 rounded transition-colors"
                              style={{ color: 'rgba(255,255,255,0.7)' }}
                              data-testid={`mobile-nav-${item.label.toLowerCase().replace(' ', '-')}`}
                            >
                              <p className="text-sm font-medium flex items-center gap-2" style={{ color: '#ffffff' }}>
                                {item.label}
                                {"pro" in item && item.pro && <Badge className="text-[10px] px-1 border-0" style={{ background: LAVENDER, color: '#0A0614' }}>PRO</Badge>}
                              </p>
                              <p className="text-xs">{item.desc}</p>
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Mobile Bottom Actions */}
                  <div className="pt-4 mt-auto space-y-2" style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                    {!isAuthenticated && !isLoading && (
                      <>
                        <Button
                          onClick={() => {
                            trackCTAClick('nav_login_mobile', '/login');
                            handleNavClick("/login");
                          }}
                          size="sm"
                          className="w-full text-white uppercase tracking-wider text-xs font-semibold"
                          style={{ background: PINK }}
                          data-testid="button-mobile-login"
                        >
                          <LogIn className="w-4 h-4 mr-2" />
                          Sign In
                        </Button>
                        <Button
                          onClick={() => handleNavClick("/signup")}
                          variant="outline"
                          size="sm"
                          className="w-full uppercase tracking-wider text-xs font-semibold"
                          style={{ borderColor: LAVENDER, color: '#ffffff', background: 'transparent' }}
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
                        className="w-full uppercase tracking-wider text-xs"
                        style={{ borderColor: LAVENDER, color: '#ffffff', background: 'transparent' }}
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

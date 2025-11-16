import { useState } from "react";
import { useLocation, Link } from "wouter";
import { Sparkles, Calendar, ShoppingBag, BookOpen, MessageSquare, User, LogOut, LogIn, Newspaper, TrendingUp, Compass, Menu, X, Crown, Zap, Code2, Edit3, Briefcase, ArrowUpCircle, Target, ChevronDown, Globe, Layers, LayoutDashboard } from "lucide-react";
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
  const { isAuthenticated, isLoading } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);

  // Categorized navigation items for mega menu
  const navCategories = {
    ...(isAuthenticated ? {
      "Quick Access": [
        { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard, gradient: "from-blue-500 to-indigo-600", glow: "59, 130, 246", featured: true },
      ]
    } : {}),
    "AI Tools": [
      { path: "/retreat", label: "Free AI Retreat", icon: Sparkles, gradient: "from-emerald-500 to-teal-600", glow: "16, 185, 129", featured: true },
      { path: "/playground", label: "AI Tools", icon: Sparkles, gradient: "from-cyan-500 to-blue-600", glow: "0, 217, 255" },
      { path: "/career-path", label: "Career Path", icon: Target, gradient: "from-purple-500 to-pink-600", glow: "181, 101, 216" },
      { path: "/ai-glow-up-program", label: "AI Glow-Up", icon: TrendingUp, gradient: "from-pink-500 to-rose-600", glow: "233, 53, 193", pro: true },
    ],
    "Learning": [
      { path: "/world", label: "MetaHers World", icon: Layers, gradient: "from-purple-500 via-fuchsia-500 to-pink-500", glow: "217, 70, 239", featured: true },
      { path: "/founders-sanctuary", label: "Founder's Sanctuary", icon: Crown, gradient: "from-pink-500 to-purple-600", glow: "233, 53, 193", featured: true },
      { path: "/app-atelier", label: "App Atelier", icon: Code2, gradient: "from-pink-500 to-fuchsia-600", glow: "233, 53, 193" },
      { path: "/discover", label: "Discover", icon: Compass, gradient: "from-violet-500 to-purple-600", glow: "181, 101, 216" },
      { path: "/rituals", label: "Rituals", icon: Zap, gradient: "from-amber-500 to-orange-600", glow: "255, 215, 0" },
      { path: "/blog", label: "Resources", icon: BookOpen, gradient: "from-teal-500 to-cyan-600", glow: "0, 217, 255" },
    ],
    "Workspace": isAuthenticated ? [
      { path: "/journal", label: "Journal", icon: BookOpen, gradient: "from-emerald-500 to-teal-600", glow: "16, 185, 129" },
      { path: "/thought-leadership", label: "30-Day Journey", icon: Edit3, gradient: "from-violet-500 to-purple-600", glow: "181, 101, 216", pro: true },
      { path: "/events", label: "Events", icon: Calendar, gradient: "from-pink-500 to-fuchsia-600", glow: "233, 53, 193" },
    ] : [],
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
        whileHover={{ scale: 1.05, y: -4 }}
        whileTap={{ scale: 0.95 }}
        className={`relative group rounded-2xl p-6 backdrop-blur-xl border-2 overflow-hidden transition-all ${
          isActive 
            ? 'border-white/50 bg-white/10' 
            : 'border-white/20 bg-white/5 hover:border-white/40 hover:bg-white/10'
        }`}
        data-testid={`mega-nav-${item.label.toLowerCase().replace(' ', '-')}`}
      >
        {/* Animated glow background */}
        <motion.div
          className="absolute inset-0 rounded-2xl blur-xl -z-10"
          style={{
            background: `rgba(${item.glow}, 0.2)`,
          }}
          animate={{
            opacity: [0.2, 0.4, 0.2],
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        {/* Icon with gradient */}
        <div className={`mb-3 w-12 h-12 rounded-xl bg-gradient-to-br ${item.gradient} flex items-center justify-center shadow-lg`}>
          <Icon className="w-6 h-6 text-white" />
        </div>

        {/* Label */}
        <div className="text-left">
          <p className="font-semibold text-foreground mb-1 flex items-center gap-2">
            {item.label}
            {item.pro && (
              <Badge variant="secondary" className="text-xs px-1.5 py-0">
                PRO
              </Badge>
            )}
          </p>
        </div>

        {/* Shine effect on hover */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
          initial={{ x: '-100%', opacity: 0 }}
          whileHover={{ x: '100%', opacity: 1 }}
          transition={{ duration: 0.6 }}
        />
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
        className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all hover-elevate active-elevate-2 ${
          isActive 
            ? 'bg-white/10 border-2 border-white/30' 
            : 'bg-transparent border-2 border-transparent hover:bg-white/5'
        }`}
        data-testid={`mobile-nav-${item.label.toLowerCase().replace(' ', '-')}`}
      >
        {/* Gradient Icon */}
        <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${item.gradient} flex items-center justify-center shadow-lg flex-shrink-0`}>
          <Icon className="w-5 h-5 text-white" />
        </div>

        {/* Label */}
        <span className="font-medium text-foreground flex-1 text-left">
          {item.label}
        </span>

        {item.pro && (
          <Badge variant="secondary" className="text-xs px-1.5 py-0">
            PRO
          </Badge>
        )}
      </button>
    );
  };

  return (
    <nav className="sticky top-0 z-50 w-full backdrop-blur-2xl bg-background/70 border-b border-white/10 shadow-[0_8px_32px_rgba(181,101,216,0.15)]">
      {/* Gradient accent line */}
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[hsl(var(--gold))]/50 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button
            onClick={() => handleNavClick("/")}
            className="text-xl sm:text-2xl font-serif font-bold bg-gradient-to-r from-[#FFD700] via-[#FFF] to-[#FFD700] bg-clip-text text-transparent cursor-pointer hover-elevate active-elevate-2 px-3 py-2 rounded-md"
            data-testid="link-home"
          >
            <span className="hidden sm:inline">MetaHers Mind Spa</span>
            <span className="sm:hidden">MetaHers</span>
          </button>

          {/* Desktop Navigation - Mega Menu */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Global Search */}
            <div className="w-64">
              <GlobalSearch />
            </div>

            {/* Explore Menu Button */}
            <div className="relative">
              <Button
                onClick={() => setMegaMenuOpen(!megaMenuOpen)}
                variant="ghost"
                size="sm"
                className="gap-2"
                data-testid="button-explore-menu"
              >
                <Compass className="w-4 h-4" />
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
                      className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
                      onClick={() => setMegaMenuOpen(false)}
                    />

                    {/* Mega Menu Content */}
                    <motion.div
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full right-0 mt-2 w-[600px] max-w-[calc(100vw-2rem)] backdrop-blur-2xl bg-background/95 border border-white/20 rounded-3xl shadow-2xl p-8 z-50"
                    >
                      {/* Categories */}
                      {Object.entries(navCategories).map(([category, items]) => (
                        items.length > 0 && (
                          <div key={category} className="mb-8 last:mb-0">
                            <h3 className="text-sm font-semibold text-foreground/60 uppercase tracking-wider mb-4">
                              {category}
                            </h3>
                            <div className="grid grid-cols-3 gap-4">
                              {items.map((item) => (
                                <MegaMenuCard key={item.path} item={item} />
                              ))}
                            </div>
                          </div>
                        )
                      ))}

                      {/* Quick Links */}
                      <div className="border-t border-white/10 pt-6 mt-6">
                        <div className="flex items-center gap-2">
                          <Button
                            onClick={() => handleNavClick("/upgrade")}
                            variant="default"
                            size="sm"
                            className="gap-2"
                            data-testid="mega-nav-pricing"
                          >
                            <Crown className="w-4 h-4" />
                            View Pricing
                          </Button>
                          {isAuthenticated && (
                            <Button
                              onClick={() => handleNavClick("/account")}
                              variant="ghost"
                              size="sm"
                              className="gap-2"
                              data-testid="mega-nav-account"
                            >
                              <User className="w-4 h-4" />
                              Account
                            </Button>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* Auth buttons */}
            {!isAuthenticated && !isLoading && (
              <Button
                onClick={() => {
                  trackCTAClick('nav_login', '/login');
                  setLocation("/login");
                }}
                variant="default"
                size="sm"
                className="gap-2"
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
                className="gap-2"
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
                    className="text-[#25D366]"
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
          <div className="lg:hidden flex items-center gap-2">
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
                    {/* All categories in mobile */}
                    {Object.entries(navCategories).map(([category, items]) => (
                      items.length > 0 && (
                        <div key={category} className="mb-4">
                          <h3 className="text-xs font-semibold text-foreground/50 uppercase tracking-wider mb-3 px-2">
                            {category}
                          </h3>
                          <div className="space-y-2">
                            {items.map((item) => (
                              <MobileNavItem key={item.path} item={item} />
                            ))}
                          </div>
                        </div>
                      )
                    ))}

                    {/* Pricing link */}
                    <div className="border-t border-border pt-4 mt-2">
                      <MobileNavItem item={{
                        path: "/upgrade",
                        label: "Pricing",
                        icon: ArrowUpCircle,
                        gradient: "from-yellow-500 to-amber-600",
                      }} />
                    </div>

                    {/* WhatsApp Retreat */}
                    <a
                      href="https://chat.whatsapp.com/Gc0QaGWvbCUJFytDiaRwRZ?mode=wwt"
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => trackCTAClick('mobile_whatsapp_retreat', 'whatsapp_retreat', 'free')}
                      className="block"
                      data-testid="link-mobile-whatsapp"
                    >
                      <div className="flex items-center gap-3 p-3 rounded-xl bg-[#25D366]/10 border-2 border-[#25D366]/30 hover-elevate active-elevate-2 transition-all">
                        <div className="w-10 h-10 rounded-lg bg-[#25D366] flex items-center justify-center shadow-lg flex-shrink-0">
                          <SiWhatsapp className="w-5 h-5 text-white" />
                        </div>
                        <span className="font-medium text-foreground flex-1 text-left">
                          Free AI Retreat
                        </span>
                        <Badge variant="secondary" className="text-xs px-1.5 py-0">
                          FREE
                        </Badge>
                      </div>
                    </a>

                    {/* Account link if authenticated */}
                    {isAuthenticated && (
                      <MobileNavItem item={{
                        path: "/account",
                        label: "Account",
                        icon: User,
                        gradient: "from-slate-500 to-gray-600",
                      }} />
                    )}

                    {/* Companion Link */}
                    <Link href="/companion" className="hover-elevate">
                      <a className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                        location === "/companion" ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                      }`}>
                        <Sparkles className="w-5 h-5" />
                        <span>Companion</span>
                      </a>
                    </Link>
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
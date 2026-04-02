import { useState } from "react";
import { useLocation } from "wouter";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useAuth } from "@/hooks/useAuth";
import { trackCTAClick } from "@/lib/analytics";

const COMMUNITY_URL = "https://chat.whatsapp.com/H4i0qBv7WGZDse1QNQPJdc?mode=gi_t";

export function Navigation() {
  const [location, setLocation] = useLocation();
  const { isAuthenticated, isLoading } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (path: string) => {
    setLocation(path);
    setMobileMenuOpen(false);
  };

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      if (response.ok) {
        window.location.href = "/";
      }
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const isActive = (path: string) =>
    location === path || (path !== "/" && location.startsWith(path));

  const authNavItems = [
    { label: "Dashboard", path: "/dashboard" },
    { label: "Learn", path: "/learning-hub" },
    { label: "Journal", path: "/journal" },
    { label: "Community", path: COMMUNITY_URL, external: true },
    { label: "Account", path: "/account" },
  ];

  const publicNavItems = [
    { label: "Home", path: "/" },
    { label: "Learn", path: "/learning-hub" },
    { label: "Blog", path: "/blog" },
  ];

  return (
    <nav
      className="sticky top-0 z-50 w-full border-b"
      style={{ background: "#FEFEFE", borderColor: "#E8E8E8" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button
            onClick={() => handleNavClick(isAuthenticated ? "/dashboard" : "/")}
            className="cursor-pointer"
            style={{
              fontFamily: "Georgia, 'Playfair Display', serif",
              color: "#1A1A2E",
              fontSize: "20px",
              fontWeight: "600",
              letterSpacing: "-0.01em",
            }}
            data-testid="link-home"
          >
            MetaHers
          </button>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-7">
            {!isLoading && isAuthenticated ? (
              <>
                {authNavItems.map((item) =>
                  item.external ? (
                    <a
                      key={item.label}
                      href={item.path}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => trackCTAClick("nav_community", item.path)}
                      style={{ color: "#6B6B7B", fontSize: "13px" }}
                      className="font-medium transition-colors hover:text-[#1A1A2E]"
                    >
                      {item.label}
                    </a>
                  ) : (
                    <button
                      key={item.label}
                      onClick={() => handleNavClick(item.path)}
                      style={{
                        color: isActive(item.path) ? "#C9A96E" : "#6B6B7B",
                        fontSize: "13px",
                        fontWeight: isActive(item.path) ? "600" : "400",
                        borderBottom: isActive(item.path) ? "2px solid #C9A96E" : "2px solid transparent",
                        paddingBottom: "2px",
                      }}
                      className="transition-colors hover:text-[#1A1A2E]"
                      data-testid={`nav-${item.label.toLowerCase()}`}
                    >
                      {item.label}
                    </button>
                  )
                )}
                <button
                  onClick={handleLogout}
                  style={{ color: "#6B6B7B", fontSize: "13px" }}
                  className="font-medium transition-colors hover:text-[#1A1A2E]"
                  data-testid="button-logout"
                >
                  Log Out
                </button>
              </>
            ) : !isLoading ? (
              <>
                {publicNavItems.map((item) => (
                  <button
                    key={item.label}
                    onClick={() => handleNavClick(item.path)}
                    style={{
                      color: isActive(item.path) ? "#1A1A2E" : "#6B6B7B",
                      fontSize: "13px",
                      fontWeight: isActive(item.path) ? "600" : "400",
                    }}
                    className="transition-colors hover:text-[#1A1A2E]"
                    data-testid={`nav-${item.label.toLowerCase()}`}
                  >
                    {item.label}
                  </button>
                ))}
                <button
                  onClick={() => {
                    trackCTAClick("nav_login", "/login");
                    handleNavClick("/login");
                  }}
                  style={{ color: "#6B6B7B", fontSize: "13px" }}
                  className="font-medium transition-colors hover:text-[#1A1A2E]"
                  data-testid="button-login-nav"
                >
                  Log In
                </button>
                <button
                  onClick={() => {
                    trackCTAClick("nav_signup", "/signup");
                    handleNavClick("/signup");
                  }}
                  className="px-4 py-2 rounded font-semibold uppercase tracking-widest transition-opacity hover:opacity-90"
                  style={{
                    background: "#C9A96E",
                    color: "#1A1A2E",
                    fontSize: "11px",
                    letterSpacing: "0.1em",
                  }}
                  data-testid="button-join-free-nav"
                >
                  Join Free
                </button>
              </>
            ) : null}
          </div>

          {/* Mobile Menu */}
          <div className="lg:hidden">
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  style={{ color: "#1A1A2E" }}
                  data-testid="button-mobile-menu"
                >
                  {mobileMenuOpen ? (
                    <X className="w-5 h-5" />
                  ) : (
                    <Menu className="w-5 h-5" />
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="w-[280px] p-0"
                style={{ background: "#FEFEFE" }}
              >
                <div className="flex flex-col h-full p-6">
                  <div className="mb-8 pt-2">
                    <p
                      style={{
                        fontFamily: "Georgia, serif",
                        color: "#1A1A2E",
                        fontSize: "20px",
                        fontWeight: "600",
                      }}
                    >
                      MetaHers
                    </p>
                  </div>

                  <div className="flex-1 space-y-1">
                    {isAuthenticated ? (
                      <>
                        {authNavItems.map((item) =>
                          item.external ? (
                            <a
                              key={item.label}
                              href={item.path}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block w-full text-left py-3 px-2 rounded transition-colors"
                              style={{ color: "#6B6B7B", fontSize: "14px" }}
                              onClick={() => setMobileMenuOpen(false)}
                            >
                              {item.label}
                            </a>
                          ) : (
                            <button
                              key={item.label}
                              onClick={() => handleNavClick(item.path)}
                              className="block w-full text-left py-3 px-2 rounded transition-colors"
                              style={{
                                color: isActive(item.path)
                                  ? "#1A1A2E"
                                  : "#6B6B7B",
                                fontSize: "14px",
                                fontWeight: isActive(item.path) ? "600" : "400",
                              }}
                              data-testid={`mobile-nav-${item.label.toLowerCase()}`}
                            >
                              {item.label}
                            </button>
                          )
                        )}
                        <button
                          onClick={handleLogout}
                          className="block w-full text-left py-3 px-2 rounded transition-colors"
                          style={{ color: "#6B6B7B", fontSize: "14px" }}
                          data-testid="button-mobile-logout"
                        >
                          Log Out
                        </button>
                      </>
                    ) : (
                      <>
                        {publicNavItems.map((item) => (
                          <button
                            key={item.label}
                            onClick={() => handleNavClick(item.path)}
                            className="block w-full text-left py-3 px-2 rounded transition-colors"
                            style={{
                              color: isActive(item.path)
                                ? "#1A1A2E"
                                : "#6B6B7B",
                              fontSize: "14px",
                              fontWeight: isActive(item.path) ? "600" : "400",
                            }}
                            data-testid={`mobile-nav-${item.label.toLowerCase()}`}
                          >
                            {item.label}
                          </button>
                        ))}
                        <button
                          onClick={() => {
                            trackCTAClick("nav_login_mobile", "/login");
                            handleNavClick("/login");
                          }}
                          className="block w-full text-left py-3 px-2 rounded transition-colors"
                          style={{ color: "#6B6B7B", fontSize: "14px" }}
                          data-testid="button-mobile-login"
                        >
                          Log In
                        </button>
                      </>
                    )}
                  </div>

                  {!isAuthenticated && (
                    <div
                      className="pt-4"
                      style={{ borderTop: "1px solid #E8E8E8" }}
                    >
                      <button
                        onClick={() => {
                          trackCTAClick("nav_signup_mobile", "/signup");
                          handleNavClick("/signup");
                        }}
                        className="w-full py-3 rounded font-semibold uppercase tracking-widest transition-opacity hover:opacity-90"
                        style={{
                          background: "#C9A96E",
                          color: "#1A1A2E",
                          fontSize: "12px",
                          letterSpacing: "0.1em",
                        }}
                        data-testid="button-mobile-join-free"
                      >
                        Join Free
                      </button>
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}

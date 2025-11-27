import { useLocation, Link } from "wouter";
import { Heart } from "lucide-react";

export function Footer() {
  const [location] = useLocation();

  // Don't show footer on auth pages
  if (["/login", "/signup", "/forgot-password", "/reset-password"].includes(location)) {
    return null;
  }

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-background border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div>
            <h3 className="text-lg font-bold text-white mb-4 drop-shadow-md">MetaHers Mind Spa</h3>
            <p className="text-white/70 text-sm leading-relaxed">
              Luxury AI & Web3 education for women solopreneurs, moms, and creatives.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-white/90 uppercase tracking-wider mb-4">Quick Links</h4>
            <nav className="space-y-2">
              <Link href="/world" className="text-white/70 hover:text-yellow-400 transition-colors text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 rounded px-2 py-1 inline-block">
                MetaHers World
              </Link>
              <br />
              <Link href="/retreat" className="text-white/70 hover:text-yellow-400 transition-colors text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 rounded px-2 py-1 inline-block">
                Free AI Retreat
              </Link>
              <br />
              <Link href="/companion" className="text-white/70 hover:text-yellow-400 transition-colors text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 rounded px-2 py-1 inline-block">
                AI Companion
              </Link>
            </nav>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-sm font-semibold text-white/90 uppercase tracking-wider mb-4">Legal</h4>
            <nav className="space-y-2">
              <Link href="/privacy" className="text-white/70 hover:text-yellow-400 transition-colors text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 rounded px-2 py-1 inline-block">
                Privacy Policy
              </Link>
              <br />
              <Link href="/terms" className="text-white/70 hover:text-yellow-400 transition-colors text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 rounded px-2 py-1 inline-block">
                Terms of Service
              </Link>
              <br />
              <a href="mailto:support@metahers.ai" className="text-white/70 hover:text-yellow-400 transition-colors text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 rounded px-2 py-1 inline-block">
                Contact Support
              </a>
            </nav>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/10 pt-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-white/60 text-sm text-center sm:text-left">
              © {currentYear} MetaHers Mind Spa. All rights reserved.
            </p>
            <div className="flex items-center gap-2 text-white/60 text-sm">
              <span>Made with</span>
              <Heart className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              <span>for women solopreneurs</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

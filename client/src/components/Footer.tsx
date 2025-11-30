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
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div>
            <h3 className="text-lg font-bold text-black mb-4">MetaHers Mind Spa</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Luxury AI & Web3 education for women solopreneurs, moms, and creatives.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-gray-800 uppercase tracking-wider mb-4">Quick Links</h4>
            <nav className="space-y-2">
              <Link href="/world" className="text-gray-600 hover:text-purple-600 transition-colors text-sm focus:outline-none focus:ring-2 focus:ring-purple-600 rounded px-2 py-1 inline-block">
                MetaHers World
              </Link>
              <br />
              <Link href="/retreat" className="text-gray-600 hover:text-purple-600 transition-colors text-sm focus:outline-none focus:ring-2 focus:ring-purple-600 rounded px-2 py-1 inline-block">
                Free AI Retreat
              </Link>
              <br />
              <Link href="/companion" className="text-gray-600 hover:text-purple-600 transition-colors text-sm focus:outline-none focus:ring-2 focus:ring-purple-600 rounded px-2 py-1 inline-block">
                AI Companion
              </Link>
            </nav>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-sm font-semibold text-gray-800 uppercase tracking-wider mb-4">Legal</h4>
            <nav className="space-y-2">
              <Link href="/privacy" className="text-gray-600 hover:text-purple-600 transition-colors text-sm focus:outline-none focus:ring-2 focus:ring-purple-600 rounded px-2 py-1 inline-block">
                Privacy Policy
              </Link>
              <br />
              <Link href="/terms" className="text-gray-600 hover:text-purple-600 transition-colors text-sm focus:outline-none focus:ring-2 focus:ring-purple-600 rounded px-2 py-1 inline-block">
                Terms of Service
              </Link>
              <br />
              <a href="mailto:support@metahers.ai" className="text-gray-600 hover:text-purple-600 transition-colors text-sm focus:outline-none focus:ring-2 focus:ring-purple-600 rounded px-2 py-1 inline-block">
                Contact Support
              </a>
            </nav>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200 pt-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-gray-500 text-sm text-center sm:text-left">
              © {currentYear} MetaHers Mind Spa. All rights reserved.
            </p>
            <div className="flex items-center gap-2 text-gray-500 text-sm">
              <span>Made with</span>
              <Heart className="w-4 h-4 text-purple-600 fill-purple-600" />
              <span>for women solopreneurs</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

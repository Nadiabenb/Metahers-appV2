import { useLocation, Link } from "wouter";

const DARK_BG = "#0A0614";
const PINK = "#EC4899";

export function Footer() {
  const [location] = useLocation();

  // Don't show footer on auth pages
  if (["/login", "/signup", "/forgot-password", "/reset-password"].includes(location)) {
    return null;
  }

  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-3 px-6 lg:px-16 border-t" style={{ background: DARK_BG, borderColor: 'rgba(255,255,255,0.1)' }}>
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <p className="text-sm font-semibold" style={{ color: '#FFFFFF' }}>
              MetaHers <span style={{ color: PINK }}>Mind Spa</span>
            </p>
          </div>
          
          <div className="flex gap-4 text-xs" style={{ color: 'rgba(255,255,255,0.6)' }}>
            <Link href="/privacy" className="hover:opacity-100 transition-opacity" style={{ color: 'inherit' }} data-testid="link-privacy">
              Privacy
            </Link>
            <Link href="/terms" className="hover:opacity-100 transition-opacity" style={{ color: 'inherit' }} data-testid="link-terms">
              Terms
            </Link>
            <a href="mailto:support@metahers.ai" className="hover:opacity-100 transition-opacity" style={{ color: 'inherit' }} data-testid="link-contact">
              Contact
            </a>
          </div>
        </div>
        
        <div className="mt-2 pt-2 border-t text-center" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
          <p className="text-xs font-light" style={{ color: 'rgba(255,255,255,0.4)' }}>
            © {currentYear} MetaHers. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

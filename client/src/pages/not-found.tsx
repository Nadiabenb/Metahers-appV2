import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center px-6" style={{ background: '#0D0B14' }}>
      <div className="text-center max-w-md">
        <div className="w-16 h-16 mx-auto mb-6 rounded-full flex items-center justify-center" style={{ background: 'rgba(232,121,249,0.1)', border: '1px solid rgba(232,121,249,0.2)' }}>
          <AlertCircle className="h-7 w-7" style={{ color: '#E879F9' }} />
        </div>
        <h1 className="text-3xl mb-3" style={{ fontFamily: 'Playfair Display, serif', color: '#FFFFFF', fontWeight: 300 }} data-testid="text-404-title">
          Page Not Found
        </h1>
        <p className="text-sm mb-8" style={{ color: 'rgba(255,255,255,0.5)' }} data-testid="text-404-message">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link href="/">
          <Button variant="outline" className="uppercase tracking-wider text-xs" data-testid="button-go-home">
            Return Home
          </Button>
        </Link>
      </div>
    </div>
  );
}

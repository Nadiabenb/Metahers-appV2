import { useEffect } from "react";
import { Link, useLocation } from "wouter";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";

export default function AccountPage() {
  const [, setLocation] = useLocation();

  useEffect(() => {
    setLocation("/dashboard");
  }, [setLocation]);

  return (
    <div className="min-h-screen bg-[#0D0B14] text-white">
      <SEO
        title="Account details moved — MetaHers"
        description="Account details now live in your Dashboard."
      />
      <div className="max-w-xl mx-auto px-6 py-20 text-center">
        <h1 className="text-3xl font-light mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
          Account details now live in your Dashboard.
        </h1>
        <p className="text-white/55 text-sm mb-6">
          Redirecting you there now.
        </p>
        <Link href="/dashboard">
          <Button className="font-semibold uppercase tracking-widest text-xs px-6" style={{ background: "#C9A96E", color: "#1A1A2E" }}>
            Go to Dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
}

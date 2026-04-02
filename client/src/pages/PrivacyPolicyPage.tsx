import { SEO } from "@/components/SEO";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-background py-16 px-4 md:px-8">
      <SEO 
        title="Privacy Policy - MetaHers"
        description="Privacy policy for MetaHers. Learn how we collect, use, and protect your data."
      />
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-foreground">Privacy Policy</h1>
        <div className="prose prose-invert max-w-none">
          <p className="text-foreground/90 mb-6"><strong>Effective Date: November 2024</strong></p>

          <h2 className="text-2xl font-semibold mt-8 mb-4 text-foreground">1. Introduction</h2>
          <p className="text-foreground/80 mb-4">MetaHers ("we", "us", "our", or "Company") operates the MetaHers mobile application and website. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our Service.</p>

          <h2 className="text-2xl font-semibold mt-8 mb-4 text-foreground">2. Information We Collect</h2>
          <p className="text-foreground/80 mb-4">We may collect information about you in a variety of ways:</p>
          <ul className="list-disc pl-6 text-foreground/80 mb-4">
            <li>Account Registration: name, email, phone number, password</li>
            <li>Profile Information: learning preferences, goals, progress</li>
            <li>Usage Data: pages visited, time spent, features used</li>
            <li>Device Information: device type, OS, IP address, browser type</li>
            <li>Payment Information: processed securely through Stripe (we do not store full credit card details)</li>
            <li>Communication: feedback, support requests, emails</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-8 mb-4 text-foreground">3. How We Use Your Information</h2>
          <ul className="list-disc pl-6 text-foreground/80 mb-4">
            <li>Provide, maintain, and improve our Service</li>
            <li>Process transactions and send related information</li>
            <li>Send marketing communications (only if you opt-in)</li>
            <li>Respond to your inquiries and support requests</li>
            <li>Analyze usage patterns to enhance user experience</li>
            <li>Comply with legal obligations</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-8 mb-4 text-foreground">4. Data Security</h2>
          <p className="text-foreground/80 mb-4">We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. All data transmissions use HTTPS encryption. However, no method of transmission over the Internet is 100% secure.</p>

          <h2 className="text-2xl font-semibold mt-8 mb-4 text-foreground">5. Third-Party Services</h2>
          <p className="text-foreground/80 mb-4">We use the following third-party services:</p>
          <ul className="list-disc pl-6 text-foreground/80 mb-4">
            <li><strong>Stripe</strong>: Payment processing (see Stripe's privacy policy)</li>
            <li><strong>Google Analytics</strong>: Usage analytics</li>
            <li><strong>Resend</strong>: Email delivery</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-8 mb-4 text-foreground">6. Children's Privacy</h2>
          <p className="text-foreground/80 mb-4">Our Service is not intended for users under 13 years of age. We do not knowingly collect personal information from children under 13. If we become aware of such collection, we will delete such information immediately.</p>

          <h2 className="text-2xl font-semibold mt-8 mb-4 text-foreground">7. Your Rights</h2>
          <p className="text-foreground/80 mb-4">You have the right to:</p>
          <ul className="list-disc pl-6 text-foreground/80 mb-4">
            <li>Access your personal information</li>
            <li>Request correction of inaccurate data</li>
            <li>Request deletion of your data</li>
            <li>Opt-out of marketing communications</li>
            <li>Request data portability</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-8 mb-4 text-foreground">8. Contact Us</h2>
          <p className="text-foreground/80 mb-4">If you have questions about this Privacy Policy, please contact us at:</p>
          <p className="text-foreground/80">Email: support@metahers.ai</p>

          <h2 className="text-2xl font-semibold mt-8 mb-4 text-foreground">9. Changes to This Policy</h2>
          <p className="text-foreground/80 mb-4">We may update this Privacy Policy periodically. Your continued use of the Service following any changes constitutes your acceptance of the new Privacy Policy.</p>
        </div>
      </div>
    </div>
  );
}

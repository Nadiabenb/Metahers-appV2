import { SEO } from "@/components/SEO";

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-background py-16 px-4 md:px-8">
      <SEO 
        title="Terms of Service - MetaHers Mind Spa"
        description="Terms of Service for MetaHers Mind Spa. Read our complete terms and conditions."
      />
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-foreground">Terms of Service</h1>
        <div className="prose prose-invert max-w-none">
          <p className="text-foreground/90 mb-6"><strong>Effective Date: November 2024</strong></p>

          <h2 className="text-2xl font-semibold mt-8 mb-4 text-foreground">1. Acceptance of Terms</h2>
          <p className="text-foreground/80 mb-4">By accessing and using MetaHers Mind Spa ("Service"), you accept and agree to be bound by these Terms of Service ("Terms"). If you do not agree to abide by these Terms, you are not authorized to use this Service.</p>

          <h2 className="text-2xl font-semibold mt-8 mb-4 text-foreground">2. User Accounts</h2>
          <p className="text-foreground/80 mb-4">To access certain features of the Service, you may be required to create an account. You are responsible for maintaining the confidentiality of your account credentials and are fully responsible for all activities that occur under your account. You agree to:</p>
          <ul className="list-disc pl-6 text-foreground/80 mb-4">
            <li>Provide accurate and complete information</li>
            <li>Keep your password confidential</li>
            <li>Notify us immediately of any unauthorized access</li>
            <li>Not allow others to use your account</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-8 mb-4 text-foreground">3. Acceptable Use</h2>
          <p className="text-foreground/80 mb-4">You agree not to:</p>
          <ul className="list-disc pl-6 text-foreground/80 mb-4">
            <li>Use the Service for any illegal or unauthorized purpose</li>
            <li>Attempt to disrupt, damage, or interfere with the Service</li>
            <li>Engage in harassment, abuse, or hateful conduct</li>
            <li>Reverse engineer or attempt to access source code</li>
            <li>Share your account with unauthorized third parties</li>
            <li>Scrape or automatically access Service content</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-8 mb-4 text-foreground">4. Intellectual Property Rights</h2>
          <p className="text-foreground/80 mb-4">All content, features, and functionality of the Service (including but not limited to software, text, images, videos, and logos) are owned by MetaHers, its licensors, or other providers of such material and are protected by copyright, trademark, and other intellectual property laws.</p>

          <h2 className="text-2xl font-semibold mt-8 mb-4 text-foreground">5. User-Generated Content</h2>
          <p className="text-foreground/80 mb-4">By uploading or submitting content to the Service, you grant us a license to use, reproduce, modify, and distribute such content. You represent and warrant that you own or have the necessary rights to such content.</p>

          <h2 className="text-2xl font-semibold mt-8 mb-4 text-foreground">6. Free and Paid Services</h2>
          <p className="text-foreground/80 mb-4">We offer both free and premium content. Premium features require a paid subscription. All pricing is subject to change with notice. Cancellations must be made through your account settings.</p>

          <h2 className="text-2xl font-semibold mt-8 mb-4 text-foreground">7. Disclaimers</h2>
          <p className="text-foreground/80 mb-4">THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND. WE DISCLAIM ALL IMPLIED WARRANTIES, INCLUDING FITNESS FOR A PARTICULAR PURPOSE AND NON-INFRINGEMENT. We are not responsible for:</p>
          <ul className="list-disc pl-6 text-foreground/80 mb-4">
            <li>Errors or omissions in educational content</li>
            <li>Your application of information provided</li>
            <li>Third-party links or services</li>
            <li>Any financial, legal, or career outcomes</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-8 mb-4 text-foreground">8. Limitation of Liability</h2>
          <p className="text-foreground/80 mb-4">IN NO EVENT SHALL METAHERS BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, OR CONSEQUENTIAL DAMAGES ARISING FROM YOUR USE OF THE SERVICE.</p>

          <h2 className="text-2xl font-semibold mt-8 mb-4 text-foreground">9. Indemnification</h2>
          <p className="text-foreground/80 mb-4">You agree to indemnify and hold MetaHers harmless from any claims, damages, or expenses arising from your use of the Service or violation of these Terms.</p>

          <h2 className="text-2xl font-semibold mt-8 mb-4 text-foreground">10. Termination</h2>
          <p className="text-foreground/80 mb-4">We may terminate or suspend your account immediately, without prior notice or liability, for violation of these Terms or for any other reason at our sole discretion.</p>

          <h2 className="text-2xl font-semibold mt-8 mb-4 text-foreground">11. Governing Law</h2>
          <p className="text-foreground/80 mb-4">These Terms are governed by and construed in accordance with the laws of the United States.</p>

          <h2 className="text-2xl font-semibold mt-8 mb-4 text-foreground">12. Contact Information</h2>
          <p className="text-foreground/80">For questions about these Terms, please contact us at support@metahers.ai</p>
        </div>
      </div>
    </div>
  );
}

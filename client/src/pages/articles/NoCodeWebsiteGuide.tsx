import { Globe, Code2, Zap, Rocket, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { SEO } from "@/components/SEO";

export default function NoCodeWebsiteGuide() {
  return (
    <div className="min-h-screen bg-white">
      <SEO 
        title="No-Code Website Building with AI | MetaHers Mind Spa"
        description="Build a professional website without coding. Learn to use Webflow, Framer, and AI tools to launch your business online in days, not months."
      />
      
      {/* Hero */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Badge className="mb-4 bg-purple-100 text-purple-700 hover:bg-purple-200">WEEK 3 CURRICULUM</Badge>
        <h1 className="text-4xl sm:text-5xl font-bold text-black mb-4">
          No-Code Website Building with AI
        </h1>
        <p className="text-xl text-gray-600 mb-8 leading-relaxed">
          Launch a professional website that sells, without learning to code. Master modern no-code tools and AI to build your online business presence in days.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/learning-hub">
            <Button size="lg" className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700">
              <Globe className="w-4 h-4 mr-2" />
              Start Learning
            </Button>
          </Link>
          <a href="#topics" onClick={(e) => e.preventDefault()}>
            <Button size="lg" variant="outline" className="w-full sm:w-auto">
              <ChevronRight className="w-4 h-4 mr-2" />
              Explore Topics
            </Button>
          </a>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Why Website Matters */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-black mb-6">Your Website is Your 24/7 Sales Machine</h2>
          <div className="grid sm:grid-cols-2 gap-6">
            <Card className="p-6">
              <Rocket className="w-8 h-8 text-purple-600 mb-3" />
              <h3 className="font-semibold text-black mb-2">Launch Fast</h3>
              <p className="text-gray-600">No-code tools let you launch in days instead of months, getting revenue sooner.</p>
            </Card>
            <Card className="p-6">
              <Code2 className="w-8 h-8 text-purple-600 mb-3" />
              <h3 className="font-semibold text-black mb-2">Own Your Platform</h3>
              <p className="text-gray-600">Build on your own domain without relying on third-party social media platforms.</p>
            </Card>
          </div>
        </section>

        {/* Key Topics */}
        <section id="topics" className="mb-12">
          <h2 className="text-3xl font-bold text-black mb-8">Master These Topics</h2>
          <div className="space-y-6">
            
            <Card className="p-8 border-l-4 border-orange-500">
              <h3 className="text-2xl font-bold text-black mb-3">1. Platform Selection & Setup</h3>
              <p className="text-gray-600 mb-4">Choose the right tool for your business:</p>
              <ul className="space-y-2 text-gray-600 mb-6">
                <li className="flex items-center"><span className="text-purple-600 mr-3">✓</span> Webflow (full design control)</li>
                <li className="flex items-center"><span className="text-purple-600 mr-3">✓</span> Framer (AI-powered design)</li>
                <li className="flex items-center"><span className="text-purple-600 mr-3">✓</span> Wix/Squarespace (simplicity)</li>
                <li className="flex items-center"><span className="text-purple-600 mr-3">✓</span> Custom domain setup</li>
              </ul>
              <Badge variant="outline" className="text-orange-500 border-orange-500">Duration: 1.5 hours</Badge>
            </Card>

            <Card className="p-8 border-l-4 border-orange-500">
              <h3 className="text-2xl font-bold text-black mb-3">2. Website Structure & Copywriting</h3>
              <p className="text-gray-600 mb-4">Build pages that convert visitors:</p>
              <ul className="space-y-2 text-gray-600 mb-6">
                <li className="flex items-center"><span className="text-purple-600 mr-3">✓</span> Homepage that captures attention</li>
                <li className="flex items-center"><span className="text-purple-600 mr-3">✓</span> Service/product pages that sell</li>
                <li className="flex items-center"><span className="text-purple-600 mr-3">✓</span> About page that builds trust</li>
                <li className="flex items-center"><span className="text-purple-600 mr-3">✓</span> Lead capture & email integration</li>
              </ul>
              <Badge variant="outline" className="text-orange-500 border-orange-500">Duration: 2.5 hours</Badge>
            </Card>

            <Card className="p-8 border-l-4 border-orange-500">
              <h3 className="text-2xl font-bold text-black mb-3">3. Design Best Practices & AI Assistance</h3>
              <p className="text-gray-600 mb-4">Create beautiful websites without design skills:</p>
              <ul className="space-y-2 text-gray-600 mb-6">
                <li className="flex items-center"><span className="text-purple-600 mr-3">✓</span> Responsive design principles</li>
                <li className="flex items-center"><span className="text-purple-600 mr-3">✓</span> Layout & whitespace mastery</li>
                <li className="flex items-center"><span className="text-purple-600 mr-3">✓</span> Using AI design tools (v0, Galileo)</li>
                <li className="flex items-center"><span className="text-purple-600 mr-3">✓</span> Converting designs to websites</li>
              </ul>
              <Badge variant="outline" className="text-orange-500 border-orange-500">Duration: 2 hours</Badge>
            </Card>

            <Card className="p-8 border-l-4 border-orange-500">
              <h3 className="text-2xl font-bold text-black mb-3">4. Integrations & Going Live</h3>
              <p className="text-gray-600 mb-4">Connect everything and launch:</p>
              <ul className="space-y-2 text-gray-600 mb-6">
                <li className="flex items-center"><span className="text-purple-600 mr-3">✓</span> Email marketing integration (Mailchimp, ConvertKit)</li>
                <li className="flex items-center"><span className="text-purple-600 mr-3">✓</span> Payment processing (Stripe, PayPal)</li>
                <li className="flex items-center"><span className="text-purple-600 mr-3">✓</span> Analytics setup (Google Analytics)</li>
                <li className="flex items-center"><span className="text-purple-600 mr-3">✓</span> SEO optimization & launch checklist</li>
              </ul>
              <Badge variant="outline" className="text-orange-500 border-orange-500">Duration: 2 hours</Badge>
            </Card>
          </div>
        </section>

        {/* Pro Tips */}
        <section className="bg-purple-50 rounded-lg p-8 mb-12">
          <h2 className="text-2xl font-bold text-black mb-6">Pro Tips for Website Success</h2>
          <ul className="space-y-4">
            <li className="flex gap-4">
              <Zap className="w-5 h-5 text-purple-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-black mb-1">Start with a template</h3>
                <p className="text-gray-600">Templates save hours. Customize them to match your brand instead of building from scratch.</p>
              </div>
            </li>
            <li className="flex gap-4">
              <Zap className="w-5 h-5 text-purple-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-black mb-1">Focus on conversions first</h3>
                <p className="text-gray-600">A simple site that sells beats a fancy site that doesn't. Perfect is the enemy of done.</p>
              </div>
            </li>
            <li className="flex gap-4">
              <Zap className="w-5 h-5 text-purple-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-black mb-1">Use AI for copy</h3>
                <p className="text-gray-600">ChatGPT and Claude can help write sales copy, FAQ, and about pages in minutes.</p>
              </div>
            </li>
          </ul>
        </section>

        {/* Action Items */}
        <section className="bg-orange-50 rounded-lg p-8 mb-12">
          <h2 className="text-2xl font-bold text-black mb-6">Your Website Launch Timeline</h2>
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold">1</div>
              <div>
                <h3 className="font-semibold text-black mb-1">Day 1-2: Choose & set up platform</h3>
                <p className="text-gray-600">Pick your no-code tool, register domain, start with template</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold">2</div>
              <div>
                <h3 className="font-semibold text-black mb-1">Day 3-5: Create core pages</h3>
                <p className="text-gray-600">Homepage, services, about page, contact form</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold">3</div>
              <div>
                <h3 className="font-semibold text-black mb-1">Day 6-7: Integrate & optimize</h3>
                <p className="text-gray-600">Email, payments, analytics, SEO, then launch!</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <div className="text-center py-8">
          <h2 className="text-2xl font-bold text-black mb-4">Ready to Launch Your Website?</h2>
          <p className="text-gray-600 mb-6">Get step-by-step guidance from Nadia on building a website that attracts ideal clients.</p>
          <Link href="/learning-hub">
            <Button size="lg" className="bg-purple-600 hover:bg-purple-700">
              Start Your Website Today
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

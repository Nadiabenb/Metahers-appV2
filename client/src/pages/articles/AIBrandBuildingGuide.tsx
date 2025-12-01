import { Palette, Heart, Star, Target, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { SEO } from "@/components/SEO";

export default function AIBrandBuildingGuide() {
  return (
    <div className="min-h-screen bg-white">
      <SEO 
        title="Building Your AI-Powered Brand Identity | MetaHers Mind Spa"
        description="Master personal branding with AI tools. Create a magnetic brand that attracts ideal clients and stands out in a crowded market."
      />
      
      {/* Hero */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Badge className="mb-4 bg-purple-100 text-purple-700 hover:bg-purple-200">WEEK 2 CURRICULUM</Badge>
        <h1 className="text-4xl sm:text-5xl font-bold text-black mb-4">
          Building Your AI-Powered Brand
        </h1>
        <p className="text-xl text-gray-600 mb-8 leading-relaxed">
          Your brand is your competitive advantage. Learn how to build a magnetic, cohesive brand identity that attracts your ideal clients and stands out in a crowded marketplace.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/learning-hub">
            <Button size="lg" className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700">
              <Star className="w-4 h-4 mr-2" />
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
        {/* Why Brand Matters */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-black mb-6">Why Your Brand is Your Greatest Asset</h2>
          <div className="grid sm:grid-cols-2 gap-6">
            <Card className="p-6">
              <Heart className="w-8 h-8 text-purple-600 mb-3" />
              <h3 className="font-semibold text-black mb-2">Premium Positioning</h3>
              <p className="text-gray-600">A strong brand allows you to charge premium prices and attract high-value clients.</p>
            </Card>
            <Card className="p-6">
              <Target className="w-8 h-8 text-purple-600 mb-3" />
              <h3 className="font-semibold text-black mb-2">Client Magnetism</h3>
              <p className="text-gray-600">Your ideal clients find you naturally through your authentic, cohesive brand message.</p>
            </Card>
          </div>
        </section>

        {/* Key Topics */}
        <section id="topics" className="mb-12">
          <h2 className="text-3xl font-bold text-black mb-8">Master These Topics</h2>
          <div className="space-y-6">
            
            <Card className="p-8 border-l-4 border-pink-500">
              <h3 className="text-2xl font-bold text-black mb-3">1. Brand Discovery & Positioning</h3>
              <p className="text-gray-600 mb-4">Define your unique value proposition with AI insights:</p>
              <ul className="space-y-2 text-gray-600 mb-6">
                <li className="flex items-center"><span className="text-purple-600 mr-3">✓</span> Identify your core values & mission</li>
                <li className="flex items-center"><span className="text-purple-600 mr-3">✓</span> Find your unique angle in the market</li>
                <li className="flex items-center"><span className="text-purple-600 mr-3">✓</span> Create your brand story</li>
                <li className="flex items-center"><span className="text-purple-600 mr-3">✓</span> Develop your brand voice</li>
              </ul>
              <Badge variant="outline" className="text-pink-500 border-pink-500">Duration: 2 hours</Badge>
            </Card>

            <Card className="p-8 border-l-4 border-pink-500">
              <h3 className="text-2xl font-bold text-black mb-3">2. Visual Brand Identity Design</h3>
              <p className="text-gray-600 mb-4">Create stunning visuals without a designer:</p>
              <ul className="space-y-2 text-gray-600 mb-6">
                <li className="flex items-center"><span className="text-purple-600 mr-3">✓</span> Color psychology and palette selection</li>
                <li className="flex items-center"><span className="text-purple-600 mr-3">✓</span> Logo design with AI (Looka, Adobe Express)</li>
                <li className="flex items-center"><span className="text-purple-600 mr-3">✓</span> Typography & font selection</li>
                <li className="flex items-center"><span className="text-purple-600 mr-3">✓</span> Brand guidelines creation</li>
              </ul>
              <Badge variant="outline" className="text-pink-500 border-pink-500">Duration: 2.5 hours</Badge>
            </Card>

            <Card className="p-8 border-l-4 border-pink-500">
              <h3 className="text-2xl font-bold text-black mb-3">3. Personal Branding Strategy</h3>
              <p className="text-gray-600 mb-4">Build authority as a thought leader:</p>
              <ul className="space-y-2 text-gray-600 mb-6">
                <li className="flex items-center"><span className="text-purple-600 mr-3">✓</span> LinkedIn optimization & strategy</li>
                <li className="flex items-center"><span className="text-purple-600 mr-3">✓</span> Website messaging framework</li>
                <li className="flex items-center"><span className="text-purple-600 mr-3">✓</span> Your unique positioning statement</li>
                <li className="flex items-center"><span className="text-purple-600 mr-3">✓</span> Client testimonial & case studies</li>
              </ul>
              <Badge variant="outline" className="text-pink-500 border-pink-500">Duration: 3 hours</Badge>
            </Card>

            <Card className="p-8 border-l-4 border-pink-500">
              <h3 className="text-2xl font-bold text-black mb-3">4. Brand Consistency Across Channels</h3>
              <p className="text-gray-600 mb-4">Maintain your brand everywhere:</p>
              <ul className="space-y-2 text-gray-600 mb-6">
                <li className="flex items-center"><span className="text-purple-600 mr-3">✓</span> Brand templates for social media</li>
                <li className="flex items-center"><span className="text-purple-600 mr-3">✓</span> Email template design</li>
                <li className="flex items-center"><span className="text-purple-600 mr-3">✓</span> Presentation templates</li>
                <li className="flex items-center"><span className="text-purple-600 mr-3">✓</span> Brand asset management</li>
              </ul>
              <Badge variant="outline" className="text-pink-500 border-pink-500">Duration: 2 hours</Badge>
            </Card>
          </div>
        </section>

        {/* Action Items */}
        <section className="bg-purple-50 rounded-lg p-8 mb-12">
          <h2 className="text-2xl font-bold text-black mb-6">Your Brand-Building Checklist</h2>
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold">1</div>
              <div>
                <h3 className="font-semibold text-black mb-1">Define your brand</h3>
                <p className="text-gray-600">Complete the brand workbook with your values, mission, and unique angle</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold">2</div>
              <div>
                <h3 className="font-semibold text-black mb-1">Create visual identity</h3>
                <p className="text-gray-600">Design or generate your logo, color palette, and brand guidelines</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold">3</div>
              <div>
                <h3 className="font-semibold text-black mb-1">Build your online presence</h3>
                <p className="text-gray-600">Update LinkedIn, website, and social media with cohesive branding</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <div className="text-center py-8">
          <h2 className="text-2xl font-bold text-black mb-4">Ready to Build Your Magnetic Brand?</h2>
          <p className="text-gray-600 mb-6">Learn from Nadia and 500+ women solopreneurs who've built 6-7 figure businesses with AI-powered brands.</p>
          <Link href="/learning-hub">
            <Button size="lg" className="bg-purple-600 hover:bg-purple-700">
              Enroll in the Program
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

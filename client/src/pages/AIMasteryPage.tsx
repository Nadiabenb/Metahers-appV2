import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { Check, ArrowRight, MessageCircle, Users, TrendingUp, Clock, Zap, Award, Users2 } from "lucide-react";
import { SEO } from "@/components/SEO";
import nadiaPhotoUrl from "@assets/IMG_2303_1764551506250.jpeg";

export default function AIMasteryPage() {
  const [selectedOption, setSelectedOption] = useState<"one-time" | "payment-plan">(
    "one-time"
  );

  const benefits = [
    "AI-Generated Content Mastery",
    "Complete Branding Package",
    "Online Authority Building",
    "AI Agents & Automation",
    "Professional Website Creation",
  ];

  const features = [
    {
      category: "✨ AI-Generated Content Mastery",
      items: [
        "Create stunning photos that look professionally shot",
        "Produce engaging videos without expensive equipment",
        "Write compelling copy and social media content in minutes",
        "Never stare at a blank page again",
      ],
    },
    {
      category: "🎨 Complete Branding Package",
      items: [
        "Design professional logos that capture your essence",
        "Build a cohesive visual identity across all platforms",
        "Create brand assets that make you look like a million-dollar company",
        "Stand out in your industry with scroll-stopping visuals",
      ],
    },
    {
      category: "👑 Online Authority Building",
      items: [
        "Position yourself as the go-to expert in your niche",
        "Build a powerful personal brand that attracts opportunities",
        "Create content that establishes credibility and trust",
        "Develop a magnetic online presence",
      ],
    },
    {
      category: "🤖 AI Agents & Automation",
      items: [
        "Set up AI agents that handle repetitive tasks 24/7",
        "Automate customer service, scheduling, and workflows",
        "Free up 10+ hours per week to focus on growth",
        "Scale your business without hiring a team",
      ],
    },
    {
      category: "🌐 Professional Website Creation",
      items: [
        "Build a stunning personal or business website (no coding required)",
        "Create a digital home that converts visitors into clients",
        "Establish your online hub for all your offerings",
        "Launch your web presence with confidence",
      ],
    },
  ];

  const walkAway = [
    "Hands-on skills in the most powerful AI tools available today",
    "A complete brand identity (logo, colors, visual assets)",
    "A professional website that showcases your expertise",
    "AI automation systems running in your business",
    "Content creation skills that rival expensive agencies",
    "The confidence to leverage AI for any business goal",
  ];

  const faqs = [
    {
      question: "Do I need any tech experience?",
      answer:
        "Absolutely not! This program is designed for complete beginners. If you can use social media, you can use these AI tools.",
    },
    {
      question: "How long do I have access?",
      answer: "Lifetime access to all materials and any future updates.",
    },
    {
      question: "What if I don't have time right now?",
      answer:
        "You can start whenever you're ready. The content is self-paced, so you learn on your schedule.",
    },
    {
      question: "What if it doesn't work for me?",
      answer:
        "That's what the full refund guarantee is for. Try it risk-free.",
    },
    {
      question: "Can I really build a website with no coding skills?",
      answer: "Yes! I'll show you exactly how using no-code AI tools that make it simple.",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <SEO
        title="AI Mastery Program for Women Solopreneurs | $699 One-Time Investment"
        description="Master AI content creation, branding, web design & business automation in 4 weeks. Lifetime access. 100% refund guarantee. Only for women ready to scale without burnout."
      />

      {/* Hero Section */}
      <section className="relative bg-white pt-12 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-block mb-4 px-4 py-1 bg-red-50 rounded-full border border-red-200">
            <span className="text-sm font-semibold text-red-600">
              ⏰ Limited Spots Available This Year
            </span>
          </div>
          <h1 className="text-5xl sm:text-6xl font-bold text-black mb-6 leading-tight">
            From Overwhelmed to <span className="text-purple-600">AI-Empowered</span> in 4 Weeks
          </h1>
          <p className="text-2xl font-semibold text-black mb-4">
            Master the AI skills that will <span className="text-purple-600">define the next decade</span> of your business
          </p>
          <p className="text-lg text-gray-700 mb-6 max-w-3xl mx-auto leading-relaxed">
            No more expensive designers. No more struggling with content creation. No more watching others build empire while you're stuck in the grind. In 4 weeks, you'll have everything you need to create professional content, build authority, automate your business, and position yourself as the expert in your field.
          </p>
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-6 mb-8 max-w-2xl mx-auto">
            <p className="text-sm text-gray-600 mb-2">SPECIAL OFFER</p>
            <p className="text-4xl font-bold text-purple-600 mb-2">$699</p>
            <p className="text-gray-700 font-semibold">One-time investment for lifetime access</p>
            <p className="text-sm text-gray-600 mt-2">Or 3 payments of $233 if cash flow is tight</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <div className="flex items-center justify-center gap-2 text-gray-700">
              <Zap className="w-5 h-5 text-purple-600" />
              <span>Start immediately</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-gray-700">
              <Clock className="w-5 h-5 text-purple-600" />
              <span>Self-paced learning</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-gray-700">
              <Check className="w-5 h-5 text-purple-600" />
              <span>100% refund guarantee</span>
            </div>
          </div>
        </div>
      </section>

      {/* 4-Week Curriculum Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-purple-50 to-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-black mb-4 text-center">
            Your 4-Week Learning Path
          </h2>
          <p className="text-lg text-gray-600 mb-12 text-center max-w-3xl mx-auto">
            Each week builds on the last, transforming you from AI-curious to AI-confident
          </p>
          <div className="grid md:grid-cols-4 gap-6 mb-12">
            {[
              {
                week: 1,
                title: "AI Content Creation",
                description: "ChatGPT, Midjourney, AI video, copywriting that converts",
                slug: "ai-content-creation"
              },
              {
                week: 2,
                title: "Brand Building",
                description: "Visual identity, positioning, personal authority framework",
                slug: "ai-brand-building"
              },
              {
                week: 3,
                title: "Web Presence",
                description: "No-code website building, Webflow, conversions & SEO",
                slug: "no-code-websites"
              },
              {
                week: 4,
                title: "Business Automation",
                description: "AI agents, workflows, 20-30 hours/week time savings",
                slug: "ai-agents-automation"
              }
            ].map((module, idx) => (
              <Link key={idx} href={`/blog?article=${module.slug}`}>
                <Card className="p-6 border-purple-200 hover:shadow-lg transition-all cursor-pointer h-full">
                  <Badge className="bg-purple-600 mb-3">Week {module.week}</Badge>
                  <h3 className="text-lg font-bold text-black mb-3">{module.title}</h3>
                  <p className="text-gray-700 text-sm mb-4">{module.description}</p>
                  <p className="text-purple-600 text-sm font-semibold">Read full curriculum →</p>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-black mb-12 text-center">
            Here's Exactly What You're Getting
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {features.map((feature, idx) => (
              <div key={idx} className="bg-white p-8 rounded-lg border border-gray-200">
                <h3 className="text-lg font-semibold text-black mb-4">{feature.category}</h3>
                <ul className="space-y-3">
                  {feature.items.map((item, itemIdx) => (
                    <li key={itemIdx} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-purple-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-black mb-12 text-center">
            What Women Are Saying
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                quote: "I went from being intimidated by AI to creating professional content in days. The course is SO practical.",
                author: "Sarah M.",
                role: "Wellness Coach"
              },
              {
                quote: "My website used to cost $2,000 to build. I built it myself for free. And it converts better than my old one.",
                author: "Jessica L.",
                role: "Consultant"
              },
              {
                quote: "Automating my customer service freed up 15 hours a week. I'm not exaggerating—this changed my life.",
                author: "Maria C.",
                role: "Solopreneur"
              }
            ].map((testimonial, idx) => (
              <Card key={idx} className="p-6 border-purple-200">
                <p className="text-yellow-500 text-lg mb-4">★★★★★</p>
                <p className="text-gray-800 mb-4 italic">"{testimonial.quote}"</p>
                <div className="border-t border-gray-200 pt-4">
                  <p className="font-semibold text-black">{testimonial.author}</p>
                  <p className="text-sm text-gray-600">{testimonial.role}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ROI Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-black mb-12 text-center">
            The Real Value You're Getting
          </h2>
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <Card className="p-8 border-purple-200 bg-gradient-to-br from-purple-50 to-white">
              <h3 className="text-lg font-bold text-black mb-6">What You'd Pay Separately</h3>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-700">Professional graphic designer</span>
                  <span className="font-semibold text-gray-900">$1,500-3,000</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">Web designer (no-code site)</span>
                  <span className="font-semibold text-gray-900">$2,000-5,000</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">Copywriting course</span>
                  <span className="font-semibold text-gray-900">$297-697</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">Business automation setup</span>
                  <span className="font-semibold text-gray-900">$1,000-2,000</span>
                </div>
                <div className="flex justify-between border-t border-gray-300 pt-3">
                  <span className="font-bold text-black">Total Value</span>
                  <span className="font-bold text-purple-600 text-xl">$4,797-10,697</span>
                </div>
              </div>
            </Card>

            <Card className="p-8 border-purple-600 bg-gradient-to-br from-purple-50 to-white">
              <h3 className="text-lg font-bold text-black mb-6">What You Pay With AI Mastery</h3>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">AI Mastery Program (lifetime)</span>
                  <span className="font-bold text-purple-600 text-2xl">$699</span>
                </div>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-green-700 font-semibold">You Save: $4,098 - $9,998</p>
              </div>
              <p className="text-sm text-gray-600 mt-4">
                Plus you own the skills forever. No paying designers on repeat.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Promise Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-black mb-6">
            My Promise to You: 100% Satisfaction Guaranteed
          </h2>
          <p className="text-lg text-gray-700 mb-6 leading-relaxed">
            I'm so confident that I can help you transform your business with AI that I'm
            offering a <span className="font-semibold">full 30-day refund if you're not completely satisfied</span>.
          </p>
          <p className="text-base text-gray-600 mb-8">
            No questions asked. No hoops to jump through. I've helped 500+ women go from tech-overwhelmed to AI-empowered. I know what's possible with the right guidance, and I know I can help you too.
          </p>
          <Badge className="bg-green-100 text-green-700 px-4 py-2">
            ✓ Full refund guarantee · No questions asked
          </Badge>
        </div>
      </section>

      {/* Walk Away Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-purple-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-semibold text-black mb-8 text-center">
            You'll Walk Away With
          </h2>
          <div className="grid sm:grid-cols-2 gap-6">
            {walkAway.map((item, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <Check className="w-6 h-6 text-purple-600 flex-shrink-0 mt-0.5" />
                <p className="text-gray-800">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-semibold text-black mb-12 text-center">
            Choose Your Investment
          </h2>
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* Option 1 */}
            <div
              onClick={() => setSelectedOption("one-time")}
              className={`p-8 rounded-lg border-2 cursor-pointer transition-all ${
                selectedOption === "one-time"
                  ? "border-purple-600 bg-purple-50"
                  : "border-gray-200 bg-white hover:border-purple-300"
              }`}
            >
              <h3 className="text-xl font-semibold text-black mb-2">One-Time Payment</h3>
              <p className="text-4xl font-bold text-purple-600 mb-4">$699</p>
              <p className="text-gray-600 mb-6">Pay once, own it forever</p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center gap-2 text-gray-700">
                  <Check className="w-4 h-4 text-purple-600" />
                  Immediate full access to all modules
                </li>
                <li className="flex items-center gap-2 text-gray-700">
                  <Check className="w-4 h-4 text-purple-600" />
                  Best value option
                </li>
              </ul>
            </div>

            {/* Option 2 */}
            <div
              onClick={() => setSelectedOption("payment-plan")}
              className={`p-8 rounded-lg border-2 cursor-pointer transition-all ${
                selectedOption === "payment-plan"
                  ? "border-purple-600 bg-purple-50"
                  : "border-gray-200 bg-white hover:border-purple-300"
              }`}
            >
              <h3 className="text-xl font-semibold text-black mb-2">Payment Plan</h3>
              <p className="text-4xl font-bold text-purple-600 mb-1">3 × $233</p>
              <p className="text-sm text-gray-500 mb-4">/month</p>
              <p className="text-gray-600 mb-6">Same full access, spread the investment</p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center gap-2 text-gray-700">
                  <Check className="w-4 h-4 text-purple-600" />
                  Same full access
                </li>
                <li className="flex items-center gap-2 text-gray-700">
                  <Check className="w-4 h-4 text-purple-600" />
                  Start learning today
                </li>
              </ul>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-col gap-4">
            <Button
              className="w-full bg-black hover:bg-gray-900 text-white text-lg py-6 rounded-md font-semibold flex items-center justify-center gap-2"
              data-testid="button-enroll-ai-mastery"
            >
              Enroll Now - {selectedOption === "one-time" ? "$699 One Payment" : "3 × $233"}
              <ArrowRight className="w-5 h-5" />
            </Button>
            <Button
              variant="outline"
              className="w-full text-black border-black hover:bg-gray-50 text-lg py-6 rounded-md font-semibold"
              data-testid="button-questions"
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              Have Questions?
            </Button>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-semibold text-black mb-12 text-center">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            {faqs.map((faq, idx) => (
              <div key={idx} className="bg-white p-6 rounded-lg border border-gray-200">
                <h3 className="text-lg font-semibold text-black mb-2">{faq.question}</h3>
                <p className="text-gray-700">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who This Is For */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-semibold text-black mb-12 text-center">
            Who Is This For?
          </h2>
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div>
              <h3 className="font-semibold text-black mb-4">Perfect For:</h3>
              <ul className="space-y-3">
                {[
                  "Women entrepreneurs ready to scale without burnout",
                  "Business owners who want to compete with bigger brands",
                  "Solopreneurs who need to do more with less",
                  "Professionals building their personal brand",
                  "Anyone who knows AI is the future but doesn't know where to start",
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <span className="text-purple-600 font-bold">✨</span>
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-black mb-4">Not For:</h3>
              <ul className="space-y-3">
                {[
                  "People looking for a 'get rich quick' scheme",
                  "Those not willing to invest time in learning",
                  "Anyone expecting results without implementation",
                  "People who aren't ready to embrace new technology",
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <span className="text-gray-400 font-bold">❌</span>
                    <span className="text-gray-600">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-black mb-12 text-center">
            What Happens After You Enroll
          </h2>
          <div className="space-y-8">
            {[
              {
                day: "Today",
                title: "You Get Immediate Access",
                description: "Log in and start learning. All 4 weeks of content, tools, and resources are waiting for you right now."
              },
              {
                day: "Week 1",
                title: "Content Creation Skills",
                description: "You'll create your first AI-generated images, write copy, and produce video content. By week's end, you'll have a portfolio of content ready to share."
              },
              {
                day: "Week 2",
                title: "Build Your Brand",
                description: "Design your brand identity, refine your messaging, and position yourself as an expert. You'll have a complete brand guide."
              },
              {
                day: "Week 3",
                title: "Launch Your Website",
                description: "Build a professional website without any coding. By the end of week 3, you'll have a live site that converts visitors."
              },
              {
                day: "Week 4",
                title: "Automate Your Business",
                description: "Set up AI agents, automate workflows, and reclaim 20+ hours per week. Your business now runs smoother while you're not working."
              }
            ].map((step, idx) => (
              <div key={idx} className="flex gap-6">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-full bg-purple-600 text-white font-bold">
                    {idx + 1}
                  </div>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-purple-600 uppercase">{step.day}</p>
                  <h3 className="text-lg font-bold text-black mb-1">{step.title}</h3>
                  <p className="text-gray-700">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-purple-600 to-purple-700">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Ready to Make This Your Year?</h2>
          <p className="text-xl text-purple-100 mb-8 leading-relaxed">
            500+ women have transformed their businesses with this program. You could be next.
          </p>
          <div className="space-y-4 mb-12 text-left max-w-lg mx-auto bg-white/10 backdrop-blur-sm rounded-lg p-8 border border-white/20">
            <div className="flex items-start gap-3">
              <Check className="w-6 h-6 text-green-300 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-white">$699 one-time investment</p>
                <p className="text-purple-100 text-sm">Lifetime access. All future updates included.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Check className="w-6 h-6 text-green-300 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-white">30-day refund guarantee</p>
                <p className="text-purple-100 text-sm">No questions asked. Your confidence is guaranteed.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Check className="w-6 h-6 text-green-300 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-white">Start immediately</p>
                <p className="text-purple-100 text-sm">Begin learning the moment you enroll. No waiting.</p>
              </div>
            </div>
          </div>
          <Button
            className="bg-white hover:bg-gray-100 text-purple-600 text-lg px-12 py-7 rounded-md font-bold w-full sm:w-auto mb-4"
            data-testid="button-enroll-final"
          >
            Enroll Now & Start Learning Today
            <ArrowRight className="w-6 h-6 ml-2" />
          </Button>
          <p className="text-purple-100 text-sm">Limited spots available. This cohort closes soon.</p>
        </div>
      </section>

      {/* Meet Your Instructor Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-white to-purple-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl font-bold text-black mb-16 text-center">
            Meet Your Guide
          </h2>
          
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Photo */}
            <div className="flex justify-center md:order-first">
              <div className="relative w-full max-w-sm">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-purple-400 rounded-2xl blur-2xl opacity-20 -z-10"></div>
                <img
                  src={nadiaPhotoUrl}
                  alt="Nadia Ben Brahim - Founder of MetaHers"
                  className="w-full rounded-2xl shadow-xl object-cover"
                  data-testid="img-nadia-guide"
                />
              </div>
            </div>

            {/* Bio */}
            <div className="flex flex-col justify-center">
              <Badge className="w-fit bg-purple-100 text-purple-700 mb-4">
                <Award className="w-4 h-4 mr-2" />
                Founder & AI Strategist
              </Badge>
              
              <h3 className="text-3xl font-bold text-black mb-2">
                Nadia Ben Brahim
              </h3>
              <p className="text-lg text-purple-600 font-semibold mb-6">
                "The Mompreneur" — Founder of MetaHers
              </p>

              <div className="space-y-4 mb-8">
                <p className="text-gray-700 leading-relaxed">
                  I'm obsessed with demystifying emerging technologies and making them accessible to every woman with a vision. For the past 5+ years, I've helped <span className="font-semibold text-black">500+ women</span> transform their businesses using AI, Web3, and cutting-edge automation.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  As a mother, entrepreneur, and lifelong learner, I understand the unique challenges women face building businesses while managing everything else. I've walked that path, and I know what's possible when you have the right guidance and the right tools.
                </p>
              </div>

              {/* Credentials */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-white border border-purple-200 rounded-lg p-4">
                  <p className="text-2xl font-bold text-purple-600">500+</p>
                  <p className="text-sm text-gray-600">Women Transformed</p>
                </div>
                <div className="bg-white border border-purple-200 rounded-lg p-4">
                  <p className="text-2xl font-bold text-purple-600">5+</p>
                  <p className="text-sm text-gray-600">Years Teaching AI</p>
                </div>
              </div>

              {/* Quote */}
              <blockquote className="bg-purple-50 border-l-4 border-purple-600 pl-6 py-4 mb-6 rounded-r-lg">
                <p className="text-gray-800 italic text-lg font-medium mb-2">
                  "I don't just teach AI tools. I empower women to become unstoppable with them. Your success isn't just my goal—it's my mission."
                </p>
                <footer className="text-purple-600 font-semibold">— Nadia</footer>
              </blockquote>

              {/* CTA */}
              <p className="text-gray-700 mb-6">
                <span className="font-semibold">Ready to get expert guidance?</span> Enroll in AI Mastery and let me show you what's possible.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

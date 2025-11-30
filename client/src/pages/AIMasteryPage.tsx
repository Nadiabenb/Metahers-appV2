import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Check, ArrowRight, MessageCircle } from "lucide-react";

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
      {/* Hero Section */}
      <section className="relative bg-white pt-16 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-block mb-4 px-4 py-1 bg-purple-50 rounded-full border border-purple-200">
            <span className="text-sm font-semibold text-purple-600">
              Cyber Monday Exclusive
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-semibold text-black mb-6 leading-tight">
            Master AI Tools That Will <span className="text-purple-600">10X Your Business</span>
          </h1>
          <p className="text-lg text-gray-700 mb-4 max-w-2xl mx-auto">
            Transform Your Business with AI (Without Tech Skills)
          </p>
          <p className="text-xl font-semibold text-black mb-8">
            Limited Time Offer:{" "}
            <span className="text-purple-600">$699 One-Time Payment</span> or{" "}
            <span className="text-purple-600">3 Monthly Payments of $233</span>
          </p>
          <p className="text-gray-600 text-base max-w-2xl mx-auto leading-relaxed">
            What if you could create professional content, build your brand, automate your
            business, and establish yourself as an authority—all using AI tools you'll master in
            weeks, not years?
          </p>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-semibold text-black mb-12 text-center">
            Here's What You're Really Getting
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

      {/* Promise Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-semibold text-black mb-6">
            My Promise to You: 100% Satisfaction Guaranteed
          </h2>
          <p className="text-lg text-gray-700 mb-6 leading-relaxed">
            I'm so confident that I can help you transform your business with AI that I'm
            offering a <span className="font-semibold">full refund if you're not completely satisfied</span>.
          </p>
          <p className="text-base text-gray-600 mb-8">
            No questions asked. No hoops to jump through. Because I've helped countless women go
            from tech-overwhelmed to tech-empowered. I know what's possible when you have the right
            guidance, and I know I can help you too.
          </p>
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

      {/* Final CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-purple-50">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-semibold text-black mb-6">Don't Let This Moment Pass</h2>
          <p className="text-lg text-gray-700 mb-8 leading-relaxed">
            Right now, you have a choice:
          </p>
          <div className="space-y-4 mb-12 text-left max-w-xl mx-auto">
            <div className="p-4 bg-white rounded-lg border border-gray-200">
              <p className="font-semibold text-black mb-1">Option A:</p>
              <p className="text-gray-700">
                Continue struggling with expensive designers, time-consuming content creation, and
                feeling left behind in the AI revolution.
              </p>
            </div>
            <div className="p-4 bg-white rounded-lg border border-purple-200">
              <p className="font-semibold text-black mb-1">Option B:</p>
              <p className="text-gray-700">
                Invest in yourself, master the tools that will define the next decade, and build
                the business you've always dreamed of.
              </p>
            </div>
          </div>
          <div className="space-y-4 mb-12 text-center text-gray-700">
            <p className="text-lg">
              <span className="font-semibold">The investment?</span> $699 (or 3 easy payments)
            </p>
            <p className="text-lg">
              <span className="font-semibold">The risk?</span> Zero. (Remember that full refund
              guarantee.)
            </p>
            <p className="text-lg">
              <span className="font-semibold">The potential?</span> Limitless.
            </p>
          </div>
          <Button
            className="bg-black hover:bg-gray-900 text-white text-lg px-8 py-6 rounded-md font-semibold"
            data-testid="button-enroll-final"
          >
            Ready to Transform Your Business? Enroll Now
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </section>

      {/* Footer Message */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-white border-t border-gray-200">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-gray-600 mb-4">
            <span className="font-semibold">About Your Guide:</span> Nadia Ben Brahim, "The
            Mompreneur"
          </p>
          <p className="text-gray-700 leading-relaxed">
            Founder of MetaHers and passionate advocate for women in tech, I've made it my mission
            to demystify emerging technologies and make them accessible to every woman with a
            vision. I've helped hundreds of women transform their businesses with AI, and I'm
            ready to help you do the same.
          </p>
          <p className="text-purple-600 font-semibold mt-6 text-lg">
            "I believe in you. I know I can help you. Let's make this your breakthrough year."
          </p>
          <p className="text-gray-600 mt-2">— Nadia</p>
        </div>
      </section>
    </div>
  );
}

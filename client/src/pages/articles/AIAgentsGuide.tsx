import { Bot, Clock, Zap, TrendingUp, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { SEO } from "@/components/SEO";

export default function AIAgentsGuide() {
  return (
    <div className="min-h-screen bg-white">
      <SEO 
        title="AI Agents & Automation for Business | MetaHers Mind Spa"
        description="Deploy autonomous AI agents to run your business 24/7. Automate customer service, sales, and operations to free up your time."
      />
      
      {/* Hero */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Badge className="mb-4 bg-purple-100 text-purple-700 hover:bg-purple-200">WEEK 4 CURRICULUM</Badge>
        <h1 className="text-4xl sm:text-5xl font-bold text-black mb-4">
          AI Agents & Automation for Business
        </h1>
        <p className="text-xl text-gray-600 mb-8 leading-relaxed">
          Stop working 24/7. Deploy autonomous AI agents that handle customer service, lead qualification, and repetitive tasks—while you focus on growth.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/learning-hub">
            <Button size="lg" className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700">
              <Bot className="w-4 h-4 mr-2" />
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
        {/* Why AI Agents Matter */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-black mb-6">The Future of Business: Autonomous AI Agents</h2>
          <div className="grid sm:grid-cols-2 gap-6">
            <Card className="p-6">
              <Clock className="w-8 h-8 text-purple-600 mb-3" />
              <h3 className="font-semibold text-black mb-2">Get Your Time Back</h3>
              <p className="text-gray-600">Automate repetitive tasks so you can focus on strategic growth and high-value activities.</p>
            </Card>
            <Card className="p-6">
              <TrendingUp className="w-8 h-8 text-purple-600 mb-3" />
              <h3 className="font-semibold text-black mb-2">Scale Without Hiring</h3>
              <p className="text-gray-600">AI agents work 24/7 and scale infinitely. No hiring, training, or management overhead.</p>
            </Card>
          </div>
        </section>

        {/* Key Topics */}
        <section id="topics" className="mb-12">
          <h2 className="text-3xl font-bold text-black mb-8">Master These Topics</h2>
          <div className="space-y-6">
            
            <Card className="p-8 border-l-4 border-yellow-500">
              <h3 className="text-2xl font-bold text-black mb-3">1. Introduction to AI Agents</h3>
              <p className="text-gray-600 mb-4">Understand the power of autonomous AI:</p>
              <ul className="space-y-2 text-gray-600 mb-6">
                <li className="flex items-center"><span className="text-purple-600 mr-3">✓</span> What AI agents are and how they work</li>
                <li className="flex items-center"><span className="text-purple-600 mr-3">✓</span> AI agents vs chatbots vs automation</li>
                <li className="flex items-center"><span className="text-purple-600 mr-3">✓</span> Real business use cases & ROI</li>
                <li className="flex items-center"><span className="text-purple-600 mr-3">✓</span> Ethical considerations</li>
              </ul>
              <Badge variant="outline" className="text-yellow-500 border-yellow-500">Duration: 1.5 hours</Badge>
            </Card>

            <Card className="p-8 border-l-4 border-yellow-500">
              <h3 className="text-2xl font-bold text-black mb-3">2. Customer Service Automation</h3>
              <p className="text-gray-600 mb-4">Deploy 24/7 AI support agents:</p>
              <ul className="space-y-2 text-gray-600 mb-6">
                <li className="flex items-center"><span className="text-purple-600 mr-3">✓</span> Chatbot setup with Intercom, Drift, or Gorgias</li>
                <li className="flex items-center"><span className="text-purple-600 mr-3">✓</span> Knowledge base creation</li>
                <li className="flex items-center"><span className="text-purple-600 mr-3">✓</span> Lead qualification via chatbot</li>
                <li className="flex items-center"><span className="text-purple-600 mr-3">✓</span> Multi-channel support (email, SMS, social)</li>
              </ul>
              <Badge variant="outline" className="text-yellow-500 border-yellow-500">Duration: 2.5 hours</Badge>
            </Card>

            <Card className="p-8 border-l-4 border-yellow-500">
              <h3 className="text-2xl font-bold text-black mb-3">3. Workflow Automation & Integration</h3>
              <p className="text-gray-600 mb-4">Build intelligent workflows that connect your tools:</p>
              <ul className="space-y-2 text-gray-600 mb-6">
                <li className="flex items-center"><span className="text-purple-600 mr-3">✓</span> Zapier & Make automation basics</li>
                <li className="flex items-center"><span className="text-purple-600 mr-3">✓</span> Lead pipeline automation</li>
                <li className="flex items-center"><span className="text-purple-600 mr-3">✓</span> Appointment scheduling automation</li>
                <li className="flex items-center"><span className="text-purple-600 mr-3">✓</span> Email & content automation workflows</li>
              </ul>
              <Badge variant="outline" className="text-yellow-500 border-yellow-500">Duration: 2.5 hours</Badge>
            </Card>

            <Card className="p-8 border-l-4 border-yellow-500">
              <h3 className="text-2xl font-bold text-black mb-3">4. Advanced AI Agent Deployment</h3>
              <p className="text-gray-600 mb-4">Build custom agents for your specific business:</p>
              <ul className="space-y-2 text-gray-600 mb-6">
                <li className="flex items-center"><span className="text-purple-600 mr-3">✓</span> Using AI agent platforms (Relevance AI, Langchain)</li>
                <li className="flex items-center"><span className="text-purple-600 mr-3">✓</span> Custom agent design for your business</li>
                <li className="flex items-center"><span className="text-purple-600 mr-3">✓</span> Monitoring & optimization</li>
                <li className="flex items-center"><span className="text-purple-600 mr-3">✓</span> Scaling your automation stack</li>
              </ul>
              <Badge variant="outline" className="text-yellow-500 border-yellow-500">Duration: 3 hours</Badge>
            </Card>
          </div>
        </section>

        {/* Time Freedom Calculator */}
        <section className="bg-purple-50 rounded-lg p-8 mb-12">
          <h2 className="text-2xl font-bold text-black mb-6">How Much Time Can You Save?</h2>
          <p className="text-gray-600 mb-6">Automation can free up 20-30 hours per week:</p>
          <div className="space-y-4">
            <div className="flex justify-between items-center border-b border-gray-200 pb-3">
              <span className="text-gray-600">Customer service replies</span>
              <Badge className="bg-purple-600">8-10 hrs/week</Badge>
            </div>
            <div className="flex justify-between items-center border-b border-gray-200 pb-3">
              <span className="text-gray-600">Lead qualification & scheduling</span>
              <Badge className="bg-purple-600">5-8 hrs/week</Badge>
            </div>
            <div className="flex justify-between items-center border-b border-gray-200 pb-3">
              <span className="text-gray-600">Email & content distribution</span>
              <Badge className="bg-purple-600">3-5 hrs/week</Badge>
            </div>
            <div className="flex justify-between items-center border-b border-gray-200 pb-3">
              <span className="text-gray-600">Invoice & payment reminders</span>
              <Badge className="bg-purple-600">2-4 hrs/week</Badge>
            </div>
            <div className="flex justify-between items-center pt-3 border-t-2 border-purple-600">
              <span className="font-bold text-black">Total Time Freed</span>
              <Badge className="bg-purple-600 text-lg py-2">20-30 hrs/week</Badge>
            </div>
          </div>
        </section>

        {/* Implementation Path */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-black mb-6">Your Automation Implementation Path</h2>
          <div className="space-y-4">
            <Card className="p-6 border-l-4 border-purple-600">
              <h3 className="font-semibold text-black mb-2">Phase 1: Quick Wins (Week 1)</h3>
              <p className="text-gray-600">Set up email automation, chatbot basics, and appointment scheduling</p>
            </Card>
            <Card className="p-6 border-l-4 border-purple-600">
              <h3 className="font-semibold text-black mb-2">Phase 2: Customer Experience (Week 2)</h3>
              <p className="text-gray-600">Deploy lead qualification agents and customer support automation</p>
            </Card>
            <Card className="p-6 border-l-4 border-purple-600">
              <h3 className="font-semibold text-black mb-2">Phase 3: Advanced Systems (Week 3+)</h3>
              <p className="text-gray-600">Custom AI agents, workflow integration, and continuous optimization</p>
            </Card>
          </div>
        </section>

        {/* Success Story */}
        <section className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-8 mb-12">
          <h2 className="text-2xl font-bold text-black mb-6">Real Results from Our Community</h2>
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="text-3xl font-bold text-purple-600">↓70%</div>
              <div>
                <h3 className="font-semibold text-black">Response Time</h3>
                <p className="text-gray-600">AI chatbots respond instantly vs waiting for manual replies</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="text-3xl font-bold text-purple-600">↑40%</div>
              <div>
                <h3 className="font-semibold text-black">Lead Conversion</h3>
                <p className="text-gray-600">Immediate responses capture leads before they're lost</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="text-3xl font-bold text-purple-600">↑200%</div>
              <div>
                <h3 className="font-semibold text-black">Productivity</h3>
                <p className="text-gray-600">Entrepreneurs can focus on revenue-generating activities</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <div className="text-center py-8">
          <h2 className="text-2xl font-bold text-black mb-4">Ready to Automate Your Business?</h2>
          <p className="text-gray-600 mb-6">Learn from Nadia how to build a business that runs without you. Join 500+ women entrepreneurs who've automated themselves to success.</p>
          <Link href="/learning-hub">
            <Button size="lg" className="bg-purple-600 hover:bg-purple-700">
              Start Your Automation Journey
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

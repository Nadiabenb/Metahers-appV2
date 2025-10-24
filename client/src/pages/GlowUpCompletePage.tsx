import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Sparkles, Download, ArrowLeft, Book, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";

export default function GlowUpCompletePage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const { data: profile } = useQuery<any>({
    queryKey: ['/api/glow-up/profile'],
  });

  const { data: progress } = useQuery<any>({
    queryKey: ['/api/glow-up/progress'],
  });

  const handleDownloadReport = () => {
    if (!profile) return;

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>${profile.name}'s Brand Glow-Up Report</title>
        <style>
          body {
            font-family: 'Georgia', serif;
            max-width: 800px;
            margin: 40px auto;
            padding: 40px;
            line-height: 1.8;
            color: #1a1a1a;
            background: #fafafa;
          }
          h1 {
            font-size: 3em;
            margin-bottom: 10px;
            color: #2d1f4f;
            font-weight: bold;
          }
          h2 {
            font-size: 1.8em;
            margin-top: 40px;
            margin-bottom: 20px;
            color: #4a3265;
            border-bottom: 2px solid #e0d0f0;
            padding-bottom: 10px;
          }
          h3 {
            font-size: 1.3em;
            margin-top: 25px;
            color: #5a4270;
          }
          .header {
            text-align: center;
            margin-bottom: 50px;
            padding: 40px;
            background: linear-gradient(135deg, #f5f0ff 0%, #fff5f7 100%);
            border-radius: 15px;
          }
          .badge {
            display: inline-block;
            background: #8b5cf6;
            color: white;
            padding: 8px 16px;
            border-radius: 20px;
            font-size: 0.9em;
            margin-bottom: 20px;
          }
          .section {
            background: white;
            padding: 30px;
            margin: 30px 0;
            border-radius: 12px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.05);
          }
          .info-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin: 20px 0;
          }
          .info-item {
            background: #f8f5ff;
            padding: 15px;
            border-radius: 8px;
          }
          .info-label {
            font-size: 0.9em;
            color: #6b5b7c;
            text-transform: uppercase;
            letter-spacing: 1px;
            font-weight: 600;
          }
          .info-value {
            font-size: 1.1em;
            color: #2d1f4f;
            margin-top: 5px;
            font-weight: 500;
          }
          .footer {
            text-align: center;
            margin-top: 60px;
            padding: 30px;
            color: #888;
            font-size: 0.9em;
          }
          .highlight {
            background: linear-gradient(120deg, #ffd7e5 0%, #ffecdb 100%);
            padding: 3px 8px;
            border-radius: 4px;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <span class="badge">✨ Completed ${new Date().toLocaleDateString()}</span>
          <h1>${profile.name}'s Brand Glow-Up</h1>
          <p style="font-size: 1.2em; color: #6b5b7c;">14-Day AI-Powered Brand Transformation Report</p>
        </div>

        <div class="section">
          <h2>Brand Foundation</h2>
          <div class="info-grid">
            <div class="info-item">
              <div class="info-label">Brand Type</div>
              <div class="info-value">${profile.brandType === 'personal' ? 'Personal Brand' : 'Business Brand'}</div>
            </div>
            <div class="info-item">
              <div class="info-label">Primary Platform</div>
              <div class="info-value">${profile.platform}</div>
            </div>
            <div class="info-item">
              <div class="info-label">Niche</div>
              <div class="info-value">${profile.niche}</div>
            </div>
            <div class="info-item">
              <div class="info-label">Goal</div>
              <div class="info-value">${profile.goal === 'rebrand' ? 'Rebrand Existing' : 'Build From Scratch'}</div>
            </div>
          </div>
        </div>

        <div class="section">
          <h2>Brand Mission Statement</h2>
          <p style="font-size: 1.2em; font-style: italic; color: #4a3265;">
            I help people in <span class="highlight">${profile.niche}</span> achieve their goals through 
            ${profile.brandType === 'personal' ? 'authentic personal branding' : 'strategic business positioning'} on ${profile.platform}.
          </p>
        </div>

        <div class="section">
          <h2>Your 14-Day Journey</h2>
          <p>You've completed an intensive AI-powered brand transformation covering:</p>
          <ul style="line-height: 2;">
            <li>✓ <strong>Brand Foundation:</strong> Discovered your authentic story and core values</li>
            <li>✓ <strong>Niche Clarity:</strong> Defined who you serve and the transformation you deliver</li>
            <li>✓ <strong>Voice & Tone:</strong> Crafted a consistent, recognizable brand voice</li>
            <li>✓ <strong>Visual Identity:</strong> Designed your color palette and aesthetic direction</li>
            <li>✓ <strong>Platform Strategy:</strong> Optimized your approach for ${profile.platform}</li>
            <li>✓ <strong>Bio & Messaging:</strong> Created scroll-stopping, conversion-focused copy</li>
            <li>✓ <strong>Storytelling:</strong> Developed signature stories that resonate</li>
            <li>✓ <strong>Offer Design:</strong> Clarified your value proposition</li>
            <li>✓ <strong>Content Strategy:</strong> Established pillars and a social engine</li>
            <li>✓ <strong>Audience Building:</strong> Learned to build in public and nurture community</li>
            <li>✓ <strong>Consistency:</strong> Audited and aligned your brand presence</li>
          </ul>
        </div>

        <div class="section">
          <h2>Next Steps: 30-Day Action Plan</h2>
          <h3>Week 1-2: Foundation Implementation</h3>
          <ul>
            <li>Update all social bios using your new brand voice</li>
            <li>Create 7 posts using your content pillars</li>
            <li>Engage authentically with your target audience daily</li>
          </ul>
          
          <h3>Week 3: Content & Community</h3>
          <ul>
            <li>Share your founder story publicly</li>
            <li>Launch your first "build in public" update</li>
            <li>Respond to every comment and DM personally</li>
          </ul>
          
          <h3>Week 4: Momentum & Measurement</h3>
          <ul>
            <li>Review analytics and adjust strategy</li>
            <li>Test one new content format</li>
            <li>Collaborate with one peer in your niche</li>
            <li>Celebrate your wins and share lessons learned</li>
          </ul>
        </div>

        <div class="section">
          <h2>Your Brand North Star</h2>
          <p style="font-size: 1.1em;">
            Your brand is now built on <strong>clarity, consistency, and authenticity</strong>. 
            Every piece of content, every engagement, every decision should ladder back to your mission: 
            serving people in ${profile.niche} with ${profile.brandType === 'personal' ? 'your unique perspective and experience' : 'valuable solutions'}.
          </p>
          <p style="font-size: 1.1em; margin-top: 20px;">
            Remember: <span class="highlight">Consistency compounds.</span> Show up, add value, and trust the process.
          </p>
        </div>

        <div class="footer">
          <p><strong>Congratulations on completing your AI Glow-Up!</strong></p>
          <p>Generated by MetaHers Mind Spa • AI Glow-Up Program</p>
          <p>${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
      </body>
      </html>
    `;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${profile.name.replace(/\s+/g, '-')}-Brand-Glow-Up-Report.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Report Downloaded! 📥",
      description: "Your Brand Glow-Up Report has been saved.",
    });
  };

  if (!progress || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="p-8 text-center">
          <p className="text-muted-foreground mb-4">Complete the program first</p>
          <Button onClick={() => setLocation("/glow-up/dashboard")}>
            Go to Dashboard
          </Button>
        </Card>
      </div>
    );
  }

  const isComplete = progress.completedDays?.length === 14;

  if (!isComplete) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="p-8 text-center">
          <Trophy className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="font-cormorant text-3xl font-bold mb-2">Almost There!</h2>
          <p className="text-muted-foreground mb-4">
            Complete all 14 days to unlock your Brand Glow-Up Report
          </p>
          <p className="text-sm text-muted-foreground mb-6">
            Days completed: {progress.completedDays?.length || 0} / 14
          </p>
          <Button onClick={() => setLocation("/glow-up/dashboard")}>
            Continue Program
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => setLocation("/glow-up/dashboard")}
          className="mb-6 gap-2"
          data-testid="button-back"
        >
          <ArrowLeft className="w-4 h-4" />
          Dashboard
        </Button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="overflow-hidden">
            <div className="p-8 md:p-12 text-center bg-gradient-to-br from-[hsl(var(--liquid-gold))]/10 via-[hsl(var(--cyber-fuchsia))]/5 to-transparent">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-[hsl(var(--liquid-gold))]/30 to-[hsl(var(--cyber-fuchsia))]/20 mb-6"
              >
                <Trophy className="w-12 h-12 text-[hsl(var(--liquid-gold))]" />
              </motion.div>

              <h1 className="font-cormorant text-5xl md:text-6xl font-bold metallic-text mb-4">
                You Did It, {profile.name}! 🎉
              </h1>
              <p className="text-xl text-muted-foreground mb-6">
                14 days of AI-powered brand transformation complete
              </p>
              
              <Badge variant="default" className="text-lg px-6 py-2">
                <Sparkles className="w-4 h-4 mr-2" />
                Program Complete
              </Badge>
            </div>

            <div className="p-8 md:p-12 space-y-8">
              <div className="text-center">
                <h2 className="font-cormorant text-3xl font-bold mb-4">
                  Your Brand Summary
                </h2>
                <p className="text-muted-foreground">
                  Here's what you've built over the past 14 days
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <Card className="p-6 border-2">
                  <h3 className="font-semibold mb-2">Brand Type</h3>
                  <p className="text-muted-foreground">
                    {profile.brandType === 'personal' ? 'Personal Brand' : 'Business Brand'}
                  </p>
                </Card>
                <Card className="p-6 border-2">
                  <h3 className="font-semibold mb-2">Primary Platform</h3>
                  <p className="text-muted-foreground">{profile.platform}</p>
                </Card>
                <Card className="p-6 border-2 md:col-span-2">
                  <h3 className="font-semibold mb-2">Niche</h3>
                  <p className="text-muted-foreground">{profile.niche}</p>
                </Card>
              </div>

              <div className="p-6 rounded-lg bg-primary/5 border border-primary/20">
                <h3 className="font-semibold mb-3 text-lg">Your Brand Mission</h3>
                <p className="text-lg italic">
                  "I help people in <strong>{profile.niche}</strong> achieve their goals through 
                  {profile.brandType === 'personal' ? ' authentic personal branding' : ' strategic business positioning'} on {profile.platform}."
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-4 text-xl">What You've Accomplished</h3>
                <div className="grid gap-3">
                  {[
                    "Discovered your authentic brand foundation and story",
                    "Defined your niche and ideal audience",
                    "Crafted a consistent, recognizable voice",
                    "Designed your visual identity and aesthetic",
                    "Optimized your platform strategy",
                    "Created compelling bio and messaging",
                    "Developed signature storytelling frameworks",
                    "Clarified your core offer",
                    "Established content pillars and social engine",
                    "Learned to build in public and nurture community",
                    "Audited and aligned your brand for consistency"
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 rounded-lg hover-elevate">
                      <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-primary text-sm">✓</span>
                      </div>
                      <p className="text-sm">{item}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <Button
                  size="lg"
                  onClick={handleDownloadReport}
                  className="gap-2"
                  data-testid="button-download-report"
                >
                  <Download className="w-5 h-5" />
                  Download Brand Report
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => setLocation("/glow-up/journal")}
                  className="gap-2"
                  data-testid="button-view-journal"
                >
                  <Book className="w-5 h-5" />
                  View My Journal
                </Button>
              </div>

              <div className="p-6 rounded-lg bg-gradient-to-r from-[hsl(var(--liquid-gold))]/10 to-[hsl(var(--cyber-fuchsia))]/10 border border-primary/20 text-center">
                <p className="text-lg font-medium mb-2">What's Next?</p>
                <p className="text-muted-foreground">
                  Your brand transformation is just beginning. Use your journal, share your journey, 
                  and watch your brand come to life. Consistency compounds. Keep showing up. ✨
                </p>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

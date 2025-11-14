import { db } from "./db";
import { transformationalExperiences } from "../shared/schema";
import { sql } from "drizzle-orm";

const MOMS_EXPERIENCES = [
  {
    spaceId: "moms",
    title: "AI for Busy Moms: Your Digital Life Assistant",
    slug: "ai-for-busy-moms",
    description: "Learn how to use AI tools like ChatGPT to streamline meal planning, homework help, scheduling, and household management. Free up 10+ hours per week.",
    learningObjectives: [
      "Use ChatGPT to create weekly meal plans and grocery lists in minutes",
      "Generate educational activities and homework support for your kids",
      "Automate family schedules, reminders, and to-do lists",
      "Create personalized bedtime stories and learning games with AI",
      "Use AI to plan birthday parties, vacations, and family events"
    ],
    tier: "free",
    estimatedMinutes: 45,
    sortOrder: 1,
    personalizationEnabled: true,
    content: {
      sections: [
        {
          id: "intro",
          title: "Why AI is a Game-Changer for Moms",
          type: "text",
          content: "As a mom, you're already the CEO of your household. But what if you had a 24/7 assistant who never gets tired? AI tools like ChatGPT can help you with meal planning, homework help, scheduling, and so much more. In this experience, you'll learn practical AI prompts that save you hours every week."
        },
        {
          id: "meal-planning",
          title: "AI-Powered Meal Planning & Grocery Lists",
          type: "hands_on_lab",
          content: "**Try this ChatGPT prompt:**\n\n\"Create a healthy, budget-friendly meal plan for a family of [number] for the week. Include:\n- Breakfast, lunch, dinner, and 2 snacks per day\n- Recipes that take under 30 minutes to prepare\n- A consolidated grocery list organized by store section\n- Consider these dietary restrictions: [list any allergies/preferences]\"\n\n**Next level:** Ask it to use ingredients you already have at home, or create themed weeks like 'Taco Tuesday' or 'Meatless Monday'.",
          resources: [
            {
              title: "Free ChatGPT Account",
              url: "https://chat.openai.com",
              type: "tool"
            }
          ]
        },
        {
          id: "homework-helper",
          title: "Your AI Homework & Learning Assistant",
          type: "hands_on_lab",
          content: "**For homework help, try:**\n\n\"My [age]-year-old is learning about [topic]. Can you:\n1. Explain this concept in kid-friendly language\n2. Create 3 fun activities to practice this skill\n3. Suggest educational games or videos\n4. Give me questions to ask to check their understanding\"\n\n**Pro tip:** Use AI to create custom worksheets, flashcards, and quizzes tailored to your child's learning style.",
          resources: [
            {
              title: "Khan Academy (AI-powered tutoring)",
              url: "https://www.khanacademy.org",
              type: "resource"
            }
          ]
        },
        {
          id: "family-scheduling",
          title: "Master Family Scheduling & Organization",
          type: "interactive",
          content: "**Create your family command center with AI:**\n\n\"Help me organize my family's weekly schedule. We have:\n- [Number] kids with [activities]\n- Work schedule: [your hours]\n- Partner's schedule: [if applicable]\n\nCreate a visual weekly schedule that includes:\n- School drop-off/pick-up times\n- Extracurricular activities\n- Meal prep times\n- Family quality time\n- Self-care blocks for mom\"\n\n**Bonus:** Ask AI to send you daily reminders and help you batch similar tasks together."
        },
        {
          id: "creative-activities",
          title: "AI-Generated Stories, Games & Activities",
          type: "hands_on_lab",
          content: "**Create personalized bedtime stories:**\n\n\"Write a 5-minute bedtime story for my [age]-year-old about [their interest/favorite character]. Include:\n- A gentle, calming tone\n- A lesson about [kindness/bravery/friendship]\n- Their name: [child's name]\n- Happy ending that helps them wind down for sleep\"\n\n**For rainy days:**\n\n\"Generate 10 screen-free indoor activities for kids aged [ages] that:\n- Use materials we have at home\n- Take 20-45 minutes\n- Are educational but feel like play\n- Don't require constant parent supervision\""
        },
        {
          id: "party-planning",
          title: "Event Planning Made Easy",
          type: "interactive",
          content: "**Plan birthday parties stress-free:**\n\n\"Help me plan a birthday party for my [age]-year-old. Theme: [theme]\n- Budget: $[amount]\n- Number of kids: [number]\n- Duration: [hours]\n\nProvide:\n1. Complete shopping list with estimated costs\n2. Timeline for the day-of\n3. Game ideas and activities\n4. Food menu (allergy-friendly options)\n5. Decoration ideas\n6. Party favor suggestions\""
        },
        {
          id: "knowledge-check",
          title: "AI for Moms - Knowledge Check",
          type: "quiz",
          content: JSON.stringify({
            questions: [
              {
                question: "What's the best way to use AI as a busy mom?",
                options: [
                  "Use it to completely replace parenting decisions",
                  "Use it as a tool to save time on routine tasks so you can be more present",
                  "Only use it for work, never for family life",
                  "Avoid it completely because it's too complicated"
                ],
                correctAnswer: 1,
                explanation: "AI is most powerful when used as a time-saving assistant for routine tasks like meal planning and scheduling, freeing you to be more present with your family."
              },
              {
                question: "Which of these is the BEST prompt for meal planning with AI?",
                options: [
                  "Give me dinner ideas",
                  "What should I cook?",
                  "Create a 5-day dinner plan for a family of 4, budget $200, with 2 vegetarian meals, using ingredients I can buy at Costco. Include prep time under 30 minutes.",
                  "Help me with food"
                ],
                correctAnswer: 2,
                explanation: "Specific prompts with details about family size, budget, dietary needs, and time constraints get much better results than vague questions."
              },
              {
                question: "What's the smartest way to use AI for homework help?",
                options: [
                  "Have AI do your child's homework for them",
                  "Use AI to explain concepts in kid-friendly ways and create practice problems",
                  "Ignore AI completely for education",
                  "Only use it for high school students"
                ],
                correctAnswer: 1,
                explanation: "AI is excellent for explaining concepts differently and creating personalized practice materials, but kids should still do their own work to actually learn."
              },
              {
                question: "How much time could AI realistically save you per week?",
                options: [
                  "30 seconds",
                  "5-8 hours on meal planning, scheduling, and organizing",
                  "AI doesn't actually save time",
                  "50+ hours"
                ],
                correctAnswer: 1,
                explanation: "Most busy moms save 5-8 hours weekly by automating meal planning (2-3 hrs), grocery lists (1-2 hrs), calendar management (1 hr), and organization tasks."
              }
            ]
          })
        },
        {
          id: "action-plan",
          title: "Your AI Mom-Life Action Plan",
          type: "interactive",
          content: "**Start using AI today:**\n\n1. Set up your free ChatGPT account\n2. Save your top 3 favorite prompts from this lesson\n3. Use AI for at least one task this week (meal planning, homework, or scheduling)\n4. Track the time you save\n5. Share what worked in the MetaHers community\n\n**Remember:** AI is your assistant, not a replacement for your parenting instincts. Use it to free up mental space so you can be more present with your family."
        }
      ]
    }
  },
  {
    spaceId: "moms",
    title: "Teaching Your Kids About AI & Tech",
    slug: "teaching-kids-ai",
    description: "Prepare your children for the AI-powered future. Learn age-appropriate ways to introduce AI concepts, coding basics, and digital literacy to kids from preschool to teens.",
    learningObjectives: [
      "Introduce AI concepts to kids ages 4-18 in fun, accessible ways",
      "Teach basic coding and computational thinking",
      "Help kids use AI tools safely and responsibly",
      "Create AI-powered projects together as a family",
      "Build digital literacy and critical thinking skills"
    ],
    tier: "free",
    estimatedMinutes: 50,
    sortOrder: 2,
    personalizationEnabled: true,
    content: {
      sections: [
        {
          id: "why-teach",
          title: "Why Your Kids Need AI Literacy Now",
          type: "text",
          content: "AI isn't the future—it's the present. Your kids will use AI tools throughout their education and careers. By teaching them AI literacy now, you're giving them a massive advantage. Plus, learning together strengthens your bond and builds shared skills. This isn't about creating mini-programmers (unless they want to be!). It's about critical thinking, creativity, and confidence in a tech-driven world."
        },
        {
          id: "ages-4-7",
          title: "Ages 4-7: AI Through Play & Storytelling",
          type: "hands_on_lab",
          content: "**Make AI magical, not scary:**\n\n**Activity 1: AI Voice Assistants**\n- Let them ask Alexa/Siri simple questions\n- Explain: 'It's a robot helper that listens and finds answers'\n- Practice: 'Alexa, what sound does a lion make?'\n\n**Activity 2: Pattern Recognition Games**\n- Play 'what comes next' with blocks, colors, shapes\n- This is how AI 'thinks'—by finding patterns\n\n**Activity 3: Create AI Stories Together**\n\nUse ChatGPT: 'Write a story where [child's name] teaches a friendly robot about [favorite thing]. Make it 3 minutes long, fun, and include a lesson about sharing.'\n\nRead it together at bedtime!",
          resources: [
            {
              title: "ScratchJr (Free coding for ages 5-7)",
              url: "https://www.scratchjr.org",
              type: "tool"
            }
          ]
        },
        {
          id: "ages-8-12",
          title: "Ages 8-12: Hands-On AI Projects",
          type: "hands_on_lab",
          content: "**Build real AI projects together:**\n\n**Project 1: AI Art Generator**\n- Use DALL-E or Midjourney (with your supervision)\n- Prompt: 'A magical treehouse in space with [their favorite things]'\n- Discuss: How did the AI know what to create?\n\n**Project 2: Teachable Machine**\n- Visit teachablemachine.withgoogle.com (FREE!)\n- Train AI to recognize family members by taking photos\n- Show how AI 'learns' from examples\n\n**Project 3: ChatGPT Helper Projects**\n- Help them write a story, then ask AI to continue it\n- Create a quiz about their favorite subject\n- Build a 'choose your own adventure' game\n\n**Project 4: Scratch Programming**\n- Create games with Scratch (scratch.mit.edu)\n- Learn: loops, conditions, variables\n- Make an AI character that responds to player input",
          resources: [
            {
              title: "Google Teachable Machine",
              url: "https://teachablemachine.withgoogle.com",
              type: "tool"
            },
            {
              title: "Scratch (Free visual coding)",
              url: "https://scratch.mit.edu",
              type: "tool"
            }
          ]
        },
        {
          id: "ages-13-18",
          title: "Ages 13-18: Career-Ready AI Skills",
          type: "hands_on_lab",
          content: "**Prepare teens for AI careers and college:**\n\n**Skill 1: Advanced AI Prompting**\n- Teach them to use ChatGPT for:\n  - Study guides and flashcards\n  - Essay outlines (not cheating!)\n  - Learning new subjects\n  - Career exploration\n- **CRITICAL:** Discuss AI ethics, plagiarism, and responsible use\n\n**Skill 2: Real Coding with AI**\n- Use ChatGPT to learn Python, JavaScript, or web development\n- Prompt: 'Teach me Python basics. I'm a beginner. Start with simple examples.'\n- Build: Personal website, game, or app\n\n**Skill 3: AI-Powered Content Creation**\n- Video editing with AI (Runway, Descript)\n- Music creation (Suno, Udio)\n- Graphic design (Canva AI, Adobe Firefly)\n\n**Skill 4: Business & Entrepreneurship**\n- Use AI to research business ideas\n- Create social media content\n- Build a portfolio\n- Start a small online business",
          resources: [
            {
              title: "freeCodeCamp (Free coding bootcamp)",
              url: "https://www.freecodecamp.org",
              type: "resource"
            },
            {
              title: "Khan Academy Computer Science",
              url: "https://www.khanacademy.org/computing/computer-science",
              type: "resource"
            }
          ]
        },
        {
          id: "safety-ethics",
          title: "Digital Safety & AI Ethics for Kids",
          type: "text",
          content: "**Teach responsible AI use:**\n\n**Safety Rules:**\n1. Never share personal information with AI tools\n2. Always check AI answers (AI can make mistakes!)\n3. Use AI as a helper, not a replacement for thinking\n4. Don't use AI to cheat on homework—use it to learn\n5. Ask permission before using new AI tools\n\n**Critical Thinking Questions:**\n- 'How does the AI know this?'\n- 'Could this answer be wrong?'\n- 'Is this my own work or AI's work?'\n- 'Am I using this to learn or to avoid learning?'\n\n**Privacy:**\n- Create accounts with parental supervision\n- Don't upload photos of yourself\n- Don't share conversations that include private family info"
        },
        {
          id: "family-projects",
          title: "Fun Family AI Projects to Try This Week",
          type: "interactive",
          content: "**Pick one to start:**\n\n1. **AI Family Game Night**\n   - Use ChatGPT to create a custom trivia game about your family\n   - Generate 'Would You Rather' questions\n   - Make an escape room puzzle\n\n2. **AI Time Capsule**\n   - Ask each family member to chat with AI about their dreams\n   - Have AI generate a 'future letter' to read in 5 years\n   - Create AI art representing your family's future\n\n3. **AI Learning Challenge**\n   - Each family member picks a new skill\n   - Use AI as your tutor for 30 days\n   - Share progress weekly\n\n4. **Create a Family Website Together**\n   - Use AI to write the content\n   - Design it together\n   - Share family stories and photos\n\n5. **AI Helper Robot Challenge**\n   - Brainstorm: 'If we had a robot helper, what would it do?'\n   - Use ChatGPT to design your dream robot\n   - Draw or create it together"
        }
      ]
    }
  },
  {
    spaceId: "moms",
    title: "Building Your Tech Career While Parenting",
    slug: "tech-career-for-moms",
    description: "Navigate the unique challenges of building a tech career while being a mom. Learn strategies for flexible work, skill-building, networking, and advancing your career without sacrificing family time.",
    learningObjectives: [
      "Identify flexible tech career paths perfect for moms",
      "Build in-demand skills on your own schedule",
      "Create a 'mom-friendly' job search strategy",
      "Network effectively with limited time",
      "Negotiate for flexibility and work-life balance"
    ],
    tier: "pro",
    estimatedMinutes: 60,
    sortOrder: 3,
    personalizationEnabled: true,
    content: {
      sections: [
        {
          id: "intro",
          title: "You CAN Build a Tech Career as a Mom",
          type: "text",
          content: "Being a mom doesn't mean putting your career dreams on hold. The tech industry offers unprecedented flexibility—remote work, freelancing, part-time options, and more. But you need the right strategy. This experience will show you exactly how to build tech skills, find flexible opportunities, and advance your career while being present for your family. Thousands of moms have done it. You're next."
        },
        {
          id: "flexible-paths",
          title: "Best Tech Career Paths for Moms",
          type: "text",
          content: "**Top mom-friendly tech careers:**\n\n**1. UX/UI Designer**\n- Highly remote-friendly\n- Freelance opportunities abound\n- Average: $75-120k/year\n- Learn: Figma, user research, design thinking\n- Timeline: 3-6 months to first freelance clients\n\n**2. Web Developer**\n- 100% remote options\n- Freelance or full-time\n- Average: $70-130k/year\n- Learn: HTML, CSS, JavaScript, React\n- Timeline: 4-8 months to job-ready\n\n**3. Content & Social Media Manager**\n- Extremely flexible\n- Part-time friendly\n- Average: $50-90k/year\n- Learn: Social media strategy, analytics, AI content tools\n- Timeline: 1-3 months to first clients\n\n**4. Data Analyst**\n- Remote-first roles\n- Project-based work possible\n- Average: $70-110k/year\n- Learn: Excel, SQL, Tableau, Python basics\n- Timeline: 4-6 months to job-ready\n\n**5. Virtual Assistant / Operations Manager**\n- Ultimate flexibility\n- Start part-time, scale up\n- Average: $40-80k/year\n- Learn: Project management tools, automation\n- Timeline: Immediate start possible\n\n**6. AI Prompt Engineer**\n- Brand NEW career path\n- Highly flexible\n- Average: $80-150k/year\n- Learn: AI tools, prompt design, use cases\n- Timeline: 2-4 months to freelance ready"
        },
        {
          id: "learning-strategy",
          title: "The Mom-Friendly Learning Plan",
          type: "hands_on_lab",
          content: "**Learn tech skills with limited time:**\n\n**The '2-Hour Mom Method':**\n\n**Daily:**\n- 30 min: Early morning learning (before kids wake)\n- 30 min: Lunch break or nap time\n- 30 min: Evening (after bedtime)\n- 30 min: Weekend deep dive\n\n**Weekly total:** 10-14 hours = real progress\n\n**Best FREE Learning Resources:**\n\n**For Coding:**\n- freeCodeCamp.org (JavaScript, web dev)\n- The Odin Project (full-stack web dev)\n- Harvard CS50 (computer science fundamentals)\n\n**For Design:**\n- Google UX Design Certificate (Coursera)\n- Daily UI challenges (dailyui.co)\n- YouTube: Figma tutorials\n\n**For Data:**\n- Google Data Analytics Certificate\n- Kaggle.com (practice datasets)\n- SQL with Khan Academy\n\n**For AI:**\n- MetaHers AI space (you're already here!)\n- OpenAI documentation\n- Prompt engineering guides\n\n**The Accountability Trick:**\n- Join the MetaHers community\n- Find a 'study buddy' mom\n- Share weekly wins\n- Celebrate small progress"
        },
        {
          id: "portfolio",
          title: "Build Your Portfolio (Even Without a Job)",
          type: "hands_on_lab",
          content: "**Create portfolio projects that land interviews:**\n\n**For Web Developers:**\n1. Redesign your favorite local business website\n2. Build a family recipe app\n3. Create a kid's educational game\n4. Make a budgeting tool\n5. Build your personal portfolio site\n\n**For Designers:**\n1. Redesign a popular app you use\n2. Create a brand identity for a fictional business\n3. Design a case study showing your process\n4. Make social media templates\n5. Redesign boring forms/interfaces\n\n**For Data Analysts:**\n1. Analyze publicly available datasets (Kaggle)\n2. Create dashboards about topics you care about\n3. Visualize family/household data\n4. Write blog posts explaining your findings\n5. Build Excel templates people actually use\n\n**For AI Specialists:**\n1. Create a library of amazing prompts\n2. Build AI-powered tools for specific use cases\n3. Write case studies: 'How I used AI to...'\n4. Create tutorials teaching others\n5. Showcase before/after AI transformations\n\n**Pro tip:** Use AI to help you build faster! ChatGPT can write code, suggest designs, and help you learn."
        },
        {
          id: "job-search",
          title: "The Mom-Friendly Job Search Strategy",
          type: "interactive",
          content: "**Find flexible tech jobs:**\n\n**Best Job Boards for Remote/Flexible Work:**\n- FlexJobs.com (curated remote jobs)\n- We Work Remotely\n- Remote.co\n- AngelList (startups = flexibility)\n- LinkedIn (filter: Remote)\n\n**Keywords to Use in Your Search:**\n- 'Remote'\n- 'Flexible hours'\n- 'Part-time'\n- 'Contract'\n- 'Freelance'\n- 'Async communication'\n- '4-day week'\n\n**Your Job Application Strategy:**\n\n**1. Tailor Every Application**\n- Use ChatGPT to customize your resume\n- Prompt: 'Rewrite my resume to match this job description: [paste job]'\n- Highlight transferable skills from parenting (project management, multitasking, etc.)\n\n**2. Address the Gap (If Any)**\n- 'During my career break, I: learned [skills], built [projects], stayed current by [activities]'\n- Frame it positively: 'I'm returning to tech with fresh perspective and renewed energy'\n\n**3. Leverage Your Network**\n- Join mom-in-tech communities\n- LinkedIn: Connect with recruiters at family-friendly companies\n- Attend virtual tech meetups\n- Find local mom tech groups\n\n**4. Consider Freelancing First**\n- Build confidence and skills\n- Create flexible income\n- Then transition to full-time if desired\n- Platforms: Upwork, Fiverr, Toptal"
        },
        {
          id: "interview-prep",
          title: "Ace Your Tech Interviews as a Mom",
          type: "hands_on_lab",
          content: "**Interview prep for busy moms:**\n\n**Common Questions & Mom-Friendly Answers:**\n\n**Q: 'Tell me about yourself'**\n✅ Good: 'I'm a [role] with [X years] experience in [skills]. I recently upskilled in [tech], building projects like [example]. I'm passionate about [area] and looking for a role where I can [contribute].'  \n❌ Don't: Over-explain career gaps or apologize for being a mom\n\n**Q: 'How do you manage work-life balance?'**\n✅ Good: 'I'm highly organized and excellent at prioritizing. I use [tools/methods] to stay focused and efficient. I communicate clearly about my availability and deliver high-quality work within agreed timelines.'\n\n**Q: 'Can you work [specific hours/travel/etc]?'**\n✅ Good: 'Let me understand your needs better. [Ask clarifying questions]. Here's what works for me: [your parameters]. How can we find a solution that works for both of us?'\n\n**Practice with AI:**\n\nChatGPT Prompt: 'I'm interviewing for a [job title] role. Ask me common interview questions one at a time. After each answer, give me feedback and suggest improvements. Focus on: [your weak areas]'\n\n**Day-of-Interview Logistics:**\n- Backup childcare arranged? ✓\n- Quiet space prepared? ✓\n- Tech tested (camera, mic, internet)? ✓\n- Water nearby? ✓\n- Notes/portfolio ready? ✓\n- Emergency 'child interruption' plan? ✓\n\n**If a child interrupts:** Stay calm, smile, say 'Excuse me one moment,' mute if needed, handle it briefly, return. Most interviewers are understanding!"
        },
        {
          id: "negotiation",
          title: "Negotiate for What You Need",
          type: "interactive",
          content: "**Get the flexibility you deserve:**\n\n**What to Negotiate Beyond Salary:**\n1. Fully remote work\n2. Flexible hours (async work)\n3. Compressed work week (4 days)\n4. Part-time with benefits\n5. Generous PTO for sick kids\n6. Childcare stipend\n7. Professional development budget\n8. Home office setup\n9. Core hours (vs. 9-5 strict)\n10. Summer schedule flexibility\n\n**How to Negotiate:**\n\n**Step 1: Research**\n- Use Glassdoor, Levels.fyi, Salary.com\n- Know your worth\n\n**Step 2: Make Your Case**\n'Based on my research and the value I bring [specific examples], I was expecting [your ask]. Can we discuss?'\n\n**Step 3: Emphasize Win-Win**\n'I'd love to find a solution that works for both of us. What if we tried [your proposal] for a 3-month trial?'\n\n**Step 4: Get It in Writing**\n- Remote work policy\n- Flexible schedule agreement\n- Everything important in your offer letter\n\n**AI Negotiation Coach:**\n\nChatGPT: 'I received a job offer for [role] with [details]. I want to negotiate [what you want]. Help me craft an email that is professional, confident, and likely to succeed.'"
        },
        {
          id: "thriving",
          title: "Thriving in Your Tech Career (Not Just Surviving)",
          type: "text",
          content: "**Long-term success strategies:**\n\n**1. Set Boundaries**\n- Communicate your working hours clearly\n- Use calendar blocks for focus time\n- 'No meeting' blocks for deep work\n- Protect family time fiercely\n\n**2. Build Your Network**\n- Join: Moms in Tech, Women Who Code, Tech Ladies\n- Attend: Virtual conferences, webinars, meetups\n- Connect: With other working moms in your company\n- Mentor: Other moms entering tech\n\n**3. Keep Learning**\n- Stay current with AI and tech trends\n- Dedicate 5 hours/month to learning\n- Use work PD budget\n- Share learnings with your team (visibility!)\n\n**4. Track Your Wins**\n- Keep a 'brag document'\n- Update weekly with accomplishments\n- Use for reviews, promotions, interviews\n- Quantify impact when possible\n\n**5. Find Your Tribe**\n- Internal: Mom ERGs at your company\n- External: MetaHers community!\n- Local: Mom tech meetups\n- Online: Slack/Discord communities\n\n**6. Remember:**\n- You're not 'just' a mom - you're a professional with valuable skills\n- Parenting makes you better at your job (empathy, efficiency, problem-solving)\n- It's okay to ask for help\n- You're paving the way for other moms\n- Progress > perfection"
        }
      ]
    }
  },
  {
    spaceId: "moms",
    title: "Side Hustle School: Digital Income for Moms",
    slug: "side-hustle-for-moms",
    description: "Build a profitable side hustle or business using AI and tech tools. Learn practical strategies for creating digital products, services, or content that generate income on your schedule.",
    learningObjectives: [
      "Identify profitable side hustle ideas for moms",
      "Use AI to create digital products in hours, not months",
      "Set up sales systems that run on autopilot",
      "Market your business with minimal time investment",
      "Scale from side hustle to full-time income (if desired)"
    ],
    tier: "pro",
    estimatedMinutes: 55,
    sortOrder: 4,
    personalizationEnabled: true,
    content: {
      sections: [
        {
          id: "intro",
          title: "Turn Your Skills Into Income (Even with Limited Time)",
          type: "text",
          content: "You don't need months to start making money online. With AI tools, you can create digital products, offer services, or build content businesses in HOURS. This isn't 'get rich quick'—it's 'get started smart.' In this experience, you'll discover realistic side hustles that fit your life, learn how to use AI to work 10x faster, and create actual income streams you can start THIS WEEK."
        },
        {
          id: "best-hustles",
          title: "Top 10 AI-Powered Side Hustles for Moms",
          type: "text",
          content: "**1. Digital Products ($500-5k/month)**\n- Planners, templates, workbooks, checklists\n- Sell on: Etsy, Gumroad, your own site\n- AI helps: Design, content creation, product ideas\n- Time: 5-10 hours to create, passive after\n\n**2. Content Creation ($300-10k/month)**\n- Blog, YouTube, TikTok, Instagram\n- Income: Ads, sponsors, affiliates, products\n- AI helps: Ideas, scripts, thumbnails, editing\n- Time: 5-15 hours/week ongoing\n\n**3. Virtual Assistant ($2-8k/month)**\n- Help businesses with admin, social media, email\n- AI helps: Automate tasks, work faster\n- Time: 10-40 hours/week (you choose)\n\n**4. Freelance Writing ($1-7k/month)**\n- Blog posts, social media, newsletters, websites\n- AI helps: Research, outlines, editing, SEO\n- Time: 5-30 hours/week (project-based)\n\n**5. Online Courses ($500-15k/month)**\n- Teach what you know (parenting, cooking, skills)\n- Platforms: Teachable, Gumroad, Kajabi\n- AI helps: Curriculum, slides, scripts\n- Time: 20-40 hours to create, passive after\n\n**6. Coaching/Consulting ($1-10k/month)**\n- Mom coaching, career coaching, organization\n- AI helps: Session prep, materials, follow-ups\n- Time: 5-20 hours/week (you set availability)\n\n**7. Print on Demand ($200-3k/month)**\n- T-shirts, mugs, stickers with your designs\n- Sites: Printful, Redbubble, Merch by Amazon\n- AI helps: Design ideas, marketing\n- Time: 5-10 hours to set up, mostly passive\n\n**8. Social Media Management ($1-6k/month)**\n- Manage social for small businesses\n- AI helps: Content creation, scheduling, analytics\n- Time: 10-30 hours/week per client\n\n**9. Notion Templates ($200-3k/month)**\n- Planners, trackers, databases for Notion users\n- Sell on: Gumroad, Etsy, your site\n- AI helps: Ideas, structure, content\n- Time: 3-8 hours per template\n\n**10. AI Services ($2-10k/month)**\n- Help businesses use AI (ChatGPT, automation)\n- Growing demand, limited competition\n- AI helps: You're the expert!\n- Time: 10-40 hours/week (consulting + done-for-you)"
        },
        {
          id: "choose-hustle",
          title: "Pick YOUR Perfect Side Hustle",
          type: "interactive",
          content: "**Answer these questions:**\n\n1. How much time can you dedicate per week?\n   - Less than 5 hours: Digital products, POD\n   - 5-15 hours: Content, templates, freelancing\n   - 15+ hours: VA, coaching, services\n\n2. Do you prefer one-time creation or ongoing work?\n   - One-time: Digital products, courses, templates\n   - Ongoing: Services, content, coaching\n\n3. What are you naturally good at?\n   - Writing: Freelance writing, blogging\n   - Organizing: VA work, Notion templates\n   - Teaching: Courses, coaching\n   - Design: Digital products, POD, social media\n   - Tech: AI services, web design, consulting\n\n4. How fast do you need income?\n   - Immediate: Services (VA, freelancing, coaching)\n   - 1-3 months: Content, digital products\n   - 3-6 months: Courses, YouTube, scaling\n\n**AI Decision Helper:**\n\nChatGPT: 'I'm a mom with [X hours/week] available. I'm good at [skills]. I want to make $[goal] per month. What side hustle should I start? Give me 3 specific ideas with action plans.'"
        },
        {
          id: "digital-products",
          title: "Create & Sell Digital Products with AI",
          type: "hands_on_lab",
          content: "**Launch a digital product in ONE WEEK:**\n\n**Day 1: Idea & Research**\n- ChatGPT: 'Give me 20 digital product ideas for [your niche] that solve real problems. Include what problem each solves.'\n- Pick one with demand (check Etsy, Gumroad)\n\n**Day 2: Create with AI**\n\n*For Planners/Workbooks:*\n- ChatGPT: 'Create a complete [planner type] with 30 pages. Include: cover page, monthly/weekly spreads, habit trackers, goal-setting pages, reflection prompts.'\n- Design in Canva (use AI features)\n\n*For Templates:*\n- ChatGPT: 'Design a Notion template for [purpose]. Include all necessary databases, formulas, and instructions.'\n\n*For Guides/Ebooks:*\n- ChatGPT: 'Write a comprehensive guide about [topic]. Make it 5,000 words, include examples, actionable steps, and FAQs.'\n- Format in Canva or Google Docs\n\n**Day 3: Polish & Package**\n- Create preview images (Canva)\n- Write product description (ChatGPT)\n- Set pricing (check competitors)\n\n**Day 4: Set Up Sales**\n- Create listing on:\n  - Etsy (easy, built-in traffic)\n  - Gumroad (simple, low fees)\n  - Stan Store (for creators)\n- Add payment processing\n\n**Day 5-7: Launch & Promote**\n- Share on social media\n- Post in relevant Facebook groups\n- Tell friends and family\n- Join MetaHers and share!\n\n**AI Product Creation Prompts:**\n\n'Create a meal planning template for busy moms with:\n- Weekly meal planner grid\n- Grocery list by category\n- Recipe card template\n- Budget tracker\n- Leftover tracker'\n\n'Design a business startup checklist ebook:\n- 50-page comprehensive guide\n- Step-by-step action items\n- Resources and tools\n- Templates included\n- Professional format'\n\n'Build a content calendar template:\n- 90 days of content ideas for [niche]\n- Post types varied\n- Captions included\n- Best times to post\n- Analytics tracker'"
        },
        {
          id: "pricing",
          title: "Price Your Products & Services for Profit",
          type: "text",
          content: "**Smart Pricing Strategy:**\n\n**Digital Products:**\n- Templates/Planners: $7-47\n- Ebooks/Guides: $17-97\n- Course/Bundle: $97-297\n- Premium/Done-for-you: $297-997\n\n**Services (hourly):**\n- VA work: $25-75/hour\n- Writing: $50-150/hour\n- Design: $60-150/hour\n- Coaching: $100-300/hour\n- Consulting: $150-500/hour\n\n**Services (project-based):**\n- Start with hourly rate × estimated hours\n- Add 20% buffer\n- Package it nicely\n\n**Example:**\nWebsite content writing: 10 hours × $75 = $750\n+ 20% = $900 project fee\n\n**Pricing Psychology:**\n- $27 feels much cheaper than $30\n- $97 is the 'sweet spot' for digital products\n- Offer 3 tiers (anchor high, sell middle)\n- Bundle products (increase perceived value)\n\n**How to Raise Prices:**\n- Every 5-10 sales, increase by $5-10\n- Testimonials = higher prices\n- More features = higher prices\n- 'Early bird' discount, then regular price\n\n**AI Pricing Helper:**\n'I created a [product/service description]. My target customer is [description]. Competitors charge [range]. What should I price this at and why?'"
        },
        {
          id: "marketing",
          title: "Mom-Friendly Marketing (No 24/7 Posting Required)",
          type: "hands_on_lab",
          content: "**Market your business in 30 minutes/day:**\n\n**The Daily Marketing Routine:**\n\n**Morning (10 min):**\n- Check DMs/comments\n- Respond to leads\n- Schedule day's posts (use AI)\n\n**Afternoon (10 min):**\n- Engage with potential customers\n- Join relevant conversations\n- Share value in communities\n\n**Evening (10 min):**\n- Post on social media\n- Pin products/services\n- Track what's working\n\n**AI Content Creation System:**\n\n**Weekly Batch:**\n'Create 7 Instagram posts for my [business type]. Include:\n- Captions that sell without being salesy\n- Hooks that stop scrolling\n- Call-to-actions\n- Relevant hashtags\nMy offer: [describe]\nTarget customer: [describe]'\n\nSave all 7 posts, schedule throughout week.\n\n**Best Platforms for Moms:**\n\n1. **Pinterest** (passive traffic!)\n   - Create pins with Canva\n   - Link to products\n   - Grows while you sleep\n\n2. **Instagram**\n   - Reels (show your process)\n   - Stories (behind-the-scenes)\n   - Posts (value + selling)\n\n3. **TikTok** (fastest growth)\n   - Short, authentic videos\n   - No fancy editing needed\n   - 'Mom life' content performs well\n\n4. **Facebook Groups**\n   - Join relevant groups\n   - Provide value first\n   - Share your stuff second\n\n5. **Email** (highest ROI)\n   - Collect emails from day 1\n   - Send weekly value\n   - Promote products to list\n\n**The 'Lazy' Marketing Stack:**\n- Buffer/Later: Schedule social posts\n- Canva: Create graphics fast\n- ChatGPT: Write all your content\n- Linktree: One link for everything\n- ConvertKit: Email marketing (free to 1k subscribers)"
        },
        {
          id: "scale",
          title: "Scale to Full-Time Income (If You Want To)",
          type: "interactive",
          content: "**The Side Hustle to Full-Time Roadmap:**\n\n**Phase 1: Proof of Concept ($0-1k/month)**\n- First 90 days\n- Goal: First 10 sales or 3 clients\n- Validate your idea\n- Get testimonials\n- Learn what works\n\n**Phase 2: Systematize ($1-3k/month)**\n- Months 3-6\n- Goal: Repeat Phase 1 but faster\n- Create systems (templates, processes)\n- Use AI to automate\n- Raise prices\n\n**Phase 3: Scale ($3-5k/month)**\n- Months 6-12\n- Goal: Consistent income\n- Build email list\n- Create more products\n- Hire first contractor (VA, editor)\n- Multiple income streams\n\n**Phase 4: Full-Time Ready ($5-10k/month)**\n- Month 12+\n- Goal: Replace your job income\n- 3-6 months runway saved\n- Diversified income\n- Proven systems\n- Ready to quit (if desired)\n\n**How to Get There Faster:**\n\n1. **Focus on ONE thing** (at first)\n   - Master one product/service\n   - Then expand\n\n2. **Reinvest early profits**\n   - Better tools\n   - Paid ads\n   - Contractors\n\n3. **Build an audience**\n   - Email list = insurance\n   - Can sell anything to your people\n\n4. **Create recurring revenue**\n   - Memberships\n   - Subscription products\n   - Retainer clients\n\n5. **Automate everything possible**\n   - AI writes your content\n   - Scheduling tools post it\n   - Email sequences sell for you\n   - Payment is automatic\n\n**Timeline Reality Check:**\n- Month 1-3: $0-500 (learning, building)\n- Month 4-6: $500-2k (finding rhythm)\n- Month 7-12: $2-5k (systems working)\n- Month 12+: $5-15k+ (scaling up)\n\nThis is realistic. You can go faster with:\n- More time investment\n- Prior skills/audience\n- Paid advertising\n- Network effects"
        }
      ]
    }
  },
  {
    spaceId: "moms",
    title: "AI Home Automation for Busy Families",
    slug: "ai-home-automation",
    description: "Use AI and smart home technology to automate household tasks, create efficient routines, and give yourself back hours each week. From meal planning to cleaning schedules to family coordination.",
    learningObjectives: [
      "Set up AI-powered smart home devices",
      "Automate repetitive household tasks",
      "Create voice-activated family routines",
      "Use AI for grocery shopping, meal prep, and budgeting",
      "Build a family command center with automation"
    ],
    tier: "pro",
    estimatedMinutes: 45,
    sortOrder: 5,
    personalizationEnabled: true,
    content: {
      sections: [
        {
          id: "intro",
          title: "Automate Your Home, Reclaim Your Time",
          type: "text",
          content: "What if your home could run itself? With AI and smart home tech, it can come pretty close. In this experience, you'll learn how to automate the repetitive tasks that eat up your time—from grocery lists to cleaning schedules to bedtime routines. We're not talking about expensive overhauls. Most of these solutions cost little to nothing and can be set up in minutes."
        },
        {
          id: "voice-assistants",
          title: "Master Your Voice Assistant (Alexa, Google, Siri)",
          type: "hands_on_lab",
          content: "**Turn your voice assistant into your personal household manager:**\n\n**Morning Routine Automation:**\n'Alexa, good morning'\n→ Turns on lights\n→ Reads weather + calendar\n→ Starts coffee maker\n→ Plays morning music\n→ Reminds kids of tasks\n\n**How to set this up:**\n1. Open Alexa/Google Home app\n2. Create a 'Routine'\n3. Trigger: 'When I say good morning'\n4. Actions: Add each step above\n5. Done!\n\n**Family Coordination Commands:**\n\n'Alexa, family meeting'\n→ Turns off TV\n→ Gathers everyone with announcement\n→ Starts focus music\n→ Opens family calendar\n\n'Alexa, dinner time'\n→ Announces 'Dinner is ready!'\n→ Turns on dining room lights\n→ Plays dinner music\n→ Sets 30-minute timer (for table cleanup)\n\n'Alexa, bedtime for kids'\n→ Dims all bedroom lights\n→ Turns off TV\n→ Plays bedtime story\n→ Sets wake-up alarm\n\n**Shopping List Automation:**\n\n'Alexa, add milk to shopping list'\n→ Automatically added to shared family list\n→ Accessible on everyone's phone\n→ Can sync with grocery delivery apps\n\n**Homework Help:**\n\n'Alexa, what's 25 times 4?'\n'Alexa, how do you spell encyclopedia?'\n'Alexa, set a 20-minute homework timer'\n'Alexa, play focus music for studying'"
        },
        {
          id: "meal-automation",
          title: "Automate Meal Planning & Grocery Shopping",
          type: "hands_on_lab",
          content: "**Never ask 'What's for dinner?' again:**\n\n**AI Meal Planning System:**\n\n**Weekly Setup (15 minutes on Sunday):**\n\n1. ChatGPT Prompt:\n'Create a weekly meal plan for my family:\n- Family size: [number]\n- Dietary needs: [list]\n- Budget: $[amount]/week\n- Cooking time limit: [minutes]\n- Cuisine preferences: [list]\n- Use ingredients from: [pantry items]\n\nProvide:\n- 7 dinners + leftover lunch ideas\n- Consolidated grocery list by store section\n- Prep-ahead tips for Sunday\n- Estimated total cost'\n\n2. Review and adjust\n\n3. Send grocery list to:\n   - Instacart (auto-schedule delivery)\n   - Amazon Fresh (prime members)\n   - Your grocery pickup service\n   - Or print and shop\n\n4. Set calendar reminders for prep\n\n**Automated Grocery Shopping:**\n\n**Option 1: Voice Shopping**\n- 'Alexa, add [item] to cart'\n- 'Alexa, buy more [item]'\n- Auto-delivery for staples\n\n**Option 2: Subscription Boxes**\n- Milk, eggs, bread on auto-delivery\n- Adjust frequency as needed\n- Never run out\n\n**Option 3: Smart Fridge + Apps**\n- Some fridges track expiration\n- Suggest recipes based on contents\n- Auto-add to shopping list\n\n**Meal Prep Shortcuts:**\n\nChatGPT: 'Give me a Sunday meal prep plan that will save me time all week. I have 2 hours. Include what to cook, how to store it, and how to assemble meals during the week.'\n\n**Recipe Organization:**\n- Save all recipes in Notion\n- Tag by: quick, kid-friendly, budget, etc.\n- AI generates shopping list from any recipe\n- Build your family recipe database"
        },
        {
          id: "cleaning-automation",
          title: "Automate Cleaning & Home Maintenance",
          type: "interactive",
          content: "**Keep your home clean with minimal effort:**\n\n**Robot Vacuum Schedule:**\n- Set to run daily at specific times\n- Different rooms on different days\n- Empties itself (if you have that model)\n- Controlled by voice/app\n\n'Alexa, start vacuuming'\n'Alexa, vacuum the playroom'\n\n**Smart Cleaning Schedule:**\n\nChatGPT: 'Create a minimal-effort house cleaning schedule for a family of [number] with [pets?]. Include:\n- Daily tasks (5-10 min)\n- Weekly tasks (30 min each)\n- Monthly deep clean\n- Delegate age-appropriate tasks to kids aged [ages]\n- Use time-saving hacks'\n\n**Set Automated Reminders:**\n- Sunday: Clean bathrooms (Alexa reminder)\n- Monday: Laundry day (calendar alert)\n- Wednesday: Vacuum (robot does it!)\n- Friday: Tidy living spaces (family routine)\n- Monthly: Change air filters, etc.\n\n**Laundry Automation:**\n- Smart washer/dryer: Start remotely\n- Set reminders: 'Move laundry to dryer'\n- Schedule: Specific laundry days\n- Kids' responsibility: Set their own reminders\n\n**Maintenance Tracking:**\n\nNotion Template: 'Home Maintenance Tracker'\n- All appliances and service dates\n- Auto-reminders before due\n- Warranty info\n- Service provider contacts\n- Repair history"
        },
        {
          id: "family-calendar",
          title: "The AI-Powered Family Command Center",
          type: "hands_on_lab",
          content: "**Create a centralized family hub:**\n\n**Digital Family Calendar:**\n\n**Setup:**\n1. Use Google Calendar (free, shareable)\n2. Create separate calendars for:\n   - Mom's schedule\n   - Dad's schedule\n   - Each kid\n   - Family events\n   - Meal plan\n   - Cleaning schedule\n3. Color-code everything\n4. Share with all family members\n5. Sync to smart display or tablet\n\n**AI Calendar Assistant:**\n\nChatGPT: 'Help me organize this week:\n- Mom: [your schedule]\n- Dad: [partner schedule]\n- Kids: [their activities]\n- Appointments: [list]\n- Goals: [family/personal]\n\nCreate an optimized schedule that:\n- Avoids conflicts\n- Includes meal times\n- Builds in buffer time\n- Suggests prep times\n- Identifies free family time'\n\n**Voice Calendar Management:**\n\n'Alexa, what's on my calendar today?'\n'Alexa, add dentist appointment on Tuesday at 3pm'\n'Alexa, when is my next meeting?'\n'Alexa, what are the kids doing this weekend?'\n\n**Visual Family Dashboard:**\n\n**Create with a tablet on the wall:**\n- Today's schedule for everyone\n- Weather\n- Important reminders\n- Chore assignments\n- Countdown to special events\n- Meal plan for the week\n\n**Apps to use:**\n- Cozi (family organizer)\n- Google Calendar + Dashboard\n- Notion (custom family hub)\n- Dakboard (digital display)\n\n**Morning Announcements:**\n\n'Alexa, what's on the family schedule today?'\n→ Reads everyone's appointments\n→ Reminds of tasks\n→ Checks weather for outfit planning"
        },
        {
          id: "budget-automation",
          title: "Automate Your Family Budget & Finances",
          type: "hands_on_lab",
          content: "**Money management on autopilot:**\n\n**Expense Tracking:**\n- YNAB (You Need A Budget): Auto-imports transactions\n- Mint: Free, auto-categorizes\n- Copilot: Beautiful, smart insights\n\n**Automated Savings:**\n1. Set up auto-transfers to savings\n2. Round-up apps (Acorns, Qapital)\n3. Automated bill pay\n4. Automated investments\n\n**Budget Planning with AI:**\n\nChatGPT: 'Create a family budget for:\n- Monthly income: $[amount]\n- Fixed expenses: [list with amounts]\n- Family size: [number]\n- Goals: [savings, debt, etc.]\n\nProvide:\n- Recommended budget breakdown\n- Savings opportunities\n- Spending limits per category\n- Tips for staying on track'\n\n**Smart Shopping:**\n- Honey: Auto-applies coupons\n- Rakuten: Auto-cashback\n- Capital One Shopping: Price tracking\n- Subscriptions tracker: Cancel unused\n\n**Bill Negotiation:**\n\nChatGPT: 'Write me a script to negotiate lower rates for:\n- Internet: Currently paying $[amount]\n- Phone: Currently paying $[amount]\n- Insurance: Currently paying $[amount]\n\nMake it professional, firm, and effective.'\n\n**Financial Reminders:**\n- Bill due dates (never pay late fees)\n- Subscription renewals (cancel before charge)\n- Budget check-ins (weekly)\n- Savings milestones (celebrate!)"
        },
        {
          id: "action-plan",
          title: "Your Home Automation Action Plan",
          type: "interactive",
          content: "**Start automating this week:**\n\n**Week 1: Voice Assistant Setup**\n- ✓ Set up morning routine\n- ✓ Create bedtime routine\n- ✓ Connect shopping list\n- ✓ Set up family announcements\n\n**Week 2: Meal & Shopping Automation**\n- ✓ Create first AI meal plan\n- ✓ Set up grocery delivery\n- ✓ Organize recipes digitally\n- ✓ Schedule meal prep time\n\n**Week 3: Cleaning & Maintenance**\n- ✓ Create cleaning schedule\n- ✓ Set automated reminders\n- ✓ Delegate tasks to family\n- ✓ Set up robot vacuum (if you have one)\n\n**Week 4: Family Command Center**\n- ✓ Consolidate calendars\n- ✓ Set up visual dashboard\n- ✓ Create shared to-do lists\n- ✓ Automate morning/evening reviews\n\n**Bonus: Budget Automation**\n- ✓ Choose budget app\n- ✓ Connect accounts\n- ✓ Set up auto-savings\n- ✓ Automate bill pay\n\n**Time Saved:**\n- Meal planning: 2-3 hours/week\n- Grocery shopping: 1-2 hours/week\n- Cleaning coordination: 1 hour/week\n- Calendar management: 1 hour/week\n- Budget tracking: 30 min/week\n\n**Total: 5-8 hours back in your week!**\n\nWhat will you do with your extra time?"
        }
      ]
    }
  },
  {
    spaceId: "moms",
    title: "The Working Mom's AI Productivity System",
    slug: "working-mom-productivity",
    description: "Design your perfect productivity system using AI tools. Learn how to manage work, family, and personal goals without burning out. Get more done in less time while staying present for what matters.",
    learningObjectives: [
      "Build a personalized AI-powered productivity system",
      "Use time-blocking and batching to maximize efficiency",
      "Automate repetitive work and life tasks",
      "Manage overwhelm and prevent burnout",
      "Achieve work-life integration (not just balance)"
    ],
    tier: "pro",
    estimatedMinutes: 50,
    sortOrder: 6,
    personalizationEnabled: true,
    content: {
      sections: [
        {
          id: "intro",
          title: "Productivity for Moms: It's Different",
          type: "text",
          content: "Traditional productivity advice doesn't work for moms. It assumes you have uninterrupted time, control over your schedule, and predictable days. That's not reality. Your productivity system needs to be flexible, fast, and forgiving. This experience will show you how to use AI to get more done in less time, while making space for the chaos and joy of motherhood. You'll learn to work WITH your life, not against it."
        },
        {
          id: "time-audit",
          title: "Where Does Your Time Actually Go?",
          type: "hands_on_lab",
          content: "**Discover your hidden time:**\n\n**The 3-Day Time Tracking Challenge:**\n\nTrack everything you do for 3 days in 30-minute blocks:\n- Work tasks\n- Household tasks\n- Kid activities\n- Self-care\n- 'Wasted' time (scrolling, etc.)\n- Transition time (getting ready, commute, etc.)\n\n**Use AI to Analyze:**\n\nChatGPT Prompt: 'I tracked my time for 3 days. Here's what I did:\n\n[Paste your time log]\n\nAnalyze this and tell me:\n1. Where am I spending the most time?\n2. What tasks could be eliminated, automated, or delegated?\n3. Where am I context-switching too much?\n4. When are my peak energy hours?\n5. Where can I find 5-10 more hours per week?'\n\n**Common Time Wasters for Moms:**\n- 🚫 Scrolling social media: 1-2 hours/day\n- 🚫 Decision fatigue (what's for dinner, what to wear, etc.): 30-60 min/day\n- 🚫 Looking for things (keys, shoes, papers): 15-30 min/day\n- 🚫 Unnecessary meetings: 2-5 hours/week\n- 🚫 Email/message overwhelm: 1-2 hours/day\n- 🚫 Inefficient errands: 2-3 hours/week\n\n**Time Recovery Opportunities:**\n- ✅ Batch similar tasks: Save 5-8 hours/week\n- ✅ Automate decisions: Save 3-5 hours/week\n- ✅ Delegate properly: Save 5-10 hours/week\n- ✅ Use AI for content/admin: Save 3-7 hours/week\n- ✅ Set better boundaries: Save 2-5 hours/week"
        },
        {
          id: "time-blocking",
          title: "The Mom-Friendly Time-Blocking Method",
          type: "hands_on_lab",
          content: "**Time-blocking adapted for unpredictable life:**\n\n**The Flexible Blocks System:**\n\n**Instead of rigid hourly blocks, use:**\n\n**Theme Days:**\n- Monday: Admin & Planning\n- Tuesday: Deep Work\n- Wednesday: Meetings & Collaboration\n- Thursday: Creation & Content\n- Friday: Catch-up & Prep\n\n**Energy-Based Blocks:**\n\n**High Energy (morning for most):**\n- Most important work\n- Creative tasks\n- Strategic thinking\n- Learning new skills\n\n**Medium Energy (midday):**\n- Meetings\n- Email/messages\n- Admin tasks\n- Collaboration\n\n**Low Energy (late afternoon):**\n- Routine tasks\n- Organizing\n- Planning tomorrow\n- Easy wins\n\n**AI Schedule Builder:**\n\nChatGPT: 'Create a weekly schedule for me:\n\n**Non-negotiables:**\n- Work: [your hours]\n- Kid activities: [list with times]\n- Sleep: [hours needed]\n- Exercise: [frequency/duration]\n\n**Goals this week:**\n- [Work goal 1]\n- [Work goal 2]\n- [Personal goal]\n- [Household goal]\n\n**My peak energy time:** [morning/afternoon/evening]\n\nDesign a realistic schedule that:\n1. Blocks time for my goals\n2. Includes buffer time\n3. Respects my energy levels\n4. Allows for interruptions\n5. Includes self-care'\n\n**The Power Hour:**\n\nEvery day, protect ONE hour for your most important work:\n- Same time daily (consistency builds habit)\n- No meetings, no interruptions\n- Phone in another room\n- Door closed (if possible)\n- Tell family: 'This is mom's power hour'\n\nIn one year: 260+ hours of focused work = major progress on any goal"
        },
        {
          id: "batching",
          title: "Task Batching to 10x Your Efficiency",
          type: "hands_on_lab",
          content: "**Batch similar tasks together:**\n\n**Why batching works:**\n- Reduces context switching (saves mental energy)\n- Allows you to get 'in the zone'\n- Completes tasks faster\n- Reduces decision fatigue\n\n**What to Batch:**\n\n**Work Tasks:**\n- Email: Check only 2-3x daily at set times\n- Meetings: Stack on same days\n- Content creation: Write all social posts on Monday\n- Admin: One 'admin hour' per week\n- Planning: Sunday evening for the week\n\n**Life Tasks:**\n- Meal prep: Sunday afternoon\n- Grocery shopping: Once weekly + delivery\n- Laundry: Specific days\n- Errands: One trip, multiple stops\n- House cleaning: One section per day vs. whole house\n\n**Kid Tasks:**\n- Forms/permissions: Friday folder review\n- School prep: Layout outfits night before\n- Activities: Batch extracurriculars on same days\n- Homework: Set daily homework hour\n\n**AI Batch Planning:**\n\nChatGPT: 'I need to accomplish these tasks this week:\n[List all your tasks]\n\nHelp me batch them into themed sessions. Group by:\n1. Similarity of task type\n2. Location/tools needed\n3. Energy level required\n4. Time of day that makes sense\n\nCreate a batching schedule.'\n\n**Content Creation Batching (for side hustlers):**\n\n**One 2-hour session creates:**\n- 4 blog posts (AI-assisted)\n- 30 social media posts\n- 5 emails for sequence\n- 4 video scripts\n- Graphics for all of the above\n\n**How:**\n1. ChatGPT: Generate all content\n2. Canva: Create all graphics\n3. Scheduling tool: Queue everything\n4. Done for the month!"
        },
        {
          id: "ai-automation",
          title: "Automate Your Repetitive Tasks with AI",
          type: "hands_on_lab",
          content: "**Let AI handle the boring stuff:**\n\n**Email Management:**\n\n**Gmail + AI:**\n- Smart Reply: Quick responses\n- Smart Compose: Finishes sentences\n- Filters: Auto-organize incoming mail\n- Boomerang: Schedule sends, remind if no reply\n\n**ChatGPT Email Templates:**\n'Create 10 email templates for common situations:\n1. Declining a meeting politely\n2. Following up on no response\n3. Requesting information\n4. Saying no to a request\n5. Delegating a task\n6. Thanking someone\n7. Rescheduling\n8. Setting boundaries\n9. Asking for help\n10. Networking follow-up'\n\nSave these. Personalize in 30 seconds. Send.\n\n**Content Automation:**\n\n**For social media:**\nChatGPT: 'Write 30 days of Instagram captions for [your niche]. Make them engaging, varied, and include CTAs.'\n\n**For blog/newsletter:**\nChatGPT: 'Write 4 blog post outlines about [topic]. Include SEO keywords, headers, and key points.'\n\n**For responses:**\nChatGPT: 'Someone asked: [question]. Write a helpful, friendly response.'\n\n**Meeting Notes:**\n- Otter.ai: Auto-transcribes meetings\n- ChatGPT: 'Summarize this transcript and create action items'\n- Notion: Save organized notes\n\n**Report Generation:**\nChatGPT: 'Here's my data for this month: [paste data]. Create a professional report with insights and recommendations.'\n\n**Personal Assistant Tasks:**\n\nAlexa/Google: \n- 'Remind me to call the dentist at 9am Monday'\n- 'Add bread to my shopping list'\n- 'Set a timer for 20 minutes'\n- 'What's my next appointment?'\n- 'Play focus music'\n\n**Research Shortcuts:**\n\nInstead of endless Googling:\nChatGPT: 'Research [topic] and give me:\n1. Key findings\n2. Pros and cons\n3. Expert recommendations\n4. Action steps\n5. Further reading'\n\n**Admin Automation:**\n- Zapier: Connect apps (e.g., email → Notion)\n- IFTTT: If This Then That automations\n- Calendly: Auto-schedule meetings\n- DocuSign: E-signatures\n- LastPass: Password management"
        },
        {
          id: "overwhelm",
          title: "Managing Mom Overwhelm & Preventing Burnout",
          type: "text",
          content: "**Overwhelm is not a character flaw. It's too much on your plate.**\n\n**Warning Signs You're Headed for Burnout:**\n- Constantly exhausted\n- Irritable with family\n- Dreading things you used to enjoy\n- Can't focus or remember things\n- Getting sick frequently\n- Staying up late just for 'me time'\n- Crying over small things\n- Feeling guilty no matter what\n\n**The Overwhelm Audit:**\n\nChatGPT: 'I'm overwhelmed. Here's everything on my plate:\n[List EVERYTHING - work, home, mental load, etc.]\n\nHelp me:\n1. Identify what MUST be done by me\n2. What can be delegated\n3. What can be eliminated\n4. What can be automated\n5. What needs to wait\n6. Where I'm over-functioning'\n\n**The Power of 'No':**\n\n**Practice saying:**\n- 'That sounds great, but I'm at capacity right now.'\n- 'I can't commit to that right now.'\n- 'Let me check my calendar and get back to you.' (Then actually check!)\n- 'That's not aligned with my priorities right now.'\n- 'I'd love to, but I can't do it well right now.'\n\n**The 'Good Enough' Revolution:**\n\nPerfectionism is productivity's enemy.\n\n**90% done and shipped beats 100% perfect and never finished.**\n\nWhere can you aim for 'good enough'?\n- House cleaning (B+ not A+)\n- Dinner (nutritious, not gourmet)\n- Work tasks (excellent, not perfect)\n- Kids' activities (they won't remember perfection)\n- Your appearance (put-together, not Instagram-ready)\n\n**Self-Care Non-Negotiables:**\n\n**Daily (5-10 min):**\n- Morning coffee alone\n- 5-min meditation or stretching\n- Actual lunch break\n- Evening skincare routine\n- Journal 3 wins from the day\n\n**Weekly (30-60 min):**\n- One hobby/passion activity\n- Exercise you actually enjoy\n- Connect with a friend\n- Read for pleasure\n- Sleep in once\n\n**Monthly:**\n- Full day 'off' if possible\n- Date night or friend time\n- Do something just for you\n- Review and reset goals\n\n**Remember:** You can't pour from an empty cup. Taking care of yourself isn't selfish - it's necessary."
        },
        {
          id: "integration",
          title: "Work-Life Integration (Not Balance)",
          type: "interactive",
          content: "**Balance is a myth. Integration is real.**\n\n**Instead of separating work and life, blend them intentionally:**\n\n**Integration Strategies:**\n\n**1. Theme Days**\n- Heavy work days: Partner does more at home\n- Light work days: More family focus\n- Varies week to week - that's ok!\n\n**2. Kid-Inclusive Work**\n- They see you working (models professionalism)\n- Age-appropriate involvement\n- 'Mom's working' = quiet play time\n\n**3. Flexible Boundaries**\n- Sometimes work during 'family time' (urgent)\n- Sometimes family during 'work time' (sick kid)\n- Communicate with team/family\n\n**4. Intentional Presence**\n- When with kids: phone away, fully there\n- When working: focused, efficient\n- Transition rituals between modes\n\n**5. Shared Responsibilities**\n- Partner does equal parenting/household\n- Kids have age-appropriate chores\n- Hire help where possible\n- Community/family support\n\n**The Daily Review:**\n\n**End of day (5 min):**\n\nChatGPT: 'Today I:\n- Work: [what you accomplished]\n- Kids: [how you showed up]\n- Self: [what you did for you]\n- Challenges: [what was hard]\n\nHelp me:\n1. Celebrate my wins\n2. Learn from challenges\n3. Plan tomorrow better\n4. Release guilt\n5. Reset for tomorrow'\n\n**Weekly Planning:**\n\n**Sunday evening (30 min):**\n\n1. Review last week\n   - What worked?\n   - What didn't?\n   - What needs to change?\n\n2. Plan next week\n   - Top 3 work priorities\n   - Top 3 family priorities\n   - Top 1 self priority\n\n3. Time-block calendar\n\n4. Prep what you can\n   - Meal plan\n   - Layout work week\n   - Check kids' schedule\n\n5. Set intentions\n\nChatGPT: 'Help me plan my week with these priorities: [list]. Create a realistic schedule that honors my energy, includes buffer time, and allows for life to happen.'\n\n**Monthly Reset:**\n\n**Last Sunday of month (1 hour):**\n- Celebrate the month's wins\n- Adjust systems that aren't working\n- Set next month's goals\n- Review finances\n- Plan something to look forward to\n\n**Quarterly Review:**\n- Are you progressing toward big goals?\n- What needs to change?\n- What's working well?\n- What do you want to double down on?\n- What are you ready to let go of?"
        },
        {
          id: "your-system",
          title: "Build YOUR Personalized Productivity System",
          type: "interactive",
          content: "**Your custom productivity system:**\n\n**Morning (15-30 min):**\n- [ ] Review today's schedule\n- [ ] Identify 3 must-do tasks\n- [ ] Check calendar/kids' needs\n- [ ] Set intention for the day\n- [ ] Power Hour (if morning person)\n\n**During Day:**\n- [ ] Work in themed blocks\n- [ ] Batch similar tasks\n- [ ] Use AI for repetitive work\n- [ ] Take actual breaks\n- [ ] Protect Power Hour\n\n**Evening (10-15 min):**\n- [ ] Review what you accomplished\n- [ ] Prep for tomorrow\n- [ ] Clear workspace\n- [ ] Plan tomorrow's top 3\n- [ ] Release the day\n\n**Weekly:**\n- [ ] Sunday planning session\n- [ ] Meal prep\n- [ ] Review calendar\n- [ ] Batch content (if needed)\n- [ ] Self-care activity\n\n**Tools You Need:**\n- AI assistant (ChatGPT)\n- Calendar (Google Calendar)\n- Task manager (Notion, Todoist, or TickTick)\n- Notes app (Notion or Evernote)\n- Voice assistant (Alexa/Google)\n- Timer (phone or Alexa)\n\n**Your Productivity Promise:**\n\n'I promise to:\n- Use AI to work smarter, not harder\n- Protect my time and energy\n- Say no to what doesn't serve me\n- Batch and automate where possible\n- Forgive myself when life happens\n- Prioritize what matters most\n- Take care of myself\n- Celebrate small wins'\n\n**Start This Week:**\n1. Do the 3-day time audit\n2. Create your first themed week\n3. Set up 3 AI automations\n4. Block your Power Hour\n5. Do one weekly planning session\n\n**Remember:** Your system should work FOR you, not create more stress. Adjust as needed. There's no perfect system - only what works for your life right now."
        }
      ]
    }
  }
];

export async function seedMomsExperiences() {
  try {
    console.log("Seeding transformational experiences for Moms space...");
    
    for (const experience of MOMS_EXPERIENCES) {
      await db
        .insert(transformationalExperiences)
        .values(experience)
        .onConflictDoUpdate({
          target: transformationalExperiences.slug,
          set: {
            title: experience.title,
            description: experience.description,
            learningObjectives: experience.learningObjectives,
            tier: experience.tier,
            estimatedMinutes: experience.estimatedMinutes,
            sortOrder: experience.sortOrder,
            content: experience.content,
            personalizationEnabled: experience.personalizationEnabled,
            updatedAt: sql`now()`,
          },
        });
      
      console.log(`✓ Seeded experience: ${experience.title}`);
    }
    
    console.log("✓ All Moms experiences seeded successfully!");
  } catch (error) {
    console.error("Error seeding moms experiences:", error);
    throw error;
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  seedMomsExperiences()
    .then(() => {
      console.log("Seed completed!");
      process.exit(0);
    })
    .catch((error) => {
      console.error("Seed failed:", error);
      process.exit(1);
    });
}

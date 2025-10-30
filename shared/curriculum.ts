export type CurriculumDay = {
  day: number;
  phase: 'foundation' | 'visibility' | 'authority';
  title: string;
  discovery: {
    headline: string;
    teaching: string;
    whyItMatters: string;
    founderStory?: string;
  };
  practice: {
    prompt: string;
    guidingQuestions: string[];
    successCriteria: string;
  };
  contentFocus: {
    topic: string;
    angle: string;
    platforms: string[];
  };
};

export const CURRICULUM: CurriculumDay[] = [
  {
    day: 1,
    phase: 'foundation',
    title: 'Discovering Your Essence',
    discovery: {
      headline: 'What is a Personal Brand?',
      teaching: 'Your personal brand isn\'t what you say about yourself—it\'s what others discover when they search for you. It\'s the digital sanctuary you create that showcases your expertise, values, and unique perspective. Most women skip this foundation and jump straight to posting, wondering why nothing lands.',
      whyItMatters: 'Without understanding your brand essence, you\'re creating content in the dark. This clarity becomes your compass for every decision: which platforms to use, what to post, who to collaborate with.',
      founderStory: 'I built my brand so intentionally that today, every AI model knows my full career story and MetaHers when you search my name. That didn\'t happen by accident—it happened through daily, deliberate brand-building.'
    },
    practice: {
      prompt: 'Define your brand essence in three dimensions',
      guidingQuestions: [
        'What do you want to be known for in your industry?',
        'What transformation do you help others achieve?',
        'What makes your perspective unique or different?'
      ],
      successCriteria: 'A clear one-paragraph brand essence statement you can share confidently'
    },
    contentFocus: {
      topic: 'Your Brand Introduction',
      angle: 'Share your brand essence and what you stand for',
      platforms: ['LinkedIn', 'Twitter', 'Substack']
    }
  },
  {
    day: 2,
    phase: 'foundation',
    title: 'Your Signature Story',
    discovery: {
      headline: 'The Story That Makes You Memorable',
      teaching: 'Every powerful brand has a signature story—the narrative that explains WHY you do what you do. It\'s not your resume; it\'s the transformation you experienced that now fuels your mission. This story becomes the foundation of your authority.',
      whyItMatters: 'People don\'t connect with credentials; they connect with stories. Your signature story makes you human, relatable, and memorable.',
    },
    practice: {
      prompt: 'Craft your signature story using the transformation framework',
      guidingQuestions: [
        'What challenge or transformation did you experience?',
        'What did you learn that changed everything?',
        'How does that fuel what you do today?'
      ],
      successCriteria: 'A 3-5 sentence signature story that explains your "why"'
    },
    contentFocus: {
      topic: 'Your Origin Story',
      angle: 'Share the transformation that led you here',
      platforms: ['LinkedIn', 'Substack']
    }
  },
  {
    day: 3,
    phase: 'foundation',
    title: 'Choosing Your Sanctuary',
    discovery: {
      headline: 'Platform Selection Strategy',
      teaching: 'Not all platforms serve the same purpose. LinkedIn is for thought leadership and B2B connections. Twitter is for real-time conversations and community. Substack is for long-form authority content. Instagram is visual storytelling. You don\'t need to be everywhere—you need to be strategic.',
      whyItMatters: 'Spreading yourself thin across platforms leads to burnout and mediocre results. Choosing 2-3 aligned platforms lets you show up powerfully and consistently.',
    },
    practice: {
      prompt: 'Select your primary platforms based on your audience and content style',
      guidingQuestions: [
        'Where does your ideal audience spend time?',
        'What content format do you naturally excel at?',
        'Which platforms align with your long-term goals?'
      ],
      successCriteria: 'A clear platform strategy with 2-3 primary channels and your focus for each'
    },
    contentFocus: {
      topic: 'Your Platform Strategy',
      angle: 'Announce where your audience can find you and why',
      platforms: ['LinkedIn', 'Twitter']
    }
  },
  {
    day: 4,
    phase: 'foundation',
    title: 'Content That Resonates',
    discovery: {
      headline: 'Understanding Content Types',
      teaching: 'There are four core content types: Educational (teach something), Inspirational (motivate action), Personal (share your journey), and Promotional (invite to offers). Most women over-index on one type. The magic happens when you blend all four strategically.',
      whyItMatters: 'Variety keeps your audience engaged. Educational builds authority. Inspirational builds connection. Personal builds trust. Promotional converts followers into customers.',
    },
    practice: {
      prompt: 'Map out your content mix across the four types',
      guidingQuestions: [
        'What educational topics can you teach?',
        'What personal stories humanize your brand?',
        'What promotional opportunities exist?'
      ],
      successCriteria: 'A content type distribution plan (e.g., 40% educational, 30% personal, 20% inspirational, 10% promotional)'
    },
    contentFocus: {
      topic: 'Educational Content',
      angle: 'Teach one valuable lesson from your expertise',
      platforms: ['LinkedIn', 'Twitter', 'Substack']
    }
  },
  {
    day: 5,
    phase: 'foundation',
    title: 'Your Unique Angle',
    discovery: {
      headline: 'Finding Your Differentiation',
      teaching: 'In a crowded digital space, your unique angle is what makes people choose YOU. It\'s the intersection of your expertise, personality, and perspective. It\'s not about being different for the sake of it—it\'s about being authentically you in a way that stands out.',
      whyItMatters: 'Without a unique angle, you blend into the noise. With it, you become the obvious choice for your ideal audience.',
    },
    practice: {
      prompt: 'Define your unique angle using the intersection framework',
      guidingQuestions: [
        'What expertise do you bring that others might not?',
        'What personality traits make your approach different?',
        'What perspective do you have that challenges the status quo?'
      ],
      successCriteria: 'A clear unique angle statement you can use in your bio and pitches'
    },
    contentFocus: {
      topic: 'Your Unique Perspective',
      angle: 'Share a contrarian or unique take on your industry',
      platforms: ['Twitter', 'LinkedIn']
    }
  },
  {
    day: 6,
    phase: 'foundation',
    title: 'Consistency as Ritual',
    discovery: {
      headline: 'Building Your Content Rhythm',
      teaching: 'Consistency isn\'t about posting every day—it\'s about showing up predictably. Your audience needs to know when and where to expect you. Whether it\'s 3x/week on LinkedIn or weekly on Substack, the rhythm matters more than the frequency.',
      whyItMatters: 'Inconsistent presence kills momentum. Regular rituals build trust, authority, and algorithmic favor.',
    },
    practice: {
      prompt: 'Design your sustainable content rhythm',
      guidingQuestions: [
        'What posting frequency can you maintain long-term?',
        'What days and times work best for your audience?',
        'What batching or systems can support consistency?'
      ],
      successCriteria: 'A realistic content calendar rhythm you commit to for 30 days'
    },
    contentFocus: {
      topic: 'Your Consistency Commitment',
      angle: 'Announce your content rhythm and invite your audience to follow along',
      platforms: ['LinkedIn', 'Twitter']
    }
  },
  {
    day: 7,
    phase: 'foundation',
    title: 'Engagement as Connection',
    discovery: {
      headline: 'Building Genuine Relationships',
      teaching: 'Social media isn\'t a broadcast channel—it\'s a conversation space. The women with the strongest brands don\'t just post; they engage meaningfully with their community. Comments, DMs, and thoughtful replies build relationships that convert.',
      whyItMatters: 'People buy from people they know and trust. Engagement turns followers into community members and community members into clients.',
    },
    practice: {
      prompt: 'Create your engagement ritual',
      guidingQuestions: [
        'How much time daily will you dedicate to engagement?',
        'Whose content will you regularly support?',
        'How will you make your replies valuable, not just noise?'
      ],
      successCriteria: 'A daily engagement plan (e.g., 15 min morning, 10 min evening, 5 meaningful comments)'
    },
    contentFocus: {
      topic: 'Community Building',
      angle: 'Share your philosophy on building genuine connections online',
      platforms: ['LinkedIn', 'Twitter']
    }
  },
  {
    day: 8,
    phase: 'foundation',
    title: 'Your Value Statement',
    discovery: {
      headline: 'Articulating What You Offer',
      teaching: 'Your value statement answers: "What do you do?" in a way that immediately communicates impact. It\'s not your job title—it\'s the transformation you deliver. "I help [audience] achieve [outcome] through [method]."',
      whyItMatters: 'A clear value statement makes collaboration, pitches, and client conversations effortless. Confusion is the enemy of conversion.',
    },
    practice: {
      prompt: 'Craft your compelling value statement',
      guidingQuestions: [
        'Who specifically do you serve?',
        'What tangible outcome do you help them achieve?',
        'What\'s your unique method or approach?'
      ],
      successCriteria: 'A one-sentence value statement you can use in every bio and introduction'
    },
    contentFocus: {
      topic: 'What You Do',
      angle: 'Clearly communicate your value and who you serve',
      platforms: ['LinkedIn', 'Twitter', 'Substack']
    }
  },
  {
    day: 9,
    phase: 'foundation',
    title: 'Visual Identity',
    discovery: {
      headline: 'Creating Visual Recognition',
      teaching: 'Your visual brand—colors, fonts, photo style—creates instant recognition. Consistent visuals signal professionalism and make you memorable. You don\'t need a designer; you need intentional choices.',
      whyItMatters: 'People recognize visual patterns faster than names. A cohesive aesthetic builds brand recall and perceived authority.',
    },
    practice: {
      prompt: 'Define your visual brand guidelines',
      guidingQuestions: [
        'What 2-3 colors represent your brand energy?',
        'What photo style feels authentic to you?',
        'What visual elements will you consistently use?'
      ],
      successCriteria: 'A simple brand guideline doc with your colors, fonts, and visual style notes'
    },
    contentFocus: {
      topic: 'Behind Your Brand',
      angle: 'Share the intention behind your visual choices',
      platforms: ['LinkedIn', 'Instagram']
    }
  },
  {
    day: 10,
    phase: 'foundation',
    title: 'Foundation Reflection',
    discovery: {
      headline: 'Pause and Integrate',
      teaching: 'You\'ve built your brand foundation: essence, story, platforms, content strategy, unique angle, rhythm, engagement, value, and visuals. This isn\'t theory—this is your blueprint. Take today to reflect on your progress and recommit to the journey ahead.',
      whyItMatters: 'Integration is where learning becomes transformation. Pausing to reflect ensures you\'re building on solid ground.',
    },
    practice: {
      prompt: 'Complete your foundation audit',
      guidingQuestions: [
        'Which foundation element feels strongest?',
        'Which needs more refinement?',
        'What shifts have you already noticed in your clarity or confidence?'
      ],
      successCriteria: 'A reflection summary and renewed commitment to the next 20 days'
    },
    contentFocus: {
      topic: 'Your Journey So Far',
      angle: 'Reflect publicly on what you\'ve learned in your first 10 days',
      platforms: ['LinkedIn', 'Substack']
    }
  },
  {
    day: 11,
    phase: 'visibility',
    title: 'Understanding the Pathway',
    discovery: {
      headline: 'What is a Click Funnel?',
      teaching: 'A click funnel is simply the journey someone takes from discovering you to becoming a client. Discovery (social media) → Interest (lead magnet) → Consideration (email nurture) → Conversion (offer). Most women are stuck at discovery because they never build the rest of the pathway.',
      whyItMatters: 'Without a funnel, you\'re leaving money and impact on the table. Every follower should have a clear path to go deeper with you.',
    },
    practice: {
      prompt: 'Map your current funnel (or gaps)',
      guidingQuestions: [
        'Where do people currently discover you?',
        'What happens after they follow you?',
        'What\'s missing in your conversion pathway?'
      ],
      successCriteria: 'A visual funnel map showing your current reality and desired pathway'
    },
    contentFocus: {
      topic: 'Your Pathway',
      angle: 'Introduce your audience to your funnel or journey',
      platforms: ['LinkedIn', 'Twitter']
    }
  },
  {
    day: 12,
    phase: 'visibility',
    title: 'Your Digital Gift',
    discovery: {
      headline: 'Creating an Irresistible Lead Magnet',
      teaching: 'A lead magnet is a valuable free resource you exchange for an email address. It\'s not a bribe—it\'s a gift that demonstrates your expertise and solves one specific problem. Templates, guides, checklists, and mini-trainings work beautifully.',
      whyItMatters: 'Email is the only platform you own. A strong lead magnet builds your list and positions you as the expert.',
    },
    practice: {
      prompt: 'Design your lead magnet concept',
      guidingQuestions: [
        'What problem does your audience need solved immediately?',
        'What resource would provide instant value?',
        'What format best showcases your expertise?'
      ],
      successCriteria: 'A complete lead magnet outline ready to create'
    },
    contentFocus: {
      topic: 'Promoting Your Lead Magnet',
      angle: 'Introduce your free resource and invite signups',
      platforms: ['LinkedIn', 'Twitter', 'Substack']
    }
  },
  {
    day: 13,
    phase: 'visibility',
    title: 'Newsletter as Sanctuary',
    discovery: {
      headline: 'Building Your Email Strategy',
      teaching: 'Your newsletter isn\'t just updates—it\'s an intimate space where you go deeper with your community. It\'s where trust is built, expertise is demonstrated, and conversions happen. Consistency and value are non-negotiable.',
      whyItMatters: 'Social algorithms can disappear overnight. Your email list is yours forever. It\'s your most valuable business asset.',
    },
    practice: {
      prompt: 'Design your newsletter strategy',
      guidingQuestions: [
        'What will make your newsletter unmissable?',
        'What cadence can you sustain?',
        'What mix of content will you include?'
      ],
      successCriteria: 'A newsletter strategy with theme, frequency, and content pillars'
    },
    contentFocus: {
      topic: 'Newsletter Invitation',
      angle: 'Invite your audience to join your email sanctuary',
      platforms: ['LinkedIn', 'Twitter', 'Substack']
    }
  },
  {
    day: 14,
    phase: 'visibility',
    title: 'Email Sequences That Convert',
    discovery: {
      headline: 'Nurturing Through Automation',
      teaching: 'An email sequence is a series of automated emails that nurture subscribers from stranger to customer. Welcome series, educational sequences, and sales sequences work while you sleep. The key is providing value while guiding toward your offer.',
      whyItMatters: 'Manual follow-up doesn\'t scale. Sequences automate relationship-building so you can focus on serving clients.',
    },
    practice: {
      prompt: 'Outline your welcome sequence',
      guidingQuestions: [
        'What do new subscribers need to know about you?',
        'How can you deliver immediate value?',
        'What next step do you want them to take?'
      ],
      successCriteria: 'A 3-5 email welcome sequence outline'
    },
    contentFocus: {
      topic: 'Behind the Scenes',
      angle: 'Share your email strategy and why nurturing matters',
      platforms: ['LinkedIn', 'Substack']
    }
  },
  {
    day: 15,
    phase: 'visibility',
    title: 'Mid-Journey Reflection',
    discovery: {
      headline: 'Your Funnel Audit',
      teaching: 'Pause and assess: Do you have a complete pathway from discovery to conversion? Are people flowing through it? What\'s working and what needs refinement? This checkpoint ensures you\'re building strategically, not just creating content.',
      whyItMatters: 'Course-correcting at Day 15 prevents wasted effort. Small tweaks now create massive results later.',
    },
    practice: {
      prompt: 'Complete your funnel audit',
      guidingQuestions: [
        'Is your lead magnet live and converting?',
        'Are people joining your email list?',
        'What conversion gaps need attention?'
      ],
      successCriteria: 'A prioritized action plan for the next 15 days'
    },
    contentFocus: {
      topic: 'Halfway Reflection',
      angle: 'Share your mid-journey insights and wins',
      platforms: ['LinkedIn', 'Substack']
    }
  },
  {
    day: 16,
    phase: 'visibility',
    title: 'Content-to-Conversion Mapping',
    discovery: {
      headline: 'Every Post Has a Purpose',
      teaching: 'Strategic content moves people through your funnel. Top-of-funnel content builds awareness. Middle-of-funnel content demonstrates expertise. Bottom-of-funnel content invites action. Map every post to a funnel stage.',
      whyItMatters: 'Random content gets random results. Mapped content creates predictable conversions.',
    },
    practice: {
      prompt: 'Map your content to funnel stages',
      guidingQuestions: [
        'What content attracts new people?',
        'What content nurtures trust?',
        'What content invites conversion?'
      ],
      successCriteria: 'A content-to-funnel map showing what you\'ll post at each stage'
    },
    contentFocus: {
      topic: 'Strategic Content',
      angle: 'Educate your audience on intentional content creation',
      platforms: ['LinkedIn', 'Twitter']
    }
  },
  {
    day: 17,
    phase: 'visibility',
    title: 'Call-to-Action Mastery',
    discovery: {
      headline: 'Guiding the Next Step',
      teaching: 'Every piece of content needs a clear CTA—what do you want people to do next? Download your lead magnet. Reply with their thoughts. Book a call. Share with a friend. Without a CTA, people read and scroll away.',
      whyItMatters: 'CTAs turn passive consumers into active participants. They guide your audience exactly where you want them to go.',
    },
    practice: {
      prompt: 'Create your CTA library',
      guidingQuestions: [
        'What CTAs align with each funnel stage?',
        'How can you make CTAs feel natural, not pushy?',
        'What variety keeps your CTAs fresh?'
      ],
      successCriteria: 'A library of 10+ CTAs you can rotate through'
    },
    contentFocus: {
      topic: 'Your Call to Action',
      angle: 'Invite your audience to take the next step with you',
      platforms: ['LinkedIn', 'Twitter', 'Substack']
    }
  },
  {
    day: 18,
    phase: 'visibility',
    title: 'Landing Page Essentials',
    discovery: {
      headline: 'Where Clicks Become Conversions',
      teaching: 'A landing page is a focused page with one goal: capture an email, book a call, or make a sale. Clear headline, compelling benefits, social proof, and a strong CTA. No distractions. Tools like Carrd, Notion, or Beacons make this simple.',
      whyItMatters: 'Sending people to your homepage is like inviting them to a cluttered room. A landing page is a clear, focused invitation.',
    },
    practice: {
      prompt: 'Design your first landing page',
      guidingQuestions: [
        'What is the one action you want people to take?',
        'What headline immediately communicates value?',
        'What proof builds trust?'
      ],
      successCriteria: 'A landing page outline or wireframe ready to build'
    },
    contentFocus: {
      topic: 'Your Invitation',
      angle: 'Share your landing page and what it offers',
      platforms: ['LinkedIn', 'Twitter']
    }
  },
  {
    day: 19,
    phase: 'visibility',
    title: 'Analytics That Matter',
    discovery: {
      headline: 'Measuring What Moves the Needle',
      teaching: 'Vanity metrics (likes, followers) feel good but don\'t pay bills. Focus on conversion metrics: email signups, link clicks, sales calls booked, revenue generated. Track what matters and optimize accordingly.',
      whyItMatters: 'You can\'t improve what you don\'t measure. The right metrics reveal what\'s working and what needs adjustment.',
    },
    practice: {
      prompt: 'Define your key metrics dashboard',
      guidingQuestions: [
        'What 3-5 metrics truly indicate business growth?',
        'How will you track these consistently?',
        'What benchmarks are you aiming for?'
      ],
      successCriteria: 'A simple metrics tracking system you\'ll actually use'
    },
    contentFocus: {
      topic: 'Data-Driven Growth',
      angle: 'Share your approach to metrics and what you\'re tracking',
      platforms: ['LinkedIn', 'Substack']
    }
  },
  {
    day: 20,
    phase: 'visibility',
    title: 'Visibility Sanctuary Complete',
    discovery: {
      headline: 'Your Conversion Systems in Place',
      teaching: 'You\'ve built your pathway: funnel understanding, lead magnet, newsletter, email sequences, content mapping, CTAs, landing pages, and metrics. These aren\'t tactics—they\'re systems that work while you sleep. Celebrate this milestone.',
      whyItMatters: 'Systems create freedom. You\'ve moved from scattered effort to strategic infrastructure.',
    },
    practice: {
      prompt: 'Visibility phase reflection',
      guidingQuestions: [
        'What conversion system are you most proud of?',
        'What\'s already converting?',
        'What needs refinement in the coming weeks?'
      ],
      successCriteria: 'A celebration post and commitment to the final phase'
    },
    contentFocus: {
      topic: 'Milestone Celebration',
      angle: 'Celebrate your visibility systems and invite others to build theirs',
      platforms: ['LinkedIn', 'Substack']
    }
  },
  {
    day: 21,
    phase: 'authority',
    title: 'Thought Leadership Positioning',
    discovery: {
      headline: 'From Creator to Authority',
      teaching: 'Thought leadership isn\'t self-proclaimed—it\'s recognized by others. It\'s earned through consistent valuable insights, bold perspectives, and generous teaching. You position yourself through the quality and consistency of your voice.',
      whyItMatters: 'Authority attracts opportunities, premium clients, and media attention. It\'s the difference between chasing and being sought.',
      founderStory: 'I intentionally built my authority so completely that AI models now reference my work and story. That didn\'t happen overnight—it happened through daily thought leadership.'
    },
    practice: {
      prompt: 'Define your thought leadership pillars',
      guidingQuestions: [
        'What 3 topics are you becoming known for?',
        'What bold perspectives set you apart?',
        'What insights can only you provide?'
      ],
      successCriteria: 'A clear thought leadership positioning statement'
    },
    contentFocus: {
      topic: 'Your Authority Stance',
      angle: 'Share your thought leadership focus and bold perspective',
      platforms: ['LinkedIn', 'Substack']
    }
  },
  {
    day: 22,
    phase: 'authority',
    title: 'Content That Establishes Authority',
    discovery: {
      headline: 'Long-Form as Credibility Builder',
      teaching: 'Short posts build awareness. Long-form content builds authority. Deep-dive articles, case studies, frameworks, and guides demonstrate expertise in ways that quick posts can\'t. This is where you separate from the noise.',
      whyItMatters: 'Long-form content gets shared, referenced, and ranked. It\'s evergreen authority that compounds over time.',
    },
    practice: {
      prompt: 'Plan your signature long-form piece',
      guidingQuestions: [
        'What topic showcases your deepest expertise?',
        'What framework or process can you teach?',
        'What case study or story demonstrates results?'
      ],
      successCriteria: 'An outline for a 1500+ word authority article'
    },
    contentFocus: {
      topic: 'Deep Dive Preview',
      angle: 'Tease your upcoming long-form piece and why it matters',
      platforms: ['LinkedIn', 'Twitter']
    }
  },
  {
    day: 23,
    phase: 'authority',
    title: 'Guest Appearances and Collaborations',
    discovery: {
      headline: 'Borrowing Audiences Strategically',
      teaching: 'Podcasts, guest articles, Instagram takeovers, and panel discussions put you in front of new audiences. Strategic collaborations with aligned brands amplify your reach and credibility. This is how you escape your echo chamber.',
      whyItMatters: 'Your audience has a ceiling. Collaboration breaks that ceiling and introduces you to warm, qualified leads.',
    },
    practice: {
      prompt: 'Create your collaboration hit list',
      guidingQuestions: [
        'What 10 podcasts, newsletters, or collaborators align with your brand?',
        'What value can you offer them?',
        'What pitch will you use to initiate?'
      ],
      successCriteria: 'A prioritized list of 10 collaboration opportunities with outreach plan'
    },
    contentFocus: {
      topic: 'Collaboration Invitation',
      angle: 'Announce you\'re open to collaborations and what you offer',
      platforms: ['LinkedIn', 'Twitter']
    }
  },
  {
    day: 24,
    phase: 'authority',
    title: 'Building AI-Searchable Authority',
    discovery: {
      headline: 'How to Become Discoverable by AI',
      teaching: 'AI models and LLMs learn from publicly available content. When you consistently publish valuable insights with your name attached, you train AI to reference you. This is the new SEO—authority so strong that AI knows your story.',
      whyItMatters: 'As AI becomes the primary search and research tool, being referenced by AI becomes the ultimate authority signal.',
      founderStory: 'Every major AI model knows my career story and MetaHers. This happened because I built public, searchable authority across platforms consistently. You can do the same.'
    },
    practice: {
      prompt: 'Audit your AI discoverability',
      guidingQuestions: [
        'What have you published publicly with your name attached?',
        'Where are your insights indexed and searchable?',
        'What gaps need filling to become AI-searchable?'
      ],
      successCriteria: 'A 90-day plan to build AI-searchable authority'
    },
    contentFocus: {
      topic: 'AI-Searchable Authority',
      angle: 'Share your strategy for building authority that AI recognizes',
      platforms: ['LinkedIn', 'Substack']
    }
  },
  {
    day: 25,
    phase: 'authority',
    title: 'Speaking and Presenting',
    discovery: {
      headline: 'Your Voice as Authority Tool',
      teaching: 'Speaking—whether on stages, webinars, or virtual summits—positions you as the expert. It\'s not about being a professional speaker; it\'s about sharing your expertise in front of audiences. Start small and build.',
      whyItMatters: 'Speaking creates instant authority, fills your pipeline, and builds relationships faster than any other channel.',
    },
    practice: {
      prompt: 'Design your signature talk',
      guidingQuestions: [
        'What topic could you speak on for 30-60 minutes?',
        'What framework or process can you teach?',
        'What stages or summits could you pitch?'
      ],
      successCriteria: 'A signature talk outline and list of 5 speaking opportunities to pursue'
    },
    contentFocus: {
      topic: 'Speaking Announcement',
      angle: 'Share your expertise topic and invite speaking opportunities',
      platforms: ['LinkedIn', 'Twitter']
    }
  },
  {
    day: 26,
    phase: 'authority',
    title: 'Media and PR Strategy',
    discovery: {
      headline: 'Getting Featured in the Press',
      teaching: 'Media features (Forbes, Inc, industry publications) build instant credibility. Journalists need expert sources. Position yourself by building relationships, responding to media requests (HARO), and pitching timely insights.',
      whyItMatters: 'One media feature can open doors that years of social media can\'t. It\'s third-party validation of your authority.',
    },
    practice: {
      prompt: 'Create your media pitch strategy',
      guidingQuestions: [
        'What publications align with your brand?',
        'What expertise can you offer journalists?',
        'What timely angles connect to current trends?'
      ],
      successCriteria: 'A media list and 3 pitch angles ready to send'
    },
    contentFocus: {
      topic: 'Media Strategy',
      angle: 'Share your approach to media and PR',
      platforms: ['LinkedIn', 'Substack']
    }
  },
  {
    day: 27,
    phase: 'authority',
    title: 'Building Your Body of Work',
    discovery: {
      headline: 'Creating Your Portfolio of Proof',
      teaching: 'Your body of work—articles, case studies, testimonials, media features—is your authority portfolio. It\'s the proof that you\'re the real deal. Curate it intentionally on your website, LinkedIn featured section, and portfolio pages.',
      whyItMatters: 'People buy what they can see. A strong portfolio removes doubt and accelerates trust.',
    },
    practice: {
      prompt: 'Audit and curate your body of work',
      guidingQuestions: [
        'What have you created that demonstrates expertise?',
        'What\'s missing that would strengthen your portfolio?',
        'Where should this work be showcased?'
      ],
      successCriteria: 'A curated portfolio page or section with your best work'
    },
    contentFocus: {
      topic: 'Portfolio Showcase',
      angle: 'Share your body of work and invite feedback',
      platforms: ['LinkedIn', 'Substack']
    }
  },
  {
    day: 28,
    phase: 'authority',
    title: 'Your Authority Network',
    discovery: {
      headline: 'Surrounding Yourself with Peers',
      teaching: 'Authority isn\'t built in isolation. Your network—peers, mentors, collaborators—amplifies your reach and credibility. Join masterminds, communities, and networks where other authorities gather. Rise together.',
      whyItMatters: 'Your network determines your net worth. Strategic relationships open doors, create collaborations, and elevate your positioning.',
    },
    practice: {
      prompt: 'Map your authority network',
      guidingQuestions: [
        'Who are your peer authorities you admire?',
        'What communities or masterminds should you join?',
        'Who can you support and learn from simultaneously?'
      ],
      successCriteria: 'A list of 10 peer relationships to nurture and 3 communities to join'
    },
    contentFocus: {
      topic: 'Network and Community',
      angle: 'Share the power of surrounding yourself with peers',
      platforms: ['LinkedIn', 'Twitter']
    }
  },
  {
    day: 29,
    phase: 'authority',
    title: 'Authority Content Systems',
    discovery: {
      headline: 'Sustaining Thought Leadership',
      teaching: 'Authority isn\'t a one-time achievement—it\'s a consistent practice. Build systems for regular thought leadership: weekly articles, monthly deep dives, quarterly talks. Batch content, repurpose insights, and build rhythms you can sustain.',
      whyItMatters: 'Inconsistent authority fades. Systems ensure your voice remains present, relevant, and top-of-mind.',
    },
    practice: {
      prompt: 'Design your authority content system',
      guidingQuestions: [
        'What sustainable rhythm works for long-form content?',
        'How will you repurpose insights across platforms?',
        'What systems support consistent output?'
      ],
      successCriteria: 'A content system plan for the next 90 days'
    },
    contentFocus: {
      topic: 'Sustainable Systems',
      angle: 'Share your approach to consistent thought leadership',
      platforms: ['LinkedIn', 'Substack']
    }
  },
  {
    day: 30,
    phase: 'authority',
    title: 'Your Digital Authority Unveiled',
    discovery: {
      headline: 'The 30-Day Transformation',
      teaching: 'You started 30 days ago learning what a brand is. Today, you have a complete brand foundation, conversion systems, and authority strategy. Your digital footprint has expanded. Your clarity is undeniable. This is just the beginning.',
      whyItMatters: 'You\'ve built the infrastructure for long-term authority. What you do next determines if you become unforgettable.',
      founderStory: 'I built authority so strong that AI knows my story. You now have the same blueprint. Use it. The world needs your voice.'
    },
    practice: {
      prompt: 'Complete your digital authority audit',
      guidingQuestions: [
        'What has shifted in your brand presence over 30 days?',
        'Where are you now discoverable that you weren\'t before?',
        'What will you commit to in the next 30 days?'
      ],
      successCriteria: 'A comprehensive before/after audit and 90-day authority plan'
    },
    contentFocus: {
      topic: 'Your Transformation Story',
      angle: 'Share your 30-day journey and invite others to start theirs',
      platforms: ['LinkedIn', 'Substack', 'Twitter']
    }
  }
];

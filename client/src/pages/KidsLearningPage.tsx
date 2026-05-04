import { useState, useEffect, useRef } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { canAccessSignatureFeatures } from "@/lib/tierAccess";
import { apiRequest, apiRequestJson } from "@/lib/queryClient";

const LAUNCH_WEEK_COUNT = 4;

type KidsProgress = {
  completedWeeks: number[];
  badges: string[];
  completedProjects: number[];
  notes: Record<string, string>;
  reflections: {
    confidence: number;
    favActivity: string;
    whatWasHard: string;
    nextPractice: string;
  };
  selectedWeek: number;
  selectedSession: number;
};

const DEFAULT_KIDS_PROGRESS: KidsProgress = {
  completedWeeks: [],
  badges: [],
  completedProjects: [],
  notes: {},
  reflections: { confidence: 3, favActivity: "", whatWasHard: "", nextPractice: "" },
  selectedWeek: 1,
  selectedSession: 0,
};

// ── CURRICULUM DATA ──────────────────────────────────────────────────────────
const WEEKS_DATA = [
  {
    week: 1,
    theme: "Hello Computer! 🌟",
    tagline: "Meeting my new digital friend",
    color: "#FFB5C8",
    accent: "#FF6B9D",
    badge: "⭐ Computer Explorer",
    badgeDesc: "Turned on a computer for the first time!",
    goals: ["Turn on/off computer safely", "Use mouse to point and click", "Understand screen, keyboard, mouse"],
    materials: ["Laptop or desktop computer", "Mouse (if available)", "Sticker sheet for reward", "Drawing paper"],
    sessions: [
      {
        num: 1,
        type: "Computer Basics",
        title: "Wake Up, Computer!",
        parentScript: (name: string) =>
          `Today we're meeting the computer for the very first time! Keep it super calm and exciting. Let ${name} press the power button herself — that feeling of 'I did it!' is everything.`,
        childExplain: "Computers are like magic helpers! They have a screen (like a TV), a keyboard (like piano keys for words), and a mouse (like a little pet that moves things on screen).",
        activities: [
          { time: "0–5 min", label: "Welcome", desc: "Sing a hello song together. Ask: 'What do you think a computer does?' No wrong answers!" },
          { time: "5–15 min", label: "Skill Lesson", desc: (name: string) => `Show each part: screen, keyboard, mouse/trackpad. Let ${name} touch each one and name it. Practice pointing to things on the screen.` },
          { time: "15–25 min", label: "Unplugged", desc: "Draw a computer on paper! Label the screen, keyboard, and mouse together with crayons." },
          { time: "25–45 min", label: "Computer Project", desc: "Open MS Paint or Google Drawings. Let her move the mouse freely and just explore! No goal — just play." },
          { time: "45–55 min", label: "AI Moment", desc: "With Mommy: Ask an AI 'What is a computer?' Read the answer together and pick one fun fact." },
          { time: "55–60 min", label: "Reflection", desc: "Ask: 'What was your favorite part? What was tricky?' Give the sticker badge!" },
        ],
        aiPrompt: "Ask an AI: 'Can you explain what a computer is in a way a 5-year-old would understand? Make it fun and short!'",
        miniProject: (name: string) => `${name}'s Computer Drawing — draw and label all the parts!`,
      },
      {
        num: 2,
        type: "Mouse & Trackpad",
        title: "Mouse Magic!",
        parentScript: (name: string) =>
          `The mouse can be surprisingly hard at first. Go slow, celebrate every small win. If ${name} gets frustrated, take a break and come back. The goal is joy, not perfection.`,
        childExplain: "The mouse is like a magic wand. When you move it, the little arrow on the screen moves too! Click once to say hello, click twice to open things.",
        activities: [
          { time: "0–5 min", label: "Welcome", desc: "Review last session. Ask her to name the computer parts. Give a high five for each one she remembers!" },
          { time: "5–15 min", label: "Skill Lesson", desc: "Practice: move mouse, single click, double click. Use an online mouse game (like mousegames.com) or just click on desktop icons." },
          { time: "15–25 min", label: "Unplugged", desc: "Mouse obstacle course on paper! Draw a path and 'drive' a small toy along it with their hand — trains the same muscle memory." },
          { time: "25–45 min", label: "Computer Project", desc: (name: string) => `Open a drawing app. ${name} draws her first real digital picture — anything she wants. Save it and call it '${name}'s First Drawing.'` },
          { time: "45–55 min", label: "AI Moment", desc: "Ask AI: 'What are some fun things I can make on a computer?' Look at the ideas together and circle one to try next time." },
          { time: "55–60 min", label: "Reflection", desc: "Print or show the drawing. Celebrate! Ask: What would you add next time?" },
        ],
        aiPrompt: "Ask an AI: 'What are 5 fun creative things a 5-year-old can make on a computer? Keep it simple and exciting!'",
        miniProject: (name: string) => `${name}'s First Computer Drawing — save and name it!`,
      },
    ],
    creativeLab: {
      title: "Robot Friend Card 🤖",
      desc: "Using a drawing app, design a card for an imaginary robot friend. What does your robot look like? What's its name? What does it love to do?",
      aiPrompt: "Ask AI: 'Help me give my robot friend a name and 3 things it loves to do. My robot is friendly and loves colors.'",
    },
  },
  {
    week: 2,
    theme: "Keyboard Kingdom 🎹",
    tagline: "Every key is a superpower",
    color: "#B5D5FF",
    accent: "#4A90D9",
    badge: "🎹 Keyboard Wizard",
    badgeDesc: "Typed my name on a computer!",
    goals: ["Find letters on the keyboard", "Type own name", "Learn spacebar and backspace", "Understand uppercase vs lowercase"],
    materials: ["Keyboard stickers (optional)", "Letter flashcards", "Printed keyboard layout", "Favorite song lyrics for typing"],
    sessions: [
      {
        num: 1,
        type: "Keyboard",
        title: "Key Hunt!",
        parentScript: (_name: string) =>
          "Don't worry about speed or perfect typing. The win today is just finding letters and pressing them with confidence. Make it a treasure hunt, not a test.",
        childExplain: "The keyboard has a key for every letter in the alphabet — just like the ABC song! Plus special keys that do magic tricks.",
        activities: [
          { time: "0–5 min", label: "Welcome", desc: "Sing the ABC song while touching each letter on the keyboard as you sing it." },
          { time: "5–15 min", label: "Skill Lesson", desc: (name: string) => `Find the letters in ${name.toUpperCase()} on the keyboard. Then type them in a text editor — first in lowercase, then uppercase with Shift.` },
          { time: "15–25 min", label: "Unplugged", desc: "Keyboard bingo! Make a 3x3 grid of letters, call them out, and stamp/mark them with a crayon." },
          { time: "25–45 min", label: "Computer Project", desc: (name: string) => `Type a short sentence: 'My name is ${name} and I love ___.' Let her fill in her favorite thing. Decorate the page with drawing tools.` },
          { time: "45–55 min", label: "AI Moment", desc: (name: string) => `Ask AI to write a short poem using ${name}'s name. Read it together and let ${name} type one word from the poem.` },
          { time: "55–60 min", label: "Reflection", desc: "What letter was hardest to find? What letter is her favorite? Save the typed sentence!" },
        ],
        aiPrompt: (name: string) => `Ask AI: 'Write a short 4-line poem about a girl named ${name} who loves computers. Make it playful and fun for a 5-year-old!'`,
        miniProject: (name: string) => `${name}'s Name in Lights — type your name in giant colorful letters!`,
      },
      {
        num: 2,
        type: "Keyboard",
        title: "Space, Delete, Enter!",
        parentScript: (_name: string) =>
          "Today focuses on the 'power keys' — spacebar, backspace/delete, and Enter. These are the ones kids use most and feel most satisfying. Make it rhythmic and fun.",
        childExplain: "Some keys have superpowers! Spacebar makes a space (like a breath between words). Backspace is the eraser key. Enter is like saying 'GO!'",
        activities: [
          { time: "0–5 min", label: "Welcome", desc: "Review by typing her name from last session. How fast can she type it today?" },
          { time: "5–15 min", label: "Skill Lesson", desc: "Practice: press spacebar between words, use backspace to fix a letter, press Enter to go to a new line. Make a simple 2-word sentence." },
          { time: "15–25 min", label: "Unplugged", desc: "Clapping game: clap for spaces between words in a sentence. 'I love cats' = clap after 'I', after 'love'." },
          { time: "25–45 min", label: "Computer Project", desc: "Type a mini story: 3 sentences about her favorite animal. Use all the power keys — space, enter, backspace to fix." },
          { time: "45–55 min", label: "AI Moment", desc: "Share the animal story with AI and ask it to continue the story with one more sentence. Read it together!" },
          { time: "55–60 min", label: "Reflection", desc: "Which power key is the most powerful? Print the animal story to keep!" },
        ],
        aiPrompt: (name: string) => `Share ${name}'s animal story with AI and ask: 'Can you add one more fun sentence to this story a 5-year-old wrote? Keep it silly and sweet!'`,
        miniProject: (_name: string) => "My Animal Story — 3 sentences about a favorite animal!",
      },
    ],
    creativeLab: {
      title: "Alphabet Art 🌈",
      desc: "Type every letter of the alphabet in a text editor. Then pick your 5 favorites and make them HUGE and colorful using formatting tools. Screenshot and save!",
      aiPrompt: "Ask AI: 'Which letters look the most like pictures? Can you help me see 5 letters that look like animals or objects?'",
    },
  },
  {
    week: 3,
    theme: "Digital Artist 🎨",
    tagline: "Painting with pixels!",
    color: "#C8F5B5",
    accent: "#5DBB3F",
    badge: "🎨 Pixel Picasso",
    badgeDesc: "Created a real digital artwork!",
    goals: ["Use digital drawing tools", "Understand colors on screen", "Save and name a file", "Create a finished piece of digital art"],
    materials: ["Drawing app (MS Paint, Google Canvas, or Sketchpad.io)", "Color wheel printout", "Crayons for unplugged activity"],
    sessions: [
      {
        num: 1,
        type: "Digital Drawing",
        title: "Brush, Fill, and Color!",
        parentScript: (_name: string) =>
          "Let her experiment freely first — no correcting, no 'but make it look like X.' The goal is tool familiarity and creative joy. Praise the process, not the product.",
        childExplain: "In a drawing app, your mouse is the paintbrush! You can pick any color in the whole rainbow. And if you make a mistake, there's an undo button — like magic erasing!",
        activities: [
          { time: "0–5 min", label: "Welcome", desc: "Look at a famous colorful painting together (Matisse, Kandinsky). Ask: 'What do you notice? What's your favorite color here?'" },
          { time: "5–15 min", label: "Skill Lesson", desc: "Explore the drawing app together: pencil, brush, fill bucket, eraser, color picker, undo. Name each tool as you try it." },
          { time: "15–25 min", label: "Unplugged", desc: "Mix 3 real crayon colors on paper. Predict what color they'll make. Talk about how computers mix colors with numbers!" },
          { time: "25–45 min", label: "Computer Project", desc: "Paint a digital rainbow — each stripe a different color. Then add clouds, a sun, and anything else she wants!" },
          { time: "45–55 min", label: "AI Moment", desc: "Ask AI to describe a magical place with lots of colors. Then she draws ONE thing from the description." },
          { time: "55–60 min", label: "Reflection", desc: "Save the rainbow picture with a name she chooses. What would she paint next time?" },
        ],
        aiPrompt: (_name: string) =>
          "Ask AI: 'Describe a magical, colorful place in 3 sentences — somewhere a 5-year-old artist could draw. Make it dreamy and fun!'",
        miniProject: (_name: string) => "Rainbow World — a digital painting of a magical colorful scene!",
      },
      {
        num: 2,
        type: "Digital Drawing",
        title: "Sticker Scene!",
        parentScript: (_name: string) =>
          "Today is about composing a scene — arranging elements to tell a story. This builds spatial thinking. Let her direct completely where things go. You're just the technical helper.",
        childExplain: "Today we're making a sticker scene — like a digital collage! We'll draw lots of little things and arrange them to tell a story on screen.",
        activities: [
          { time: "0–5 min", label: "Welcome", desc: "Look at her rainbow painting from last session. Ask what she'd add if she could add one more thing." },
          { time: "5–15 min", label: "Skill Lesson", desc: "Learn copy/paste in the drawing app. Draw a small star, copy it, and paste it all over to make a starfield! Understand 'duplicate.'" },
          { time: "15–25 min", label: "Unplugged", desc: "Cut out magazine pictures (or draw on paper) and arrange them on a blank sheet to tell a story. This is analog collage — same idea as the digital project!" },
          { time: "25–45 min", label: "Computer Project", desc: (name: string) => `Create a digital sticker scene: draw a background (sky, underwater, forest), then add characters and objects. Save as '${name}'s Sticker World.'` },
          { time: "45–55 min", label: "AI Moment", desc: "Ask AI: 'Tell me a short story about what's happening in my picture.' Describe the picture to AI first, then read the story!" },
          { time: "55–60 min", label: "Reflection", desc: "What's the story behind the scene? Name all the characters. Save and maybe print!" },
        ],
        aiPrompt: (name: string) =>
          `Describe ${name}'s sticker scene to AI and ask: 'Write a 3-sentence story about this picture. Make it silly and magical!'`,
        miniProject: (_name: string) => "Digital Sticker Scene — a complete scene with characters and a story!",
      },
    ],
    creativeLab: {
      title: "AI Color Dreamer 🌈",
      desc: "Ask AI to imagine a color that doesn't exist. What would it look like? What things would be that color? Then try to paint it in the drawing app!",
      aiPrompt: "Ask AI: 'Invent a completely new color that has never existed. Give it a name, describe what it looks like, and name 5 things that would be that color. Make it magical!'",
    },
  },
  {
    week: 4,
    theme: "Logic Explorer 🧩",
    tagline: "Thinking like a computer!",
    color: "#F5D5FF",
    accent: "#A855D9",
    badge: "🧩 Logic Champion",
    badgeDesc: "Solved my first coding puzzle!",
    goals: ["Understand sequences and order", "Follow and give instructions", "Recognize patterns", "Debug a simple sequence"],
    materials: ["Sequence cards (printable)", "Building blocks or LEGO", "ScratchJr app (iPad/tablet)", "Paper and markers"],
    sessions: [
      {
        num: 1,
        type: "Coding Logic",
        title: "Step by Step!",
        parentScript: (_name: string) =>
          "Coding logic is about precise instructions in the right order. The unplugged activities here do as much teaching as the computer. Don't rush to the screen — the physical activities are the foundation.",
        childExplain: "Computers only do EXACTLY what you tell them, step by step. So we have to be really good at giving clear instructions. It's like being the boss!",
        activities: [
          { time: "0–5 min", label: "Welcome", desc: (name: string) => `Play 'Robot ${name}' — you give ${name} instructions to walk across the room ('step forward, turn left, take 2 steps') and she follows exactly. Then switch!` },
          { time: "5–15 min", label: "Skill Lesson", desc: "Introduce 'sequences' — things that must happen in order. Demo: 'To make a sandwich: get bread, add butter, add jam, close sandwich.' What happens if the order is wrong?" },
          { time: "15–25 min", label: "Unplugged", desc: "Sequence scramble! Give her 4 picture cards of a morning routine out of order. She puts them in the right sequence." },
          { time: "25–45 min", label: "Computer Project", desc: "Open ScratchJr. Make a cat walk across the screen using 3 blocks: Start, Move, End. Celebrate the first program!" },
          { time: "45–55 min", label: "AI Moment", desc: "Ask AI: 'What is a computer program in simple words?' Read together and explain in your own words." },
          { time: "55–60 min", label: "Reflection", desc: "Ask: 'What does a computer do if you give it the wrong order?' Talk about why sequence matters." },
        ],
        aiPrompt: (_name: string) =>
          "Ask AI: 'Can you explain what a computer program is using a story about a robot making breakfast? Keep it simple for a 5-year-old!'",
        miniProject: (_name: string) => "ScratchJr First Steps — make a character walk across the screen!",
      },
      {
        num: 2,
        type: "Coding Logic",
        title: "Pattern Detective!",
        parentScript: (_name: string) =>
          "Patterns are the foundation of all coding. This session is about recognizing and extending them. Keep it playful — use color, music, movement. Patterns are everywhere!",
        childExplain: "Patterns are things that repeat in a predictable way! Like: red, blue, red, blue — what comes next? Computers LOVE patterns. They use them all the time!",
        activities: [
          { time: "0–5 min", label: "Welcome", desc: (name: string) => `Clap a pattern: clap-clap-stomp, clap-clap-stomp. Can ${name} copy it? Can she make her own?` },
          { time: "5–15 min", label: "Skill Lesson", desc: "Show patterns in: colors, shapes, numbers, sounds. Introduce 'loops' — when a pattern repeats in code, we call it a loop!" },
          { time: "15–25 min", label: "Unplugged", desc: "Bead pattern bracelets! Alternate 2 colors in a pattern. Then try a 3-color pattern. Talk about what comes next." },
          { time: "25–45 min", label: "Computer Project", desc: "In ScratchJr: make a character do a loop — jump 3 times in a row, or spin then move, spin then move. Use the repeat block!" },
          { time: "45–55 min", label: "AI Moment", desc: (name: string) => `Ask AI to make a silly sound pattern with words (like 'beep boop bop, beep boop bop'). ${name} creates the actions for each sound!` },
          { time: "55–60 min", label: "Reflection", desc: "Name 3 patterns you see in real life. Give the Logic Champion badge!" },
        ],
        aiPrompt: (_name: string) =>
          "Ask AI: 'Make a funny sound pattern using 3 silly words that repeat 3 times. Then tell me what dance move could go with each sound!'",
        miniProject: (_name: string) => "Pattern Dance — ScratchJr character that loops a fun dance move!",
      },
    ],
    creativeLab: {
      title: "Bug Detective Agency 🔍",
      desc: "Mommy writes a sequence of instructions with ONE mistake in it. She has to find the bug! Then fix it. Practice on paper first, then in ScratchJr.",
      aiPrompt: "Ask AI: 'Write a 5-step sequence for a robot to make a birthday cake, but put one step in the wrong place. I need to find the bug!'",
    },
  },
];

const SKILL_MAP = [
  { id: "computer", label: "Computer Basics", icon: "💻", color: "#FFB5C8", weeks: [1, 2] },
  { id: "mouse", label: "Mouse & Trackpad", icon: "🖱️", color: "#FFDDB5", weeks: [1] },
  { id: "keyboard", label: "Keyboard", icon: "⌨️", color: "#B5D5FF", weeks: [2] },
  { id: "drawing", label: "Digital Drawing", icon: "🎨", color: "#C8F5B5", weeks: [3] },
  { id: "logic", label: "Logic & Sequencing", icon: "🧩", color: "#F5D5FF", weeks: [4] },
  { id: "debugging", label: "Debugging", icon: "🔍", color: "#FFE8B5", weeks: [4, 5] },
  { id: "ai", label: "AI Literacy", icon: "🤖", color: "#D5F5FF", weeks: [1, 2, 3, 4] },
  { id: "prompting", label: "Prompting", icon: "✨", color: "#FFD5F5", weeks: [3, 4, 5] },
  { id: "storytelling", label: "Storytelling", icon: "📖", color: "#D5FFE8", weeks: [5, 6] },
  { id: "coding", label: "Beginner Coding", icon: "🚀", color: "#E8D5FF", weeks: [4, 5, 6] },
  { id: "projects", label: "Creative Projects", icon: "🌟", color: "#FFF5B5", weeks: [3, 4, 5, 6] },
  { id: "presentation", label: "Presentation Skills", icon: "🎤", color: "#FFE8D5", weeks: [11, 12] },
];

const PROJECTS = [
  { id: 1, title: "First Computer Drawing", icon: "🖼️", week: 1, status: "available", desc: "Move the mouse and create your very first digital artwork!" },
  { id: 2, title: "Robot Friend Card", icon: "🤖", week: 1, status: "available", desc: "Design a card for your imaginary robot friend." },
  { id: 3, title: "AI Bedtime Story", icon: "📖", week: 2, status: "locked", desc: "Work with AI to create a magical bedtime story." },
  { id: 4, title: "ScratchJr Character", icon: "🐱", week: 4, status: "locked", desc: "Make your first animated character come to life!" },
  { id: 5, title: "Digital Sticker Scene", icon: "🌈", week: 3, status: "locked", desc: "Create a colorful world with digital stickers." },
  { id: 6, title: "Pattern Dance Game", icon: "💃", week: 4, status: "locked", desc: "Program a character to dance in a pattern!" },
  { id: 7, title: "Bug Detective Game", icon: "🔍", week: 4, status: "locked", desc: "Find the bugs in the code and fix them!" },
  { id: 8, title: "My First Helper Bot", icon: "✨", week: 6, status: "locked", desc: "Design a bot that helps with one special task." },
  { id: 9, title: "Mini Storybook", icon: "📚", week: 8, status: "locked", desc: "Write and illustrate a 5-page digital storybook." },
  { id: 10, title: "Family Presentation Day", icon: "🎤", week: 12, status: "locked", desc: "Present everything you've learned to the family!" },
];

const AI_RULES = (name: string) => [
  { icon: "👩‍👧", rule: "We use AI with Mommy", desc: "AI time is always a team activity!" },
  { icon: "🔒", rule: "We keep secrets safe", desc: `Never share our name, address, or photos with AI.` },
  { icon: "🤖", rule: "AI is not a real person", desc: "It's a very smart computer program, not a friend." },
  { icon: "🤔", rule: "AI can make mistakes", desc: "We always check what AI says with Mommy." },
  { icon: "👑", rule: `${name} is the boss of the idea`, desc: "AI helps, but YOUR creativity leads!" },
  { icon: "✅", rule: "Mommy checks everything", desc: "Before we use anything from AI, Mommy reviews it." },
];

const SEGMENTS = [
  { label: "Welcome", duration: 5, color: "#FFB5C8", icon: "👋" },
  { label: "Skill Lesson", duration: 10, color: "#B5D5FF", icon: "📚" },
  { label: "Unplugged Activity", duration: 10, color: "#C8F5B5", icon: "✏️" },
  { label: "Computer Project", duration: 20, color: "#F5D5FF", icon: "💻" },
  { label: "AI Co-Creator", duration: 10, color: "#FFE8B5", icon: "🤖" },
  { label: "Reflection & Wrap-Up", duration: 5, color: "#D5F5FF", icon: "🌟" },
];

// ── Helper to resolve string | ((name:string)=>string) ──────────────────────
function resolve(val: string | ((n: string) => string), name: string): string {
  return typeof val === "function" ? val(name) : val;
}

// ── SETUP GATE ───────────────────────────────────────────────────────────────
function SetupGate({ onSave }: { onSave: (name: string, age: number) => void }) {
  const [input, setInput] = useState("");
  const [age, setAge] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSave = async () => {
    const trimmed = input.trim();
    if (!trimmed) { setError("Please enter your child's name!"); return; }
    const parsedAge = Number(age);
    if (!Number.isInteger(parsedAge) || parsedAge < 3 || parsedAge > 17) {
      setError("Please choose an age between 3 and 17.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      await apiRequest("PATCH", "/api/user/profile", { childName: trimmed, childAge: parsedAge });
      onSave(trimmed, parsedAge);
    } catch {
      setError("Couldn't save — please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ fontFamily: "'Nunito', sans-serif", minHeight: "100vh", background: "linear-gradient(135deg, #FFF5FB 0%, #F5F8FF 50%, #F8FFF5 100%)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ background: "white", borderRadius: 32, padding: 48, maxWidth: 480, width: "100%", textAlign: "center", boxShadow: "0 8px 40px rgba(255,150,180,0.2)" }}>
        <div style={{ fontSize: 64, marginBottom: 16 }}>🌟</div>
        <h1 style={{ fontSize: 28, fontWeight: 900, color: "#333", marginBottom: 8 }}>Welcome to Kids Learning!</h1>
        <p style={{ fontSize: 16, color: "#888", lineHeight: 1.7, marginBottom: 32 }}>
          This launch edition includes the first 4 weeks of the 12-week beginner computer program. Let's personalize the dashboard for your child.
        </p>
        <input
          value={input}
          onChange={e => { setInput(e.target.value); setError(""); }}
          onKeyDown={e => e.key === "Enter" && handleSave()}
          placeholder="e.g. Naya, Emma, Zoe…"
          style={{
            width: "100%", border: "2px solid #FFB5C8", borderRadius: 16, padding: "14px 18px",
            fontSize: 18, fontFamily: "inherit", outline: "none", textAlign: "center",
            marginBottom: 8, boxSizing: "border-box", color: "#333",
          }}
        />
        <select
          value={age}
          onChange={e => { setAge(e.target.value); setError(""); }}
          style={{
            width: "100%", border: "2px solid #B5D5FF", borderRadius: 16, padding: "14px 18px",
            fontSize: 18, fontFamily: "inherit", outline: "none", textAlign: "center",
            marginBottom: 8, boxSizing: "border-box", color: age ? "#333" : "#999",
            background: "white",
          }}
        >
          <option value="">Choose age</option>
          {Array.from({ length: 15 }, (_, i) => i + 3).map((childAge) => (
            <option key={childAge} value={childAge}>{childAge} years old</option>
          ))}
        </select>
        {error && <p style={{ color: "#FF6B9D", fontSize: 14, marginBottom: 8 }}>{error}</p>}
        <button
          onClick={handleSave}
          disabled={saving}
          style={{
            width: "100%", background: "linear-gradient(135deg, #FFB5C8, #FF6B9D)", border: "none",
            borderRadius: 16, padding: "14px 24px", color: "white", fontWeight: 900,
            fontSize: 18, cursor: saving ? "not-allowed" : "pointer", marginTop: 8,
          }}
        >
          {saving ? "Saving… ✨" : "Let's go! 🚀"}
        </button>
      </div>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;900&display=swap');`}</style>
    </div>
  );
}

// ── UPGRADE GATE ─────────────────────────────────────────────────────────────
function UpgradeGate() {
  const [, navigate] = useLocation();
  return (
    <div style={{ fontFamily: "'Nunito', sans-serif", minHeight: "100vh", background: "linear-gradient(135deg, #FFF5FB 0%, #F5F8FF 50%, #F8FFF5 100%)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ background: "white", borderRadius: 32, padding: 48, maxWidth: 480, width: "100%", textAlign: "center", boxShadow: "0 8px 40px rgba(255,150,180,0.2)" }}>
        <div style={{ fontSize: 64, marginBottom: 16 }}>🔒</div>
        <h1 style={{ fontSize: 28, fontWeight: 900, color: "#333", marginBottom: 8 }}>Studio Members Only</h1>
        <p style={{ fontSize: 16, color: "#888", lineHeight: 1.7, marginBottom: 32 }}>
          The Kids Learning Program launch edition is included with the MetaHers Studio membership and above.
        </p>
        <button
          onClick={() => navigate("/upgrade")}
          style={{
            width: "100%", background: "linear-gradient(135deg, #FFB5C8, #FF6B9D)", border: "none",
            borderRadius: 16, padding: "14px 24px", color: "white", fontWeight: 900,
            fontSize: 18, cursor: "pointer",
          }}
        >
          Upgrade to Studio 🌟
        </button>
        <button
          onClick={() => navigate("/dashboard")}
          style={{ marginTop: 12, background: "none", border: "none", color: "#aaa", fontSize: 14, cursor: "pointer" }}
        >
          ← Back to Dashboard
        </button>
      </div>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;900&display=swap');`}</style>
    </div>
  );
}

// ── MAIN DASHBOARD ────────────────────────────────────────────────────────────
export default function KidsLearningPage() {
  const { user, isLoading } = useAuth();
  const queryClient = useQueryClient();
  const [childNameLocal, setChildNameLocal] = useState<string | null>(null);
  const [childAgeLocal, setChildAgeLocal] = useState<number | null>(null);
  const hasHydratedProgress = useRef(false);
  const skipNextProgressSave = useRef(false);

  // Resolved child name: prefer local override (after setup gate saves), then server value
  const childName: string = childNameLocal ?? (user?.childName || "");
  const childAge: number | null = childAgeLocal ?? (user?.childAge || null);
  const isAdmin = !!(user as any)?.isAdmin;
  const hasKidsAccess = isAdmin || canAccessSignatureFeatures(user?.subscriptionTier);

  const { data: savedProgress, isLoading: progressLoading } = useQuery<KidsProgress | null>({
    queryKey: ["/api/kids/progress"],
    queryFn: () => apiRequestJson<KidsProgress | null>("GET", "/api/kids/progress"),
    enabled: !!user && hasKidsAccess,
    staleTime: 30_000,
  });

  const [mode, setMode] = useState<"parent" | "child">("parent");
  const [tab, setTab] = useState("home");
  const [selectedWeek, setSelectedWeek] = useState(DEFAULT_KIDS_PROGRESS.selectedWeek);
  const [selectedSession, setSelectedSession] = useState(DEFAULT_KIDS_PROGRESS.selectedSession);
  const [timerActive, setTimerActive] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [segmentIdx, setSegmentIdx] = useState(0);
  const [completedWeeks, setCompletedWeeks] = useState<number[]>(DEFAULT_KIDS_PROGRESS.completedWeeks);
  const [badges, setBadges] = useState<string[]>(DEFAULT_KIDS_PROGRESS.badges);
  const [completedProjects, setCompletedProjects] = useState<number[]>(DEFAULT_KIDS_PROGRESS.completedProjects);
  const [notes, setNotes] = useState<Record<string, string>>(DEFAULT_KIDS_PROGRESS.notes);
  const [progress, setProgress] = useState(DEFAULT_KIDS_PROGRESS.reflections);
  const [aiContent, setAiContent] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [showBadgeModal, setShowBadgeModal] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const currentWeekData = WEEKS_DATA[selectedWeek - 1];
  const currentSession = currentWeekData?.sessions?.[selectedSession];
  const currentSegment = SEGMENTS[segmentIdx];
  const segmentMaxSeconds = currentSegment ? currentSegment.duration * 60 : 300;

  useEffect(() => {
    if (timerActive) {
      timerRef.current = setInterval(() => {
        setTimerSeconds(s => {
          if (s + 1 >= segmentMaxSeconds) {
            if (segmentIdx < SEGMENTS.length - 1) {
              setSegmentIdx(i => i + 1);
              return 0;
            } else {
              setTimerActive(false);
              if (timerRef.current) clearInterval(timerRef.current);
              return s;
            }
          }
          return s + 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [timerActive, segmentIdx, segmentMaxSeconds]);

  useEffect(() => {
    if (hasHydratedProgress.current || savedProgress === undefined) return;

    const nextProgress = savedProgress ?? DEFAULT_KIDS_PROGRESS;
    setCompletedWeeks(nextProgress.completedWeeks ?? []);
    setBadges(nextProgress.badges ?? []);
    setCompletedProjects(nextProgress.completedProjects ?? []);
    setNotes(nextProgress.notes ?? {});
    setProgress(nextProgress.reflections ?? DEFAULT_KIDS_PROGRESS.reflections);
    setSelectedWeek(Math.min(LAUNCH_WEEK_COUNT, Math.max(1, nextProgress.selectedWeek || 1)));
    setSelectedSession(Math.min(1, Math.max(0, nextProgress.selectedSession || 0)));
    hasHydratedProgress.current = true;
    skipNextProgressSave.current = true;
  }, [savedProgress]);

  useEffect(() => {
    if (!hasHydratedProgress.current || !user || !hasKidsAccess || !childName) return;
    if (skipNextProgressSave.current) {
      skipNextProgressSave.current = false;
      return;
    }

    setSaveStatus("saving");
    const timeout = window.setTimeout(async () => {
      try {
        await apiRequest("PATCH", "/api/kids/progress", {
          completedWeeks,
          badges,
          completedProjects,
          notes,
          reflections: progress,
          selectedWeek,
          selectedSession,
        });
        setSaveStatus("saved");
        queryClient.invalidateQueries({ queryKey: ["/api/kids/progress"] });
      } catch {
        setSaveStatus("error");
      }
    }, 700);

    return () => window.clearTimeout(timeout);
  }, [
    user,
    hasKidsAccess,
    childName,
    completedWeeks,
    badges,
    completedProjects,
    notes,
    progress,
    selectedWeek,
    selectedSession,
    queryClient,
  ]);

  const resetTimer = () => { setTimerActive(false); setTimerSeconds(0); setSegmentIdx(0); };

  const generateAIContent = async (prompt: string) => {
    setAiLoading(true);
    setAiContent(null);
    try {
      const res = await apiRequest("POST", "/api/kids/ai-prompt", { prompt });
      const data = await res.json();
      setAiContent(data.text || "Something magical is coming! ✨");
    } catch {
      setAiContent("Oops! The AI is taking a little nap. Try again soon! 😴");
    }
    setAiLoading(false);
  };

  const earnBadge = (badge: string) => {
    if (!badges.includes(badge)) {
      setBadges(b => [...b, badge]);
      setShowBadgeModal(badge);
      setTimeout(() => setShowBadgeModal(null), 3000);
    }
  };

  const completeWeek = (w: number) => {
    if (!completedWeeks.includes(w)) {
      setCompletedWeeks(wks => [...wks, w]);
      const weekData = WEEKS_DATA[w - 1];
      if (weekData) earnBadge(weekData.badge);
    }
  };

  const handleChildNameSave = async (name: string, age: number) => {
    setChildNameLocal(name);
    setChildAgeLocal(age);
    // Refresh user query so childName is up-to-date everywhere
    await queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
    hasHydratedProgress.current = false;
    await queryClient.invalidateQueries({ queryKey: ["/api/kids/progress"] });
  };

  // ── Loading ──
  if (isLoading || (!!user && hasKidsAccess && progressLoading && !hasHydratedProgress.current)) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg, #FFF5FB 0%, #F5F8FF 50%, #F8FFF5 100%)" }}>
        <div style={{ fontSize: 48 }}>✨</div>
      </div>
    );
  }

  // ── Tier gate ──
  if (!hasKidsAccess) {
    return <UpgradeGate />;
  }

  // ── Setup gate: no child name yet ──
  if (!childName || !childAge) {
    return <SetupGate onSave={handleChildNameSave} />;
  }

  // ── CHILD MODE ──
  if (mode === "child") {
    const todayWeek = WEEKS_DATA[selectedWeek - 1];
    const todaySession = todayWeek?.sessions?.[selectedSession];
    return (
      <div style={{ fontFamily: "'Nunito', 'Comic Sans MS', cursive", minHeight: "100vh", background: "linear-gradient(135deg, #FFE8F5 0%, #E8F5FF 50%, #F5FFE8 100%)" }}>
        <div style={{ background: "white", borderRadius: "0 0 40px 40px", padding: "24px 32px", boxShadow: "0 4px 30px rgba(255,150,180,0.2)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 36, marginBottom: 4 }}>🌟</div>
            <div style={{ fontSize: 28, fontWeight: 900, color: "#FF6B9D" }}>{childName}'s Studio!</div>
          </div>
          <button onClick={() => setMode("parent")} style={{ background: "#f0f0f0", border: "none", borderRadius: 20, padding: "8px 16px", fontSize: 14, cursor: "pointer", color: "#888" }}>
            👩 Mom Mode
          </button>
        </div>
        <div style={{ padding: "32px 24px", maxWidth: 500, margin: "0 auto" }}>
          <div style={{ background: "white", borderRadius: 32, padding: 32, marginBottom: 24, boxShadow: "0 8px 40px rgba(255,150,180,0.25)", textAlign: "center" }}>
            <div style={{ fontSize: 60, marginBottom: 16 }}>🚀</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#FF6B9D", textTransform: "uppercase", letterSpacing: 2, marginBottom: 8 }}>Today's Mission</div>
            <div style={{ fontSize: 28, fontWeight: 900, color: "#333", marginBottom: 8 }}>{todaySession?.title || "Pick a session!"}</div>
            <div style={{ fontSize: 16, color: "#666", lineHeight: 1.6 }}>{todaySession?.childExplain || "Ask Mommy to pick today's session!"}</div>
          </div>
          <div style={{ background: "linear-gradient(135deg, #FFB5C8, #FF6B9D)", borderRadius: 24, padding: 24, marginBottom: 24, color: "white", textAlign: "center" }}>
            <div style={{ fontSize: 14, fontWeight: 700, textTransform: "uppercase", letterSpacing: 2, opacity: 0.8, marginBottom: 8 }}>⭐ Today's Goal</div>
            <div style={{ fontSize: 22, fontWeight: 900 }}>{todayWeek?.goals?.[0] || "Have fun and learn something new!"}</div>
          </div>
          <div style={{ background: "linear-gradient(135deg, #B5D5FF, #4A90D9)", borderRadius: 24, padding: 24, marginBottom: 24, color: "white", textAlign: "center" }}>
            <div style={{ fontSize: 14, fontWeight: 700, textTransform: "uppercase", letterSpacing: 2, opacity: 0.8, marginBottom: 8 }}>🎨 Today's Project</div>
            <div style={{ fontSize: 22, fontWeight: 900 }}>
              {todaySession ? resolve(todaySession.miniProject, childName) : "Something amazing is coming!"}
            </div>
          </div>
          <div style={{ background: "linear-gradient(135deg, #F5D5FF, #A855D9)", borderRadius: 24, padding: 24, marginBottom: 32, color: "white", textAlign: "center" }}>
            <div style={{ fontSize: 14, fontWeight: 700, textTransform: "uppercase", letterSpacing: 2, opacity: 0.8, marginBottom: 8 }}>🏆 Badge to Earn</div>
            <div style={{ fontSize: 32, marginBottom: 8 }}>{todayWeek?.badge?.split(" ")[0]}</div>
            <div style={{ fontSize: 22, fontWeight: 900 }}>{todayWeek?.badge?.split(" ").slice(1).join(" ")}</div>
          </div>
          <div style={{ textAlign: "center", fontSize: 20, fontWeight: 700, color: "#FF6B9D", lineHeight: 1.8 }}>
            You are SO smart and creative! 💖<br />
            Mommy is so proud of you! 🌟
          </div>
        </div>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;900&display=swap');`}</style>
      </div>
    );
  }

  // ── PARENT MODE ──
  const NAV = [
    { id: "home", icon: "🏠", label: "Home" },
    { id: "curriculum", icon: "📅", label: "Curriculum" },
    { id: "session", icon: "⏱️", label: "Session" },
    { id: "progress", icon: "📊", label: "Progress" },
    { id: "skills", icon: "🗺️", label: "Skills" },
    { id: "safety", icon: "🔒", label: "AI Safety" },
    { id: "projects", icon: "🎨", label: "Projects" },
    { id: "parent", icon: "👩", label: "Parent Hub" },
  ];

  return (
    <div style={{ fontFamily: "'Nunito', sans-serif", minHeight: "100vh", background: "linear-gradient(135deg, #FFF5FB 0%, #F5F8FF 50%, #F8FFF5 100%)" }}>
      {/* Badge Modal */}
      {showBadgeModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ background: "white", borderRadius: 32, padding: 48, textAlign: "center" }}>
            <div style={{ fontSize: 80 }}>{showBadgeModal.split(" ")[0]}</div>
            <div style={{ fontSize: 28, fontWeight: 900, color: "#FF6B9D", marginTop: 16 }}>Badge Earned!</div>
            <div style={{ fontSize: 20, color: "#333", marginTop: 8 }}>{showBadgeModal}</div>
          </div>
        </div>
      )}

      {/* Top Header */}
      <div style={{ background: "white", borderBottom: "2px solid #FFE8F5", padding: "16px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, zIndex: 100, boxShadow: "0 2px 20px rgba(255,150,180,0.1)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ fontSize: 32 }}>🌟</div>
          <div>
            <div style={{ fontSize: 20, fontWeight: 900, color: "#FF6B9D", lineHeight: 1.2 }}>{childName}'s Junior AI Studio</div>
            <div style={{ fontSize: 12, color: "#888" }}>Weeks 1-4 Launch Edition • Week {selectedWeek}</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <div style={{ background: "#FFF0F7", borderRadius: 20, padding: "6px 14px", fontSize: 13, fontWeight: 700, color: "#FF6B9D" }}>
            🏆 {badges.length} badges
          </div>
          <div style={{ background: saveStatus === "error" ? "#FFE8E8" : "#F5F5F5", borderRadius: 20, padding: "6px 14px", fontSize: 12, fontWeight: 700, color: saveStatus === "error" ? "#D94A4A" : "#888" }}>
            {saveStatus === "saving" ? "Saving..." : saveStatus === "error" ? "Save failed" : "Saved"}
          </div>
          <button onClick={() => setMode("child")} style={{ background: "linear-gradient(135deg, #FFB5C8, #FF6B9D)", border: "none", borderRadius: 20, padding: "8px 18px", fontSize: 14, fontWeight: 700, color: "white", cursor: "pointer" }}>
            👧 {childName}'s View
          </button>
        </div>
      </div>

      <div style={{ display: "flex", minHeight: "calc(100vh - 70px)" }}>
        {/* Sidebar */}
        <div style={{ width: 220, background: "white", borderRight: "2px solid #FFE8F5", padding: "24px 16px", display: "flex", flexDirection: "column", gap: 4, flexShrink: 0 }}>
          {NAV.map(n => (
            <button key={n.id} onClick={() => setTab(n.id)} style={{
              background: tab === n.id ? "linear-gradient(135deg, #FFB5C8, #FF6B9D)" : "transparent",
              border: "none", borderRadius: 16, padding: "12px 16px", textAlign: "left", cursor: "pointer",
              color: tab === n.id ? "white" : "#555", fontWeight: tab === n.id ? 700 : 500,
              fontSize: 14, display: "flex", alignItems: "center", gap: 10, transition: "all 0.2s",
            }}>
              <span style={{ fontSize: 18 }}>{n.icon}</span> {n.label}
            </button>
          ))}
          <div style={{ marginTop: "auto", borderTop: "2px solid #FFE8F5", paddingTop: 16 }}>
            <div style={{ fontSize: 11, color: "#bbb", textAlign: "center", lineHeight: 1.6 }}>
              Weeks 1-4 Live<br />{childName} ✨
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div style={{ flex: 1, padding: "32px 40px", overflowY: "auto" }}>

          {/* ── HOME TAB ── */}
          {tab === "home" && (
            <div>
              <h1 style={{ fontSize: 36, fontWeight: 900, color: "#333", marginBottom: 8 }}>Good day! 👋</h1>
              <p style={{ color: "#888", fontSize: 16, marginBottom: 40 }}>{childName}'s learning dashboard. Here's your overview.</p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24, marginBottom: 40 }}>
                {[
                  { label: "Weeks Completed", value: `${completedWeeks.length}/${LAUNCH_WEEK_COUNT}`, color: "#FFB5C8", icon: "📅" },
                  { label: "Badges Earned", value: badges.length, color: "#B5D5FF", icon: "🏆" },
                  { label: "Projects Made", value: `${completedProjects.length}/10`, color: "#C8F5B5", icon: "🎨" },
                ].map(s => (
                  <div key={s.label} style={{ background: "white", borderRadius: 24, padding: 28, boxShadow: "0 4px 20px rgba(0,0,0,0.06)", borderTop: `4px solid ${s.color}` }}>
                    <div style={{ fontSize: 32, marginBottom: 12 }}>{s.icon}</div>
                    <div style={{ fontSize: 40, fontWeight: 900, color: "#333" }}>{s.value}</div>
                    <div style={{ fontSize: 14, color: "#888", marginTop: 4 }}>{s.label}</div>
                  </div>
                ))}
              </div>
              {currentWeekData && (
                <div style={{ background: "white", borderRadius: 28, padding: 32, boxShadow: "0 4px 30px rgba(0,0,0,0.08)", marginBottom: 32, borderLeft: `6px solid ${currentWeekData.color}` }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: currentWeekData.accent, textTransform: "uppercase", letterSpacing: 2, marginBottom: 4 }}>Current Week {selectedWeek}</div>
                      <div style={{ fontSize: 28, fontWeight: 900, color: "#333" }}>{currentWeekData.theme}</div>
                      <div style={{ fontSize: 16, color: "#888", marginTop: 4 }}>{currentWeekData.tagline}</div>
                    </div>
                    <div style={{ background: currentWeekData.color, borderRadius: 20, padding: "12px 20px", textAlign: "center" }}>
                      <div style={{ fontSize: 28 }}>{currentWeekData.badge.split(" ")[0]}</div>
                      <div style={{ fontSize: 11, fontWeight: 700, color: "#555" }}>Badge</div>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    {currentWeekData.goals.map((g, i) => (
                      <span key={i} style={{ background: "#f5f5f5", borderRadius: 20, padding: "6px 14px", fontSize: 13, color: "#555" }}>✓ {g}</span>
                    ))}
                  </div>
                  <div style={{ marginTop: 20, display: "flex", gap: 12 }}>
                    <button onClick={() => setTab("session")} style={{ background: "linear-gradient(135deg, #FFB5C8, #FF6B9D)", border: "none", borderRadius: 16, padding: "12px 24px", color: "white", fontWeight: 700, fontSize: 15, cursor: "pointer" }}>
                      ▶ Start Session
                    </button>
                    <button onClick={() => setTab("curriculum")} style={{ background: "#f5f5f5", border: "none", borderRadius: 16, padding: "12px 24px", color: "#555", fontWeight: 600, fontSize: 15, cursor: "pointer" }}>
                      📋 View Curriculum
                    </button>
                  </div>
                </div>
              )}
              <div style={{ background: "white", borderRadius: 24, padding: 28, boxShadow: "0 4px 20px rgba(0,0,0,0.06)" }}>
                <div style={{ fontSize: 16, fontWeight: 700, color: "#333", marginBottom: 4 }}>Weeks 1-4 Launch Journey</div>
                <div style={{ fontSize: 13, color: "#888", marginBottom: 20 }}>The next 8 weeks are being added over the next two weeks.</div>
                <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                  {Array.from({ length: 12 }, (_, i) => i + 1).map(w => {
                    const wd = WEEKS_DATA[w - 1];
                    const done = completedWeeks.includes(w);
                    const current = w === selectedWeek;
                    return (
                      <button key={w} onClick={() => wd && setSelectedWeek(w)} style={{
                        width: 56, height: 56, borderRadius: 16, border: current ? "3px solid #FF6B9D" : "2px solid #eee",
                        background: done ? "#C8F5B5" : current ? "#FFF0F7" : wd ? "white" : "#fafafa",
                        cursor: wd ? "pointer" : "default", fontSize: 13, fontWeight: 700,
                        color: done ? "#5DBB3F" : current ? "#FF6B9D" : "#999",
                        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 2,
                      }}>
                        <span>{done ? "✓" : w}</span>
                        <span style={{ fontSize: 9, opacity: 0.7 }}>{wd ? "ready" : "soon"}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ── CURRICULUM TAB ── */}
          {tab === "curriculum" && (
            <div>
              <h1 style={{ fontSize: 32, fontWeight: 900, color: "#333", marginBottom: 8 }}>📅 Weeks 1-4 Curriculum</h1>
              <p style={{ color: "#888", marginBottom: 32 }}>The first 4 weeks are live for launch. Weeks 5-12 are coming next.</p>
              <div style={{ display: "flex", gap: 8, marginBottom: 32, flexWrap: "wrap" }}>
                {WEEKS_DATA.map((w, i) => (
                  <button key={i} onClick={() => setSelectedWeek(w.week)} style={{
                    background: selectedWeek === w.week ? w.color : "white",
                    border: `2px solid ${selectedWeek === w.week ? w.accent : "#eee"}`,
                    borderRadius: 16, padding: "8px 16px", cursor: "pointer",
                    fontWeight: 700, fontSize: 13, color: selectedWeek === w.week ? "#333" : "#888",
                  }}>
                    W{w.week}: {w.theme.split(" ")[0]}
                  </button>
                ))}
                {Array.from({ length: 8 }, (_, i) => (
                  <div key={i + 5} style={{ background: "#f5f5f5", borderRadius: 16, padding: "8px 16px", fontSize: 13, color: "#ccc", fontWeight: 600 }}>
                    W{i + 5} Soon
                  </div>
                ))}
              </div>
              {currentWeekData ? (
                <div>
                  <div style={{ background: "white", borderRadius: 28, padding: 32, marginBottom: 24, boxShadow: "0 4px 20px rgba(0,0,0,0.06)", borderTop: `6px solid ${currentWeekData.color}` }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: currentWeekData.accent, textTransform: "uppercase", letterSpacing: 2 }}>Week {currentWeekData.week}</div>
                        <div style={{ fontSize: 32, fontWeight: 900, color: "#333", marginTop: 4 }}>{currentWeekData.theme}</div>
                        <div style={{ fontSize: 16, color: "#888" }}>{currentWeekData.tagline}</div>
                      </div>
                      <div style={{ textAlign: "center" }}>
                        <div style={{ fontSize: 48 }}>{currentWeekData.badge.split(" ")[0]}</div>
                        <div style={{ fontSize: 12, fontWeight: 700, color: "#888" }}>Earn this badge!</div>
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: "#555", marginBottom: 10 }}>🎯 Learning Goals</div>
                      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                        {currentWeekData.goals.map((g, i) => (
                          <span key={i} style={{ background: currentWeekData.color + "80", borderRadius: 20, padding: "6px 14px", fontSize: 13, fontWeight: 600, color: "#444" }}>{g}</span>
                        ))}
                      </div>
                    </div>
                    <div style={{ marginTop: 20 }}>
                      <div style={{ fontSize: 14, fontWeight: 700, color: "#555", marginBottom: 10 }}>🛍️ Materials Needed</div>
                      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                        {currentWeekData.materials.map((m, i) => (
                          <span key={i} style={{ background: "#f5f5f5", borderRadius: 20, padding: "6px 14px", fontSize: 13, color: "#666" }}>• {m}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                  {currentWeekData.sessions.map((sess, si) => (
                    <div key={si} style={{ background: "white", borderRadius: 24, padding: 28, marginBottom: 20, boxShadow: "0 4px 20px rgba(0,0,0,0.06)" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                        <div>
                          <div style={{ fontSize: 12, fontWeight: 700, color: "#FF6B9D", textTransform: "uppercase", letterSpacing: 2 }}>Session {sess.num} • {sess.type}</div>
                          <div style={{ fontSize: 22, fontWeight: 900, color: "#333", marginTop: 4 }}>{sess.title}</div>
                        </div>
                        <button onClick={() => { setSelectedSession(si); setTab("session"); }} style={{ background: "linear-gradient(135deg, #FFB5C8, #FF6B9D)", border: "none", borderRadius: 14, padding: "10px 20px", color: "white", fontWeight: 700, fontSize: 14, cursor: "pointer" }}>
                          ▶ Run Session
                        </button>
                      </div>
                      <div style={{ background: "#FFF8FB", borderRadius: 16, padding: 20, marginBottom: 16, borderLeft: "4px solid #FFB5C8" }}>
                        <div style={{ fontSize: 12, fontWeight: 700, color: "#FF6B9D", marginBottom: 6 }}>👩 PARENT SCRIPT</div>
                        <div style={{ fontSize: 14, color: "#555", lineHeight: 1.7 }}>{resolve(sess.parentScript, childName)}</div>
                      </div>
                      <div style={{ background: "#F8FFF5", borderRadius: 16, padding: 20, marginBottom: 16, borderLeft: "4px solid #C8F5B5" }}>
                        <div style={{ fontSize: 12, fontWeight: 700, color: "#5DBB3F", marginBottom: 6 }}>👧 SAY TO {childName.toUpperCase()}</div>
                        <div style={{ fontSize: 14, color: "#555", lineHeight: 1.7, fontStyle: "italic" }}>"{sess.childExplain}"</div>
                      </div>
                      <div style={{ marginBottom: 16 }}>
                        <div style={{ fontSize: 13, fontWeight: 700, color: "#555", marginBottom: 12 }}>⏱️ Session Timeline</div>
                        {sess.activities.map((a, ai) => (
                          <div key={ai} style={{ display: "flex", gap: 12, marginBottom: 10, alignItems: "flex-start" }}>
                            <div style={{ width: 80, flexShrink: 0, fontSize: 11, fontWeight: 700, color: currentWeekData.accent, background: currentWeekData.color + "60", borderRadius: 8, padding: "4px 8px", textAlign: "center" }}>{a.time}</div>
                            <div>
                              <div style={{ fontSize: 13, fontWeight: 700, color: "#333" }}>{a.label}</div>
                              <div style={{ fontSize: 13, color: "#666", lineHeight: 1.5 }}>{resolve(a.desc, childName)}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                        <div style={{ background: "#FFFBF0", borderRadius: 16, padding: 16, borderLeft: "4px solid #FFE8B5" }}>
                          <div style={{ fontSize: 12, fontWeight: 700, color: "#D4A017", marginBottom: 6 }}>🤖 AI PROMPT</div>
                          <div style={{ fontSize: 13, color: "#555", lineHeight: 1.6 }}>{resolve(sess.aiPrompt, childName)}</div>
                        </div>
                        <div style={{ background: "#F5F0FF", borderRadius: 16, padding: 16, borderLeft: "4px solid #E0C8FF" }}>
                          <div style={{ fontSize: 12, fontWeight: 700, color: "#A855D9", marginBottom: 6 }}>🎨 MINI PROJECT</div>
                          <div style={{ fontSize: 13, color: "#555", lineHeight: 1.6 }}>{resolve(sess.miniProject, childName)}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                  <div style={{ background: "linear-gradient(135deg, #FFF5FB, #F0F8FF)", borderRadius: 24, padding: 28, border: "2px dashed #FFB5C8" }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: "#FF6B9D", textTransform: "uppercase", letterSpacing: 2, marginBottom: 8 }}>✨ Optional Creative Lab</div>
                    <div style={{ fontSize: 22, fontWeight: 900, color: "#333", marginBottom: 12 }}>{currentWeekData.creativeLab.title}</div>
                    <div style={{ fontSize: 14, color: "#555", lineHeight: 1.7, marginBottom: 16 }}>{currentWeekData.creativeLab.desc}</div>
                    <div style={{ background: "white", borderRadius: 14, padding: 14, display: "flex", gap: 10, alignItems: "flex-start" }}>
                      <span style={{ fontSize: 20 }}>🤖</span>
                      <div>
                        <div style={{ fontSize: 11, fontWeight: 700, color: "#D4A017" }}>AI PROMPT FOR LAB</div>
                        <div style={{ fontSize: 13, color: "#555", marginTop: 4 }}>{currentWeekData.creativeLab.aiPrompt}</div>
                      </div>
                    </div>
                    <button onClick={() => completeWeek(selectedWeek)} style={{ marginTop: 16, background: "linear-gradient(135deg, #C8F5B5, #5DBB3F)", border: "none", borderRadius: 14, padding: "10px 22px", color: "white", fontWeight: 700, fontSize: 14, cursor: "pointer" }}>
                      ✓ Mark Week {selectedWeek} Complete
                    </button>
                  </div>
                </div>
              ) : (
                <div style={{ background: "white", borderRadius: 24, padding: 48, textAlign: "center", color: "#aaa" }}>
                  <div style={{ fontSize: 48, marginBottom: 16 }}>🔒</div>
                  <div style={{ fontSize: 20, fontWeight: 700 }}>This week is coming soon!</div>
                  <div style={{ fontSize: 14, marginTop: 8 }}>Complete the earlier weeks to unlock Week {selectedWeek}.</div>
                </div>
              )}
            </div>
          )}

          {/* ── SESSION RUNNER TAB ── */}
          {tab === "session" && (
            <div>
              <h1 style={{ fontSize: 32, fontWeight: 900, color: "#333", marginBottom: 8 }}>⏱️ Session Runner</h1>
              <p style={{ color: "#888", marginBottom: 32 }}>Run a live 60-minute session step by step.</p>
              <div style={{ display: "flex", gap: 16, marginBottom: 32, flexWrap: "wrap" }}>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "#888", marginBottom: 8 }}>WEEK</div>
                  <div style={{ display: "flex", gap: 8 }}>
                    {WEEKS_DATA.map(w => (
                      <button key={w.week} onClick={() => { setSelectedWeek(w.week); setSelectedSession(0); resetTimer(); }} style={{
                        background: selectedWeek === w.week ? w.color : "white",
                        border: `2px solid ${selectedWeek === w.week ? w.accent : "#eee"}`,
                        borderRadius: 12, padding: "8px 14px", cursor: "pointer", fontWeight: 700, fontSize: 14, color: "#444",
                      }}>W{w.week}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "#888", marginBottom: 8 }}>SESSION</div>
                  <div style={{ display: "flex", gap: 8 }}>
                    {currentWeekData?.sessions?.map((s, i) => (
                      <button key={i} onClick={() => { setSelectedSession(i); resetTimer(); }} style={{
                        background: selectedSession === i ? "#FFB5C8" : "white",
                        border: `2px solid ${selectedSession === i ? "#FF6B9D" : "#eee"}`,
                        borderRadius: 12, padding: "8px 16px", cursor: "pointer", fontWeight: 700, fontSize: 14, color: "#444",
                      }}>S{i + 1}: {s.title}</button>
                    ))}
                  </div>
                </div>
              </div>
              {currentSession && (
                <div style={{ background: "white", borderRadius: 24, padding: 28, marginBottom: 24, boxShadow: "0 4px 20px rgba(0,0,0,0.06)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: "#FF6B9D", textTransform: "uppercase", letterSpacing: 2 }}>Week {selectedWeek} • Session {selectedSession + 1} • {currentSession.type}</div>
                    <div style={{ fontSize: 26, fontWeight: 900, color: "#333", marginTop: 4 }}>{currentSession.title}</div>
                  </div>
                  <div style={{ display: "flex", gap: 10 }}>
                    <button onClick={() => setTimerActive(t => !t)} style={{
                      background: timerActive ? "linear-gradient(135deg, #FFB5C8, #FF6B9D)" : "linear-gradient(135deg, #C8F5B5, #5DBB3F)",
                      border: "none", borderRadius: 16, padding: "12px 24px", color: "white", fontWeight: 700, fontSize: 16, cursor: "pointer",
                    }}>
                      {timerActive ? "⏸ Pause" : "▶ Start"}
                    </button>
                    <button onClick={resetTimer} style={{ background: "#f5f5f5", border: "none", borderRadius: 16, padding: "12px 20px", fontWeight: 600, fontSize: 16, cursor: "pointer", color: "#666" }}>↺ Reset</button>
                  </div>
                </div>
              )}
              <div style={{ background: "white", borderRadius: 24, padding: 28, marginBottom: 24, boxShadow: "0 4px 20px rgba(0,0,0,0.06)" }}>
                <div style={{ display: "flex", gap: 0, borderRadius: 12, overflow: "hidden", marginBottom: 20, height: 12 }}>
                  {SEGMENTS.map((s, i) => (
                    <div key={i} style={{ flex: s.duration, background: i <= segmentIdx ? s.color : "#f0f0f0", opacity: i < segmentIdx ? 1 : i === segmentIdx ? 1 : 0.3, transition: "all 0.3s" }} />
                  ))}
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  {SEGMENTS.map((s, i) => (
                    <button key={i} onClick={() => { setSegmentIdx(i); setTimerSeconds(0); }} style={{
                      flex: 1, background: i === segmentIdx ? s.color : i < segmentIdx ? s.color + "60" : "#f5f5f5",
                      border: i === segmentIdx ? `2px solid ${s.color}88` : "2px solid transparent",
                      borderRadius: 12, padding: "10px 4px", cursor: "pointer", textAlign: "center",
                    }}>
                      <div style={{ fontSize: 18 }}>{s.icon}</div>
                      <div style={{ fontSize: 10, fontWeight: 700, color: i === segmentIdx ? "#333" : "#999", marginTop: 4, lineHeight: 1.2 }}>{s.label}</div>
                      <div style={{ fontSize: 10, color: "#aaa" }}>{s.duration}m</div>
                    </button>
                  ))}
                </div>
              </div>
              <div style={{ background: "white", borderRadius: 24, padding: 32, marginBottom: 24, boxShadow: "0 8px 40px rgba(0,0,0,0.08)", borderTop: `6px solid ${currentSegment.color}` }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#999", textTransform: "uppercase", letterSpacing: 2 }}>Current Segment</div>
                    <div style={{ fontSize: 32, fontWeight: 900, color: "#333", marginTop: 4 }}>{currentSegment.icon} {currentSegment.label}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 56, fontWeight: 900, color: "#333", fontVariantNumeric: "tabular-nums" }}>
                      {String(Math.floor((segmentMaxSeconds - timerSeconds) / 60)).padStart(2, "0")}:{String((segmentMaxSeconds - timerSeconds) % 60).padStart(2, "0")}
                    </div>
                    <div style={{ fontSize: 13, color: "#aaa" }}>remaining</div>
                  </div>
                </div>
                <div style={{ marginBottom: 16 }}>
                  <div style={{ background: "#f0f0f0", borderRadius: 99, height: 8 }}>
                    <div style={{ background: currentSegment.color, borderRadius: 99, height: 8, width: `${(timerSeconds / segmentMaxSeconds) * 100}%`, transition: "width 1s linear" }} />
                  </div>
                </div>
                {currentSession && (
                  <div style={{ background: "#fafafa", borderRadius: 16, padding: 20 }}>
                    {currentSession.activities[segmentIdx] && (
                      <>
                        <div style={{ fontSize: 13, fontWeight: 700, color: "#888", marginBottom: 8 }}>{currentSession.activities[segmentIdx].time}</div>
                        <div style={{ fontSize: 16, color: "#444", lineHeight: 1.7 }}>{resolve(currentSession.activities[segmentIdx].desc, childName)}</div>
                      </>
                    )}
                    {segmentIdx === 4 && (
                      <div style={{ marginTop: 16, borderTop: "2px solid #eee", paddingTop: 16 }}>
                        <div style={{ fontSize: 13, fontWeight: 700, color: "#D4A017", marginBottom: 8 }}>🤖 AI Prompt for this moment:</div>
                        <div style={{ fontSize: 14, color: "#555", lineHeight: 1.6, marginBottom: 12 }}>{resolve(currentSession.aiPrompt, childName)}</div>
                        <button onClick={() => generateAIContent(resolve(currentSession.aiPrompt, childName))} disabled={aiLoading} style={{
                          background: "linear-gradient(135deg, #FFE8B5, #D4A017)", border: "none", borderRadius: 12, padding: "10px 20px",
                          color: "white", fontWeight: 700, fontSize: 14, cursor: aiLoading ? "not-allowed" : "pointer",
                        }}>
                          {aiLoading ? "✨ Generating..." : "✨ Generate AI Response"}
                        </button>
                        {aiContent && (
                          <div style={{ marginTop: 16, background: "white", borderRadius: 14, padding: 20, borderLeft: "4px solid #FFE8B5" }}>
                            <div style={{ fontSize: 13, fontWeight: 700, color: "#D4A017", marginBottom: 8 }}>AI Said:</div>
                            <div style={{ fontSize: 15, color: "#333", lineHeight: 1.7 }}>{aiContent}</div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── PROGRESS TAB ── */}
          {tab === "progress" && (
            <div>
              <h1 style={{ fontSize: 32, fontWeight: 900, color: "#333", marginBottom: 8 }}>📊 Progress Tracker</h1>
              <p style={{ color: "#888", marginBottom: 32 }}>Track {childName}'s growth, confidence, and achievements.</p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 32 }}>
                <div style={{ background: "white", borderRadius: 24, padding: 28, boxShadow: "0 4px 20px rgba(0,0,0,0.06)" }}>
                  <div style={{ fontSize: 16, fontWeight: 700, color: "#333", marginBottom: 16 }}>💪 Confidence Level</div>
                  <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
                    {[1, 2, 3, 4, 5].map(n => (
                      <button key={n} onClick={() => setProgress(p => ({ ...p, confidence: n }))} style={{
                        width: 48, height: 48, borderRadius: 14, border: "none", fontSize: 22, cursor: "pointer",
                        background: n <= progress.confidence ? "linear-gradient(135deg, #FFB5C8, #FF6B9D)" : "#f0f0f0",
                      }}>
                        {n <= progress.confidence ? "⭐" : "☆"}
                      </button>
                    ))}
                  </div>
                  <div style={{ fontSize: 14, color: "#888" }}>
                    {["", "Just starting 🌱", "Getting there! 🌿", "Doing great! 🌟", "Superstar! ⭐", "Expert mode! 🚀"][progress.confidence]}
                  </div>
                </div>
                <div style={{ background: "white", borderRadius: 24, padding: 28, boxShadow: "0 4px 20px rgba(0,0,0,0.06)" }}>
                  <div style={{ fontSize: 16, fontWeight: 700, color: "#333", marginBottom: 16 }}>🏆 Badges Earned ({badges.length})</div>
                  {badges.length === 0 ? (
                    <div style={{ color: "#aaa", fontSize: 14 }}>Complete weeks to earn badges! ✨</div>
                  ) : (
                    <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                      {badges.map((b, i) => (
                        <div key={i} style={{ background: "#FFF0F7", borderRadius: 16, padding: "10px 14px", textAlign: "center" }}>
                          <div style={{ fontSize: 28 }}>{b.split(" ")[0]}</div>
                          <div style={{ fontSize: 10, fontWeight: 700, color: "#FF6B9D", marginTop: 4 }}>{b.split(" ").slice(1).join(" ")}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div style={{ background: "white", borderRadius: 24, padding: 28, boxShadow: "0 4px 20px rgba(0,0,0,0.06)", marginBottom: 24 }}>
                <div style={{ fontSize: 16, fontWeight: 700, color: "#333", marginBottom: 20 }}>📝 Session Reflections</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                  {[
                    { key: "favActivity" as const, label: `⭐ ${childName}'s Favorite Activity`, placeholder: "What did she love most?" },
                    { key: "whatWasHard" as const, label: "🤔 What Was Hard", placeholder: "What was tricky this session?" },
                    { key: "nextPractice" as const, label: "🎯 What to Practice Next", placeholder: "What should we do more of?" },
                  ].map(f => (
                    <div key={f.key}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: "#888", marginBottom: 8 }}>{f.label}</div>
                      <textarea value={progress[f.key]} onChange={e => setProgress(p => ({ ...p, [f.key]: e.target.value }))}
                        placeholder={f.placeholder} rows={3} style={{
                          width: "100%", border: "2px solid #f0f0f0", borderRadius: 14, padding: 14,
                          fontSize: 14, fontFamily: "inherit", resize: "none", outline: "none", boxSizing: "border-box",
                        }} />
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ background: "white", borderRadius: 24, padding: 28, boxShadow: "0 4px 20px rgba(0,0,0,0.06)" }}>
                <div style={{ fontSize: 16, fontWeight: 700, color: "#333", marginBottom: 16 }}>🎨 Projects Created ({completedProjects.length}/10)</div>
                <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                  {PROJECTS.map(p => (
                    <div key={p.id} onClick={() => setCompletedProjects(ps => ps.includes(p.id) ? ps.filter(x => x !== p.id) : [...ps, p.id])} style={{
                      background: completedProjects.includes(p.id) ? "linear-gradient(135deg, #C8F5B5, #5DBB3F)" : "#f5f5f5",
                      borderRadius: 16, padding: "10px 16px", cursor: "pointer", display: "flex", alignItems: "center", gap: 8,
                    }}>
                      <span style={{ fontSize: 18 }}>{p.icon}</span>
                      <span style={{ fontSize: 13, fontWeight: 600, color: completedProjects.includes(p.id) ? "white" : "#666" }}>{p.title}</span>
                    </div>
                  ))}
                </div>
                <div style={{ fontSize: 12, color: "#aaa", marginTop: 12 }}>Click to mark as completed!</div>
              </div>
            </div>
          )}

          {/* ── SKILL MAP TAB ── */}
          {tab === "skills" && (
            <div>
              <h1 style={{ fontSize: 32, fontWeight: 900, color: "#333", marginBottom: 8 }}>🗺️ Skill Map</h1>
              <p style={{ color: "#888", marginBottom: 32 }}>Track {childName}'s growth across all skill areas.</p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
                {SKILL_MAP.map(skill => {
                  const unlocked = skill.weeks.some(w => completedWeeks.includes(w));
                  const inProgress = skill.weeks.includes(selectedWeek);
                  return (
                    <div key={skill.id} style={{
                      background: "white", borderRadius: 24, padding: 24, boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
                      borderTop: `5px solid ${unlocked ? skill.color : "#eee"}`, opacity: unlocked || inProgress ? 1 : 0.6,
                    }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                        <div style={{ fontSize: 40 }}>{skill.icon}</div>
                        <div style={{ fontSize: 11, fontWeight: 700, borderRadius: 20, padding: "4px 10px",
                          background: unlocked ? skill.color : inProgress ? "#FFF0F7" : "#f0f0f0",
                          color: unlocked ? "#444" : inProgress ? "#FF6B9D" : "#aaa",
                        }}>
                          {unlocked ? "✓ Unlocked" : inProgress ? "In Progress" : "Coming Soon"}
                        </div>
                      </div>
                      <div style={{ fontSize: 18, fontWeight: 900, color: "#333", marginBottom: 6 }}>{skill.label}</div>
                      <div style={{ fontSize: 13, color: "#aaa" }}>Weeks: {skill.weeks.join(", ")}</div>
                      <div style={{ marginTop: 16, background: "#f0f0f0", borderRadius: 99, height: 6 }}>
                        <div style={{ background: skill.color, borderRadius: 99, height: 6, width: unlocked ? "100%" : inProgress ? "40%" : "0%", transition: "width 1s" }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── AI SAFETY TAB ── */}
          {tab === "safety" && (
            <div>
              <h1 style={{ fontSize: 32, fontWeight: 900, color: "#333", marginBottom: 8 }}>🔒 {childName}'s AI Rules</h1>
              <p style={{ color: "#888", marginBottom: 32 }}>Review these together before every AI co-creator session!</p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 20, marginBottom: 40 }}>
                {AI_RULES(childName).map((r, i) => (
                  <div key={i} style={{ background: "white", borderRadius: 24, padding: 28, boxShadow: "0 4px 20px rgba(0,0,0,0.06)", display: "flex", gap: 16, alignItems: "flex-start" }}>
                    <div style={{ fontSize: 44, flexShrink: 0 }}>{r.icon}</div>
                    <div>
                      <div style={{ fontSize: 18, fontWeight: 900, color: "#333", marginBottom: 6 }}>{r.rule}</div>
                      <div style={{ fontSize: 14, color: "#777", lineHeight: 1.6 }}>{r.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ background: "linear-gradient(135deg, #FFF5FB, #F0F8FF)", borderRadius: 28, padding: 36, border: "2px solid #FFB5C8", textAlign: "center" }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>🤖✨</div>
                <div style={{ fontSize: 24, fontWeight: 900, color: "#FF6B9D", marginBottom: 8 }}>Remember Our AI Rules!</div>
                <div style={{ fontSize: 16, color: "#777", lineHeight: 1.8, maxWidth: 480, margin: "0 auto" }}>
                  AI is an amazing creative helper — but {childName} is always the boss of the ideas!<br />
                  Mommy is always there. AI can make mistakes. We keep our information safe. 💖
                </div>
                <button onClick={() => generateAIContent(`Give ${childName} a fun, encouraging message about using AI safely and creatively. She is young and just learning. Keep it warm and exciting!`)} disabled={aiLoading} style={{ marginTop: 24, background: "linear-gradient(135deg, #FFB5C8, #FF6B9D)", border: "none", borderRadius: 16, padding: "14px 28px", color: "white", fontWeight: 700, fontSize: 16, cursor: aiLoading ? "not-allowed" : "pointer" }}>
                  {aiLoading ? "✨ Thinking..." : `🤖 Generate an AI Message for ${childName}!`}
                </button>
                {aiContent && (
                  <div style={{ marginTop: 24, background: "white", borderRadius: 20, padding: 24, textAlign: "left", fontSize: 16, lineHeight: 1.8, color: "#333" }}>
                    {aiContent}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── PROJECTS TAB ── */}
          {tab === "projects" && (
            <div>
              <h1 style={{ fontSize: 32, fontWeight: 900, color: "#333", marginBottom: 8 }}>🎨 Project Library</h1>
              <p style={{ color: "#888", marginBottom: 32 }}>10 age-appropriate projects across the full roadmap. Launch projects support Weeks 1-4.</p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 20 }}>
                {PROJECTS.map(p => {
                  const done = completedProjects.includes(p.id);
                  const available = p.status === "available" || completedWeeks.includes(p.week);
                  return (
                    <div key={p.id} style={{
                      background: "white", borderRadius: 24, padding: 28, boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
                      opacity: available ? 1 : 0.6, borderTop: `5px solid ${done ? "#C8F5B5" : available ? "#FFB5C8" : "#eee"}`,
                    }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                        <div style={{ fontSize: 44 }}>{p.icon}</div>
                        <div style={{ fontSize: 11, fontWeight: 700, borderRadius: 20, padding: "4px 12px",
                          background: done ? "#C8F5B5" : available ? "#FFF0F7" : "#f0f0f0",
                          color: done ? "#5DBB3F" : available ? "#FF6B9D" : "#aaa",
                        }}>
                          {done ? "✓ Complete" : available ? "Ready!" : `Unlocks Week ${p.week}`}
                        </div>
                      </div>
                      <div style={{ fontSize: 20, fontWeight: 900, color: "#333", marginBottom: 8 }}>{p.title}</div>
                      <div style={{ fontSize: 14, color: "#777", lineHeight: 1.6, marginBottom: 16 }}>{p.desc}</div>
                      {available && (
                        <button onClick={() => setCompletedProjects(ps => ps.includes(p.id) ? ps.filter(x => x !== p.id) : [...ps, p.id])} style={{
                          background: done ? "#f5f5f5" : "linear-gradient(135deg, #FFB5C8, #FF6B9D)",
                          border: "none", borderRadius: 12, padding: "8px 18px",
                          color: done ? "#888" : "white", fontWeight: 700, fontSize: 13, cursor: "pointer",
                        }}>
                          {done ? "↩ Mark Incomplete" : "✓ Mark Complete"}
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── PARENT HUB TAB ── */}
          {tab === "parent" && (
            <div>
              <h1 style={{ fontSize: 32, fontWeight: 900, color: "#333", marginBottom: 8 }}>👩 Parent Hub</h1>
              <p style={{ color: "#888", marginBottom: 32 }}>Everything you need to run calm, joyful, successful sessions.</p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 32 }}>
                {[
                  { icon: "📋", title: "Before Each Session", color: "#FFB5C8", tips: ["Charge the computer the night before", "Clear the table of distractions", "Have a small snack ready", "Review the session plan once", "Put on soft background music if she likes it", "Check the materials list for the week"] },
                  { icon: "🚫", title: "What to Avoid", color: "#B5D5FF", tips: ["Don't compare to other kids or classes", "Avoid rushing — let her take her time", "Don't take over the mouse/keyboard", "Avoid sessions when she's tired or hungry", "Don't make corrections feel like failures", "Never skip the celebration at the end!"] },
                  { icon: "🧘", title: "Keeping Sessions Calm", color: "#C8F5B5", tips: ["Keep sessions to 60 minutes strictly", "Use a gentle timer she can see", "Build in bathroom/water breaks", "Follow her energy — skip ahead if bored", "Go back to basics if overwhelmed", "Soft music + cozy seating works wonders"] },
                  { icon: "💙", title: "Handling Frustration", color: "#F5D5FF", tips: ["Say: 'This is hard for everyone at first!'", "Step away from the screen for 5 minutes", "Go back to something she already knows", "Try the unplugged version first", "Laugh about the bug — bugs are normal!", "Ask: 'What should we try next?'"] },
                  { icon: "🎉", title: "Celebrating Progress", color: "#FFE8B5", tips: ["Print and display her digital art", "Screenshot every finished project", "Do a special 'badge ceremony'", `Let ${childName} teach YOU something she learned`, "Create a portfolio folder on the computer", "Share progress with grandparents (with her permission!)"] },
                  { icon: "✨", title: "Suggested AI Prompts", color: "#D5F5FF", tips: ["'Help me write a story about a girl who...'", "'What are 3 fun facts about [her fav animal]?'", "'Draw me a picture with words of a magical place'", "'What would a robot eat for breakfast?'", "'Help me make a rhyme about computers'", "'What's the funniest thing you know?'"] },
                ].map((section, i) => (
                  <div key={i} style={{ background: "white", borderRadius: 24, padding: 28, boxShadow: "0 4px 20px rgba(0,0,0,0.06)", borderTop: `5px solid ${section.color}` }}>
                    <div style={{ fontSize: 28, marginBottom: 12 }}>{section.icon}</div>
                    <div style={{ fontSize: 18, fontWeight: 900, color: "#333", marginBottom: 16 }}>{section.title}</div>
                    <ul style={{ margin: 0, padding: "0 0 0 16px" }}>
                      {section.tips.map((t, ti) => (
                        <li key={ti} style={{ fontSize: 13, color: "#555", lineHeight: 1.8, marginBottom: 2 }}>{t}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
              {/* Change child name */}
              <div style={{ background: "white", borderRadius: 24, padding: 28, boxShadow: "0 4px 20px rgba(0,0,0,0.06)", marginBottom: 24 }}>
                <div style={{ fontSize: 18, fontWeight: 900, color: "#333", marginBottom: 8 }}>✏️ Update Child's Name</div>
                <div style={{ fontSize: 14, color: "#888", marginBottom: 16 }}>Currently set to: <strong>{childName}</strong>{childAge ? `, age ${childAge}` : ""}</div>
                <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                  <input
                    id="childNameInput"
                    defaultValue={childName}
                    placeholder="Enter child's name"
                    style={{ flex: 1, border: "2px solid #FFB5C8", borderRadius: 12, padding: "10px 16px", fontSize: 15, fontFamily: "inherit", outline: "none" }}
                  />
                  <select
                    id="childAgeInput"
                    defaultValue={childAge ?? ""}
                    style={{ width: 150, border: "2px solid #B5D5FF", borderRadius: 12, padding: "10px 16px", fontSize: 15, fontFamily: "inherit", outline: "none", background: "white" }}
                  >
                    <option value="">Age</option>
                    {Array.from({ length: 15 }, (_, i) => i + 3).map((ageOption) => (
                      <option key={ageOption} value={ageOption}>{ageOption}</option>
                    ))}
                  </select>
                  <button onClick={async () => {
                    const input = (document.getElementById("childNameInput") as HTMLInputElement)?.value?.trim();
                    const ageInput = Number((document.getElementById("childAgeInput") as HTMLSelectElement)?.value);
                    if (!input || !Number.isInteger(ageInput)) return;
                    await apiRequest("PATCH", "/api/user/profile", { childName: input, childAge: ageInput });
                    setChildNameLocal(input);
                    setChildAgeLocal(ageInput);
                    await queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
                  }} style={{ background: "linear-gradient(135deg, #FFB5C8, #FF6B9D)", border: "none", borderRadius: 12, padding: "10px 20px", color: "white", fontWeight: 700, fontSize: 14, cursor: "pointer" }}>
                    Save
                  </button>
                </div>
              </div>
              {/* Session Notes */}
              <div style={{ background: "white", borderRadius: 24, padding: 28, boxShadow: "0 4px 20px rgba(0,0,0,0.06)" }}>
                <div style={{ fontSize: 18, fontWeight: 900, color: "#333", marginBottom: 8 }}>📝 Session Notes</div>
                <div style={{ fontSize: 14, color: "#888", marginBottom: 20 }}>Keep notes for Week {selectedWeek}, Session {selectedSession + 1}</div>
                <textarea
                  value={notes[`w${selectedWeek}s${selectedSession}`] || ""}
                  onChange={e => setNotes(n => ({ ...n, [`w${selectedWeek}s${selectedSession}`]: e.target.value }))}
                  placeholder={`Notes for Week ${selectedWeek}, Session ${selectedSession + 1}...\n\nWhat went well?\nWhat surprised you?\nWhat should you do differently next time?`}
                  rows={8}
                  style={{ width: "100%", border: "2px solid #f0f0f0", borderRadius: 16, padding: 20, fontSize: 15, fontFamily: "inherit", resize: "vertical", outline: "none", boxSizing: "border-box", lineHeight: 1.7 }}
                />
                <div style={{ fontSize: 12, color: "#aaa", marginTop: 8 }}>Notes auto-save as you type ✓</div>
              </div>
            </div>
          )}

        </div>
      </div>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;900&display=swap');
        * { box-sizing: border-box; }
        button:hover { transform: translateY(-1px); filter: brightness(1.04); }
        @keyframes bounce { 0%,100%{transform:scale(1)} 50%{transform:scale(1.05)} }
      `}</style>
    </div>
  );
}

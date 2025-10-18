# MetaHers Mind Spa

A production-ready Progressive Web App (PWA) that blends luxury spa aesthetics with tech education. Learn AI and Web3 through beautifully crafted, guided rituals.

## ✨ Features

- **Guided Rituals**: 5 step-by-step rituals (1 free, 4 Pro) covering AI prompting, blockchain, crypto, NFTs, and metaverse
- **Interactive Progress Tracking**: Complete ritual steps with localStorage persistence
- **Luxury Shop**: 3 Ritual Bags ($199 each) + Trio Bundle ($499) with Gumroad checkout
- **Personal Journal**: Auto-save journal with streak tracking
- **MetaMuse AI**: External link to AI assistant chatbot
- **Events**: Embedded Calendly for discovery calls
- **Full PWA Support**: Installable app with manifest, service worker, and offline capabilities

## 🎨 Design System

### Brand Colors
- **Blush**: `#F6E8EA` - Soft pink backgrounds and accents
- **Champagne**: `#F3EDE2` - Neutral backgrounds
- **Mint**: `#E8F4EF` - Success states and accents
- **Onyx**: `#0D0D0F` - Text and depth
- **Gold**: `rgba(255,215,0,0.6)` - Premium badges and highlights

### Typography
- **Headings**: Playfair Display (serif, elegant)
- **Body**: Inter (sans-serif, clean)

### Components
- Glassmorphism cards with `backdrop-blur-md`
- Rounded corners (`rounded-2xl`)
- Soft shadows and subtle animations (150-250ms)
- Framer Motion for smooth transitions

## 🚀 Getting Started

### Prerequisites
- Node.js 20+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5000`

### Building for Production

```bash
npm run build
```

## 📱 PWA Installation

1. Open the app in a mobile browser (Chrome, Safari)
2. Look for the "Install MetaHers Mind Spa" prompt
3. Tap "Install App" to add to your home screen
4. Access the app like a native application

The PWA includes:
- Manifest file (`/public/manifest.json`)
- Service worker (`/public/sw.js`)
- App icons (192x192, 512x512)
- Offline caching support

## 🗂️ Project Structure

```
├── client/
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   │   ├── Navigation.tsx
│   │   │   ├── MenuCard.tsx
│   │   │   ├── RitualStepper.tsx
│   │   │   ├── JournalEditor.tsx
│   │   │   ├── InstallPrompt.tsx
│   │   │   └── ...
│   │   ├── pages/           # Route pages
│   │   │   ├── HomePage.tsx
│   │   │   ├── RitualsPage.tsx
│   │   │   ├── ShopPage.tsx
│   │   │   └── ...
│   │   ├── App.tsx          # Main app with routing
│   │   └── index.css        # Global styles
│   └── index.html           # HTML entry point
├── public/
│   ├── manifest.json        # PWA manifest
│   ├── sw.js                # Service worker
│   └── icon-*.png           # App icons
├── shared/
│   └── schema.ts            # Data models and seed data
└── server/
    └── routes.ts            # Backend routes (future)
```

## 📊 Data Management

### localStorage Keys

The app uses browser localStorage for data persistence:

- `ritual_{slug}`: Ritual progress (completed steps, last updated)
- `journal_entry`: Journal content, last saved time, streak

Example:
```json
{
  "completedSteps": [0, 1, 2],
  "lastUpdated": "2025-10-18T12:00:00.000Z"
}
```

### Ritual Data

Rituals are defined in `shared/schema.ts`. To add or modify rituals:

1. Edit the `rituals` array in `shared/schema.ts`
2. Add/update ritual objects with required fields:
   - `slug`: URL-friendly identifier
   - `title`: Display name
   - `tier`: "free" or "pro"
   - `duration_min`: Duration in minutes
   - `summary`: Short description
   - `steps`: Array of step titles

### Shop Products

Shop products are also in `shared/schema.ts`. To update:

1. Edit the `shopProducts` array
2. Update product details (name, price, scents, description)
3. Ensure product images are in `attached_assets/generated_images/`
4. Update the Gumroad link in `ShopPage.tsx` (line with `window.open`)

## 🔗 External Integrations

### Gumroad (Payments)
Update the purchase link in `client/src/pages/ShopPage.tsx`:
```typescript
const handlePurchase = () => {
  window.open("YOUR_GUMROAD_LINK_HERE", "_blank");
};
```

### Calendly (Scheduling)
Update the Calendly URL in `client/src/pages/EventsPage.tsx`:
```html
<iframe
  src="YOUR_CALENDLY_LINK_HERE"
  ...
/>
```

### MetaMuse GPT
Update the ChatGPT link in `client/src/pages/MetaMusePage.tsx`:
```typescript
const handleOpenMetaMuse = () => {
  window.open("YOUR_CHATGPT_LINK_HERE", "_blank");
};
```

## 🎯 Routes

- `/` - Homepage with hero and CTA
- `/rituals` - Grid of all rituals
- `/rituals/:slug` - Individual ritual detail with stepper
- `/shop` - Ritual Bags and bundles
- `/journal` - Personal journal with auto-save
- `/metamuse` - MetaMuse AI link
- `/events` - Calendly booking widget
- `/account` - Account overview (stub)

## 🧪 Testing

The app includes comprehensive test IDs for automated testing:

- `data-testid="button-cta-start"` - Main CTA button
- `data-testid="card-ritual-{slug}"` - Ritual cards
- `data-testid="step-{index}"` - Ritual steps
- `data-testid="button-buy-{id}"` - Purchase buttons
- And many more throughout the app

## 🌐 Deployment

### Replit
The app is configured to run on Replit. It will automatically:
- Install dependencies
- Start the development server on port 5000
- Hot reload on file changes

### Other Platforms
For deployment to Vercel, Netlify, or similar:

1. Build the app: `npm run build`
2. Deploy the `dist/` directory
3. Ensure proper routing configuration for SPA

## 📝 License

Proprietary - MetaHers Mind Spa

## 🤝 Support

For questions or support, book a discovery call through the Events page.

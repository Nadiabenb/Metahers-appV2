# iOS Testing Checklist - MetaHers Mind Spa

## Pre-Device Testing (Desktop)

### Browser Testing
- [ ] Test on Safari (macOS)
- [ ] Test on Chrome (macOS)
- [ ] Open DevTools > Device Toolbar
- [ ] Set to iPhone 14 Pro
- [ ] Enable "Throttling" to test on 4G
- [ ] Check console for errors/warnings
- [ ] Verify responsive design

### Performance Check
- [ ] Run Lighthouse audit (target 85+)
- [ ] Check Core Web Vitals (LCP < 2.5s)
- [ ] Test offline functionality
- [ ] Check network tab for large assets
- [ ] Verify all images load correctly

---

## Physical Device Testing

### Required Devices
- [ ] iPhone 14 Pro (latest)
- [ ] iPhone SE (oldest supported)
- [ ] iPad Air or iPad Pro (optional)

### Setup
```bash
1. Connect iPhone to Mac via USB
2. Unlock iPhone and trust computer
3. Open Safari on Mac
4. Safari > Develop > [Device] > [App URL]
5. App opens in Safari on iPhone
```

### Orientation Testing

#### Portrait Mode (Primary)
- [ ] App loads correctly
- [ ] All text readable
- [ ] Buttons clickable
- [ ] Images display properly
- [ ] Navigation accessible
- [ ] Footer visible
- [ ] No overlapping elements
- [ ] No horizontal scroll

#### Landscape Mode
- [ ] App displays correctly rotated
- [ ] Content reflows properly
- [ ] Safe areas respected (home bar)
- [ ] Buttons remain accessible
- [ ] No content cut off
- [ ] Text still readable

---

## Navigation & Routing Testing

### Main Navigation
- [ ] Landing page loads
- [ ] Navigation menu opens/closes
- [ ] Desktop mega menu displays
- [ ] Mobile menu displays hamburger
- [ ] All navigation links work
- [ ] Links route to correct pages
- [ ] Back button works

### Page Navigation
- [ ] Home page loads
- [ ] Privacy policy page (`/privacy`) loads
- [ ] Terms page (`/terms`) loads
- [ ] Checkout pages load
- [ ] 404 page shows for invalid routes
- [ ] Page transitions smooth
- [ ] No blank screens during loading

### Footer Links
- [ ] Footer displays on all pages
- [ ] Privacy link works
- [ ] Terms link works
- [ ] Support email link works
- [ ] Social links work (if present)
- [ ] Footer not hidden on scroll

---

## Touch & Interaction Testing

### Button Interactions
- [ ] All buttons respond to touch
- [ ] Buttons have visual feedback (highlight)
- [ ] No accidental double-touches
- [ ] Button text doesn't wrap oddly
- [ ] Hover states not visible on iOS (removed)
- [ ] Active states visible on tap

### Form Interactions
- [ ] Text inputs receive focus
- [ ] Keyboard appears on input focus
- [ ] Keyboard dismisses on submit
- [ ] Form validation works
- [ ] Error messages display
- [ ] Success messages appear
- [ ] Form data persists on navigation

### Scrolling & Gestures
- [ ] Page scrolling smooth
- [ ] Parallax disabled on mobile (no jank)
- [ ] Pull-to-refresh works (if implemented)
- [ ] Pinch-to-zoom works
- [ ] Long-press works for context menus
- [ ] Swipe gestures work (if implemented)

---

## Accessibility Testing

### VoiceOver (Screen Reader)
1. Settings > Accessibility > VoiceOver > On
2. [ ] Navigation readable with VoiceOver
3. [ ] All buttons announced
4. [ ] Form labels read correctly
5. [ ] Links identified as links
6. [ ] Headings announced
7. [ ] Images have alt text
8. [ ] Color not only indicator
9. [ ] Focus order logical
10. [ ] Rotor navigation works

### Zoom
1. Settings > Accessibility > Zoom > On
2. [ ] Zoom in to max level
3. [ ] Content still accessible
4. [ ] No overlapping text
5. [ ] All buttons accessible at zoom
6. [ ] Can navigate entire page

### Text Size
1. Settings > Accessibility > Display & Text Size
2. [ ] Increase text size
3. [ ] All text readable
4. [ ] Layout doesn't break
5. [ ] No horizontal scroll needed
6. [ ] Buttons scale appropriately

### Color & Contrast
- [ ] White text on dark background (21:1 ratio)
- [ ] Yellow on dark background (19:1 ratio)
- [ ] No red/green for color-blind
- [ ] Sufficient contrast ratio (7:1 minimum)
- [ ] Use DevTools > Accessibility > Color Contrast

### Keyboard Navigation
1. Settings > Accessibility > Keyboards > Full Keyboard Access > On
2. [ ] Can tab through all elements
3. [ ] Focus ring visible (yellow ring)
4. [ ] Focus order logical (top to bottom)
5. [ ] Can activate buttons with space/enter
6. [ ] Can submit forms with keyboard
7. [ ] No keyboard traps

---

## Visual Testing

### Layout
- [ ] Content centered properly
- [ ] No content outside viewport
- [ ] Safe areas respected (notch, home indicator)
- [ ] Padding consistent
- [ ] Margins consistent
- [ ] Grid/flex layouts correct
- [ ] No horizontal scroll

### Typography
- [ ] Fonts render correctly
- [ ] Font sizes appropriate
- [ ] Line heights readable
- [ ] Text color readable
- [ ] Links underlined or highlighted
- [ ] Headings clear
- [ ] Paragraph spacing good

### Images & Media
- [ ] All images load
- [ ] Images display at correct size
- [ ] Aspect ratios correct
- [ ] AVIF/WebP formats supported
- [ ] Hero image loads quickly
- [ ] No broken image icons
- [ ] Images responsive

### Colors
- [ ] Dark background #0D0D0F displays
- [ ] Purple accent colors correct
- [ ] Yellow CTA buttons correct
- [ ] White text renders white
- [ ] No color shifts/banding
- [ ] Colors consistent across pages

---

## Performance Testing

### Page Load Speed
```bash
# Test on 4G throttling in DevTools
- [ ] Landing page: < 3 seconds
- [ ] Dashboard: < 2 seconds
- [ ] Privacy page: < 2 seconds
- [ ] All page transitions: < 1.5 seconds
```

### Network Testing
- [ ] Test on WiFi (fast)
- [ ] Test on 4G LTE
- [ ] Test on 3G (if available)
- [ ] Offline: Error message shows
- [ ] Reconnect: App recovers gracefully

### Memory Usage
- [ ] No memory leaks on scroll
- [ ] No memory leaks on page nav
- [ ] Long scrolling: smooth (60 fps)
- [ ] No performance degradation

### Battery Impact
- [ ] App doesn't drain battery excessively
- [ ] Animations use GPU (smooth, not CPU-heavy)
- [ ] Background tasks minimal
- [ ] No constant location tracking
- [ ] Disable animations in accessibility settings

---

## API & Data Testing

### API Calls
- [ ] User data fetches correctly
- [ ] API errors handled gracefully
- [ ] Loading states show
- [ ] Retry logic works
- [ ] Cache invalidation works
- [ ] Optimistic updates work

### Error Handling
- [ ] Network error shows message
- [ ] API errors show user-friendly message
- [ ] 401 unauthorized redirects to login
- [ ] 404 shows 404 page
- [ ] 500 shows error boundary
- [ ] Timeouts handled

### Data Persistence
- [ ] Form data saves on refresh
- [ ] User preferences persist
- [ ] Auth token stored securely
- [ ] LocalStorage working
- [ ] SessionStorage working

---

## Security Testing

### HTTPS
- [ ] All requests over HTTPS
- [ ] No mixed content warnings
- [ ] Certificate valid
- [ ] No insecure content warnings

### Authentication
- [ ] Login works
- [ ] Logout works
- [ ] Session persists on refresh
- [ ] Can't access private pages without auth
- [ ] Passwords not visible in console
- [ ] API tokens not exposed

### Data Privacy
- [ ] No sensitive data in logs
- [ ] No API keys in frontend code
- [ ] No user data in URLs
- [ ] Form submissions encrypted
- [ ] Cookies secure and httpOnly

---

## iOS-Specific Features

### App Install Prompt
- [ ] "Add to Home Screen" prompt shows
- [ ] App icon displays correctly
- [ ] App launches from home screen
- [ ] App name correct

### Standalone Mode
- [ ] App runs in fullscreen mode
- [ ] Browser UI hidden
- [ ] Status bar visible
- [ ] Navigation works standalone

### Status Bar
- [ ] Status bar theme correct
- [ ] Time/battery visible
- [ ] No overlap with content
- [ ] Correct color scheme

### Safe Areas
- [ ] Content avoids notch (top 40px)
- [ ] Content avoids home indicator (bottom 40px)
- [ ] Dynamic Island not blocked
- [ ] iPhone 14/15 notch respected

---

## Dark Mode & Theme Testing

### Light Mode
- [ ] All text readable
- [ ] Sufficient contrast
- [ ] Images display correctly
- [ ] No white-on-white issues

### Dark Mode (if applicable)
- [ ] All text readable in dark mode
- [ ] Sufficient contrast maintained
- [ ] Images display correctly
- [ ] No dark-on-dark issues
- [ ] Theme toggle works (if applicable)

---

## Safari-Specific Issues

### Known Safari Issues to Check
- [ ] Fixed positioning works smoothly
- [ ] Sticky headers don't flicker
- [ ] Scrolling performance good
- [ ] CSS animations smooth
- [ ] No -webkit vendor issues
- [ ] CSS custom properties work
- [ ] SVG renders correctly

### Viewport Configuration
- [ ] Viewport meta tag correct
- [ ] Maximum scale not restricted (accessibility)
- [ ] Content doesn't zoom unexpectedly
- [ ] Pinch-zoom works

---

## User Flow Testing

### Complete User Journey
- [ ] Open app from App Store
- [ ] Landing page displays
- [ ] Can navigate sections
- [ ] Can view content
- [ ] Can sign up
- [ ] Can log in
- [ ] Can access dashboard
- [ ] Can view profile
- [ ] Can access settings
- [ ] Can log out

### Critical Flows
- [ ] Free tier onboarding complete
- [ ] Paid tier checkout works
- [ ] Email verification works
- [ ] Password reset works
- [ ] Account deletion works

---

## Compatibility Testing

### iOS Versions
- [ ] iOS 14.0 (minimum)
- [ ] iOS 15.x
- [ ] iOS 16.x
- [ ] iOS 17.x (current)
- [ ] iOS 18.x (beta)

### Device Compatibility
- [ ] iPhone 11
- [ ] iPhone 12
- [ ] iPhone 13
- [ ] iPhone 14 (various)
- [ ] iPhone 15 (various)
- [ ] iPad Air
- [ ] iPad Pro

---

## Final Pre-Submission Checklist

### Code Quality
- [ ] No console errors (npm run build)
- [ ] No console warnings in production build
- [ ] No debug statements
- [ ] No broken links
- [ ] No missing alt text
- [ ] No broken images
- [ ] Production build tested

### Accessibility
- [ ] WCAG 2.1 AA compliant
- [ ] All interactive elements labeled
- [ ] Color contrast verified
- [ ] Keyboard navigation tested
- [ ] Screen reader tested
- [ ] Motion preferences respected

### Performance
- [ ] Lighthouse score 85+
- [ ] LCP < 2.5s
- [ ] FID < 100ms
- [ ] CLS < 0.1
- [ ] No memory leaks
- [ ] No jank/stuttering

### Legal
- [ ] Privacy policy visible
- [ ] Terms of service visible
- [ ] Support contact provided
- [ ] Copyright notices present
- [ ] No misleading claims

### Metadata
- [ ] App icon ready (1024x1024)
- [ ] Screenshots ready (5 × 1170x2532)
- [ ] App name correct
- [ ] App description final
- [ ] Keywords finalized
- [ ] Category selected
- [ ] Age rating set

---

## Testing Tools

### Built-in Tools
- [ ] Safari Developer Tools
- [ ] Xcode Simulator
- [ ] Apple Configurator
- [ ] TestFlight

### Third-Party Tools
- [ ] Lighthouse CI
- [ ] BrowserStack
- [ ] Sauce Labs
- [ ] Percy (visual regression)

---

## Bug Tracking

### Found Issues Template
```
Device: iPhone 14 Pro, iOS 18
Page: Landing page
Severity: High/Medium/Low
Description: [What's broken]
Steps to Reproduce: [How to reproduce]
Expected: [What should happen]
Actual: [What happens]
Screenshot: [Attach screenshot]
```

---

## Sign-Off

When all tests pass:

```
✅ Device Testing: PASSED
✅ Accessibility: PASSED
✅ Performance: PASSED
✅ Security: PASSED
✅ Functionality: PASSED
✅ iOS Compatibility: PASSED

Ready for App Store Submission
Date: [Today's Date]
Tester: [Your Name]
```

---

**Last Updated:** November 27, 2024
**Status:** Complete iOS Testing Guide

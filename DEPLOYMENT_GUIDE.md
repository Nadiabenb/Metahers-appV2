# MetaHers Mind Spa - Deployment & Release Guide

## 🚀 Deployment Workflow

### Phase 1: Pre-Deployment (1-2 days before release)

#### 1.1 Version Bump
```bash
# Update version in package.json
npm version patch  # or minor/major as appropriate
# or manually edit package.json version field
```

#### 1.2 Build Optimization Check
```bash
npm run build
# Verify dist/ folder created successfully
# Check build size: npm run build -- --report-compressed
```

#### 1.3 Run Full Test Suite
```bash
npm test
npm run lint
npx lighthouse https://your-staging-url
```

#### 1.4 Device Testing Checklist
- [ ] Test on iPhone 14 Pro (latest)
- [ ] Test on iPhone SE (older device)
- [ ] Test on iPad Pro
- [ ] Test portrait and landscape
- [ ] Test on WiFi network
- [ ] Test on cellular network
- [ ] Test offline functionality

#### 1.5 Security Check
- [ ] No API keys in code
- [ ] No hardcoded secrets
- [ ] Environment variables properly configured
- [ ] HTTPS enabled
- [ ] CSP headers configured
- [ ] No console errors/warnings

### Phase 2: Staging Deployment (1-2 days before release)

#### 2.1 Deploy to Staging
```bash
# Set VITE_ENV=staging in environment
npm run build
# Upload dist/ to staging server
```

#### 2.2 Staging Testing (48 hours)
- [ ] All features work correctly
- [ ] Payment flow works (test mode)
- [ ] Email confirmations send
- [ ] Analytics tracking works
- [ ] Error boundaries function
- [ ] Network errors handled
- [ ] Performance targets met

#### 2.3 User Acceptance Testing (optional)
- [ ] Send staging URL to beta testers
- [ ] Collect feedback for 24 hours
- [ ] Address critical issues

### Phase 3: Production Release

#### 3.1 Final Pre-Flight Check
```bash
# Verify production build
npm run build

# Check for:
# - No console errors
# - No debug statements
# - All environment variables set
# - Analytics configured for production
# - Error tracking enabled
```

#### 3.2 Deploy to Production
```bash
# Set VITE_ENV=production
npm run build
# Upload dist/ to production server
```

#### 3.3 Post-Deployment Validation
- [ ] Access production URL
- [ ] Test critical user flows
- [ ] Check Lighthouse score
- [ ] Monitor error tracking
- [ ] Monitor analytics
- [ ] Check uptime monitoring

#### 3.4 Announce Release
- [ ] Post on social media
- [ ] Send email to users
- [ ] Update app status page
- [ ] Notify stakeholders

### Phase 4: Post-Release (48 hours monitoring)

#### 4.1 Monitor Metrics
- [ ] Check error rates (should be < 0.1%)
- [ ] Monitor performance metrics
- [ ] Track user activity
- [ ] Monitor uptime
- [ ] Check API response times

#### 4.2 Be On Standby
- [ ] Monitor support emails
- [ ] Watch error tracking dashboard
- [ ] Be ready to rollback if needed

---

## 📱 App Store Submission Workflow

### Step 1: Prepare App Store Assets (1 week before)

#### 1.1 Create App Icon
```
Required Sizes:
- 1024×1024px (App Store - square corners, no transparency)
- 180×180px (Apple Touch Icon - for home screen)
- 192×192px (PWA icon)
- 512×512px (PWA icon)

File Locations:
- public/apple-touch-icon.png
- public/icon-192.png
- public/icon-512.png
```

**Icon Requirements:**
- ✅ Square corners (iOS applies corner radius)
- ✅ No transparency
- ✅ Recognizable at small sizes
- ✅ High contrast
- ✅ Follows Apple Human Interface Guidelines

#### 1.2 Create Screenshots (3-5 per device)
```
Required Sizes:
- 1170×2532px (iPhone 14 Pro)
- 1242×2688px (iPhone 14 Plus)
- 2048×2732px (iPad Pro) - optional

Content Suggestions:
1. Hero screen - "Learn AI & Web3 at your pace"
2. Dashboard - "Personalized learning journeys"
3. Feature - "Luxury spa-inspired learning"
4. Community - "Connect with women leaders"
5. Progress - "Track your transformation"

Format: PNG or JPG
Tools: Figma, Sketch, or Screenshot from device
```

#### 1.3 Prepare Marketing Copy
```
App Name: MetaHers Mind Spa
Subtitle: AI & Web3 for Women Solopreneurs
Description: (see APP_STORE_SUBMISSION.md)
Keywords: ai, web3, education, women, learning, coaching
Category: Education (Primary), Productivity (Secondary)
```

#### 1.4 Prepare Legal Documents
- [x] Privacy Policy at /privacy
- [x] Terms of Service at /terms
- [x] Support Contact: support@metahers.ai

### Step 2: Build for App Store (3 days before)

#### 2.1 Production Build
```bash
npm run build
# Verify dist/ folder is optimized
```

#### 2.2 Create TestFlight Build
```bash
# In Xcode:
1. Product > Archive
2. Distribute App
3. Upload to TestFlight
4. Add internal testers
5. Send test link
```

#### 2.3 Internal Testing (2 days)
- [ ] Test on iPhone 14
- [ ] Test on iPhone SE
- [ ] Test on iPad
- [ ] Test all features
- [ ] Verify no crashes
- [ ] Check performance

### Step 3: App Store Connect Setup (2 days before)

#### 3.1 Sign In to App Store Connect
- https://appstoreconnect.apple.com
- Select "My Apps"
- Create new app

#### 3.2 Fill App Information
```
Bundle ID: com.metahers.mindspacea (example)
Primary Language: English
App Category: Education
Content Rating: Age 4+
```

#### 3.3 Add Pricing and Availability
```
Pricing Tier: Free
Regions: Worldwide
Release: Automatic
```

#### 3.4 Add App Icon and Screenshots
```
Upload:
- 1024x1024px icon
- 3-5 screenshots per device size
- App Preview (optional but recommended)
```

#### 3.5 Add Marketing Text
```
Promotional Text: (optional)
Description: (from APP_STORE_SUBMISSION.md)
Keywords: (from APP_STORE_SUBMISSION.md)
Support URL: https://metahers.ai
Privacy Policy URL: https://metahers.ai/privacy
```

### Step 4: Submit for Review (1 day before release)

#### 4.1 Final Checklist
- [ ] All metadata complete
- [ ] All screenshots uploaded
- [ ] Privacy policy accessible
- [ ] App icon meets requirements
- [ ] Build passes validation
- [ ] All features tested
- [ ] No critical bugs

#### 4.2 Submit Binary
```
In App Store Connect:
1. Click "Submit for Review"
2. Fill out app review information
3. Select review type (Standard or Expedited)
4. Confirm export compliance
5. Submit
```

#### 4.3 Track Review Status
- Review typically takes 24-48 hours
- Monitor App Store Connect for status
- Be ready to respond if reviewer needs info

### Step 5: Release to App Store

#### 5.1 Approval
- Receive email when approved
- Don't release immediately - choose optimal timing

#### 5.2 Release
```
In App Store Connect:
1. Click "Release This Version"
2. Select manual or automatic release
3. Confirm
4. Wait 15-30 minutes for app to appear
```

#### 5.3 Verify Availability
- Check App Store
- Search by app name
- Verify all regions available
- Test download and install

#### 5.4 Announce Release
- [ ] Post on social media
- [ ] Send newsletter
- [ ] Update website
- [ ] Celebrate! 🎉

---

## 🔄 Update Workflow

### Minor Update (Bug fixes, small features)
1. Update version: `1.0.1`
2. Make changes and test
3. Follow deployment workflow above
4. Submit to App Store
5. Release when approved (typically 24 hours)

### Major Update (New features, significant changes)
1. Update version: `1.1.0` or `2.0.0`
2. Create feature branch
3. Test thoroughly on devices
4. Create TestFlight build
5. Internal testing for 2-3 days
6. Submit to App Store
7. Review typically takes 24-48 hours

### Security Hotfix (Critical bug, security issue)
1. Update version: `1.0.2` (or emergency hotfix)
2. Make minimal necessary changes
3. Test thoroughly
4. **Request expedited review** in App Store Connect
5. Expedited review typically takes 2-4 hours

---

## 🚨 Rollback Procedure

If production deployment has critical issues:

### Immediate (First 30 minutes)
```bash
# Revert to previous stable version
git revert HEAD
npm run build
# Deploy previous version
```

### Notify Users
- [ ] Post status page update
- [ ] Send support email alert
- [ ] Update social media

### Root Cause Analysis
1. Identify what broke
2. Fix in new branch
3. Test thoroughly
4. Re-deploy

### For App Store
- [ ] Resubmit previous working version
- [ ] Request expedited review
- [ ] Include note about critical bug fix

---

## 📊 Monitoring Post-Release

### Daily (First 7 days)
- [ ] Monitor error rates
- [ ] Check performance metrics
- [ ] Review new user feedback
- [ ] Monitor server logs
- [ ] Check uptime monitoring

### Weekly (First month)
- [ ] Review analytics
- [ ] Check crash reports
- [ ] Monitor user retention
- [ ] Review support tickets
- [ ] Check app ratings

### Monthly
- [ ] Plan next release
- [ ] Review performance metrics
- [ ] Analyze user feedback
- [ ] Identify improvements

---

## 📋 Deployment Checklist Template

```
Release Version: ___________
Release Date: ___________

PRE-DEPLOYMENT
[ ] Version bumped
[ ] Build optimized
[ ] Tests pass
[ ] Lint passes
[ ] Device testing complete
[ ] Security check passed

STAGING
[ ] Deployed to staging
[ ] All features tested
[ ] Performance verified
[ ] Analytics working
[ ] 48-hour monitoring complete

PRODUCTION
[ ] Final checks passed
[ ] Production build created
[ ] Deployed successfully
[ ] All metrics normal
[ ] User flows verified

APP STORE (if applicable)
[ ] Assets prepared
[ ] Screenshots created
[ ] Metadata complete
[ ] Privacy policy linked
[ ] Build tested
[ ] Submitted for review

POST-RELEASE
[ ] Monitoring active
[ ] Support on standby
[ ] Announcement posted
[ ] Stakeholders notified
```

---

## 🔐 Environment Configuration

### Development
```
VITE_ENV=development
VITE_API_URL=http://localhost:3000
VITE_STRIPE_KEY=pk_test_...
```

### Staging
```
VITE_ENV=staging
VITE_API_URL=https://staging-api.metahers.ai
VITE_STRIPE_KEY=pk_test_...
```

### Production
```
VITE_ENV=production
VITE_API_URL=https://api.metahers.ai
VITE_STRIPE_KEY=pk_live_...
```

---

**Last Updated:** November 27, 2024
**Status:** Production-Ready for Release

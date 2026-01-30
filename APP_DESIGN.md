# MindFlow - Emotional Wellness App Design Specification

## App Overview
**Name:** MindFlow  
**Tagline:** Track your mind, flow through life  
**Purpose:** Early emotional awareness and mental health tracking for students and young professionals

---

## Design Philosophy

### Core Principles
1. **Effortless Engagement**: Complete daily check-in in under 5 seconds
2. **Non-Clinical Tone**: Friendly, supportive language - no medical jargon
3. **Visual Calm**: Soft colors, gentle animations, breathing room
4. **Privacy First**: Local-first approach, user controls their data
5. **Positive Reinforcement**: Celebrate small wins, show progress

### Brand Personality
- Warm: Like a supportive friend
- Gentle: Never pushy or judgmental
- Insightful: Makes patterns visible without being overwhelming
- Modern: Clean, fresh design that feels 2024

---

## Color Palette

### Primary Colors
```
Primary: #10B981 (Emerald-500) - Growth, balance, calm
Primary Light: #34D399 (Emerald-400)
Primary Dark: #059669 (Emerald-600)
```

### Secondary Colors
```
Accent: #A78BFA (Violet-400) - Creativity, wisdom
Accent Soft: #C4B5FD (Violet-300)
```

### Background Colors
```
Background: #FAFAF9 (Stone-50) - Warm white
Surface: #FFFFFF (White) - Cards, inputs
Surface Alt: #F5F5F4 (Stone-100) - Secondary backgrounds
```

### Mood/State Colors
```
Great: #10B981 (Green) - 5/5
Good: #34D399 (Light Green) - 4/5
Okay: #FBBF24 (Amber) - 3/5
Low: #FB923C (Orange) - 2/5
Very Low: #F87171 (Red) - 1/5

Energy High: #3B82F6 (Blue)
Energy Low: #94A3B8 (Slate)
```

### Text Colors
```
Primary Text: #1C1917 (Stone-900)
Secondary Text: #44403C (Stone-700)
Tertiary Text: #78716C (Stone-500)
```

---

## Typography

### Font Family
- **Primary**: Inter (built-in) - Clean, modern, highly readable
- **Alternative**: System UI font stack

### Type Scale
```
H1: 32px / 40px (600) - Page titles
H2: 24px / 32px (600) - Section headers
H3: 20px / 28px (500) - Card titles
Body: 16px / 24px (400) - Main text
Small: 14px / 20px (400) - Labels, secondary
Tiny: 12px / 16px (400) - Captions, hints
```

---

## App Structure

### Navigation
**Bottom Tab Bar** (4 tabs):
1. **Home** (House icon) - Daily check-in
2. **Insights** (Line chart icon) - Dashboard & analytics
3. **Calm** (Sparkles icon) - Breathing, grounding tools
4. **Profile** (User icon) - Settings, data, preferences

### Screen Hierarchy
```
Onboarding (First time only)
├── Welcome
├── Setup Profile
└── Complete First Check-in

Main App (Tab-based)
├── Home Tab
│   ├── Daily Check-in (Default)
│   ├── Check-in History
│   └── Quick Stats
│
├── Insights Tab
│   ├── Dashboard Overview
│   ├── Mood Trends (7-day chart)
│   ├── Sleep Correlations
│   ├── Energy Patterns
│   └── Burnout Risk Indicator
│
├── Calm Tab
│   ├── Breathing Exercise (4-7-8)
│   ├── 5-4-3-2-1 Grounding
│   ├── Quick Journal
│   └── Affirmation Cards
│
└── Profile Tab
    ├── User Profile
    ├── Data Export
    ├── Reminders
    └── Settings
```

---

## Screen-by-Screen Breakdown

### 1. Onboarding Screens

#### Welcome Screen
- **Purpose**: Set expectations, build trust
- **Elements**:
  - App logo + tagline
  - 3 value propositions (icons + short text)
  - "Get Started" button
  - "Already have an account? Sign in" link
- **Design**: Centered, breathing space, gentle gradient background

#### Setup Profile
- **Purpose**: Collect minimal user info
- **Fields**:
  - Name (first name only)
  - Email
  - Password
  - Optional: Primary stressor (dropdown)
- **Design**: Clean form, step indicator at top

#### First Check-in
- **Purpose**: Guide through first entry
- **Elements**: Same as daily check-in with tooltips
- **Design**: Highlighted elements, hints explaining why

---

### 2. Home Tab - Daily Check-in

#### Daily Check-in (Main Screen)
**Purpose**: Capture emotional state in < 5 seconds

**Layout** (Vertical flow):
1. **Header** (Top)
   - "Good morning, [Name]" greeting
   - Date indicator
   - Streak counter (if > 0)
   - Example: "🔥 7 day streak"

2. **Mood Selector** (Primary focus)
   - 5 emoji options in horizontal row
   - 😊 Great (5), 🙂 Good (4), 😐 Okay (3), 😔 Low (2), 😢 Very Low (1)
   - Selected emoji scales up (scale-110)
   - Subtle bounce animation on selection

3. **Energy Slider** (Below mood)
   - Slider from "Drained" to "Energized"
   - Current value displayed
   - Default: Middle position

4. **Sleep Input** (Accordion/toggle)
   - Hours slept (number input, default 7)
   - Sleep quality (3-emoji quick select)
   - Can be expanded or kept minimal

5. **Social Battery** (Quick toggle)
   - Social energy level: Full, Half, Empty
   - Three battery icons to tap

6. **Micro Journal** (Optional, expandable)
   - "What's on your mind?" (max 140 chars)
   - Character count
   - Always optional, can skip

7. **Submit Button** (Bottom)
   - Large, prominent primary button
   - Text: "Log Today's Check-in" or "Save"
   - Success animation: Checkmark + gentle particles

**Post-Submit View**:
- "Logged! See you tomorrow" message
- Quick insight: "You've been improving this week!"
- Calm tools shortcut button

---

### 3. Insights Tab - Dashboard

#### Dashboard Overview
**Purpose**: Visualize patterns, provide actionable insights

**Layout** (Card-based):
1. **Header**
   - "Your Insights"
   - Time period selector (7D | 30D | 90D)

2. **Mood Trend Chart** (Top card, prominent)
   - Line chart showing mood over time
   - Smooth curves, not jagged
   - Highlighted data points
   - Color gradient under line
   - Insight overlay: "Trending up 📈"

3. **Quick Stats Row** (3 cards below chart)
   - Avg mood (emoji + number)
   - Avg sleep (hours)
   - Energy level (bar)

4. **Correlations Section**
   - "What affects your mood?"
   - Small scatter/relationship cards:
     - Sleep × Mood correlation
     - Social battery × Energy correlation
     - Journal sentiment × Mood
   - Insight text: "More sleep = better mood days"

5. **Burnout Risk Indicator** (Attention card)
   - Progress bar or gauge
   - Color-coded: Green/Yellow/Red
   - Actionable message:
     - Low: "You're doing great!"
     - Medium: "Take some time for yourself"
     - High: "Consider a rest day"

6. **Weekly Summary** (Bottom card)
   - "This Week's Highlights"
   - Best day, patterns noticed
   - Gentle recommendations

---

### 4. Calm Tab - Tools

#### Calm Tools Landing
**Purpose**: Quick access to immediate relief tools

**Layout** (Grid + list):
1. **Header**
   - "Find Your Calm"
   - Optional: "Feeling overwhelmed? Try:"

2. **Featured Tool** (Top card)
   - Breathing Exercise (default)
   - Large, inviting
   - "4-7-8 Breathing" subtitle
   - "Start" button

3. **Tool Grid** (2 columns)
   - Breathing (already shown)
   - 5-4-3-2-1 Grounding
   - Quick Journal
   - Affirmation Cards

4. **Recent History** (Bottom section)
   - Last 3 tools used
   - Quick access

#### Breathing Exercise Screen
**Purpose**: Guided breathing practice (4-7-8 technique)

**Layout** (Centered, immersive):
1. **Close/Back** button (top left)
2. **Large Circle Animation** (center, taking 60% of screen)
   - Expands for inhale (4s)
   - Holds for exhale prep (7s)
   - Contracts for exhale (8s)
   - Smooth transitions
   - Text overlay showing current phase

3. **Instruction Text** (below circle)
   - "Inhale for 4... Hold for 7... Exhale for 8"
   - Updates dynamically

4. **Session Controls** (bottom)
   - Pause/Resume button
   - Duration selector (1 min, 3 min, 5 min)
   - Progress indicator

5. **Completion Screen**
   - "Great job! You completed X minutes"
   - "Rate how you feel" (quick emoji)
   - "Done" or "Another round" buttons

---

### 5. Profile Tab

#### Profile Screen
**Purpose**: User settings and data management

**Layout** (Sections):
1. **Header**
   - Avatar (circle, initials or emoji)
   - Name
   - Email
   - "Edit Profile" button

2. **Stats Card** (Top)
   - Total check-ins
   - Current streak
   - Longest streak
   - Days since started

3. **Settings Section**
   - Notifications toggle
   - Reminder time picker
   - Data export
   - Privacy settings

4. **Account Section**
   - Change password
   - Sign out
   - Delete account (destructive action)

---

## User Flow Diagrams

### Daily Check-in Flow
```
Open App
  ↓
Home Tab loads
  ↓
Select Mood (emoji tap)
  ↓
Adjust Energy (slider)
  ↓
(Skip or) Enter Sleep
  ↓
(Skip or) Select Social Battery
  ↓
(Skip or) Add Journal Note
  ↓
Tap Submit
  ↓
Success Animation
  ↓
(Optional) Navigate to Insights or Calm
```

### View Insights Flow
```
Tap Insights Tab
  ↓
Dashboard loads (default 7-day view)
  ↓
See Mood Trend Chart
  ↓
Tap time period (optional: 30D/90D)
  ↓
Scroll to Correlations
  ↓
Read insights
  ↓
(Optional) Tap tool recommendation
```

### Breathing Exercise Flow
```
Tap Calm Tab
  ↓
Select Breathing Exercise
  ↓
Choose Duration (default 3 min)
  ↓
Tap "Start"
  ↓
Follow Animated Circle
  ↓
Complete or Stop Early
  ↓
Rate Feeling
  ↓
Return to Calm Tab
```

---

## UI Layout Recommendations

### Design Tokens
```css
/* Spacing */
- xs: 4px (tight elements)
- sm: 8px (icon labels, tight lists)
- md: 16px (card padding, standard gaps)
- lg: 24px (section spacing)
- xl: 32px (page margins, major sections)
- 2xl: 48px (hero spacing)

/* Border Radius */
- sm: 8px (buttons, small inputs)
- md: 16px (cards)
- lg: 24px (large cards, hero elements)
- full: 50% (circular elements)

/* Shadows */
- sm: Subtle elevation (cards, buttons)
- md: Floating elements
- lg: Modals, overlays
```

### Component Patterns

#### Cards
- Consistent padding: p-4 or p-6
- Background: White or Surface Alt
- Border radius: rounded-2xl
- Subtle shadow: shadow-sm
- Hover effect: Slight scale or shadow increase

#### Buttons
- Primary: Large, prominent, Emerald-500
- Secondary: Outlined or ghost
- Min touch target: 44px height
- Disabled state: Opacity 0.5, no hover effects

#### Inputs
- Border: Subtle gray on focus
- Focus ring: Emerald-400, 2px
- Error state: Red border + message below
- Clear labels above inputs

---

## Feature Prioritization (Hackathon MVP)

### Phase 1: Core (Must Have)
1. ✅ Daily check-in (mood + energy + sleep)
2. ✅ User authentication (register, login)
3. ✅ Basic dashboard with mood trend chart
4. ✅ Breathing exercise tool
5. ✅ Data storage (Prisma + SQLite)

### Phase 2: Enhancement (Should Have)
6. ✅ Social battery tracker
7. ✅ Micro journaling
8. ✅ Correlation insights (sleep × mood)
9. ✅ Burnout risk indicator
10. ✅ Profile page with stats

### Phase 3: Polish (Nice to Have)
11. ⬜ Streak counter with animations
12. ⬜ Weekly summaries
13. ⬜ Push notifications/Reminders
14. ⬜ Data export
15. ⬜ Affirmation cards
16. ⬜ Advanced pattern detection (ML)

---

## AI-Based Pattern Detection (Rule-Based)

### Simple Logic (MVP)
```javascript
// Burnout Risk Indicator
if (lowMoodDays >= 3 in last 7) {
  risk = "HIGH"
  recommendation = "Consider taking a rest day"
} else if (lowMoodDays >= 2 in last 7 && avgSleep < 6) {
  risk = "MEDIUM"
  recommendation = "Prioritize sleep this week"
} else {
  risk = "LOW"
  recommendation = "You're doing great!"
}

// Sleep × Mood Correlation
if (avgSleep >= 7) {
  if (avgMood >= 4) {
    insight = "Your mood improves with good sleep!"
  }
} else {
  if (avgMood <= 3) {
    insight = "Try getting more sleep to boost your mood"
  }
}

// Social Battery × Energy
if (socialBattery === "Empty" && energyLevel <= 2) {
  suggestion = "You might need some alone time to recharge"
}
```

### Future Enhancement (ML)
- Trend prediction (what tomorrow might look like)
- Personalized recommendations
- Anomaly detection (sudden drops)
- Sentiment analysis from journal entries

---

## UX Recommendations

### Friction Reduction
1. **Smart Defaults**: Pre-fill common values (7 hours sleep, middle energy)
2. **One-Tap Actions**: Mood selection requires just one tap
3. **Optional Fields**: Everything beyond mood should be skippable
4. **Keyboard Navigation**: Support Tab/Enter for quick entry

### Feedback & Affirmation
1. **Positive Messaging**: Focus on what's going well
2. **Progress Visualization**: Show streaks, improvements
3. **Celebration Animations**: Small rewards for milestones
4. **Gentle Reminders**: Not pushy notifications, supportive nudges

### Privacy & Trust
1. **Clear Data Use**: Explain what data is collected and why
2. **User Control**: Easy data export/deletion
3. **No Judgment**: Never use "bad" or "failure" language
4. **Encouraging Tone**: Always supportive, never critical

### Accessibility
1. **Screen Reader Support**: Proper ARIA labels
2. **Color Blind Safe**: Don't rely on color alone
3. **Touch Targets**: Minimum 44px for all interactive elements
4. **High Contrast**: WCAG AA compliant text contrast

---

## Implementation Notes

### Performance
- Lazy load charts (only render when Insights tab active)
- Optimize animations (use CSS transforms, not layout thrashing)
- Cache insights (recalculate only when new data)

### Offline Support
- Store check-ins locally (localStorage or IndexedDB)
- Sync when connection restored
- Show last-known insights if offline

### Responsive Design
- Mobile-first approach (primary target)
- Tablet optimization (larger touch targets, better layout)
- Desktop support (though mobile is main focus)

---

## Success Metrics (Hackathon)
1. **Engagement**: Users complete check-in 5+ days/week
2. **Time**: Check-in < 5 seconds (target)
3. **Satisfaction**: 4+ stars on post-use rating
4. **Retention**: 50% of users return next day
5. **Insight Value**: 70% find insights helpful

---

## Technical Stack
- **Frontend**: Next.js 16, React, Tailwind CSS 4, shadcn/ui
- **Charts**: Recharts (lightweight, customizable)
- **State**: Zustand (client state)
- **Database**: Prisma + SQLite
- **Auth**: JWT with bcrypt password hashing
- **Icons**: Lucide React
- **Animations**: Framer Motion (subtle transitions)

---

This design is ready to implement in 24-48 hours for a hackathon while delivering a polished, user-friendly experience.

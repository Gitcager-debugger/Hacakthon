# AI Emotional Dip Predictor - Feature Documentation

## Overview

The AI Emotional Dip Predictor is an intelligent feature that analyzes a user's mood, sleep, and energy patterns to predict potential emotional dips and provide personalized, supportive insights.

## How It Works

### 1. Data Collection
The system analyzes the user's check-in data from the past 30 days, including:
- Daily mood ratings (1-5 scale)
- Sleep hours and quality
- Energy levels (1-5 scale)
- Social battery levels
- Journal notes (optional)

### 2. Pattern Analysis
The system calculates various metrics:
- **Average Mood**: Overall mood trend over time
- **Mood Trend**: Improving, declining, or stable
- **Sleep Patterns**: Average sleep hours and quality
- **Energy Levels**: Average energy ratings
- **Low Mood Ratio**: Percentage of low mood days
- **Day-of-Week Patterns**: Identifies worst/most challenging days

### 3. AI-Powered Insights
Using the `z-ai-web-dev-sdk`'s LLM service, the system:
- Analyzes patterns in the data
- Generates empathetic, supportive insights
- Provides personalized recommendations
- Avoids medical diagnoses and clinical language

### 4. Risk Assessment
Based on multiple weighted factors:
- Low mood ratio (40% weight)
- Mood trend decline (20% weight)
- Recent mood vs. average (15% weight)
- Sleep deprivation (15% weight)
- Low energy levels (10% weight)

Risk levels:
- **High Risk** (≥50 points): Pay extra attention to wellbeing
- **Medium Risk** (25-49 points): Consider taking time for yourself
- **Low Risk** (<25 points): You're doing great!

### 5. Prediction
When risk is elevated, the system:
- Predicts the next potentially challenging day (worst day of week)
- Provides a target date for awareness
- Suggests proactive measures

## API Endpoint

### GET `/api/predictions/emotional-dip`

**Authentication**: Requires valid JWT token

**Response**:
```json
{
  "riskLevel": "low" | "medium" | "high",
  "confidence": 0.75,
  "predictedDipDate": "2024-02-15" | null,
  "factors": [
    {
      "factor": "Mood Patterns",
      "impact": "negative" | "positive" | "neutral",
      "description": "30% of days logged were low mood"
    }
  ],
  "recommendations": [
    "Maintain a consistent sleep schedule",
    "Continue daily check-ins for better predictions",
    "Consider trying calm tools when feeling low"
  ],
  "aiInsight": "Based on your patterns, you're showing great improvement. Keep up the positive momentum!"
}
```

## UI Component

### `EmotionalDipPredictor`

Features:
- **Loading state**: Skeleton UI while fetching predictions
- **Error handling**: Graceful fallback with retry option
- **Risk visualization**: Color-coded risk indicators
  - Green: Low risk
  - Amber: Medium risk
  - Red: High risk
- **Contributing factors**: Shows positive and negative factors affecting mood
- **AI insights**: Personalized, empathetic insights from LLM
- **Quick actions**: Direct links to calm tools and check-in
- **Refresh capability**: Users can update predictions manually

### Location in App
- Integrated into the **Insights Dashboard** (`/insights`)
- Positioned prominently after quick stats for visibility
- Stands out with purple/gradient AI branding

## Fallback Mechanism

If the AI service fails, the system automatically falls back to:
1. Rule-based prediction using the same analysis
2. Generic recommendations
3. A message indicating AI insights will improve with more data

## Privacy & Safety

### Design Principles
1. **No Medical Diagnoses**: AI is explicitly instructed to avoid medical language
2. **Supportive Tone**: All insights are empathetic and encouraging
3. **User Control**: Users can refresh predictions or dismiss
4. **Data Privacy**: Only aggregated, anonymized patterns are shared with AI

### Data Shared with AI
The AI receives only:
- Statistical summaries (averages, percentages)
- Pattern information (trends, day-of-week patterns)
- No specific journal content or personally identifiable details

## Improvement Over Time

The prediction accuracy improves as users:
- Log more check-ins (minimum 5 needed for initial prediction)
- Maintain consistent tracking
- Track multiple metrics (mood, sleep, energy)
- Use the app over longer periods

Confidence score formula:
```
confidence = min(0.3 + (checkInCount * 0.05), 0.95)
```

## Example Use Cases

### Case 1: High Risk Prediction
**Scenario**: User shows declining mood, low sleep, 40% low mood days
**Response**:
- Risk Level: High (85% confidence)
- Predicted Dip: Next Monday
- Factors: Declining mood trend, insufficient sleep
- Recommendations: Prioritize sleep, try breathing exercises

### Case 2: Positive Trend
**Scenario**: User consistently improving, good sleep habits
**Response**:
- Risk Level: Low (90% confidence)
- Predicted Dip: None
- Factors: Improving mood, adequate sleep
- Recommendations: Continue current routine

### Case 3: New User
**Scenario**: User has logged 3 check-ins
**Response**:
- Risk Level: Low (20% confidence)
- Predicted Dip: None
- Factors: Data Availability (neutral)
- Recommendations: Log more check-ins for accurate predictions

## Technical Implementation

### Key Files
- **API Route**: `src/app/api/predictions/emotional-dip/route.ts`
- **UI Component**: `src/components/emotional-dip-predictor.tsx`
- **Integration**: `src/app/insights/page.tsx`

### Dependencies
- `z-ai-web-dev-sdk`: AI insights generation
- `prisma`: Data persistence
- `lucide-react`: Icons

### Future Enhancements (Potential)
- Machine learning model for improved predictions
- Weekly email notifications with predictions
- Historical prediction accuracy tracking
- Integration with wearable device data
- Pattern-specific interventions

## User Benefits

1. **Proactive Care**: Identify potential dips before they become severe
2. **Personalized Insights**: Tailored recommendations based on individual patterns
3. **Empathetic Support**: Non-clinical, encouraging tone
4. **Actionable Advice**: Clear, specific recommendations
5. **Awareness**: Understanding of personal mood cycles and triggers

## Notes for Hackathon Judges

This feature demonstrates:
- ✅ AI integration (LLM for insights)
- ✅ Real-time data analysis
- ✅ Complex state management
- ✅ Graceful error handling and fallbacks
- ✅ Beautiful, intuitive UI
- ✅ Accessibility (color coding, clear labels)
- ✅ Privacy-first design
- ✅ Scalable architecture

The predictor provides tangible value while maintaining a supportive, non-medical approach perfect for students and young professionals.

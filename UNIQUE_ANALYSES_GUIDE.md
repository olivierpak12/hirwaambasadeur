# Unique Analysis Generation - Each Analysis is Different!

## Overview

Every generated economic analysis is now **unique and varied**. The system automatically randomizes:

✅ **AI Provider** - Rotates between Gemini, OpenAI, and Anthropic  
✅ **Analysis Framework** - 10 different analytical approaches  
✅ **Analytical Perspective** - 10 different viewpoints  
✅ **Content Emphasis** - Different sections and angles  
✅ **Writing Style** - Varied tone and approach  

Result: Each analysis of the same topic will be different!

---

## Analysis Frameworks

Each analysis uses a randomized **framework** that shapes the entire approach:

### 10 Available Frameworks:

1. **Institutional Research**
   - Deep rigorous analysis suitable for asset managers
   - Focus: Investment research standards

2. **Emerging Trends**
   - Forward-looking perspective on new developments
   - Focus: Future implications and opportunities

3. **Comparative Analysis**
   - Benchmark vs competitors and peers
   - Focus: Competitive positioning

4. **Risk-Centric**
   - Emphasis on downside scenarios
   - Focus: Risk mitigation strategies

5. **Opportunity Scan**
   - Focus on upside potential
   - Focus: Strategic positioning and growth

6. **Supply Chain Impact**
   - Logistics and operational lens
   - Focus: Execution and supply chain

7. **Stakeholder Rights**
   - Diverse stakeholder group impacts
   - Focus: Equity and stakeholder value

8. **Regulatory Framework**
   - Compliance and policy view
   - Focus: Regulatory environment

9. **Technology Disruption**
   - Innovation and tech angle
   - Focus: Technological transformation

10. **Macro-Economic**
    - Broader economic context
    - Focus: Macro cycles and environment

---

## Analytical Perspectives

Combined with the framework, each analysis also gets a randomized **perspective**:

### 10 Available Perspectives:

1. **Quantitative**
   - Heavy on numbers, data, statistics
   - Style: Data-driven, precise

2. **Qualitative**
   - Heavy on narrative, insights
   - Style: Story-driven, insightful

3. **Bull Case**
   - Optimistic tone, positive catalysts
   - Style: Growth-focused, constructive

4. **Bear Case**
   - Cautious tone, downside risks
   - Style: Risk-aware, conservative

5. **Strategic**
   - Business strategy focus
   - Style: Strategic, competitive

6. **Financial**
   - Investment returns focus
   - Style: Financial metrics, valuations

7. **Operational**
   - Execution and efficiency focus
   - Style: Practical, implementation-focused

8. **Geopolitical**
   - International relations angle
   - Style: Global context, policy-aware

9. **Sustainability**
   - ESG and long-term impact focus
   - Style: Environmental, ethical focus

10. **Contrarian**
    - Against consensus views
    - Style: Non-consensus, challenging

---

## How It Works

### Example 1: Same Topic, Different Analyses

**Topic: AI Investment Market**

**Analysis #1:**
- Provider: Gemini
- Framework: Emerging Trends
- Perspective: Bull Case
- Output: Optimistic, forward-looking, trend-focused analysis

**Analysis #2:**
- Provider: OpenAI
- Framework: Risk-Centric
- Perspective: Bear Case
- Output: Cautious, downside-focused, risk analysis

**Analysis #3:**
- Provider: Anthropic
- Framework: Regulatory Framework
- Perspective: Geopolitical
- Output: Policy-focused, international relations view

→ All three are unique, professional analyses of the same topic!

---

## API Usage

### Generate Unique Analysis

Each call generates a completely different analysis:

```bash
# First call
curl -X POST "https://yoursite.com/api/generate-economic-analysis" \
  -H "Authorization: Bearer YOUR_KEY" \
  -d '{"topic": "AI Markets"}'

# Returns: Analysis via Provider A, Framework B, Perspective C

# Second call - same topic
curl -X POST "https://yoursite.com/api/generate-economic-analysis" \
  -H "Authorization: Bearer YOUR_KEY" \
  -d '{"topic": "AI Markets"}'

# Returns: DIFFERENT Analysis via Provider X, Framework Y, Perspective Z
```

### Generate Trending Analyses

With trending analysis, each trending topic gets a unique analysis:

```bash
curl -X POST \
  "https://yoursite.com/api/generate-trending-analyses?limit=5" \
  -H "Authorization: Bearer YOUR_TRENDING_ANALYSIS_API_KEY"

# Results: 5 unique analyses of 5 trending topics
# Each using randomized providers, frameworks, and perspectives
```

---

## What Gets Tagged

Each analysis automatically includes tags reflecting its uniqueness:

```json
{
  "tags": [
    "ai markets",
    "emerging trends",      // Framework (lowercase)
    "bull case",            // Perspective (lowercase)
    "trade analysis",       // Topic tags
    "professional",
    "market intelligence"
  ]
}
```

This makes it easy to filter and find specific types of analyses later!

---

## Multiple Analyses of Same Topic

### Strategy: Generate Multiple Analyses Per Topic

```bash
# Generate 3 different analyses of the same topic
# Each will be unique due to randomization

for i in {1..3}; do
  curl -X POST "https://yoursite.com/api/generate-economic-analysis" \
    -H "Authorization: Bearer YOUR_KEY" \
    -d '{"topic": "Global Supply Chains"}'
done

# Result: 3 different professional perspectives on the same topic
```

### Display Multiple Perspectives

```tsx
// Show "Views of Global Supply Chains" from different angles
<section className="multi-perspective">
  <h2>📊 Global Supply Chains: Multiple Perspectives</h2>
  
  <article className="institutional-research">
    <h3>Institutional Research View</h3>
    <p>{institutionalAnalysis.summary}</p>
  </article>
  
  <article className="risk-centric">
    <h3>Risk Assessment View</h3>
    <p>{riskAnalysis.summary}</p>
  </article>
  
  <article className="opportunity-scan">
    <h3>Opportunity View</h3>
    <p>{opportunityAnalysis.summary}</p>
  </article>
</section>
```

---

## Configuration

### Force Specific Provider

Randomization is automatic, but you can force a provider if needed:

```env
# In .env.local
AI_PROVIDER=gemini    # Force Gemini (randomization still applies to framework/perspective)
AI_PROVIDER=openai    # Force OpenAI
AI_PROVIDER=anthropic # Force Anthropic
```

### Override Randomization

In special cases, you can manually specify framework/perspective:

```typescript
// In Convex function (advanced)
const analysis = await generateWithGemini(
  'Your Topic',
  'Regulatory Framework',  // Force specific framework
  'Geopolitical'          // Force specific perspective
);
```

---

## Logging Output

When an analysis is generated, you'll see logs like:

```
📊 Generating unique analysis - Provider: openai, Framework: Emerging Trends, Perspective: Quantitative
```

This shows you exactly which variation was used for that analysis!

---

## Benefits

### For Content Creators:
✅ Generate multiple analyses of same topic automatically  
✅ Create comprehensive coverage from different angles  
✅ Avoid repetitive content  

### For Readers:
✅ Get multiple professional perspectives  
✅ Bull case AND bear case views available  
✅ Strategic AND operational insights both available  

### For SEO:
✅ More unique content variations  
✅ Different keyword angles covered  
✅ Comprehensive topic coverage  

### For Analysis Quality:
✅ Each provider's strengths used equally  
✅ Multiple frameworks prevent bias  
✅ Varied perspectives improve analysis depth  

---

## Example: Economic News Coverage

### Traditional Approach:
- 1 analysis per topic
- Same framework every time
- Coverage is limited

### New Approach:
```
Topic: "AI and Employment"

Analysis 1: Institutional Research + Quantitative Perspective
→ Deep statistical analysis of job displacement

Analysis 2: Emerging Trends + Opportunity Scan Perspective  
→ New jobs and skills development opportunities

Analysis 3: Risk-Centric + Bear Case Perspective
→ Risks to specific job sectors and regions

Analysis 4: Regulatory Framework + Geopolitical Perspective
→ Policy implications and international implications
```

→ Comprehensive 360° coverage of single topic!

---

## Next Steps

1. ✅ Generate analyses normally (randomization is automatic)
2. ✅ Check logs to see which variation was used
3. ✅ Generate multiple analyses of same topic for full coverage
4. ✅ Tag and organize by framework/perspective
5. ✅ Display different perspectives on homepage
6. ✅ Use for content marketing with varied angles

---

## Monitoring Variation

### Check Analysis Tags

```typescript
// Verify variation is working
const analysis = await convex.query(api.aiEconomicAnalyses.getAnalysisById, {
  id: analysisId
});

console.log('Framework Used:', analysis.tags.find(t => /* check frameworks */));
console.log('Perspective Used:', analysis.tags.find(t => /* check perspectives */));
console.log('Provider Used:', analysis.model);
```

### View Variation Distribution

```typescript
// See which frameworks/perspectives are being used
const allAnalyses = await convex.query(api.aiEconomicAnalyses.getLatestAnalyses);

const frameworks = new Set(allAnalyses.flatMap(a => a.tags.filter(/* framework checks */)));
const perspectives = new Set(allAnalyses.flatMap(a => a.tags.filter(/* perspective checks */)));
const providers = new Set(allAnalyses.map(a => a.model));

console.log('Frameworks used:', frameworks);
console.log('Perspectives used:', perspectives);
console.log('Providers used:', providers);
```

---

## Support

For issues or questions:
- Check logs for variation details: `📊 Generating unique analysis...`
- Verify tags include framework/perspective
- Confirm multiple analyses show different content
- Check API responses for variation metadata

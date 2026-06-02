# Ratefluencer AI Copilot

AI-powered platform that helps brands discover high-performing influencers and helps creators generate viral content.

## Features

| # | Feature |
|---|---------|
| 1 | **Influencer Intelligence Engine** — ML scoring: engagement, authenticity, growth, brand match |
| 2 | **Fake Follower Detection** — Bot detection, engagement anomalies, risk indicators |
| 3 | **Brand Matching System** — Semantic similarity with Nike, OpenAI, Adobe, etc. |
| 4 | **Trend Discovery Engine** — Trending topics in AI, Tech, Business, Startups, Finance |
| 5 | **Viral Reel Creator** — Hook + 30-60s script + CTA + talking points |
| 6 | **LinkedIn Content Generator** — Professional posts with hooks, CTAs, hashtags |
| 7 | **Instagram Content Generator** — Captions, hashtags, engagement CTAs |
| 8 | **Virality Prediction Engine** — Expected reach, likes, shares, saves + virality score |
| 9 | **AI Agent Workflow** — Visual end-to-end pipeline animation |
| 10 | **Admin Dashboard** — Platform analytics, influencer table, charts |

## Tech Stack

- **Frontend**: Next.js 15 · React 19 · Tailwind CSS · Framer Motion · Recharts
- **Backend**: FastAPI · SQLAlchemy · SQLite (dev) / PostgreSQL (prod)
- **AI**: Cerebras API — `llama-3.3-70b` (1000+ tokens/sec, OpenAI-compatible)
- **ML**: Scikit-learn inspired scoring · Cosine similarity brand matching

## Quick Start

### Backend

```bash
cd backend
pip install -r requirements.txt

# Add your Cerebras API key
cp .env.example .env
# Edit .env → CEREBRAS_API_KEY=csk-...

uvicorn main:app --reload --port 8001
```

API docs available at: http://localhost:8001/docs

### Frontend

```bash
cd frontend
npm install
npm run dev -- --port 3001
```

App available at: http://localhost:3001

## Architecture

```
frontend/                     # Next.js 15 App Router
  src/
    app/
      page.tsx                # Dashboard
      influencer/             # Feature 1: Influencer Analysis
      fake-detection/         # Feature 2: Fake Detection
      brand-match/            # Feature 3: Brand Matching
      trends/                 # Feature 4: Trends
      reel-creator/           # Feature 5: Viral Reel Creator
      linkedin/               # Feature 6: LinkedIn Generator
      instagram/              # Feature 7: Instagram Generator
      virality/               # Feature 8: Virality Prediction
      workflow/               # Feature 9: AI Workflow
      admin/                  # Feature 10: Admin Dashboard
    components/
      layout/sidebar.tsx      # Collapsible sidebar nav
      layout/theme-provider   # Dark/light mode
    lib/api.ts                # API client

backend/
  main.py                     # FastAPI app + all routes
  models.py                   # SQLAlchemy ORM models
  schemas.py                  # Pydantic request/response models
  database.py                 # DB connection (SQLite/PostgreSQL)
  services/
    scoring.py                # ML-inspired scoring engine
    fake_detection.py         # Bot/fake follower detection
    brand_matching.py         # Cosine similarity brand matching
    trend_engine.py           # Curated trend data
    content_generator.py      # Template-based content generation
    virality_predictor.py     # Virality estimation model
```

## Production (PostgreSQL)

Update `backend/database.py`:

```python
SQLALCHEMY_DATABASE_URL = "postgresql://user:password@localhost/ratefluencer"
```

And remove the `connect_args` parameter.

## Future Improvements

We are constantly working to enhance Ratefluencer AI Copilot. Here are some areas we plan to explore:

*   **Advanced AI Models**: Integrating more sophisticated AI models for deeper insights and content generation.
*   **More Social Media Platforms**: Expanding support to additional social media platforms beyond Instagram and LinkedIn.
*   **User Customization**: Allowing users to customize AI models and content generation parameters.
*   **Real-time Analytics**: Providing real-time data and analytics for influencer performance and content virality.

## Made with ❤️

This project was crafted with passion and dedication.

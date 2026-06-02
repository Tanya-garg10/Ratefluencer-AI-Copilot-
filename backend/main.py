"""
Ratefluencer AI Copilot — FastAPI main application.
"""

from __future__ import annotations

import json
from typing import Any, Dict, List, Optional

from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from database import Base, engine, get_db
from models import Influencer, GeneratedContent, TrendEntry
from schemas import (
    AdminDashboard,
    BrandMatchRequest,
    ContentRequest,
    ContentResponse,
    InfluencerAnalysis,
    InfluencerInput,
    InfluencerOut,
    RiskIndicator,
    FakeDetectionResult,
    BrandMatch,
    TrendItem,
    TrendsGrouped,
    ViralityRequest,
    ViralityResponse,
)
from services.scoring import (
    calculate_engagement_rate,
    calculate_authenticity_score,
    calculate_growth_potential,
    calculate_brand_match_score,
    calculate_ratefluencer_score,
)
from services.fake_detection import detect_fake_followers
from services.brand_matching import match_brands, get_all_brand_profiles
from services.trend_engine import get_all_trends, get_trends_by_category, get_top_trends
from services.content_generator import (
    generate_reel_script,
    generate_linkedin_post,
    generate_instagram_content,
)
from services.virality_predictor import predict_virality
from services.ai_client import is_configured as ai_configured

# ── Create DB tables ──────────────────────────────────────────────────
Base.metadata.create_all(bind=engine)

# ── App init ──────────────────────────────────────────────────────────
app = FastAPI(
    title="Ratefluencer AI Copilot",
    description="AI-powered influencer intelligence platform",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3002", "http://127.0.0.1:3002"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ════════════════════════════════════════════════════════════════════════
# INFLUENCER ROUTES
# ════════════════════════════════════════════════════════════════════════


@app.post("/api/influencer/analyze", response_model=InfluencerAnalysis)
def analyze_influencer(data: InfluencerInput, db: Session = Depends(get_db)):
    """Analyze an influencer and persist results."""
    eng = calculate_engagement_rate(
        data.followers, data.avg_likes, data.avg_comments,
        data.avg_shares, data.avg_saves,
    )
    auth = calculate_authenticity_score(
        data.followers, data.following, eng, data.avg_comments,
    )
    growth = calculate_growth_potential(data.posting_frequency, eng, data.category)
    bm = calculate_brand_match_score(data.category, eng, auth)
    rf = calculate_ratefluencer_score(eng, auth, growth, bm)

    influencer = Influencer(
        name=data.name,
        followers=data.followers,
        following=data.following,
        avg_likes=data.avg_likes,
        avg_comments=data.avg_comments,
        avg_shares=data.avg_shares,
        avg_saves=data.avg_saves,
        posting_frequency=data.posting_frequency,
        category=data.category,
        engagement_rate=eng,
        authenticity_score=auth,
        growth_potential=growth,
        brand_match_score=bm,
        ratefluencer_score=rf,
    )
    db.add(influencer)
    db.commit()
    db.refresh(influencer)

    fake = detect_fake_followers(
        data.followers, data.following,
        data.avg_likes, data.avg_comments, data.avg_shares,
    )
    brands = match_brands(data.category, eng, auth)

    return InfluencerAnalysis(
        id=influencer.id,
        name=influencer.name,
        followers=influencer.followers,
        following=influencer.following,
        avg_likes=influencer.avg_likes,
        avg_comments=influencer.avg_comments,
        avg_shares=influencer.avg_shares,
        avg_saves=influencer.avg_saves,
        posting_frequency=influencer.posting_frequency,
        category=influencer.category,
        engagement_rate=eng,
        authenticity_score=auth,
        growth_potential=growth,
        brand_match_score=bm,
        ratefluencer_score=rf,
        fake_detection=FakeDetectionResult(
            authenticity_score=fake["authenticity_score"],
            risk_level=fake["risk_level"],
            risk_indicators=[
                RiskIndicator(
                    indicator=r["indicator"],
                    severity=r["severity"],
                    details=r["details"],
                )
                for r in fake["risk_indicators"]
            ],
            suspicious_patterns=fake["suspicious_patterns"],
        ),
        brand_matches=[
            BrandMatch(
                brand_name=b["brand_name"],
                match_percentage=b["match_percentage"],
                reasoning=b["reasoning"],
            )
            for b in brands
        ],
        created_at=influencer.created_at,
    )


@app.get("/api/influencer/list", response_model=List[InfluencerOut])
def list_influencers(
    skip: int = 0,
    limit: int = 50,
    db: Session = Depends(get_db),
):
    return db.query(Influencer).order_by(Influencer.created_at.desc()).offset(skip).limit(limit).all()


# ════════════════════════════════════════════════════════════════════════
# BRANDS ROUTES
# ════════════════════════════════════════════════════════════════════════


@app.post("/api/brands/match")
def brand_match(data: BrandMatchRequest):
    results = match_brands(data.category, data.engagement_rate, data.authenticity_score)
    return results


@app.get("/api/brands/list")
def list_brands():
    return get_all_brand_profiles()


# ════════════════════════════════════════════════════════════════════════
# TRENDS ROUTES
# ════════════════════════════════════════════════════════════════════════


@app.get("/api/trends", response_model=List[TrendsGrouped])
def get_trends():
    all_trends = get_all_trends()
    return [
        TrendsGrouped(
            category=cat,
            trends=[TrendItem(category=cat, **t) for t in items],
        )
        for cat, items in all_trends.items()
    ]


@app.get("/api/trends/{category}", response_model=List[TrendItem])
def get_trends_category(category: str):
    items = get_trends_by_category(category)
    if not items:
        raise HTTPException(status_code=404, detail=f"No trends found for category '{category}'")
    return [TrendItem(category=category, **t) for t in items]


# ════════════════════════════════════════════════════════════════════════
# CONTENT ROUTES
# ════════════════════════════════════════════════════════════════════════


def _save_content(db: Session, content_type: str, topic: str, content: Dict[str, Any]) -> GeneratedContent:
    record = GeneratedContent(
        content_type=content_type,
        topic=topic,
        content_json=json.dumps(content),
    )
    db.add(record)
    db.commit()
    db.refresh(record)
    return record


@app.post("/api/content/reel", response_model=ContentResponse)
def generate_reel(data: ContentRequest, db: Session = Depends(get_db)):
    content = generate_reel_script(data.topic)
    record = _save_content(db, "reel", data.topic, content)
    return ContentResponse(
        id=record.id,
        content_type=record.content_type,
        topic=record.topic,
        content=content,
        created_at=record.created_at,
    )


@app.post("/api/content/linkedin", response_model=ContentResponse)
def generate_linkedin(data: ContentRequest, db: Session = Depends(get_db)):
    content = generate_linkedin_post(data.topic)
    record = _save_content(db, "linkedin", data.topic, content)
    return ContentResponse(
        id=record.id,
        content_type=record.content_type,
        topic=record.topic,
        content=content,
        created_at=record.created_at,
    )


@app.post("/api/content/instagram", response_model=ContentResponse)
def generate_instagram(data: ContentRequest, db: Session = Depends(get_db)):
    content = generate_instagram_content(data.topic)
    record = _save_content(db, "instagram", data.topic, content)
    return ContentResponse(
        id=record.id,
        content_type=record.content_type,
        topic=record.topic,
        content=content,
        created_at=record.created_at,
    )


@app.post("/api/content/virality", response_model=ViralityResponse)
def virality_predict(data: ViralityRequest):
    result = predict_virality(
        data.topic, data.followers, data.engagement_rate, data.content_type
    )
    return ViralityResponse(**result)


# ════════════════════════════════════════════════════════════════════════
# ADMIN ROUTES
# ════════════════════════════════════════════════════════════════════════


@app.get("/api/admin/dashboard", response_model=AdminDashboard)
def admin_dashboard(db: Session = Depends(get_db)):
    influencers = db.query(Influencer).all()
    total = len(influencers)
    avg_score = (
        sum(i.ratefluencer_score or 0 for i in influencers) / total if total else 0.0
    )
    content_count = db.query(GeneratedContent).count()
    top_trends = [TrendItem(category=t["category"], **{k: v for k, v in t.items() if k != "category"}) for t in get_top_trends(5)]
    recent = (
        db.query(Influencer)
        .order_by(Influencer.created_at.desc())
        .limit(10)
        .all()
    )
    return AdminDashboard(
        total_influencers=total,
        avg_score=round(avg_score, 2),
        top_trends=top_trends,
        content_count=content_count,
        recent_analyses=recent,
    )


@app.get("/api/health")
def health():
    return {
        "status": "ok",
        "service": "Ratefluencer AI Copilot",
        "ai_provider": "Cerebras (llama-3.3-70b)",
        "ai_configured": ai_configured(),
        "ai_status": "🟢 Active" if ai_configured() else "🟡 Template mode (add CEREBRAS_API_KEY to .env)",
    }

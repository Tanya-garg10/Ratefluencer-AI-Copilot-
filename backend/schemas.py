"""
Pydantic schemas for request / response validation.
"""

from __future__ import annotations

from datetime import datetime
from typing import Any, Dict, List, Optional

from pydantic import BaseModel, Field


# ────────────────────────────── Influencer ──────────────────────────────


class InfluencerInput(BaseModel):
    """Payload sent by the frontend to analyse an influencer."""

    name: str = Field(..., min_length=1, max_length=255)
    followers: int = Field(..., gt=0)
    following: int = Field(..., ge=0)
    avg_likes: float = Field(..., ge=0)
    avg_comments: float = Field(..., ge=0)
    avg_shares: float = Field(default=0.0, ge=0)
    avg_saves: float = Field(default=0.0, ge=0)
    posting_frequency: float = Field(default=1.0, ge=0)
    category: str = Field(..., min_length=1, max_length=100)


class RiskIndicator(BaseModel):
    indicator: str
    severity: str
    details: str


class FakeDetectionResult(BaseModel):
    authenticity_score: float
    risk_level: str
    risk_indicators: List[RiskIndicator]
    suspicious_patterns: List[str]


class BrandMatch(BaseModel):
    brand_name: str
    match_percentage: float
    reasoning: str


class InfluencerAnalysis(BaseModel):
    """Full analysis returned after scoring an influencer."""

    id: int
    name: str
    followers: int
    following: int
    avg_likes: float
    avg_comments: float
    avg_shares: float
    avg_saves: float
    posting_frequency: float
    category: str
    engagement_rate: float
    authenticity_score: float
    growth_potential: float
    brand_match_score: float
    ratefluencer_score: float
    fake_detection: FakeDetectionResult
    brand_matches: List[BrandMatch]
    created_at: datetime

    class Config:
        from_attributes = True


class InfluencerOut(BaseModel):
    """Lightweight influencer record returned by list endpoints."""

    id: int
    name: str
    followers: int
    following: int
    avg_likes: float
    avg_comments: float
    avg_shares: float
    avg_saves: float
    posting_frequency: float
    category: str
    engagement_rate: Optional[float] = None
    authenticity_score: Optional[float] = None
    growth_potential: Optional[float] = None
    brand_match_score: Optional[float] = None
    ratefluencer_score: Optional[float] = None
    created_at: datetime

    class Config:
        from_attributes = True


# ────────────────────────────── Content ─────────────────────────────────


class ContentRequest(BaseModel):
    topic: str = Field(..., min_length=1, max_length=500)
    content_type: Optional[str] = Field(default=None, max_length=50)
    tone: Optional[str] = Field(default="professional", max_length=100)
    target_audience: Optional[str] = Field(default=None, max_length=200)
    additional_context: Optional[str] = Field(default=None, max_length=1000)


class ContentResponse(BaseModel):
    id: int
    content_type: str
    topic: str
    content: Dict[str, Any]
    created_at: datetime


# ────────────────────────────── Virality ─────────────────────────────────


class ViralityRequest(BaseModel):
    topic: str = Field(..., min_length=1, max_length=500)
    followers: int = Field(..., gt=0)
    engagement_rate: float = Field(..., ge=0)
    content_type: str = Field(default="reel", max_length=50)


class ViralityResponse(BaseModel):
    expected_reach: int
    expected_likes: int
    expected_shares: int
    expected_saves: int
    virality_score: float


# ────────────────────────────── Trends ───────────────────────────────────


class TrendItem(BaseModel):
    id: Optional[int] = None
    category: str
    topic: str
    trend_score: float
    growth_velocity: str
    audience_relevance: float

    class Config:
        from_attributes = True


class TrendsGrouped(BaseModel):
    """Trends grouped by category."""

    category: str
    trends: List[TrendItem]


# ────────────────────────────── Brands ───────────────────────────────────


class BrandMatchRequest(BaseModel):
    category: str = Field(..., min_length=1, max_length=100)
    engagement_rate: float = Field(..., ge=0)
    authenticity_score: float = Field(..., ge=0, le=100)


class BrandProfile(BaseModel):
    name: str
    categories: List[str]
    audience_type: str
    engagement_min: float
    values: List[str]


# ────────────────────────────── Admin ────────────────────────────────────


class AdminDashboard(BaseModel):
    total_influencers: int
    avg_score: float
    top_trends: List[TrendItem]
    content_count: int
    recent_analyses: List[InfluencerOut]

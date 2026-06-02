"""
SQLAlchemy ORM models for Ratefluencer AI Copilot.
"""

from datetime import datetime, timezone

from sqlalchemy import Column, Integer, String, Float, Text, DateTime

from database import Base


class Influencer(Base):
    """Stores influencer profiles and their computed scores."""

    __tablename__ = "influencers"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String(255), nullable=False, index=True)
    followers = Column(Integer, nullable=False)
    following = Column(Integer, nullable=False)
    avg_likes = Column(Float, nullable=False)
    avg_comments = Column(Float, nullable=False)
    avg_shares = Column(Float, nullable=False, default=0.0)
    avg_saves = Column(Float, nullable=False, default=0.0)
    posting_frequency = Column(Float, nullable=False, default=1.0)
    category = Column(String(100), nullable=False, index=True)
    engagement_rate = Column(Float, nullable=True)
    authenticity_score = Column(Float, nullable=True)
    growth_potential = Column(Float, nullable=True)
    brand_match_score = Column(Float, nullable=True)
    ratefluencer_score = Column(Float, nullable=True)
    created_at = Column(
        DateTime, nullable=False, default=lambda: datetime.now(timezone.utc)
    )

    def __repr__(self) -> str:
        return (
            f"<Influencer(id={self.id}, name='{self.name}', "
            f"score={self.ratefluencer_score})>"
        )


class GeneratedContent(Base):
    """Stores AI-generated content pieces."""

    __tablename__ = "generated_content"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    content_type = Column(String(50), nullable=False, index=True)
    topic = Column(String(500), nullable=False)
    content_json = Column(Text, nullable=False)
    created_at = Column(
        DateTime, nullable=False, default=lambda: datetime.now(timezone.utc)
    )

    def __repr__(self) -> str:
        return (
            f"<GeneratedContent(id={self.id}, type='{self.content_type}', "
            f"topic='{self.topic[:40]}')>"
        )


class TrendEntry(Base):
    """Stores trending topics and their metrics."""

    __tablename__ = "trend_entries"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    category = Column(String(100), nullable=False, index=True)
    topic = Column(String(500), nullable=False)
    trend_score = Column(Float, nullable=False)
    growth_velocity = Column(String(50), nullable=False)
    audience_relevance = Column(Float, nullable=False)
    created_at = Column(
        DateTime, nullable=False, default=lambda: datetime.now(timezone.utc)
    )

    def __repr__(self) -> str:
        return (
            f"<TrendEntry(id={self.id}, category='{self.category}', "
            f"topic='{self.topic[:40]}')>"
        )

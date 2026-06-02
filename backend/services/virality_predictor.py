"""
Virality prediction engine.

Estimates expected reach, likes, shares, saves, and an overall virality
score given an influencer's metrics and content type.  Controlled
randomness (±15 %) is added so repeated calls feel realistic.
"""

from __future__ import annotations

import random

# ─── Content-type multipliers ──────────────────────────────────────────

_REACH_MULTIPLIER = {
    "reel": 3.5,
    "linkedin": 2.0,
    "instagram": 1.8,
}

_SHARE_RATIO = {
    "reel": 0.15,
    "linkedin": 0.08,
    "instagram": 0.05,
}

_SAVE_RATIO = {
    "reel": 0.10,
    "linkedin": 0.12,
    "instagram": 0.08,
}

# ─── Benchmark averages (for scoring) ─────────────────────────────────

_AVG_ENGAGEMENT_RATE = 3.5  # %
_AVG_REACH_MULTIPLIER = 2.0
_AVG_VIRALITY_SCORE = 50.0


def _jitter(value: float, pct: float = 0.15) -> float:
    """Add controlled randomness within ± *pct* of the value."""
    lo = value * (1 - pct)
    hi = value * (1 + pct)
    return random.uniform(lo, hi)


def predict_virality(
    topic: str,
    followers: int,
    engagement_rate: float,
    content_type: str,
) -> dict:
    """
    Predict virality metrics for a piece of content.

    Parameters
    ----------
    topic : str
        The content topic (used for potential future topic-boost logic).
    followers : int
        Influencer's follower count.
    engagement_rate : float
        Influencer's engagement rate (%).
    content_type : str
        One of 'reel', 'linkedin', 'instagram'.

    Returns
    -------
    dict with expected_reach, expected_likes, expected_shares,
    expected_saves, virality_score.
    """
    ct = content_type.lower().strip()
    reach_mult = _REACH_MULTIPLIER.get(ct, 2.0)
    share_ratio = _SHARE_RATIO.get(ct, 0.08)
    save_ratio = _SAVE_RATIO.get(ct, 0.08)

    # ── Topic boost (trending topics get a bump) ────────────────────────
    _HOT_KEYWORDS = {
        "ai", "artificial intelligence", "llm", "gpt", "startup",
        "viral", "trending", "breaking", "launch", "funding",
    }
    topic_lower = topic.lower()
    topic_boost = 1.0
    for kw in _HOT_KEYWORDS:
        if kw in topic_lower:
            topic_boost += 0.10  # stack up to ~+30 %
    topic_boost = min(topic_boost, 1.35)

    # ── Expected reach ──────────────────────────────────────────────────
    raw_reach = followers * reach_mult * topic_boost
    expected_reach = int(_jitter(raw_reach))

    # ── Expected likes ──────────────────────────────────────────────────
    engagement_factor = engagement_rate / 100.0
    raw_likes = expected_reach * engagement_factor
    expected_likes = int(_jitter(raw_likes))

    # ── Expected shares & saves ─────────────────────────────────────────
    expected_shares = int(_jitter(expected_likes * share_ratio))
    expected_saves = int(_jitter(expected_likes * save_ratio))

    # ── Virality score (0-100) ──────────────────────────────────────────
    #   Compare predicted metrics against benchmark averages.
    reach_ratio = (expected_reach / max(followers, 1)) / _AVG_REACH_MULTIPLIER
    eng_ratio = engagement_rate / _AVG_ENGAGEMENT_RATE
    composite = (reach_ratio * 0.40 + eng_ratio * 0.35 + topic_boost * 0.25)
    virality_score = min(round(composite * _AVG_VIRALITY_SCORE, 2), 99.0)
    virality_score = max(virality_score, 5.0)

    return {
        "expected_reach": max(expected_reach, 0),
        "expected_likes": max(expected_likes, 0),
        "expected_shares": max(expected_shares, 0),
        "expected_saves": max(expected_saves, 0),
        "virality_score": virality_score,
    }

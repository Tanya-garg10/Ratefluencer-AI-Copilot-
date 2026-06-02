"""
ML-inspired scoring engine for influencer analysis.

Every helper returns a float in [0, 100]. Numpy is used for vectorised
maths and sigmoid-like scaling so that most real-world profiles land
between 40-85.
"""

from __future__ import annotations

import numpy as np

# ─── Category growth-multipliers (higher = faster-growing niche) ────────

_CATEGORY_MULTIPLIER: dict[str, float] = {
    "ai": 1.35,
    "technology": 1.25,
    "startups": 1.20,
    "finance": 1.10,
    "business": 1.05,
    "marketing": 1.05,
    "fitness": 1.00,
    "fashion": 0.95,
    "food": 0.95,
    "travel": 0.90,
    "lifestyle": 0.90,
    "beauty": 0.95,
    "gaming": 1.15,
    "education": 1.10,
    "health": 1.10,
    "sports": 1.00,
    "entertainment": 0.95,
    "music": 0.90,
    "photography": 0.90,
    "art": 0.85,
}

# ─── Category premium for brand matching ────────────────────────────────

_CATEGORY_PREMIUM: dict[str, float] = {
    "ai": 1.30,
    "technology": 1.25,
    "startups": 1.15,
    "finance": 1.20,
    "business": 1.15,
    "marketing": 1.10,
    "fitness": 1.10,
    "fashion": 1.05,
    "food": 1.00,
    "travel": 1.00,
    "lifestyle": 0.95,
    "beauty": 1.05,
    "gaming": 1.10,
    "education": 1.05,
    "health": 1.10,
    "sports": 1.05,
    "entertainment": 0.95,
    "music": 0.90,
    "photography": 0.90,
    "art": 0.85,
}


def _sigmoid_scale(x: float, midpoint: float = 50.0, steepness: float = 0.1) -> float:
    """Apply a sigmoid curve centred at *midpoint* to compress outliers."""
    return float(100.0 / (1.0 + np.exp(-steepness * (x - midpoint))))


def _clamp(value: float, lo: float = 0.0, hi: float = 100.0) -> float:
    return float(np.clip(value, lo, hi))


# ───────────────────────── Public API ───────────────────────────────────


def calculate_engagement_rate(
    followers: int,
    likes: float,
    comments: float,
    shares: float,
    saves: float,
) -> float:
    """
    Standard engagement-rate formula.
    Returns a percentage (0-100, though typically < 20).
    """
    if followers <= 0:
        return 0.0
    return float((likes + comments + shares + saves) / followers * 100)


def calculate_authenticity_score(
    followers: int,
    following: int,
    engagement_rate: float,
    avg_comments: float,
) -> float:
    """
    Heuristic authenticity score (0-100).

    Ideal follower/following ratio is 1.0–3.0.  Extremely high ratios
    (celebrity-level) are fine but very low ratios are suspicious.
    Engagement consistency and comment depth also factor in.
    """
    # --- Follower / following ratio component ---
    ratio = followers / max(following, 1)
    if 1.0 <= ratio <= 3.0:
        ratio_score = 95.0
    elif 3.0 < ratio <= 10.0:
        ratio_score = 85.0
    elif 10.0 < ratio <= 50.0:
        ratio_score = 70.0
    elif ratio > 50.0:
        ratio_score = 55.0  # celebrity territory – not suspicious per se
    elif 0.5 <= ratio < 1.0:
        ratio_score = 60.0
    elif 0.1 <= ratio < 0.5:
        ratio_score = 40.0
    else:
        ratio_score = 20.0  # follow-bots

    # --- Engagement consistency component ---
    if 1.0 <= engagement_rate <= 6.0:
        eng_score = 90.0
    elif 0.5 <= engagement_rate < 1.0:
        eng_score = 65.0
    elif 6.0 < engagement_rate <= 15.0:
        eng_score = 70.0
    elif engagement_rate > 15.0:
        eng_score = 40.0  # likely fake engagement
    else:
        eng_score = 30.0  # ghost followers

    # --- Comment quality heuristic ---
    comment_ratio = avg_comments / max(followers, 1) * 1000  # per-mille
    if 0.5 <= comment_ratio <= 10.0:
        comment_score = 90.0
    elif comment_ratio > 10.0:
        comment_score = 55.0
    else:
        comment_score = 45.0

    raw = ratio_score * 0.40 + eng_score * 0.35 + comment_score * 0.25
    return round(_sigmoid_scale(raw, midpoint=55.0, steepness=0.09), 2)


def calculate_growth_potential(
    posting_frequency: float,
    engagement_rate: float,
    category: str,
) -> float:
    """
    Growth-potential score (0-100).

    Optimal posting is 1–2 times per day.  Categories in high-growth
    niches receive a multiplier boost.
    """
    # --- Posting frequency component ---
    if 1.0 <= posting_frequency <= 2.0:
        freq_score = 95.0
    elif 0.5 <= posting_frequency < 1.0:
        freq_score = 75.0
    elif 2.0 < posting_frequency <= 3.0:
        freq_score = 80.0
    elif 3.0 < posting_frequency <= 5.0:
        freq_score = 65.0
    elif posting_frequency > 5.0:
        freq_score = 45.0  # over-posting fatigue
    else:
        freq_score = 40.0  # near-inactive

    # --- Engagement drive ---
    eng_drive = min(engagement_rate * 12, 100.0)

    # --- Category multiplier ---
    cat_key = category.lower().strip()
    multiplier = _CATEGORY_MULTIPLIER.get(cat_key, 1.0)

    raw = (freq_score * 0.45 + eng_drive * 0.55) * multiplier
    return round(_clamp(_sigmoid_scale(raw, midpoint=55.0, steepness=0.08)), 2)


def calculate_brand_match_score(
    category: str,
    engagement_rate: float,
    authenticity: float,
) -> float:
    """
    Brand-match quality score (0-100).

    Higher authenticity and engagement in premium categories yield a
    higher score.
    """
    cat_key = category.lower().strip()
    premium = _CATEGORY_PREMIUM.get(cat_key, 1.0)

    engagement_component = min(engagement_rate * 10, 100.0) * 0.35
    authenticity_component = authenticity * 0.45
    premium_component = premium * 20.0 * 0.20  # max ≈ 5.2 contribution

    raw = engagement_component + authenticity_component + premium_component
    return round(_clamp(_sigmoid_scale(raw, midpoint=45.0, steepness=0.09)), 2)


def calculate_ratefluencer_score(
    engagement_rate: float,
    authenticity: float,
    growth: float,
    brand_match: float,
) -> float:
    """
    Composite Ratefluencer Score (0-100).

    Weighted blend:
      authenticity  × 0.30
      engagement    × 0.25 (normalised to 0-100 scale)
      growth        × 0.25
      brand_match   × 0.20
    """
    engagement_normalised = _clamp(engagement_rate * 10, 0, 100)
    raw = (
        authenticity * 0.30
        + engagement_normalised * 0.25
        + growth * 0.25
        + brand_match * 0.20
    )
    return round(_clamp(_sigmoid_scale(raw, midpoint=50.0, steepness=0.08)), 2)

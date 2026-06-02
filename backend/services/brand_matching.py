"""
Brand-matching engine powered by cosine similarity.

Each brand is represented as a profile with associated category tags,
audience type, minimum engagement expectation, and brand values.
An influencer's category is converted to a one-hot vector and compared
against every brand's category vector via cosine similarity.
Engagement rate and authenticity are used as tie-breakers.
"""

from __future__ import annotations

from typing import Any, Dict, List

import numpy as np

# ─── Brand profiles ────────────────────────────────────────────────────

BRAND_PROFILES: List[Dict[str, Any]] = [
    {
        "name": "Nike",
        "categories": ["sports", "fitness", "lifestyle"],
        "audience_type": "Active lifestyle enthusiasts",
        "engagement_min": 2.0,
        "values": ["performance", "inspiration", "inclusivity"],
    },
    {
        "name": "Adidas",
        "categories": ["sports", "fashion", "streetwear"],
        "audience_type": "Trend-conscious athletes",
        "engagement_min": 1.8,
        "values": ["creativity", "sustainability", "street culture"],
    },
    {
        "name": "Samsung",
        "categories": ["technology", "innovation", "lifestyle"],
        "audience_type": "Tech-savvy consumers",
        "engagement_min": 1.5,
        "values": ["innovation", "quality", "connectivity"],
    },
    {
        "name": "Notion",
        "categories": ["productivity", "technology", "startups"],
        "audience_type": "Knowledge workers & creators",
        "engagement_min": 2.5,
        "values": ["productivity", "simplicity", "collaboration"],
    },
    {
        "name": "OpenAI",
        "categories": ["ai", "technology", "innovation"],
        "audience_type": "Developers & AI enthusiasts",
        "engagement_min": 3.0,
        "values": ["safety", "research", "accessibility"],
    },
    {
        "name": "Adobe",
        "categories": ["creative", "design", "technology"],
        "audience_type": "Designers & content creators",
        "engagement_min": 2.0,
        "values": ["creativity", "empowerment", "digital expression"],
    },
    {
        "name": "HubSpot",
        "categories": ["marketing", "business", "saas"],
        "audience_type": "Marketers & small business owners",
        "engagement_min": 1.5,
        "values": ["growth", "inbound marketing", "customer success"],
    },
    {
        "name": "Shopify",
        "categories": ["ecommerce", "business", "entrepreneurship"],
        "audience_type": "Entrepreneurs & online sellers",
        "engagement_min": 1.8,
        "values": ["entrepreneurship", "independence", "commerce"],
    },
]

# ─── Build global vocabulary of all categories ─────────────────────────

_ALL_CATEGORIES: List[str] = sorted(
    {cat for brand in BRAND_PROFILES for cat in brand["categories"]}
)
_CAT_INDEX: Dict[str, int] = {cat: idx for idx, cat in enumerate(_ALL_CATEGORIES)}
_VOCAB_SIZE: int = len(_ALL_CATEGORIES)


def _category_to_vector(categories: List[str]) -> np.ndarray:
    """Convert a list of category tags into a one-hot (multi-hot) vector."""
    vec = np.zeros(_VOCAB_SIZE, dtype=np.float64)
    for cat in categories:
        key = cat.lower().strip()
        if key in _CAT_INDEX:
            vec[_CAT_INDEX[key]] = 1.0
    return vec


def _cosine_similarity(a: np.ndarray, b: np.ndarray) -> float:
    """Cosine similarity in [0, 1]."""
    dot = float(np.dot(a, b))
    norm_a = float(np.linalg.norm(a))
    norm_b = float(np.linalg.norm(b))
    if norm_a == 0 or norm_b == 0:
        return 0.0
    return dot / (norm_a * norm_b)


def _generate_reasoning(
    brand: Dict[str, Any],
    similarity: float,
    engagement_rate: float,
    authenticity_score: float,
) -> str:
    """Produce a human-readable justification for the match."""
    parts: List[str] = []

    if similarity >= 0.8:
        parts.append(
            f"Strong category alignment with {brand['name']}'s focus on "
            f"{', '.join(brand['categories'])}."
        )
    elif similarity >= 0.4:
        parts.append(
            f"Moderate category overlap with {brand['name']}'s domains "
            f"({', '.join(brand['categories'])})."
        )
    else:
        parts.append(
            f"Partial category crossover with {brand['name']} "
            f"({', '.join(brand['categories'])})."
        )

    if engagement_rate >= brand["engagement_min"]:
        parts.append(
            f"Engagement rate ({engagement_rate:.1f}%) meets the brand's "
            f"minimum threshold of {brand['engagement_min']}%."
        )
    else:
        parts.append(
            f"Engagement rate ({engagement_rate:.1f}%) is below the brand's "
            f"preferred {brand['engagement_min']}% — room for growth."
        )

    if authenticity_score >= 70:
        parts.append("High authenticity score reinforces brand-safety confidence.")
    elif authenticity_score >= 50:
        parts.append("Moderate authenticity — brand may request additional vetting.")

    parts.append(f"Target audience: {brand['audience_type']}.")
    return " ".join(parts)


def match_brands(
    category: str,
    engagement_rate: float,
    authenticity_score: float,
    top_n: int = 5,
) -> List[Dict[str, Any]]:
    """
    Return the top-*n* brand matches for an influencer.

    Parameters
    ----------
    category : str
        Influencer's primary category (e.g. 'technology').
    engagement_rate : float
        Influencer's engagement rate percentage.
    authenticity_score : float
        Influencer's authenticity score (0-100).
    top_n : int
        How many brands to return.

    Returns
    -------
    list[dict] – each dict has brand_name, match_percentage, reasoning.
    """
    # Build the influencer vector.  We also check for related categories:
    influencer_cats = [category.lower().strip()]

    # Expand influencer vector with category synonyms / neighbours
    _SYNONYMS: Dict[str, List[str]] = {
        "ai": ["technology", "innovation"],
        "tech": ["technology"],
        "technology": ["innovation"],
        "fitness": ["sports", "lifestyle"],
        "fashion": ["lifestyle", "streetwear"],
        "startups": ["business", "entrepreneurship", "technology"],
        "marketing": ["business", "saas"],
        "ecommerce": ["business", "entrepreneurship"],
        "design": ["creative"],
        "gaming": ["technology", "entertainment"],
        "health": ["fitness", "lifestyle"],
        "sports": ["fitness"],
        "beauty": ["lifestyle", "fashion"],
        "food": ["lifestyle"],
        "travel": ["lifestyle"],
        "education": ["productivity"],
        "finance": ["business"],
    }

    extra = _SYNONYMS.get(influencer_cats[0], [])
    influencer_cats.extend(extra)
    influencer_vec = _category_to_vector(influencer_cats)

    scored: List[tuple] = []
    for brand in BRAND_PROFILES:
        brand_vec = _category_to_vector(brand["categories"])
        sim = _cosine_similarity(influencer_vec, brand_vec)

        # Blend in engagement and authenticity bonuses
        eng_bonus = min(engagement_rate / 10.0, 0.15)  # up to +15 pp
        auth_bonus = (authenticity_score / 100.0) * 0.10  # up to +10 pp
        final = min((sim + eng_bonus + auth_bonus) * 100, 99.0)
        scored.append((brand, final, sim))

    # Sort descending by final score
    scored.sort(key=lambda x: x[1], reverse=True)

    results: List[Dict[str, Any]] = []
    for brand, pct, sim in scored[:top_n]:
        results.append(
            {
                "brand_name": brand["name"],
                "match_percentage": round(pct, 1),
                "reasoning": _generate_reasoning(
                    brand, sim, engagement_rate, authenticity_score
                ),
            }
        )

    return results


def get_all_brand_profiles() -> List[Dict[str, Any]]:
    """Return the full list of brand profiles (for the GET /brands/list endpoint)."""
    return [
        {
            "name": b["name"],
            "categories": b["categories"],
            "audience_type": b["audience_type"],
            "engagement_min": b["engagement_min"],
            "values": b["values"],
        }
        for b in BRAND_PROFILES
    ]

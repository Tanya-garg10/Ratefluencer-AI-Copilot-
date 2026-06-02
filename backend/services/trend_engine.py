"""
Trend discovery engine.

Returns curated trending topics per category with realistic metrics.
"""

from __future__ import annotations

from typing import Any, Dict, List

# ─── Curated trend data ────────────────────────────────────────────────

_TRENDS: Dict[str, List[Dict[str, Any]]] = {
    "AI": [
        {"topic": "AI Agents in Production", "trend_score": 97, "growth_velocity": "+34%", "audience_relevance": 92},
        {"topic": "Multimodal LLMs", "trend_score": 95, "growth_velocity": "+29%", "audience_relevance": 89},
        {"topic": "AI Code Generation", "trend_score": 93, "growth_velocity": "+26%", "audience_relevance": 94},
        {"topic": "Open Source AI Models", "trend_score": 90, "growth_velocity": "+23%", "audience_relevance": 87},
        {"topic": "AI in Healthcare", "trend_score": 86, "growth_velocity": "+18%", "audience_relevance": 78},
    ],
    "Technology": [
        {"topic": "Spatial Computing", "trend_score": 91, "growth_velocity": "+22%", "audience_relevance": 83},
        {"topic": "Edge AI", "trend_score": 88, "growth_velocity": "+19%", "audience_relevance": 80},
        {"topic": "Quantum Computing Progress", "trend_score": 82, "growth_velocity": "+14%", "audience_relevance": 72},
        {"topic": "Web3 Revival", "trend_score": 78, "growth_velocity": "+11%", "audience_relevance": 68},
        {"topic": "Cybersecurity AI", "trend_score": 89, "growth_velocity": "+21%", "audience_relevance": 85},
    ],
    "Business": [
        {"topic": "Creator Economy 3.0", "trend_score": 94, "growth_velocity": "+27%", "audience_relevance": 91},
        {"topic": "Fractional C-Suite", "trend_score": 85, "growth_velocity": "+16%", "audience_relevance": 76},
        {"topic": "Climate Tech Funding", "trend_score": 80, "growth_velocity": "+13%", "audience_relevance": 70},
        {"topic": "Remote Work Evolution", "trend_score": 87, "growth_velocity": "+15%", "audience_relevance": 88},
        {"topic": "Micro-SaaS", "trend_score": 83, "growth_velocity": "+17%", "audience_relevance": 82},
    ],
    "Startups": [
        {"topic": "AI-First Startups", "trend_score": 96, "growth_velocity": "+31%", "audience_relevance": 93},
        {"topic": "Vertical SaaS", "trend_score": 88, "growth_velocity": "+20%", "audience_relevance": 81},
        {"topic": "Deep Tech Renaissance", "trend_score": 84, "growth_velocity": "+15%", "audience_relevance": 74},
        {"topic": "Solo Founders", "trend_score": 90, "growth_velocity": "+24%", "audience_relevance": 89},
        {"topic": "API Economy", "trend_score": 82, "growth_velocity": "+13%", "audience_relevance": 77},
    ],
    "Finance": [
        {"topic": "Embedded Finance", "trend_score": 87, "growth_velocity": "+18%", "audience_relevance": 79},
        {"topic": "AI Trading Bots", "trend_score": 92, "growth_velocity": "+25%", "audience_relevance": 86},
        {"topic": "Digital Banking", "trend_score": 81, "growth_velocity": "+12%", "audience_relevance": 75},
        {"topic": "Tokenized Assets", "trend_score": 76, "growth_velocity": "+10%", "audience_relevance": 65},
        {"topic": "Green Finance", "trend_score": 79, "growth_velocity": "+11%", "audience_relevance": 71},
    ],
}

# ─── Public API ─────────────────────────────────────────────────────────


def get_all_trends() -> Dict[str, List[Dict[str, Any]]]:
    """Return all trends grouped by category."""
    return _TRENDS


def get_trends_by_category(category: str) -> List[Dict[str, Any]]:
    """
    Return trends for a specific category (case-insensitive).

    Returns an empty list when the category is unknown.
    """
    # Try exact (title-cased) match first, then iterate
    key = category.strip().title()
    if key in _TRENDS:
        return _TRENDS[key]

    # Fallback: case-insensitive scan
    lower = category.lower().strip()
    for k, v in _TRENDS.items():
        if k.lower() == lower:
            return v

    return []


def get_flat_trends() -> List[Dict[str, Any]]:
    """Return all trends as a flat list with 'category' included in each dict."""
    flat: List[Dict[str, Any]] = []
    for cat, topics in _TRENDS.items():
        for t in topics:
            flat.append({"category": cat, **t})
    return flat


def get_top_trends(n: int = 5) -> List[Dict[str, Any]]:
    """Return the top *n* trends globally, sorted by trend_score descending."""
    flat = get_flat_trends()
    flat.sort(key=lambda x: x["trend_score"], reverse=True)
    return flat[:n]

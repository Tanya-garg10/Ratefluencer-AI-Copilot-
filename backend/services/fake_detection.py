"""
Fake-follower detection engine.

Analyses an influencer's public metrics for anomalies that indicate
purchased or bot-driven followers.
"""

from __future__ import annotations

from typing import Any, Dict, List


def _make_indicator(indicator: str, severity: str, details: str) -> Dict[str, str]:
    return {"indicator": indicator, "severity": severity, "details": details}


def detect_fake_followers(
    followers: int,
    following: int,
    avg_likes: float,
    avg_comments: float,
    avg_shares: float,
) -> Dict[str, Any]:
    """
    Return a fraud-risk assessment for the given influencer metrics.

    Returns
    -------
    dict with keys:
        authenticity_score  (0-100)
        risk_level          ('Low' | 'Medium' | 'High')
        risk_indicators     list[dict] – each has indicator, severity, details
        suspicious_patterns list[str]
    """
    risk_indicators: List[Dict[str, str]] = []
    suspicious_patterns: List[str] = []
    penalty = 0.0  # accumulated penalty subtracted from a perfect 100

    # ── 1. Follower / following ratio anomalies ─────────────────────────
    ratio = followers / max(following, 1)

    if ratio > 100:
        risk_indicators.append(
            _make_indicator(
                "Extreme follower/following ratio",
                "Medium",
                f"Ratio of {ratio:.1f} — could indicate celebrity OR purchased followers.",
            )
        )
        suspicious_patterns.append(
            f"Follower/following ratio ({ratio:.1f}) is extremely high"
        )
        penalty += 10
    elif ratio > 10:
        risk_indicators.append(
            _make_indicator(
                "High follower/following ratio",
                "Low",
                f"Ratio of {ratio:.1f} — moderately unusual but not conclusive.",
            )
        )
        penalty += 5
    elif ratio < 0.1:
        risk_indicators.append(
            _make_indicator(
                "Very low follower/following ratio",
                "High",
                f"Ratio of {ratio:.4f} — follows far more people than follow back, "
                "common with follow-bots.",
            )
        )
        suspicious_patterns.append(
            "Follows vastly more accounts than followers received — bot signature"
        )
        penalty += 25

    # ── 2. Engagement rate anomalies ────────────────────────────────────
    total_engagement = avg_likes + avg_comments + avg_shares
    engagement_rate = total_engagement / max(followers, 1) * 100

    if engagement_rate < 0.5:
        risk_indicators.append(
            _make_indicator(
                "Extremely low engagement rate",
                "High",
                f"Engagement rate of {engagement_rate:.2f}% is far below the 1-3% "
                "industry average — strong ghost-follower signal.",
            )
        )
        suspicious_patterns.append(
            f"Engagement rate ({engagement_rate:.2f}%) suggests ghost followers"
        )
        penalty += 30
    elif engagement_rate < 1.0:
        risk_indicators.append(
            _make_indicator(
                "Below-average engagement rate",
                "Medium",
                f"Engagement rate of {engagement_rate:.2f}% is below the healthy range.",
            )
        )
        suspicious_patterns.append("Below-average engagement rate")
        penalty += 15
    elif engagement_rate > 15.0:
        risk_indicators.append(
            _make_indicator(
                "Unusually high engagement rate",
                "High",
                f"Engagement rate of {engagement_rate:.2f}% exceeds realistic levels — "
                "possible engagement-pod or bot activity.",
            )
        )
        suspicious_patterns.append(
            f"Engagement rate ({engagement_rate:.2f}%) is suspiciously high"
        )
        penalty += 25
    elif engagement_rate > 10.0:
        risk_indicators.append(
            _make_indicator(
                "High engagement rate",
                "Medium",
                f"Engagement rate of {engagement_rate:.2f}% is above typical range — "
                "worth verifying.",
            )
        )
        penalty += 8

    # ── 3. Likes / comments ratio anomalies ─────────────────────────────
    if avg_comments > 0:
        like_comment_ratio = avg_likes / avg_comments
    else:
        like_comment_ratio = avg_likes  # no comments at all is suspicious

    if like_comment_ratio > 100:
        risk_indicators.append(
            _make_indicator(
                "Extreme likes-to-comments ratio",
                "High",
                f"Ratio of {like_comment_ratio:.0f}:1 — genuine audiences leave more "
                "comments relative to likes.",
            )
        )
        suspicious_patterns.append(
            f"Likes-to-comments ratio ({like_comment_ratio:.0f}:1) indicates purchased likes"
        )
        penalty += 20
    elif like_comment_ratio > 50:
        risk_indicators.append(
            _make_indicator(
                "High likes-to-comments ratio",
                "Medium",
                f"Ratio of {like_comment_ratio:.0f}:1 — somewhat imbalanced.",
            )
        )
        penalty += 10

    # ── 4. Comment quality heuristic ────────────────────────────────────
    comment_per_mille = avg_comments / max(followers, 1) * 1000
    if comment_per_mille < 0.05 and followers > 5000:
        risk_indicators.append(
            _make_indicator(
                "Nearly zero comment density",
                "High",
                "Comment volume is negligible relative to follower count — "
                "indicative of unengaged or fake audience.",
            )
        )
        suspicious_patterns.append("Virtually no comments despite large following")
        penalty += 15

    # ── 5. Shares sanity check ──────────────────────────────────────────
    if avg_shares > avg_likes * 0.5 and avg_likes > 0:
        risk_indicators.append(
            _make_indicator(
                "Abnormal share-to-like ratio",
                "Medium",
                f"Shares ({avg_shares:.0f}) are more than half of likes ({avg_likes:.0f})"
                " — unusual for organic content.",
            )
        )
        suspicious_patterns.append("Share count disproportionately high relative to likes")
        penalty += 10

    # ── Compute final score and risk level ──────────────────────────────
    authenticity_score = max(0.0, min(100.0, 100.0 - penalty))

    if authenticity_score >= 75:
        risk_level = "Low"
    elif authenticity_score >= 45:
        risk_level = "Medium"
    else:
        risk_level = "High"

    # If no issues found, add a positive note
    if not risk_indicators:
        risk_indicators.append(
            _make_indicator(
                "No anomalies detected",
                "None",
                "All analysed metrics fall within healthy ranges.",
            )
        )

    return {
        "authenticity_score": round(authenticity_score, 2),
        "risk_level": risk_level,
        "risk_indicators": risk_indicators,
        "suspicious_patterns": suspicious_patterns,
    }

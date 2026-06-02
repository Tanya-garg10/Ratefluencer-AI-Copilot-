"""
AI-powered content generator using Cerebras API (llama-3.3-70b).

Falls back to high-quality templates if API key is not configured.
Cerebras runs at 1000+ tokens/sec — responses are near-instant.
"""

from __future__ import annotations

import random
import logging
from typing import Any, Dict, List

from services.ai_client import chat_json, is_configured

logger = logging.getLogger(__name__)


# ════════════════════════════════════════════════════════════════════════
# CEREBRAS AI GENERATORS
# ════════════════════════════════════════════════════════════════════════

_REEL_SYSTEM = """You are a viral content strategist and expert scriptwriter.
Generate a viral short-form video reel script.
Respond ONLY with valid JSON in this exact format:
{
  "hook": "attention-grabbing opening line (1-2 sentences)",
  "script": "full 30-60 second script (150-250 words)",
  "cta": "strong call to action (1 sentence)",
  "talking_points": ["point 1", "point 2", "point 3", "point 4"]
}
Make it punchy, engaging, and optimized for maximum engagement and saves."""

_LINKEDIN_SYSTEM = """You are a LinkedIn content expert who writes viral professional posts.
Generate a LinkedIn post that gets high engagement.
Respond ONLY with valid JSON in this exact format:
{
  "hook": "compelling opening lines (2-3 lines, use line breaks)",
  "body": "main post content (200-350 words, use line breaks, emojis, bullet points)",
  "cta": "engagement call to action (1-2 sentences)",
  "hashtags": ["#Tag1", "#Tag2", "#Tag3", "#Tag4", "#Tag5"]
}
Make it insightful, story-driven, and shareable."""

_INSTAGRAM_SYSTEM = """You are an Instagram content creator who writes viral captions.
Generate an Instagram caption that drives engagement and saves.
Respond ONLY with valid JSON in this exact format:
{
  "caption": "full Instagram caption (100-200 words, use emojis, line breaks, storytelling)",
  "hashtags": ["#tag1", "#tag2", "#tag3", "#tag4", "#tag5", "#tag6", "#tag7", "#tag8", "#tag9", "#tag10"],
  "cta": "engagement CTA (1 sentence with emoji)"
}
Make it authentic, relatable, and optimized for the algorithm."""


def generate_reel_script(topic: str) -> Dict[str, Any]:
    """Generate a viral reel script using Cerebras AI or fallback template."""
    if is_configured():
        try:
            result = chat_json(
                system=_REEL_SYSTEM,
                user=f"Create a viral reel script about: {topic}",
                max_tokens=600,
                temperature=0.85,
            )
            if "hook" in result and "script" in result:
                return result
        except Exception as e:
            logger.warning(f"Cerebras reel generation failed: {e}, using template fallback")

    return _fallback_reel(topic)


def generate_linkedin_post(topic: str) -> Dict[str, Any]:
    """Generate a LinkedIn post using Cerebras AI or fallback template."""
    if is_configured():
        try:
            result = chat_json(
                system=_LINKEDIN_SYSTEM,
                user=f"Create a viral LinkedIn post about: {topic}",
                max_tokens=700,
                temperature=0.8,
            )
            if "hook" in result and "body" in result:
                return result
        except Exception as e:
            logger.warning(f"Cerebras LinkedIn generation failed: {e}, using template fallback")

    return _fallback_linkedin(topic)


def generate_instagram_content(topic: str) -> Dict[str, Any]:
    """Generate Instagram content using Cerebras AI or fallback template."""
    if is_configured():
        try:
            result = chat_json(
                system=_INSTAGRAM_SYSTEM,
                user=f"Create a viral Instagram caption about: {topic}",
                max_tokens=500,
                temperature=0.85,
            )
            if "caption" in result and "hashtags" in result:
                return result
        except Exception as e:
            logger.warning(f"Cerebras Instagram generation failed: {e}, using template fallback")

    return _fallback_instagram(topic)


# ════════════════════════════════════════════════════════════════════════
# FALLBACK TEMPLATES (used when API key not configured)
# ════════════════════════════════════════════════════════════════════════

def _topic_tag(topic: str) -> str:
    return "".join(w.capitalize() for w in topic.replace("-", " ").replace("_", " ").split())


def _fallback_reel(topic: str) -> Dict[str, Any]:
    hooks = [
        f"Stop scrolling — this will change how you think about {topic}.",
        f"I spent 100 hours researching {topic} so you don't have to.",
        f"The {topic} secret nobody talks about 👇",
        f"If you're ignoring {topic} right now, you'll regret it.",
        f"🚨 The #{topic} mistake costing you thousands.",
    ]
    scripts = [
        f"Here's the thing nobody tells you about {topic}. Most people get it completely wrong. Three shifts that changed everything for me: First, stop following the crowd — study the data. Second, go deep not wide — one area mastered. Third, build a system around {topic} instead of relying on motivation. The results speak for themselves. Save this because you'll want it later.",
        f"After going deep on {topic}, here's what I found. The top 1% all share one thing: they build foundations, not chasing trends. Five key takeaways: Start with first principles. Document everything. Find your community. Ship imperfectly. Teach what you learn. Which resonates most? Comment below.",
        f"Everyone's doing {topic} the old way. The game has changed. New playbook: Forget outdated advice. Study what works NOW. Find the gap where demand is high but supply is low. Position yourself there. I did this with {topic} and the results were incredible. The window is closing — act now.",
    ]
    ctas = [
        f"Follow for daily {topic} insights — I post breakdowns every day.",
        f"Share this with someone who needs to hear it. Link in bio for more.",
        f"Follow now — I'm dropping the full strategy this week.",
    ]
    talking_points = [
        [f"Challenge conventional thinking about {topic}", "Share a personal transformation", "Provide 3 actionable shifts", "End with a save-worthy CTA"],
        [f"Authority through research on {topic}", "Distil complexity into 5 points", "Encourage comments", "Drive traffic to long-form content"],
        [f"Create urgency around {topic}", "Position as contrarian thinker", "Tease upcoming content", "Use concrete growth metrics"],
    ]
    i = random.randint(0, 2)
    return {"hook": hooks[i], "script": scripts[i], "cta": ctas[i], "talking_points": talking_points[i]}


def _fallback_linkedin(topic: str) -> Dict[str, Any]:
    tag = _topic_tag(topic)
    templates = [
        {
            "hook": f"I've been thinking about {topic} a lot lately.\n\nHere's what most people get wrong:",
            "body": f"After working with dozens of teams on {topic}, I've noticed a pattern.\n\nThe ones that succeed share three traits:\n\n1️⃣ They start small and iterate — no big-bang launches\n2️⃣ They measure what matters, not what's easy\n3️⃣ They treat {topic} as a culture shift, not a project\n\nThe ones that fail do the opposite.\n\nThey try to boil the ocean on day one.\nThey track vanity metrics.\nThey assign it to one team and call it done.\n\nIf you're working on {topic} right now, ask yourself:\nWhich camp are you in?\n\nThe answer will determine your results 12 months from now.",
            "cta": "♻️ Repost if this resonates — someone in your network needs to hear it.",
            "hashtags": [f"#{tag}", "#Leadership", "#Innovation", "#Strategy", "#GrowthMindset"],
        },
        {
            "hook": f"Hot take: {topic} will be table stakes in 2 years.\n\nHere's how to get ahead now:",
            "body": f"Right now, understanding {topic} is a competitive advantage.\n\nIn 24 months, it'll be a minimum requirement.\n\nThe same pattern happened with social media, cloud computing, and data analytics.\n\nPhase 1: Early adopters experiment\nPhase 2: Fast followers scale\nPhase 3: Everyone else scrambles\n\nWe're between Phase 1 and 2 with {topic}.\n\nThe playbook:\n\nWeeks 1-2: Audit your current state\nWeeks 3-4: Identify 3 quick wins\nMonth 2: Build your first pilot\nMonth 3: Measure, learn, scale\n\nDon't wait for Phase 3.",
            "cta": "♻️ Repost to help your network get ahead of the curve.",
            "hashtags": [f"#{tag}", "#FutureReady", "#Innovation", "#Strategy", "#Leadership"],
        },
    ]
    return random.choice(templates)


def _fallback_instagram(topic: str) -> Dict[str, Any]:
    tag = _topic_tag(topic)
    captions = [
        f"The truth about {topic} that nobody posts about 👇\n\nIt's not glamorous. It's not instant. It's not easy.\n\nBut here's what it IS:\n✨ Rewarding when you put in the work\n✨ A skill that compounds over time\n✨ The edge that separates the top 1%\n\nThe biggest lesson from years in {topic}?\n\nShow up on the days you don't feel like it.\nThat's where the magic happens.\n\nDouble tap if you needed this reminder 💪",
        f"5 things I wish I knew before starting with {topic} ⚡\n\n1. You don't need to know everything to start\n2. The community is more helpful than you think\n3. Consistency > perfection (always)\n4. Your first attempt will be terrible — that's okay\n5. The best time to start was yesterday\n\nTag someone who needs to hear this 🏷️",
        f"Day 1 vs Day 365 of {topic} 📈\n\nDay 1: 'I have no idea what I'm doing'\nDay 90: 'Wait, this is actually working?'\nDay 180: 'I can't believe I almost quit'\nDay 365: 'This changed everything'\n\nThe timeline is different for everyone.\nBut the pattern is always the same.\n\nWhich day are you on? Comment below 👇",
    ]
    hashtag_sets = [
        [f"#{tag}", "#Motivation", "#GrowthMindset", "#DailyHustle", "#Success", "#Mindset", "#Goals", "#Inspiration", "#CreatorLife", "#NeverSettle"],
        [f"#{tag}", "#LessonsLearned", "#BeginnerTips", "#StartNow", "#GrowthJourney", "#RealTalk", "#LevelUp", "#SelfImprovement", "#Community", "#Trending"],
        [f"#{tag}", "#TransformationJourney", "#PersonalGrowth", "#Consistency", "#Journey", "#ProgressNotPerfection", "#DailyProgress", "#KeepGoing", "#Mindset", "#Goals"],
    ]
    ctas = [
        f"Save this for the days you need a push 🔖",
        f"Share with a friend who needs this today 📌",
        f"Follow for daily {topic} insights 🚀",
    ]
    i = random.randint(0, 2)
    return {"caption": captions[i], "hashtags": hashtag_sets[i], "cta": ctas[i]}

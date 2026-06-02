const BASE_URL = 'http://localhost:8001/api';

export interface InfluencerInput {
  name: string;
  followers: number;
  following: number;
  avg_likes: number;
  avg_comments: number;
  avg_shares: number;
  avg_saves: number;
  posting_frequency: number;
  category: string;
}

export interface InfluencerAnalysis {
  id?: number;
  name: string;
  category: string;
  followers?: number;
  following?: number;
  avg_likes?: number;
  avg_comments?: number;
  avg_shares?: number;
  avg_saves?: number;
  posting_frequency?: number;
  engagement_rate: number;
  authenticity_score: number;
  growth_potential: number;
  brand_match_score: number;
  ratefluencer_score: number;
  fake_detection: {
    risk_level: string;
    authenticity_score: number;
    risk_indicators: { indicator: string; severity: string; details: string }[];
    suspicious_patterns: string[];
  };
  brand_matches: { brand_name: string; match_percentage: number; reasoning: string }[];
  created_at?: string;
}

export interface BrandMatchInput {
  category: string;
  engagement_rate: number;
  authenticity_score: number;
}

export interface BrandMatch {
  brand_name: string;
  match_percentage: number;
  reasoning: string;
}

export interface ViralityInput {
  topic: string;
  followers: number;
  engagement_rate: number;
  content_type: 'reel' | 'linkedin' | 'instagram';
}

export interface ViralityPrediction {
  virality_score: number;
  expected_reach: number;
  expected_likes: number;
  expected_shares: number;
  expected_saves: number;
}

export interface AdminDashboard {
  total_influencers: number;
  average_score: number;
  content_generated: number;
  active_trends: number;
  recent_analyses: { name: string; category: string; ratefluencer_score: number; date: string }[];
  score_distribution: { range: string; count: number }[];
  category_breakdown: { category: string; count: number }[];
  top_trends: { topic: string; score: number }[];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyJson = any;

async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      headers: { 'Content-Type': 'application/json' },
      ...options,
    });
    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    if (error instanceof Error) throw error;
    throw new Error('An unexpected error occurred');
  }
}

export async function analyzeInfluencer(data: InfluencerInput): Promise<InfluencerAnalysis> {
  return fetchApi<InfluencerAnalysis>('/influencer/analyze', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function getInfluencers(): Promise<InfluencerAnalysis[]> {
  return fetchApi<InfluencerAnalysis[]>('/influencer/list');
}

export async function matchBrands(data: BrandMatchInput): Promise<BrandMatch[]> {
  return fetchApi<BrandMatch[]>('/brands/match', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function getTrends(category?: string): Promise<AnyJson[]> {
  const endpoint = category ? `/trends/${category}` : '/trends';
  return fetchApi<AnyJson[]>(endpoint);
}

export async function generateReel(data: { topic: string }): Promise<AnyJson> {
  const resp = await fetchApi<AnyJson>('/content/reel', {
    method: 'POST',
    body: JSON.stringify({ topic: data.topic, content_type: 'reel' }),
  });
  // Backend returns { id, content_type, topic, content: {...}, created_at }
  return resp?.content ?? resp;
}

export async function generateLinkedin(data: { topic: string }): Promise<AnyJson> {
  const resp = await fetchApi<AnyJson>('/content/linkedin', {
    method: 'POST',
    body: JSON.stringify({ topic: data.topic, content_type: 'linkedin' }),
  });
  return resp?.content ?? resp;
}

export async function generateInstagram(data: { topic: string }): Promise<AnyJson> {
  const resp = await fetchApi<AnyJson>('/content/instagram', {
    method: 'POST',
    body: JSON.stringify({ topic: data.topic, content_type: 'instagram' }),
  });
  return resp?.content ?? resp;
}

export async function predictVirality(data: ViralityInput): Promise<ViralityPrediction> {
  return fetchApi<ViralityPrediction>('/content/virality', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function getAdminDashboard(): Promise<AdminDashboard> {
  const raw = await fetchApi<AnyJson>('/admin/dashboard');
  return {
    total_influencers: raw.total_influencers ?? 0,
    average_score: raw.avg_score ?? raw.average_score ?? 0,
    content_generated: raw.content_count ?? raw.content_generated ?? 0,
    active_trends: (raw.top_trends?.length) ?? raw.active_trends ?? 0,
    recent_analyses: (raw.recent_analyses ?? []).map((a: AnyJson) => ({
      name: a.name,
      category: a.category,
      ratefluencer_score: a.ratefluencer_score ?? 0,
      date: a.created_at ?? '',
    })),
    score_distribution: raw.score_distribution ?? [],
    category_breakdown: raw.category_breakdown ?? [],
    top_trends: (raw.top_trends ?? []).map((t: AnyJson) => ({
      topic: t.topic,
      score: t.trend_score ?? 0,
    })),
  };
}

import Parser from 'rss-parser';

const parser = new Parser({
  timeout: 10000,
  headers: {
    'User-Agent': 'MetaHers-Mind-Spa/1.0'
  }
});

export type NewsCategory = "AI" | "Crypto" | "NFT" | "Blockchain" | "Metaverse" | "Social";

export interface RawNewsItem {
  id: string;
  title: string;
  summary: string;
  category: NewsCategory;
  date: string;
  link: string;
  source: string;
}

// RSS Feed sources for different categories
const RSS_FEEDS: Record<NewsCategory, string[]> = {
  "AI": [
    "https://techcrunch.com/category/artificial-intelligence/feed/",
    "https://www.artificialintelligence-news.com/feed/",
  ],
  "Crypto": [
    "https://cointelegraph.com/rss",
    "https://www.coindesk.com/arc/outboundfeeds/rss/",
  ],
  "Blockchain": [
    "https://www.coindesk.com/arc/outboundfeeds/rss/",
    "https://cointelegraph.com/rss/tag/blockchain",
  ],
  "NFT": [
    "https://nftplazas.com/feed/",
    "https://cointelegraph.com/rss/tag/nft",
  ],
  "Metaverse": [
    "https://cointelegraph.com/rss/tag/metaverse",
  ],
  "Social": [
    "https://techcrunch.com/category/social/feed/",
  ],
};

// Simple in-memory cache with TTL
interface CacheEntry {
  data: RawNewsItem[];
  timestamp: number;
}

const cache: Map<string, CacheEntry> = new Map();
const CACHE_TTL = 30 * 60 * 1000; // 30 minutes

function getCacheKey(category?: NewsCategory): string {
  return category || 'all';
}

function isCacheValid(entry: CacheEntry): boolean {
  return Date.now() - entry.timestamp < CACHE_TTL;
}

async function fetchFeed(url: string, category: NewsCategory): Promise<RawNewsItem[]> {
  try {
    const feed = await parser.parseURL(url);
    const sourceName = feed.title || url;
    
    return feed.items.slice(0, 5).map((item, index) => {
      const pubDate = item.pubDate ? new Date(item.pubDate) : new Date();
      return {
        id: `${category.toLowerCase()}-${Date.now()}-${index}`,
        title: item.title || 'Untitled',
        summary: item.contentSnippet || item.content?.substring(0, 300) || 'No summary available',
        category,
        date: pubDate.toISOString().split('T')[0],
        link: item.link || '',
        source: sourceName,
      };
    });
  } catch (error) {
    console.error(`Failed to fetch RSS feed ${url}:`, error);
    return [];
  }
}

export async function fetchNewsByCategory(category?: NewsCategory): Promise<RawNewsItem[]> {
  const cacheKey = getCacheKey(category);
  
  // Check cache first
  const cached = cache.get(cacheKey);
  if (cached && isCacheValid(cached)) {
    console.log(`[RSS] Returning cached news for ${cacheKey}`);
    return cached.data;
  }

  console.log(`[RSS] Fetching fresh news for ${cacheKey}`);
  
  let allNews: RawNewsItem[] = [];
  
  if (category) {
    // Fetch specific category
    const feeds = RSS_FEEDS[category] || [];
    const results = await Promise.all(
      feeds.map(url => fetchFeed(url, category))
    );
    allNews = results.flat();
  } else {
    // Fetch all categories
    const categories: NewsCategory[] = ["AI", "Crypto", "Blockchain", "NFT", "Metaverse", "Social"];
    const results = await Promise.all(
      categories.flatMap(cat => 
        (RSS_FEEDS[cat] || []).map(url => fetchFeed(url, cat))
      )
    );
    allNews = results.flat();
  }

  // Sort by date (newest first)
  allNews.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  // Take top 20 items
  const topNews = allNews.slice(0, 20);
  
  // Cache the results
  cache.set(cacheKey, {
    data: topNews,
    timestamp: Date.now(),
  });
  
  return topNews;
}

// Clear cache manually if needed
export function clearNewsCache(): void {
  cache.clear();
  console.log('[RSS] Cache cleared');
}

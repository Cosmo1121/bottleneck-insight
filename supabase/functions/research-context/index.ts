import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// Free, public RSS feeds organized by category
const RSS_FEEDS = [
  // Macro / General Financial
  { name: "Reuters Business", url: "https://feeds.reuters.com/reuters/businessNews" },
  { name: "CNBC Economy", url: "https://search.cnbc.com/rs/search/combinedcms/view.xml?partnerId=wrss01&id=20910258" },
  { name: "Reuters Commodities", url: "https://feeds.reuters.com/reuters/commoditiesNews" },
  // Energy
  { name: "EIA Today in Energy", url: "https://www.eia.gov/todayinenergy/rss.xml" },
  { name: "Oilprice.com", url: "https://oilprice.com/rss/main" },
  // Nuclear / Uranium
  { name: "World Nuclear News", url: "https://www.world-nuclear-news.org/rss" },
  { name: "Uranium Insider", url: "https://www.uraniuminvestingnews.com/feed" },
  // Mining / Metals / Rare Earths
  { name: "Mining.com", url: "https://www.mining.com/feed/" },
  { name: "Lithium Investing News", url: "https://www.lithiuminvestingnews.com/feed" },
  { name: "Rare Earth Investing News", url: "https://www.rareearthinvestingnews.com/feed" },
  { name: "Copper Investing News", url: "https://www.copperinvestingnews.com/feed" },
  { name: "Nickel Investing News", url: "https://www.nickelinvestingnews.com/feed" },
  // Semiconductors / Tech Supply Chain
  { name: "SemiAnalysis", url: "https://www.semianalysis.com/feed" },
  { name: "Tom's Hardware", url: "https://www.tomshardware.com/feeds/all" },
  // Agriculture / Soft Commodities
  { name: "AgWeb", url: "https://www.agweb.com/rss/news" },
];

interface FeedItem {
  title: string;
  link: string;
  pubDate: string;
  source: string;
}

/** Simple XML tag extractor (no deps needed) */
function extractTag(xml: string, tag: string): string {
  const re = new RegExp(`<${tag}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]></${tag}>|<${tag}[^>]*>([\\s\\S]*?)</${tag}>`);
  const m = xml.match(re);
  return (m?.[1] ?? m?.[2] ?? "").trim();
}

/** Parse RSS XML into items */
function parseRSS(xml: string, sourceName: string): FeedItem[] {
  const items: FeedItem[] = [];
  const itemBlocks = xml.split(/<item[\s>]/i).slice(1);
  for (const block of itemBlocks.slice(0, 20)) {
    const title = extractTag(block, "title");
    const link = extractTag(block, "link");
    const pubDate = extractTag(block, "pubDate");
    if (title) items.push({ title, link, pubDate, source: sourceName });
  }
  return items;
}

/** Score relevance of a headline to a theme (simple keyword matching) */
function relevanceScore(item: FeedItem, keywords: string[]): number {
  const text = (item.title).toLowerCase();
  let score = 0;
  for (const kw of keywords) {
    if (text.includes(kw)) score += 1;
  }
  return score;
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { theme, custom_feeds } = await req.json();
    if (!theme) {
      return new Response(JSON.stringify({ error: "theme is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Merge built-in feeds with user-provided custom feeds
    const customFeedList = Array.isArray(custom_feeds)
      ? custom_feeds
          .filter((f: any) => f?.url && typeof f.url === "string")
          .map((f: any) => ({ name: String(f.name || new URL(f.url).hostname), url: String(f.url) }))
      : [];
    const allFeeds = [...RSS_FEEDS, ...customFeedList];

    // Build keyword list from theme
    const keywords = theme
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, "")
      .split(/\s+/)
      .filter((w: string) => w.length > 2);

    // Fetch all RSS feeds in parallel (with timeout)
    let feedsSucceeded = 0;
    const feedPromises = allFeeds.map(async (feed) => {
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 8000);
        const resp = await fetch(feed.url, {
          signal: controller.signal,
          headers: { "User-Agent": "ScarcityScout/1.0 (RSS Reader)" },
        });
        clearTimeout(timeout);
        if (!resp.ok) return [];
        const xml = await resp.text();
        const items = parseRSS(xml, feed.name);
        if (items.length > 0) feedsSucceeded++;
        return items;
      } catch {
        return [];
      }
    });

    const feedResults = await Promise.all(feedPromises);
    const allItems = feedResults.flat();

    // Score and rank by relevance to theme
    const scored = allItems
      .map((item) => ({ ...item, score: relevanceScore(item, keywords) }))
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 15);

    // Also include most recent items regardless of relevance (for macro context)
    const recentItems = allItems
      .filter((item) => {
        try {
          const d = new Date(item.pubDate);
          return Date.now() - d.getTime() < 7 * 24 * 60 * 60 * 1000; // last 7 days
        } catch {
          return false;
        }
      })
      .slice(0, 10);

    // Deduplicate
    const seen = new Set(scored.map((i) => i.link));
    const additional = recentItems.filter((i) => !seen.has(i.link)).slice(0, 5);

    const context = {
      theme,
      fetched_at: new Date().toISOString(),
      relevant_headlines: scored.map(({ title, link, pubDate, source }) => ({
        title,
        link,
        date: pubDate,
        source,
      })),
      recent_market_headlines: additional.map(({ title, link, pubDate, source }) => ({
        title,
        link,
        date: pubDate,
        source,
      })),
      feeds_checked: RSS_FEEDS.length,
      feeds_responded: feedsSucceeded,
      total_articles_scanned: allItems.length,
    };

    return new Response(JSON.stringify(context), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("research-context error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

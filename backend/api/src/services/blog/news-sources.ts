// ─── Real-Time News Sources with Retry Logic ────────────────────────────────
import Parser from 'rss-parser';
import { isTechRelated } from './blog-categories';

const rssParser = new Parser();

/** Retry wrapper with exponential backoff */
async function withRetry<T>(fn: () => Promise<T>, retries = 2, delayMs = 1000): Promise<T> {
    for (let attempt = 0; attempt <= retries; attempt++) {
        try {
            return await fn();
        } catch (err) {
            if (attempt === retries) throw err;
            console.warn(`   ⟳ Retry ${attempt + 1}/${retries} after ${delayMs}ms...`);
            await new Promise(r => setTimeout(r, delayMs * (attempt + 1)));
        }
    }
    throw new Error('Unreachable');
}

/** RSS feed configuration */
const RSS_SOURCES = [
    { name: 'Google Trends', url: 'https://trends.google.com/trending/rss?geo=US', filterTech: true, limit: 10 },
    { name: 'TechCrunch', url: 'https://techcrunch.com/feed/', filterTech: false, limit: 5 },
    { name: 'The Verge', url: 'https://www.theverge.com/rss/index.xml', filterTech: false, limit: 5 },
    { name: 'Ars Technica', url: 'https://feeds.arstechnica.com/arstechnica/index', filterTech: false, limit: 5 },
    { name: 'Wired', url: 'https://www.wired.com/feed/rss', filterTech: false, limit: 4 },
    { name: 'Engadget', url: 'https://www.engadget.com/rss.xml', filterTech: false, limit: 4 },
];

/** Fetch headlines from a single RSS feed with retry */
async function fetchRSSHeadlines(source: typeof RSS_SOURCES[number]): Promise<string[]> {
    try {
        const feed = await withRetry(() => rssParser.parseURL(source.url));
        let titles = feed.items
            .slice(0, source.limit)
            .map(i => i.title)
            .filter(Boolean) as string[];

        if (source.filterTech) {
            const allCount = titles.length;
            titles = titles.filter(isTechRelated);
            console.log(`   📈 ${source.name}: ${titles.length} tech topics (filtered from ${allCount} total)`);
        } else {
            console.log(`   📰 ${source.name}: ${titles.length} headlines`);
        }
        return titles;
    } catch (e) {
        console.warn(`   ⚠️ ${source.name} RSS failed:`, (e as Error).message);
        return [];
    }
}

/** Fetch from HackerNews top stories API */
async function fetchHackerNewsHeadlines(): Promise<string[]> {
    try {
        const hnResponse = await withRetry(() => fetch('https://hacker-news.firebaseio.com/v0/topstories.json'));
        if (!hnResponse.ok) return [];

        const hnIds = ((await hnResponse.json()) as number[]).slice(0, 8);
        const hnStories = await Promise.all(
            hnIds.map(id =>
                fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`)
                    .then(r => r.json())
                    .catch(() => null)
            )
        );
        const hnTitles = hnStories
            .filter(s => s && s.title && s.score > 50)
            .map(s => s.title as string);
        console.log(`   🟠 HackerNews: ${hnTitles.length} trending stories`);
        return hnTitles;
    } catch (e) {
        console.warn('   ⚠️ HackerNews API failed:', (e as Error).message);
        return [];
    }
}

/** Fetch from NewsAPI.org (if NEWSAPI_KEY is set) */
async function fetchNewsAPIHeadlines(): Promise<string[]> {
    const apiKey = process.env.NEWSAPI_KEY;
    if (!apiKey) return [];

    try {
        const response = await withRetry(() =>
            fetch(`https://newsapi.org/v2/top-headlines?category=technology&language=en&pageSize=10&apiKey=${apiKey}`)
        );
        if (!response.ok) {
            console.warn(`   ⚠️ NewsAPI returned ${response.status}`);
            return [];
        }
        const data = await response.json();
        const titles = (data.articles || [])
            .map((a: any) => a.title)
            .filter(Boolean) as string[];
        console.log(`   📡 NewsAPI: ${titles.length} tech headlines`);
        return titles;
    } catch (e) {
        console.warn('   ⚠️ NewsAPI failed:', (e as Error).message);
        return [];
    }
}

/** Fetches live trends from all configured sources in parallel */
export async function getRealtimeTrends(): Promise<string[]> {
    try {
        console.log('🔥 Fetching real-time trends from all sources...');

        // Fetch from all sources in parallel
        const [rssResults, hnResults, newsApiResults] = await Promise.all([
            Promise.all(RSS_SOURCES.map(fetchRSSHeadlines)),
            fetchHackerNewsHeadlines(),
            fetchNewsAPIHeadlines(),
        ]);

        const results = [
            ...rssResults.flat(),
            ...hnResults,
            ...newsApiResults,
        ];

        // Deduplicate by lowercase similarity
        const seen = new Set<string>();
        const deduped = results.filter(title => {
            const key = title.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim();
            if (seen.has(key)) return false;
            seen.add(key);
            return true;
        });

        if (deduped.length > 0) {
            console.log(`   🔥 Total unique live trends: ${deduped.length} (from ${results.length} raw)`);
            return deduped;
        }

        console.warn('   ⚠️ All trend sources failed, falling back to static categories');
        return [];
    } catch (e) {
        console.warn('⚠️ Trend fetching failed entirely, using static categories');
        return [];
    }
}

// ─── Categories (specific & timely) ─────────────────────────────────────────

export const TECH_CATEGORIES = [
    // AI & ML — specific topics
    'Latest AI model releases and benchmarks (GPT, Claude, Gemini, Llama)',
    'AI coding assistants — Copilot, Cursor, Claude Code, Windsurf',
    'Open-source AI models and local LLM running (Ollama, vLLM)',
    'AI agents, MCP servers, and tool-use frameworks',
    'AI image/video generation — Midjourney, Sora, Flux, Stable Diffusion',
    'AI regulation, safety, and alignment research',
    // Dev tools & frameworks
    'JavaScript/TypeScript framework wars — React, Next.js, SolidJS, Svelte, Astro',
    'Rust, Go, Zig — systems programming language trends',
    'Developer tools and productivity — editors, terminals, CLI tools',
    'Cloud platforms and serverless — AWS, Vercel, Cloudflare, Fly.io',
    'Database trends — Postgres, SQLite, Turso, Neon, Supabase',
    'Web platform APIs — new browser features, WebGPU, WASM',
    // Cybersecurity
    'Major security breaches and vulnerability disclosures',
    'Zero-day exploits, ransomware attacks, and nation-state hacking',
    // Hardware & gadgets
    'Apple — latest iPhone, iPad, Mac, Vision Pro, iOS updates',
    'Samsung — Galaxy, foldables, One UI, Unpacked announcements',
    'Google — Pixel, Android, Gemini AI, Search updates',
    'Microsoft — Windows, Copilot, Surface, Xbox',
    'NVIDIA, AMD, Intel — GPU launches, AI chips, benchmarks',
    'Latest smartphone launches and comparisons',
    'Wearables — smartwatches, AR glasses, health tech',
    'Laptop and PC hardware reviews and buying guides',
    // Industry
    'Tech startup funding rounds, acquisitions, and IPOs',
    'Big tech earnings, layoffs, and strategy shifts',
    'Social media platform changes — X, Meta, TikTok, Threads, Bluesky',
    'Gaming industry — new releases, console wars, game engines',
    'Cryptocurrency, blockchain, and Web3 developments',
];

export const NON_TECH_CATEGORIES = [
    'Space exploration — SpaceX, NASA, ESA, Mars missions, Artemis',
    'Electric vehicles and autonomous driving — Tesla, Rivian, Waymo',
    'Climate tech, renewable energy, and sustainability innovations',
    'Biotech, gene editing, and health technology breakthroughs',
    'Education technology and the future of online learning',
    'Fintech, digital banking, and payment innovations',
    'Entertainment streaming wars — Netflix, Disney+, Apple TV+',
    'Remote work culture, productivity tools, and digital nomad trends',
    'Science discoveries — physics, biology, neuroscience breakthroughs',
    'Robotics and automation in everyday life',
    'Smart home tech and IoT innovations',
    'Food tech, lab-grown meat, and agricultural innovation',
];

// Review-specific topics (for 'review' blog type)
export const REVIEW_TOPICS = [
    'Latest NVIDIA GeForce RTX GPU',
    'Latest AMD Radeon RX GPU',
    'Latest Apple MacBook Pro or MacBook Air',
    'Latest Samsung Galaxy S flagship phone',
    'Latest Google Pixel phone',
    'Latest Apple iPhone',
    'Latest iPad Pro or iPad Air',
    'Latest gaming laptop from ASUS, MSI, or Razer',
    'Latest wireless earbuds — AirPods, Galaxy Buds, Sony',
    'Latest smartwatch — Apple Watch, Galaxy Watch, Garmin',
    'Latest AI coding tool — Cursor, Windsurf, GitHub Copilot',
    'Latest mechanical keyboard for developers',
    'Latest monitor for programming and gaming',
    'Latest cloud hosting platform comparison',
    'Latest JavaScript meta-framework comparison',
];

// ─── Tech Keyword Filter for Trends ─────────────────────────────────────────

const TECH_KEYWORDS = [
    // Hardware & devices
    'iphone', 'ipad', 'macbook', 'apple', 'samsung', 'galaxy', 'pixel', 'google',
    'nvidia', 'amd', 'intel', 'rtx', 'gpu', 'cpu', 'chip', 'processor', 'laptop',
    'phone', 'tablet', 'watch', 'airpods', 'headset', 'vr', 'ar', 'quest',
    // Software & platforms
    'ai', 'chatgpt', 'openai', 'gemini', 'claude', 'copilot', 'gpt', 'llm',
    'android', 'ios', 'windows', 'linux', 'macos', 'chrome', 'firefox', 'safari',
    'app', 'software', 'update', 'release', 'beta', 'api', 'cloud', 'aws', 'azure',
    // Companies
    'microsoft', 'meta', 'amazon', 'tesla', 'spacex', 'twitter', 'x.com',
    'tiktok', 'netflix', 'spotify', 'uber', 'stripe', 'shopify', 'discord',
    'steam', 'epic', 'playstation', 'xbox', 'nintendo', 'valve',
    // Dev & engineering
    'programming', 'developer', 'code', 'coding', 'github', 'rust', 'python',
    'javascript', 'typescript', 'react', 'node', 'docker', 'kubernetes',
    'database', 'sql', 'open source', 'framework', 'compiler', 'turing',
    // Tech topics
    'cyber', 'hack', 'breach', 'security', 'privacy', 'encryption', 'bitcoin',
    'crypto', 'blockchain', 'nft', 'web3', 'startup', 'funding', 'ipo',
    'robot', 'autonomous', 'self-driving', 'ev', 'electric vehicle', 'battery',
    'quantum', 'satellite', 'broadband', '5g', '6g', 'wifi', 'fiber',
    'data', 'algorithm', 'machine learning', 'neural', 'model', 'tech',
    'digital', 'semiconductor', 'silicon', 'display', 'oled', 'sensor',
];

export function isTechRelated(title: string): boolean {
    const lower = title.toLowerCase();
    return TECH_KEYWORDS.some(kw => lower.includes(kw));
}

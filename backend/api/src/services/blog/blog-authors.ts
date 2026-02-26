// ─── Author Personas with Writing Quirks ────────────────────────────────────

export interface AuthorQuirks {
    sentenceStyle: 'short-punchy' | 'flowing' | 'technical' | 'conversational';
    favoriteTransitions: string[];
    emojiFrequency: 'none' | 'low' | 'medium';
    parentheticalFrequency: 'low' | 'medium' | 'high';
    contractionRate: number; // 0.0 to 1.0, higher = more contractions
    personalCatchphrases: string[];
    introStyle: 'anecdote' | 'question' | 'data-point' | 'scene-setting' | 'contrarian';
}

export interface AuthorPersona {
    name: string;
    bio: string;
    beats: string[];
    quirks: AuthorQuirks;
}

export const AUTHOR_PERSONAS: AuthorPersona[] = [
    {
        name: 'Alex Chen',
        bio: 'Senior systems engineer, ex-Google. Focuses on infrastructure, databases, and backend performance.',
        beats: ['cloud', 'databases', 'backend', 'devops'],
        quirks: {
            sentenceStyle: 'short-punchy',
            favoriteTransitions: ['Look,', 'Here\'s the thing.', 'Let me be direct:'],
            emojiFrequency: 'none',
            parentheticalFrequency: 'high',
            contractionRate: 0.9,
            personalCatchphrases: ['In my experience,', 'I\'ve seen this pattern before —', 'After years of debugging production fires,'],
            introStyle: 'contrarian',
        },
    },
    {
        name: 'Sarah Mitchell',
        bio: 'Former Apple engineer turned tech journalist. Covers hardware, chips, and product design.',
        beats: ['apple', 'hardware', 'reviews', 'design'],
        quirks: {
            sentenceStyle: 'flowing',
            favoriteTransitions: ['The thing is,', 'What stands out here:', 'I keep coming back to'],
            emojiFrequency: 'low',
            parentheticalFrequency: 'medium',
            contractionRate: 0.85,
            personalCatchphrases: ['Having spent years at Apple,', 'From a design perspective,', 'What most reviewers miss is'],
            introStyle: 'scene-setting',
        },
    },
    {
        name: 'James Rodriguez',
        bio: 'AI researcher and indie hacker. Writes about ML models, AI tools, and building with LLMs.',
        beats: ['ai', 'machine-learning', 'llm', 'coding-assistants'],
        quirks: {
            sentenceStyle: 'technical',
            favoriteTransitions: ['So here\'s what happened:', 'The numbers don\'t lie:', 'I ran the benchmarks myself —'],
            emojiFrequency: 'medium',
            parentheticalFrequency: 'high',
            contractionRate: 0.8,
            personalCatchphrases: ['I\'ve been building with LLMs since GPT-2,', 'As someone who trains models daily,', 'My GPU bill disagrees —'],
            introStyle: 'data-point',
        },
    },
    {
        name: 'Priya Sharma',
        bio: 'Full-stack dev and open-source contributor. Specializes in JavaScript frameworks and web platform.',
        beats: ['javascript', 'frameworks', 'web', 'frontend'],
        quirks: {
            sentenceStyle: 'conversational',
            favoriteTransitions: ['Okay, real talk:', 'But wait — ', 'Here\'s what nobody tells you:'],
            emojiFrequency: 'low',
            parentheticalFrequency: 'high',
            contractionRate: 0.95,
            personalCatchphrases: ['I\'ve shipped apps in every major framework,', 'My open-source work taught me that', 'After maintaining a 50K-star repo,'],
            introStyle: 'question',
        },
    },
    {
        name: 'Michael Torres',
        bio: 'Cybersecurity analyst and CTF player. Covers security breaches, exploits, and privacy.',
        beats: ['security', 'privacy', 'hacking', 'exploits'],
        quirks: {
            sentenceStyle: 'short-punchy',
            favoriteTransitions: ['Make no mistake:', 'The timeline matters here.', 'This is where it gets interesting:'],
            emojiFrequency: 'none',
            parentheticalFrequency: 'low',
            contractionRate: 0.75,
            personalCatchphrases: ['I\'ve analyzed hundreds of breach reports,', 'In the CTF community,', 'The attack surface is bigger than you think —'],
            introStyle: 'scene-setting',
        },
    },
    {
        name: 'Emma Wilson',
        bio: 'Tech policy reporter. Covers regulation, antitrust, startup funding, and industry strategy.',
        beats: ['policy', 'startups', 'business', 'regulation'],
        quirks: {
            sentenceStyle: 'flowing',
            favoriteTransitions: ['Follow the money:', 'The real story is:', 'What the press release doesn\'t say:'],
            emojiFrequency: 'none',
            parentheticalFrequency: 'medium',
            contractionRate: 0.7,
            personalCatchphrases: ['I\'ve covered tech antitrust for a decade,', 'Sources tell me', 'Three things about this deal:'],
            introStyle: 'data-point',
        },
    },
    {
        name: 'David Kim',
        bio: 'GPU enthusiast and game developer. Reviews graphics cards, gaming hardware, and engines.',
        beats: ['gpu', 'gaming', 'hardware', 'benchmarks'],
        quirks: {
            sentenceStyle: 'conversational',
            favoriteTransitions: ['Numbers time:', 'This blew me away:', 'For context —'],
            emojiFrequency: 'medium',
            parentheticalFrequency: 'medium',
            contractionRate: 0.9,
            personalCatchphrases: ['I\'ve tested every GPU launch for the past 5 years,', 'My test bench says otherwise —', 'After running 20+ benchmarks,'],
            introStyle: 'anecdote',
        },
    },
    {
        name: 'Olivia Park',
        bio: 'Climate tech researcher and science writer. Covers EVs, space, biotech, and sustainability.',
        beats: ['climate', 'space', 'biotech', 'science'],
        quirks: {
            sentenceStyle: 'flowing',
            favoriteTransitions: ['The data tells a different story:', 'Consider this:', 'What the headlines miss:'],
            emojiFrequency: 'low',
            parentheticalFrequency: 'medium',
            contractionRate: 0.8,
            personalCatchphrases: ['As a climate researcher,', 'I\'ve visited these facilities firsthand —', 'The peer-reviewed data shows'],
            introStyle: 'data-point',
        },
    },
    {
        name: 'Ryan Cooper',
        bio: 'DevTools addict and productivity nerd. Reviews dev tools, editors, and workflow optimizations.',
        beats: ['devtools', 'productivity', 'editors', 'cli'],
        quirks: {
            sentenceStyle: 'short-punchy',
            favoriteTransitions: ['Hot take:', 'Real quick —', 'I timed it:'],
            emojiFrequency: 'medium',
            parentheticalFrequency: 'high',
            contractionRate: 0.95,
            personalCatchphrases: ['I switch tools constantly — it\'s a problem,', 'After testing 30+ alternatives,', 'My dotfiles have opinions:'],
            introStyle: 'anecdote',
        },
    },
    {
        name: 'Maya Patel',
        bio: 'Mobile dev and wearables geek. Covers smartphones, tablets, wearables, and mobile OS updates.',
        beats: ['mobile', 'android', 'ios', 'wearables'],
        quirks: {
            sentenceStyle: 'conversational',
            favoriteTransitions: ['Full disclosure:', 'I carry two phones daily —', 'The real-world experience:'],
            emojiFrequency: 'low',
            parentheticalFrequency: 'medium',
            contractionRate: 0.85,
            personalCatchphrases: ['I\'ve daily-driven every flagship this year,', 'As someone who develops for both platforms,', 'Battery life doesn\'t lie —'],
            introStyle: 'question',
        },
    },
];

export function pickAuthor(topic: string): AuthorPersona {
    const topicLower = topic.toLowerCase();
    // Try to match author by their beat
    const matched = AUTHOR_PERSONAS.filter(a => a.beats.some(b => topicLower.includes(b)));
    if (matched.length > 0) return matched[Math.floor(Math.random() * matched.length)];
    return AUTHOR_PERSONAS[Math.floor(Math.random() * AUTHOR_PERSONAS.length)];
}

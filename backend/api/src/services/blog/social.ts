// ─── Social Media Syndication ───────────────────────────────────────────────

/**
 * Feature 5: Automated Social Media & Newsletter Syndication
 * Posts to Twitter/X and LinkedIn via their APIs.
 */
export async function syndicateToSocialMedia(blogPost: {
    title: string;
    slug: string;
    socialMediaPosts: any;
}) {
    const siteUrl = process.env.SITE_URL || 'https://yourdomain.com';
    const blogUrl = `${siteUrl}/blog/${blogPost.slug}`;
    const social = blogPost.socialMediaPosts;

    if (!social) return;

    // ─── Twitter/X API ──────────────────────────────────────────────────
    if (process.env.TWITTER_BEARER_TOKEN && social.twitterThread) {
        try {
            console.log('🐦 Posting Twitter thread...');
            let lastTweetId: string | null = null;

            for (const tweet of social.twitterThread) {
                const tweetText = tweet.replace('[LINK]', blogUrl);
                const body: any = { text: tweetText };
                if (lastTweetId) {
                    body.reply = { in_reply_to_tweet_id: lastTweetId };
                }

                const res = await fetch('https://api.twitter.com/2/tweets', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${process.env.TWITTER_BEARER_TOKEN}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(body),
                });

                if (res.ok) {
                    const data = await res.json();
                    lastTweetId = data.data?.id;
                }
            }
            console.log('✅ Twitter thread posted');
        } catch (err) {
            console.error('⚠️ Twitter posting failed:', err);
        }
    }

    // ─── LinkedIn API ───────────────────────────────────────────────────
    if (process.env.LINKEDIN_ACCESS_TOKEN && social.linkedInPost) {
        try {
            console.log('💼 Posting to LinkedIn...');
            const postText = social.linkedInPost.replace('[LINK]', blogUrl);

            await fetch('https://api.linkedin.com/v2/ugcPosts', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${process.env.LINKEDIN_ACCESS_TOKEN}`,
                    'Content-Type': 'application/json',
                    'X-Restli-Protocol-Version': '2.0.0',
                },
                body: JSON.stringify({
                    author: `urn:li:person:${process.env.LINKEDIN_PERSON_ID}`,
                    lifecycleState: 'PUBLISHED',
                    specificContent: {
                        'com.linkedin.ugc.ShareContent': {
                            shareCommentary: { text: postText },
                            shareMediaCategory: 'ARTICLE',
                            media: [{
                                status: 'READY',
                                originalUrl: blogUrl,
                            }],
                        },
                    },
                    visibility: {
                        'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC',
                    },
                }),
            });
            console.log('✅ LinkedIn post published');
        } catch (err) {
            console.error('⚠️ LinkedIn posting failed:', err);
        }
    }
}

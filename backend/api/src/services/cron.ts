import cron from 'node-cron';
import { generateAndPublishBlog } from './blog-generator';
import { flushViewCounts, cleanupOldViews } from '../lib/view-tracker';

export function setupCronJobs() {
    console.log('Setting up cron jobs...');

    // Morning batch — 7:00 AM (tech focus)
    cron.schedule('0 7 * * *', async () => {
        console.log('🌅 Running morning blog generation (7:00 AM — tech)...');
        try {
            await generateAndPublishBlog('tech');
        } catch (error) {
            console.error('Failed morning blog generation:', error);
        }
    });

    // Afternoon batch — 1:00 PM (non-tech focus)
    cron.schedule('0 13 * * *', async () => {
        console.log('☀️ Running afternoon blog generation (1:00 PM — non-tech)...');
        try {
            await generateAndPublishBlog('non-tech');
        } catch (error) {
            console.error('Failed afternoon blog generation:', error);
        }
    });

    // Evening batch — 7:00 PM (random mix)
    cron.schedule('0 19 * * *', async () => {
        console.log('🌙 Running evening blog generation (7:00 PM — random)...');
        try {
            await generateAndPublishBlog('random');
        } catch (error) {
            console.error('Failed evening blog generation:', error);
        }
    });

    // Flush Redis view counts → Postgres every 5 minutes
    cron.schedule('*/5 * * * *', async () => {
        try {
            await flushViewCounts();
        } catch (error) {
            console.error('Failed to flush view counts:', error);
        }
    });

    // Cleanup old view records daily at 3 AM
    cron.schedule('0 3 * * *', async () => {
        try {
            await cleanupOldViews();
        } catch (error) {
            console.error('Failed to cleanup old views:', error);
        }
    });

    console.log('Cron jobs configured: 7 AM (tech), 1 PM (non-tech), 7 PM (random), views flush every 5 min');
}

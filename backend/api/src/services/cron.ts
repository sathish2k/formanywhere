import cron from 'node-cron';
import { generateAndPublishBlog } from './blog-generator';

export function setupCronJobs() {
    console.log('Setting up cron jobs...');
    
    // Run every day at 4:00 AM
    cron.schedule('0 4 * * *', async () => {
        console.log('Running daily blog generation job (4:00 AM)...');
        try {
            await generateAndPublishBlog();
        } catch (error) {
            console.error('Failed to run daily blog generation job:', error);
        }
    });
    
    console.log('Cron jobs configured successfully.');
}

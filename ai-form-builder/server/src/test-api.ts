import mongoose from 'mongoose';
import { Form } from './models';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/formbuilder';

async function testAPI() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB');

        // Find an advanced template
        const form = await Form.findOne({ title: 'Enterprise Lead Qualification' }).lean();

        if (!form) {
            console.log('❌ Form not found');
            return;
        }

        console.log('\n=== Form found ===');
        console.log('Title:', form.title);

        // Simulate what the API does (from forms.routes.ts line 113-128)
        const apiResponse = {
            id: form._id.toString(),
            name: form.title,
            description: form.description,
            pages: form.settings?.pages || [{ id: 'page-1', name: 'Page 1', description: '' }],
            pageElements: form.settings?.pageElements || {},
            layoutType: form.settings?.layoutType || 'classic',
            layout: form.settings?.layout || null,
            fields: form.fields || [],
            settings: {
                rules: form.settings?.rules || [],
                workflows: form.settings?.workflows || [],
            },
            createdAt: form.createdAt,
            updatedAt: form.updatedAt,
        };

        console.log('\n=== API Response settings.rules ===');
        console.log('Length:', apiResponse.settings.rules.length);
        if (apiResponse.settings.rules.length > 0) {
            console.log('First rule:', JSON.stringify(apiResponse.settings.rules[0], null, 2));
        } else {
            console.log('❌ No rules in API response');
        }

        console.log('\n=== API Response settings.workflows ===');
        console.log('Length:', apiResponse.settings.workflows.length);
        if (apiResponse.settings.workflows.length > 0) {
            console.log('First workflow name:', apiResponse.settings.workflows[0].name);
        } else {
            console.log('❌ No workflows in API response');
        }

        console.log('\n=== Direct form.settings Check ===');
        console.log('form.settings exists:', !!form.settings);
        console.log('form.settings.rules exists:', !!form.settings?.rules);
        console.log('form.settings.rules length:', form.settings?.rules?.length);
        console.log('form.settings.workflows exists:', !!form.settings?.workflows);
        console.log('form.settings.workflows length:', form.settings?.workflows?.length);

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.disconnect();
    }
}

testAPI();

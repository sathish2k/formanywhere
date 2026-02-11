import mongoose from 'mongoose';
import { Form } from './models';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/formbuilder';

async function testQuery() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB');

        // Find an advanced template
        const advancedForm = await Form.findOne({ title: 'Enterprise Lead Qualification' }).lean();

        if (advancedForm) {
            console.log('\n=== Found Form ===');
            console.log('Title:', advancedForm.title);
            console.log('Has settings:', !!advancedForm.settings);
            console.log('Settings keys:', advancedForm.settings ? Object.keys(advancedForm.settings) : []);

            if (advancedForm.settings) {
                console.log('\n=== Rules ===');
                console.log('Has rules:', !!advancedForm.settings.rules);
                console.log('Rules length:', advancedForm.settings.rules?.length || 0);
                if (advancedForm.settings.rules?.length > 0) {
                    console.log('First rule:', JSON.stringify(advancedForm.settings.rules[0], null, 2));
                }

                console.log('\n=== Workflows ===');
                console.log('Has workflows:', !!advancedForm.settings.workflows);
                console.log('Workflows length:', advancedForm.settings.workflows?.length || 0);
                if (advancedForm.settings.workflows?.length > 0) {
                    console.log('First workflow:', JSON.stringify(advancedForm.settings.workflows[0], null, 2));
                }
            }

            console.log('\n=== Full Settings Object ===');
            console.log(JSON.stringify(advancedForm.settings, null, 2));
        } else {
            console.log('No form found');
        }
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.disconnect();
    }
}

testQuery();

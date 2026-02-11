import mongoose from 'mongoose';
import { Form } from './models';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/formbuilder';

async function listForms() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB\n');

        const forms = await Form.find({}).select('_id title settings.rules settings.workflows').lean();

        console.log(`Found ${forms.length} forms:\n`);

        forms.forEach((form, index) => {
            console.log(`${index + 1}. ${form.title}`);
            console.log(`   ID: ${form._id}`);
            console.log(`   Rules: ${form.settings?.rules?.length || 0}`);
            console.log(`   Workflows: ${form.settings?.workflows?.length || 0}`);
            console.log('');
        });

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.disconnect();
    }
}

listForms();

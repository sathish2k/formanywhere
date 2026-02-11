/**
 * Seed Script
 * Populate MongoDB with initial template and form data
 */

import mongoose from 'mongoose';
import { Form, Template, User } from './models';
import { advancedFormTemplates } from './seed/advanced-templates';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/formbuilder';

// Demo user for seeding (Google OAuth user ID)
const DEMO_USER_GOOGLE_ID = '116435823827036068700';

const seedTemplates = [
  {
    name: 'Simple Contact Form',
    description: 'A clean and minimal contact form for general inquiries',
    category: 'contact',
    popular: true,
    uses: 12500,
    fields: [
      { id: 'name', type: 'text', label: 'Name', required: true },
      { id: 'email', type: 'email', label: 'Email', required: true },
      { id: 'message', type: 'textarea', label: 'Message', required: true },
    ],
  },
  {
    name: 'Event Registration',
    description: 'Collect attendee information for conferences and events',
    category: 'registration',
    popular: true,
    uses: 8200,
    fields: [
      { id: 'name', type: 'text', label: 'Name', required: true },
      { id: 'email', type: 'email', label: 'Email', required: true },
      { id: 'company', type: 'text', label: 'Company' },
      {
        id: 'ticket',
        type: 'select',
        label: 'Ticket Type',
        options: ['Standard', 'VIP', 'Student'],
      },
    ],
  },
  {
    name: 'Customer Satisfaction Survey',
    description: 'Measure customer satisfaction with NPS and ratings',
    category: 'survey',
    popular: false,
    uses: 6800,
    fields: [
      { id: 'rating', type: 'rating', label: 'Rating', required: true },
      { id: 'feedback', type: 'textarea', label: 'Feedback' },
      {
        id: 'recommend',
        type: 'radio',
        label: 'Would you recommend us?',
        options: ['Yes', 'No', 'Maybe'],
      },
    ],
  },
  {
    name: 'Appointment Booking',
    description: 'Schedule appointments with calendar integration',
    category: 'booking',
    popular: true,
    uses: 10100,
    fields: [
      { id: 'name', type: 'text', label: 'Name', required: true },
      { id: 'email', type: 'email', label: 'Email', required: true },
      { id: 'date', type: 'date', label: 'Date', required: true },
      { id: 'time', type: 'time', label: 'Time', required: true },
      {
        id: 'service',
        type: 'select',
        label: 'Service',
        options: ['Consultation', 'Follow-up', 'Initial Meeting'],
      },
    ],
  },
  {
    name: 'Product Order Form',
    description: 'Accept product orders with quantity and shipping details',
    category: 'order',
    popular: false,
    uses: 5300,
    fields: [
      {
        id: 'product',
        type: 'select',
        label: 'Product',
        required: true,
        options: ['Product A', 'Product B', 'Product C'],
      },
      { id: 'quantity', type: 'number', label: 'Quantity', required: true },
      { id: 'address', type: 'textarea', label: 'Shipping Address', required: true },
    ],
  },
  {
    name: 'Employee Feedback',
    description: 'Gather 360-degree feedback from team members',
    category: 'feedback',
    popular: false,
    uses: 4700,
    fields: [
      { id: 'performance', type: 'rating', label: 'Performance Rating' },
      { id: 'goals', type: 'textarea', label: 'Goals for Next Quarter' },
      { id: 'comments', type: 'textarea', label: 'Additional Comments' },
    ],
  },
  {
    name: 'Demo Request Form',
    description: 'Qualify leads and schedule product demonstrations',
    category: 'lead',
    popular: true,
    uses: 9400,
    fields: [
      { id: 'company', type: 'text', label: 'Company', required: true },
      { id: 'role', type: 'text', label: 'Your Role', required: true },
      {
        id: 'team_size',
        type: 'select',
        label: 'Team Size',
        options: ['1-10', '11-50', '51-200', '200+'],
      },
      { id: 'use_case', type: 'textarea', label: 'Use Case' },
    ],
  },
  {
    name: 'Webinar Registration',
    description: 'Sign up attendees for online webinars and training',
    category: 'registration',
    popular: false,
    uses: 7100,
    fields: [
      { id: 'name', type: 'text', label: 'Name', required: true },
      { id: 'email', type: 'email', label: 'Email', required: true },
      { id: 'job_title', type: 'text', label: 'Job Title' },
      { id: 'questions', type: 'textarea', label: 'Questions for the Speaker' },
    ],
  },
  {
    name: 'Employee Engagement Survey',
    description: 'Measure team morale and engagement levels',
    category: 'survey',
    popular: false,
    uses: 3900,
    fields: [
      { id: 'satisfaction', type: 'rating', label: 'Overall Satisfaction' },
      { id: 'culture', type: 'rating', label: 'Company Culture' },
      { id: 'growth', type: 'rating', label: 'Growth Opportunities' },
    ],
  },
  {
    name: 'Customer Support Form',
    description: 'Handle support tickets with priority and category',
    category: 'contact',
    popular: false,
    uses: 11200,
    fields: [
      { id: 'name', type: 'text', label: 'Name', required: true },
      {
        id: 'issue_type',
        type: 'select',
        label: 'Issue Type',
        options: ['Bug', 'Feature Request', 'Question', 'Other'],
      },
      {
        id: 'priority',
        type: 'select',
        label: 'Priority',
        options: ['Low', 'Medium', 'High', 'Urgent'],
      },
      { id: 'description', type: 'textarea', label: 'Description', required: true },
    ],
  },
  {
    name: 'Restaurant Reservation',
    description: 'Take reservations with party size and preferences',
    category: 'booking',
    popular: false,
    uses: 6500,
    fields: [
      { id: 'name', type: 'text', label: 'Name', required: true },
      { id: 'date', type: 'date', label: 'Date', required: true },
      { id: 'time', type: 'time', label: 'Time', required: true },
      { id: 'party_size', type: 'number', label: 'Party Size', required: true },
      { id: 'requests', type: 'textarea', label: 'Special Requests' },
    ],
  },
  {
    name: 'Free Consultation Request',
    description: 'Capture leads for consulting services',
    category: 'lead',
    popular: false,
    uses: 5800,
    fields: [
      { id: 'name', type: 'text', label: 'Name', required: true },
      { id: 'business', type: 'text', label: 'Business Name' },
      {
        id: 'budget',
        type: 'select',
        label: 'Budget',
        options: ['$1K-5K', '$5K-10K', '$10K-25K', '$25K+'],
      },
      {
        id: 'timeline',
        type: 'select',
        label: 'Timeline',
        options: ['ASAP', '1-2 weeks', '1 month', 'Flexible'],
      },
    ],
  },
];

// Sample forms for demo user with real form builder schema
const createSeedForms = (userId: mongoose.Types.ObjectId) => [
  {
    userId,
    title: 'Customer Feedback Survey',
    description: 'Collect customer feedback about our services',
    isPublished: true,
    submissions: 142,
    fields: [],
    settings: {
      layoutType: 'classic',
      pages: [{ id: 'page-1', name: 'Feedback', description: 'Share your thoughts with us' }],
      pageElements: {
        'page-1': [
          {
            id: 'elem-1',
            type: 'heading',
            label: 'Customer Feedback',
            heading: 'How was your experience?',
            size: 'h4',
            color: '#1976d2',
            icon: null as any,
          },
          {
            id: 'elem-2',
            type: 'text-input',
            label: 'Name',
            fieldName: 'name',
            placeholder: 'Your name',
            required: true,
            icon: null as any,
            color: '#1976d2',
          },
          {
            id: 'elem-3',
            type: 'select',
            label: 'Rating',
            fieldName: 'rating',
            required: true,
            options: ['Excellent', 'Good', 'Average', 'Poor'],
            icon: null as any,
            color: '#1976d2',
          },
          {
            id: 'elem-4',
            type: 'textarea',
            label: 'Feedback',
            fieldName: 'feedback',
            placeholder: 'Tell us what you think',
            rows: 4,
            icon: null as any,
            color: '#1976d2',
          },
        ],
      },
    },
    createdAt: new Date('2024-12-15'),
    updatedAt: new Date('2024-12-20'),
  },
  {
    userId,
    title: 'Event Registration Form',
    description: 'Register for our upcoming tech conference',
    isPublished: true,
    submissions: 89,
    fields: [],
    settings: {
      layoutType: 'classic',
      pages: [{ id: 'page-1', name: 'Registration', description: 'Sign up for the event' }],
      pageElements: {
        'page-1': [
          {
            id: 'elem-1',
            type: 'section',
            label: 'Section',
            heading: 'Event Registration',
            icon: null as any,
            color: '#9c27b0',
            children: [
              {
                id: 'elem-2',
                type: 'text-input',
                label: 'Full Name',
                fieldName: 'fullName',
                required: true,
                icon: null as any,
                color: '#1976d2',
              },
              {
                id: 'elem-3',
                type: 'email-input',
                label: 'Email',
                fieldName: 'email',
                required: true,
                icon: null as any,
                color: '#1976d2',
              },
            ],
          },
          {
            id: 'elem-4',
            type: 'select',
            label: 'Ticket Type',
            fieldName: 'ticketType',
            options: ['Standard - $50', 'VIP - $150', 'Student - $25'],
            required: true,
            icon: null as any,
            color: '#1976d2',
          },
        ],
      },
    },
    createdAt: new Date('2024-12-10'),
    updatedAt: new Date('2024-12-18'),
  },
  {
    userId,
    title: 'Job Application Form',
    description: 'Apply for open positions at our company',
    isPublished: false,
    submissions: 0,
    fields: [],
    settings: {
      layoutType: 'classic',
      pages: [
        { id: 'page-1', name: 'Personal Info', description: 'Tell us about yourself' },
        { id: 'page-2', name: 'Experience', description: 'Your work history' },
      ],
      pageElements: {
        'page-1': [
          {
            id: 'elem-1',
            type: 'text-input',
            label: 'Full Name',
            fieldName: 'name',
            required: true,
            icon: null as any,
            color: '#1976d2',
          },
          {
            id: 'elem-2',
            type: 'email-input',
            label: 'Email',
            fieldName: 'email',
            required: true,
            icon: null as any,
            color: '#1976d2',
          },
          {
            id: 'elem-3',
            type: 'text-input',
            label: 'Phone',
            fieldName: 'phone',
            icon: null as any,
            color: '#1976d2',
          },
        ],
        'page-2': [
          {
            id: 'elem-4',
            type: 'textarea',
            label: 'Previous Experience',
            fieldName: 'experience',
            rows: 4,
            icon: null as any,
            color: '#1976d2',
          },
          {
            id: 'elem-5',
            type: 'file-upload',
            label: 'Resume',
            fieldName: 'resume',
            required: true,
            icon: null as any,
            color: '#1976d2',
          },
        ],
      },
    },
    createdAt: new Date('2024-12-05'),
    updatedAt: new Date('2024-12-05'),
  },
  {
    userId,
    title: 'Contact Us',
    description: 'General contact form for inquiries',
    isPublished: true,
    submissions: 234,
    fields: [],
    settings: {
      layoutType: 'classic',
      pages: [{ id: 'page-1', name: 'Contact', description: 'Get in touch' }],
      pageElements: {
        'page-1': [
          {
            id: 'elem-1',
            type: 'columns-2',
            label: '2 Columns',
            icon: null as any,
            color: '#4caf50',
            column1Children: [
              {
                id: 'elem-2',
                type: 'text-input',
                label: 'Name',
                fieldName: 'name',
                required: true,
                icon: null as any,
                color: '#1976d2',
              },
              {
                id: 'elem-3',
                type: 'email-input',
                label: 'Email',
                fieldName: 'email',
                required: true,
                icon: null as any,
                color: '#1976d2',
              },
            ],
            column2Children: [
              {
                id: 'elem-4',
                type: 'text-input',
                label: 'Subject',
                fieldName: 'subject',
                icon: null as any,
                color: '#1976d2',
              },
              {
                id: 'elem-5',
                type: 'text-input',
                label: 'Phone',
                fieldName: 'phone',
                icon: null as any,
                color: '#1976d2',
              },
            ],
          },
          {
            id: 'elem-6',
            type: 'textarea',
            label: 'Message',
            fieldName: 'message',
            required: true,
            rows: 6,
            icon: null as any,
            color: '#1976d2',
          },
        ],
      },
    },
    createdAt: new Date('2024-11-20'),
    updatedAt: new Date('2024-12-22'),
  },
  {
    userId,
    title: 'Newsletter Signup',
    description: 'Subscribe to our weekly newsletter',
    isPublished: true,
    submissions: 512,
    fields: [],
    settings: {
      layoutType: 'card',
      pages: [{ id: 'page-1', name: 'Subscribe', description: 'Stay updated' }],
      pageElements: {
        'page-1': [
          {
            id: 'elem-1',
            type: 'heading',
            label: 'Heading',
            heading: 'Join Our Newsletter',
            size: 'h3',
            color: '#1976d2',
            icon: null as any,
          },
          {
            id: 'elem-2',
            type: 'text-block',
            label: 'Text Block',
            content: 'Get the latest updates delivered to your inbox every week.',
            icon: null as any,
            color: '#757575',
          },
          {
            id: 'elem-3',
            type: 'email-input',
            label: 'Email Address',
            fieldName: 'email',
            required: true,
            placeholder: 'your@email.com',
            icon: null as any,
            color: '#1976d2',
          },
          {
            id: 'elem-4',
            type: 'checkbox',
            label: 'I agree to receive emails',
            fieldName: 'consent',
            required: true,
            icon: null as any,
            color: '#1976d2',
          },
        ],
      },
    },
    createdAt: new Date('2024-11-01'),
    updatedAt: new Date('2024-12-01'),
  },
  {
    userId,
    title: 'Product Feedback',
    description: 'Share your thoughts on our new product',
    isPublished: true,
    submissions: 67,
    fields: [],
    settings: {
      layoutType: 'classic',
      pages: [{ id: 'page-1', name: 'Feedback', description: '' }],
      pageElements: {
        'page-1': [
          {
            id: 'elem-1',
            type: 'select',
            label: 'Product',
            fieldName: 'product',
            options: ['Product A', 'Product B', 'Product C'],
            required: true,
            icon: null as any,
            color: '#1976d2',
          },
          {
            id: 'elem-2',
            type: 'radio',
            label: 'Overall Experience',
            fieldName: 'experience',
            options: ['Excellent', 'Good', 'Fair', 'Poor'],
            required: true,
            icon: null as any,
            color: '#1976d2',
          },
          {
            id: 'elem-3',
            type: 'textarea',
            label: 'Additional Comments',
            fieldName: 'comments',
            rows: 4,
            icon: null as any,
            color: '#1976d2',
          },
        ],
      },
    },
    createdAt: new Date('2024-12-01'),
    updatedAt: new Date('2024-12-15'),
  },
];

async function seed() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing templates
    await Template.deleteMany({});
    console.log('Cleared existing templates');

    // Insert new templates
    await Template.insertMany(seedTemplates);
    console.log(`Inserted ${seedTemplates.length} templates`);

    // Find or create demo user
    let demoUser = await User.findOne({ providerId: DEMO_USER_GOOGLE_ID });
    if (!demoUser) {
      demoUser = new User({
        email: 'demo@example.com',
        name: 'Demo User',
        provider: 'google',
        providerId: DEMO_USER_GOOGLE_ID,
      });
      await demoUser.save();
      console.log('Created demo user');
    }

    // Clear existing forms for demo user
    await Form.deleteMany({ userId: demoUser._id });
    console.log('Cleared existing forms for demo user');

    // Insert demo forms
    const seedForms = createSeedForms(demoUser._id);
    await Form.insertMany(seedForms);
    console.log('Templates seeded successfully');

    // Seed advanced form templates with rules and workflows
    console.log('Seeding advanced form templates...');
    for (const templateData of advancedFormTemplates) {
      const createdForm = await Form.create({
        title: templateData.title,
        description: templateData.description,
        category: templateData.category,
        settings: templateData.settings,
        userId: demoUser._id,
        fields: [],  // Required field
        isPublished: true,
        isTemplate: true,
      });
      console.log(`Created advanced template: ${templateData.title}`);
    }
    console.log('Advanced templates seeded successfully');

    console.log('✅ Seed completed successfully!');
    console.log(`Total templates created: ${seedTemplates.length + advancedFormTemplates.length}`);
    console.log(`Total forms created: 5`);
  } catch (error) {
    console.error('Seed error:', error);
  } finally {
    await mongoose.disconnect();
  }
}

seed();

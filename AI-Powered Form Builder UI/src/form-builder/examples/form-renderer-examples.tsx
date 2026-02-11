/**
 * Form Renderer Examples
 * Demonstrates how to use the form renderer for dynamic form generation
 */

import React, { useState } from 'react';
import { Box, Button, Paper, Typography, Alert } from '@mui/material';
import { FormRenderer } from '../engines/FormRenderer';
import { RulesEngine } from '../engines/RulesEngine';
import { DroppedElement, Rule } from '../types/form.types';
import {
  Type,
  Mail,
  Phone,
  ChevronDown,
  CircleDot,
  CheckSquare,
} from 'lucide-react';

// Example 1: Simple Contact Form
export function SimpleContactForm() {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  const elements: DroppedElement[] = [
    {
      id: 'name',
      type: 'short-text',
      label: 'Full Name',
      placeholder: 'Enter your full name',
      icon: Type,
      color: '#1976D2',
      required: true,
    },
    {
      id: 'email',
      type: 'email',
      label: 'Email Address',
      placeholder: 'your@email.com',
      icon: Mail,
      color: '#1976D2',
      required: true,
    },
    {
      id: 'phone',
      type: 'phone',
      label: 'Phone Number',
      placeholder: '+1 (555) 000-0000',
      icon: Phone,
      color: '#1976D2',
      required: false,
    },
    {
      id: 'message',
      type: 'long-text',
      label: 'Message',
      placeholder: 'Tell us how we can help...',
      icon: Type,
      color: '#1976D2',
      required: true,
      validation: {
        minLength: 10,
        message: 'Message must be at least 10 characters',
      },
    },
  ];

  const rulesEngine = new RulesEngine(elements);

  const handleSubmit = () => {
    Object.entries(formData).forEach(([fieldId, value]) => {
      rulesEngine.updateFormData(fieldId, value);
    });

    const validation = rulesEngine.validateForm();
    setErrors(validation.errors);

    if (validation.isValid) {
      console.log('Form submitted:', formData);
      alert('Form submitted successfully!');
    }
  };

  return (
    <Paper sx={{ p: 4, maxWidth: 600, mx: 'auto' }}>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 700 }}>
        Contact Us
      </Typography>

      <FormRenderer
        elements={elements}
        formData={formData}
        errors={errors}
        onChange={(fieldId, value) => {
          setFormData({ ...formData, [fieldId]: value });
          // Clear error when field is modified
          if (errors[fieldId]) {
            const newErrors = { ...errors };
            delete newErrors[fieldId];
            setErrors(newErrors);
          }
        }}
      />

      <Button
        variant="contained"
        fullWidth
        onClick={handleSubmit}
        sx={{ mt: 3 }}
      >
        Submit
      </Button>
    </Paper>
  );
}

// Example 2: Form with Conditional Logic
export function ConditionalForm() {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  const elements: DroppedElement[] = [
    {
      id: 'contact-preference',
      type: 'dropdown',
      label: 'Preferred Contact Method',
      icon: ChevronDown,
      color: '#7B1FA2',
      options: ['Email', 'Phone', 'SMS'],
      required: true,
    },
    {
      id: 'email',
      type: 'email',
      label: 'Email Address',
      icon: Mail,
      color: '#1976D2',
    },
    {
      id: 'phone',
      type: 'phone',
      label: 'Phone Number',
      icon: Phone,
      color: '#1976D2',
    },
  ];

  const rules: Rule[] = [
    {
      id: 'show-email',
      name: 'Show email field',
      conditions: [
        {
          fieldId: 'contact-preference',
          operator: 'equals',
          value: 'Email',
        },
      ],
      actions: [
        {
          type: 'show',
          targetId: 'email',
        },
        {
          type: 'require',
          targetId: 'email',
        },
      ],
      operator: 'AND',
      enabled: true,
    },
    {
      id: 'show-phone',
      name: 'Show phone field',
      conditions: [
        {
          fieldId: 'contact-preference',
          operator: 'equals',
          value: 'Phone',
        },
      ],
      actions: [
        {
          type: 'show',
          targetId: 'phone',
        },
        {
          type: 'require',
          targetId: 'phone',
        },
      ],
      operator: 'AND',
      enabled: true,
    },
    {
      id: 'show-phone-sms',
      name: 'Show phone for SMS',
      conditions: [
        {
          fieldId: 'contact-preference',
          operator: 'equals',
          value: 'SMS',
        },
      ],
      actions: [
        {
          type: 'show',
          targetId: 'phone',
        },
        {
          type: 'require',
          targetId: 'phone',
        },
      ],
      operator: 'AND',
      enabled: true,
    },
  ];

  const rulesEngine = new RulesEngine(elements, rules);

  // Update rules engine with current form data
  Object.entries(formData).forEach(([fieldId, value]) => {
    rulesEngine.updateFormData(fieldId, value);
  });

  const ruleResult = rulesEngine.evaluateRules();

  return (
    <Paper sx={{ p: 4, maxWidth: 600, mx: 'auto' }}>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 700 }}>
        Contact Preferences
      </Typography>

      <Alert severity="info" sx={{ mb: 3 }}>
        Select your preferred contact method to see relevant fields
      </Alert>

      <FormRenderer
        elements={elements}
        formData={formData}
        errors={errors}
        ruleResult={ruleResult}
        onChange={(fieldId, value) => {
          setFormData({ ...formData, [fieldId]: value });
        }}
      />

      <Button
        variant="contained"
        fullWidth
        sx={{ mt: 3 }}
        onClick={() => {
          const validation = rulesEngine.validateForm();
          setErrors(validation.errors);
          if (validation.isValid) {
            alert('Form is valid!');
          }
        }}
      >
        Submit
      </Button>
    </Paper>
  );
}

// Example 3: Multi-Step Form with Renderer
export function MultiStepFormWithRenderer() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  const steps = [
    {
      title: 'Personal Information',
      elements: [
        {
          id: 'first-name',
          type: 'short-text',
          label: 'First Name',
          icon: Type,
          color: '#1976D2',
          required: true,
        },
        {
          id: 'last-name',
          type: 'short-text',
          label: 'Last Name',
          icon: Type,
          color: '#1976D2',
          required: true,
        },
        {
          id: 'email',
          type: 'email',
          label: 'Email',
          icon: Mail,
          color: '#1976D2',
          required: true,
        },
      ] as DroppedElement[],
    },
    {
      title: 'Preferences',
      elements: [
        {
          id: 'interests',
          type: 'checkbox',
          label: 'Interests',
          icon: CheckSquare,
          color: '#7B1FA2',
          options: ['Technology', 'Sports', 'Music', 'Travel'],
        },
        {
          id: 'newsletter',
          type: 'switch',
          label: 'Subscribe to Newsletter',
          icon: CheckSquare,
          color: '#7B1FA2',
        },
      ] as DroppedElement[],
    },
  ];

  const currentStepElements = steps[currentStep].elements;
  const rulesEngine = new RulesEngine(currentStepElements);

  const handleNext = () => {
    Object.entries(formData).forEach(([fieldId, value]) => {
      rulesEngine.updateFormData(fieldId, value);
    });

    const validation = rulesEngine.validateForm();
    setErrors(validation.errors);

    if (validation.isValid) {
      if (currentStep < steps.length - 1) {
        setCurrentStep(currentStep + 1);
        setErrors({});
      } else {
        alert('Form completed!');
        console.log('Final form data:', formData);
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setErrors({});
    }
  };

  return (
    <Paper sx={{ p: 4, maxWidth: 600, mx: 'auto' }}>
      <Typography variant="h5" sx={{ mb: 1, fontWeight: 700 }}>
        {steps[currentStep].title}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Step {currentStep + 1} of {steps.length}
      </Typography>

      <FormRenderer
        elements={currentStepElements}
        formData={formData}
        errors={errors}
        onChange={(fieldId, value) => {
          setFormData({ ...formData, [fieldId]: value });
        }}
      />

      <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
        <Button
          variant="outlined"
          onClick={handleBack}
          disabled={currentStep === 0}
        >
          Back
        </Button>
        <Button variant="contained" onClick={handleNext} sx={{ flex: 1 }}>
          {currentStep === steps.length - 1 ? 'Submit' : 'Next'}
        </Button>
      </Box>
    </Paper>
  );
}

// Example 4: Read-only Form Renderer
export function ReadOnlyFormView() {
  const submittedData = {
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+1 (555) 123-4567',
    message: 'This is a submitted form',
  };

  const elements: DroppedElement[] = [
    {
      id: 'name',
      type: 'short-text',
      label: 'Full Name',
      icon: Type,
      color: '#1976D2',
    },
    {
      id: 'email',
      type: 'email',
      label: 'Email Address',
      icon: Mail,
      color: '#1976D2',
    },
    {
      id: 'phone',
      type: 'phone',
      label: 'Phone Number',
      icon: Phone,
      color: '#1976D2',
    },
    {
      id: 'message',
      type: 'long-text',
      label: 'Message',
      icon: Type,
      color: '#1976D2',
    },
  ];

  return (
    <Paper sx={{ p: 4, maxWidth: 600, mx: 'auto' }}>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 700 }}>
        Submission Details
      </Typography>

      <FormRenderer
        elements={elements}
        formData={submittedData}
        errors={{}}
        onChange={() => {}} // No-op for read-only
        readOnly={true}
      />
    </Paper>
  );
}

// Example 5: Form with Real-time Validation
export function RealTimeValidationForm() {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const elements: DroppedElement[] = [
    {
      id: 'username',
      type: 'short-text',
      label: 'Username',
      icon: Type,
      color: '#1976D2',
      required: true,
      validation: {
        minLength: 3,
        maxLength: 20,
        message: 'Username must be 3-20 characters',
      },
    },
    {
      id: 'email',
      type: 'email',
      label: 'Email',
      icon: Mail,
      color: '#1976D2',
      required: true,
    },
    {
      id: 'password',
      type: 'short-text',
      label: 'Password',
      icon: Type,
      color: '#1976D2',
      required: true,
      validation: {
        minLength: 8,
        message: 'Password must be at least 8 characters',
      },
    },
  ];

  const rulesEngine = new RulesEngine(elements);

  const validateField = (fieldId: string) => {
    rulesEngine.updateFormData(fieldId, formData[fieldId]);
    const validation = rulesEngine.validateForm();
    
    if (validation.errors[fieldId]) {
      setErrors({ ...errors, [fieldId]: validation.errors[fieldId] });
    } else {
      const newErrors = { ...errors };
      delete newErrors[fieldId];
      setErrors(newErrors);
    }
  };

  return (
    <Paper sx={{ p: 4, maxWidth: 600, mx: 'auto' }}>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 700 }}>
        Sign Up
      </Typography>

      <FormRenderer
        elements={elements}
        formData={formData}
        errors={errors}
        onChange={(fieldId, value) => {
          setFormData({ ...formData, [fieldId]: value });
          if (touched[fieldId]) {
            // Validate on change if field has been touched
            setTimeout(() => validateField(fieldId), 300);
          }
        }}
        onBlur={(fieldId) => {
          setTouched({ ...touched, [fieldId]: true });
          validateField(fieldId);
        }}
      />

      <Button
        variant="contained"
        fullWidth
        sx={{ mt: 3 }}
        onClick={() => {
          Object.entries(formData).forEach(([fieldId, value]) => {
            rulesEngine.updateFormData(fieldId, value);
          });

          const validation = rulesEngine.validateForm();
          setErrors(validation.errors);

          if (validation.isValid) {
            alert('Registration successful!');
          }
        }}
      >
        Sign Up
      </Button>
    </Paper>
  );
}

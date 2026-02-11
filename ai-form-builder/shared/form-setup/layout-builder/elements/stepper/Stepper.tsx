/**
 * Stepper Element Component
 * Renders step indicator using element properties with multiple style variants
 */

'use client';

import {
  Box,
  LinearProgress,
  Stepper as MuiStepper,
  Step,
  StepButton,
  StepLabel,
  Typography,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import type { LayoutElement } from '../element.types';

interface StepperProps {
  element: LayoutElement;
  totalPages: number;
  isSmall?: boolean;
}

export function Stepper({ element, totalPages, isSmall }: StepperProps) {
  // Use element properties or defaults
  const orientation = element.orientation || 'horizontal';
  const stepperVariant = element.stepperVariant || 'numbers';
  const alternativeLabel = element.alternativeLabel || false;
  const nonLinear = element.nonLinear || false;
  const connector = element.connector !== false;
  const activeStep = element.activeStep || 0;

  // Use steps configuration if available, otherwise generate from totalPages
  const steps =
    element.steps && element.steps.length > 0
      ? element.steps
      : Array.from({ length: totalPages || 3 }, (_, i) => ({
          label: `Step ${i + 1}`,
          pageId: undefined,
          optional: false,
          completed: false,
          error: false,
        }));

  if (isSmall) {
    // Small version for ElementCard preview
    return (
      <SmallStepperContainer>
        <Typography variant="caption" color="text.secondary">
          Stepper ({stepperVariant})
        </Typography>
      </SmallStepperContainer>
    );
  }

  // Render based on stepper variant
  if (stepperVariant === 'dots') {
    return (
      <DotsContainer orientation={orientation}>
        {steps.map((step, index) => (
          <StepDot
            key={index}
            isActive={index === activeStep}
            isCompleted={index < activeStep || !!step.completed}
          />
        ))}
      </DotsContainer>
    );
  }

  if (stepperVariant === 'progress') {
    const progress = ((activeStep + 1) / steps.length) * 100;
    return (
      <Box sx={{ width: '100%' }}>
        <LinearProgress
          variant="determinate"
          value={progress}
          sx={{ height: 8, borderRadius: 1, mb: 1 }}
        />
        <Typography variant="caption" color="text.secondary" align="center" display="block">
          Step {activeStep + 1} of {steps.length}
        </Typography>
      </Box>
    );
  }

  if (stepperVariant === 'text') {
    return (
      <TextStepperContainer orientation={orientation}>
        {steps.map((step, index) => (
          <TextStep
            key={index}
            isActive={index === activeStep}
            isCompleted={index < activeStep || !!step.completed}
          >
            <Typography
              variant="body2"
              sx={{
                fontWeight: index === activeStep ? 700 : 400,
                opacity: index === activeStep ? 1 : 0.6,
              }}
            >
              {step.label}
            </Typography>
          </TextStep>
        ))}
      </TextStepperContainer>
    );
  }

  // Default: numbers (MUI Stepper)
  return (
    <Box sx={{ width: '100%' }}>
      <MuiStepper
        activeStep={activeStep}
        orientation={orientation}
        alternativeLabel={alternativeLabel}
        connector={connector ? undefined : null}
        nonLinear={nonLinear}
      >
        {steps.map((step, index) => (
          <Step key={index} completed={!!step.completed}>
            {nonLinear ? (
              <StepButton
                optional={
                  step.optional ? <Typography variant="caption">Optional</Typography> : undefined
                }
              >
                {step.label}
                {step.pageId && (
                  <Typography variant="caption" display="block" color="text.secondary">
                    → Page ID: {step.pageId}
                  </Typography>
                )}
              </StepButton>
            ) : (
              <StepLabel
                error={!!step.error}
                optional={
                  step.optional ? <Typography variant="caption">Optional</Typography> : undefined
                }
              >
                {step.label}
                {step.pageId && (
                  <Typography variant="caption" display="block" color="text.secondary">
                    → {step.pageId}
                  </Typography>
                )}
              </StepLabel>
            )}
          </Step>
        ))}
      </MuiStepper>
    </Box>
  );
}

// Styled Components
const SmallStepperContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(1),
}));

const DotsContainer = styled(Box)<{ orientation: 'horizontal' | 'vertical' }>(
  ({ theme, orientation }) => ({
    display: 'flex',
    flexDirection: orientation === 'horizontal' ? 'row' : 'column',
    gap: theme.spacing(1),
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing(1, 0),
  })
);

const StepDot = styled(Box)<{ isActive: boolean; isCompleted: boolean }>(
  ({ theme, isActive, isCompleted }) => ({
    width: 12,
    height: 12,
    borderRadius: '50%',
    backgroundColor: isActive
      ? theme.palette.primary.main
      : isCompleted
        ? theme.palette.primary.light
        : theme.palette.action.disabled,
    transition: 'all 0.3s',
  })
);

const TextStepperContainer = styled(Box)<{ orientation: 'horizontal' | 'vertical' }>(
  ({ theme, orientation }) => ({
    display: 'flex',
    flexDirection: orientation === 'horizontal' ? 'row' : 'column',
    gap: theme.spacing(2),
    justifyContent: 'center',
    alignItems: orientation === 'horizontal' ? 'center' : 'flex-start',
    padding: theme.spacing(1, 0),
  })
);

const TextStep = styled(Box)<{ isActive: boolean; isCompleted: boolean }>(
  ({ theme, isActive, isCompleted }) => ({
    padding: theme.spacing(0.5, 1),
    borderBottom: isActive ? `2px solid ${theme.palette.primary.main}` : '2px solid transparent',
    transition: 'all 0.3s',
  })
);

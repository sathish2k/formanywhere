/**
 * Profile Settings Tabs Section
 * Right side with tabbed settings panels
 */

'use client';

import type { Invoice, NotificationSettings } from '@/components/profile/profile.configuration';
import { languageOptions, timezoneOptions } from '@/components/profile/profile.configuration';
import {
  Box,
  Button,
  CircularProgress,
  Divider,
  FormControlLabel,
  IconButton,
  Paper,
  Stack,
  Switch,
  Tab,
  Tabs,
  TextField,
  Typography,
  alpha,
  useTheme,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Bell, CreditCard, Download, Lock, Save, User } from 'lucide-react';
import { useState } from 'react';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel({ children, value, index }: TabPanelProps) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`profile-tabpanel-${index}`}
      aria-labelledby={`profile-tab-${index}`}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

interface FormInputProps {
  label: string;
  value?: string;
  defaultValue?: string;
  type?: string;
  select?: boolean;
  children?: React.ReactNode;
  onChange?: (value: string) => void;
}

function FormInput({
  label,
  value,
  defaultValue,
  type,
  select,
  children,
  onChange,
}: FormInputProps) {
  const inputSx = {
    '& .MuiOutlinedInput-root': {
      borderRadius: 1.5,
    },
    '& .MuiOutlinedInput-input': {
      py: 1.5,
    },
  };

  return (
    <Box>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontWeight: 500 }}>
        {label}
      </Typography>
      {select ? (
        <TextField
          fullWidth
          select
          value={value ?? defaultValue ?? ''}
          onChange={(e) => onChange?.(e.target.value)}
          SelectProps={{ native: true }}
          sx={inputSx}
        >
          {children}
        </TextField>
      ) : (
        <TextField
          fullWidth
          value={value ?? defaultValue ?? ''}
          type={type}
          onChange={(e) => onChange?.(e.target.value)}
          sx={inputSx}
        />
      )}
    </Box>
  );
}

interface PasswordForm {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface ProfileData {
  name?: string;
  email?: string;
  phone?: string;
  company?: string;
  jobTitle?: string;
  language?: string;
  timezone?: string;
}

type ProfileField = keyof ProfileData;

interface ProfileSettingsTabsProps {
  userName: string;
  userEmail: string;
  notifications: NotificationSettings;
  onNotificationsChange: (settings: NotificationSettings) => void;
  invoices: Invoice[];
  onSave: (tab: string) => void;
  saving?: boolean;
  profile?: ProfileData;
  onProfileChange?: (field: ProfileField, value: string) => void;
  passwordForm?: PasswordForm;
  onPasswordChange?: (field: keyof PasswordForm, value: string) => void;
  // Billing props
  billingInfo?: {
    planName: string;
    planPrice: number;
    planInterval: string;
    planFeatures: string[];
    nextBillingDate: string;
    paymentLast4: string;
    paymentExpiry: string;
  };
  onChangePlan?: () => void;
  onCancelPlan?: () => void;
  onUpdatePayment?: () => void;
  onDownloadInvoice?: (invoiceDate: string) => void;
}

export function ProfileSettingsTabs({
  userName,
  userEmail,
  notifications,
  onNotificationsChange,
  invoices,
  onSave,
  saving = false,
  profile = {},
  onProfileChange,
  passwordForm = { currentPassword: '', newPassword: '', confirmPassword: '' },
  onPasswordChange,
  billingInfo,
  onChangePlan,
  onCancelPlan,
  onUpdatePayment,
  onDownloadInvoice,
}: ProfileSettingsTabsProps) {
  const _theme = useTheme();
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <SettingsCard>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <StyledTabs value={tabValue} onChange={handleTabChange}>
          <Tab icon={<User size={18} />} iconPosition="start" label="General" />
          <Tab icon={<Lock size={18} />} iconPosition="start" label="Security" />
          <Tab icon={<Bell size={18} />} iconPosition="start" label="Notifications" />
          <Tab icon={<CreditCard size={18} />} iconPosition="start" label="Billing" />
        </StyledTabs>
      </Box>

      <Box sx={{ px: 4 }}>
        {/* General Tab */}
        <TabPanel value={tabValue} index={0}>
          <Stack spacing={4}>
            <Box>
              <Typography variant="subtitle2" sx={{ mb: 3, fontWeight: 700 }}>
                Personal Information
              </Typography>
              <Stack spacing={2.5}>
                <FormInput
                  label="Full Name"
                  value={profile.name}
                  defaultValue={userName}
                  onChange={(v) => onProfileChange?.('name', v)}
                />
                <FormInput
                  label="Email Address"
                  value={profile.email}
                  defaultValue={userEmail}
                  type="email"
                  onChange={(v) => onProfileChange?.('email', v)}
                />
                <FormInput
                  label="Phone Number"
                  value={profile.phone}
                  defaultValue="+1 (555) 123-4567"
                  onChange={(v) => onProfileChange?.('phone', v)}
                />
                <FormInput
                  label="Company"
                  value={profile.company}
                  defaultValue="Acme Inc."
                  onChange={(v) => onProfileChange?.('company', v)}
                />
                <FormInput
                  label="Job Title"
                  value={profile.jobTitle}
                  defaultValue="Product Manager"
                  onChange={(v) => onProfileChange?.('jobTitle', v)}
                />
              </Stack>
            </Box>

            <Divider />

            <Box>
              <Typography variant="subtitle2" sx={{ mb: 3, fontWeight: 700 }}>
                Preferences
              </Typography>
              <Stack spacing={2.5}>
                <FormInput
                  label="Language"
                  value={profile.language}
                  defaultValue="en"
                  select
                  onChange={(v) => onProfileChange?.('language', v)}
                >
                  {languageOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </FormInput>
                <FormInput
                  label="Timezone"
                  value={profile.timezone}
                  defaultValue="UTC-8"
                  select
                  onChange={(v) => onProfileChange?.('timezone', v)}
                >
                  {timezoneOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </FormInput>
              </Stack>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', pt: 2 }}>
              <Button
                variant="contained"
                startIcon={
                  saving ? <CircularProgress size={18} color="inherit" /> : <Save size={18} />
                }
                sx={{ boxShadow: 'none' }}
                onClick={() => onSave('general')}
                disabled={saving}
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </Box>
          </Stack>
        </TabPanel>

        {/* Security Tab */}
        <TabPanel value={tabValue} index={1}>
          <Stack spacing={4}>
            <Box>
              <Typography variant="subtitle2" sx={{ mb: 3, fontWeight: 700 }}>
                Change Password
              </Typography>
              <Stack spacing={2.5}>
                <FormInput
                  label="Current Password"
                  type="password"
                  value={passwordForm.currentPassword}
                  onChange={(v) => onPasswordChange?.('currentPassword', v)}
                />
                <FormInput
                  label="New Password"
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={(v) => onPasswordChange?.('newPassword', v)}
                />
                <FormInput
                  label="Confirm New Password"
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={(v) => onPasswordChange?.('confirmPassword', v)}
                />
              </Stack>
            </Box>

            <Divider />

            <Box>
              <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 700 }}>
                Two-Factor Authentication
              </Typography>
              <TwoFactorBox>
                <Stack
                  direction="row"
                  spacing={2}
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
                      Enable 2FA
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Add an extra layer of security to your account
                    </Typography>
                  </Box>
                  <Button variant="outlined" size="small" color="primary">
                    Enable
                  </Button>
                </Stack>
              </TwoFactorBox>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', pt: 2 }}>
              <Button
                variant="contained"
                startIcon={
                  saving ? <CircularProgress size={18} color="inherit" /> : <Save size={18} />
                }
                sx={{ boxShadow: 'none' }}
                onClick={() => onSave('security')}
                disabled={saving}
              >
                {saving ? 'Saving...' : 'Update Password'}
              </Button>
            </Box>
          </Stack>
        </TabPanel>

        {/* Notifications Tab */}
        <TabPanel value={tabValue} index={2}>
          <Stack spacing={3}>
            <Box>
              <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 700 }}>
                Email Notifications
              </Typography>
              <Stack spacing={2}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={notifications.emailNotifications}
                      onChange={(e) =>
                        onNotificationsChange({
                          ...notifications,
                          emailNotifications: e.target.checked,
                        })
                      }
                      color="primary"
                    />
                  }
                  label={
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        Form Response Notifications
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Receive emails when someone fills out your form
                      </Typography>
                    </Box>
                  }
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={notifications.marketingEmails}
                      onChange={(e) =>
                        onNotificationsChange({
                          ...notifications,
                          marketingEmails: e.target.checked,
                        })
                      }
                      color="primary"
                    />
                  }
                  label={
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        Marketing Emails
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Receive updates about new features and tips
                      </Typography>
                    </Box>
                  }
                />
              </Stack>
            </Box>

            <Divider />

            <Box>
              <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 700 }}>
                Push Notifications
              </Typography>
              <FormControlLabel
                control={
                  <Switch
                    checked={notifications.pushNotifications}
                    onChange={(e) =>
                      onNotificationsChange({
                        ...notifications,
                        pushNotifications: e.target.checked,
                      })
                    }
                    color="primary"
                  />
                }
                label={
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      Browser Notifications
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Get notified in your browser when important events happen
                    </Typography>
                  </Box>
                }
              />
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', pt: 2 }}>
              <Button
                variant="contained"
                startIcon={
                  saving ? <CircularProgress size={18} color="inherit" /> : <Save size={18} />
                }
                sx={{ boxShadow: 'none' }}
                onClick={() => onSave('notifications')}
                disabled={saving}
              >
                {saving ? 'Saving...' : 'Save Preferences'}
              </Button>
            </Box>
          </Stack>
        </TabPanel>

        {/* Billing Tab */}
        <TabPanel value={tabValue} index={3}>
          <Stack spacing={3}>
            <Box>
              <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 700 }}>
                Current Plan
              </Typography>
              <CurrentPlanCard>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'start',
                    mb: 2,
                  }}
                >
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
                      {billingInfo?.planName || 'Pro Plan'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {billingInfo?.planFeatures?.join(' • ') ||
                        'Unlimited forms • Advanced analytics • Priority support'}
                    </Typography>
                  </Box>
                  <Typography variant="h5" sx={{ fontWeight: 700, color: 'primary.main' }}>
                    ${billingInfo?.planPrice || 29}
                    <Typography component="span" variant="body2" color="text.secondary">
                      /{billingInfo?.planInterval || 'mo'}
                    </Typography>
                  </Typography>
                </Box>
                <Divider sx={{ my: 2 }} />
                <Box
                  sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                >
                  <Typography variant="caption" color="text.secondary">
                    Next billing date: {billingInfo?.nextBillingDate || 'January 1, 2025'}
                  </Typography>
                  <Stack direction="row" spacing={1}>
                    <Button
                      variant="outlined"
                      size="small"
                      color="secondary"
                      onClick={onChangePlan}
                      disabled={saving}
                    >
                      Change Plan
                    </Button>
                    <Button
                      variant="text"
                      size="small"
                      color="error"
                      onClick={onCancelPlan}
                      disabled={saving}
                    >
                      Cancel
                    </Button>
                  </Stack>
                </Box>
              </CurrentPlanCard>
            </Box>

            <Divider />

            <Box>
              <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 700 }}>
                Payment Method
              </Typography>
              <PaymentMethodCard>
                <Stack
                  direction="row"
                  spacing={2}
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Stack direction="row" spacing={2} alignItems="center">
                    <CardIcon>
                      <CreditCard size={20} />
                    </CardIcon>
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                        •••• •••• •••• {billingInfo?.paymentLast4 || '4242'}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Expires {billingInfo?.paymentExpiry || '12/2025'}
                      </Typography>
                    </Box>
                  </Stack>
                  <Button
                    variant="outlined"
                    size="small"
                    color="secondary"
                    onClick={onUpdatePayment}
                    disabled={saving}
                  >
                    Update
                  </Button>
                </Stack>
              </PaymentMethodCard>
            </Box>

            <Divider />

            <Box>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mb: 2,
                }}
              >
                <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                  Billing History
                </Typography>
                <Button variant="text" size="small">
                  View All
                </Button>
              </Box>
              <Stack spacing={1.5}>
                {invoices.map((invoice) => (
                  <InvoiceRow key={invoice.date}>
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {invoice.date}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {billingInfo?.planName || 'Pro Plan'} -{' '}
                        {billingInfo?.planInterval === 'yearly' ? 'Yearly' : 'Monthly'}
                      </Typography>
                    </Box>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                        {invoice.amount}
                      </Typography>
                      <StatusBadge status={invoice.status}>{invoice.status}</StatusBadge>
                      <IconButton size="small" onClick={() => onDownloadInvoice?.(invoice.date)}>
                        <Download size={16} />
                      </IconButton>
                    </Stack>
                  </InvoiceRow>
                ))}
              </Stack>
            </Box>
          </Stack>
        </TabPanel>
      </Box>
    </SettingsCard>
  );
}

// Styled Components
const SettingsCard = styled(Paper)(({ theme }) => ({
  flex: 1,
  boxShadow:
    '0px 0px 2px 0px rgba(145, 158, 171, 0.2), 0px 12px 24px -4px rgba(145, 158, 171, 0.12)',
  borderRadius: theme.spacing(2),
}));

const StyledTabs = styled(Tabs)(({ theme }) => ({
  paddingLeft: theme.spacing(3),
  paddingRight: theme.spacing(3),
  '& .MuiTab-root': {
    textTransform: 'none',
    minWidth: 0,
    marginRight: theme.spacing(3),
    fontWeight: 600,
  },
}));

const TwoFactorBox = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  backgroundColor: alpha(theme.palette.info.main, 0.08),
  border: `1px solid ${alpha(theme.palette.info.main, 0.2)}`,
}));

const CurrentPlanCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  border: `2px solid ${theme.palette.primary.main}`,
  borderRadius: theme.spacing(2),
  backgroundColor: alpha(theme.palette.primary.main, 0.04),
}));

const PaymentMethodCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.spacing(2),
}));

const CardIcon = styled(Box)(({ theme }) => ({
  width: 48,
  height: 32,
  borderRadius: 8,
  backgroundColor: alpha(theme.palette.primary.main, 0.12),
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: theme.palette.primary.main,
}));

const InvoiceRow = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: 12,
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
}));

const StatusBadge = styled(Typography, {
  shouldForwardProp: (prop) => prop !== 'status',
})<{ status: string }>(({ theme, status }) => ({
  padding: '4px 8px',
  borderRadius: 8,
  backgroundColor:
    status === 'Paid'
      ? alpha(theme.palette.success.main, 0.12)
      : alpha(theme.palette.warning.main, 0.12),
  color: status === 'Paid' ? theme.palette.success.dark : theme.palette.warning.dark,
  fontWeight: 600,
  fontSize: '0.75rem',
}));

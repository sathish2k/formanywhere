import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  TextField,
  Button,
  Avatar,
  Stack,
  Divider,
  IconButton,
  alpha,
  useTheme,
  Switch,
  FormControlLabel,
  Tabs,
  Tab,
} from '@mui/material';
import {
  User,
  Mail,
  Lock,
  Bell,
  Globe,
  Shield,
  CreditCard,
  Camera,
  Save,
  ArrowLeft,
} from 'lucide-react';

interface ProfileScreenProps {
  onBack: () => void;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`profile-tabpanel-${index}`}
      aria-labelledby={`profile-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

export function ProfileScreen({ onBack }: ProfileScreenProps) {
  const theme = useTheme();
  const [tabValue, setTabValue] = useState(0);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(false);
  const [marketingEmails, setMarketingEmails] = useState(true);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#FAFAFA', py: 4 }}>
      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Button
            startIcon={<ArrowLeft size={18} />}
            onClick={onBack}
            sx={{
              mb: 2,
              color: 'secondary.main',
              '&:hover': { bgcolor: alpha(theme.palette.secondary.main, 0.08) },
            }}
          >
            Back to Dashboard
          </Button>
          <Typography variant="h4" sx={{ fontWeight: 700, color: 'text.primary', mb: 1 }}>
            Profile Settings
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage your account settings and preferences
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', md: 'row' } }}>
          {/* Left Side - Profile Card */}
          <Paper
            sx={{
              p: 3,
              width: { xs: '100%', md: 320 },
              height: 'fit-content',
              boxShadow: '0px 0px 2px 0px rgba(145, 158, 171, 0.2), 0px 12px 24px -4px rgba(145, 158, 171, 0.12)',
              borderRadius: 2,
            }}
          >
            <Box sx={{ textAlign: 'center' }}>
              {/* Avatar with Edit Button */}
              <Box sx={{ position: 'relative', display: 'inline-block', mb: 2 }}>
                <Avatar
                  sx={{
                    width: 100,
                    height: 100,
                    bgcolor: 'primary.main',
                    fontSize: '2.5rem',
                  }}
                >
                  U
                </Avatar>
                <IconButton
                  sx={{
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                    bgcolor: 'white',
                    border: 2,
                    borderColor: 'divider',
                    '&:hover': { bgcolor: 'grey.100' },
                    width: 32,
                    height: 32,
                  }}
                >
                  <Camera size={16} />
                </IconButton>
              </Box>

              {/* User Info */}
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
                User Name
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                user@example.com
              </Typography>

              <Divider sx={{ my: 2 }} />

              {/* Stats */}
              <Stack spacing={2}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2" color="text.secondary">
                    Forms Created
                  </Typography>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                    24
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2" color="text.secondary">
                    Total Responses
                  </Typography>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                    1,245
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2" color="text.secondary">
                    Member Since
                  </Typography>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                    Jan 2024
                  </Typography>
                </Box>
              </Stack>

              <Divider sx={{ my: 2 }} />

              {/* Plan Badge */}
              <Box
                sx={{
                  p: 1.5,
                  borderRadius: 1.5,
                  bgcolor: alpha(theme.palette.primary.main, 0.08),
                  border: 1,
                  borderColor: alpha(theme.palette.primary.main, 0.2),
                }}
              >
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                  Current Plan
                </Typography>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'primary.main' }}>
                  Pro Plan
                </Typography>
              </Box>
            </Box>
          </Paper>

          {/* Right Side - Settings Tabs */}
          <Paper
            sx={{
              flex: 1,
              boxShadow: '0px 0px 2px 0px rgba(145, 158, 171, 0.2), 0px 12px 24px -4px rgba(145, 158, 171, 0.12)',
              borderRadius: 2,
            }}
          >
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs
                value={tabValue}
                onChange={handleTabChange}
                sx={{
                  px: 3,
                  '& .MuiTab-root': {
                    textTransform: 'none',
                    minWidth: 0,
                    mr: 3,
                    fontWeight: 600,
                  },
                }}
              >
                <Tab icon={<User size={18} />} iconPosition="start" label="General" />
                <Tab icon={<Lock size={18} />} iconPosition="start" label="Security" />
                <Tab icon={<Bell size={18} />} iconPosition="start" label="Notifications" />
                <Tab icon={<CreditCard size={18} />} iconPosition="start" label="Billing" />
              </Tabs>
            </Box>

            <Box sx={{ px: 4 }}>
              {/* General Tab */}
              <TabPanel value={tabValue} index={0}>
                <Stack spacing={3}>
                  <Box>
                    <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 700 }}>
                      Personal Information
                    </Typography>
                    <Stack spacing={2}>
                      <TextField
                        fullWidth
                        label="Full Name"
                        defaultValue="User Name"
                        size="small"
                      />
                      <TextField
                        fullWidth
                        label="Email Address"
                        defaultValue="user@example.com"
                        size="small"
                        type="email"
                      />
                      <TextField
                        fullWidth
                        label="Phone Number"
                        defaultValue="+1 (555) 123-4567"
                        size="small"
                      />
                      <TextField
                        fullWidth
                        label="Company"
                        defaultValue="Acme Inc."
                        size="small"
                      />
                      <TextField
                        fullWidth
                        label="Job Title"
                        defaultValue="Product Manager"
                        size="small"
                      />
                    </Stack>
                  </Box>

                  <Divider />

                  <Box>
                    <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 700 }}>
                      Preferences
                    </Typography>
                    <Stack spacing={2}>
                      <TextField
                        fullWidth
                        select
                        label="Language"
                        defaultValue="en"
                        size="small"
                        SelectProps={{ native: true }}
                      >
                        <option value="en">English</option>
                        <option value="es">Spanish</option>
                        <option value="fr">French</option>
                        <option value="de">German</option>
                      </TextField>
                      <TextField
                        fullWidth
                        select
                        label="Timezone"
                        defaultValue="UTC-8"
                        size="small"
                        SelectProps={{ native: true }}
                      >
                        <option value="UTC-8">Pacific Time (UTC-8)</option>
                        <option value="UTC-7">Mountain Time (UTC-7)</option>
                        <option value="UTC-6">Central Time (UTC-6)</option>
                        <option value="UTC-5">Eastern Time (UTC-5)</option>
                      </TextField>
                    </Stack>
                  </Box>

                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', pt: 2 }}>
                    <Button
                      variant="contained"
                      startIcon={<Save size={18} />}
                      sx={{ boxShadow: 'none' }}
                    >
                      Save Changes
                    </Button>
                  </Box>
                </Stack>
              </TabPanel>

              {/* Security Tab */}
              <TabPanel value={tabValue} index={1}>
                <Stack spacing={3}>
                  <Box>
                    <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 700 }}>
                      Change Password
                    </Typography>
                    <Stack spacing={2}>
                      <TextField
                        fullWidth
                        label="Current Password"
                        type="password"
                        size="small"
                      />
                      <TextField
                        fullWidth
                        label="New Password"
                        type="password"
                        size="small"
                      />
                      <TextField
                        fullWidth
                        label="Confirm New Password"
                        type="password"
                        size="small"
                      />
                    </Stack>
                  </Box>

                  <Divider />

                  <Box>
                    <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 700 }}>
                      Two-Factor Authentication
                    </Typography>
                    <Paper
                      sx={{
                        p: 2,
                        bgcolor: alpha(theme.palette.info.main, 0.08),
                        border: 1,
                        borderColor: alpha(theme.palette.info.main, 0.2),
                      }}
                    >
                      <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
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
                    </Paper>
                  </Box>

                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', pt: 2 }}>
                    <Button
                      variant="contained"
                      startIcon={<Save size={18} />}
                      sx={{ boxShadow: 'none' }}
                    >
                      Update Password
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
                            checked={emailNotifications}
                            onChange={(e) => setEmailNotifications(e.target.checked)}
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
                            checked={marketingEmails}
                            onChange={(e) => setMarketingEmails(e.target.checked)}
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
                    <Stack spacing={2}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={pushNotifications}
                            onChange={(e) => setPushNotifications(e.target.checked)}
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
                    </Stack>
                  </Box>

                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', pt: 2 }}>
                    <Button
                      variant="contained"
                      startIcon={<Save size={18} />}
                      sx={{ boxShadow: 'none' }}
                    >
                      Save Preferences
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
                    <Paper
                      sx={{
                        p: 3,
                        border: 2,
                        borderColor: 'primary.main',
                        borderRadius: 2,
                        bgcolor: alpha(theme.palette.primary.main, 0.04),
                      }}
                    >
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
                        <Box>
                          <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
                            Pro Plan
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Unlimited forms • Advanced analytics • Priority support
                          </Typography>
                        </Box>
                        <Typography variant="h5" sx={{ fontWeight: 700, color: 'primary.main' }}>
                          $29
                          <Typography component="span" variant="body2" color="text.secondary">
                            /mo
                          </Typography>
                        </Typography>
                      </Box>
                      <Divider sx={{ my: 2 }} />
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="caption" color="text.secondary">
                          Next billing date: January 1, 2025
                        </Typography>
                        <Stack direction="row" spacing={1}>
                          <Button variant="outlined" size="small" color="secondary">
                            Change Plan
                          </Button>
                          <Button variant="text" size="small" color="error">
                            Cancel
                          </Button>
                        </Stack>
                      </Box>
                    </Paper>
                  </Box>

                  <Divider />

                  <Box>
                    <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 700 }}>
                      Payment Method
                    </Typography>
                    <Paper
                      sx={{
                        p: 2,
                        border: 1,
                        borderColor: 'divider',
                        borderRadius: 2,
                      }}
                    >
                      <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
                        <Stack direction="row" spacing={2} alignItems="center">
                          <Box
                            sx={{
                              width: 48,
                              height: 32,
                              borderRadius: 1,
                              bgcolor: alpha(theme.palette.primary.main, 0.12),
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            <CreditCard size={20} color={theme.palette.primary.main} />
                          </Box>
                          <Box>
                            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                              •••• •••• •••• 4242
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              Expires 12/2025
                            </Typography>
                          </Box>
                        </Stack>
                        <Button variant="outlined" size="small" color="secondary">
                          Update
                        </Button>
                      </Stack>
                    </Paper>
                  </Box>

                  <Divider />

                  <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                        Billing History
                      </Typography>
                      <Button variant="text" size="small">
                        View All
                      </Button>
                    </Box>
                    <Stack spacing={1.5}>
                      {[
                        { date: 'Dec 1, 2024', amount: '$29.00', status: 'Paid' },
                        { date: 'Nov 1, 2024', amount: '$29.00', status: 'Paid' },
                        { date: 'Oct 1, 2024', amount: '$29.00', status: 'Paid' },
                      ].map((invoice) => (
                        <Paper
                          key={invoice.date}
                          sx={{
                            p: 2,
                            border: 1,
                            borderColor: 'divider',
                            borderRadius: 1.5,
                          }}
                        >
                          <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
                            <Box>
                              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                {invoice.date}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                Pro Plan - Monthly
                              </Typography>
                            </Box>
                            <Stack direction="row" spacing={2} alignItems="center">
                              <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                                {invoice.amount}
                              </Typography>
                              <Typography
                                variant="caption"
                                sx={{
                                  px: 1,
                                  py: 0.5,
                                  borderRadius: 1,
                                  bgcolor: alpha(theme.palette.success.main, 0.12),
                                  color: 'success.dark',
                                  fontWeight: 600,
                                }}
                              >
                                {invoice.status}
                              </Typography>
                              <IconButton size="small">
                                <Download size={16} />
                              </IconButton>
                            </Stack>
                          </Stack>
                        </Paper>
                      ))}
                    </Stack>
                  </Box>
                </Stack>
              </TabPanel>
            </Box>
          </Paper>
        </Box>
      </Container>
    </Box>
  );
}

function Download(props: { size: number }) {
  return (
    <svg
      width={props.size}
      height={props.size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}

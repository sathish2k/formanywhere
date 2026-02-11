/**
 * Profile Component
 * User profile settings page with DashboardAppBar - Backend Integrated
 */

'use client';

import { DashboardAppBar } from '@/shared/dashboard';
import { ProfileCardSection, ProfileSettingsTabs } from '@/shared/profile';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  Snackbar,
  Typography,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { ArrowLeft } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import {
  type BillingInfo,
  type Invoice,
  type NotificationSettings,
  type UserProfile,
  type UserStats,
  defaultBillingInfo,
  defaultNotificationSettings,
  mockInvoices,
} from './profile.configuration';
import {
  cancelSubscription,
  downloadInvoice,
  fetchUserProfile,
  fetchUserStats,
  getBillingInfo,
  getBillingInvoices,
  getNotificationSettings,
  updateNotificationSettings,
  updatePassword,
  updateUserProfile,
} from './profile.datasource';

export function Profile() {
  const router = useRouter();
  const { data: session, status: sessionStatus } = useSession();
  const userId = (session?.user as { id?: string })?.id || '';

  // Loading and error states
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({
    open: false,
    message: '',
    severity: 'success',
  });

  // Data states
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [stats, setStats] = useState<UserStats>({
    formsCreated: 0,
    totalResponses: 0,
    memberSince: 'Unknown',
  });
  const [notifications, setNotifications] = useState<NotificationSettings>(
    defaultNotificationSettings
  );
  const [invoices, setInvoices] = useState<Invoice[]>(mockInvoices);
  const [billingInfo, setBillingInfo] = useState<BillingInfo>(defaultBillingInfo);

  // Form states for editing
  const [editedProfile, setEditedProfile] = useState<Partial<UserProfile>>({});
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const userName = session?.user?.name || profile?.name || 'User Name';
  const userEmail = session?.user?.email || profile?.email || 'user@example.com';

  // Load all profile data
  const loadProfileData = useCallback(async () => {
    if (!userId) return;

    setLoading(true);
    try {
      const [profileData, statsData, notificationData, invoiceData, billingData] =
        await Promise.all([
          fetchUserProfile(userId),
          fetchUserStats(userId),
          getNotificationSettings(userId),
          getBillingInvoices(userId),
          getBillingInfo(userId),
        ]);

      if (profileData) {
        setProfile(profileData);
        setEditedProfile(profileData);
      }
      setStats(statsData);
      setNotifications(notificationData);
      setInvoices(invoiceData);
      setBillingInfo(billingData);
    } catch (error) {
      console.error('Error loading profile data:', error);
      showSnackbar('Failed to load profile data', 'error');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (sessionStatus === 'authenticated' && userId) {
      loadProfileData();
    } else if (sessionStatus === 'unauthenticated') {
      router.push('/signin');
    } else if (sessionStatus === 'authenticated' && !userId) {
      // Use session data as fallback
      setLoading(false);
    }
  }, [sessionStatus, userId, loadProfileData, router]);

  const showSnackbar = (message: string, severity: 'success' | 'error') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleBack = () => {
    router.push('/dashboard');
  };

  const handleSaveGeneral = async () => {
    if (!userId) {
      showSnackbar('User not authenticated', 'error');
      return;
    }

    setSaving(true);
    try {
      const result = await updateUserProfile(userId, editedProfile);
      if (result.success) {
        showSnackbar('Profile updated successfully', 'success');
        setProfile({ ...profile, ...editedProfile } as UserProfile);
      } else {
        showSnackbar('Failed to update profile', 'error');
      }
    } catch (_error) {
      showSnackbar('Failed to update profile', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveSecurity = async () => {
    if (!userId) {
      showSnackbar('User not authenticated', 'error');
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      showSnackbar('Passwords do not match', 'error');
      return;
    }

    if (!passwordForm.currentPassword || !passwordForm.newPassword) {
      showSnackbar('Please fill in all password fields', 'error');
      return;
    }

    setSaving(true);
    try {
      const result = await updatePassword(
        userId,
        passwordForm.currentPassword,
        passwordForm.newPassword
      );
      if (result.success) {
        showSnackbar('Password updated successfully', 'success');
        setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        showSnackbar(result.message || 'Failed to update password', 'error');
      }
    } catch (_error) {
      showSnackbar('Failed to update password', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveNotifications = async () => {
    if (!userId) {
      showSnackbar('User not authenticated', 'error');
      return;
    }

    setSaving(true);
    try {
      const result = await updateNotificationSettings(userId, notifications);
      if (result.success) {
        showSnackbar('Notification preferences saved', 'success');
      } else {
        showSnackbar('Failed to save notification preferences', 'error');
      }
    } catch (_error) {
      showSnackbar('Failed to save notification preferences', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleSave = async (tab: string) => {
    switch (tab) {
      case 'general':
        await handleSaveGeneral();
        break;
      case 'security':
        await handleSaveSecurity();
        break;
      case 'notifications':
        await handleSaveNotifications();
        break;
      default:
        console.log('Save not implemented for tab:', tab);
    }
  };

  const handleProfileChange = (field: keyof UserProfile, value: string) => {
    setEditedProfile((prev) => ({ ...prev, [field]: value }));
  };

  const handlePasswordChange = (field: keyof typeof passwordForm, value: string) => {
    setPasswordForm((prev) => ({ ...prev, [field]: value }));
  };

  // Billing handlers
  const handleChangePlan = () => {
    // Navigate to pricing page or open plan change modal
    router.push('/pricing');
  };

  const handleCancelPlan = async () => {
    if (!userId) {
      showSnackbar('User not authenticated', 'error');
      return;
    }

    setSaving(true);
    try {
      const result = await cancelSubscription(userId);
      if (result.success) {
        showSnackbar('Subscription cancelled successfully', 'success');
        // Reload billing info
        const updatedBilling = await getBillingInfo(userId);
        setBillingInfo(updatedBilling);
      } else {
        showSnackbar(result.message || 'Failed to cancel subscription', 'error');
      }
    } catch (_error) {
      showSnackbar('Failed to cancel subscription', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleUpdatePayment = () => {
    // Open payment method update modal or redirect to Stripe portal
    showSnackbar('Payment method update coming soon', 'success');
  };

  const handleDownloadInvoice = async (invoiceDate: string) => {
    if (!userId) return;

    try {
      const blob = await downloadInvoice(userId, invoiceDate);
      if (blob) {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `invoice-${invoiceDate}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        showSnackbar('Failed to download invoice', 'error');
      }
    } catch (_error) {
      showSnackbar('Failed to download invoice', 'error');
    }
  };

  // Prepare billing info for component
  const billingInfoProps = {
    planName: billingInfo.currentPlan.name,
    planPrice: billingInfo.currentPlan.price,
    planInterval: billingInfo.currentPlan.interval === 'yearly' ? 'yr' : 'mo',
    planFeatures: billingInfo.currentPlan.features,
    nextBillingDate: billingInfo.nextBillingDate,
    paymentLast4: billingInfo.paymentMethod?.last4 || '****',
    paymentExpiry: billingInfo.paymentMethod
      ? `${billingInfo.paymentMethod.expiryMonth}/${billingInfo.paymentMethod.expiryYear}`
      : 'N/A',
  };

  if (sessionStatus === 'loading' || loading) {
    return (
      <PageWrapper>
        <DashboardAppBar userName={userName} userEmail={userEmail} />
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '50vh',
          }}
        >
          <CircularProgress />
        </Box>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <DashboardAppBar userName={userName} userEmail={userEmail} />

      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <BackButton startIcon={<ArrowLeft size={18} />} onClick={handleBack}>
            Back to Dashboard
          </BackButton>
          <Typography variant="h4" sx={{ fontWeight: 700, color: 'text.primary', mb: 1 }}>
            Profile Settings
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage your account settings and preferences
          </Typography>
        </Box>

        {/* Content */}
        <ContentWrapper>
          <ProfileCardSection
            userName={userName}
            userEmail={userEmail}
            stats={stats}
            currentPlan="Pro Plan"
          />
          <ProfileSettingsTabs
            userName={userName}
            userEmail={userEmail}
            notifications={notifications}
            onNotificationsChange={setNotifications}
            invoices={invoices}
            onSave={handleSave}
            saving={saving}
            profile={editedProfile}
            onProfileChange={handleProfileChange}
            passwordForm={passwordForm}
            onPasswordChange={handlePasswordChange}
            billingInfo={billingInfoProps}
            onChangePlan={handleChangePlan}
            onCancelPlan={handleCancelPlan}
            onUpdatePayment={handleUpdatePayment}
            onDownloadInvoice={handleDownloadInvoice}
          />
        </ContentWrapper>
      </Container>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </PageWrapper>
  );
}

// Styled Components
const PageWrapper = styled(Box)({
  minHeight: '100vh',
  backgroundColor: '#FAFAFA',
});

const BackButton = styled(Button)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  color: theme.palette.text.secondary,
  '&:hover': {
    backgroundColor: 'rgba(0, 0, 0, 0.04)',
  },
}));

const ContentWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(3),
  flexDirection: 'column',
  [theme.breakpoints.up('md')]: {
    flexDirection: 'row',
  },
}));

import { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Stack,
  TextField,
  Switch,
  FormControlLabel,
  Divider,
  Chip,
  IconButton,
  InputAdornment,
  Alert,
  Tab,
  Tabs,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Globe,
  Link as LinkIcon,
  Copy,
  Check,
  Code,
  Download,
  Settings,
  Mail,
  Database,
  Webhook,
  Key,
  ExternalLink,
  Share2,
  Lock,
  Users,
  Calendar,
  Eye,
  EyeOff,
} from 'lucide-react';

interface PublishTabProps {
  formName: string;
  onPreview: () => void;
}

export function PublishTab({ formName, onPreview }: PublishTabProps) {
  const [publishTab, setPublishTab] = useState(0);
  const [copied, setCopied] = useState(false);
  const [isPublished, setIsPublished] = useState(false);
  const [formUrl, setFormUrl] = useState('');
  const [customDomain, setCustomDomain] = useState('');
  const [embedDialogOpen, setEmbedDialogOpen] = useState(false);
  
  // Settings
  const [settings, setSettings] = useState({
    requireAuth: false,
    allowMultipleSubmissions: true,
    showProgressBar: true,
    enableAnalytics: true,
    collectEmails: true,
    enableNotifications: true,
    enableWebhooks: false,
    limitResponses: false,
    maxResponses: 100,
    scheduleForm: false,
    startDate: '',
    endDate: '',
    customThankYouUrl: '',
    enableRecaptcha: false,
  });

  const handlePublish = () => {
    // Generate a unique form URL
    const uniqueId = Math.random().toString(36).substring(7);
    const url = `https://forms.yourapp.com/f/${uniqueId}`;
    setFormUrl(url);
    setIsPublished(true);
  };

  const handleUnpublish = () => {
    setIsPublished(false);
    setFormUrl('');
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const embedCode = `<iframe src="${formUrl}" width="100%" height="600" frameborder="0"></iframe>`;
  const reactCode = `import { FormEmbed } from '@yourapp/react-forms';

function MyComponent() {
  return (
    <FormEmbed
      formId="${formUrl.split('/').pop()}"
      onSubmit={(data) => console.log('Form submitted:', data)}
    />
  );
}`;

  return (
    <Box sx={{ display: 'flex', height: '100%', overflow: 'hidden' }}>
      {/* Left Panel - Publish Options */}
      <Box
        sx={{
          width: 360,
          borderRight: 1,
          borderColor: 'divider',
          overflow: 'auto',
          bgcolor: 'background.paper',
        }}
      >
        <Box sx={{ p: 3 }}>
          {/* Header */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5, display: 'flex', alignItems: 'center', gap: 1 }}>
              <Globe size={24} />
              Publish Form
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Share your form with the world
            </Typography>
          </Box>

          {/* Publish Status */}
          <Paper
            variant="outlined"
            sx={{
              p: 2,
              mb: 3,
              bgcolor: isPublished ? 'success.lighter' : 'grey.100',
              borderColor: isPublished ? 'success.main' : 'divider',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                Status
              </Typography>
              <Chip
                label={isPublished ? 'Published' : 'Draft'}
                size="small"
                color={isPublished ? 'success' : 'default'}
                icon={isPublished ? <Eye size={14} /> : <EyeOff size={14} />}
              />
            </Box>
            {isPublished ? (
              <Button
                variant="outlined"
                color="error"
                size="small"
                fullWidth
                onClick={handleUnpublish}
                sx={{ mt: 1 }}
              >
                Unpublish Form
              </Button>
            ) : (
              <Button
                variant="contained"
                size="small"
                fullWidth
                onClick={handlePublish}
                sx={{ mt: 1 }}
              >
                Publish Now
              </Button>
            )}
          </Paper>

          {/* Form URL */}
          {isPublished && (
            <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                Form URL
              </Typography>
              <TextField
                fullWidth
                size="small"
                value={formUrl}
                InputProps={{
                  readOnly: true,
                  endAdornment: (
                    <InputAdornment position="end">
                      <Tooltip title={copied ? 'Copied!' : 'Copy URL'}>
                        <IconButton
                          size="small"
                          onClick={() => copyToClipboard(formUrl)}
                        >
                          {copied ? <Check size={16} /> : <Copy size={16} />}
                        </IconButton>
                      </Tooltip>
                    </InputAdornment>
                  ),
                }}
              />
              <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<ExternalLink size={14} />}
                  onClick={() => window.open(formUrl, '_blank')}
                  fullWidth
                >
                  Open
                </Button>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<Share2 size={14} />}
                  fullWidth
                >
                  Share
                </Button>
              </Box>
            </Paper>
          )}

          <Divider sx={{ my: 3 }} />

          {/* Quick Actions */}
          <Stack spacing={2}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
              Quick Actions
            </Typography>

            <Button
              variant="outlined"
              startIcon={<Code size={16} />}
              onClick={() => setEmbedDialogOpen(true)}
              fullWidth
              disabled={!isPublished}
            >
              Get Embed Code
            </Button>

            <Button
              variant="outlined"
              startIcon={<Download size={16} />}
              fullWidth
              disabled={!isPublished}
            >
              Export Responses
            </Button>

            <Button
              variant="outlined"
              startIcon={<Eye size={16} />}
              onClick={onPreview}
              fullWidth
            >
              Preview Form
            </Button>
          </Stack>

          <Divider sx={{ my: 3 }} />

          {/* Settings */}
          <Stack spacing={2}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
              <Settings size={18} />
              Form Settings
            </Typography>

            <FormControlLabel
              control={
                <Switch
                  size="small"
                  checked={settings.requireAuth}
                  onChange={(e) => setSettings({ ...settings, requireAuth: e.target.checked })}
                />
              }
              label={
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    Require Authentication
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Users must sign in to submit
                  </Typography>
                </Box>
              }
            />

            <FormControlLabel
              control={
                <Switch
                  size="small"
                  checked={settings.allowMultipleSubmissions}
                  onChange={(e) => setSettings({ ...settings, allowMultipleSubmissions: e.target.checked })}
                />
              }
              label={
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    Allow Multiple Submissions
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Users can submit more than once
                  </Typography>
                </Box>
              }
            />

            <FormControlLabel
              control={
                <Switch
                  size="small"
                  checked={settings.showProgressBar}
                  onChange={(e) => setSettings({ ...settings, showProgressBar: e.target.checked })}
                />
              }
              label={
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    Show Progress Bar
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Display completion progress
                  </Typography>
                </Box>
              }
            />

            <FormControlLabel
              control={
                <Switch
                  size="small"
                  checked={settings.enableAnalytics}
                  onChange={(e) => setSettings({ ...settings, enableAnalytics: e.target.checked })}
                />
              }
              label={
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    Enable Analytics
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Track form performance
                  </Typography>
                </Box>
              }
            />

            <FormControlLabel
              control={
                <Switch
                  size="small"
                  checked={settings.enableNotifications}
                  onChange={(e) => setSettings({ ...settings, enableNotifications: e.target.checked })}
                />
              }
              label={
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    Email Notifications
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Get notified on submissions
                  </Typography>
                </Box>
              }
            />

            <FormControlLabel
              control={
                <Switch
                  size="small"
                  checked={settings.enableRecaptcha}
                  onChange={(e) => setSettings({ ...settings, enableRecaptcha: e.target.checked })}
                />
              }
              label={
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    Enable reCAPTCHA
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Prevent spam submissions
                  </Typography>
                </Box>
              }
            />
          </Stack>

          <Divider sx={{ my: 3 }} />

          {/* Advanced Settings */}
          <Stack spacing={2}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
              Advanced
            </Typography>

            <Box>
              <FormControlLabel
                control={
                  <Switch
                    size="small"
                    checked={settings.limitResponses}
                    onChange={(e) => setSettings({ ...settings, limitResponses: e.target.checked })}
                  />
                }
                label="Limit Responses"
              />
              {settings.limitResponses && (
                <TextField
                  fullWidth
                  size="small"
                  type="number"
                  value={settings.maxResponses}
                  onChange={(e) => setSettings({ ...settings, maxResponses: parseInt(e.target.value) })}
                  label="Maximum Responses"
                  sx={{ mt: 1 }}
                />
              )}
            </Box>

            <Box>
              <FormControlLabel
                control={
                  <Switch
                    size="small"
                    checked={settings.scheduleForm}
                    onChange={(e) => setSettings({ ...settings, scheduleForm: e.target.checked })}
                  />
                }
                label="Schedule Form"
              />
              {settings.scheduleForm && (
                <Stack spacing={1} sx={{ mt: 1 }}>
                  <TextField
                    fullWidth
                    size="small"
                    type="datetime-local"
                    label="Start Date"
                    value={settings.startDate}
                    onChange={(e) => setSettings({ ...settings, startDate: e.target.value })}
                    InputLabelProps={{ shrink: true }}
                  />
                  <TextField
                    fullWidth
                    size="small"
                    type="datetime-local"
                    label="End Date"
                    value={settings.endDate}
                    onChange={(e) => setSettings({ ...settings, endDate: e.target.value })}
                    InputLabelProps={{ shrink: true }}
                  />
                </Stack>
              )}
            </Box>

            <TextField
              fullWidth
              size="small"
              placeholder="https://example.com/thank-you"
              label="Custom Thank You URL"
              value={settings.customThankYouUrl}
              onChange={(e) => setSettings({ ...settings, customThankYouUrl: e.target.value })}
              helperText="Redirect users after submission"
            />
          </Stack>
        </Box>
      </Box>

      {/* Right Panel - Information */}
      <Box
        sx={{
          flex: 1,
          overflow: 'auto',
          bgcolor: '#F9FAFB',
          p: 4,
        }}
      >
        <Box sx={{ maxWidth: 800 }}>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
            Sharing Options
          </Typography>

          <Tabs value={publishTab} onChange={(e, v) => setPublishTab(v)} sx={{ mb: 3 }}>
            <Tab label="Share Link" />
            <Tab label="Embed" />
            <Tab label="Integrations" />
          </Tabs>

          {/* Share Link Tab */}
          {publishTab === 0 && (
            <Stack spacing={3}>
              {!isPublished && (
                <Alert severity="info">
                  Publish your form to get a shareable link
                </Alert>
              )}

              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                  Direct Link
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Share this link directly with your audience. Anyone with the link can access and submit the form.
                </Typography>
                {isPublished && (
                  <Box>
                    <TextField
                      fullWidth
                      value={formUrl}
                      InputProps={{
                        readOnly: true,
                        endAdornment: (
                          <InputAdornment position="end">
                            <Button
                              size="small"
                              startIcon={copied ? <Check size={14} /> : <Copy size={14} />}
                              onClick={() => copyToClipboard(formUrl)}
                            >
                              {copied ? 'Copied' : 'Copy'}
                            </Button>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Box>
                )}
              </Paper>

              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                  Custom Domain
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Use your own domain for a professional look (Premium feature)
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="forms.yourdomain.com"
                    value={customDomain}
                    onChange={(e) => setCustomDomain(e.target.value)}
                    disabled
                  />
                  <Button variant="outlined" disabled>
                    Connect
                  </Button>
                </Box>
                <Chip label="Premium" size="small" sx={{ mt: 1 }} />
              </Paper>

              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                  QR Code
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Generate a QR code for easy mobile access
                </Typography>
                <Button variant="outlined" disabled={!isPublished}>
                  Generate QR Code
                </Button>
              </Paper>
            </Stack>
          )}

          {/* Embed Tab */}
          {publishTab === 1 && (
            <Stack spacing={3}>
              {!isPublished && (
                <Alert severity="info">
                  Publish your form to get embed codes
                </Alert>
              )}

              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                  HTML Embed
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Add this iframe code to any HTML page
                </Typography>
                <Paper
                  variant="outlined"
                  sx={{
                    p: 2,
                    bgcolor: 'grey.900',
                    color: 'white',
                    fontFamily: 'monospace',
                    fontSize: '0.85rem',
                    position: 'relative',
                  }}
                >
                  <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{embedCode}</pre>
                  <IconButton
                    size="small"
                    sx={{
                      position: 'absolute',
                      top: 8,
                      right: 8,
                      color: 'white',
                    }}
                    onClick={() => copyToClipboard(embedCode)}
                  >
                    {copied ? <Check size={16} /> : <Copy size={16} />}
                  </IconButton>
                </Paper>
              </Paper>

              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                  React Component
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Use our React component in your application
                </Typography>
                <Paper
                  variant="outlined"
                  sx={{
                    p: 2,
                    bgcolor: 'grey.900',
                    color: 'white',
                    fontFamily: 'monospace',
                    fontSize: '0.85rem',
                    position: 'relative',
                  }}
                >
                  <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{reactCode}</pre>
                  <IconButton
                    size="small"
                    sx={{
                      position: 'absolute',
                      top: 8,
                      right: 8,
                      color: 'white',
                    }}
                    onClick={() => copyToClipboard(reactCode)}
                  >
                    {copied ? <Check size={16} /> : <Copy size={16} />}
                  </IconButton>
                </Paper>
              </Paper>

              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                  WordPress Plugin
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Install our WordPress plugin and use the shortcode
                </Typography>
                <Button variant="outlined" disabled>
                  Download Plugin
                </Button>
              </Paper>
            </Stack>
          )}

          {/* Integrations Tab */}
          {publishTab === 2 && (
            <Stack spacing={3}>
              <Alert severity="info">
                Connect your form to popular services and APIs
              </Alert>

              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                  Available Integrations
                </Typography>
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <Database size={20} />
                    </ListItemIcon>
                    <ListItemText
                      primary="Database"
                      secondary="Store responses in your database"
                    />
                    <Button variant="outlined" size="small">
                      Configure
                    </Button>
                  </ListItem>
                  <Divider />
                  <ListItem>
                    <ListItemIcon>
                      <Mail size={20} />
                    </ListItemIcon>
                    <ListItemText
                      primary="Email Service"
                      secondary="Send responses via email"
                    />
                    <Button variant="outlined" size="small">
                      Configure
                    </Button>
                  </ListItem>
                  <Divider />
                  <ListItem>
                    <ListItemIcon>
                      <Webhook size={20} />
                    </ListItemIcon>
                    <ListItemText
                      primary="Webhooks"
                      secondary="Trigger custom endpoints"
                    />
                    <Button variant="outlined" size="small">
                      Configure
                    </Button>
                  </ListItem>
                  <Divider />
                  <ListItem>
                    <ListItemIcon>
                      <Key size={20} />
                    </ListItemIcon>
                    <ListItemText
                      primary="API Access"
                      secondary="Access via REST API"
                    />
                    <Button variant="outlined" size="small">
                      Get API Key
                    </Button>
                  </ListItem>
                </List>
              </Paper>
            </Stack>
          )}
        </Box>
      </Box>

      {/* Embed Code Dialog */}
      <Dialog
        open={embedDialogOpen}
        onClose={() => setEmbedDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Embed Form</DialogTitle>
        <DialogContent>
          <Tabs value={0}>
            <Tab label="HTML/iframe" />
            <Tab label="React" />
            <Tab label="JavaScript" />
          </Tabs>
          <Paper
            variant="outlined"
            sx={{
              p: 2,
              mt: 2,
              bgcolor: 'grey.900',
              color: 'white',
              fontFamily: 'monospace',
              fontSize: '0.85rem',
            }}
          >
            <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{embedCode}</pre>
          </Paper>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEmbedDialogOpen(false)}>Close</Button>
          <Button
            variant="contained"
            startIcon={<Copy size={16} />}
            onClick={() => {
              copyToClipboard(embedCode);
              setEmbedDialogOpen(false);
            }}
          >
            Copy Code
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

/**
 * Feature 5: Social Media Syndication — View & copy auto-generated
 * Twitter threads, LinkedIn posts, and newsletter content.
 */
import { Component, createSignal, createResource, For, Show } from 'solid-js';
import { Box } from '@formanywhere/ui/box';
import { HStack, VStack } from '@formanywhere/ui/stack';
import { Typography } from '@formanywhere/ui/typography';
import { Button } from '@formanywhere/ui/button';
import { Icon } from '@formanywhere/ui/icon';
import { Card } from '@formanywhere/ui/card';
import { Tabs, TabList, Tab, TabPanel } from '@formanywhere/ui/tabs';
import { CircularProgress } from '@formanywhere/ui/progress';
import { Chip } from '@formanywhere/ui/chip';
import { Snackbar } from '@formanywhere/ui/snackbar';
import { Divider } from '@formanywhere/ui/divider';
import { getSocialPosts, type SocialMediaPosts } from './blog-api';

export const SocialSyndication: Component<{
  slug: string;
  socialData?: SocialMediaPosts | null;
}> = (props) => {
  const [isOpen, setIsOpen] = createSignal(false);
  const [activeTab, setActiveTab] = createSignal('twitter');
  const [copied, setCopied] = createSignal(false);

  const [social] = createResource(
    () => (isOpen() ? props.slug : null),
    async (slug) => {
      if (!slug) return null;
      if (props.socialData && Object.keys(props.socialData).length > 0)
        return props.socialData;
      return getSocialPosts(slug);
    },
  );

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
  };

  return (
    <Box style={{ 'margin-top': '32px' }}>
      <Button
        variant="outlined"
        onClick={() => setIsOpen(!isOpen())}
        icon={<Icon name="share" />}
        style={{ width: '100%' }}
      >
        {isOpen() ? 'Hide Social Posts' : 'View Auto-Generated Social Posts'}
      </Button>

      <Show when={isOpen()}>
        <Card variant="outlined" style={{ 'margin-top': '16px', overflow: 'hidden' }}>
          {/* Loading state */}
          <Show when={social.loading}>
            <HStack gap="sm" align="center" justify="center" style={{ padding: '32px' }}>
              <CircularProgress indeterminate size={24} />
              <Typography variant="body-medium" color="on-surface-variant">
                Loading social posts...
              </Typography>
            </HStack>
          </Show>

          <Show when={social()}>
            <Tabs activeTab={activeTab()} onChange={setActiveTab} variant="secondary">
              <TabList>
                <Tab id="twitter" label="𝕏 Thread" />
                <Tab id="linkedin" label="LinkedIn" />
                <Tab id="newsletter" label="Newsletter" />
              </TabList>

              {/* Twitter Thread */}
              <TabPanel tabId="twitter">
                <Box padding="md">
                  <Show
                    when={social()?.twitterThread?.length}
                    fallback={
                      <Typography variant="body-medium" color="on-surface-variant" align="center">
                        No Twitter thread available.
                      </Typography>
                    }
                  >
                    <VStack gap="sm">
                      <For each={social()?.twitterThread}>
                        {(tweet, i) => (
                          <Card
                            variant="filled"
                            padding="sm"
                            style={{ 'border-left': '3px solid #1DA1F2' }}
                          >
                            <Typography
                              variant="label-small"
                              color="on-surface-variant"
                              style={{ 'margin-bottom': '4px' }}
                            >
                              Tweet {i() + 1}/{social()?.twitterThread?.length}
                            </Typography>
                            <Typography variant="body-medium" style={{ 'line-height': '1.5' }}>
                              {tweet}
                            </Typography>
                          </Card>
                        )}
                      </For>
                      <Button
                        variant="outlined"
                        icon={<Icon name="copy" />}
                        onClick={() =>
                          copyToClipboard(social()?.twitterThread?.join('\n\n') || '')
                        }
                        style={{ color: '#1DA1F2', 'border-color': '#1DA1F2' }}
                      >
                        {copied() ? 'Copied!' : 'Copy Thread'}
                      </Button>
                    </VStack>
                  </Show>
                </Box>
              </TabPanel>

              {/* LinkedIn */}
              <TabPanel tabId="linkedin">
                <Box padding="md">
                  <Show
                    when={social()?.linkedInPost}
                    fallback={
                      <Typography variant="body-medium" color="on-surface-variant" align="center">
                        No LinkedIn post available.
                      </Typography>
                    }
                  >
                    <VStack gap="sm">
                      <Card
                        variant="filled"
                        padding="md"
                        style={{
                          'border-left': '3px solid #0A66C2',
                          'white-space': 'pre-wrap',
                        }}
                      >
                        <Typography variant="body-medium" style={{ 'line-height': '1.6' }}>
                          {social()?.linkedInPost}
                        </Typography>
                      </Card>
                      <Button
                        variant="outlined"
                        icon={<Icon name="copy" />}
                        onClick={() => copyToClipboard(social()?.linkedInPost || '')}
                        style={{ color: '#0A66C2', 'border-color': '#0A66C2' }}
                      >
                        {copied() ? 'Copied!' : 'Copy LinkedIn Post'}
                      </Button>
                    </VStack>
                  </Show>
                </Box>
              </TabPanel>

              {/* Newsletter */}
              <TabPanel tabId="newsletter">
                <Box padding="md">
                  <Show
                    when={social()?.newsletter}
                    fallback={
                      <Typography variant="body-medium" color="on-surface-variant" align="center">
                        No newsletter content available.
                      </Typography>
                    }
                  >
                    <VStack gap="sm">
                      <Card
                        variant="filled"
                        padding="md"
                        style={{
                          'border-left': '3px solid #EA4335',
                          'white-space': 'pre-wrap',
                        }}
                      >
                        <Typography variant="body-medium" style={{ 'line-height': '1.6' }}>
                          {social()?.newsletter}
                        </Typography>
                      </Card>
                      <Button
                        variant="outlined"
                        icon={<Icon name="copy" />}
                        onClick={() => copyToClipboard(social()?.newsletter || '')}
                        style={{ color: '#EA4335', 'border-color': '#EA4335' }}
                      >
                        {copied() ? 'Copied!' : 'Copy Newsletter'}
                      </Button>
                    </VStack>
                  </Show>
                </Box>
              </TabPanel>
            </Tabs>
          </Show>
        </Card>
      </Show>

      {/* Copy success snackbar */}
      <Snackbar
        open={copied()}
        onClose={() => setCopied(false)}
        message="Copied to clipboard!"
        duration={2000}
        position="bottom"
      />
    </Box>
  );
};

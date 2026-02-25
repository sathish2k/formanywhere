/**
 * Feature 6: Citations & Trust Score — Displays verifiable sources
 * and an overall trust score for the AI-generated article.
 */
import { Component, createSignal, For, Show } from 'solid-js';
import { Box } from '@formanywhere/ui/box';
import { Stack } from '@formanywhere/ui/stack';
import { Typography } from '@formanywhere/ui/typography';
import { Button } from '@formanywhere/ui/button';
import { Icon } from '@formanywhere/ui/icon';
import { IconButton } from '@formanywhere/ui/icon-button';
import { Card } from '@formanywhere/ui/card';
import { Badge } from '@formanywhere/ui/badge';
import { Tag } from '@formanywhere/ui/tag';
import { CircularProgress } from '@formanywhere/ui/progress';
import { Divider } from '@formanywhere/ui/divider';
import { List, ListItem } from '@formanywhere/ui/list';
import { verifyArticle, type Citation } from './blog-api';

export const CitationsPanel: Component<{
  slug: string;
  trustScore: number;
  citations: Citation[];
}> = (props) => {
  const [score, setScore] = createSignal(props.trustScore);
  const [citations, setCitations] = createSignal<Citation[]>(props.citations || []);
  const [warnings, setWarnings] = createSignal<string[]>([]);
  const [verifying, setVerifying] = createSignal(false);
  const [isExpanded, setIsExpanded] = createSignal(false);

  const handleVerify = async () => {
    setVerifying(true);
    try {
      const result = await verifyArticle(props.slug);
      setScore(result.trustScore);
      setCitations(result.citations);
      setWarnings(result.warnings || []);
    } catch (err) {
      console.error('Verification failed:', err);
    } finally {
      setVerifying(false);
    }
  };

  const getScoreTone = (): 'success' | 'warning' | 'error' => {
    const s = score();
    if (s >= 85) return 'success';
    if (s >= 60) return 'warning';
    return 'error';
  };

  const getScoreLabel = () => {
    const s = score();
    if (s >= 85) return 'High Trust';
    if (s >= 60) return 'Moderate';
    return 'Low Trust';
  };

  return (
    <Card variant="outlined" style={{ 'margin-top': '48px', overflow: 'hidden' }}>
      {/* Header with Trust Score */}
      <Box
        padding="md"
        bg="surface-variant"
        style={{ cursor: 'pointer' }}
        onClick={() => setIsExpanded(!isExpanded())}
      >
        <Stack direction="row" align="center" justify="between">
          <Stack direction="row" gap="md" align="center">
            <Typography variant="title-medium" style={{ 'font-weight': '700' }}>
              🛡️ Trust & Citations
            </Typography>
            <Tag
              label={`${score()}/100 — ${getScoreLabel()}`}
              tone={getScoreTone()}
              size="md"
            />
          </Stack>

          <Stack direction="row" gap="sm" align="center">
            <Button
              variant="outlined"
              size="sm"
              icon={verifying() ? <CircularProgress indeterminate size={16} /> : <Icon name="search" />}
              onClick={(e: MouseEvent) => {
                e.stopPropagation();
                handleVerify();
              }}
              disabled={verifying()}
            >
              {verifying() ? 'Verifying...' : 'Re-verify'}
            </Button>
            <IconButton
              variant="standard"
              icon={<Icon name={isExpanded() ? 'chevron-down' : 'chevron-right'} />}
            />
          </Stack>
        </Stack>
      </Box>

      <Show when={isExpanded()}>
        <Box padding="md">
          {/* Warnings */}
          <Show when={warnings().length > 0}>
            <Card
              variant="filled"
              padding="sm"
              style={{
                'margin-bottom': '20px',
                background: '#fef3c7',
                border: '1px solid #f59e0b40',
              }}
            >
              <Typography variant="label-large" style={{ color: '#92400e', 'margin-bottom': '8px' }}>
                ⚠️ Unverified Claims
              </Typography>
              <Stack gap="xs">
                <For each={warnings()}>
                  {(warning) => (
                    <Typography variant="body-small" style={{ color: '#92400e' }}>
                      • {warning}
                    </Typography>
                  )}
                </For>
              </Stack>
            </Card>
          </Show>

          {/* Citations List */}
          <Show
            when={citations().length > 0}
            fallback={
              <Typography variant="body-medium" color="on-surface-variant" align="center" style={{ padding: '24px' }}>
                No citations available. Click "Re-verify" to generate them.
              </Typography>
            }
          >
            <Typography variant="label-large" style={{ 'margin-bottom': '16px' }}>
              📚 Sources ({citations().length})
            </Typography>

            <List>
              <For each={citations()}>
                {(citation, i) => (
                  <ListItem
                    headline={citation.title}
                    supportingText={
                      citation.claim
                        ? `Verifies: "${citation.claim}"`
                        : citation.url
                    }
                    start={
                      <Badge content={i() + 1} color="primary">
                        <Box
                          rounded="full"
                          padding="xs"
                          bg="primary"
                          style={{
                            width: '28px',
                            height: '28px',
                            display: 'flex',
                            'align-items': 'center',
                            'justify-content': 'center',
                          }}
                        />
                      </Badge>
                    }
                    end={<Icon name="arrow-right" size={16} />}
                    interactive
                    href={citation.url}
                    onClick={() => window.open(citation.url, '_blank', 'noopener,noreferrer')}
                  />
                )}
              </For>
            </List>
          </Show>
        </Box>
      </Show>
    </Card>
  );
};

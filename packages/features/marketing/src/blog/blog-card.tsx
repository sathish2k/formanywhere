import { Component, Show, For } from 'solid-js';
import { A } from '@solidjs/router';
import { Card } from '@formanywhere/ui/card';
import { Avatar } from '@formanywhere/ui/avatar';
import { Typography } from '@formanywhere/ui/typography';
import { Icon } from '@formanywhere/ui/icon';
import { HStack, VStack } from '@formanywhere/ui/stack';
import { Chip } from '@formanywhere/ui/chip';
import { Divider } from '@formanywhere/ui/divider';
import { Box } from '@formanywhere/ui/box';

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  author: {
    name: string;
    avatarUrl: string;
  };
  publishedAt: string;
  readTime: string;
  tags: string[];
  thumbnailUrl?: string;
  viewCount?: number;
  // Innovative Features
  aiSummary?: string;
  audioUrl?: string;
  mood?: string;
}

export const BlogCard: Component<{ post: BlogPost }> = (props) => {

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  return (
    <A href={`/blog/${props.post.slug}`} style={{ "text-decoration": 'none', color: 'inherit', display: 'block' }}>
      <Card
        variant="glass-subtle"
        direction="column"
        padding="none"
        style={{
          overflow: 'hidden',
          'border-radius': 'var(--m3-shape-extra-large, 24px)',
          transition: 'transform 250ms cubic-bezier(0.2, 0, 0, 1), box-shadow 250ms cubic-bezier(0.2, 0, 0, 1)',
          cursor: 'pointer',
          'break-inside': 'avoid',
        }}
      >
        {/* Thumbnail */}
        <Show when={props.post.thumbnailUrl}>
          <Box style={{
            width: '100%',
            'max-height': '240px',
            overflow: 'hidden',
          }}>
            <img
              src={props.post.thumbnailUrl}
              alt={props.post.title}
              loading="lazy"
              style={{
                width: '100%',
                height: '100%',
                'object-fit': 'cover',
                transition: 'transform 500ms cubic-bezier(0.2, 0, 0, 1)',
              }}
            />
          </Box>
        </Show>

        {/* Content */}
        <VStack gap="sm" style={{ padding: '24px' }}>
          {/* Tags */}
          <HStack gap="sm" style={{ 'flex-wrap': 'wrap' }}>
            <For each={props.post.tags.slice(0, 2)}>
              {(tag) => (
                <Chip label={tag} variant="label" size="sm" />
              )}
            </For>
          </HStack>

          {/* Title */}
          <Typography
            variant="headline-small"
            color="on-surface"
            style={{ 'font-weight': '800', 'line-height': '1.3', 'letter-spacing': '-0.01em' }}
          >
            {props.post.title}
          </Typography>

          {/* Excerpt */}
          <Typography
            variant="body-medium"
            color="on-surface-variant"
            style={{
              display: '-webkit-box',
              '-webkit-line-clamp': '3',
              '-webkit-box-orient': 'vertical',
              overflow: 'hidden',
              'line-height': '1.6',
            }}
          >
            {props.post.excerpt}
          </Typography>

          {/* Author */}
          <HStack gap="sm" align="center" style={{ 'margin-top': '8px' }}>
            <Avatar src={props.post.author.avatarUrl} alt={props.post.author.name} size="sm" />
            <VStack gap="none">
              <Typography variant="label-medium" color="on-surface" style={{ 'font-weight': 'bold' }}>
                {props.post.author.name}
              </Typography>
              <Typography variant="body-small" color="on-surface-variant">
                {props.post.publishedAt}
                <Show when={props.post.readTime}>{` · ${props.post.readTime} read`}</Show>
              </Typography>
            </VStack>
          </HStack>

          {/* Divider */}
          <Divider />

          {/* Stats */}
          <HStack align="center" justify="between">
            <HStack gap="xs" align="center">
              <Icon name="eye" size={16} color="var(--m3-color-on-surface-variant)" />
              <Typography variant="body-small" color="on-surface-variant" style={{ 'font-weight': '500' }}>
                {formatNumber(props.post.viewCount || 0)} views
              </Typography>
            </HStack>
            <Icon name="share" size={16} color="var(--m3-color-on-surface-variant)" />
          </HStack>
        </VStack>
      </Card>
    </A>
  );
};

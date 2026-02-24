import { Component, Show } from 'solid-js';
import { A } from '@solidjs/router';
import { Avatar } from '@formanywhere/ui/avatar';
import { Typography } from '@formanywhere/ui/typography';
import { Icon } from '@formanywhere/ui/icon';
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

  const getTagColor = (_tag: string) => {
    return { bg: 'var(--md-sys-color-primary-container)', text: 'var(--md-sys-color-on-primary-container)' };
  };

  return (
    <Box
      as="article"
      style={{
        display: 'flex',
        "flex-direction": 'column',
        background: 'var(--md-sys-color-surface-container-lowest, #FFFFFF)',
        "border-radius": '24px',
        "box-shadow": '0 4px 24px rgba(0,0,0,0.06)',
        overflow: 'hidden',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        cursor: 'pointer',
        "margin-bottom": '24px',
        "break-inside": 'avoid',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.12)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 4px 24px rgba(0,0,0,0.06)';
      }}
    >
      <A href={`/blog/${props.post.slug}`} style={{ "text-decoration": 'none', color: 'inherit', display: 'block' }}>
        {/* Thumbnail Section */}
        <Show when={props.post.thumbnailUrl}>
          <Box style={{ width: '100%', "max-height": '240px', overflow: 'hidden', position: 'relative' }}>
            <img
              src={props.post.thumbnailUrl}
              alt={props.post.title}
              style={{
                width: '100%',
                height: '100%',
                "object-fit": 'cover',
                transition: 'transform 0.5s ease',
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            />
          </Box>
        </Show>

        {/* Content Section */}
        <Box style={{ padding: '24px' }}>
          {/* Tags */}
          <Box style={{ display: 'flex', gap: '8px', "margin-bottom": '16px', "flex-wrap": 'wrap' }}>
            {props.post.tags.slice(0, 2).map((tag) => {
              const colors = getTagColor(tag);
              return (
                <Box
                  style={{
                    background: colors.bg,
                    color: colors.text,
                    padding: '4px 12px',
                    "border-radius": '16px',
                    "font-size": '0.75rem',
                    "font-weight": 'bold',
                    "text-transform": 'uppercase',
                    "letter-spacing": '0.5px',
                  }}
                >
                  {tag}
                </Box>
              );
            })}
          </Box>

          {/* Title & Excerpt */}
          <Typography
            variant="headline-small"
            style={{ "font-weight": '800', "line-height": '1.3', "margin-bottom": '12px', "letter-spacing": '-0.01em', color: 'var(--md-sys-color-on-surface)' }}
          >
            {props.post.title}
          </Typography>
          <Typography
            variant="body-medium"
            style={{
              color: 'var(--md-sys-color-on-surface-variant)',
              display: '-webkit-box',
              "-webkit-line-clamp": '3',
              "-webkit-box-orient": 'vertical',
              overflow: 'hidden',
              "line-height": '1.6',
              "margin-bottom": '24px',
            }}
          >
            {props.post.excerpt}
          </Typography>

          {/* Author Info */}
          <Box style={{ display: 'flex', "align-items": 'center', gap: '12px', "margin-bottom": '24px' }}>
            <Avatar src={props.post.author.avatarUrl} alt={props.post.author.name} size="sm" />
            <Box>
              <Typography variant="label-medium" style={{ color: 'var(--md-sys-color-on-surface)', "font-weight": 'bold' }}>
                {props.post.author.name}
              </Typography>
              <Typography variant="body-small" style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>
                {props.post.publishedAt} · {props.post.readTime} read
              </Typography>
            </Box>
          </Box>

          {/* Divider */}
          <Box style={{ height: '1px', background: 'var(--md-sys-color-outline-variant)', "margin-bottom": '16px' }} />

          {/* Stats Row */}
          <Box style={{ display: 'flex', "align-items": 'center', "justify-content": 'space-between' }}>
            <Box style={{ display: 'flex', "align-items": 'center', gap: '4px', color: 'var(--md-sys-color-on-surface-variant)' }}>
              <Icon name="eye" style={{ "font-size": '18px' }} />
              <Typography variant="body-small" style={{ "font-weight": '500' }}>
                {formatNumber(props.post.viewCount || 0)} views
              </Typography>
            </Box>

            <Box style={{ display: 'flex', gap: '16px', color: 'var(--md-sys-color-on-surface-variant)' }}>
              <Box style={{ display: 'flex', "align-items": 'center', gap: '4px' }}>
                <Icon name="share" style={{ "font-size": '18px' }} />
              </Box>
            </Box>
          </Box>
        </Box>
      </A>
    </Box>
  );
};

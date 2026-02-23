import { Component, createSignal, Show } from 'solid-js';
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
  // Innovative Features
  aiSummary?: string;
  audioUrl?: string;
  mood?: string;
  engagementScore?: number;
  commentsCount?: number;
  sharesCount?: number;
  likedBy?: { name: string; avatarUrl: string }[];
}

export const BlogCard: Component<{ post: BlogPost }> = (props) => {
  const [likes, setLikes] = createSignal(props.post.engagementScore || 0);
  const [isLiked, setIsLiked] = createSignal(false);

  const handleLike = (e: Event) => {
    e.preventDefault();
    e.stopPropagation();
    if (isLiked()) {
      setLikes(l => l - 1);
      setIsLiked(false);
    } else {
      setLikes(l => l + 1);
      setIsLiked(true);
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  const getTagColor = (tag: string) => {
    const colors: Record<string, { bg: string, text: string }> = {
      'Technology': { bg: '#E3F2FD', text: '#007AFF' },
      'Design': { bg: '#F3E5F5', text: '#AF52DE' },
      'Development': { bg: '#E8F5E9', text: '#34C759' },
      'Business': { bg: '#FFF3E0', text: '#FF9500' },
    };
    return colors[tag] || { bg: 'var(--md-sys-color-surface-container)', text: 'var(--md-sys-color-on-surface)' };
  };

  return (
    <Box
      as="article"
      style={{
        display: 'flex',
        "flex-direction": 'column',
        background: '#FFFFFF',
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
        e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.1)';
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
            style={{ "font-weight": '800', "line-height": '1.3', "margin-bottom": '12px', "letter-spacing": '-0.01em', color: '#1A1A1A' }}
          >
            {props.post.title}
          </Typography>
          <Typography
            variant="body-medium"
            style={{
              color: '#666666',
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
              <Typography variant="label-medium" style={{ color: '#1A1A1A', "font-weight": 'bold' }}>
                {props.post.author.name}
              </Typography>
              <Typography variant="body-small" style={{ color: '#999999' }}>
                {props.post.publishedAt} · {props.post.readTime} read
              </Typography>
            </Box>
          </Box>

          {/* Divider */}
          <Box style={{ height: '1px', background: '#F0F0F0', "margin-bottom": '16px' }} />

          {/* Stats Row */}
          <Box style={{ display: 'flex', "align-items": 'center', "justify-content": 'space-between' }}>
            {/* Liked By Avatars */}
            <Box style={{ display: 'flex', "align-items": 'center' }}>
              <Show when={props.post.likedBy && props.post.likedBy.length > 0}>
                <Box style={{ display: 'flex', "margin-right": '8px' }}>
                  {props.post.likedBy?.slice(0, 3).map((user, index) => (
                    <img
                      src={user.avatarUrl}
                      alt={user.name}
                      style={{
                        width: '24px',
                        height: '24px',
                        "border-radius": '50%',
                        border: '2px solid #FFFFFF',
                        "margin-left": index > 0 ? '-8px' : '0',
                        "z-index": 3 - index,
                      }}
                    />
                  ))}
                </Box>
              </Show>
              <Typography variant="body-small" style={{ color: '#999999', "font-weight": '500' }}>
                {formatNumber(likes())} Likes
              </Typography>
            </Box>

            {/* Action Icons */}
            <Box style={{ display: 'flex', gap: '16px', color: '#999999' }}>
              <Box style={{ display: 'flex', "align-items": 'center', gap: '4px' }}>
                <Icon name="comment" style={{ "font-size": '18px' }} />
                <Typography variant="body-small" style={{ "font-weight": '500' }}>
                  {formatNumber(props.post.commentsCount || 0)}
                </Typography>
              </Box>
              <Box style={{ display: 'flex', "align-items": 'center', gap: '4px' }}>
                <Icon name="share" style={{ "font-size": '18px' }} />
                <Typography variant="body-small" style={{ "font-weight": '500' }}>
                  {formatNumber(props.post.sharesCount || 0)}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </A>
    </Box>
  );
};

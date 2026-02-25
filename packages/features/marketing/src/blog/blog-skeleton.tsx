/**
 * Blog view page skeleton loader — renders instantly while data loads.
 * Pure CSS animation, zero JS dependencies.
 */
import { Box } from '@formanywhere/ui/box';
import { Stack } from '@formanywhere/ui/stack';
import { Divider } from '@formanywhere/ui/divider';
import './blog-skeleton.scss';

/** Reusable shimmer block */
const Bone = (props: { width?: string; height?: string; radius?: string; style?: Record<string, string> }) => (
  <div
    class="blog-skeleton__bone"
    style={{
      width: props.width || '100%',
      height: props.height || '16px',
      'border-radius': props.radius || '8px',
      ...props.style,
    }}
  />
);

export const BlogSkeleton = () => (
  <Box padding="xl" style={{ "max-width": '800px', margin: '0 auto' }}>
    <Stack gap="md">
      {/* Title */}
      <Bone height="40px" width="90%" radius="12px" />
      <Bone height="40px" width="65%" radius="12px" />

      {/* Author row */}
      <Box style={{ display: 'flex', "align-items": 'center', gap: '16px', "margin-top": '8px' }}>
        <Bone width="48px" height="48px" radius="50%" />
        <Stack gap="xs" style={{ flex: '1' }}>
          <Bone width="140px" height="14px" />
          <Bone width="100px" height="12px" />
        </Stack>
        <Box style={{ display: 'flex', gap: '8px' }}>
          <Bone width="40px" height="40px" radius="50%" />
          <Bone width="40px" height="40px" radius="50%" />
          <Bone width="40px" height="40px" radius="50%" />
        </Box>
      </Box>

      {/* AI Summary box */}
      <Bone height="100px" radius="16px" style={{ "margin-top": '8px' }} />

      {/* Cover image */}
      <Bone height="350px" radius="16px" style={{ "margin-top": '8px' }} />

      {/* Reading mode chips */}
      <Box style={{ display: 'flex', gap: '8px', "margin-top": '8px' }}>
        <Bone width="100px" height="32px" radius="16px" />
        <Bone width="80px" height="32px" radius="16px" />
        <Bone width="70px" height="32px" radius="16px" />
        <Bone width="90px" height="32px" radius="16px" />
        <Bone width="100px" height="32px" radius="16px" />
      </Box>

      {/* Body content lines */}
      <Stack gap="sm" style={{ "margin-top": '16px' }}>
        <Bone height="18px" width="100%" />
        <Bone height="18px" width="100%" />
        <Bone height="18px" width="95%" />
        <Bone height="18px" width="88%" />
        <Bone height="18px" width="100%" />
        <Bone height="18px" width="72%" />
      </Stack>

      {/* Subheading */}
      <Bone height="28px" width="45%" style={{ "margin-top": '24px' }} />

      {/* More body lines */}
      <Stack gap="sm">
        <Bone height="18px" width="100%" />
        <Bone height="18px" width="97%" />
        <Bone height="18px" width="100%" />
        <Bone height="18px" width="80%" />
      </Stack>

      <Divider style={{ "margin-top": '24px' }} />

      {/* Tags row */}
      <Box style={{ display: 'flex', gap: '8px' }}>
        <Bone width="72px" height="32px" radius="16px" />
        <Bone width="88px" height="32px" radius="16px" />
        <Bone width="64px" height="32px" radius="16px" />
      </Box>
    </Stack>
  </Box>
);

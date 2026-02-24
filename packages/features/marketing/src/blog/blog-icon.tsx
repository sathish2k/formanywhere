/**
 * Lightweight blog-specific inline SVG icons.
 * Only ships the 2 icons used on the blog view page (~300 bytes vs 19 KB full Icon).
 * For pages that need all 90+ icons, use `@formanywhere/ui/icon`.
 */
import { Component, JSX, splitProps } from 'solid-js';

const BLOG_ICONS: Record<string, { d: string; fill?: boolean }> = {
  share:
    { d: 'M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8M16 6l-4-4-4 4M12 2v13' },
  sparkle:
    { d: 'M19 3l-1.5 3.5L14 8l3.5 1.5L19 13l1.5-3.5L24 8l-3.5-1.5L19 3zm-7 2L8.5 12 5 15.5 8.5 19 12 26l3.5-7L19 15.5 15.5 12 12 5zm0 4.8l1.8 3.6 3.6 1.8-3.6 1.8-1.8 3.6-1.8-3.6-3.6-1.8 3.6-1.8 1.8-3.6z', fill: true },
};

export interface BlogIconProps extends JSX.SvgSVGAttributes<SVGSVGElement> {
  name: keyof typeof BLOG_ICONS | string;
  size?: number | string;
  color?: string;
}

export const BlogIcon: Component<BlogIconProps> = (props) => {
  const [local, others] = splitProps(props, ['name', 'size', 'color', 'class', 'style']);
  const icon = () => BLOG_ICONS[local.name];
  const sz = () => local.size || 24;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={sz()}
      height={sz()}
      viewBox="0 0 24 24"
      fill={icon()?.fill ? (local.color || 'currentColor') : 'none'}
      stroke={icon()?.fill ? 'none' : (local.color || 'currentColor')}
      stroke-width={icon()?.fill ? '0' : '2'}
      stroke-linecap="round"
      stroke-linejoin="round"
      class={local.class}
      style={local.style}
      aria-hidden="true"
      {...others}
    >
      <path d={icon()?.d || ''} />
    </svg>
  );
};

import { Component, createSignal, For } from 'solid-js';
import { Title } from '@solidjs/meta';
import { Box } from '@formanywhere/ui/box';
import { Typography } from '@formanywhere/ui/typography';
import { Button } from '@formanywhere/ui/button';
import { Icon } from '@formanywhere/ui/icon';
import { BlogCard, BlogPost } from '@formanywhere/marketing';

const MOCK_POSTS: BlogPost[] = [
  {
    id: '1',
    slug: 'capital-confidential-big-short-author',
    title: 'Capital Confidential: ‘Big Short’ author contemplates taking on Brexit',
    excerpt: 'We are thrilled to announce FormAnywhere, a revolutionary new way to build, manage, and analyze forms across all your platforms.',
    author: {
      name: 'Adam Davis',
      avatarUrl: 'https://i.pravatar.cc/150?u=adam',
    },
    publishedAt: 'Mar 16',
    readTime: '1 min',
    tags: ['Technology', 'Business'],
    thumbnailUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=1200&h=600',
    aiSummary: 'FormAnywhere is launching a new, intuitive form builder designed to replace clunky legacy systems. It focuses on seamless data collection and cross-platform management.',
    audioUrl: 'mock-audio.mp3',
    mood: '🚀 Exciting',
    engagementScore: 100000,
    commentsCount: 1000000,
    sharesCount: 15000,
    likedBy: [
      { name: 'Yen', avatarUrl: 'https://i.pravatar.cc/150?u=yen' },
      { name: 'User2', avatarUrl: 'https://i.pravatar.cc/150?u=user2' },
      { name: 'User3', avatarUrl: 'https://i.pravatar.cc/150?u=user3' },
    ]
  },
  {
    id: '2',
    slug: 'the-future-of-data-collection',
    title: 'The Future of Data Collection: Why Forms Still Matter',
    excerpt: 'In an age of AI and chatbots, the humble form remains the most reliable way to collect structured data. Here is why.',
    author: {
      name: 'Sarah Jenkins',
      avatarUrl: 'https://i.pravatar.cc/150?u=sarah',
    },
    publishedAt: 'Mar 15',
    readTime: '4 min',
    tags: ['Design', 'Development'],
    engagementScore: 45000,
    commentsCount: 2300,
    sharesCount: 1200,
    likedBy: [
      { name: 'User4', avatarUrl: 'https://i.pravatar.cc/150?u=user4' },
      { name: 'User5', avatarUrl: 'https://i.pravatar.cc/150?u=user5' },
    ]
  },
  {
    id: '3',
    slug: 'building-accessible-forms',
    title: 'Building Accessible Forms: A Comprehensive Guide',
    excerpt: 'Accessibility is not an afterthought. Learn how to build forms that everyone can use, regardless of their abilities.',
    author: {
      name: 'Marcus Chen',
      avatarUrl: 'https://i.pravatar.cc/150?u=marcus',
    },
    publishedAt: 'Mar 14',
    readTime: '6 min',
    tags: ['Development', 'Design'],
    thumbnailUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=1200&h=600',
    mood: '💡 Informative',
    engagementScore: 89000,
    commentsCount: 5600,
    sharesCount: 3400,
    likedBy: [
      { name: 'User6', avatarUrl: 'https://i.pravatar.cc/150?u=user6' },
      { name: 'User7', avatarUrl: 'https://i.pravatar.cc/150?u=user7' },
      { name: 'User8', avatarUrl: 'https://i.pravatar.cc/150?u=user8' },
    ]
  },
  {
    id: '4',
    slug: 'optimizing-conversion-rates',
    title: 'Optimizing Conversion Rates: 5 Form Design Tweaks',
    excerpt: 'Small changes can lead to big results. Discover 5 simple tweaks you can make to your forms today to boost conversions.',
    author: {
      name: 'Elena Rodriguez',
      avatarUrl: 'https://i.pravatar.cc/150?u=elena',
    },
    publishedAt: 'Mar 12',
    readTime: '3 min',
    tags: ['Business', 'Technology'],
    engagementScore: 120000,
    commentsCount: 8900,
    sharesCount: 4500,
    likedBy: [
      { name: 'User9', avatarUrl: 'https://i.pravatar.cc/150?u=user9' },
      { name: 'User10', avatarUrl: 'https://i.pravatar.cc/150?u=user10' },
    ]
  },
  {
    id: '5',
    slug: 'integrating-with-zapier',
    title: 'Automate Your Workflow: Integrating FormAnywhere with Zapier',
    excerpt: 'Connect your forms to thousands of other apps and automate your data collection workflow with our new Zapier integration.',
    author: {
      name: 'David Kim',
      avatarUrl: 'https://i.pravatar.cc/150?u=david',
    },
    publishedAt: 'Mar 10',
    readTime: '5 min',
    tags: ['Technology', 'Development'],
    thumbnailUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1200&h=600',
    aiSummary: 'Learn how to connect FormAnywhere with Zapier to automate data transfer between your forms and thousands of other applications.',
    engagementScore: 67000,
    commentsCount: 3400,
    sharesCount: 2100,
    likedBy: [
      { name: 'User11', avatarUrl: 'https://i.pravatar.cc/150?u=user11' },
      { name: 'User12', avatarUrl: 'https://i.pravatar.cc/150?u=user12' },
    ]
  }
];

const TRENDING_USERS = [
  { name: 'Adam Davis', role: 'Product Designer', avatarUrl: 'https://i.pravatar.cc/150?u=adam', isFollowing: false },
  { name: 'Sarah Jenkins', role: 'Frontend Engineer', avatarUrl: 'https://i.pravatar.cc/150?u=sarah', isFollowing: true },
  { name: 'Marcus Chen', role: 'UX Researcher', avatarUrl: 'https://i.pravatar.cc/150?u=marcus', isFollowing: false },
  { name: 'Elena Rodriguez', role: 'Growth Marketer', avatarUrl: 'https://i.pravatar.cc/150?u=elena', isFollowing: false },
];

export default function BlogList() {
  const [activeTab, setActiveTab] = createSignal('Recommended');
  const tabs = ['Recommended', 'Latest', 'Trending'];

  return (
    <Box padding="xl" style={{ "max-width": '1400px', margin: '0 auto', background: '#F8F9FA', "min-height": '100vh' }}>
      <Title>Blog - FormAnywhere</Title>
      
      {/* Header Section */}
      <Box style={{ display: 'flex', "align-items": 'center', "justify-content": 'space-between', "margin-bottom": '48px' }}>
        <Typography variant="display-medium" style={{ "font-weight": '900', "letter-spacing": '-0.02em', color: '#1A1A1A' }}>
          Explore
        </Typography>
        
        {/* Search Bar */}
        <Box style={{ display: 'flex', "align-items": 'center', background: '#FFFFFF', padding: '8px 16px', "border-radius": '24px', "box-shadow": '0 2px 12px rgba(0,0,0,0.05)', width: '300px' }}>
          <Icon name="search" style={{ color: '#999999', "margin-right": '8px' }} />
          <input
            type="text"
            placeholder="Search articles..."
            style={{ border: 'none', outline: 'none', background: 'transparent', width: '100%', "font-size": '1rem', color: '#1A1A1A' }}
          />
        </Box>
      </Box>

      <Box style={{ display: 'flex', gap: '48px', "align-items": 'flex-start' }}>
        {/* Main Content Area */}
        <Box style={{ flex: 1 }}>
          {/* Tabs */}
          <Box style={{ display: 'flex', gap: '32px', "margin-bottom": '32px', "border-bottom": '2px solid #E5E5E5' }}>
            <For each={tabs}>
              {(tab) => (
                <Box
                  onClick={() => setActiveTab(tab)}
                  style={{
                    padding: '0 0 16px 0',
                    cursor: 'pointer',
                    position: 'relative',
                    color: activeTab() === tab ? '#1A1A1A' : '#999999',
                    "font-weight": activeTab() === tab ? 'bold' : '500',
                    "font-size": '1.125rem',
                    transition: 'color 0.2s ease',
                  }}
                >
                  {tab}
                  {activeTab() === tab && (
                    <Box
                      style={{
                        position: 'absolute',
                        bottom: '-2px',
                        left: 0,
                        right: 0,
                        height: '2px',
                        background: '#1A1A1A',
                        "border-radius": '2px 2px 0 0',
                      }}
                    />
                  )}
                </Box>
              )}
            </For>
          </Box>

          {/* Masonry Grid */}
          <Box
            style={{
              "column-count": 2,
              "column-gap": '24px',
              "@media (max-width: 768px)": {
                "column-count": 1,
              }
            }}
          >
            <For each={MOCK_POSTS}>
              {(post) => (
                <Box style={{ "break-inside": 'avoid', "margin-bottom": '24px' }}>
                  <BlogCard post={post} />
                </Box>
              )}
            </For>
          </Box>
        </Box>

        {/* Sidebar */}
        <Box style={{ width: '320px', "flex-shrink": 0, position: 'sticky', top: '24px' }}>
          <Box style={{ background: '#FFFFFF', "border-radius": '24px', padding: '24px', "box-shadow": '0 4px 24px rgba(0,0,0,0.04)' }}>
            <Typography variant="title-large" style={{ "font-weight": 'bold', "margin-bottom": '24px', color: '#1A1A1A' }}>
              Trending Users
            </Typography>
            
            <Box style={{ display: 'flex', "flex-direction": 'column', gap: '20px' }}>
              <For each={TRENDING_USERS}>
                {(user) => (
                  <Box style={{ display: 'flex', "align-items": 'center', "justify-content": 'space-between' }}>
                    <Box style={{ display: 'flex', "align-items": 'center', gap: '12px' }}>
                      <img src={user.avatarUrl} alt={user.name} style={{ width: '48px', height: '48px', "border-radius": '50%', "object-fit": 'cover' }} />
                      <Box>
                        <Typography variant="label-large" style={{ "font-weight": 'bold', color: '#1A1A1A' }}>
                          {user.name}
                        </Typography>
                        <Typography variant="body-small" style={{ color: '#999999' }}>
                          {user.role}
                        </Typography>
                      </Box>
                    </Box>
                    <Button
                      variant={user.isFollowing ? "outlined" : "filled"}
                      style={{
                        "border-radius": '20px',
                        padding: '0 16px',
                        height: '32px',
                        "font-size": '0.875rem',
                        background: user.isFollowing ? 'transparent' : '#1A1A1A',
                        color: user.isFollowing ? '#1A1A1A' : '#FFFFFF',
                        border: user.isFollowing ? '1px solid #E5E5E5' : 'none',
                      }}
                    >
                      {user.isFollowing ? 'Following' : 'Follow'}
                    </Button>
                  </Box>
                )}
              </For>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

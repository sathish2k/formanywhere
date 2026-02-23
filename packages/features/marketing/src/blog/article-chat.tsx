/**
 * Feature 1: "Chat with this Article" — AI chat interface floating next to the blog.
 * Readers ask questions and get AI answers based only on the article content.
 */
import { Component, createSignal, For, Show } from 'solid-js';
import { Box } from '@formanywhere/ui/box';
import { HStack, VStack } from '@formanywhere/ui/stack';
import { Typography } from '@formanywhere/ui/typography';
import { IconButton } from '@formanywhere/ui/icon-button';
import { Button } from '@formanywhere/ui/button';
import { Icon } from '@formanywhere/ui/icon';
import { TextField } from '@formanywhere/ui/textfield';
import { Chip } from '@formanywhere/ui/chip';
import { Card } from '@formanywhere/ui/card';
import { FAB } from '@formanywhere/ui/fab';
import { CircularProgress } from '@formanywhere/ui/progress';
import { Divider } from '@formanywhere/ui/divider';
import { chatWithArticle } from './blog-api';

interface ChatMessage {
  role: 'user' | 'ai';
  text: string;
}

export const ArticleChat: Component<{ slug: string }> = (props) => {
  const [isOpen, setIsOpen] = createSignal(false);
  const [messages, setMessages] = createSignal<ChatMessage[]>([]);
  const [input, setInput] = createSignal('');
  const [loading, setLoading] = createSignal(false);
  let chatEndRef!: HTMLDivElement;

  const sendMessage = async (customQuestion?: string) => {
    const question = (customQuestion || input()).trim();
    if (!question || loading()) return;

    setMessages((prev) => [...prev, { role: 'user', text: question }]);
    setInput('');
    setLoading(true);

    try {
      const res = await chatWithArticle(props.slug, question);
      setMessages((prev) => [
        ...prev,
        { role: 'ai', text: res.answer || 'Sorry, I could not find an answer.' },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: 'ai', text: 'Something went wrong. Please try again.' },
      ]);
    } finally {
      setLoading(false);
      setTimeout(() => chatEndRef?.scrollIntoView({ behavior: 'smooth' }), 100);
    }
  };

  const suggestions = [
    'Summarize the key points',
    'Explain the code example',
    'How can I apply this?',
  ];

  return (
    <>
      {/* Floating Chat FAB */}
      <Box
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          'z-index': '1000',
        }}
      >
        <FAB
          variant="primary"
          size="md"
          icon={<Icon name={isOpen() ? 'close' : 'comment'} />}
          onClick={() => setIsOpen(!isOpen())}
        />
      </Box>

      {/* Chat Panel */}
      <Show when={isOpen()}>
        <Card
          variant="elevated"
          style={{
            position: 'fixed',
            bottom: '96px',
            right: '24px',
            width: '400px',
            'max-height': '520px',
            'z-index': '999',
            overflow: 'hidden',
            display: 'flex',
            'flex-direction': 'column',
          }}
        >
          {/* Header */}
          <Box bg="primary" padding="md" style={{ 'border-radius': '16px 16px 0 0' }}>
            <HStack align="center" justify="between">
              <VStack gap="xs">
                <HStack gap="sm" align="center">
                  <Icon name="sparkle" size={20} color="var(--md-sys-color-on-primary)" />
                  <Typography variant="title-medium" style={{ color: 'var(--md-sys-color-on-primary)', 'font-weight': '700' }}>
                    Chat with this Article
                  </Typography>
                </HStack>
                <Typography variant="body-small" style={{ color: 'var(--md-sys-color-on-primary)', opacity: '0.8' }}>
                  Ask any question about what you just read
                </Typography>
              </VStack>
              <IconButton
                variant="standard"
                icon={<Icon name="close" color="var(--md-sys-color-on-primary)" />}
                onClick={() => setIsOpen(false)}
              />
            </HStack>
          </Box>

          {/* Messages */}
          <VStack
            gap="sm"
            style={{
              flex: '1',
              'overflow-y': 'auto',
              padding: '16px',
              'min-height': '200px',
              'max-height': '340px',
            }}
          >
            <Show when={messages().length === 0}>
              <VStack align="center" gap="md" style={{ 'margin-top': '32px' }}>
                <Icon name="ai" size={40} color="var(--md-sys-color-primary)" />
                <Typography variant="body-medium" color="on-surface-variant" align="center">
                  Ask me anything about this article!
                </Typography>
                <VStack gap="xs" fullWidth>
                  <For each={suggestions}>
                    {(s) => (
                      <Chip
                        variant="suggestion"
                        label={s}
                        onClick={() => sendMessage(s)}
                        style={{ 'justify-content': 'center' }}
                      />
                    )}
                  </For>
                </VStack>
              </VStack>
            </Show>

            <For each={messages()}>
              {(msg) => (
                <Box
                  rounded="lg"
                  padding="sm"
                  bg={msg.role === 'user' ? 'primary' : 'surface-variant'}
                  style={{
                    'align-self': msg.role === 'user' ? 'flex-end' : 'flex-start',
                    'max-width': '85%',
                    'border-radius':
                      msg.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                  }}
                >
                  {msg.role === 'ai' ? (
                    <Box
                      style={{
                        'font-size': 'var(--md-sys-typescale-body-medium-size, 0.875rem)',
                        'line-height': '1.5',
                        'word-break': 'break-word',
                        color: 'var(--md-sys-color-on-surface)',
                      }}
                      innerHTML={msg.text}
                    />
                  ) : (
                    <Typography
                      variant="body-medium"
                      style={{
                        color: 'var(--md-sys-color-on-primary)',
                        'line-height': '1.5',
                        'word-break': 'break-word',
                      }}
                    >
                      {msg.text}
                    </Typography>
                  )}
                </Box>
              )}
            </For>

            <Show when={loading()}>
              <HStack gap="sm" align="center" style={{ 'align-self': 'flex-start' }}>
                <CircularProgress indeterminate size={20} />
                <Typography variant="body-small" color="on-surface-variant">
                  Thinking...
                </Typography>
              </HStack>
            </Show>
            <div ref={chatEndRef} />
          </VStack>

          {/* Input */}
          <Divider />
          <Box padding="sm">
            <HStack gap="sm" align="center">
              <Box style={{ flex: '1' }}>
                <TextField
                  variant="outlined"
                  placeholder="Ask a question..."
                  value={input()}
                  onInput={(e: InputEvent) => setInput((e.target as HTMLInputElement).value)}
                  size="sm"
                  ref={(el: HTMLElement) => {
                    el.addEventListener('keydown', (e: KeyboardEvent) => {
                      if (e.key === 'Enter') sendMessage();
                    });
                  }}
                />
              </Box>
              <IconButton
                variant="filled"
                icon={<Icon name="arrow-up" />}
                onClick={() => sendMessage()}
                disabled={loading() || !input().trim()}
              />
            </HStack>
          </Box>
        </Card>
      </Show>
    </>
  );
};

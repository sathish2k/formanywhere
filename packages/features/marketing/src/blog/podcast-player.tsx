/**
 * Feature 3: AI Podcast Player — Listen to any blog article.
 * Supports OpenAI TTS audio URLs and browser-based TTS fallback.
 */
import { Component, createSignal, createEffect, Show, onCleanup } from 'solid-js';
import { Box } from '@formanywhere/ui/box';
import { Stack } from '@formanywhere/ui/stack';
import { Typography } from '@formanywhere/ui/typography';
import { IconButton } from '@formanywhere/ui/icon-button';
import { Button } from '@formanywhere/ui/button';
import { Icon } from '@formanywhere/ui/icon';
import { Card } from '@formanywhere/ui/card';
import { LinearProgress, CircularProgress } from '@formanywhere/ui/progress';
import { generateAudio } from './blog-api';

export const PodcastPlayer: Component<{
  slug: string;
  audioUrl?: string | null;
  title: string;
}> = (props) => {
  const [isPlaying, setIsPlaying] = createSignal(false);
  const [isLoading, setIsLoading] = createSignal(false);
  const [progress, setProgress] = createSignal(0);
  const [duration, setDuration] = createSignal(0);
  const [audioSrc, setAudioSrc] = createSignal<string | null>(props.audioUrl || null);
  const [ttsScript, setTtsScript] = createSignal<string | null>(null);
  const [isExpanded, setIsExpanded] = createSignal(false);

  let audioRef: HTMLAudioElement | undefined;
  let utterance: SpeechSynthesisUtterance | undefined;

  createEffect(() => {
    const url = audioSrc();
    if (url?.startsWith('tts:')) {
      setTtsScript(url.slice(4));
      setAudioSrc(null);
    }
  });

  const handleGenerate = async () => {
    setIsLoading(true);
    try {
      const result = await generateAudio(props.slug);
      if (result.method === 'browser-tts' && result.script) {
        setTtsScript(result.script);
      } else if (result.audioUrl) {
        setAudioSrc(result.audioUrl);
      }
    } catch (err) {
      console.error('Audio generation failed:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const playAudio = () => {
    if (audioSrc()) {
      if (!audioRef) {
        audioRef = new Audio(audioSrc()!);
        audioRef.addEventListener('timeupdate', () => {
          setProgress(audioRef!.currentTime);
          setDuration(audioRef!.duration || 0);
        });
        audioRef.addEventListener('ended', () => setIsPlaying(false));
      }
      if (isPlaying()) {
        audioRef.pause();
      } else {
        audioRef.play();
      }
      setIsPlaying(!isPlaying());
    } else if (ttsScript()) {
      if (typeof speechSynthesis === 'undefined') return;
      if (isPlaying()) {
        speechSynthesis.cancel();
        setIsPlaying(false);
      } else {
        utterance = new SpeechSynthesisUtterance(ttsScript()!);
        utterance.rate = 1.0;
        utterance.pitch = 1.0;
        utterance.onend = () => setIsPlaying(false);
        speechSynthesis.speak(utterance);
        setIsPlaying(true);
      }
    }
  };

  onCleanup(() => {
    audioRef?.pause();
    if (typeof speechSynthesis !== 'undefined') speechSynthesis.cancel();
  });

  const formatTime = (seconds: number) => {
    if (!seconds || isNaN(seconds)) return '0:00';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const hasAudio = () => !!audioSrc() || !!ttsScript();

  return (
    <Card
      variant="filled"
      padding="md"
      style={{
        'margin-bottom': '32px',
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
        color: '#fff',
      }}
    >
      <Stack direction="row" gap="md" align="center">
        {/* Play / Generate Button */}
        <IconButton
          variant="filled-tonal"
          icon={
            <Icon
              name={isLoading() ? 'refresh-cw' : isPlaying() ? 'pause' : hasAudio() ? 'play' : 'headset'}
              color="#fff"
            />
          }
          onClick={hasAudio() ? playAudio : handleGenerate}
          disabled={isLoading()}
          style={{
            background: isPlaying()
              ? '#ff6b6b'
              : 'linear-gradient(135deg, #00b4d8, #0077b6)',
          }}
        />

        <Stack gap="xs" style={{ flex: '1', 'min-width': '0' }}>
          <Typography variant="label-large" noWrap style={{ color: '#fff' }}>
            {hasAudio() ? '🎧 Listen to this Article' : '🎧 Generate AI Podcast'}
          </Typography>
          <Typography variant="body-small" style={{ color: '#a0aec0' }}>
            {isLoading()
              ? 'Generating audio...'
              : hasAudio()
                ? ttsScript()
                  ? 'Browser TTS'
                  : 'AI-Generated Audio'
                : 'Click to create a podcast version'}
          </Typography>
        </Stack>

        {/* Time display */}
        <Show when={hasAudio() && duration() > 0}>
          <Typography variant="body-small" style={{ color: '#a0aec0', 'flex-shrink': '0' }}>
            {formatTime(progress())} / {formatTime(duration())}
          </Typography>
        </Show>

        <IconButton
          variant="standard"
          icon={<Icon name={isExpanded() ? 'chevron-down' : 'chevron-right'} color="#fff" />}
          onClick={() => setIsExpanded(!isExpanded())}
        />
      </Stack>

      {/* Progress bar */}
      <Show when={hasAudio() && isPlaying()}>
        <Box style={{ 'margin-top': '12px' }}>
          <LinearProgress
            value={duration() ? (progress() / duration()) * 100 : 0}
            color="var(--md-sys-color-primary)"
          />
        </Box>
      </Show>

      {/* Loading indicator */}
      <Show when={isLoading()}>
        <Box style={{ 'margin-top': '12px' }}>
          <LinearProgress indeterminate />
        </Box>
      </Show>

      {/* Expanded: show script */}
      <Show when={isExpanded() && ttsScript()}>
        <Card
          variant="outlined"
          padding="md"
          style={{
            'margin-top': '16px',
            background: 'rgba(255,255,255,0.05)',
            'border-color': 'rgba(255,255,255,0.1)',
          }}
        >
          <Typography variant="label-large" style={{ 'margin-bottom': '8px', color: '#fff' }}>
            📝 Podcast Script
          </Typography>
          <Typography variant="body-medium" style={{ 'line-height': '1.6', color: '#cbd5e0' }}>
            {ttsScript()}
          </Typography>
        </Card>
      </Show>
    </Card>
  );
};

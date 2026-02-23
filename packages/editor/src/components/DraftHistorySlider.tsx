import { Component, createSignal, createEffect } from 'solid-js';
import { Box } from '@formanywhere/ui/box';
import { Icon } from '@formanywhere/ui/icon';
import { IconButton } from '@formanywhere/ui/icon-button';

interface Props {
  history: any[];
  onRestore: (content: string) => void;
}

export const DraftHistorySlider: Component<Props> = (props) => {
  const [currentIndex, setCurrentIndex] = createSignal(props.history.length - 1);
  const [isPlaying, setIsPlaying] = createSignal(false);
  let playInterval: any;

  createEffect(() => {
    if (props.history.length > 0 && currentIndex() === -1) {
      setCurrentIndex(props.history.length - 1);
    }
  });

  const handleSliderChange = (e: Event) => {
    const target = e.target as HTMLInputElement;
    const index = parseInt(target.value, 10);
    setCurrentIndex(index);
    if (props.history[index]) {
      props.onRestore(props.history[index].content);
    }
  };

  const togglePlay = () => {
    if (isPlaying()) {
      clearInterval(playInterval);
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      if (currentIndex() >= props.history.length - 1) {
        setCurrentIndex(0);
        props.onRestore(props.history[0].content);
      }
      
      playInterval = setInterval(() => {
        setCurrentIndex(prev => {
          const next = prev + 1;
          if (next >= props.history.length) {
            clearInterval(playInterval);
            setIsPlaying(false);
            return prev;
          }
          props.onRestore(props.history[next].content);
          return next;
        });
      }, 500);
    }
  };

  if (props.history.length <= 1) return null;

  return (
    <Box class="draft-history-slider" style={{
      position: 'fixed',
      bottom: '20px',
      left: '50%',
      transform: 'translateX(-50%)',
      'background-color': 'white',
      padding: '12px 24px',
      'border-radius': '30px',
      'box-shadow': '0 4px 20px rgba(0,0,0,0.15)',
      display: 'flex',
      'align-items': 'center',
      gap: '16px',
      'z-index': 1000,
      width: '400px',
      border: '1px solid #e2e8f0'
    }}>
      <IconButton
        variant="text"
        size="sm"
        icon={<Icon name={isPlaying() ? 'pause' : 'play'} size={20} />}
        onClick={togglePlay}
        aria-label={isPlaying() ? 'Pause history' : 'Play history'}
      />
      
      <input
        type="range"
        min="0"
        max={Math.max(0, props.history.length - 1)}
        value={currentIndex()}
        onInput={handleSliderChange}
        style={{ flex: 1, cursor: 'pointer' }}
      />
      
      <div style={{ 'font-size': '12px', color: '#64748b', 'min-width': '40px', 'text-align': 'right' }}>
        {currentIndex() + 1} / {props.history.length}
      </div>
    </Box>
  );
};

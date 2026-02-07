import styles from './PresetButtons.module.css';

const PRESETS = [
  '!r 1500',
  '!r 2000 mod=hidden',
  '!r 1500 mod=hardrock stars=4.52 bpm=93',
  '!r 2500 mod=doubletime',
  '!r 1800 stars=5.5',
  '!r',
  '!help',
];

interface Props {
  onSelect: (command: string) => void;
}

export function PresetButtons({ onSelect }: Props) {
  return (
    <div className={styles.presets}>
      {PRESETS.map((cmd) => (
        <button
          key={cmd}
          className={styles.preset}
          onClick={() => onSelect(cmd)}
        >
          {cmd === '!r' ? '!r (random)' : cmd}
        </button>
      ))}
    </div>
  );
}

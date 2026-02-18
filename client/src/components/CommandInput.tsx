import { forwardRef, useState, type KeyboardEvent } from 'react';
import styles from './CommandInput.module.css';

interface Props {
  onSubmit: (command: string) => void;
  loading: boolean;
}

export const CommandInput = forwardRef<HTMLInputElement, Props>(
  ({ onSubmit, loading }, ref) => {
    const [value, setValue] = useState('');

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && !loading) {
        onSubmit(value);
      }
    };

    return (
      <div className={styles.row}>
        <input
          ref={ref}
          type="text"
          className={styles.input}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a command, e.g. !r 1500 mod=hardrock"
          autoFocus
        />
        <button
          className={styles.button}
          onClick={() => onSubmit(value)}
          disabled={loading}
        >
          {loading ? 'Loading...' : 'Send'}
        </button>
      </div>
    );
  }
);

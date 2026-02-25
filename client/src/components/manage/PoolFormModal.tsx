import { useState } from 'react';
import type { PoolData, CreatePoolPayload } from '../../types';
import styles from './PoolFormModal.module.css';

interface PoolFormModalProps {
  pool?: PoolData;
  onSave: (data: CreatePoolPayload) => Promise<void>;
  onClose: () => void;
}

export function PoolFormModal({ pool, onSave, onClose }: PoolFormModalProps) {
  const [name, setName] = useState(pool?.name ?? '');
  const [version, setVersion] = useState(pool?.version ?? 1);
  const [averageMMR, setAverageMMR] = useState(pool?.averageMMR ?? 1500);
  const [link, setLink] = useState(pool?.link ?? '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEdit = !!pool;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Name is required');
      return;
    }

    setSaving(true);
    setError(null);
    try {
      await onSave({
        name: name.trim(),
        version,
        averageMMR,
        ...(link.trim() ? { link: link.trim() } : {}),
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save');
      setSaving(false);
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h3 className={styles.title}>
          {isEdit ? 'Edit Pool' : 'Create Pool'}
        </h3>

        {error && <div className={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className={styles.field}>
            <label className={styles.label}>Name *</label>
            <input
              className={styles.input}
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Grand Finals Pool"
              autoFocus
            />
          </div>

          <div className={styles.row}>
            <div className={styles.field}>
              <label className={styles.label}>Version</label>
              <input
                className={styles.input}
                type="number"
                value={version}
                onChange={(e) => setVersion(Number(e.target.value))}
                min={0}
              />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Average MMR *</label>
              <input
                className={styles.input}
                type="number"
                value={averageMMR}
                onChange={(e) => setAverageMMR(Number(e.target.value))}
                min={0}
                step={50}
              />
            </div>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Link (optional)</label>
            <input
              className={styles.input}
              type="text"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              placeholder="https://..."
            />
          </div>

          <div className={styles.buttons}>
            <button
              type="button"
              className={styles.cancelBtn}
              onClick={onClose}
              disabled={saving}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={styles.saveBtn}
              disabled={saving}
            >
              {saving ? 'Saving...' : isEdit ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

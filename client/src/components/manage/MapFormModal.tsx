import { useState } from 'react';
import type { MapData, CreateMapPayload } from '../../types';
import { osuApi } from '../../api';
import styles from './MapFormModal.module.css';

const VALID_MODS = [
  'NOMOD',
  'FREEMOD',
  'HIDDEN',
  'HARDROCK',
  'DOUBLETIME',
  'TIEBREAKER',
];

interface MapFormModalProps {
  poolId: number;
  poolName: string;
  map?: MapData;
  onSave: (data: CreateMapPayload) => Promise<void>;
  onClose: () => void;
}

export function MapFormModal({
  poolName,
  map,
  onSave,
  onClose,
}: MapFormModalProps) {
  const isEdit = !!map;

  // Lookup state
  const [lookupId, setLookupId] = useState('');
  const [lookupLoading, setLookupLoading] = useState(false);
  const [lookupError, setLookupError] = useState<string | null>(null);
  const [lookupSuccess, setLookupSuccess] = useState(false);

  // Form state
  const [mapId, setMapId] = useState(map?.mapId ?? 0);
  const [mapName, setMapName] = useState(map?.mapName ?? '');
  const [difficultyName, setDifficultyName] = useState(
    map?.difficultyName ?? '',
  );
  const [mapSetId, setMapSetId] = useState(map?.mapSetId ?? 0);
  const [length, setLength] = useState(map?.length ?? 0);
  const [starRating, setStarRating] = useState(map?.starRating ?? 0);
  const [maxCombo, setMaxCombo] = useState(map?.maxCombo ?? 0);
  const [bpm, setBpm] = useState(map?.bpm ?? 0);
  const [downloadAvailable, setDownloadAvailable] = useState(
    map?.downloadAvailable ?? true,
  );
  const [mod, setMod] = useState(map?.mod ?? 'NOMOD');
  const [mmr, setMmr] = useState(map?.mmr ?? 0);
  const [skillset, setSkillset] = useState(map?.skillset ?? 'NOT_DEFINED');
  const [sheetId, setSheetId] = useState(map?.sheetId ?? 'manual');
  const [mapPoolName, setMapPoolName] = useState(map?.poolName ?? poolName);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLookup = async () => {
    const id = parseInt(lookupId, 10);
    if (!id || id <= 0) {
      setLookupError('Enter a valid beatmap ID');
      return;
    }

    setLookupLoading(true);
    setLookupError(null);
    setLookupSuccess(false);

    try {
      const result = await osuApi.lookupBeatmap(id);
      setMapId(result.mapId);
      setMapName(result.mapName);
      setDifficultyName(result.difficultyName);
      setMapSetId(result.mapSetId);
      setLength(result.length);
      setStarRating(result.starRating);
      setMaxCombo(result.maxCombo);
      setBpm(result.bpm);
      setDownloadAvailable(result.downloadAvailable);
      setLookupSuccess(true);
    } catch (err) {
      setLookupError(
        err instanceof Error ? err.message : 'Lookup failed',
      );
    } finally {
      setLookupLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!mapName.trim()) {
      setError('Map name is required');
      return;
    }
    if (mapId <= 0) {
      setError('Map ID is required');
      return;
    }

    setSaving(true);
    setError(null);

    try {
      await onSave({
        mapId,
        mod,
        mapName: mapName.trim(),
        difficultyName: difficultyName.trim(),
        length,
        starRating,
        mapSetId,
        maxCombo,
        bpm,
        downloadAvailable,
        mmr,
        skillset: skillset.trim() || 'NOT_DEFINED',
        sheetId: sheetId.trim() || 'manual',
        poolName: mapPoolName.trim() || poolName,
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
          {isEdit ? 'Edit Map' : 'Add Map'}
        </h3>

        {/* osu! Lookup section */}
        {!isEdit && (
          <div className={styles.lookupSection}>
            <div className={styles.lookupLabel}>
              Auto-fill from osu! beatmap ID
            </div>
            <div className={styles.lookupRow}>
              <input
                className={styles.input}
                type="number"
                value={lookupId}
                onChange={(e) => setLookupId(e.target.value)}
                placeholder="Enter beatmap ID"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleLookup();
                  }
                }}
              />
              <button
                type="button"
                className={styles.lookupBtn}
                onClick={handleLookup}
                disabled={lookupLoading}
              >
                {lookupLoading ? 'Looking up...' : 'Lookup'}
              </button>
            </div>
            {lookupError && (
              <div className={styles.lookupError}>{lookupError}</div>
            )}
            {lookupSuccess && (
              <div className={styles.lookupSuccess}>
                Found: {mapName} [{difficultyName}]
              </div>
            )}
          </div>
        )}

        {error && <div className={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit}>
          {/* Core fields */}
          <div className={styles.row}>
            <div className={styles.field}>
              <label className={styles.label}>Map ID *</label>
              <input
                className={styles.input}
                type="number"
                value={mapId || ''}
                onChange={(e) => setMapId(Number(e.target.value))}
              />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Map Set ID</label>
              <input
                className={styles.input}
                type="number"
                value={mapSetId || ''}
                onChange={(e) => setMapSetId(Number(e.target.value))}
              />
            </div>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Map Name *</label>
            <input
              className={styles.input}
              type="text"
              value={mapName}
              onChange={(e) => setMapName(e.target.value)}
              placeholder="Song title"
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Difficulty Name</label>
            <input
              className={styles.input}
              type="text"
              value={difficultyName}
              onChange={(e) => setDifficultyName(e.target.value)}
              placeholder="Difficulty name"
            />
          </div>

          {/* Stats row */}
          <div className={styles.row}>
            <div className={styles.field}>
              <label className={styles.label}>Star Rating</label>
              <input
                className={styles.input}
                type="number"
                step="0.01"
                value={starRating || ''}
                onChange={(e) => setStarRating(Number(e.target.value))}
              />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>BPM</label>
              <input
                className={styles.input}
                type="number"
                value={bpm || ''}
                onChange={(e) => setBpm(Number(e.target.value))}
              />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Length (sec)</label>
              <input
                className={styles.input}
                type="number"
                value={length || ''}
                onChange={(e) => setLength(Number(e.target.value))}
              />
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.field}>
              <label className={styles.label}>Max Combo</label>
              <input
                className={styles.input}
                type="number"
                value={maxCombo || ''}
                onChange={(e) => setMaxCombo(Number(e.target.value))}
              />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>MMR *</label>
              <input
                className={styles.input}
                type="number"
                value={mmr || ''}
                onChange={(e) => setMmr(Number(e.target.value))}
              />
            </div>
          </div>

          {/* Mod and settings */}
          <div className={styles.row}>
            <div className={styles.field}>
              <label className={styles.label}>Mod *</label>
              <select
                className={styles.input}
                value={mod}
                onChange={(e) => setMod(e.target.value)}
              >
                {VALID_MODS.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Skillset</label>
              <input
                className={styles.input}
                type="text"
                value={skillset}
                onChange={(e) => setSkillset(e.target.value)}
              />
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.field}>
              <label className={styles.label}>Sheet ID</label>
              <input
                className={styles.input}
                type="text"
                value={sheetId}
                onChange={(e) => setSheetId(e.target.value)}
              />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Pool Name</label>
              <input
                className={styles.input}
                type="text"
                value={mapPoolName}
                onChange={(e) => setMapPoolName(e.target.value)}
              />
            </div>
          </div>

          <div className={styles.checkboxField}>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={downloadAvailable}
                onChange={(e) => setDownloadAvailable(e.target.checked)}
              />
              <span>Download available</span>
            </label>
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
              {saving ? 'Saving...' : isEdit ? 'Update' : 'Add Map'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

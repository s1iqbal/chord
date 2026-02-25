import {
  Injectable,
  Logger,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

interface OsuToken {
  access_token: string;
  expires_at: number;
}

export interface BeatmapMetadata {
  mapId: number;
  mapSetId: number;
  mapName: string;
  difficultyName: string;
  length: number;
  starRating: number;
  maxCombo: number;
  bpm: number;
  downloadAvailable: boolean;
}

@Injectable()
export class OsuService {
  private readonly logger = new Logger(OsuService.name);
  private token: OsuToken | null = null;

  constructor(private configService: ConfigService) {}

  private async getToken(): Promise<string> {
    if (this.token && Date.now() < this.token.expires_at - 60_000) {
      return this.token.access_token;
    }

    const clientId = this.configService.get<string>('OSU_CLIENT_ID');
    const clientSecret = this.configService.get<string>('OSU_CLIENT_SECRET');

    if (!clientId || !clientSecret) {
      throw new HttpException(
        'osu! API credentials not configured. Set OSU_CLIENT_ID and OSU_CLIENT_SECRET environment variables.',
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }

    const res = await fetch('https://osu.ppy.sh/oauth/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id: parseInt(clientId, 10),
        client_secret: clientSecret,
        grant_type: 'client_credentials',
        scope: 'public',
      }),
    });

    if (!res.ok) {
      this.logger.error(`osu! OAuth token request failed: ${res.status}`);
      throw new HttpException(
        'Failed to authenticate with osu! API',
        HttpStatus.BAD_GATEWAY,
      );
    }

    const data = await res.json();
    this.token = {
      access_token: data.access_token,
      expires_at: Date.now() + data.expires_in * 1000,
    };

    return this.token.access_token;
  }

  async getBeatmap(beatmapId: number): Promise<BeatmapMetadata> {
    const token = await this.getToken();

    const res = await fetch(
      `https://osu.ppy.sh/api/v2/beatmaps/${beatmapId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );

    if (!res.ok) {
      if (res.status === 404) {
        throw new HttpException(
          `Beatmap ${beatmapId} not found`,
          HttpStatus.NOT_FOUND,
        );
      }
      this.logger.error(`osu! API beatmap request failed: ${res.status}`);
      throw new HttpException(
        'osu! API request failed',
        HttpStatus.BAD_GATEWAY,
      );
    }

    const data = await res.json();

    return {
      mapId: data.id,
      mapSetId: data.beatmapset_id,
      mapName: data.beatmapset?.title ?? `Beatmap ${data.id}`,
      difficultyName: data.version,
      length: data.total_length,
      starRating: parseFloat(data.difficulty_rating.toFixed(2)),
      maxCombo: data.max_combo ?? 0,
      bpm: Math.round(data.bpm),
      downloadAvailable: !data.beatmapset?.availability?.download_disabled,
    };
  }
}

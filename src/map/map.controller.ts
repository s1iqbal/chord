import { Controller, Get, Query } from '@nestjs/common';
import { MapService } from './map.service';

const MMR_MIN = 1150;
const MMR_MAX = 3300;
const MMR_RANGE = 50;

@Controller('recommend')
export class MapController {
  constructor(private mapService: MapService) {}

  /**
   * GET /recommend?command=!r 1500 mod=hardrock stars=4.52 bpm=93
   *
   * Simulates the IRC bot command and returns the result as JSON.
   */
  @Get()
  async recommend(@Query('command') command: string) {
    if (!command) {
      return {
        error: 'Missing "command" query parameter',
        usage: 'GET /recommend?command=!r 1500 mod=hardrock stars=4.52',
        examples: [
          '!r 1500',
          '!r 2000 mod=hidden',
          '!r 1500 mod=hardrock stars=4.52 bpm=93',
          '!r',
          '!help',
        ],
      };
    }

    const parts = command.trim().split(/\s+/);
    const cmd = parts[0]?.toLowerCase();

    if (cmd === '!help' || cmd === '!commands') {
      return {
        command,
        messages: [
          '!r (MMR) stars=(1-10) bpm=(50-300) mod=(hardrock, hidden, doubletime, freemod, nomod, tiebreaker)',
          'THE MMR IS REQUIRED RIGHT AFTER !r Example: "!r 1500 mod=hardrock stars=4.52 bpm=93"',
        ],
      };
    }

    if (cmd === '!hello') {
      return { command, messages: ['Hello, test-user'] };
    }

    if (cmd !== '!r' && cmd !== '!request') {
      return { error: `Unknown command: ${cmd}` };
    }

    // !r with MMR only
    if (parts.length === 2 && !isNaN(+parts[1])) {
      const mmr = +parts[1];
      if (mmr < MMR_MIN || mmr > MMR_MAX) {
        return {
          command,
          messages: [`MMR must be between ${MMR_MIN} and ${MMR_MAX}.`],
        };
      }

      const maps = await this.mapService.findMaps(mmr, MMR_RANGE);
      const picked = this.mapService.pickRandom(maps);
      const result = this.mapService.formatMessage(picked);
      return this.buildResponse(command, result, maps.length, picked);
    }

    // !r with MMR + filters
    if (parts.length > 2 && !isNaN(+parts[1])) {
      const mmr = +parts[1];
      const filters = this.mapService.parseFilters(command);
      const maps = await this.mapService.findMaps(mmr, MMR_RANGE, filters);
      const picked = this.mapService.pickRandom(maps);
      const result = this.mapService.formatMessage(picked);
      return this.buildResponse(command, result, maps.length, picked, filters);
    }

    // !r with no MMR — random
    const mmr = Math.floor(Math.random() * (MMR_MAX - MMR_MIN + 1) + MMR_MIN);
    const maps = await this.mapService.findMaps(mmr, MMR_RANGE);
    const picked = this.mapService.pickRandom(maps);
    const result = this.mapService.formatMessage(picked);
    const intro = `Random MMR Selected - MMR: ${mmr - MMR_RANGE} - ${mmr + MMR_RANGE}`;

    const messages =
      typeof result === 'string' ? [intro, result] : [intro, ...result];

    return {
      command,
      randomMMR: mmr,
      totalMatches: maps.length,
      messages,
      map: picked || null,
    };
  }

  private buildResponse(
    command: string,
    result: string | [string, string],
    totalMatches: number,
    map: any,
    filters?: any,
  ) {
    const messages = typeof result === 'string' ? [result] : result;
    return {
      command,
      totalMatches,
      messages,
      map: map || null,
      ...(filters ? { filtersApplied: filters } : {}),
    };
  }
}

import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MapService } from '../map/map.service';
import * as Banchojs from 'bancho.js';
import Bottleneck from 'bottleneck';

const PREFIX = '!';
const MMR_MIN = 1150;
const MMR_MAX = 3300;
const MMR_RANGE = 50;

@Injectable()
export class BotService implements OnModuleInit {
  private readonly logger = new Logger(BotService.name);
  private client: Banchojs.BanchoClient;
  private limiter: Bottleneck;

  constructor(
    private configService: ConfigService,
    private mapService: MapService,
  ) {
    this.limiter = new Bottleneck({
      reservoir: 9,
      reservoirRefreshAmount: 9,
      reservoirRefreshInterval: 5 * 1000,
      maxConcurrent: 1,
      minTime: 333,
    });
  }

  async onModuleInit() {
    const username = this.configService.get<string>('IRC_USERNAME');
    const password = this.configService.get<string>('IRC_PASSWORD');

    if (!username || !password) {
      this.logger.warn('IRC_USERNAME or IRC_PASSWORD not set, bot will not start');
      return;
    }

    this.client = new Banchojs.BanchoClient({ username, password });

    try {
      await this.client.connect();
      this.logger.log('Connected to osu! Bancho IRC');
      this.client.on('PM', this.handlePM.bind(this));
    } catch (err) {
      this.logger.error('Failed to connect to Bancho', err);
    }
  }

  private async handlePM({ message, user }: { message: string; user: any }) {
    const username = this.configService.get<string>('IRC_USERNAME');
    if (user.ircUsername === username) return;

    this.logger.log(`USER: '${user.ircUsername}' MESSAGE: '${message}'`);

    if (message[0] !== PREFIX) return;

    const parts = message.split(' ');
    const command = parts[0].toLowerCase();

    switch (command) {
      case `${PREFIX}hello`:
        return this.scheduleMessages(user, [`Hello, ${user.ircUsername}`]);

      case `${PREFIX}help`:
      case `${PREFIX}commands`:
        return this.scheduleMessages(user, [
          `!r (MMR) stars=(1-10) bpm=(50-300) mod=(hardrock, hidden, doubletime, freemod, nomod, tiebreaker)`,
          `THE MMR IS REQUIRED RIGHT AFTER !r Example: "!r 1500 mod=hardrock stars=4.52 bpm=93`,
        ]);

      case `${PREFIX}request`:
      case `${PREFIX}r`:
        return this.handleRecommend(user, parts, message);
    }
  }

  private async handleRecommend(user: any, parts: string[], rawMessage: string) {
    // !r <MMR> [filters...]
    if (parts.length === 2 && !isNaN(+parts[1])) {
      const mmr = +parts[1];
      if (mmr < MMR_MIN || mmr > MMR_MAX) {
        return this.scheduleMessages(user, [
          `MMR must be between ${MMR_MIN} and ${MMR_MAX}.`,
        ]);
      }

      const maps = await this.mapService.findMaps(mmr, MMR_RANGE);
      const result = this.mapService.formatMessage(this.mapService.pickRandom(maps));
      return this.sendResult(user, result);
    }

    if (parts.length > 2 && !isNaN(+parts[1])) {
      const mmr = +parts[1];
      const filters = this.mapService.parseFilters(rawMessage);
      const maps = await this.mapService.findMaps(mmr, MMR_RANGE, filters);
      const result = this.mapService.formatMessage(this.mapService.pickRandom(maps));
      return this.sendResult(user, result);
    }

    // No MMR provided — random
    const mmr = Math.floor(Math.random() * (MMR_MAX - MMR_MIN + 1) + MMR_MIN);
    const maps = await this.mapService.findMaps(mmr, MMR_RANGE);
    const result = this.mapService.formatMessage(this.mapService.pickRandom(maps));
    const intro = `Random MMR Selected - MMR: ${mmr - MMR_RANGE} - ${mmr + MMR_RANGE} - Please use !r 1150 to request a map with 1150 mmr. Use !commands to view more`;

    if (typeof result === 'string') {
      return this.scheduleMessages(user, [intro, result]);
    }
    return this.scheduleMessages(user, [intro, ...result]);
  }

  private async sendResult(user: any, result: string | [string, string]) {
    if (typeof result === 'string') {
      return this.scheduleMessages(user, [result]);
    }
    return this.scheduleMessages(user, result);
  }

  private async scheduleMessages(user: any, messages: string[]) {
    const task = async () => {
      await Promise.all(messages.map((msg) => user.sendMessage(msg)));
    };
    return this.limiter.schedule({ weight: messages.length }, task);
  }
}

import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import configuration from '../config/configuration';
import { ContentfulService } from '../contentful/contentful.service';

@Injectable()
export class TasksService {
  private readonly cron = configuration().cron;

  constructor(private readonly contentful: ContentfulService) {}

  @Cron('0 * * * *')
  async handleSync() {
    console.log('----- Syncing products from Contentful -----');
    await this.contentful.syncProducts();
  }

  async manualSync(): Promise<{ synced: number }> {
    return await this.contentful.syncProducts();
  }
}

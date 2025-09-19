import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import configuration from '../config/configuration';
import { ProductsService } from '../products/products.service';

// Contentful API types
interface ContentfulSys {
  id: string;
  type: string;
  createdAt: string;
  updatedAt: string;
  revision: number;
}

interface ContentfulLocalizedField<T = string> {
  'en-US'?: T;
  [locale: string]: T | undefined;
}

interface ContentfulProductFields {
  name?: ContentfulLocalizedField<string> | string;
  category?: ContentfulLocalizedField<string> | string;
  price?: ContentfulLocalizedField<number> | number;
}

interface ContentfulEntry {
  sys: ContentfulSys;
  fields: ContentfulProductFields;
}

interface ContentfulResponse {
  items: ContentfulEntry[];
  total: number;
  skip: number;
  limit: number;
}

@Injectable()
export class ContentfulService {
  private readonly logger = new Logger(ContentfulService.name);
  private readonly cfg = configuration();

  constructor(private readonly productsService: ProductsService) {}

  async testConnection() {
    const { space, token, env } = this.cfg.contentful;
    const url = `https://cdn.contentful.com/spaces/${space}/environments/${env}/entries`;
    const params = {
      access_token: token,
    };
    const { data } = await axios.get<ContentfulResponse>(url, { params });
    return data;
  }

  async fetchProducts(): Promise<ContentfulEntry[]> {
    const { space, token, env, type } = this.cfg.contentful;
    const url = `https://cdn.contentful.com/spaces/${space}/environments/${env}/entries`;
    const params = {
      access_token: token,
      content_type: type,
      include: 0,
      limit: 1000,
    };
    const { data } = await axios.get<ContentfulResponse>(url, { params });
    return data?.items ?? [];
  }

  mapEntryToProduct(entry: ContentfulEntry) {
    const fields = entry.fields || {};

    const getFieldValue = <T>(
      field: ContentfulLocalizedField<T> | T | undefined,
    ): T | null => {
      if (field === undefined || field === null) return null;
      if (typeof field === 'object' && field !== null) {
        return (field as ContentfulLocalizedField<T>)['en-US'] ?? null;
      }
      return field as T;
    };

    const name = getFieldValue(fields.name) ?? '';
    const category = getFieldValue(fields.category);
    const priceRaw = getFieldValue(fields.price);
    const price = priceRaw != null ? String(priceRaw) : null;

    return {
      contentfulId: entry.sys?.id,
      name,
      category,
      price,
    };
  }

  async syncProducts(): Promise<{ synced: number }> {
    try {
      const items = await this.fetchProducts();
      let upserts = 0;
      for (const item of items) {
        const mapped = this.mapEntryToProduct(item);
        if (!mapped.contentfulId) continue;
        await this.productsService.upsertFromContentful(mapped);
        upserts++;
      }
      this.logger.log(`Synced ${upserts} products from Contentful`);
      return { synced: upserts };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      this.logger.error(`Sync error: ${errorMessage}`);
      throw error;
    }
  }
}

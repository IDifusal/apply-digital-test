import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, IsNull, Not, Repository } from 'typeorm';
import { Product } from '../products/entities/product.entity';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Product) private readonly repo: Repository<Product>,
  ) {}

  async deletedPercentage(): Promise<{
    deleted: number;
    total: number;
    percentage: number;
  }> {
    const total = await this.repo.count();
    const deleted = await this.repo.count({ where: { isDeleted: true } });
    const percentage = total ? (deleted / total) * 100 : 0;
    return { deleted, total, percentage: Number(percentage.toFixed(2)) };
  }

  async activePercentage(params: {
    hasPrice?: boolean;
    from?: string;
    to?: string;
  }): Promise<{
    activeMatching: number;
    activeTotal: number;
    globalTotal: number;
    percentageOfActive: number;
    percentageOfGlobal: number;
  }> {
    const total = await this.repo.count();
    const activeTotal = await this.repo.count({ where: { isDeleted: false } });

    const where: Record<string, any> = { isDeleted: false };
    if (params.hasPrice === true) where.price = Not(IsNull());
    if (params.hasPrice === false) where.price = IsNull();

    if (params.from && params.to) {
      where.updatedAt = Between(new Date(params.from), new Date(params.to));
    }

    const activeMatching = await this.repo.count({ where });

    const percentageOfActive = activeTotal
      ? (activeMatching / activeTotal) * 100
      : 0;
    const percentageOfGlobal = total ? (activeMatching / total) * 100 : 0;

    return {
      activeMatching,
      activeTotal,
      globalTotal: total,
      percentageOfActive: Number(percentageOfActive.toFixed(2)),
      percentageOfGlobal: Number(percentageOfGlobal.toFixed(2)),
    };
  }

  async topCategories(
    limit = 5,
  ): Promise<
    Array<{ category: string; count: number; avgPrice: string | null }>
  > {
    const qb = this.repo
      .createQueryBuilder('p')
      .select('p.category', 'category')
      .addSelect('COUNT(*)', 'count')
      .addSelect('AVG(p.price)', 'avgPrice')
      .where('p.isDeleted = false')
      .andWhere('p.category IS NOT NULL')
      .groupBy('p.category')
      .orderBy('count', 'DESC')
      .limit(limit);
    interface RawResult {
      category: string;
      count: string;
      avgPrice: string | null;
    }
    const rows = await qb.getRawMany() as RawResult[];
    return rows.map((r) => ({
      category: r.category,
      count: Number(r.count),
      avgPrice: r.avgPrice ? Number(r.avgPrice).toFixed(2) : null,
    }));
  }
}

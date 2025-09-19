import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { ListProductsQueryDto } from './dto/list-products-query.dto';

const PAGE_SIZE = 5;

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product) private readonly repo: Repository<Product>,
  ) {}

  async list(query: ListProductsQueryDto) {
    const page = query.page && query.page > 0 ? query.page : 1;
    const qb = this.repo.createQueryBuilder('p').where('p.isDeleted = false');

    if (query.name) {
      qb.andWhere('LOWER(p.name) LIKE LOWER(:name)', {
        name: `%${query.name}%`,
      });
    }
    if (query.category) {
      qb.andWhere('p.category = :category', { category: query.category });
    }
    if (query.priceMin) {
      qb.andWhere('p.price >= :pmin', { pmin: query.priceMin });
    }
    if (query.priceMax) {
      qb.andWhere('p.price <= :pmax', { pmax: query.priceMax });
    }

    const [items, total] = await qb
      .orderBy('p.updatedAt', 'DESC')
      .skip((page - 1) * PAGE_SIZE)
      .take(PAGE_SIZE)
      .getManyAndCount();

    return { page, limit: PAGE_SIZE, total, items };
  }

  async softDelete(id: string) {
    const product = await this.repo.findOne({ where: { id } });
    if (!product || product.isDeleted) {
      throw new NotFoundException('Product not found');
    }
    product.isDeleted = true;
    product.deletedAt = new Date();
    await this.repo.save(product);
    return { success: true };
  }

  async upsertFromContentful(data: Partial<Product>) {
    const existing = await this.repo.findOne({
      where: { contentfulId: data.contentfulId },
    });
    if (existing) {
      if (existing.isDeleted) return existing;
      const merged = this.repo.merge(existing, data);
      return this.repo.save(merged);
    } else {
      const entity = this.repo.create({ ...data, isDeleted: false });
      return this.repo.save(entity);
    }
  }
}

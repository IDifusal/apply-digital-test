import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { ProductsService } from './products.service';
import { Product } from './entities/product.entity';
import { ListProductsQueryDto } from './dto/list-products-query.dto';

describe('ProductsService', () => {
  let service: ProductsService;
  let repository: Repository<Product>;

  const mockRepository = {
    createQueryBuilder: jest.fn(() => ({
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      take: jest.fn().mockReturnThis(),
      getManyAndCount: jest.fn(),
    })),
    findOne: jest.fn(),
    save: jest.fn(),
    create: jest.fn(),
    merge: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: getRepositoryToken(Product),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
    repository = module.get<Repository<Product>>(getRepositoryToken(Product));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('list', () => {
    it('should return paginated products', async () => {
      const mockProducts = [
        { id: 1, name: 'Product 1', category: 'Category 1', price: '10.00' },
        { id: 2, name: 'Product 2', category: 'Category 2', price: '20.00' },
      ];
      const mockCount = 2;

      const mockQueryBuilder = {
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getManyAndCount: jest.fn().mockResolvedValue([mockProducts, mockCount]),
      };

      mockRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);

      const query: ListProductsQueryDto = { page: 1 };
      const result = await service.list(query);

      expect(result).toEqual({
        items: mockProducts,
        total: mockCount,
        page: 1,
        limit: 5,
      });
    });

    it('should apply name filter', async () => {
      const mockQueryBuilder = {
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getManyAndCount: jest.fn().mockResolvedValue([[], 0]),
      };

      mockRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);

      const query: ListProductsQueryDto = { page: 1, name: 'test' };
      await service.list(query);

      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'LOWER(p.name) LIKE LOWER(:name)',
        { name: '%test%' }
      );
    });

    it('should apply category filter', async () => {
      const mockQueryBuilder = {
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getManyAndCount: jest.fn().mockResolvedValue([[], 0]),
      };

      mockRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);

      const query: ListProductsQueryDto = { page: 1, category: 'electronics' };
      await service.list(query);

      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'p.category = :category',
        { category: 'electronics' }
      );
    });
  });


  describe('upsertFromContentful', () => {
    it('should create new product when not exists', async () => {
      const mockData = {
        contentfulId: 'cf-123',
        name: 'New Product',
        category: 'Category',
        price: '10.00',
      };

      mockRepository.findOne.mockResolvedValue(null);
      mockRepository.create.mockReturnValue(mockData);
      mockRepository.save.mockResolvedValue({ id: 1, ...mockData });

      const result = await service.upsertFromContentful(mockData);

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { contentfulId: 'cf-123' },
      });
      expect(repository.create).toHaveBeenCalledWith({
        ...mockData,
        isDeleted: false,
      });
      expect(result).toEqual({ id: 1, ...mockData });
    });

    it('should update existing product', async () => {
      const existingProduct = {
        id: 1,
        contentfulId: 'cf-123',
        name: 'Old Product',
        isDeleted: false,
      };
      const updateData = {
        contentfulId: 'cf-123',
        name: 'Updated Product',
        category: 'Category',
        price: '15.00',
      };
      const mergedProduct = { ...existingProduct, ...updateData };

      mockRepository.findOne.mockResolvedValue(existingProduct);
      mockRepository.merge.mockReturnValue(mergedProduct);
      mockRepository.save.mockResolvedValue(mergedProduct);

      const result = await service.upsertFromContentful(updateData);

      expect(repository.merge).toHaveBeenCalledWith(existingProduct, updateData);
      expect(repository.save).toHaveBeenCalledWith(mergedProduct);
      expect(result).toEqual(mergedProduct);
    });
  });
});

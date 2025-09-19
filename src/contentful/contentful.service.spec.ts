import { Test, TestingModule } from '@nestjs/testing';
import { ContentfulService } from './contentful.service';
import { ProductsService } from '../products/products.service';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('ContentfulService', () => {
  let service: ContentfulService;
  let productsService: ProductsService;

  const mockProductsService = {
    upsertFromContentful: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ContentfulService,
        {
          provide: ProductsService,
          useValue: mockProductsService,
        },
      ],
    }).compile();

    service = module.get<ContentfulService>(ContentfulService);
    productsService = module.get<ProductsService>(ProductsService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('mapEntryToProduct', () => {
    it('should map contentful entry to product', () => {
      const mockEntry = {
        sys: {
          id: 'cf-123',
          type: 'Entry',
          createdAt: '2023-01-01T00:00:00Z',
          updatedAt: '2023-01-01T00:00:00Z',
          revision: 1,
        },
        fields: {
          name: { 'en-US': 'Test Product' },
          category: { 'en-US': 'Electronics' },
          price: { 'en-US': 99.99 },
        },
      };

      const result = service.mapEntryToProduct(mockEntry);

      expect(result).toEqual({
        contentfulId: 'cf-123',
        name: 'Test Product',
        category: 'Electronics',
        price: '99.99',
      });
    });

    it('should handle missing fields', () => {
      const mockEntry = {
        sys: {
          id: 'cf-456',
          type: 'Entry',
          createdAt: '2023-01-01T00:00:00Z',
          updatedAt: '2023-01-01T00:00:00Z',
          revision: 1,
        },
        fields: {},
      };

      const result = service.mapEntryToProduct(mockEntry);

      expect(result).toEqual({
        contentfulId: 'cf-456',
        name: '',
        category: null,
        price: null,
      });
    });

    it('should handle non-localized fields', () => {
      const mockEntry = {
        sys: {
          id: 'cf-789',
          type: 'Entry',
          createdAt: '2023-01-01T00:00:00Z',
          updatedAt: '2023-01-01T00:00:00Z',
          revision: 1,
        },
        fields: {
          name: 'Direct String',
          category: 'Direct Category',
          price: 49.99,
        },
      };

      const result = service.mapEntryToProduct(mockEntry);

      expect(result).toEqual({
        contentfulId: 'cf-789',
        name: 'Direct String',
        category: 'Direct Category',
        price: '49.99',
      });
    });
  });

  describe('syncProducts', () => {
    it('should sync products successfully', async () => {
      const mockItems = [
        {
          sys: {
            id: 'cf-1',
            type: 'Entry',
            createdAt: '2023-01-01T00:00:00Z',
            updatedAt: '2023-01-01T00:00:00Z',
            revision: 1,
          },
          fields: { name: { 'en-US': 'Product 1' } },
        },
        {
          sys: {
            id: 'cf-2',
            type: 'Entry',
            createdAt: '2023-01-01T00:00:00Z',
            updatedAt: '2023-01-01T00:00:00Z',
            revision: 1,
          },
          fields: { name: { 'en-US': 'Product 2' } },
        },
      ];

      // Mock fetchProducts method
      jest.spyOn(service, 'fetchProducts').mockResolvedValue(mockItems);
      mockProductsService.upsertFromContentful.mockResolvedValue({});

      const result = await service.syncProducts();

      expect(result).toEqual({ synced: 2 });
      expect(productsService.upsertFromContentful).toHaveBeenCalledTimes(2);
    });

    it('should skip items without contentfulId', async () => {
      const mockItems = [
        {
          sys: {
            id: 'cf-1',
            type: 'Entry',
            createdAt: '2023-01-01T00:00:00Z',
            updatedAt: '2023-01-01T00:00:00Z',
            revision: 1,
          },
          fields: { name: { 'en-US': 'Product 1' } },
        },
        {
          sys: {
            type: 'Entry',
            createdAt: '2023-01-01T00:00:00Z',
            updatedAt: '2023-01-01T00:00:00Z',
            revision: 1,
          }, // Missing id
          fields: { name: { 'en-US': 'Product 2' } },
        },
      ];

      jest.spyOn(service, 'fetchProducts').mockResolvedValue(mockItems);
      mockProductsService.upsertFromContentful.mockResolvedValue({});

      const result = await service.syncProducts();

      expect(result).toEqual({ synced: 1 });
      expect(productsService.upsertFromContentful).toHaveBeenCalledTimes(1);
    });

    it('should handle sync errors', async () => {
      const error = new Error('Fetch failed');
      jest.spyOn(service, 'fetchProducts').mockRejectedValue(error);

      await expect(service.syncProducts()).rejects.toThrow('Fetch failed');
    });
  });
});

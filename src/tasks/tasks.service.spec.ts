import { Test, TestingModule } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { ContentfulService } from '../contentful/contentful.service';

describe('TasksService', () => {
  let service: TasksService;
  let contentfulService: ContentfulService;

  const mockContentfulService = {
    syncProducts: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: ContentfulService,
          useValue: mockContentfulService,
        },
      ],
    }).compile();

    service = module.get<TasksService>(TasksService);
    contentfulService = module.get<ContentfulService>(ContentfulService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('handleSync', () => {
    it('should call contentful syncProducts', async () => {
      mockContentfulService.syncProducts.mockResolvedValue({ synced: 5 });

      await service.handleSync();

      expect(contentfulService.syncProducts).toHaveBeenCalled();
    });
  });

  describe('manualSync', () => {
    it('should return sync result', async () => {
      const mockResult = { synced: 10 };
      mockContentfulService.syncProducts.mockResolvedValue(mockResult);

      const result = await service.manualSync();

      expect(result).toEqual(mockResult);
      expect(contentfulService.syncProducts).toHaveBeenCalled();
    });

    it('should handle sync errors', async () => {
      const error = new Error('Sync failed');
      mockContentfulService.syncProducts.mockRejectedValue(error);

      await expect(service.manualSync()).rejects.toThrow('Sync failed');
    });
  });
});

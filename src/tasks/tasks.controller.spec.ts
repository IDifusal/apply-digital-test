import { Test, TestingModule } from '@nestjs/testing';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';

describe('TasksController', () => {
  let controller: TasksController;
  let tasksService: TasksService;

  const mockTasksService = {
    manualSync: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TasksController],
      providers: [
        {
          provide: TasksService,
          useValue: mockTasksService,
        },
      ],
    }).compile();

    controller = module.get<TasksController>(TasksController);
    tasksService = module.get<TasksService>(TasksService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('manualSync', () => {
    it('should return sync result with success message', async () => {
      const mockResult = { synced: 15 };
      mockTasksService.manualSync.mockResolvedValue(mockResult);

      const result = await controller.manualSync();

      expect(result).toEqual({
        message: 'Manual sync completed successfully',
        synced: 15,
      });
      expect(tasksService.manualSync).toHaveBeenCalled();
    });

    it('should handle sync errors', async () => {
      const error = new Error('Sync failed');
      mockTasksService.manualSync.mockRejectedValue(error);

      await expect(controller.manualSync()).rejects.toThrow('Sync failed');
    });
  });
});

import { Controller, Get } from '@nestjs/common';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get('sync')
  async manualSync() {
    const result = await this.tasksService.manualSync();
    return {
      message: 'Manual sync completed successfully',
      synced: result.synced,
    };
  }
}

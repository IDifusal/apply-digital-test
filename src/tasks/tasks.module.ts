import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { ContentfulModule } from '../contentful/contentful.module';

@Module({
  imports: [ContentfulModule],
  controllers: [TasksController],
  providers: [TasksService],
})
export class TasksModule {}

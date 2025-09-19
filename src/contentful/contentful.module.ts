import { Module } from '@nestjs/common';
import { ContentfulService } from './contentful.service';
import { ProductsModule } from '../products/products.module';
import { ContentfulController } from './contentful.controlller';

@Module({
  imports: [ProductsModule],
  providers: [ContentfulService],
  exports: [ContentfulService],
  controllers: [ContentfulController],
})
export class ContentfulModule {}

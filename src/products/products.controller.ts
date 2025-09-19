import { Controller, Get, Query, Delete, Param } from '@nestjs/common';
import { ApiTags, ApiOkResponse } from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { ListProductsQueryDto } from './dto/list-products-query.dto';

@ApiTags('Public - Products')
@Controller('products')
export class ProductsController {
  constructor(private readonly service: ProductsService) {}

  @Get()
  @ApiOkResponse({ description: 'Paginated list (max 5 items per page)' })
  list(@Query() query: ListProductsQueryDto) {
    return this.service.list(query);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.softDelete(id);
  }
}

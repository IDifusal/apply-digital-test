import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ReportsService } from './reports.service';
import { JwtAuthGuard } from '../auth/jwt.guard';

@ApiTags('Private - Reports')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('reports')
export class ReportsController {
  constructor(private readonly service: ReportsService) {}

  @Get('deleted-percentage')
  deleted() {
    return this.service.deletedPercentage();
  }

  @Get('active-percentage')
  active(
    @Query('hasPrice') hasPrice?: 'true' | 'false',
    @Query('from') from?: string,
    @Query('to') to?: string,
  ) {
    const hp =
      hasPrice === 'true' ? true : hasPrice === 'false' ? false : undefined;
    return this.service.activePercentage({ hasPrice: hp, from, to });
  }

  @Get('top-categories')
  top(@Query('limit') limit?: string) {
    const n = limit ? parseInt(limit, 10) : 5;
    return this.service.topCategories(n);
  }
}

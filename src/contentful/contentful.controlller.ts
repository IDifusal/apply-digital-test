import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ContentfulService } from './contentful.service';

@ApiTags('Contentful')
@Controller('contentful')
export class ContentfulController {
  constructor(private readonly contentfulService: ContentfulService) {}

  @Get('test-connection')
  testConnection(): Promise<any> {
    return this.contentfulService.testConnection();
  }
}

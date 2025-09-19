import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): {
    status: string;
    server: string;
    version: string;
    timestamp: string;
  } {
    return {
      status: 'ok',
      server: 'nestjs',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
    };
  }
}

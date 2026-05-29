import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  @Get()
  @ApiOperation({ summary: 'Check API health status' })
  check() {
    return {
      status: 'ok',
      service: 'Sentinel API',
      timestamp: new Date().toISOString(),
    };
  }
}
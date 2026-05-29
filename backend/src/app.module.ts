import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { IncidentsModule } from './modules/incidents/incidents.module';
import { HealthModule } from './modules/health/health.module';

@Module({
  imports: [
  PrismaModule,
  IncidentsModule,
  HealthModule,
],
})
export class AppModule {}
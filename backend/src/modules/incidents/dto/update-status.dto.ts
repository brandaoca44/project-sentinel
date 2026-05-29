import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { IncidentStatus } from '@prisma/client';

export class UpdateStatusDto {
  @ApiProperty({ enum: IncidentStatus, enumName: 'IncidentStatus' })
  @IsEnum(IncidentStatus)
  status!: IncidentStatus;
}
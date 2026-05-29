import { PartialType } from '@nestjs/swagger';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { IncidentStatus } from '@prisma/client';

import { CreateIncidentDto } from './create-incident.dto';

export class UpdateIncidentDto extends PartialType(CreateIncidentDto) {
  @ApiPropertyOptional({ enum: IncidentStatus, enumName: 'IncidentStatus' })
  @IsOptional()
  @IsEnum(IncidentStatus)
  status?: IncidentStatus;
}
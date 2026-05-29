import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { IncidentPriority, IncidentStatus } from '@prisma/client';

import { CreateIncidentDto } from './dto/create-incident.dto';
import { QueryIncidentsDto } from './dto/query-incidents.dto';
import { UpdateIncidentDto } from './dto/update-incident.dto';
import { IncidentsService } from './incidents.service';
import { UpdateStatusDto } from './dto/update-status.dto';

@ApiTags('Incidents')
@Controller('incidents')
export class IncidentsController {
  constructor(private readonly incidentsService: IncidentsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new incident' })
  create(@Body() dto: CreateIncidentDto) {
    return this.incidentsService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'List incidents with optional filters' })
  @ApiQuery({ name: 'status', enum: IncidentStatus, required: false })
  @ApiQuery({ name: 'priority', enum: IncidentPriority, required: false })
  @ApiQuery({ name: 'category', required: false })
  findAll(@Query() query: QueryIncidentsDto) {
    return this.incidentsService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get incident details by id' })
  @ApiParam({ name: 'id', example: 'clx123abc456' })
  findOne(@Param('id') id: string) {
    return this.incidentsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update incident data' })
  @ApiParam({ name: 'id', example: 'clx123abc456' })
  update(@Param('id') id: string, @Body() dto: UpdateIncidentDto) {
    return this.incidentsService.update(id, dto);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update incident status' })
  @ApiParam({ name: 'id', example: 'clx123abc456' })
  updateStatus(@Param('id') id: string, @Body() dto: UpdateStatusDto) {
    return this.incidentsService.updateStatus(id, dto.status);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an incident' })
  @ApiParam({ name: 'id', example: 'clx123abc456' })
  remove(@Param('id') id: string) {
    return this.incidentsService.remove(id);
  }
}
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
  @ApiOperation({ summary: 'Criar um novo incidente' })
  create(@Body() dto: CreateIncidentDto) {
    return this.incidentsService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Liste os incidentes com filtros opcionais.' })
  @ApiQuery({ name: 'status', enum: IncidentStatus, required: false })
  @ApiQuery({ name: 'priority', enum: IncidentPriority, required: false })
  @ApiQuery({ name: 'category', required: false })
  findAll(@Query() query: QueryIncidentsDto) {
    return this.incidentsService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtenha detalhes do incidente pelo ID.' })
  @ApiParam({ name: 'id', example: 'clx123abc456' })
  findOne(@Param('id') id: string) {
    return this.incidentsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar dados de incidentes' })
  @ApiParam({ name: 'id', example: 'clx123abc456' })
  update(@Param('id') id: string, @Body() dto: UpdateIncidentDto) {
    return this.incidentsService.update(id, dto);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Atualizar status do incidente' })
  @ApiParam({ name: 'id', example: 'clx123abc456' })
  updateStatus(@Param('id') id: string, @Body() dto: UpdateStatusDto) {
    return this.incidentsService.updateStatus(id, dto.status);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Deletar um incidente' })
  @ApiParam({ name: 'id', example: 'clx123abc456' })
  remove(@Param('id') id: string) {
    return this.incidentsService.remove(id);
  }
}
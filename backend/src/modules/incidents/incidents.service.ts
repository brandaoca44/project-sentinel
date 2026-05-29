import { Injectable, NotFoundException } from '@nestjs/common';
import { IncidentStatus } from '@prisma/client';

import { PrismaService } from '../../prisma/prisma.service';
import { CreateIncidentDto } from './dto/create-incident.dto';
import { QueryIncidentsDto } from './dto/query-incidents.dto';
import { UpdateIncidentDto } from './dto/update-incident.dto';

@Injectable()
export class IncidentsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateIncidentDto) {
    const incident = await this.prisma.incident.create({
      data: {
        ...dto,
        logs: {
          create: {
            action: 'INCIDENT_CREATED',
            message: `Incident created with priority ${dto.priority}`,
          },
        },
      },
      include: {
        logs: true,
      },
    });

    return incident;
  }

  async findAll(query: QueryIncidentsDto) {
    return this.prisma.incident.findMany({
      where: {
        ...(query.status && { status: query.status }),
        ...(query.priority && { priority: query.priority }),
        ...(query.category && { category: query.category }),
      },
      include: {
        logs: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string) {
    const incident = await this.prisma.incident.findUnique({
      where: { id },
      include: {
        logs: {
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });

    if (!incident) {
      throw new NotFoundException('Incident not found');
    }

    return incident;
  }

  async update(id: string, dto: UpdateIncidentDto) {
    await this.findOne(id);

    const { status, ...data } = dto;

    const incident = await this.prisma.incident.update({
      where: { id },
      data: {
        ...data,
        logs: {
          create: {
            action: 'INCIDENT_UPDATED',
            message: `Incident updated: ${Object.keys(data).join(', ')}`,
          },
        },
      },
      include: {
        logs: true,
      },
    });

    return incident;
  }

  async updateStatus(id: string, status: IncidentStatus) {
    await this.findOne(id);

    const incident = await this.prisma.incident.update({
      where: { id },
      data: {
        status,
        logs: {
          create: {
            action: 'INCIDENT_STATUS_CHANGED',
            message: `Incident status changed to ${status}`,
          },
        },
      },
      include: {
        logs: true,
      },
    });

    return incident;
  }

  async remove(id: string) {
    await this.findOne(id);

    await this.prisma.incident.delete({
      where: { id },
    });

    return {
      message: 'Incident deleted successfully',
      id,
    };
  }
}
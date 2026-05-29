import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { IncidentsService } from './incidents.service';
import { PrismaService } from '../../prisma/prisma.service';

const mockIncident = {
  id: 'cuid123',
  title: 'Instabilidade no banco',
  description: 'Falhas intermitentes de conexão',
  category: 'infraestrutura',
  assignee: 'Caíque Brandão',
  priority: 'HIGH',
  status: 'OPEN',
  createdAt: new Date(),
  updatedAt: new Date(),
  logs: [],
};

const mockPrisma = {
  incident: {
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
};

describe('IncidentsService', () => {
  let service: IncidentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        IncidentsService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<IncidentsService>(IncidentsService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create an incident with an audit log', async () => {
      mockPrisma.incident.create.mockResolvedValue(mockIncident);

      const dto = {
        title: 'Instabilidade no banco',
        description: 'Falhas intermitentes de conexão',
        category: 'infraestrutura',
        assignee: 'Caíque Brandão',
        priority: 'HIGH' as const,
      };

      const result = await service.create(dto);

      expect(mockPrisma.incident.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            title: dto.title,
            logs: expect.objectContaining({
              create: expect.objectContaining({
                action: 'INCIDENT_CREATED',
              }),
            }),
          }),
        }),
      );
      expect(result).toEqual(mockIncident);
    });
  });

  describe('findAll', () => {
    it('should return a list of incidents', async () => {
      mockPrisma.incident.findMany.mockResolvedValue([mockIncident]);

      const result = await service.findAll({});

      expect(mockPrisma.incident.findMany).toHaveBeenCalled();
      expect(result).toHaveLength(1);
    });

    it('should apply filters when provided', async () => {
      mockPrisma.incident.findMany.mockResolvedValue([mockIncident]);

      await service.findAll({ status: 'OPEN', priority: 'HIGH' });

      expect(mockPrisma.incident.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            status: 'OPEN',
            priority: 'HIGH',
          }),
        }),
      );
    });
  });

  describe('findOne', () => {
    it('should return an incident by id', async () => {
      mockPrisma.incident.findUnique.mockResolvedValue(mockIncident);

      const result = await service.findOne('cuid123');

      expect(mockPrisma.incident.findUnique).toHaveBeenCalledWith(
        expect.objectContaining({ where: { id: 'cuid123' } }),
      );
      expect(result).toEqual(mockIncident);
    });

    it('should throw NotFoundException when incident does not exist', async () => {
      mockPrisma.incident.findUnique.mockResolvedValue(null);

      await expect(service.findOne('nonexistent')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update an incident and create an audit log', async () => {
      mockPrisma.incident.findUnique.mockResolvedValue(mockIncident);
      mockPrisma.incident.update.mockResolvedValue({
        ...mockIncident,
        title: 'Título atualizado',
      });

      const result = await service.update('cuid123', { title: 'Título atualizado' });

      expect(mockPrisma.incident.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 'cuid123' },
          data: expect.objectContaining({
            logs: expect.objectContaining({
              create: expect.objectContaining({
                action: 'INCIDENT_UPDATED',
              }),
            }),
          }),
        }),
      );
      expect(result.title).toBe('Título atualizado');
    });
  });

  describe('updateStatus', () => {
    it('should update the incident status and create an audit log', async () => {
      mockPrisma.incident.findUnique.mockResolvedValue(mockIncident);
      mockPrisma.incident.update.mockResolvedValue({
        ...mockIncident,
        status: 'IN_PROGRESS',
      });

      const result = await service.updateStatus('cuid123', 'IN_PROGRESS');

      expect(mockPrisma.incident.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            status: 'IN_PROGRESS',
            logs: expect.objectContaining({
              create: expect.objectContaining({
                action: 'INCIDENT_STATUS_CHANGED',
              }),
            }),
          }),
        }),
      );
      expect(result.status).toBe('IN_PROGRESS');
    });
  });

  describe('remove', () => {
    it('should delete an incident and return confirmation', async () => {
      mockPrisma.incident.findUnique.mockResolvedValue(mockIncident);
      mockPrisma.incident.delete.mockResolvedValue(mockIncident);

      const result = await service.remove('cuid123');

      expect(mockPrisma.incident.delete).toHaveBeenCalledWith({
        where: { id: 'cuid123' },
      });
      expect(result).toEqual({
        message: 'Incidente excluído com sucesso',
        id: 'cuid123',
      });
    });

    it('should throw NotFoundException when incident does not exist', async () => {
      mockPrisma.incident.findUnique.mockResolvedValue(null);

      await expect(service.remove('nonexistent')).rejects.toThrow(NotFoundException);
    });
  });
});
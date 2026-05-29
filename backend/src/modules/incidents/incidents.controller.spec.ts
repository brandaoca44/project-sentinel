import { Test, TestingModule } from '@nestjs/testing';
import { IncidentsController } from './incidents.controller';
import { IncidentsService } from './incidents.service';

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

const mockIncidentsService = {
  create: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  updateStatus: jest.fn(),
  remove: jest.fn(),
};

describe('IncidentsController', () => {
  let controller: IncidentsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [IncidentsController],
      providers: [
        { provide: IncidentsService, useValue: mockIncidentsService },
      ],
    }).compile();

    controller = module.get<IncidentsController>(IncidentsController);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call service.create with the correct payload', async () => {
      mockIncidentsService.create.mockResolvedValue(mockIncident);

      const dto = {
        title: 'Instabilidade no banco',
        description: 'Falhas intermitentes de conexão',
        category: 'infraestrutura',
        assignee: 'Caíque Brandão',
        priority: 'HIGH' as const,
      };

      const result = await controller.create(dto);

      expect(mockIncidentsService.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual(mockIncident);
    });
  });

  describe('findAll', () => {
    it('should call service.findAll with query filters', async () => {
      mockIncidentsService.findAll.mockResolvedValue([mockIncident]);

      const query = { status: 'OPEN' as const };
      const result = await controller.findAll(query);

      expect(mockIncidentsService.findAll).toHaveBeenCalledWith(query);
      expect(result).toHaveLength(1);
    });
  });

  describe('findOne', () => {
    it('should call service.findOne with the correct id', async () => {
      mockIncidentsService.findOne.mockResolvedValue(mockIncident);

      const result = await controller.findOne('cuid123');

      expect(mockIncidentsService.findOne).toHaveBeenCalledWith('cuid123');
      expect(result).toEqual(mockIncident);
    });
  });

  describe('update', () => {
    it('should call service.update with id and dto', async () => {
      const updated = { ...mockIncident, title: 'Título atualizado' };
      mockIncidentsService.update.mockResolvedValue(updated);

      const result = await controller.update('cuid123', { title: 'Título atualizado' });

      expect(mockIncidentsService.update).toHaveBeenCalledWith('cuid123', {
        title: 'Título atualizado',
      });
      expect(result.title).toBe('Título atualizado');
    });
  });

  describe('updateStatus', () => {
    it('should call service.updateStatus with id and status', async () => {
      const updated = { ...mockIncident, status: 'IN_PROGRESS' };
      mockIncidentsService.updateStatus.mockResolvedValue(updated);

      const result = await controller.updateStatus('cuid123', {
        status: 'IN_PROGRESS' as const,
      });

      expect(mockIncidentsService.updateStatus).toHaveBeenCalledWith(
        'cuid123',
        'IN_PROGRESS',
      );
      expect(result.status).toBe('IN_PROGRESS');
    });
  });

  describe('remove', () => {
    it('should call service.remove with the correct id', async () => {
      const response = { message: 'Incidente excluído com sucesso', id: 'cuid123' };
      mockIncidentsService.remove.mockResolvedValue(response);

      const result = await controller.remove('cuid123');

      expect(mockIncidentsService.remove).toHaveBeenCalledWith('cuid123');
      expect(result).toEqual(response);
    });
  });
});
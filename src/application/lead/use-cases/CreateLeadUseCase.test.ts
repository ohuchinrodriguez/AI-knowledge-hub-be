import 'reflect-metadata';
import { CreateLeadUseCase } from './CreateLeadUseCase';
import { InMemoryLeadRepository } from '../../../infrastructure/database/repositories/InMemoryLeadRepository';
import { PinoLogger } from '../../../infrastructure/logging/PinoLogger';
import type { CreateLeadDto } from '../dto/CreateLeadDto';

describe('CreateLeadUseCase', () => {
  let createLeadUseCase: CreateLeadUseCase;
  let leadRepository: InMemoryLeadRepository;
  let logger: PinoLogger;

  beforeEach(() => {
    leadRepository = new InMemoryLeadRepository();
    logger = new PinoLogger();
    createLeadUseCase = new CreateLeadUseCase(leadRepository, logger);
  });

  afterEach(() => {
    leadRepository.clear();
  });

  describe('execute', () => {
    it('should create a new lead successfully', async () => {
      // Arrange
      const createLeadDto: CreateLeadDto = {
        clientName: 'Test Client',
        projectName: 'Test Project Website',
        projectType: 'Web Design',
        projectScheme: 'Fixed Price',
        projectDescription: 'Test project description',
        quoteDeliveryDays: 5
      };

      // Act
      const result = await createLeadUseCase.execute(createLeadDto);

      // Assert
      expect(result).toBeDefined();
      expect(result.id).toBeDefined();
      expect(result.clientName).toBe(createLeadDto.clientName);
      expect(result.projectName).toBe(createLeadDto.projectName);
      expect(result.projectType.toString()).toBe(createLeadDto.projectType);
      expect(result.projectScheme.toString()).toBe(createLeadDto.projectScheme);
      expect(result.projectDescription).toBe(createLeadDto.projectDescription);
      expect(result.quoteDeliveryDays).toBe(createLeadDto.quoteDeliveryDays);
      expect(result.status).toBe('Customer Introduction');
      expect(result.createdAt).toBeDefined();
      expect(result.updatedAt).toBeDefined();
    });

    it('should create a lead without description', async () => {
      // Arrange
      const createLeadDto: CreateLeadDto = {
        clientName: 'Test Client',
        projectName: 'Mobile App Project',
        projectType: 'Mobile App',
        projectScheme: 'Dedicated Team'
      };

      // Act
      const result = await createLeadUseCase.execute(createLeadDto);

      // Assert
      expect(result).toBeDefined();
      expect(result.clientName).toBe(createLeadDto.clientName);
      expect(result.projectName).toBe(createLeadDto.projectName);
      expect(result.projectType.toString()).toBe(createLeadDto.projectType);
      expect(result.projectScheme.toString()).toBe(createLeadDto.projectScheme);
      expect(result.projectDescription).toBeUndefined();
      expect(result.quoteDeliveryDays).toBeUndefined();
    });

    it('should throw error for invalid project type', async () => {
      // Arrange
      const createLeadDto: CreateLeadDto = {
        clientName: 'Test Client',
        projectName: 'Test Project',
        projectType: 'Invalid Type',
        projectScheme: 'Fixed Price'
      };

      // Act & Assert
      await expect(createLeadUseCase.execute(createLeadDto))
        .rejects
        .toThrow('Invalid project type: Invalid Type');
    });

    it('should throw error for invalid project scheme', async () => {
      // Arrange
      const createLeadDto: CreateLeadDto = {
        clientName: 'Test Client',
        projectName: 'Test Project',
        projectType: 'Web Design',
        projectScheme: 'Invalid Scheme'
      };

      // Act & Assert
      await expect(createLeadUseCase.execute(createLeadDto))
        .rejects
        .toThrow('Invalid project scheme: Invalid Scheme');
    });

    it('should save the lead in the repository', async () => {
      // Arrange
      const createLeadDto: CreateLeadDto = {
        clientName: 'Test Client',
        projectName: 'E-commerce Store',
        projectType: 'E-commerce',
        projectScheme: 'Fixed Price'
      };

      // Act
      const result = await createLeadUseCase.execute(createLeadDto);

      // Assert
      const savedLead = await leadRepository.findById(result.id);
      expect(savedLead).toBeDefined();
      expect(savedLead?.id).toBe(result.id);
      expect(leadRepository.size()).toBe(1);
    });
  });
});

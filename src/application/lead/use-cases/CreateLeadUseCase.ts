import { injectable, inject } from 'tsyringe';
import type { LeadRepositoryPort } from '../../../domain/lead/repositories/LeadRepositoryPort';
import { Lead } from '../../../domain/lead/entities/Lead';
import { LeadId } from '../../../domain/lead/value-objects/LeadId';
import { ProjectType } from '../../../domain/lead/value-objects/ProjectType';
import { ProjectScheme } from '../../../domain/lead/value-objects/ProjectScheme';
import type { CreateLeadDto } from '../dto/CreateLeadDto';
import type { LoggerPort } from '../../../shared/ports/LoggerPort';

export interface CreateLeadUseCasePort {
  execute(dto: CreateLeadDto): Promise<Lead>;
}

@injectable()
export class CreateLeadUseCase implements CreateLeadUseCasePort {
  constructor(
    @inject('LeadRepositoryPort') private readonly leadRepository: LeadRepositoryPort,
    @inject('LoggerPort') private readonly logger: LoggerPort
  ) {}

  public async execute(dto: CreateLeadDto): Promise<Lead> {
    this.logger.info('Creating new lead', { 
      clientName: dto.clientName, 
      projectType: dto.projectType 
    });

    const leadId = LeadId.generate();
    const projectType = ProjectType.fromString(dto.projectType);
    const projectScheme = ProjectScheme.fromString(dto.projectScheme);

    const lead = Lead.create(
      leadId.toString(),
      dto.clientName,
      dto.projectName,
      projectType,
      projectScheme,
      dto.projectDescription,
      dto.quoteDeliveryDays,
      dto.estimatedQuoteDeliveryDate,
      dto.progressStatus
    );

    const savedLead = await this.leadRepository.save(lead);

    this.logger.info('Lead created successfully', { 
      leadId: savedLead.id, 
      clientName: savedLead.clientName 
    });

    return savedLead;
  }
}

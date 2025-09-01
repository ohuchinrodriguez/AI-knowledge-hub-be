import { injectable, inject } from 'tsyringe';
import type { LeadRepositoryPort } from '../../../domain/lead/repositories/LeadRepositoryPort';
import { Lead, LeadStatus } from '../../../domain/lead/entities/Lead';
import type { UpdateLeadStatusDto } from '../dto/UpdateLeadStatusDto';
import type { LoggerPort } from '../../../shared/ports/LoggerPort';

export interface UpdateLeadStatusUseCasePort {
  execute(dto: UpdateLeadStatusDto): Promise<Lead>;
}

@injectable()
export class UpdateLeadStatusUseCase implements UpdateLeadStatusUseCasePort {
  constructor(
    @inject('LeadRepositoryPort') private readonly leadRepository: LeadRepositoryPort,
    @inject('LoggerPort') private readonly logger: LoggerPort
  ) {}

  public async execute(dto: UpdateLeadStatusDto): Promise<Lead> {
    this.logger.info('Updating lead status', { 
      leadId: dto.leadId, 
      newStatus: dto.status 
    });

    const existingLead = await this.leadRepository.findById(dto.leadId);
    if (!existingLead) {
      throw new Error(`Lead with id ${dto.leadId} not found`);
    }

    // Validate status
    const validStatuses = Object.values(LeadStatus);
    if (!validStatuses.includes(dto.status as LeadStatus)) {
      throw new Error(`Invalid status: ${dto.status}. Valid statuses are: ${validStatuses.join(', ')}`);
    }

    const updatedLead = existingLead.updateStatus(dto.status as LeadStatus);
    const savedLead = await this.leadRepository.save(updatedLead);

    this.logger.info('Lead status updated successfully', { 
      leadId: savedLead.id, 
      oldStatus: existingLead.status,
      newStatus: savedLead.status 
    });

    return savedLead;
  }
}

import { injectable, inject } from 'tsyringe';
import type { LeadRepositoryPort } from '../../../domain/lead/repositories/LeadRepositoryPort';
import { Lead } from '../../../domain/lead/entities/Lead';
import type { LoggerPort } from '../../../shared/ports/LoggerPort';

export interface GetLeadByIdUseCasePort {
  execute(id: string): Promise<Lead | null>;
}

@injectable()
export class GetLeadByIdUseCase implements GetLeadByIdUseCasePort {
  constructor(
    @inject('LeadRepositoryPort') private readonly leadRepository: LeadRepositoryPort,
    @inject('LoggerPort') private readonly logger: LoggerPort
  ) {}

  public async execute(id: string): Promise<Lead | null> {
    this.logger.info('Fetching lead by id', { leadId: id });

    const lead = await this.leadRepository.findById(id);

    if (lead) {
      this.logger.info('Lead found', { leadId: id, clientName: lead.clientName });
    } else {
      this.logger.warn('Lead not found', { leadId: id });
    }

    return lead;
  }
}

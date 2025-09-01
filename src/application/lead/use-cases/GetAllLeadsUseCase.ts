import { injectable, inject } from 'tsyringe';
import type { LeadRepositoryPort } from '../../../domain/lead/repositories/LeadRepositoryPort';
import { Lead } from '../../../domain/lead/entities/Lead';
import type { LoggerPort } from '../../../shared/ports/LoggerPort';

export interface GetAllLeadsUseCasePort {
  execute(): Promise<Lead[]>;
}

@injectable()
export class GetAllLeadsUseCase implements GetAllLeadsUseCasePort {
  constructor(
    @inject('LeadRepositoryPort') private readonly leadRepository: LeadRepositoryPort,
    @inject('LoggerPort') private readonly logger: LoggerPort
  ) {}

  public async execute(): Promise<Lead[]> {
    this.logger.info('Fetching all leads');

    const leads = await this.leadRepository.findAll();

    this.logger.info('Leads fetched successfully', { count: leads.length });

    return leads;
  }
}

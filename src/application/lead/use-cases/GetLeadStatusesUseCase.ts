import { injectable, inject } from 'tsyringe';
import { LeadStatus } from '../../../domain/lead/entities/Lead';
import type { LoggerPort } from '../../../shared/ports/LoggerPort';

export interface GetLeadStatusesUseCasePort {
  execute(): Promise<string[]>;
}

@injectable()
export class GetLeadStatusesUseCase implements GetLeadStatusesUseCasePort {
  constructor(
    @inject('LoggerPort') private readonly logger: LoggerPort
  ) {}

  public async execute(): Promise<string[]> {
    this.logger.info('Fetching lead statuses');

    const statuses = Object.values(LeadStatus);

    this.logger.info('Lead statuses fetched successfully', { count: statuses.length });

    return statuses;
  }
}

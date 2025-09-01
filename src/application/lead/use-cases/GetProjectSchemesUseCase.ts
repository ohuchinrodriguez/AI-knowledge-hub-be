import { injectable, inject } from 'tsyringe';
import { ProjectScheme } from '../../../domain/lead/value-objects/ProjectScheme';
import type { LoggerPort } from '../../../shared/ports/LoggerPort';

export interface GetProjectSchemesUseCasePort {
  execute(): Promise<string[]>;
}

@injectable()
export class GetProjectSchemesUseCase implements GetProjectSchemesUseCasePort {
  constructor(
    @inject('LoggerPort') private readonly logger: LoggerPort
  ) {}

  public async execute(): Promise<string[]> {
    this.logger.info('Fetching project schemes');

    const projectSchemes = ProjectScheme.getAllSchemes();

    this.logger.info('Project schemes fetched successfully', { count: projectSchemes.length });

    return projectSchemes;
  }
}

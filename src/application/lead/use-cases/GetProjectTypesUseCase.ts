import { injectable, inject } from 'tsyringe';
import { ProjectType } from '../../../domain/lead/value-objects/ProjectType';
import type { LoggerPort } from '../../../shared/ports/LoggerPort';

export interface GetProjectTypesUseCasePort {
  execute(): Promise<string[]>;
}

@injectable()
export class GetProjectTypesUseCase implements GetProjectTypesUseCasePort {
  constructor(
    @inject('LoggerPort') private readonly logger: LoggerPort
  ) {}

  public async execute(): Promise<string[]> {
    this.logger.info('Fetching project types');

    const projectTypes = ProjectType.getAllTypes();

    this.logger.info('Project types fetched successfully', { count: projectTypes.length });

    return projectTypes;
  }
}

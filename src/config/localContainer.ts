import 'reflect-metadata';
import { container } from 'tsyringe';
import type { UserRepositoryPort } from '../domain/user/repositories/UserRepositoryPort';
import { InMemoryUserRepository } from '../infrastructure/database/repositories/InMemoryUserRepository';
import type { LoggerPort } from '../shared/ports/LoggerPort';
import { PinoLogger } from '../infrastructure/logging/PinoLogger';
import type { CreateUserUseCasePort } from '../application/user/use-cases/CreateUserUseCase';
import { CreateUserUseCase } from '../application/user/use-cases/CreateUserUseCase';

// Lead imports
import type { LeadRepositoryPort } from '../domain/lead/repositories/LeadRepositoryPort';
import { InMemoryLeadRepository } from '../infrastructure/database/repositories/InMemoryLeadRepository';
import type { CreateLeadUseCasePort } from '../application/lead/use-cases/CreateLeadUseCase';
import { CreateLeadUseCase } from '../application/lead/use-cases/CreateLeadUseCase';
import type { GetAllLeadsUseCasePort } from '../application/lead/use-cases/GetAllLeadsUseCase';
import { GetAllLeadsUseCase } from '../application/lead/use-cases/GetAllLeadsUseCase';
import type { GetLeadByIdUseCasePort } from '../application/lead/use-cases/GetLeadByIdUseCase';
import { GetLeadByIdUseCase } from '../application/lead/use-cases/GetLeadByIdUseCase';
import type { GetProjectTypesUseCasePort } from '../application/lead/use-cases/GetProjectTypesUseCase';
import { GetProjectTypesUseCase } from '../application/lead/use-cases/GetProjectTypesUseCase';
import type { GetProjectSchemesUseCasePort } from '../application/lead/use-cases/GetProjectSchemesUseCase';
import { GetProjectSchemesUseCase } from '../application/lead/use-cases/GetProjectSchemesUseCase';
import type { UpdateLeadStatusUseCasePort } from '../application/lead/use-cases/UpdateLeadStatusUseCase';
import { UpdateLeadStatusUseCase } from '../application/lead/use-cases/UpdateLeadStatusUseCase';
import type { GetLeadStatusesUseCasePort } from '../application/lead/use-cases/GetLeadStatusesUseCase';
import { GetLeadStatusesUseCase } from '../application/lead/use-cases/GetLeadStatusesUseCase';

export class LocalDIContainer {
  public static setup(): void {
    // Infrastructure dependencies
    container.registerSingleton<LoggerPort>('LoggerPort', PinoLogger);
    
    // In-memory repositories for local development
    container.registerSingleton<UserRepositoryPort>('UserRepositoryPort', InMemoryUserRepository);
    container.registerSingleton<LeadRepositoryPort>('LeadRepositoryPort', InMemoryLeadRepository);

    // User use cases
    container.register<CreateUserUseCasePort>('CreateUserUseCasePort', CreateUserUseCase);

    // Lead use cases
    container.register<CreateLeadUseCasePort>('CreateLeadUseCasePort', CreateLeadUseCase);
    container.register<GetAllLeadsUseCasePort>('GetAllLeadsUseCasePort', GetAllLeadsUseCase);
    container.register<GetLeadByIdUseCasePort>('GetLeadByIdUseCasePort', GetLeadByIdUseCase);
    container.register<UpdateLeadStatusUseCasePort>('UpdateLeadStatusUseCasePort', UpdateLeadStatusUseCase);
    container.register<GetProjectTypesUseCasePort>('GetProjectTypesUseCasePort', GetProjectTypesUseCase);
    container.register<GetProjectSchemesUseCasePort>('GetProjectSchemesUseCasePort', GetProjectSchemesUseCase);
    container.register<GetLeadStatusesUseCasePort>('GetLeadStatusesUseCasePort', GetLeadStatusesUseCase);
  }

  public static getContainer(): typeof container {
    return container;
  }
}

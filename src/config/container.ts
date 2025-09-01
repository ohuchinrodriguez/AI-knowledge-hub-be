import 'reflect-metadata';
import { container } from 'tsyringe';
import { DataSource } from 'typeorm';
import type { UserRepositoryPort } from '@domain/user/repositories/UserRepositoryPort';
import { TypeOrmUserRepository } from '@infrastructure/database/repositories/TypeOrmUserRepository';
import type { LoggerPort } from '@shared/ports/LoggerPort';
import { PinoLogger } from '@infrastructure/logging/PinoLogger';
import type { CreateUserUseCasePort } from '@application/user/use-cases/CreateUserUseCase';
import { CreateUserUseCase } from '@application/user/use-cases/CreateUserUseCase';

export class DIContainer {
  public static async setup(dataSource: DataSource): Promise<void> {
    // Infrastructure dependencies
    container.registerSingleton<LoggerPort>('LoggerPort', PinoLogger);
    
    // Database dependencies
    container.registerInstance<DataSource>('DataSource', dataSource);
    container.register<UserRepositoryPort>('UserRepositoryPort', {
      useFactory: (c) => new TypeOrmUserRepository(c.resolve('DataSource')),
    });

    // Application use cases
    container.register<CreateUserUseCasePort>('CreateUserUseCasePort', CreateUserUseCase);
  }

  public static getContainer(): typeof container {
    return container;
  }
}

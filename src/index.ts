import 'reflect-metadata';
import { DIContainer } from '@config/container';
import { createDataSource } from '@config/database';
import type { LoggerPort } from '@shared/ports/LoggerPort';

async function bootstrap(): Promise<void> {
  try {
    const dataSource = createDataSource();
    await dataSource.initialize();
    await DIContainer.setup(dataSource);
    
    const container = DIContainer.getContainer();
    const logger = container.resolve<LoggerPort>('LoggerPort');
    
    logger.info('AI Knowledge Hub API initialized successfully');
    logger.info('Database connection established');
    logger.info('Dependency injection container configured');
    
  } catch (error) {
    console.error('Failed to initialize application:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  void bootstrap();
}

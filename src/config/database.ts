import { DataSource } from 'typeorm';
import { UserEntity } from '@infrastructure/database/entities/UserEntity';
import { LeadEntity } from '@infrastructure/database/entities/LeadEntity';

export const createDataSource = (): DataSource => {
  const isDevelopment = process.env['NODE_ENV'] === 'development';

  return new DataSource({
    type: 'postgres',
    host: process.env['DB_HOST'] || 'localhost',
    port: parseInt(process.env['DB_PORT'] || '5432', 10),
    username: process.env['DB_USERNAME'] || 'postgres',
    password: process.env['DB_PASSWORD'] || 'password',
    database: process.env['DB_DATABASE'] || 'ai_knowledge_hub',
    
    // SSL configuration for AWS RDS - always enable for RDS
    ssl: process.env['DB_HOST']?.includes('rds.amazonaws.com') ? { rejectUnauthorized: false } : false,
    
    // Synchronize only in development
    synchronize: isDevelopment,
    logging: isDevelopment,
    
    // Connection pool settings for better performance
    extra: {
      connectionLimit: 10,
      acquireTimeout: 60000,
      timeout: 60000,
    },
    
    // Include both entities
    entities: [UserEntity, LeadEntity],
    migrations: ['src/infrastructure/database/migrations/*.ts'],
    subscribers: ['src/infrastructure/database/subscribers/*.ts'],
  });
};

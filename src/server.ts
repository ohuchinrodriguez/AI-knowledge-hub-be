import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import { LocalDIContainer } from '@config/localContainer';
import type { CreateUserUseCasePort } from '@application/user/use-cases/CreateUserUseCase';
import type { UserRepositoryPort } from '@domain/user/repositories/UserRepositoryPort';
import { CreateUserDto } from '@application/user/dto/CreateUserDto';
import type { LoggerPort } from '@shared/ports/LoggerPort';

const app = express();
const port = process.env['PORT'] || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize DI Container
LocalDIContainer.setup();
const container = LocalDIContainer.getContainer();
const logger = container.resolve<LoggerPort>('LoggerPort');

// Health check endpoint
app.get('/health', (_req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: 'development'
  });
});

// Create User endpoint
app.post('/users', async (req, res) => {
  try {
    const createUserUseCase = container.resolve<CreateUserUseCasePort>('CreateUserUseCasePort');
    
    const { name, email, role } = req.body;
    
    if (!name || !email) {
      res.status(400).json({
        error: 'Name and email are required'
      });
      return;
    }

    const createUserDto = new CreateUserDto(name, email, role);
    const user = await createUserUseCase.execute(createUserDto);

    logger.info('User created via API', { userId: user.id, email: user.email });

    res.status(201).json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  } catch (error) {
    logger.error('Error creating user', error as Error);
    
    res.status(500).json({
      error: 'Internal server error',
      message: (error as Error).message,
    });
  }
});

// Get all users endpoint
app.get('/users', async (_req, res) => {
  try {
    const userRepository = container.resolve<UserRepositoryPort>('UserRepositoryPort');
    const users = await userRepository.findAll();

    logger.info('Users retrieved via API', { count: users.length });

    res.json({
      users: users.map(user => ({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      })),
      count: users.length,
    });
  } catch (error) {
    logger.error('Error retrieving users', error as Error);
    
    res.status(500).json({
      error: 'Internal server error',
      message: (error as Error).message,
    });
  }
});

// Get user by ID endpoint
app.get('/users/:id', async (req, res) => {
  try {
    const userRepository = container.resolve<UserRepositoryPort>('UserRepositoryPort');
    const { id } = req.params;

    const user = await userRepository.findById(id);

    if (!user) {
      res.status(404).json({
        error: 'User not found'
      });
      return;
    }

    logger.info('User retrieved by ID via API', { userId: user.id });

    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  } catch (error) {
    logger.error('Error retrieving user by ID', error as Error);
    
    res.status(500).json({
      error: 'Internal server error',
      message: (error as Error).message,
    });
  }
});

// Error handling middleware
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  logger.error('Unhandled error', err);
  res.status(500).json({
    error: 'Internal server error',
    message: err.message,
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not found',
    path: req.path,
  });
});

// Start server
app.listen(port, () => {
  logger.info(`AI Knowledge Hub API running on port ${port}`);
  logger.info('Available endpoints:');
  logger.info('  GET  /health');
  logger.info('  POST /users');
  logger.info('  GET  /users');
  logger.info('  GET  /users/:id');
});

export default app;

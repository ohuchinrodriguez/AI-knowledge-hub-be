import 'reflect-metadata';
import type { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { LocalDIContainer } from '../config/localContainer';
import type { UserRepositoryPort } from '../domain/user/repositories/UserRepositoryPort';
import type { LoggerPort } from '../shared/ports/LoggerPort';

let isInitialized = false;

const initializeContainer = (): void => {
  if (!isInitialized) {
    LocalDIContainer.setup();
    isInitialized = true;
  }
};

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    initializeContainer();
    
    const container = LocalDIContainer.getContainer();
    const logger = container.resolve<LoggerPort>('LoggerPort');
    const userRepository = container.resolve<UserRepositoryPort>('UserRepositoryPort');

    logger.info('GetUsers handler invoked', { 
      requestId: event.requestContext.requestId 
    });

    const users = await userRepository.findAll();

    logger.info('Users retrieved successfully', { 
      count: users.length,
      requestId: event.requestContext.requestId 
    });

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        users: users.map(user => ({
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        })),
        count: users.length,
      }),
    };
  } catch (error) {
    const container = LocalDIContainer.getContainer();
    const logger = container.resolve<LoggerPort>('LoggerPort');
    
    logger.error('Error in GetUsers handler', error as Error, {
      requestId: event.requestContext.requestId,
    });

    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        error: 'Internal server error',
        message: (error as Error).message,
      }),
    };
  }
};

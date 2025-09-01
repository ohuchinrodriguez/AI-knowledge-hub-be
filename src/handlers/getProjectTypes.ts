import 'reflect-metadata';
import type { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { LocalDIContainer } from '../config/localContainer';
import type { GetProjectTypesUseCasePort } from '../application/lead/use-cases/GetProjectTypesUseCase';
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
    const getProjectTypesUseCase = container.resolve<GetProjectTypesUseCasePort>('GetProjectTypesUseCasePort');

    logger.info('GetProjectTypes handler invoked', { 
      requestId: event.requestContext.requestId 
    });

    const projectTypes = await getProjectTypesUseCase.execute();

    logger.info('Project types fetched successfully', { 
      count: projectTypes.length,
      requestId: event.requestContext.requestId 
    });

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        projectTypes
      }),
    };
  } catch (error) {
    const container = LocalDIContainer.getContainer();
    const logger = container.resolve<LoggerPort>('LoggerPort');
    
    logger.error('Error in GetProjectTypes handler', error as Error, {
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

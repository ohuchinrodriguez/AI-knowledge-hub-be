import 'reflect-metadata';
import type { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { LocalDIContainer } from '../config/localContainer';
import type { GetLeadStatusesUseCasePort } from '../application/lead/use-cases/GetLeadStatusesUseCase';
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
    const getLeadStatusesUseCase = container.resolve<GetLeadStatusesUseCasePort>('GetLeadStatusesUseCasePort');

    logger.info('GetLeadStatuses handler invoked', { 
      requestId: event.requestContext.requestId 
    });

    const statuses = await getLeadStatusesUseCase.execute();

    logger.info('Lead statuses fetched successfully', { 
      count: statuses.length,
      requestId: event.requestContext.requestId 
    });

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        statuses
      }),
    };
  } catch (error) {
    const container = LocalDIContainer.getContainer();
    const logger = container.resolve<LoggerPort>('LoggerPort');
    
    logger.error('Error in GetLeadStatuses handler', error as Error, {
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

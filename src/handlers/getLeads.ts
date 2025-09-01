import 'reflect-metadata';
import type { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { LocalDIContainer } from '../config/localContainer';
import type { GetAllLeadsUseCasePort } from '../application/lead/use-cases/GetAllLeadsUseCase';
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
    const getAllLeadsUseCase = container.resolve<GetAllLeadsUseCasePort>('GetAllLeadsUseCasePort');

    logger.info('GetLeads handler invoked', { 
      requestId: event.requestContext.requestId 
    });

    const leads = await getAllLeadsUseCase.execute();

    logger.info('Leads fetched successfully', { 
      count: leads.length,
      requestId: event.requestContext.requestId 
    });

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        leads: leads.map(lead => ({
          id: lead.id,
          clientName: lead.clientName,
          projectName: lead.projectName,
          projectType: lead.projectType.toString(),
          projectScheme: lead.projectScheme.toString(),
          projectDescription: lead.projectDescription,
          quoteDeliveryDays: lead.quoteDeliveryDays,
          estimatedQuoteDeliveryDate: lead.estimatedQuoteDeliveryDate,
          progressStatus: lead.progressStatus,
          status: lead.status,
          createdAt: lead.createdAt,
          updatedAt: lead.updatedAt,
        }))
      }),
    };
  } catch (error) {
    const container = LocalDIContainer.getContainer();
    const logger = container.resolve<LoggerPort>('LoggerPort');
    
    logger.error('Error in GetLeads handler', error as Error, {
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

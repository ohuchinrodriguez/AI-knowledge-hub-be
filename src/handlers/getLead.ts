import 'reflect-metadata';
import type { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { LocalDIContainer } from '../config/localContainer';
import type { GetLeadByIdUseCasePort } from '../application/lead/use-cases/GetLeadByIdUseCase';
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
    const getLeadByIdUseCase = container.resolve<GetLeadByIdUseCasePort>('GetLeadByIdUseCasePort');

    logger.info('GetLead handler invoked', { 
      requestId: event.requestContext.requestId 
    });

    const leadId = event.pathParameters?.['id'];
    if (!leadId) {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({
          error: 'Lead ID is required',
        }),
      };
    }

    const lead = await getLeadByIdUseCase.execute(leadId);

    if (!lead) {
      return {
        statusCode: 404,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({
          error: 'Lead not found',
        }),
      };
    }

    logger.info('Lead fetched successfully', { 
      leadId: lead.id,
      requestId: event.requestContext.requestId 
    });

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
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
      }),
    };
  } catch (error) {
    const container = LocalDIContainer.getContainer();
    const logger = container.resolve<LoggerPort>('LoggerPort');
    
    logger.error('Error in GetLead handler', error as Error, {
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

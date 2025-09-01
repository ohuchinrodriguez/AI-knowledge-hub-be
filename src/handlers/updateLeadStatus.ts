import 'reflect-metadata';
import type { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { LocalDIContainer } from '../config/localContainer';
import type { UpdateLeadStatusUseCasePort } from '../application/lead/use-cases/UpdateLeadStatusUseCase';
import type { UpdateLeadStatusDto } from '../application/lead/dto/UpdateLeadStatusDto';
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
    const updateLeadStatusUseCase = container.resolve<UpdateLeadStatusUseCasePort>('UpdateLeadStatusUseCasePort');

    logger.info('UpdateLeadStatus handler invoked', { 
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

    if (!event.body) {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({
          error: 'Request body is required',
        }),
      };
    }

    const requestBody = JSON.parse(event.body) as {
      status: string;
    };

    const updateLeadStatusDto: UpdateLeadStatusDto = {
      leadId,
      status: requestBody.status
    };

    const lead = await updateLeadStatusUseCase.execute(updateLeadStatusDto);

    logger.info('Lead status updated successfully', { 
      leadId: lead.id,
      newStatus: lead.status,
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
    
    logger.error('Error in UpdateLeadStatus handler', error as Error, {
      requestId: event.requestContext.requestId,
    });

    const statusCode = (error as Error).message.includes('not found') ? 404 : 
                      (error as Error).message.includes('Invalid status') ? 400 : 500;

    return {
      statusCode,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        error: statusCode === 500 ? 'Internal server error' : (error as Error).message,
        message: (error as Error).message,
      }),
    };
  }
};

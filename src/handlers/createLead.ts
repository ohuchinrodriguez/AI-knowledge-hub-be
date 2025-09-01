import 'reflect-metadata';
import type { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { LocalDIContainer } from '../config/localContainer';
import type { CreateLeadUseCasePort } from '../application/lead/use-cases/CreateLeadUseCase';
import type { CreateLeadDto } from '../application/lead/dto/CreateLeadDto';
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
    const createLeadUseCase = container.resolve<CreateLeadUseCasePort>('CreateLeadUseCasePort');

    logger.info('CreateLead handler invoked', { 
      requestId: event.requestContext.requestId 
    });

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
      clientName: string;
      projectName: string;
      projectType: string;
      projectScheme: string;
      projectDescription?: string;
      quoteDeliveryDays?: number;
      estimatedQuoteDeliveryDate?: string;
      progressStatus?: string;
    };

    const createLeadDto: CreateLeadDto = {
      clientName: requestBody.clientName,
      projectName: requestBody.projectName,
      projectType: requestBody.projectType,
      projectScheme: requestBody.projectScheme,
      ...(requestBody.projectDescription && { projectDescription: requestBody.projectDescription }),
      ...(requestBody.quoteDeliveryDays && { quoteDeliveryDays: requestBody.quoteDeliveryDays }),
      ...(requestBody.estimatedQuoteDeliveryDate && { estimatedQuoteDeliveryDate: new Date(requestBody.estimatedQuoteDeliveryDate) }),
      ...(requestBody.progressStatus && { progressStatus: requestBody.progressStatus })
    };

    const lead = await createLeadUseCase.execute(createLeadDto);

    logger.info('Lead created successfully', { 
      leadId: lead.id,
      requestId: event.requestContext.requestId 
    });

    return {
      statusCode: 201,
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
    
    logger.error('Error in CreateLead handler', error as Error, {
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

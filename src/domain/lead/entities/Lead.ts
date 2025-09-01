import { IsNotEmpty, IsOptional, IsDateString, IsUUID } from 'class-validator';
import { ProjectType } from '../value-objects/ProjectType';
import { ProjectScheme } from '../value-objects/ProjectScheme';

export enum LeadStatus {
  CUSTOMER_INTRODUCTION = 'Customer Introduction',
  TECHNICAL_MEETING = 'Technical Meeting',
  PENDING_INFORMATION = 'Pending Information',
  ESTIMATION_PROCESS = 'Estimation Process',
  CREATE_PRESENTATION = 'Create Presentation',
  WAITING_FOR_FEEDBACK = 'Waiting for Feedback',
  START_PROJECT = 'Start Project',
  PROJECT_DEVELOPMENT = 'Project Development',
  GARANTIA = 'Garantía',
  FINISH_PROJECT = 'Finish Project',
  LOST_PROJECT = 'Lost Project'
}

export class Lead {
  @IsUUID()
  public readonly id: string;

  @IsNotEmpty()
  public readonly clientName: string;

  @IsNotEmpty()
  public readonly projectName: string;

  public readonly projectType: ProjectType;

  public readonly projectScheme: ProjectScheme;

  @IsOptional()
  public readonly projectDescription: string | undefined;

  @IsOptional()
  public readonly quoteDeliveryDays: number | undefined;

  @IsOptional()
  @IsDateString()
  public readonly estimatedQuoteDeliveryDate: Date | undefined;

  @IsOptional()
  public readonly progressStatus: string | undefined;

  public readonly status: LeadStatus;

  @IsDateString()
  public readonly createdAt: Date;

  @IsDateString()
  public readonly updatedAt: Date;

  constructor(
    id: string,
    clientName: string,
    projectName: string,
    projectType: ProjectType,
    projectScheme: ProjectScheme,
    createdAt: Date,
    updatedAt: Date,
    projectDescription: string | undefined = undefined,
    quoteDeliveryDays: number | undefined = undefined,
    estimatedQuoteDeliveryDate: Date | undefined = undefined,
    progressStatus: string | undefined = undefined,
    status: LeadStatus = LeadStatus.CUSTOMER_INTRODUCTION
  ) {
    this.id = id;
    this.clientName = clientName;
    this.projectName = projectName;
    this.projectType = projectType;
    this.projectScheme = projectScheme;
    this.projectDescription = projectDescription;
    this.quoteDeliveryDays = quoteDeliveryDays;
    this.estimatedQuoteDeliveryDate = estimatedQuoteDeliveryDate;
    this.progressStatus = progressStatus;
    this.status = status;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  public static create(
    id: string,
    clientName: string,
    projectName: string,
    projectType: ProjectType,
    projectScheme: ProjectScheme,
    projectDescription: string | undefined = undefined,
    quoteDeliveryDays: number | undefined = undefined,
    estimatedQuoteDeliveryDate: Date | undefined = undefined,
    progressStatus: string | undefined = undefined
  ): Lead {
    const now = new Date();
    return new Lead(
      id,
      clientName,
      projectName,
      projectType,
      projectScheme,
      now,
      now,
      projectDescription,
      quoteDeliveryDays,
      estimatedQuoteDeliveryDate,
      progressStatus,
      LeadStatus.CUSTOMER_INTRODUCTION
    );
  }

  public updateStatus(newStatus: LeadStatus): Lead {
    return new Lead(
      this.id,
      this.clientName,
      this.projectName,
      this.projectType,
      this.projectScheme,
      this.createdAt,
      new Date(),
      this.projectDescription,
      this.quoteDeliveryDays,
      this.estimatedQuoteDeliveryDate,
      this.progressStatus,
      newStatus
    );
  }

  public updateDescription(newDescription: string): Lead {
    return new Lead(
      this.id,
      this.clientName,
      this.projectName,
      this.projectType,
      this.projectScheme,
      this.createdAt,
      new Date(),
      newDescription,
      this.quoteDeliveryDays,
      this.estimatedQuoteDeliveryDate,
      this.progressStatus,
      this.status
    );
  }

  public updateQuoteDeliveryDate(newDate: Date): Lead {
    return new Lead(
      this.id,
      this.clientName,
      this.projectName,
      this.projectType,
      this.projectScheme,
      this.createdAt,
      new Date(),
      this.projectDescription,
      this.quoteDeliveryDays,
      newDate,
      this.progressStatus,
      this.status
    );
  }

  public updateProgressStatus(newProgressStatus: string): Lead {
    return new Lead(
      this.id,
      this.clientName,
      this.projectName,
      this.projectType,
      this.projectScheme,
      this.createdAt,
      new Date(),
      this.projectDescription,
      this.quoteDeliveryDays,
      this.estimatedQuoteDeliveryDate,
      newProgressStatus,
      this.status
    );
  }

  public equals(other: Lead): boolean {
    return this.id === other.id;
  }
}

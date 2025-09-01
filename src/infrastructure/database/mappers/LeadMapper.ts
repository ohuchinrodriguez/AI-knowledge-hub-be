import { Lead, LeadStatus } from '@domain/lead/entities/Lead';
import { ProjectType } from '@domain/lead/value-objects/ProjectType';
import { ProjectScheme } from '@domain/lead/value-objects/ProjectScheme';
import { LeadEntity } from '../entities/LeadEntity';

export class LeadMapper {
  public static toDomain(entity: LeadEntity): Lead {
    return new Lead(
      entity.id,
      entity.clientName,
      entity.projectName,
      ProjectType.fromString(entity.projectType),
      ProjectScheme.fromString(entity.projectScheme),
      entity.createdAt,
      entity.updatedAt,
      entity.projectDescription,
      entity.quoteDeliveryDays,
      entity.estimatedQuoteDeliveryDate,
      entity.progressStatus,
      entity.status as LeadStatus
    );
  }

  public static toEntity(domain: Lead): LeadEntity {
    const entity = new LeadEntity();
    entity.id = domain.id;
    entity.clientName = domain.clientName;
    entity.projectName = domain.projectName;
    entity.projectType = domain.projectType.toString();
    entity.projectScheme = domain.projectScheme.toString();
    entity.projectDescription = domain.projectDescription;
    entity.quoteDeliveryDays = domain.quoteDeliveryDays;
    entity.estimatedQuoteDeliveryDate = domain.estimatedQuoteDeliveryDate;
    entity.progressStatus = domain.progressStatus;
    entity.status = domain.status;
    entity.createdAt = domain.createdAt;
    entity.updatedAt = domain.updatedAt;
    return entity;
  }
}

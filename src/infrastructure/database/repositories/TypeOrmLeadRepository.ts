import { injectable } from 'tsyringe';
import { Repository, DataSource, Like } from 'typeorm';
import type { LeadRepositoryPort } from '@domain/lead/repositories/LeadRepositoryPort';
import { Lead } from '@domain/lead/entities/Lead';
import { LeadEntity } from '../entities/LeadEntity';
import { LeadMapper } from '../mappers/LeadMapper';

@injectable()
export class TypeOrmLeadRepository implements LeadRepositoryPort {
  private readonly repository: Repository<LeadEntity>;

  constructor(dataSource: DataSource) {
    this.repository = dataSource.getRepository(LeadEntity);
  }

  public async save(lead: Lead): Promise<Lead> {
    const entity = LeadMapper.toEntity(lead);
    const savedEntity = await this.repository.save(entity);
    return LeadMapper.toDomain(savedEntity);
  }

  public async findById(id: string): Promise<Lead | null> {
    const entity = await this.repository.findOne({ where: { id } });
    return entity ? LeadMapper.toDomain(entity) : null;
  }

  public async findAll(): Promise<Lead[]> {
    const entities = await this.repository.find({
      order: { createdAt: 'DESC' }
    });
    return entities.map(LeadMapper.toDomain);
  }

  public async findByClientName(clientName: string): Promise<Lead[]> {
    const entities = await this.repository.find({
      where: { clientName: Like(`%${clientName}%`) },
      order: { createdAt: 'DESC' }
    });
    return entities.map(LeadMapper.toDomain);
  }

  public async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  public async exists(id: string): Promise<boolean> {
    const count = await this.repository.count({ where: { id } });
    return count > 0;
  }
}

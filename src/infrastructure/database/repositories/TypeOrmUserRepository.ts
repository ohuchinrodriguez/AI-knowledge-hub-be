import { injectable } from 'tsyringe';
import { Repository, DataSource } from 'typeorm';
import type { UserRepositoryPort } from '@domain/user/repositories/UserRepositoryPort';
import { User } from '@domain/user/entities/User';
import { UserEntity } from '../entities/UserEntity';
import { UserMapper } from '../mappers/UserMapper';

@injectable()
export class TypeOrmUserRepository implements UserRepositoryPort {
  private readonly repository: Repository<UserEntity>;

  constructor(dataSource: DataSource) {
    this.repository = dataSource.getRepository(UserEntity);
  }

  public async save(user: User): Promise<User> {
    const entity = UserMapper.toEntity(user);
    const savedEntity = await this.repository.save(entity);
    return UserMapper.toDomain(savedEntity);
  }

  public async findById(id: string): Promise<User | null> {
    const entity = await this.repository.findOne({ where: { id } });
    return entity ? UserMapper.toDomain(entity) : null;
  }

  public async findByEmail(email: string): Promise<User | null> {
    const entity = await this.repository.findOne({ where: { email } });
    return entity ? UserMapper.toDomain(entity) : null;
  }

  public async findAll(): Promise<User[]> {
    const entities = await this.repository.find();
    return entities.map(UserMapper.toDomain);
  }

  public async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  public async exists(id: string): Promise<boolean> {
    const count = await this.repository.count({ where: { id } });
    return count > 0;
  }
}

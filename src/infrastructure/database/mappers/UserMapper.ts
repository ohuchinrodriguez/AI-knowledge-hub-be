import { User } from '@domain/user/entities/User';
import { UserEntity } from '../entities/UserEntity';

export class UserMapper {
  public static toDomain(entity: UserEntity): User {
    return new User(
      entity.id,
      entity.name,
      entity.email,
      entity.createdAt,
      entity.updatedAt,
      entity.role
    );
  }

  public static toEntity(domain: User): UserEntity {
    const entity = new UserEntity();
    entity.id = domain.id;
    entity.name = domain.name;
    entity.email = domain.email;
    entity.role = domain.role;
    entity.createdAt = domain.createdAt;
    entity.updatedAt = domain.updatedAt;
    return entity;
  }
}

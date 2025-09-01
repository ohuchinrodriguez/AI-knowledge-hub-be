import { injectable } from 'tsyringe';
import type { UserRepositoryPort } from '../../../domain/user/repositories/UserRepositoryPort';
import { User } from '../../../domain/user/entities/User';

@injectable()
export class InMemoryUserRepository implements UserRepositoryPort {
  private users: Map<string, User> = new Map();

  public async save(user: User): Promise<User> {
    this.users.set(user.id, user);
    return user;
  }

  public async findById(id: string): Promise<User | null> {
    return this.users.get(id) || null;
  }

  public async findByEmail(email: string): Promise<User | null> {
    for (const user of this.users.values()) {
      if (user.email === email) {
        return user;
      }
    }
    return null;
  }

  public async findAll(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  public async delete(id: string): Promise<void> {
    this.users.delete(id);
  }

  public async exists(id: string): Promise<boolean> {
    return this.users.has(id);
  }

  // Método adicional para desarrollo local
  public clear(): void {
    this.users.clear();
  }

  public size(): number {
    return this.users.size;
  }
}

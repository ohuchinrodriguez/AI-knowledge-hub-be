import { injectable, inject } from 'tsyringe';
import type { UserRepositoryPort } from '../../../domain/user/repositories/UserRepositoryPort';
import { User } from '../../../domain/user/entities/User';
import { UserId } from '../../../domain/user/value-objects/UserId';
import { Email } from '../../../domain/user/value-objects/Email';
import type { CreateUserDto } from '../dto/CreateUserDto';
import type { LoggerPort } from '../../../shared/ports/LoggerPort';

export interface CreateUserUseCasePort {
  execute(dto: CreateUserDto): Promise<User>;
}

@injectable()
export class CreateUserUseCase implements CreateUserUseCasePort {
  constructor(
    @inject('UserRepositoryPort') private readonly userRepository: UserRepositoryPort,
    @inject('LoggerPort') private readonly logger: LoggerPort
  ) {}

  public async execute(dto: CreateUserDto): Promise<User> {
    this.logger.info('Creating new user', { email: dto.email, name: dto.name });

    await this.validateEmailNotExists(dto.email);

    const userId = UserId.generate();
    const user = User.create(
      userId.toString(),
      dto.name,
      dto.email,
      dto.role
    );

    const savedUser = await this.userRepository.save(user);

    this.logger.info('User created successfully', { 
      userId: savedUser.id, 
      email: savedUser.email 
    });

    return savedUser;
  }

  private async validateEmailNotExists(email: string): Promise<void> {
    const emailVO = Email.fromString(email);
    const existingUser = await this.userRepository.findByEmail(emailVO.toString());
    
    if (existingUser) {
      this.logger.warn('Attempt to create user with existing email', { email });
      throw new Error(`User with email ${email} already exists`);
    }
  }
}

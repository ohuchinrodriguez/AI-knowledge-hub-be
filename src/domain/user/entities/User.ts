import { IsEmail, IsNotEmpty, IsUUID, IsOptional, IsDateString } from 'class-validator';

export class User {
  @IsUUID()
  public readonly id: string;

  @IsNotEmpty()
  public readonly name: string;

  @IsEmail()
  public readonly email: string;

  @IsOptional()
  public readonly role: string | undefined;

  @IsDateString()
  public readonly createdAt: Date;

  @IsDateString()
  public readonly updatedAt: Date;

  constructor(
    id: string,
    name: string,
    email: string,
    createdAt: Date,
    updatedAt: Date,
    role: string | undefined = undefined
  ) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.role = role;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  public static create(
    id: string,
    name: string,
    email: string,
    role: string | undefined = undefined
  ): User {
    const now = new Date();
    return new User(id, name, email, now, now, role);
  }

  public updateName(newName: string): User {
    return new User(
      this.id,
      newName,
      this.email,
      this.createdAt,
      new Date(),
      this.role
    );
  }

  public updateRole(newRole: string): User {
    return new User(
      this.id,
      this.name,
      this.email,
      this.createdAt,
      new Date(),
      newRole
    );
  }

  public equals(other: User): boolean {
    return this.id === other.id;
  }
}

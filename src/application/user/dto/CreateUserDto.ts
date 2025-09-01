import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  public readonly name: string;

  @IsEmail()
  public readonly email: string;

  @IsOptional()
  @IsString()
  public readonly role: string | undefined;

  constructor(name: string, email: string, role: string | undefined = undefined) {
    this.name = name;
    this.email = email;
    this.role = role;
  }
}

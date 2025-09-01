import { v4 as uuidv4 } from 'uuid';
import { IsUUID } from 'class-validator';

export class LeadId {
  @IsUUID()
  private readonly value: string;

  constructor(value: string) {
    this.value = value;
  }

  public static generate(): LeadId {
    return new LeadId(uuidv4());
  }

  public static fromString(value: string): LeadId {
    return new LeadId(value);
  }

  public toString(): string {
    return this.value;
  }

  public equals(other: LeadId): boolean {
    return this.value === other.value;
  }
}

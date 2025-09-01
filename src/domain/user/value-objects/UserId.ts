import { v4 as uuidv4 } from 'uuid';

export class UserId {
  private readonly value: string;

  constructor(value: string) {
    this.validateUUID(value);
    this.value = value;
  }

  public static generate(): UserId {
    return new UserId(uuidv4());
  }

  public static fromString(value: string): UserId {
    return new UserId(value);
  }

  public toString(): string {
    return this.value;
  }

  public equals(other: UserId): boolean {
    return this.value === other.value;
  }

  private validateUUID(value: string): void {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(value)) {
      throw new Error(`Invalid UUID format: ${value}`);
    }
  }
}

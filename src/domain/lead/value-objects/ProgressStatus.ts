import { IsEnum } from 'class-validator';

export enum ProgressStatusEnum {
  NOT_STARTED = 'Not Started',
  IN_PROGRESS = 'In Progress',
  COMPLETED = 'Completed',
  ON_HOLD = 'On Hold',
  CANCELLED = 'Cancelled'
}

export class ProgressStatus {
  @IsEnum(ProgressStatusEnum)
  private readonly value: ProgressStatusEnum;

  constructor(value: ProgressStatusEnum) {
    this.value = value;
  }

  public static fromString(value: string): ProgressStatus {
    const enumValue = Object.values(ProgressStatusEnum).find(status => status === value);
    if (!enumValue) {
      throw new Error(`Invalid progress status: ${value}`);
    }
    return new ProgressStatus(enumValue);
  }

  public toString(): string {
    return this.value;
  }

  public equals(other: ProgressStatus): boolean {
    return this.value === other.value;
  }

  public static getAllStatuses(): ProgressStatusEnum[] {
    return Object.values(ProgressStatusEnum);
  }
}

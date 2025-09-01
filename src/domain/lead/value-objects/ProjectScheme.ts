import { IsEnum } from 'class-validator';

export enum ProjectSchemeEnum {
  FIXED_PRICE = 'Fixed Price',
  DEDICATED_TEAM = 'Dedicated Team'
}

export class ProjectScheme {
  @IsEnum(ProjectSchemeEnum)
  private readonly value: ProjectSchemeEnum;

  constructor(value: ProjectSchemeEnum) {
    this.value = value;
  }

  public static fromString(value: string): ProjectScheme {
    const enumValue = Object.values(ProjectSchemeEnum).find(scheme => scheme === value);
    if (!enumValue) {
      throw new Error(`Invalid project scheme: ${value}`);
    }
    return new ProjectScheme(enumValue);
  }

  public toString(): string {
    return this.value;
  }

  public equals(other: ProjectScheme): boolean {
    return this.value === other.value;
  }

  public static getAllSchemes(): ProjectSchemeEnum[] {
    return Object.values(ProjectSchemeEnum);
  }
}

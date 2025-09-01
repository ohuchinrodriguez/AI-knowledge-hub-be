import { IsEnum } from 'class-validator';

export enum ProjectTypeEnum {
  WEB_DESIGN = 'Web Design',
  MOBILE_APP = 'Mobile App',
  CUSTOM_SOFTWARE = 'Custom Software',
  E_COMMERCE = 'E-commerce',
  OTHER = 'Other'
}

export class ProjectType {
  @IsEnum(ProjectTypeEnum)
  private readonly value: ProjectTypeEnum;

  constructor(value: ProjectTypeEnum) {
    this.value = value;
  }

  public static fromString(value: string): ProjectType {
    const enumValue = Object.values(ProjectTypeEnum).find(type => type === value);
    if (!enumValue) {
      throw new Error(`Invalid project type: ${value}`);
    }
    return new ProjectType(enumValue);
  }

  public toString(): string {
    return this.value;
  }

  public equals(other: ProjectType): boolean {
    return this.value === other.value;
  }

  public static getAllTypes(): ProjectTypeEnum[] {
    return Object.values(ProjectTypeEnum);
  }
}

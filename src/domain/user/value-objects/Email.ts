export class Email {
  private readonly value: string;

  constructor(value: string) {
    this.validateEmail(value);
    this.value = value.toLowerCase().trim();
  }

  public static fromString(value: string): Email {
    return new Email(value);
  }

  public toString(): string {
    return this.value;
  }

  public equals(other: Email): boolean {
    return this.value === other.value;
  }

  private validateEmail(value: string): void {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      throw new Error(`Invalid email format: ${value}`);
    }
  }
}

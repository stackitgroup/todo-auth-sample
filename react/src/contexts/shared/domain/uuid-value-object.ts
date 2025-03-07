export abstract class UuidValueObject {
  private static readonly uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/

  constructor(
    private readonly _value: string | undefined,
    private readonly _name: string
  ) {
    this.ensureIsValid(_value)
  }

  protected ensureIsValid(value: string | undefined): void {
    if (!value) {
      throw new Error(`${this._name} cannot be empty`)
    }

    if (value.length !== 36) {
      throw new Error(`${this._name} must be 36 characters long`)
    }

    if (!UuidValueObject.uuidRegex.test(value)) {
      throw new Error(`${this._name} is not a valid UUID`)
    }
  }

  get value(): string {
    return this._value as string
  }
}

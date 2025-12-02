type ValidationRule<T = any> = {
  validate: (value: T) => boolean;
  message: string;
};

class FieldValidator<T = any> {
  private rules: ValidationRule<T>[] = [];
  private fieldName: string = "Field";

  constructor(fieldName?: string) {
    if (fieldName) this.fieldName = fieldName;
  }

  required(message?: string) {
    this.rules.push({
      validate: (value: any) => {
        if (typeof value === "string") return value.trim().length > 0;
        return value != null && value !== "";
      },
      message: message || `${this.fieldName} is required`,
    });
    return this;
  }

  min(length: number, message?: string) {
    this.rules.push({
      validate: (value: any) => {
        if (value == null) return true; // Skip if empty (use required() for that)
        return String(value).length >= length;
      },
      message:
        message || `${this.fieldName} must be at least ${length} characters`,
    });
    return this;
  }

  max(length: number, message?: string) {
    this.rules.push({
      validate: (value: any) => {
        if (value == null) return true;
        return String(value).length <= length;
      },
      message:
        message || `${this.fieldName} must be at most ${length} characters`,
    });
    return this;
  }

  email(message?: string) {
    this.rules.push({
      validate: (value: any) => {
        if (!value) return true;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(String(value));
      },
      message: message || "Invalid email format",
    });
    return this;
  }

  matches(pattern: RegExp, message?: string) {
    this.rules.push({
      validate: (value: any) => {
        if (!value) return true;
        return pattern.test(String(value));
      },
      message: message || `${this.fieldName} format is invalid`,
    });
    return this;
  }

  oneOf(values: T[], message?: string) {
    this.rules.push({
      validate: (value: T) => {
        if (value == null) return true;
        return values.includes(value);
      },
      message:
        message || `${this.fieldName} must be one of: ${values.join(", ")}`,
    });
    return this;
  }

  custom(validator: (value: T) => boolean, message: string) {
    this.rules.push({
      validate: validator,
      message,
    });
    return this;
  }

  validate(value: T): string {
    for (const rule of this.rules) {
      if (!rule.validate(value)) {
        return rule.message;
      }
    }
    return "";
  }
}

class Schema {
  private fields: Record<string, FieldValidator> = {};

  shape(fields: Record<string, FieldValidator>) {
    this.fields = fields;
    return this;
  }

  validate(data: Record<string, any>): {
    isValid: boolean;
    errors: Record<string, string>;
  } {
    const errors: Record<string, string> = {};

    for (const [fieldName, validator] of Object.entries(this.fields)) {
      const error = validator.validate(data[fieldName]);
      if (error) {
        errors[fieldName] = error;
      }
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  }

  validateField(fieldName: string, value: any): string {
    const validator = this.fields[fieldName];
    if (!validator) return "";
    return validator.validate(value);
  }
}

// ============================================
// HELPER FUNCTIONS
// ============================================

export const string = (fieldName?: string) =>
  new FieldValidator<string>(fieldName);
export const number = (fieldName?: string) =>
  new FieldValidator<number>(fieldName);
export const object = () => new Schema();

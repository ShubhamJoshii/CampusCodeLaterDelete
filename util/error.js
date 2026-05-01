export class ValidationError extends Error {
  constructor(target, message) {
    super(message);
    this.name = "ValidationError";
    this.target = target;
  }
}
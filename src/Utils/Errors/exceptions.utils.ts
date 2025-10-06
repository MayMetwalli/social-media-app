export class BadRequestException extends Error {
  status: number;
  constructor(message: string) {
    super(message);
    this.name = "BadRequestException";
    this.status = 400;
  }
}

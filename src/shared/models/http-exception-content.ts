export class HttpExceptionContent {
  constructor(
    public statusCode: number,
    public message: string[],
    public error: string,
  ) {}
}

import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';

    // Handle HTTP Exceptions
    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const responseMessage = exception.getResponse();

      // If message is an object, extract it
      if (typeof responseMessage === 'object') {
        message = (responseMessage as any).message || message;
      } else {
        message = responseMessage as string;
      }
    } else {
      // Log unexpected errors
      this.logger.error(
        `Unexpected error occurred: ${exception.message}`,
        exception.stack,
      );
    }

    // Log the error with request details
    this.logger.error(
      `Request ${request.method} ${request.url} failed with status ${status}`,
    );

    // Send structured response
    response.status(status).json({
      statusCode: status,
      message: message,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}

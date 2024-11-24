import { HttpException, HttpStatus } from '@nestjs/common';

export class SignupFailedException extends HttpException {
  constructor(inspectedError?: string) {
    super(
      `Signup failed: ${inspectedError || 'An unexpected error occurred'}`,
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}

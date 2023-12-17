import { ArgumentsHost, Catch, HttpStatus } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { IExceptionResponse } from '../interfaces/IExceptionResponse';

@Catch()
export class AllExceptionsFilter extends BaseExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    // Handle other exceptions
    const response = host.switchToHttp().getResponse();
    const status = exception.getStatus
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;
    const exceptionResponse: IExceptionResponse = {
      name: exception.name,
      message: exception.message,
    };
    if (
      exception?.response?.message &&
      Array.isArray(exception?.response?.message)
    ) {
      exceptionResponse.details = exception?.response?.message;
    }
    response.status(status).json({
      status: 'error',
      exception: exceptionResponse || 'Internal server error',
    });
  }
}

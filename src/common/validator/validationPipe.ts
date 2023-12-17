// validation.pipe.ts
import { Injectable, PipeTransform, BadRequestException } from '@nestjs/common';
import { validate } from 'class-validator';

@Injectable()
export class ValidationPipe implements PipeTransform<any> {
  async transform(value: any) {
    const errors = await validate(value);
    if (errors.length > 0) {
      throw new BadRequestException(
        'Validation failed',
        JSON.stringify(errors),
      );
    }
    return value;
  }
}

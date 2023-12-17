import { PartialType } from '@nestjs/mapped-types';
import { CreateAlertDto } from './create-alert.dto';
import { IAlert } from '../../common/interfaces/IAlert';
import { IsOptional, Validate, ValidationArguments } from 'class-validator';

/**
 To Be Able To Provide targetTimestamp optionally.
 */
class IsDateStringIfPresentConstraint {
  validate(value: any, args: ValidationArguments) {
    const [target] = args.constraints;
    if (target !== undefined) {
      return value === undefined || typeof value === 'string';
    }
    return true;
  }

  defaultMessage(args: ValidationArguments) {
    const [target] = args.constraints;
    if (target !== undefined) {
      return `${args.property} must be a valid ISO 8601 date string if ${target} is defined`;
    }
    return `${args.property} must be a valid ISO 8601 date string`;
  }
}

export class UpdateAlertDto
  extends PartialType(CreateAlertDto)
  implements IAlert
{
  @IsOptional()
  @Validate(IsDateStringIfPresentConstraint, ['targetTimestamp'])
  public targetTimestamp?: Date;
}

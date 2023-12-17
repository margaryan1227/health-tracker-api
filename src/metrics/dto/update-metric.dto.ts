import { PartialType } from '@nestjs/mapped-types';
import { CreateMetricDto } from './create-metric.dto';
import { IMetric } from '../../common/interfaces/IMetric';

export class UpdateMetricDto
  extends PartialType(CreateMetricDto)
  implements IMetric {}

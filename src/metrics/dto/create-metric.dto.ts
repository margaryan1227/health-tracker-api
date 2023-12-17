import { IMetric } from '../../common/interfaces/IMetric';
import { IsNumber, Max, Min } from 'class-validator';

export class CreateMetricDto implements IMetric {
  @Min(0)
  @IsNumber()
  public stepsWalked: number;

  @Min(0)
  @IsNumber()
  public waterIntake: number;

  @Min(0)
  @IsNumber()
  public calorieConsumption: number;

  @Min(0)
  @Max(24)
  @IsNumber()
  public hoursSlept: number;

  constructor(
    stepsWalked: number = 0,
    waterIntake: number = 0,
    calorieConsumption: number = 0,
    hoursSlept: number = 0,
  ) {
    this.stepsWalked = stepsWalked;
    this.waterIntake = waterIntake;
    this.calorieConsumption = calorieConsumption;
    this.hoursSlept = hoursSlept;
  }
}

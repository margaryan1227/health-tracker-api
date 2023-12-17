import { IAlert } from '../../common/interfaces/IAlert';
import { IsDateString, IsNumber, Max, Min } from 'class-validator';

export class CreateAlertDto implements IAlert {
  public user?: number;

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

  @IsDateString()
  public targetTimestamp: Date;

  constructor(
    user: number = 0,
    stepsWalked: number = 0,
    waterIntake: number = 0,
    calorieConsumption: number = 0,
    hoursSlept: number = 0,
    targetTimestamp: Date = new Date(),
  ) {
    this.user = user;
    this.stepsWalked = stepsWalked;
    this.waterIntake = waterIntake;
    this.calorieConsumption = calorieConsumption;
    this.hoursSlept = hoursSlept;
    this.targetTimestamp = targetTimestamp;
  }
}

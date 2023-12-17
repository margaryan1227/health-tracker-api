import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateMetricDto } from './dto/create-metric.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TimePeriod } from '../common/constants';
import { UpdateMetricDto } from './dto/update-metric.dto';
import { Metric } from './entities/metric.entity';
import { IMetric } from '../common/interfaces/IMetric';
import { UserService } from '../user/user.service';

@Injectable()
export class MetricsService {
  constructor(
    @InjectRepository(Metric)
    private readonly metricRepository: Repository<Metric>,
    private readonly userService: UserService,
  ) {}
  async create(
    createMetricDto: CreateMetricDto,
    userId: number,
  ): Promise<Metric> {
    const metrics = this.metricRepository.create({
      stepsWalked: createMetricDto.stepsWalked,
      waterIntake: createMetricDto.waterIntake,
      calorieConsumption: createMetricDto.calorieConsumption,
      hoursSlept: createMetricDto.hoursSlept,
      user: userId,
    });

    return this.metricRepository.save(metrics);
  }

  /**
   All Metrics off current user.
   */
  async findAllByUserId(id: number): Promise<Metric[]> {
    const isUser = await this.userService.findOneById(id);

    if (!isUser)
      throw new NotFoundException('User with id = ' + id + ' Not Found');

    return this.metricRepository.findBy({
      user: id,
    });
  }

  async updateMetrics(
    id: number,
    userId: number,
    updateMetricDto: UpdateMetricDto,
  ) {
    const isUser = await this.userService.findOneById(id);

    if (!isUser)
      throw new NotFoundException('User with id = ' + userId + ' Not Found');

    const alert = await this.metricRepository.update(
      { id, user: userId },
      updateMetricDto as IMetric,
    );

    if (!alert.affected)
      throw new NotFoundException(
        'Metrics with provided Id = ' +
          id +
          ' not found in list of user = ' +
          userId +
          ' metrics.',
      );

    return alert;
  }

  async getUserMetricsForLastWeek(userId: number): Promise<Metric[]> {
    const isUser = await this.userService.findOneById(userId);

    if (!isUser)
      throw new NotFoundException('User with id = ' + userId + ' Not Found');

    return this.metricRepository
      .createQueryBuilder()
      .where('EXTRACT(WEEK FROM createdAt) = EXTRACT(WEEK FROM CURRENT_DATE)')
      .andWhere(
        'EXTRACT(YEAR FROM createdAt) = EXTRACT(YEAR FROM CURRENT_DATE)',
      )
      .andWhere('"userId" = :userId', { userId })
      .getMany();
  }

  async getUserDailyMetrics(userId: number): Promise<Metric[]> {
    const isUser = await this.userService.findOneById(userId);

    if (!isUser)
      throw new NotFoundException('User with id = ' + userId + ' Not Found');

    return this.metricRepository
      .createQueryBuilder()
      .where('createdAt::date = CURRENT_DATE')
      .andWhere('"userId" = :userId', { userId })
      .getMany();
  }

  /**
   Function is overloaded here.
   If only 1 param will get result for current month.
   If timestamp parameter is provided result will be for provided month
   */
  async getUserMetricsForMonth(
    userId: number,
    timestamp?: Date,
  ): Promise<Metric[]> {
    if (!timestamp) timestamp = new Date();
    else timestamp = new Date(timestamp);

    const isUser = await this.userService.findOneById(userId);

    if (!isUser)
      throw new NotFoundException('User with id = ' + userId + ' Not Found');

    const metrics = await this.metricRepository
      .createQueryBuilder('metric')
      .where('EXTRACT(MONTH FROM metric.createdAt) = :month', {
        month: timestamp.getMonth() + 1,
      })
      .andWhere('EXTRACT(YEAR FROM metric.createdAt) = :year', {
        year: timestamp.getFullYear(),
      })
      .andWhere('metric.userId = :userId', { userId })
      .getMany();

    if (!Array.isArray(metrics) || metrics.length === 0)
      throw new NotFoundException(
        'Metrics for provided timestamp = ' +
          timestamp +
          ' not found in list of user = ' +
          userId +
          ' metrics.',
      );

    return metrics;
  }
  /**
   All Metrics off current user for some period.
   */
  async getUserMetricsByPeriod(
    userId: number,
    period: string,
    timestamp?: Date,
  ): Promise<Metric[]> {
    let metrics: Metric[];

    const isExist = await this.userService.findOneById(userId);

    if (!isExist)
      throw new NotFoundException('User with id = ' + userId + ' Not Found');

    switch (period) {
      case TimePeriod.DAILY:
        metrics = await this.getUserDailyMetrics(userId);
        break;
      case TimePeriod.WEEKLY:
        metrics = await this.getUserMetricsForLastWeek(userId);
        break;
      case TimePeriod.MONTHLY:
        metrics = await this.getUserMetricsForMonth(userId, timestamp);
        break;
      default:
        throw new BadRequestException(
          'Type of param period must be field of TimePeriod enum',
        );
    }

    if (!Array.isArray(metrics) || !metrics.length) {
      throw new NotFoundException(
        'User = ' + userId + period + ' metrics not found',
      );
    }

    return metrics;
  }

  async getUserAverageCalorieIntakeByPeriod(
    id: number,
    period: string,
  ): Promise<number> {
    let dayCount: number;

    switch (period) {
      case TimePeriod.DAILY:
        dayCount = 1;
        break;
      case TimePeriod.WEEKLY:
        dayCount = 7;
        break;
      case TimePeriod.MONTHLY:
        dayCount = 30;
    }

    const metrics = await this.getUserMetricsByPeriod(id, period);
    const sumMetric = metrics.reduce(
      (acc: number, metric: Metric) => acc + metric.calorieConsumption,
      0,
    );

    return sumMetric / dayCount;
  }

  async getUserStepsWalkedByPeriod(
    userId: number,
    period: string,
    timestamp?: Date,
  ): Promise<number> {
    const metrics = await this.getUserMetricsByPeriod(
      userId,
      period,
      timestamp,
    );
    return metrics.reduce(
      (acc: number, metric: Metric) => acc + metric.stepsWalked,
      0,
    );
  }
}

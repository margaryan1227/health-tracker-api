import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { Request as ExpressRequest } from 'express';
import { MetricsService } from './metrics.service';
import { CreateMetricDto } from './dto/create-metric.dto';
import { AuthGuard } from '../auth/auth.guard';
import { UpdateMetricDto } from './dto/update-metric.dto';

@Controller('metrics')
export class MetricsController {
  constructor(private readonly metricsService: MetricsService) {}

  @UseGuards(AuthGuard)
  @Post()
  async create(
    @Body() createMetricDto: CreateMetricDto,
    @Request() req: ExpressRequest,
  ) {
    return this.metricsService.create(createMetricDto, req.user.id);
  }

  @UseGuards(AuthGuard)
  @Get()
  async findAll(@Request() req: ExpressRequest) {
    return this.metricsService.findAllByUserId(req.user.id);
  }

  @UseGuards(AuthGuard)
  @Get('calorieIntake/:period')
  async getUserAverageCalorieIntakeByPeriod(
    @Request() req: ExpressRequest,
    @Param() params: Record<'period', string>,
  ) {
    return this.metricsService.getUserAverageCalorieIntakeByPeriod(
      req.user.id,
      params.period,
    );
  }

  @UseGuards(AuthGuard)
  @Get('stepsWalked/:period')
  async getUserStepsWalkedByPeriod(
    @Request() req: ExpressRequest,
    @Param() params: Record<'period', string>,
    @Body() body?: Record<'timestamp', Date>,
  ) {
    return this.metricsService.getUserStepsWalkedByPeriod(
      req.user.id,
      params.period,
      body?.timestamp,
    );
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  async updateMetrics(
    @Request() req: ExpressRequest,
    @Body() updateMetricDto: UpdateMetricDto,
    @Param() params: Record<'id', string>,
  ) {
    return this.metricsService.updateMetrics(
      +params.id,
      req.user.id,
      updateMetricDto,
    );
  }
}

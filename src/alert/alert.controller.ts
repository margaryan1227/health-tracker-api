import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { Request as ExpressRequest } from 'express';
import { AlertService } from './alert.service';
import { CreateAlertDto } from './dto/create-alert.dto';
import { UpdateAlertDto } from './dto/update-alert.dto';
import { AuthGuard } from '../auth/auth.guard';
import { Alert } from './entities/alert.entity';

@Controller('alert')
export class AlertController {
  constructor(private readonly alertService: AlertService) {}

  @UseGuards(AuthGuard)
  @Post()
  async create(
    @Body() createAlertDto: CreateAlertDto,
    @Request() req: ExpressRequest,
  ) {
    createAlertDto.user = req.user.id;
    return this.alertService.create(createAlertDto);
  }

  @UseGuards(AuthGuard)
  @Get()
  async findAll(@Request() req: ExpressRequest): Promise<Alert[]> {
    return this.alertService.findAllByUserId(req.user.id);
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  async findOne(
    @Param() params: Record<'id', string>,
    @Request() req: ExpressRequest,
  ): Promise<Alert> {
    return this.alertService.findOne(+params.id, req.user.id);
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  async update(
    @Param() params: Record<'id', string>,
    @Body() updateAlertDto: UpdateAlertDto,
    @Request() req: ExpressRequest,
  ) {
    return this.alertService.update(+params.id, updateAlertDto, req.user.id);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  async remove(
    @Param() params: Record<'id', string>,
    @Request() req: ExpressRequest,
  ) {
    return this.alertService.remove(+params.id, req.user.id);
  }
}

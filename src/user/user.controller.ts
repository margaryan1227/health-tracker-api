import {
  Controller,
  Get,
  Post,
  Param,
  Request,
  UseGuards,
  Delete,
} from '@nestjs/common';
import { Request as ExpressRequest } from 'express';
import { UserService } from './user.service';
import { AuthGuard } from '../auth/auth.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(AuthGuard)
  @Get()
  async findOne(@Request() req: ExpressRequest) {
    return this.userService.findOneById(req.user.id);
  }

  @UseGuards(AuthGuard)
  @Post('addFriend/:id')
  async addFriend(
    @Request() req: ExpressRequest,
    @Param() params: Record<'id', string>,
  ) {
    return this.userService.addFriend(req.user.id, +params.id);
  }

  @UseGuards(AuthGuard)
  @Get('getFriends')
  async getFriends(@Request() req: ExpressRequest) {
    return this.userService.getFriends(req.user.id);
  }

  @UseGuards(AuthGuard)
  @Delete('deleteFriend/:id')
  async removeFriend(
    @Request() req: ExpressRequest,
    @Param() params: Record<'id', string>,
  ) {
    return this.userService.removeFriend(req.user.id, +params.id);
  }

  @UseGuards(AuthGuard)
  @Get('compare/:id')
  async compareMetricsWithFriend(
    @Request() req: ExpressRequest,
    @Param() params: Record<'id', string>,
  ) {
    return this.userService.compareMetricsWithFriend(req.user.id, +params.id);
  }
}

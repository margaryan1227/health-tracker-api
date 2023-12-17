import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateAlertDto } from './dto/create-alert.dto';
import { UpdateAlertDto } from './dto/update-alert.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Alert } from './entities/alert.entity';
import { Repository } from 'typeorm';
import { UserService } from '../user/user.service';

@Injectable()
export class AlertService {
  constructor(
    @InjectRepository(Alert)
    private readonly alertRepository: Repository<Alert>,
    private readonly userService: UserService,
  ) {}
  async create(createAlertDto: CreateAlertDto): Promise<Alert> {
    if (new Date(createAlertDto.targetTimestamp) <= new Date())
      throw new BadRequestException(
        'targetTimeStamp should be later then current',
      );

    const alert = this.alertRepository.create(createAlertDto);
    await this.alertRepository.save(alert);

    return alert;
  }

  async findAllByUserId(id: number): Promise<Alert[]> {
    const isUser = await this.userService.findOneById(id);

    if (!isUser)
      throw new NotFoundException('User with id = ' + id + ' Not Found');

    return this.alertRepository
      .createQueryBuilder('alert')
      .where('"userId" = :id', { id })
      .getMany();
  }

  async findOne(id: number, userId: number): Promise<Alert> {
    const isUser = await this.userService.findOneById(id);

    if (!isUser)
      throw new NotFoundException('User with id = ' + userId + ' Not Found');

    const alert = await this.alertRepository
      .createQueryBuilder()
      .where('"userId" = :userId', { userId })
      .andWhere('id = :id', { id })
      .getOne();

    if (!alert)
      throw new NotFoundException(
        'Alert with provided Id = ' +
          id +
          ' not found in list of user = ' +
          userId +
          ' alerts.',
      );

    return alert;
  }

  async update(id: number, updateAlertDto: UpdateAlertDto, userId: number) {
    const isUser = await this.userService.findOneById(id);
    const alert = await this.alertRepository
      .createQueryBuilder()
      .update(Alert)
      .set(updateAlertDto)
      .where('"userId" = :userId', { userId })
      .andWhere('id = :id', { id })
      .returning('*')
      .execute();

    if (!isUser)
      throw new NotFoundException('User with id = ' + userId + ' Not Found');
    if (!alert)
      throw new NotFoundException(
        'Alert with provided Id = ' +
          id +
          ' not found in list of user = ' +
          userId +
          ' alerts.',
      );

    return alert;
  }

  async remove(id: number, userId: number) {
    const isUser = await this.userService.findOneById(id);
    const alert = await this.alertRepository
      .createQueryBuilder()
      .delete()
      .where('"userId" = :userId', { userId })
      .andWhere('id = :id', { id })
      .returning('*')
      .execute();

    if (!isUser)
      throw new NotFoundException('User with id = ' + userId + ' Not Found');
    if (!alert.affected)
      throw new NotFoundException(
        'Alert with provided Id = ' +
          id +
          ' not found in list of user = ' +
          userId +
          ' alerts.',
      );

    return alert;
  }
}

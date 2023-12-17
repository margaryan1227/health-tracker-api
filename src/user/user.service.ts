import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { UserRel } from './entities/user-rel.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(UserRel)
    private readonly userRelRepository: Repository<UserRel>,
    private readonly configService: ConfigService,
  ) {}

  /**
   For Creating User
   */
  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = this.userRepository.create(createUserDto);
    user.setPassword(user.password, this.configService.get<string>('SALT'));

    return this.userRepository.save(user);
  }

  /**
   For Getting User Only
   */
  async findByEmail(email: string): Promise<User> {
    return this.userRepository.findOneBy({ email });
  }

  /**
   For Getting User with all his Metrics
   */
  async findOneById(id: number): Promise<User> {
    return this.userRepository.findOneBy({ id });
  }

  async addFriend(userId: number, friendId: number) {
    const user = await this.userRepository.findOneBy({ id: userId });
    const friend = await this.userRepository.findOneBy({ id: friendId });

    if (!user)
      throw new NotFoundException('User with id = ' + userId + ' Not Found');
    if (!friend)
      throw new NotFoundException('User with id = ' + friendId + ' Not Found');
    if (userId === friendId)
      throw new BadRequestException(`User can't add himself to friends`);

    const isExist = await this.getFriend(userId, friendId);

    if (isExist)
      throw new BadRequestException(
        'Users ' + userId + ' and ' + friendId + 'are already friends',
      );

    const userRel = this.userRelRepository.create({
      user1Id: userId,
      user2Id: friendId,
    });

    await this.userRelRepository.save(userRel);
    return userRel;
  }

  async getFriends(userId: number) {
    const userFriends = await this.userRelRepository
      .createQueryBuilder()
      .where('"user1Id" = :userId', { userId })
      .orWhere('"user2Id" = :userId', { userId })
      .getMany();

    if (!Array.isArray(userFriends) || !userFriends.length)
      throw new NotFoundException('user = ' + userId + ' friends not found');

    return userFriends;
  }

  async getFriend(userId: number, friendId: number) {
    const possibleFreind = await this.userRelRepository
      .createQueryBuilder()
      .where('"user1Id" = :userId', { userId })
      .andWhere('"user2Id" = :friendId', { friendId })
      .orWhere('"user1Id" = :friendId', { friendId })
      .andWhere('"user2Id" = :userId', { userId })
      .getOne();

    if (!possibleFreind)
      throw new NotFoundException(
        'Users ' + userId + ' and ' + friendId + ' are not friends',
      );

    return possibleFreind;
  }

  async removeFriend(userId: number, friendId: number) {
    const possibleFriend = await this.getFriend(userId, friendId);
    return this.userRelRepository.delete({ id: possibleFriend.id });
  }

  /**
   Return Users all metrics, email, based on their relation.
   */
  async compareMetricsWithFriend(userId: number, friendId: number) {
    await this.getFriend(userId, friendId);
    return this.userRelRepository.query(
      `
          SELECT DISTINCT
              user1.email as userEmail,
              metrics1.*
          FROM user_rel
                   INNER JOIN users AS user1 ON user_rel."user1Id" = user1.id
                   INNER JOIN users AS user2 ON user_rel."user2Id" = user2.id
                   LEFT JOIN metric as metrics1 ON user1.id = metrics1."userId"
          WHERE (user_rel."user1Id" = $1 AND user_rel."user2Id" = $2)

          UNION

          SELECT DISTINCT
              user2.email as userEmail,
              metrics2.*
          FROM user_rel
                   INNER JOIN users AS user1 ON user_rel."user1Id" = user1.id
                   INNER JOIN users AS user2 ON user_rel."user2Id" = user2.id
                   LEFT JOIN metric as metrics2 ON user2.id = metrics2."userId"
          WHERE (user_rel."user1Id" = $1 AND user_rel."user2Id" = $2);

      `,
      [userId, friendId],
    );
  }
}

import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AuthDto } from './dto/auth.dto';
import { UserService } from '../user/user.service';
import { IUser } from '../common/interfaces/IUser';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}
  /**
   Registering new users
   */
  async register(authDto: AuthDto) {
    const isExist = await this.userService.findByEmail(authDto.email);

    if (isExist)
      throw new BadRequestException(
        'User with email = ' + authDto.email + ' already exist',
      );

    const user = await this.userService.create(authDto as IUser);

    user.token = await this.jwtService.signAsync({
      id: user.id,
      email: user.email,
    });
    user.password = null;

    return user;
  }

  /**
   Login
   */
  async signIn(authDto: AuthDto) {
    const user = await this.userService.findByEmail(authDto.email);

    if (!user) {
      throw new NotFoundException(
        'User with email ' + authDto.email + '  Not Found',
      );
    }

    const isValid = user.validatePassword(
      authDto.password,
      this.configService.get<string>('SALT'),
    );

    if (!isValid) {
      throw new ForbiddenException('Invalid credentials');
    }

    user.password = null;
    user.token = await this.jwtService.signAsync({
      id: user.id,
      email: user.email,
    });

    return user;
  }
}

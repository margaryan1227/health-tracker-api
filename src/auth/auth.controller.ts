import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-up')
  async register(@Body() authDto: AuthDto) {
    return this.authService.register(authDto);
  }

  @Post('sign-in')
  async signIn(@Body() authDto: AuthDto) {
    return this.authService.signIn(authDto);
  }
}

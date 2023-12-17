import { IUser } from '../../common/interfaces/IUser';
import { IsEmail, IsString, Length } from 'class-validator';

export class AuthDto implements IUser {
  @IsEmail()
  public email: string;

  @IsString()
  @Length(8, 16)
  public password: string;

  constructor(email: string = '', password: string = '') {
    this.email = email;
    this.password = password;
  }
}

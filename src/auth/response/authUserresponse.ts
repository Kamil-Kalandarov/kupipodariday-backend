import { IsEmail, IsString, IsUrl } from 'class-validator';

export class AuthUserresponse {
  @IsString()
  username: string;

  @IsString()
  about: string;

  @IsUrl()
  avatar: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsString()
  token: string;
}

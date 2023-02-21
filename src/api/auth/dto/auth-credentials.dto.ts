import { IsNotEmpty, IsString, MinLength } from 'class-validator';
import { IUser } from '@src/shared';

export class AuthCredentialsDto
  implements Pick<IUser, 'username' | 'password'>
{
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  password: string;
}

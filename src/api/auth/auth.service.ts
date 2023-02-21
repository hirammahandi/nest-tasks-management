import { PG_UNIQUE_VIOLATION } from '@drdgvhbh/postgres-error-codes'; // *@note library to get postgres errors codes
import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from 'jsonwebtoken';
import {
  INTERNAL_SERVER_ERROR_MESSAGE,
  INVALID_CREDENTIALS_MESSAGE,
  USERNAME_ALREADY_EXISTS_MESSAGE,
} from 'src/shared';
import { UserRepository } from '../user/repositories';
import { AuthCredentialsDto } from './dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async signUp(authCredentialsDto: AuthCredentialsDto) {
    try {
      const user = await this.userRepository.createUser(authCredentialsDto);

      return user;
    } catch (error) {
      if (error.code === PG_UNIQUE_VIOLATION) {
        throw new ConflictException(USERNAME_ALREADY_EXISTS_MESSAGE);
      }
      throw new InternalServerErrorException(INTERNAL_SERVER_ERROR_MESSAGE);
    }
  }

  async signIn(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<{ token: string }> {
    const username = await this.userRepository.validateUserPassword(
      authCredentialsDto,
    );

    if (!username) throw new UnauthorizedException(INVALID_CREDENTIALS_MESSAGE);

    return await this.signToken(username);
  }

  private async signToken(username: string): Promise<{ token: string }> {
    const jwtPayload: JwtPayload = {
      sub: username,
    };

    const token = await this.jwtService.signAsync(jwtPayload);

    return { token };
  }
}

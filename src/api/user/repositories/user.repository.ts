import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthCredentialsDto } from '../../auth/dto';
import { User } from '../entities';

@Injectable()
export class UserRepository extends Repository<User> {
  constructor(@InjectRepository(User) repository: Repository<User>) {
    super(repository.target, repository.manager, repository.queryRunner);
  }

  async createUser(authCredentialsDto: AuthCredentialsDto): Promise<User> {
    const user = this.create(authCredentialsDto);

    await user.save();

    return user;
  }

  async findByUsername(username: string): Promise<User | null> {
    const foundUser = await this.findOneBy({ username });

    return foundUser;
  }

  async validateUserPassword(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<string | null> {
    const { username, password } = authCredentialsDto;

    const user = await this.findByUsername(username);

    const isValidPassword = await user?.validatePassword(password);

    if (!user || !isValidPassword) return null;

    return user.username;
  }
}

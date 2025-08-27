import { Injectable } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from 'src/entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(data: any) {
    const user = this.userRepository.create(data);
    return await this.userRepository.save(user);
  }

  async findOne(email: string) {
    const user = await this.userRepository.findOne({ where: { email } });

    return user;
  }
}

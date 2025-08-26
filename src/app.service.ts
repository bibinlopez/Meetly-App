import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './templ.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  getHello(): string {
    console.log(process.env.DATABASE_URL);

    return 'Hello World!';
  }

  async createUser(name, place): Promise<User> {
    const poll = this.userRepository.create({ name, place });
    return this.userRepository.save(poll);
  }

  async getUsers(): Promise<User[]> {
    return this.userRepository.find();
  }
}

import { BadRequestException, Injectable } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from 'src/entities/user.entity';
import { Availability } from 'src/entities/availability.entity';
import {
  DayAvailability,
  DayOfWeekEnum,
} from 'src/entities/day-availability.entity';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Availability)
    private readonly availabilityRepository: Repository<Availability>,
    @InjectRepository(DayAvailability)
    private readonly dayAvailabilityRepository: Repository<DayAvailability>,
  ) {}

  async create(data: any) {
    // const user = this.userRepository.create(data);
    // return await this.userRepository.save(user);

    const existingUser = await this.userRepository.findOne({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new BadRequestException('User already exists');
    }

    const username = await this.generateUsername(data.name);

    const { name, email, password } = data;

    const user = this.userRepository.create({
      name,
      username,
      email,
      password,
    });

    const availability = this.availabilityRepository.create({
      timeGap: 30,
      days: Object.values(DayOfWeekEnum).map((day) => {
        return this.dayAvailabilityRepository.create({
          day: day,
          startTime: new Date(`2025-03-01T09:00:00Z`), //9:00
          endTime: new Date(`2025-03-01T17:00:00Z`), //5:00pm
          isAvailable:
            day !== DayOfWeekEnum.SUNDAY && day !== DayOfWeekEnum.SATURDAY,
        });
      }),
    });

    user.availability = availability;

    await this.userRepository.save(user);

    return { user: user.omitPassword() };
  }

  async findOne(email: string) {
    const user = await this.userRepository.findOne({ where: { email } });

    return user;
  }

  async generateUsername(name: string): Promise<string> {
    const cleanName = name.replace(/\s+/g, '').toLowerCase();
    const baseUsername = cleanName;

    const uuidSuffix = uuidv4().replace(/\s+/g, '').slice(0, 4);

    let username = `${baseUsername}${uuidSuffix}`;
    let existingUser = await this.userRepository.findOne({
      where: { username },
    });

    while (existingUser) {
      username = `${baseUsername}${uuidv4().replace(/\s+/g, '').slice(0, 4)}`;
      existingUser = await this.userRepository.findOne({
        where: { username },
      });
    }

    return username;
  }
}

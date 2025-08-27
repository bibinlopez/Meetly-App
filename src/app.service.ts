import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event } from './entities/event.entity';
import { slugify } from 'utils/helpers';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
  ) {}

  getHello(): string {
    return 'Hello World!';
  }

  async createEvent(body, { userId }) {
    const slug = slugify(body.title);

    console.log({ USERID: userId });
    const event = this.eventRepository.create({
      slug,
      user: { id: userId },
      ...body,
    });
    await this.eventRepository.save(event);
    return event;
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { slugify } from 'utils/helpers';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/entities/user.entity';
import { Event } from './entities/event.entity';

@Injectable()
export class EventService {
  constructor(
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}
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
  async getUserEvents({ userId }) {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.events', 'event')
      .loadRelationCountAndMap('event._count.meetings', 'event.meetings')
      .where('user.id = :userId', { userId })
      .orderBy('event.createdAt', 'DESC')
      .getOne();

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return {
      events: user.events,
      username: user.username,
    };
  }

  toggleEventPrivacyService = async ({ userId }, eventId: string) => {
    console.log({ eventId });

    const event: any = await this.eventRepository.findOne({
      where: { id: eventId, user: { id: userId } },
    });

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    event.isPrivate = !event.isPrivate;
    await this.eventRepository.save(event);

    return event;
  };

  getPublicEventsByUsernameService = async (username: string) => {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect(
        'user.events',
        'event',
        'event.isPrivate = :isPrivate',
        {
          isPrivate: false,
        },
      )
      .where('user.username = :username', { username })
      .select(['user.id', 'user.name', 'user.imageUrl'])
      .addSelect([
        'event.id',
        'event.title',
        'event.description',
        'event.slug',
        'event.duration',
        'event.locationType',
      ])
      .orderBy('event.createdAt', 'DESC')
      .getOne();

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return {
      user: {
        name: user.name,
        username: username,
        imageUrl: user.imageUrl,
      },
      events: user.events,
    };
  };
}

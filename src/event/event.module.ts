import { Module } from '@nestjs/common';
import { EventService } from './event.service';
import { EventController } from './event.controller';
import { UserModule } from 'src/user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Event } from './entities/event.entity';

@Module({
  imports: [UserModule, TypeOrmModule.forFeature([Event, User]), EventModule],
  controllers: [EventController],
  providers: [EventService],
})
export class EventModule {}

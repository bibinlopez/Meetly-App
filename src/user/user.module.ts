import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { Availability } from 'src/entities/availability.entity';
import { DayAvailability } from 'src/entities/day-availability.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Availability, DayAvailability])],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}

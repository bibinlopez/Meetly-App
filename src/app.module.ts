import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from './db/datasource';
import { AuthModule } from './auth/auth.module';
import { User2Module } from './user/user.module';
import { Event } from './entities/event.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot(dataSourceOptions),
    AuthModule,
    User2Module,
    TypeOrmModule.forFeature([Event]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

import {
  Controller,
  Get,
  Request,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Put,
} from '@nestjs/common';
import { EventService } from './event.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('event')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('user/event')
  createEvent(@Body() body, @Request() req) {
    console.log(req.user);

    return this.eventService.createEvent(body, req.user);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('user/events')
  getUserEvents(@Request() req) {
    console.log(req.user);
    return this.eventService.getUserEvents(req.user);
  }

  @UseGuards(AuthGuard('jwt'))
  @Put('toggle-privacy')
  async toggleEventPrivacy(@Request() req, @Body() { eventId }) {
    console.log(req.user);
    console.log({ eventId });
    const event: any = await this.eventService.toggleEventPrivacyService(
      req.user,
      eventId,
    );

    return {
      message: `Event set to ${
        event.isPrivate ? 'private' : 'public'
      } successfully`,
    };
  }

  @Get('/:username')
  async getPublicEventsByUsernameService(
    @Request() req,
    @Param('username') username,
  ) {
    console.log({ username });

    const { user, events } =
      await this.eventService.getPublicEventsByUsernameService(username);

    return { user, events };
  }
}

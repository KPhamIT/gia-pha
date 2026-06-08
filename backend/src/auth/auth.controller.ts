import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { FacebookLoginDto } from './dto/facebook-login.dto.js';
import { JwtAuthGuard } from './jwt-auth.guard.js';
import { PersonService } from '../person/person.service.js';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly personService: PersonService,
  ) {}

  @Post('facebook')
  async loginWithFacebook(@Body() body: FacebookLoginDto) {
    return this.authService.loginWithFacebook(body.accessToken);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async me(@Request() req: any) {
    const user = req.user;
    if (user) {
      const person = await this.personService.findByUserId(user.id);
      return { user, person };
    }

    if (process.env.ALLOW_PUBLIC_ACCESS === 'true') {
      const persons = await this.personService.findAll();
      return {
        user: { id: 0, email: 'dev@local', provider: 'dev' },
        person: persons.length ? persons[0] : null,
      };
    }

    throw new UnauthorizedException();
  }
}

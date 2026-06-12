import { Body, Controller, Get, Post, Request } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { FacebookLoginDto } from './dto/facebook-login.dto.js';
import { PersonService } from '../person/person.service.js';

interface AuthenticatedRequest {
  user?: { id: number; email: string | null; provider: string };
}

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

  @Get('me')
  async me(@Request() req: AuthenticatedRequest) {
    const user = req.user;
    if (user) {
      const person = await this.personService.findByUserId(user.id);
      return { user, person };
    }

    const persons = await this.personService.findAll();
    return {
      user: { id: 0, email: 'dev@local', provider: 'dev' },
      person: persons.length ? persons[0] : null,
    };
  }
}

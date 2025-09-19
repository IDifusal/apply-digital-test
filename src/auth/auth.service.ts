import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

// Para el assessment: usuario demo vía env o hardcode
const DEMO_USER = { id: 1, email: 'test@test.com', password: 'test123' };

@Injectable()
export class AuthService {
  constructor(private readonly jwt: JwtService) {}

  validateUser(email: string, password: string): { id: number; email: string } {
    if (email === DEMO_USER.email && password === DEMO_USER.password) {
      return { id: DEMO_USER.id, email: DEMO_USER.email };
    }
    throw new UnauthorizedException();
  }

  login(user: { id: number; email: string }): { access_token: string } {
    const payload = { sub: user.id, email: user.email };
    return { access_token: this.jwt.sign(payload) };
  }
}

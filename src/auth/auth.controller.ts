import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './login.dto';

@ApiTags('Private - Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}
  @Post('login')
  login(@Body() dto: LoginDto) {
    const user = this.auth.validateUser(dto.email, dto.password);
    return this.auth.login(user);
  }
}

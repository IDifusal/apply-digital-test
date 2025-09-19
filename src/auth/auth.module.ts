import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import configuration from '../config/configuration';
import { AuthController } from './auth.controller';

const cfg = configuration();

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: cfg.jwt.secret,
      signOptions: { expiresIn: cfg.jwt.expiresIn },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [JwtModule],
})
export class AuthModule {}

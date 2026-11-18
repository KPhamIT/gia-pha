import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthController } from './auth.controller.js';
import { AuthService } from './auth.service.js';
import { JwtStrategy } from './jwt.strategy.js';
import { ZaloOAuthService } from './zalo-oauth.service.js';
import { PrismaModule } from '../prisma/prisma.module.js';
import { MailModule } from '../mail/mail.module.js';
import { EmailVerificationService } from './email-verification.service.js';
import { StandardFeaturesModule } from '../standard-features/standard-features.module.js';

@Module({
  imports: [
    ConfigModule,
    PrismaModule,
    MailModule,
    StandardFeaturesModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET', 'change-me'),
        signOptions: { expiresIn: '7d' },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    EmailVerificationService,
    JwtStrategy,
    ZaloOAuthService,
  ],
  exports: [AuthService, EmailVerificationService],
})
export class AuthModule {}

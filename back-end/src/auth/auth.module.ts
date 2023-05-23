import { forwardRef, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { config } from '@/config/config';
import { DatabaseModule } from '@/external-modules/database/mongo.module';
import { AuthService } from '@/auth/auth.service';
import { AuthController } from '@/auth/auth.controller';
import { UsersModule } from '@/base/users/users.module';
import { JwtStrategy } from '@/auth/strategy/jwt.strategy';
import { AuthEventEmitter } from '@/auth/events/auth.events';
import { UsersRepository } from '@/base/users/users.repository';
import { MailjetListeners } from '@/common/providers/mailjet.provider';
import { MailjetModule } from '@/external-modules/mailjet/mailjet.module';
import { AllowedStudentsRepository } from '@/base/users/allowed.students.repository';

@Module({
	imports: [
		DatabaseModule,
		MailjetModule,
		JwtModule.register({
			secret: config.jwt.secret,
			signOptions: { expiresIn: '30d' },
		}),
		forwardRef(() => UsersModule),
	],
	providers: [AuthService, JwtStrategy, AuthEventEmitter, UsersRepository, AllowedStudentsRepository, MailjetListeners],
	controllers: [AuthController],
	exports: [AuthService],
})
export class AuthModule {}

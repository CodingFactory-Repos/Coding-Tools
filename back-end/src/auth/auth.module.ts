import { forwardRef, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { config } from 'src/config/config';
import { DatabaseModule } from 'src/external-modules/database/mongo.module';
import { AuthService } from 'src/auth/auth.service';
import { AuthController } from 'src/auth/auth.controller';
import { UsersModule } from 'src/base/users/users.module';
import { JwtStrategy } from 'src/auth/strategy/jwt.strategy';
import { AuthEventEmitter } from 'src/auth/events/auth.events';
import { UsersRepository } from 'src/base/users/users.repository';
import { MailjetListeners } from 'src/common/providers/mailjet.service';

@Module({
	imports: [
		DatabaseModule,
		JwtModule.register({
			secret: config.jwt.secret,
			signOptions: { expiresIn: '30d' },
		}),
		forwardRef(() => UsersModule),
	],
	providers: [AuthService, JwtStrategy, AuthEventEmitter, UsersRepository, MailjetListeners],
	controllers: [AuthController],
	exports: [AuthService],
})
export class AuthModule {}

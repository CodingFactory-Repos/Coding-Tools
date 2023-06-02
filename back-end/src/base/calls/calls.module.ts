import { forwardRef, Module } from '@nestjs/common';

import { AuthModule } from 'src/auth/auth.module';
import { DatabaseModule } from 'src/external-modules/database/mongo.module';

import { UsersRepository } from 'src/base/users/users.repository';
import { CallsRepository } from 'src/base/calls/calls.repository';
import { CallsService } from 'src/base/calls/calls.service';
import { CallsController } from 'src/base/calls/calls.controller';
import { JwtModule } from '@nestjs/jwt';
import { config } from '@/config/config';

@Module({
	imports: [
		DatabaseModule,
		JwtModule.register({
			secret: config.jwt.secret,
			signOptions: { expiresIn: '3min' },
		}),
		forwardRef(() => AuthModule),
	],
	providers: [CallsService, CallsRepository, UsersRepository],
	controllers: [CallsController],
	exports: [CallsService, CallsRepository],
})
export class CallsModule {}

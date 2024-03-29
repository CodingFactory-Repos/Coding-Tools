import { forwardRef, Module } from '@nestjs/common';

import { AuthModule } from 'src/auth/auth.module';
import { DatabaseModule } from 'src/external-modules/database/mongo.module';

import { UsersRepository } from 'src/base/users/users.repository';
import { RetrospectivesRepository } from 'src/base/retrospectives/retrospectives.repository';
import { RetrospectivesService } from 'src/base/retrospectives/retrospectives.service';
import { RetrospectivesController } from 'src/base/retrospectives/retrospectives.controller';
import { RetrospectiveGateway } from '@/common/gateways/retrospective.global.gateway';
import { JwtService } from '@nestjs/jwt';
import { RetrospectivesRoomInvitationRepository } from './retrospectivesRoomInvitation.repository';
import { RetrospectivesEventEmitter } from './events/retrospectives.events';

@Module({
	imports: [DatabaseModule, forwardRef(() => AuthModule)],
	providers: [
		JwtService,
		RetrospectivesService,
		RetrospectivesEventEmitter,
		RetrospectivesRepository,
		RetrospectivesRoomInvitationRepository,
		UsersRepository,
		RetrospectiveGateway,
	],
	controllers: [RetrospectivesController],
	exports: [RetrospectivesService, RetrospectivesRepository],
})
export class RetrospectivesModule {}

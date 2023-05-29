import { forwardRef, Module } from '@nestjs/common';

import { AuthModule } from '@/auth/auth.module';
import { DatabaseModule } from '@/external-modules/database/mongo.module';

import { UsersRepository } from '@/base/users/users.repository';
import { CanvasRoomRepository } from '@/base/canvasRoom/canvasRoom.repository';
import { CanvasRoomService } from '@/base/canvasRoom/canvasRoom.service';
import { CanvasRoomController } from '@/base/canvasRoom/canvasRoom.controller';
import { CanvasRoomEventEmitter } from '@/base/canvasRoom/events/canvasRoom.events';
import { CanvasGateway } from '@/common/gateways/canvas.global.gateway';
import { JwtService } from '@nestjs/jwt';
import { CanvasRoomInvitationRepository } from './canvasRoomInvitation.repository';
import { MailjetModule } from '@/external-modules/mailjet/mailjet.module';

@Module({
	imports: [DatabaseModule, MailjetModule, forwardRef(() => AuthModule)],
	providers: [JwtService, CanvasRoomEventEmitter, CanvasRoomService, CanvasRoomRepository, CanvasRoomInvitationRepository, UsersRepository, CanvasGateway],
	controllers: [CanvasRoomController],
	exports: [CanvasRoomService, CanvasRoomRepository],
})
export class CanvasRoomModule {}

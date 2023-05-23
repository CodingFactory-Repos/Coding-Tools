import { forwardRef, Module } from '@nestjs/common';

import { AuthModule } from 'src/auth/auth.module';
import { DatabaseModule } from 'src/external-modules/database/mongo.module';

import { UsersRepository } from 'src/base/users/users.repository';
import { CanvasRoomRepository } from '@/base/canvasRoom/canvasRoom.repository';
import { CanvasRoomService } from '@/base/canvasRoom/canvasRoom.service';
import { CanvasRoomController } from '@/base/canvasRoom/canvasRoom.controller';
import { CanvasGateway } from '@/common/gateways/canvas.global.gateway';
import { JwtService } from '@nestjs/jwt';

@Module({
	imports: [DatabaseModule, forwardRef(() => AuthModule)],
	providers: [JwtService, CanvasRoomService, CanvasRoomRepository, UsersRepository, CanvasGateway],
	controllers: [CanvasRoomController],
	exports: [CanvasRoomService, CanvasRoomRepository],
})
export class CanvasRoomModule {}

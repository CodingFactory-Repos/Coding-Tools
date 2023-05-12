import { JwtService } from '@nestjs/jwt';
import { ChatGateway } from '@/common/gateways/chat.global.gateway';
import { Module } from '@nestjs/common';

@Module({
	imports: [],
	providers: [JwtService, ChatGateway],
	controllers: [],
	exports: [],
})
export class ChatModule {}

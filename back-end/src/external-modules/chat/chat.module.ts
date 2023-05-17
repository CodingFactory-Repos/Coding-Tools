import { JwtService } from '@nestjs/jwt';
import { ChatGateway } from '@/common/gateways/chat.global.gateway';
import { forwardRef, Module } from '@nestjs/common';
import { AuthModule } from '@/auth/auth.module';

@Module({
	imports: [forwardRef(() => AuthModule)],
	providers: [JwtService, ChatGateway],
	controllers: [],
	exports: [],
})
export class ChatModule {}

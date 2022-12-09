import { forwardRef, Module } from '@nestjs/common';

import { AuthModule } from 'src/auth/auth.module';
import { DatabaseModule } from 'src/external-modules/database/mongo.module';

import { UsersController } from 'src/base/users/users.controller';
import { UsersService } from 'src/base/users/users.service';

@Module({
	imports: [DatabaseModule, forwardRef(() => AuthModule)],
	providers: [UsersService],
	controllers: [UsersController],
	exports: [UsersService],
})
export class UsersModule {}

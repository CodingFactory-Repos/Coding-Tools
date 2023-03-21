import { forwardRef, Module } from '@nestjs/common';

import { AuthModule } from 'src/auth/auth.module';
import { DatabaseModule } from 'src/external-modules/database/mongo.module';

import { UsersRepository } from 'src/base/users/users.repository';
import { MaterialsRepository } from 'src/base/materials/materials.repository';
import { MaterialsService } from 'src/base/materials/materials.service';
import { MaterialsController } from 'src/base/materials/materials.controller';
import { JwtModule } from '@nestjs/jwt';
import { config } from '@/config/config';

@Module({
	imports: [
		DatabaseModule,
		JwtModule.register({
			secret: config.jwt.secret,
			signOptions: { expiresIn: '1d' },
		}),
		forwardRef(() => AuthModule)],
	providers: [MaterialsService, MaterialsRepository, UsersRepository],
	controllers: [MaterialsController],
	exports: [MaterialsService, MaterialsRepository],
})
export class MaterialsModule {}

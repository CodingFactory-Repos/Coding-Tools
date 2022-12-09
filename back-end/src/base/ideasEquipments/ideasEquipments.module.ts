import { forwardRef, Module } from '@nestjs/common';

import { AuthModule } from 'src/auth/auth.module';
import { DatabaseModule } from 'src/external-modules/database/mongo.module';

import { UsersRepository } from 'src/base/users/users.repository';
import { IdeasEquipmentsRepository } from 'src/base/ideasEquipments/ideasEquipments.repository';
import { IdeasEquipmentsService } from 'src/base/ideasEquipments/ideasEquipments.service';
import { IdeasEquipmentsController } from 'src/base/ideasEquipments/ideasEquipments.controller';

@Module({
	imports: [DatabaseModule, forwardRef(() => AuthModule)],
	providers: [IdeasEquipmentsService, IdeasEquipmentsRepository, UsersRepository],
	controllers: [IdeasEquipmentsController],
	exports: [IdeasEquipmentsService, IdeasEquipmentsRepository],
})
export class IdeasEquipmentsModule {}

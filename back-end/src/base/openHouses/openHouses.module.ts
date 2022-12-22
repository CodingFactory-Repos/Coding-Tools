import { forwardRef, Module } from '@nestjs/common';

import { AuthModule } from 'src/auth/auth.module';
import { DatabaseModule } from 'src/external-modules/database/mongo.module';

import { UsersRepository } from 'src/base/users/users.repository';
import { OpenHousesRepository } from 'src/base/openHouses/openHouses.repository';
import { OpenHousesService } from 'src/base/openHouses/openHouses.service';
import { OpenHousesController } from 'src/base/openHouses/openHouses.controller';

@Module({
	imports: [DatabaseModule, forwardRef(() => AuthModule)],
	providers: [OpenHousesService, OpenHousesRepository, UsersRepository],
	controllers: [OpenHousesController],
	exports: [OpenHousesService, OpenHousesRepository],
})
export class OpenHousesModule {}

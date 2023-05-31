import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';

import { AppController } from 'src/app.controller';
import { AppService } from 'src/app.service';
import { CronService } from 'src/cron/cron.service';

import { DatabaseModule } from 'src/external-modules/database/mongo.module';
import { AuthModule } from 'src/auth/auth.module';
import { UsersModule } from 'src/base/users/users.module';
import { AcademicYearModule } from 'src/base/academicYears/academicYears.module';
import { CanvasRoomModule } from '@/base/canvasRoom/canvasRoom.module';
import { ArticlesModule } from 'src/base/articles/articles.module';
import { BoardsModule } from 'src/base/boards/boards.module';
import { CallsModule } from 'src/base/calls/calls.module';
import { CoursesModule } from 'src/base/courses/courses.module';
import { EquipmentsLoanModule } from 'src/base/equipmentsLoan/equipmentsLoan.module';
import { GroupsModule } from 'src/base/groups/groups.module';
import { IdeasEquipmentsModule } from 'src/base/ideasEquipments/ideasEquipments.module';
import { MaterialsModule } from 'src/base/materials/materials.module';
import { OpenHousesModule } from 'src/base/openHouses/openHouses.module';
import { ProjectsModule } from 'src/base/projects/projects.module';
import { RetrospectivesModule } from 'src/base/retrospectives/retrospectives.module';
// @ts-ignore
import { ScheduleModule } from '@nestjs/schedule';

@Module({
	imports: [
		ConfigModule.forRoot(),
		EventEmitterModule.forRoot(),
		DatabaseModule,
		AuthModule,
		UsersModule,
		AcademicYearModule,
		CanvasRoomModule,
		ArticlesModule,
		BoardsModule,
		CallsModule,
		CoursesModule,
		EquipmentsLoanModule,
		GroupsModule,
		IdeasEquipmentsModule,
		MaterialsModule,
		OpenHousesModule,
		ProjectsModule,
		RetrospectivesModule,
		ScheduleModule.forRoot(),
	],
	controllers: [AppController],
	providers: [AppService, CronService],
})
export class AppModule {}

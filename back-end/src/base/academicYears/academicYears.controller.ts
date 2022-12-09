import { Controller, Get, Res, UseFilters } from '@nestjs/common';
import { Response } from 'express';
import { ServiceErrorCatcher } from 'src/common/decorators/catch.decorator';
import { AcademicYearsService } from 'src/base/academicYears/academicYears.service';

@Controller('academic')
@UseFilters(ServiceErrorCatcher)
export class AcademicYearsController {
	constructor(private readonly academicYearsService: AcademicYearsService) {}

	@Get()
	index(@Res() res: Response) {
		return res.status(201).json({ status: 'ok' });
	}
}

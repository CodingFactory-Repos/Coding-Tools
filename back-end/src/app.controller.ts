import { cwd } from 'process';
import { Response } from 'express-serve-static-core';
import { join, resolve } from 'path';
import {
	Controller,
	FileTypeValidator,
	Get,
	MaxFileSizeValidator,
	Param,
	ParseFilePipe,
	Res,
	Post,
	UploadedFile,
	UseFilters,
	UseGuards,
	UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AppService } from '@/app.service';
import { ServiceError, ServiceErrorCatcher } from '@/common/decorators/catch.decorator';
import { JwtAuthGuard } from '@/common/guards/auth.guard';

@Controller()
@UseFilters(ServiceErrorCatcher)
export class AppController {
	constructor(private readonly appService: AppService) {}
	private readonly UPLOADS_DIR = resolve(join(cwd(), 'uploads'));
	private readonly UPLOADS_CONTEXT = ['private', 'public'];

	@Get()
	getHello(@Res() res: Response) {
		const msg = this.appService.getHello();
		return res.status(201).json({ status: 'ok', message: msg });
	}

	@Post('upload/:context')
	@UseGuards(JwtAuthGuard)
	@UseInterceptors(FileInterceptor('file'))
	async uploadFile(
		@UploadedFile(
			new ParseFilePipe({
				validators: [
					new MaxFileSizeValidator({ maxSize: 5 * 1000000 }),
					new FileTypeValidator({ fileType: /image\/jpeg|image\/png|image\/webp/i }),
				],
			}),
		)
		// @ts-ignore
		file: Express.Multer.File,
		@Param('context') context: string,
		@Res() res: Response,
	) {
		if (!this.UPLOADS_CONTEXT.includes(context)) {
			throw new ServiceError('BAD_REQUEST', 'Context is now allowed');
		}

		const url = await this.appService.uploadImage(this.UPLOADS_DIR, context, file.buffer);
		return res.status(201).json({ status: 'ok', url });
	}

	@Get('/public/images/:fileName')
	async servePublicImage(@Param('fileName') fileName: string, @Res() res: Response) {
		res.sendFile(fileName, { root: this.UPLOADS_DIR });
	}

	@Get('/private/images/:fileName')
	@UseGuards(JwtAuthGuard)
	async serveImage(@Param('fileName') fileName: string, @Res() res: Response) {
		res.sendFile(fileName, { root: this.UPLOADS_DIR });
	}
}

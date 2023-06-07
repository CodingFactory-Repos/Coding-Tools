import { Injectable, Logger as NestLogger } from '@nestjs/common';
import { createWriteStream } from 'fs';
import { v4 as uuid } from 'uuid';
import sharp from 'sharp';
import { config } from '@/config/config';
import { join } from 'path';
import { ServiceError } from '@/common/decorators/catch.decorator';

@Injectable()
export class AppService {
	getHello(): string {
		return 'Hello World!';
	}

	async uploadImage(DIR: string, context: string, buffer: Buffer) {
		try {
			const fileName = `${uuid()}.webp`;
			const filePath = join(DIR, fileName);
			const webpBuffer = await sharp(buffer).webp().toBuffer();
			const writeStream = createWriteStream(filePath);
			writeStream.write(webpBuffer);
			writeStream.end();

			return `${config.app.base}/${context}/images/${fileName}`;
		} catch (err) {
			if (err instanceof Error) {
				NestLogger.error(err.message);
				throw new ServiceError('BAD_REQUEST', 'Could not process the file');
			}
		}
	}
}

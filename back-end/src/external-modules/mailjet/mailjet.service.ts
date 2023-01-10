import { Inject, Injectable, Logger as NestLogger } from '@nestjs/common';
import { Client } from 'node-mailjet';

import { EmailConstructorOptions } from 'src/external-modules/mailjet/mailjet.interface';

@Injectable()
export class MailjetService {
	constructor(@Inject('MAILJET_CLIENT') private mailjet: Client) {}

	async sendUniversalEmail(options: EmailConstructorOptions) {
		try {
			if (options.templateId === undefined) throw new Error('Missing templateId');
			if (options.recipients === undefined) throw new Error('Missing recipients');

			await this.mailjet.post('send', { version: 'v3.1' }).request({
				Messages: [
					{
						To: options.recipients,
						TemplateID: options.templateId,
						Variables: { ...options.args },
						TemplateLanguage: true,
					},
				],
			});
		} catch (error) {
			NestLogger.error(error);
		}
	}
}

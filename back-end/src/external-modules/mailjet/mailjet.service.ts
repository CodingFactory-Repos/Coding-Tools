import { Inject, Injectable, Logger as NestLogger } from '@nestjs/common';
import { Client } from 'node-mailjet';

import { config } from 'src/config/config';

@Injectable()
export class MailjetService {
	constructor(@Inject('MAILJET_CLIENT') private mailjet: Client) {}

	async sendUniversalEmail(templateId: number, context: string, to: string, subject: string, vars: Record<string, any> = {}) {
		try {
			await this.mailjet.post('send', { version: 'v3.1' })
				.request({
					Messages: [
						{
							From: { Email: config.mailjet.noreply, Name: context },
							To: [
								{ Email: to },
							],
							TemplateID: templateId,
							TemplateLanguage: true,
							Subject: subject,
							Variables: {
								to, ...vars,
							}
						},
					],
				})
		} catch(error) {
			NestLogger.error(error);
		}
	}
}

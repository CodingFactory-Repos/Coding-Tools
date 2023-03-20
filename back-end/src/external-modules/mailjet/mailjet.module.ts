import { Module } from '@nestjs/common';

import { MailjetService } from 'src/external-modules/mailjet/mailjet.service';
import { config } from 'src/config/config';
import MJ, { Client } from 'node-mailjet';

@Module({
	providers: [
		{
			provide: 'MAILJET_CLIENT',
			useFactory: async (): Promise<Client> => {
				const mailjet = MJ.apiConnect(config.mailjet.user, config.mailjet.pass);

				return mailjet;
			},
		},
		MailjetService,
	],
	exports: [MailjetService],
})
export class MailjetModule {}

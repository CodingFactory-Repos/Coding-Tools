import { Inject, Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

import { MailjetService } from 'src/external-modules/mailjet/mailjet.service';
import { MailjetEmail, MailjetAskToken } from 'src/auth/events/auth.events.req';
import { Events, MaijetTemplate } from 'src/common/providers/interfaces/events.interface';
import { config } from 'src/config/config';

Injectable();
export class MailjetListeners {
	constructor(
		@Inject(MailjetService)
		private readonly mailjetService: MailjetService,
	) {}

	@OnEvent(Events.alertPedago)
	async handleSingupPo(payload: MailjetEmail) {
		const { email, firstName } = payload;

		//! We will need to retrieve the email and firstname of each pedago
		//! Then pass them as recipients

		this.mailjetService.sendUniversalEmail({
			templateId: MaijetTemplate.alertPedago,
			recipients: [{ Email: 'codingtools.factory@gmail.com', Name: 'Coding Tools' }],
			args: { email: email, firstName: firstName },
		});
	}

	@OnEvent(Events.accountValidated)
	async handleAccountValidated(payload: MailjetEmail) {
		const { email, firstName } = payload;

		this.mailjetService.sendUniversalEmail({
			templateId: MaijetTemplate.accountValidated,
			recipients: [{ Email: email, Name: firstName }],
			args: { firstName: firstName },
		});
	}

	@OnEvent(Events.askActivationToken)
	async handleaskActivationToken(payload: MailjetAskToken) {
		const { email, firstName, token } = payload;
		const url = `${config.app.redirect}/home/activated?token=${token}`;

		this.mailjetService.sendUniversalEmail({
			templateId: MaijetTemplate.activationToken,
			recipients: [{ Email: email, Name: firstName }],
			args: { firstName: firstName, url: url },
		});
	}

	@OnEvent(Events.askResetToken)
	async handleaskResetToken(payload: MailjetAskToken) {
		const { email, firstName, token } = payload;
		const url = `${config.app.redirect}/home/reset?token=${token}`;

		this.mailjetService.sendUniversalEmail({
			templateId: MaijetTemplate.resetToken,
			recipients: [{ Email: email, Name: firstName }],
			args: { firstName: firstName, url: url },
		});
	}
}

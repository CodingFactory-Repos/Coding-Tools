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
		const { email } = payload;

		this.mailjetService.sendUniversalEmail({
			templateId: MaijetTemplate.alertPedago,
			recipients: [{ Email: 'codingtools.factory@gmail.com', Name: 'Coding Tools' }],
			args: { email },
		});
	}

	@OnEvent(Events.accountValidated)
	async handleAccountValidated(payload: MailjetEmail) {
		const { email } = payload;

		this.mailjetService.sendUniversalEmail({
			templateId: MaijetTemplate.accountValidated,
			recipients: [{ Email: email }],
		});
	}

	@OnEvent(Events.askActivationToken)
	async handleaskActivationToken(payload: MailjetAskToken) {
		const { email, token } = payload;

		this.mailjetService.sendUniversalEmail({
			templateId: MaijetTemplate.activationToken,
			recipients: [{ Email: email }],
			args: { code: token },
		});
	}

	@OnEvent(Events.askResetToken)
	async handleaskResetToken(payload: MailjetAskToken) {
		const { email, token } = payload;
		const url = `${config.app.redirect}/forgot-password?token=${token}`;

		this.mailjetService.sendUniversalEmail({
			templateId: MaijetTemplate.resetToken,
			recipients: [{ Email: email }],
			args: { url },
		});
	}
}

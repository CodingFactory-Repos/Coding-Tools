import { MailjetService } from '@/external-modules/mailjet/mailjet.service';
import { Inject, Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

import { MailjetSignupPO, MailjetAccountValidated, MailjetAskResetToken, MailjetAskActivationToken } from 'src/auth/events/auth.events.req';
import { Events, MaijetTemplate } from 'src/common/providers/interfaces/events.interface';
import { config } from 'src/config/config';

Injectable();
export class MailjetListeners {
	constructor(
		@Inject(MailjetService)
		private readonly mailjetService: MailjetService
	) {}

	@OnEvent(Events.poSignup)
	async handleSingupPo(payload: MailjetSignupPO) {
		const { user } = payload;

		// TODO
		// No idea how to handle it yet.
	}

	@OnEvent(Events.accountValidated)
	async handleAccountValidated(payload: MailjetAccountValidated) {
		const { user } = payload;

		// TODO
		// Send a confirmation email + can also send a welcome email but that would require a second event.
	}

	@OnEvent(Events.askActivationToken)
	async handleaskActivationToken(payload: MailjetAskActivationToken) {
		const { email, firstName, token } = payload;
		const url = `${config.app.redirect}/home/activated?token=${token}`;

		this.mailjetService.sendUniversalEmail({
			templateId: MaijetTemplate.activationToken,
			recipients: [{ Email: email, Name: firstName }],
			args: { firstName: firstName, url: url },
		});
	}

	@OnEvent(Events.askResetToken)
	async handleaskResetToken(payload: MailjetAskResetToken) {
		const { email, firstName, token } = payload;
		const url = `${config.app.redirect}/home/reset?token=${token}`;

		this.mailjetService.sendUniversalEmail({
			templateId: MaijetTemplate.resetToken,
			recipients: [{ Email: email, Name: firstName }],
			args: { firstName: firstName, url: url },
		});
	}
}

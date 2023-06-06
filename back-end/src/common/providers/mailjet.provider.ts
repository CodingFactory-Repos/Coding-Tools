import { Inject, Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

import { MailjetService } from 'src/external-modules/mailjet/mailjet.service';
import { MailjetEmail, MailjetAskToken } from 'src/auth/events/auth.events.req';
import { Events, MailjetTemplate } from 'src/common/providers/interfaces/events.interface';
import { config } from 'src/config/config';
import { MailjetCanvasInvitationRequest } from '@/base/canvasRoom/events/canvasRoom.events.req';

Injectable();
export class MailjetListeners {
	constructor(
		@Inject(MailjetService)
		private readonly mailjetService: MailjetService,
	) {}

	@OnEvent(Events.alertPedago)
	async handleSignupPo(payload: MailjetEmail) {
		const { email } = payload;

		this.mailjetService.sendUniversalEmail({
			templateId: MailjetTemplate.alertPedago,
			recipients: [{ Email: 'codingtools.factory@gmail.com', Name: 'Coding Tools' }],
			args: { email },
		});
	}

	@OnEvent(Events.alertUnallowed)
	async handleSignupUnallowed(payload: MailjetEmail) {
		const { email } = payload;

		this.mailjetService.sendUniversalEmail({
			templateId: MailjetTemplate.alertUnallowed,
			recipients: [{ Email: 'codingtools.factory@gmail.com', Name: 'Coding Tools' }],
			args: { email },
		});
	}

	@OnEvent(Events.accountValidated)
	async handleAccountValidated(payload: MailjetEmail) {
		const { email } = payload;

		this.mailjetService.sendUniversalEmail({
			templateId: MailjetTemplate.accountValidated,
			recipients: [{ Email: email }],
		});
	}

	@OnEvent(Events.askActivationToken)
	async handleaskActivationToken(payload: MailjetAskToken) {
		const { email, token } = payload;

		this.mailjetService.sendUniversalEmail({
			templateId: MailjetTemplate.activationToken,
			recipients: [{ Email: email }],
			args: { code: token },
		});
	}

	@OnEvent(Events.askResetToken)
	async handleaskResetToken(payload: MailjetAskToken) {
		const { email, token } = payload;
		const url = `${config.app.redirect}/forgot-password?token=${token}`;

		this.mailjetService.sendUniversalEmail({
			templateId: MailjetTemplate.resetToken,
			recipients: [{ Email: email }],
			args: { url },
		});
	}

	@OnEvent(Events.canvasInvitationRequest)
	async handleCanvasInvitationRequest(payload: MailjetCanvasInvitationRequest) {
		const { email, senderFirstName, senderLastName, projectTitle, token } = payload;
		const url = `${config.app.redirect}/app/agility/accept-invitation?token=${token}`;

		this.mailjetService.sendUniversalEmail({
			templateId: MailjetTemplate.canvasInvitationRequest,
			recipients: [{ Email: email }],
			args: { senderFirstName, senderLastName, projectTitle, url },
		});
	}

	@OnEvent(Events.retroInvitationRequest)
	async handleRetroInvitationRequest(payload: MailjetCanvasInvitationRequest) {
		const { email, senderFirstName, senderLastName, projectTitle, token } = payload;
		const url = `${config.app.redirect}/app/retrospective/accept-invitation?token=${token}`;

		this.mailjetService.sendUniversalEmail({
			templateId: MailjetTemplate.retroInvitationRequest,
			recipients: [{ Email: email }],
			args: { senderFirstName, senderLastName, projectTitle, url },
		});
	}
}

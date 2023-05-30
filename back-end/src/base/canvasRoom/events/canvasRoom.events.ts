import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

import { Events } from '@/common/providers/interfaces/events.interface';
import { MailjetCanvasInvitationRequest } from '@/base/canvasRoom/events/canvasRoom.events.req';

@Injectable()
export class CanvasRoomEventEmitter {
	constructor(private eventEmitter: EventEmitter2) {}

	async invitationRequest(
		email: string,
		senderFirstName: string,
		senderLastName: string,
		projectTitle: string,
		token: string,
	) {
		this.eventEmitter.emit(
			Events.canvasInvitationRequest,
			new MailjetCanvasInvitationRequest(
				email,
				senderFirstName,
				senderLastName,
				projectTitle,
				token,
			),
		);
	}
}

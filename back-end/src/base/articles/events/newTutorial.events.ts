import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

import { Events } from '@/common/providers/interfaces/events.interface';
import { MailjetNewTutorial } from '@/base/articles/events/newTutorial.events.req';

@Injectable()
export class NewTutorialEmitter {
	constructor(private eventEmitter: EventEmitter2) {}

	async newTutorialMail (email: Array<{ Email: string }>) {
		this.eventEmitter.emit( Events.newTutorial, new MailjetNewTutorial(email));
	}
}
import { User } from 'src/base/users/interfaces/users.interface';

export class MailjetSignupPO {
	user: User;

	constructor(user: User) {
		this.user = user;
	}
}

export class MailjetSignupUser {
	user: User;

	constructor(user: User) {
		this.user = user;
	}
}

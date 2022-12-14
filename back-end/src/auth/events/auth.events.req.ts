import { User } from 'src/base/users/interfaces/users.interface';

export class MailjetSignupPO {
	user: User;

	constructor(user: User) {
		this.user = user;
	}
}

export class MailjetAccountValidated {
	user: User;

	constructor(user: User) {
		this.user = user;
	}
}

export class MailjetAskActivationToken {
	email: string;
	firstName: string;
	token: string;

	constructor(email: string, firstName: string, token: string) {
		this.email = email;
		this.firstName = firstName;
		this.token = token;
	}
}

export class MailjetAskResetToken {
	email: string;
	firstName: string;
	token: string;

	constructor(email: string, firstName: string, token: string) {
		this.email = email;
		this.firstName = firstName;
		this.token = token;
	}
}

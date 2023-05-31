export enum Events {
	alertPedago = 'mailjet.signup.po',
	alertUnallowed = 'mailjet.signup.unallowed',
	accountValidated = 'mailjet.account.validated',
	askActivationToken = 'mailjet.token.askActivation',
	askResetToken = 'mailjet.token.askReset',
}

export enum MaijetTemplate {
	alertPedago = 4433143,
	alertUnallowed = 4805537,
	accountValidated = 4433137,
	activationToken = 4422523,
	resetToken = 4433132,
	dailyAbsence = 4842752,
}

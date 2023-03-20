import { IsNotEmpty, IsNumber, IsString, Length, Matches, Max, Min } from 'class-validator';

import { EMAIL_FORMAT, PASSWORD_FORMAT } from 'src/common/constants/global';

export class DTOAuthSignup {
	@IsNotEmpty()
	@IsString()
	@Length(8, 127)
	@Matches(EMAIL_FORMAT, { message: 'Invalid email' })
	public email: string;

	@IsNotEmpty()
	@IsString()
	@Length(8, 40)
	@Matches(PASSWORD_FORMAT, { message: 'Password too weak' })
	public password: string;

	@IsNotEmpty()
	@IsNumber()
	@Min(1)
	@Max(2)
	public role: number;
}

export class DTOAuthSignin {
	@IsNotEmpty()
	@IsString()
	@Length(8, 127)
	@Matches(EMAIL_FORMAT, { message: 'Invalid email' })
	public email: string;

	@IsNotEmpty()
	@IsString()
	@Length(8, 40)
	@Matches(PASSWORD_FORMAT, { message: 'Password too weak' })
	public password: string;
}

export class DTOResetToken {
	@IsNotEmpty()
	@IsString()
	@Length(32, 32)
	public resetToken: string;
}

export class DTOResetPassword {
	@IsNotEmpty()
	@IsString()
	@Length(8, 40)
	@Matches(PASSWORD_FORMAT, { message: 'Password too weak' })
	public password: string;

	@IsNotEmpty()
	@IsString()
	@Length(32, 32)
	public resetToken: string;
}

export class DTOActivationToken {
	@IsNotEmpty()
	@IsString()
	@Length(6, 6)
	public activationToken: string;
}

export class DTOAuthEmail {
	@IsNotEmpty()
	@IsString()
	@Length(8, 127)
	@Matches(EMAIL_FORMAT, { message: 'Invalid email' })
	public email: string;
}

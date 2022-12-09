import { IsNotEmpty, IsNumber, IsString, Length, Matches, Max, Min } from 'class-validator';

import { EMAIL_FORMAT, PASSWORD_FORMAT } from 'src/common/constants/global';

export class DTOAuthSignup {
	@IsNotEmpty()
	@IsString()
	@Length(2, 50)
	public firstName: string;

	@IsNotEmpty()
	@IsString()
	@Length(2, 50)
	public lastName: string;

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
	@Min(0)
	@Max(1)
	public status: number;
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

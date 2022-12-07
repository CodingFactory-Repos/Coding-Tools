import { IsEmail, IsNotEmpty, IsString, Length, Matches } from 'class-validator';

export class LoginDto {
	@IsNotEmpty()
	@IsString()
	@IsEmail()
	@Length(8, 127)
	@Matches(
		/^(?=.{2,42}@)[0-9a-zA-Z]+(?:[\.-][0-9a-z]+)*@((?=.{3,64}$)[a-z0-9]{1,}(?:-{1,3}[a-z]{1,})?(?:\.[a-z]{0})?)+(?:[a-z]{1,}\.[a-z]{2,})$/,
		{ message: 'Invalid email' },
	)
	public email: string;

	@IsNotEmpty()
	@IsString()
	@Length(8, 40)
	@Matches(
		/^(?=.*[A-Za-z])(?=.*\d)(?=.*[!"#$%&'()*+,\-\/:;<=>?@[\\\]^_`{|}~\.])[A-Za-z\d!"#$%&'()*+,\-\/:;<=>?@[\\\]^_`{|}~\.]{8,}$/,
		{ message: 'Password too weak' },
	)
	public password: string;
}

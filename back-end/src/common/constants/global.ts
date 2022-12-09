export const EMAIL_FORMAT =
	/^(?=.{2,42}@)[0-9a-zA-Z]+(?:[\.-][0-9a-z]+)*@((?=.{3,64}$)[a-z0-9]{1,}(?:-{1,3}[a-z]{1,})?(?:\.[a-z]{0})?)+(?:[a-z]{1,}\.[a-z]{2,})$/;
export const PASSWORD_FORMAT =
	/^(?=.*[A-Za-z])(?=.*\d)(?=.*[!"#$%&'()*+,\-\/:;<=>?@[\\\]^_`{|}~\.])[A-Za-z\d!"#$%&'()*+,\-\/:;<=>?@[\\\]^_`{|}~\.]{8,}$/;

import { generateRandomBuffer, hashPassword } from '@/common/helpers/string.helper';

export const credentialsPassword = async (password: string) => {
	const salt = generateRandomBuffer(32);
	return hashPassword(password, salt);
};

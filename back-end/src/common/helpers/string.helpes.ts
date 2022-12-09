import argon2 from 'argon2';
import { v4 as uuidv4 } from 'uuid';
import { randomBytes } from 'crypto';

export const generateRandomBuffer = (size: number) => {
	return randomBytes(size);
};

export const bufferToHex = (buffer: Buffer) => {
	return buffer.toString('hex');
};

export const generateUUID = () => {
	return uuidv4();
};

export const generateRandomToken = () => {
	return bufferToHex(generateRandomBuffer(16));
};

export const hashPassword = async (password: string, salt: Buffer) => {
	return argon2.hash(password, { salt });
};

export const verifyPassword = async (oldPass: string, newPass: string) => {
	if (isEmpty(oldPass) || isEmpty(newPass)) return false;
	return argon2.verify(oldPass, newPass);
};

/**
 * @method isEmpty
 * @param {String | Number | Object} value
 * @returns {Boolean} true & false
 * @description this value is Empty Check
 */
export const isEmpty = (value: string | number | object): boolean => {
	if (value === null) {
		return true;
	} else if (typeof value !== 'number' && value === '') {
		return true;
	} else if (typeof value === 'undefined' || value === undefined) {
		return true;
	} else if (value !== null && typeof value === 'object' && !Object.keys(value).length) {
		return true;
	} else {
		return false;
	}
};

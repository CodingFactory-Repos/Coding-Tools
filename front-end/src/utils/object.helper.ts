/**
	This function takes an object and an array of keys, and returns a new object that contains 
	only the properties from the original object whose keys match the ones in the input array.
*/
export const pick = <T extends object, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> => {
	return keys.reduce((acc, key) => {
		if (key in obj) acc[key] = obj[key];
		return acc;
	}, {} as Pick<T, K>);
};

/**
	This function takes an object and an array of keys, and returns a new object that does not
	contains the properties defined in the array of keys.
*/
export const omit = <T extends object, K extends keyof T>(obj: T, keys: K[]): Omit<T, K> => {
	return Object.keys(obj).reduce((acc, key) => {
		if (keys.indexOf(key as K) === -1) {
			acc[key] = obj[key];
		}
		return acc;
	}, {} as Omit<T, K>);
};

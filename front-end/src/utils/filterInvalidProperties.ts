import { isEmpty } from '@/utils/string.helper';

export const filterInvalidProperties = <T>(obj: T, customStrValidator?: string): T => {
	const filteredObj = {} as T;
	for (const key in obj) {
		const value = obj[key];
		if (value !== undefined && value !== null) {
			if (Array.isArray(value)) {
				const newArray = [] as typeof value;

				for (let i = 0; i < value.length; i++) {
					if (value[i] instanceof Date) {
						newArray.push(value[i].toISOString());
					} else if (typeof value[i] === 'object') {
						const filteredObj = filterInvalidProperties(value[i], customStrValidator);
						if (!isEmpty(filteredObj)) {
							newArray.push(filteredObj);
						}
					} else if (value[i] !== undefined && value[i] !== null && !isEmpty(value[i])) {
						newArray.push(value[i]);
					}
				}

				filteredObj[key] = newArray;
			} else if (value instanceof Date) {
				filteredObj[key] = value.toISOString() as T[Extract<keyof T, string>];
			} else if (typeof value === 'object') {
				const filteredObjValue = filterInvalidProperties(value, customStrValidator);
				if (!isEmpty(filteredObjValue)) {
					filteredObj[key] = filteredObjValue;
				}
			} else if (typeof value === 'string' && !(value as string).includes(customStrValidator)) {
				filteredObj[key] = value;
			} else if (typeof value !== 'string') {
				filteredObj[key] = value;
			}
		}
	}

	return filteredObj;
};

type AnyObject = Record<string, unknown>;
export function mergeObjects<T extends AnyObject>(...objects: T[]): T {
	const result = {} as T;

	for (const object of objects) {
		for (const [key, value] of Object.entries(object)) {
			if (typeof value === 'object' && !Array.isArray(value)) {
				result[key as keyof T] = mergeObjects(result[key as keyof T] || {}, value) as T[keyof T];
			} else {
				result[key as keyof T] = value as T[keyof T];
			}
		}
	}
	return result;
}

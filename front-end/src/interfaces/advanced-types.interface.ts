export type Expand<T> = T extends infer U ? { [K in keyof U]: U[K] } : never;
export type TypesRequired<T extends object> = Exclude<
	{ [K in keyof T]: T extends Record<K, T[K]> ? T[K] : never }[keyof T],
	undefined
>;
export type TypesOptional<T extends object> = Exclude<
	{ [K in keyof T]: T extends Record<K, T[K]> ? never : T[K] }[keyof T],
	undefined
>;
export type KeysRequired<T extends object> = Exclude<
	{ [K in keyof T]: T extends Record<K, T[K]> ? K : never }[keyof T],
	undefined
>;
export type KeysOptional<T extends object> = Exclude<
	{ [K in keyof T]: T extends Record<K, T[K]> ? never : K }[keyof T],
	undefined
>;
export type DeepPartial<T> = {
	[P in keyof T]?: T[P] extends Array<infer U>
		? Array<DeepPartial<U>>
		: T[P] extends object
		? DeepPartial<T[P]>
		: T[P];
};

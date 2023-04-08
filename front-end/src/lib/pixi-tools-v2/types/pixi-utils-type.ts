export type TypesRequired<T extends object> = Exclude<
	{ [K in keyof T]: T extends Record<K, T[K]> ? T[K] : never }[keyof T],
	undefined
>;
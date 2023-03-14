export type Status<I = {}> = I & {
	status: `${STATUS}`;
}

export enum STATUS {
	OK = 'ok',
	ERROR = 'error'
}
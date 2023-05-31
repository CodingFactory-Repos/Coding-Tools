import { ArgumentsHost, Catch, HttpStatus } from '@nestjs/common';
import { BaseWsExceptionFilter, WsException } from '@nestjs/websockets';

const ERRORS = {
	BAD_REQUEST: { status: HttpStatus.BAD_REQUEST, message: 'Bad request' },
	UNAUTHORIZED: { status: HttpStatus.UNAUTHORIZED, message: 'Unauthorized' },
	FORBIDDEN: { status: HttpStatus.FORBIDDEN, message: 'Forbidden' },
};

export class WSServiceError extends WsException {
	constructor(STATUS: keyof typeof ERRORS, error: string) {
		const { status, message } = ERRORS[STATUS];
		super({ message: message, error: error, status });
	}
}

@Catch(WSServiceError)
export class WSServiceErrorCatcher implements BaseWsExceptionFilter {
	//eslint-disable-next-line @typescript-eslint/ban-types
	handleError<TClient extends { emit: Function }>(_: TClient, exception: unknown): void {
		throw exception;
	}

	//eslint-disable-next-line @typescript-eslint/ban-types
	handleUnknownError<TClient extends { emit: Function }>(exception: unknown, _: TClient): void {
		throw exception;
	}
	isExceptionObject(err: unknown): err is Error {
		return err instanceof Error;
	}

	catch(exception: WSServiceError, host: ArgumentsHost) {
		const ctx = host.switchToWs();
		const client = ctx.getClient();
		const response = exception.getError();

		client.emit('exception', response);
	}
}

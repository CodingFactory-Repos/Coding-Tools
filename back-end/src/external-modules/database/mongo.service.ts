import { User } from '@/base/users/interfaces/users.interface';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { Db } from 'mongodb';

//! TODO: I wish i could use it, but mongodb is in a standalone state and not a replica set, so it's not available.

@Injectable()
export class ChangeStreamService implements OnModuleInit {
	constructor(@Inject('DATABASE_CONNECTION') private db: Db) {}

	onModuleInit() {
		const users = this.db.collection<User>('users');
		const userProfileChangeStream = users.watch([
			{ $match: { 'updateDescription.updatedFields.field_name': { $exists: true } } },
			{ $project: { old_value: '$updateDescription.oldValue.field_name' } },
		]);

		userProfileChangeStream.on('change', async (change) => {
			console.log(change);
		});
	}
}

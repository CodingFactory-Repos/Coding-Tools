import { Inject, Injectable } from '@nestjs/common';
import { Filter, UpdateFilter, FindOneAndUpdateOptions, FindOptions, Db } from 'mongodb';
import { User } from './interfaces/users.interface';
@Injectable()
export class UsersRepository {
	constructor(@Inject('DATABASE_CONNECTION') private db: Db) {}

	get users() {
		return this.db.collection<User>('users');
	}

	async createUser(query: User) {
		return this.users.insertOne(query);
	}

	async updateOneUser(query: Filter<User>, update: Partial<User> | UpdateFilter<User>) {
		return this.users.updateOne(query, update);
	}

	async findOneAndUpdateUser(
		query: Filter<User>,
		update: UpdateFilter<User>,
		options: FindOneAndUpdateOptions = undefined,
	) {
		return this.users.findOneAndUpdate(query, update, options);
	}

	async findOne(query: Filter<User>, options: FindOptions<User> = undefined) {
		return this.users.findOne(query, options);
	}

	async userExist(query: Filter<User>) {
		const options = { projection: { _id: 1 } };
		return this.users.findOne(query, options);
	}
	async findMany(query: Filter<User>, options: FindOptions<User> = undefined) {
		return this.users.find(query, options).toArray();
	}
	async getAllUsers() {
		return this.users.find().toArray();
	}
}

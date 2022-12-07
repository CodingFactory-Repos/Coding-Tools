import { mongodb } from '@/config/config';
import { Filter, UpdateFilter, FindOneAndUpdateOptions } from 'mongodb';
import { User } from './interfaces/users.interface';

export class UsersRepository {
	static usersCollection = mongodb.collection<User>('users');

	get users() {
		return UsersRepository.usersCollection;
	}

	async createUser(query: User) {
		return this.users.insertOne(query);
	}

	async updateOneUser(query: Filter<User>, update: Partial<User> | UpdateFilter<User>) {
		return this.users.updateOne(query, update);
	}

	async findOneAndUpdateUser(
		query: Filter<User>,
		update: Partial<User>,
		options: FindOneAndUpdateOptions = undefined,
	) {
		return this.users.findOneAndUpdate(query, update, options);
	}
	async userExist(query: Filter<User>) {
		const options = { projection: { _id: 1 } };
		return this.users.findOne(query, options);
	}
	// Mongo repo for the users collection
}

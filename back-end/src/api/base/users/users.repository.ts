import { mongodb } from '@/config/config';
import { ObjectId, Filter, UpdateFilter, FindOneAndUpdateOptions } from 'mongodb';
import { PedagoProfile, ProductOwnerProfile, Student, User, UserProfile } from './interfaces/users.interface';

export class UsersRepository {
static users = mongodb.collection<User>('users');

	get users() {
		return UsersRepository.users;
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
		return this.users.findOne(query, options)
	}
	// Mongo repo for the users collection
}

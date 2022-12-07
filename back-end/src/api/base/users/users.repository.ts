import { mongodb } from '@/config/config';

export class UsersRepository {
	public users = mongodb.collection('users');

	async userExist() {
		return this.users.find();
	}

	// Mongo repo for the users collection
}

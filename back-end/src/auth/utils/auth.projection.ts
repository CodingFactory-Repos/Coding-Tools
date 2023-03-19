// export const PROJECTION_SIGNIN = {
// 	projection: {
// 		_id: 0,
// 	},
// };


export const PROJECTION_CURRENT_USER = {
	projection: {
		_id: 0,
		profile: 1,
		schoolProfile: 1,
		businessProfile: 1,
		role: 1,
	}
}
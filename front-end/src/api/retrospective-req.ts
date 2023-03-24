import { http } from '@/api/network/axios';
import { Status } from '@/store/interfaces/axios.interface';

export const tryCreateNewRetro = (retro) => {
	return http.post('/retrospectives/newRetro', retro);
};


import axios from 'axios';

import { config } from '@/config/config';

export const http = axios.create({
	baseURL: config.api.base,
	withCredentials: config.api.credentials,
	timeout: 20000,
});

http.defaults.headers.post['Content-Type'] = 'application/json';

import { xior } from 'xior';

import { config } from '@/config';

export const api = xior.create({ baseURL: config.API_URL, credentials: 'include' });

export const fetcher = (url: string) => api.get(url).then(res => res.data);

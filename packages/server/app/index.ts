import cookie from '@fastify/cookie';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import fastify, { FastifyInstance } from 'fastify';

import { config } from '@/config';
import { logger } from '@/lib/logger';
import { errorHandler } from '@/plugins/error-handler';
import { healthCheck } from '@/plugins/health-check';
import { routes } from '@/routes';

class App {
    private app: FastifyInstance;

    constructor() {
        this.app = fastify({ logger });
    }

    private async registerPlugins() {
        await this.app.register(helmet);
        await this.app.register(cookie);
        await this.app.register(cors, {
            origin: config.ORIGIN,
            credentials: true,
        });
        this.app.setErrorHandler(errorHandler);
        await this.app.register(routes, { prefix: '/api' });
        await this.app.register(healthCheck);
    }

    public async listen() {
        await this.registerPlugins();
        await this.app.listen({ port: config.PORT, host: config.HOST });
    }
}

export const app = new App();

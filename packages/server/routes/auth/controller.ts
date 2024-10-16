import { FastifyPluginCallback } from 'fastify';

import { withZod } from '@/lib/zod';
import { authenticate } from '@/plugins/authenticate';

import { authSchema } from './schema';
import { authService } from './service';

export const auth: FastifyPluginCallback = (fastify, options, done) => {
    const api = withZod(fastify);

    api.post(
        '/register',
        {
            schema: authSchema.register,
        },
        async req => {
            await authService.register(req.body);
        },
    );

    api.post(
        '/login',
        {
            schema: authSchema.login,
        },
        async (req, reply) => {
            const sessionId = await authService.login(req.body);
            reply.setCookie('sessionId', sessionId, {
                httpOnly: true,
                secure: true,
                sameSite: 'strict',
                path: '/',
            });
        },
    );

    api.post('/logout', async (req, reply) => {
        const {
            cookies: { sessionId },
        } = req;

        if (sessionId) {
            await authService.deleteSession(sessionId);
            reply.clearCookie('sessionId');
        }
    });

    api.get(
        '/user',
        {
            preHandler: [authenticate],
        },
        req => req.user,
    );

    done();
};

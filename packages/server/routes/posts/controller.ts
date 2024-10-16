import { FastifyPluginCallback } from 'fastify';

import { withZod } from '@/lib/zod';
import { authenticate } from '@/plugins/authenticate';

import { postSchema } from './schema';
import { postService } from './service';

export const posts: FastifyPluginCallback = (fastify, options, done) => {
    const api = withZod(fastify);

    api.post(
        '/',
        {
            preHandler: [authenticate],
            schema: postSchema.create,
        },
        async req => {
            const {
                body,
                user: { id: userId },
            } = req;

            return await postService.create({ ...body, userId });
        },
    );

    api.get(
        '/:postId',
        {
            schema: postSchema.get,
        },
        async req => {
            return await postService.get(req.params.postId);
        },
    );

    api.patch(
        '/:postId',
        {
            preHandler: [authenticate],
            schema: postSchema.update,
        },
        async req => {
            const {
                body: { body },
                params: { postId },
                user: { id: userId },
            } = req;

            return await postService.update({ body, postId, userId });
        },
    );

    api.delete(
        '/:postId',
        {
            preHandler: [authenticate],
            schema: postSchema.delete,
        },
        async req => {
            const {
                params: { postId },
                user: { id: userId },
            } = req;

            await postService.delete({ postId, userId });
        },
    );

    api.get(
        '/users/:userId',
        {
            schema: postSchema.getByUser,
        },
        async req => {
            return await postService.getByUser(req.params.userId);
        },
    );

    done();
};

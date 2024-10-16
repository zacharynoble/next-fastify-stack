import { eq } from 'drizzle-orm';
import { FastifyRequest } from 'fastify';

import { db } from '@/db';
import { UnauthorizedError } from '@/lib/errors';
import { sessions } from '@/models/sessions';
import { users } from '@/models/users';

export const authenticate = async <T extends FastifyRequest>(req: T) => {
    const {
        cookies: { sessionId },
    } = req;

    if (!sessionId) throw new UnauthorizedError('Session ID missing in request');

    const [user] = await db
        .select({ id: users.id, email: users.email, name: users.name })
        .from(sessions)
        .innerJoin(users, eq(sessions.userId, users.id))
        .where(eq(sessions.sessionId, sessionId))
        .limit(1);

    if (!user) throw new UnauthorizedError('Your session is no longer valid, please sign in again');

    req.user = user;
};

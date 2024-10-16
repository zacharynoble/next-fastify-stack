import { eq } from 'drizzle-orm';

import { db } from '@/db';
import { ForbiddenError, NotFoundError } from '@/lib/errors';
import { posts } from '@/models/posts';

class PostService {
    get = async (postId: string) => {
        const [post] = await db.select().from(posts).where(eq(posts.id, postId)).limit(1);
        if (!post) throw new NotFoundError('Post not found');

        return post;
    };

    create = async ({ title, body, userId }: { title: string; body: string; userId: string }) => {
        const [post] = await db.insert(posts).values({ title, body, userId }).returning();

        return post;
    };

    update = async ({ body, postId, userId }: { body: string; postId: string; userId: string }) => {
        const post = await this.get(postId);
        if (post.userId !== userId) throw new ForbiddenError('Post does not belong to user');

        const [updatedPost] = await db.update(posts).set({ body }).where(eq(posts.id, postId)).returning();

        return updatedPost;
    };

    delete = async ({ postId, userId }: { postId: string; userId: string }) => {
        const post = await this.get(postId);
        if (post.userId !== userId) throw new ForbiddenError('Post does not belong to user');

        await db.delete(posts).where(eq(posts.id, postId));
    };

    getByUser = async (userId: string) => {
        return await db.select().from(posts).where(eq(posts.userId, userId));
    };
}

export const postService = new PostService();

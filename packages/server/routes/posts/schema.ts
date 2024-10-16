import { z } from 'zod';

class PostSchema {
    postId = z.string().uuid();
    userId = z.string().uuid();
    title = z.string().min(1, 'Please enter a title');
    body = z.string().min(1, 'Post body cannot be empty');

    create = {
        body: z.object({
            title: this.title,
            body: this.body,
        }),
    };

    update = {
        params: z.object({
            postId: this.postId,
        }),
        body: z.object({
            body: this.body,
        }),
    };

    get = {
        params: z.object({
            postId: this.postId,
        }),
    };

    delete = {
        params: z.object({
            postId: this.postId,
        }),
    };

    getByUser = {
        params: z.object({
            userId: this.userId,
        }),
    };
}

export const postSchema = new PostSchema();

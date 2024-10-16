import { z } from 'zod';

class AuthSchema {
    email = z.string().min(1, 'Please enter your email').email();
    password = z.string().min(8, { message: 'Password must be at least 8 characters' });
    recaptchaToken = z.string().optional();

    login = {
        body: z.object({
            email: this.email,
            password: z.string().min(1, 'Please enter your password'),
            recaptchaToken: this.recaptchaToken,
        }),
    };

    register = {
        body: z.object({
            email: this.email,
            name: z.string().min(1, 'Please enter your name'),
            password: this.password,
            recaptchaToken: this.recaptchaToken,
        }),
    };
}

export const authSchema = new AuthSchema();

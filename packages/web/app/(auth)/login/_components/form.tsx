'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import type { MutableRefObject } from 'react';
import { useRef, useState } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Spinner } from '@/components/spinner';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { config } from '@/config';
import { useAuth } from '@/hooks/use-auth';
import { parseError, setFieldErrors } from '@/lib/errors';

const formSchema = z.object({
    email: z.string().email().min(1, 'Enter your email address'),
    password: z.string().min(1, 'Enter your password'),
});

type FormData = z.infer<typeof formSchema>;

export const LoginForm = () => {
    const form = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    });
    const { login } = useAuth();
    const reRef: MutableRefObject<ReCAPTCHA | null> = useRef(null);
    const [loading, setLoading] = useState(false);

    const onSubmit = async (data: FormData) => {
        try {
            setLoading(true);
            const recaptchaToken = await reRef.current?.executeAsync();
            reRef.current?.reset();
            await login({ ...data, recaptchaToken });
        } catch (error) {
            const { message, fields } = parseError(error);
            if (fields) {
                setFieldErrors(fields, form.setError);
            } else {
                form.setError('password', { message: message || 'Something went wrong signing in' });
            }
            setLoading(false);
        }
    };

    return (
        <Form {...form}>
            <h1 className="mb-6 text-lg font-semibold text-center">Sign in to your account</h1>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <ReCAPTCHA sitekey={config.RECAPTCHA_SITE_KEY} size="invisible" ref={reRef} />
                <div className="space-y-6">
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input placeholder="email@domain.com" autoComplete="current-email" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Enter your password"
                                        type="password"
                                        autoComplete="current-password"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <Button type="submit" className="w-full">
                    {loading ? <Spinner /> : 'Login'}
                </Button>
            </form>
        </Form>
    );
};

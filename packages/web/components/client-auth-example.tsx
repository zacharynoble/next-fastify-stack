'use client';

import Link from 'next/link';

import { useAuth } from '@/hooks/use-auth';

export const ClientAuthExample = () => {
    const { loadingUser, user, logout } = useAuth();

    if (loadingUser) return <div>Loading user...</div>;

    if (user) return <button onClick={logout}>{user.name}, click here to logout.</button>;

    return <Link href="/login">Click here to login</Link>;
};

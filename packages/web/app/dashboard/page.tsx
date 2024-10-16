import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Dashboard',
    description: 'View key insights and trends',
};

export default async function Dashboard() {
    return <p>This route is protected by server side auth via middleware.ts</p>;
}

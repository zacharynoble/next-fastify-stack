import type { ReactNode } from 'react';

import { Card } from '@/components/ui/card';

interface Props {
    children: ReactNode;
}

export default function Layout({ children }: Props) {
    return (
        <div className="flex justify-center mt-20">
            <Card className="p-5 w-[90%] max-w-[400px]">{children}</Card>
        </div>
    );
}

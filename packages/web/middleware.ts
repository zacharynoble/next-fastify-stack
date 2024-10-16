import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { getUser } from '@/lib/dal';

export default async function middleware(request: NextRequest) {
    const user = await getUser();

    if (user) return NextResponse.next();

    return NextResponse.redirect(new URL('/login', request.url));
}

export const config = {
    matcher: ['/dashboard/:path'],
};

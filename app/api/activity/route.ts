import { auth } from '@/auth';
import { sql } from '@/app/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ ok: false });

    const { page } = await req.json();

    await sql`
        INSERT INTO user_activity (user_id, user_name, action, page)
        VALUES (
            ${session.user.id},
            ${session.user.name ?? ''},
            'page_visit',
            ${page}
        )
    `;

    return NextResponse.json({ ok: true });
}
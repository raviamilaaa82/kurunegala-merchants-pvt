import bcrypt from 'bcrypt';

export async function GET() {
    const hash = await bcrypt.hash('abcdefg', 10);
    console.log('new hash:', hash);
    return Response.json({ hash });
}

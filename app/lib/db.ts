import postgres from 'postgres';

if (!process.env.POSTGRES_URL) {
    throw new Error('POSTGRES_URL is not defined in .env.local');
}

// Disable SSL for local development
const sql = postgres(process.env.POSTGRES_URL, { ssl: false });

export default sql;
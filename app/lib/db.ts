
import postgres from "postgres";

declare global {
    var _sql: ReturnType<typeof postgres> | undefined;
}

export const sql =
    global._sql ??
    postgres(process.env.POSTGRES_URL!, {
        ssl: process.env.NODE_ENV === "production" ? "require" : false,
        max: 10,
    });

if (process.env.NODE_ENV === "development") {
    global._sql = sql;
}


// Separate dedicated connection for LISTEN/NOTIFY
// (must NOT be pooled — needs a persistent single connection)
export function createNotificationListener(
    channel: string,
    onNotify: (payload: string) => void,
    onError?: (err: Error) => void
) {
    console.log('NODE_ENV:', process.env.NODE_ENV);
    console.log('Connecting to:', process.env.POSTGRES_URL);
    // const listener = postgres(process.env.POSTGRES_URL!, {
    //     ssl: process.env.NODE_ENV === "production" ? "require" : false,
    //     max: 1,
    //     fetch_types: false,
    // });
    const listener = postgres(process.env.POSTGRES_URL!, {
        ssl: process.env.NODE_ENV === "production"
            ? { rejectUnauthorized: false }  // more permissive for VPS
            : false,
        max: 1,
        fetch_types: false,
    });

    // listener.listen(channel, onNotify).catch((err) => {
    //     onError?.(err);
    // });
    listener.listen(channel, (payload) => {
        console.log(`Notification received on ${channel}:`, payload);
        onNotify(payload);
    }).then(() => {
        console.log(`Listening on channel: ${channel}`);  // confirms connection
    }).catch((err) => {
        console.error(`Listener failed on channel ${channel}:`, err);  // see exact error
        onError?.(err);
    });

    return {
        unlisten: () => listener.end(),
    };
}

// import postgres from 'postgres';

// if (!process.env.POSTGRES_URL) {
//     throw new Error('POSTGRES_URL is not defined in .env.local');
// }

// // Disable SSL for local development
// const sql = postgres(process.env.POSTGRES_URL, { ssl: false });

// export default sql;
// app/api/notifications/route.ts
import { createNotificationListener } from "@/app/lib/db";
export const dynamic = "force-dynamic";
export const runtime = "nodejs";  // must be nodejs, NOT edge

export async function GET(req: Request) {
    console.log("✅ SSE connected");
    const stream = new ReadableStream({
        start(controller) {
            const send = (payload: string) => {
                console.log("📢 Sending to client:", payload);
                controller.enqueue(
                    new TextEncoder().encode(`data: ${payload}\n\n`)
                );
            };

            // const { unlisten } = createNotificationListener(
            //     "new_post",        // channel name — must match your NOTIFY
            //     (payload) => send(payload),
            //     (err) => console.error("Listener error:", err)
            // );

            // ✅ Send a heartbeat every 30s to keep connection alive
            const heartbeat = setInterval(() => {
                try {
                    controller.enqueue(
                        new TextEncoder().encode(`: heartbeat\n\n`)  // SSE comment, client ignores it
                    );
                } catch {
                    clearInterval(heartbeat);
                }
            }, 30000);
            const { unlisten } = createNotificationListener(
                "submission_status",        // channel name — must match your NOTIFY
                (payload) => send(payload),
                (err) => console.error("Listener error:", err)
            );


            // Clean up when user disconnects
            req.signal.addEventListener("abort", () => {
                console.log("🔌 User disconnected");
                clearInterval(heartbeat);
                unlisten();
            });
        },
    });

    return new Response(stream, {
        headers: {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache",
            Connection: "keep-alive",
        },
    });
}
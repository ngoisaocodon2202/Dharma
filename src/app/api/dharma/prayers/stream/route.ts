import { NextRequest } from 'next/server';
import { getDharmaRealtimeEmitter } from '@/lib/db/dharmaPostgresEngine';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const encoder = new TextEncoder();
  const emitter = getDharmaRealtimeEmitter();

  let cleanup = () => {};

  const stream = new ReadableStream({
    start(controller) {
      const sendEvent = (data: unknown) => {
        try {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
        } catch {
          // stream closed
        }
      };

      // Initial connection handshake
      sendEvent({
        type: 'connected',
        engine: 'PostgreSQL 18 Real-Time Stream',
        timestamp: new Date().toISOString(),
      });

      const onDharmaEvent = (evt: unknown) => {
        sendEvent(evt);
      };

      emitter.on('dharma_event', onDharmaEvent);

      // Keepalive heartbeat every 20s
      const heartbeat = setInterval(() => {
        try {
          controller.enqueue(encoder.encode(`: keepalive ${Date.now()}\n\n`));
        } catch {
          clearInterval(heartbeat);
        }
      }, 20000);

      cleanup = () => {
        clearInterval(heartbeat);
        emitter.off('dharma_event', onDharmaEvent);
      };

      req.signal.addEventListener('abort', cleanup);
    },
    cancel() {
      cleanup();
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream; charset=utf-8',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
    },
  });
}


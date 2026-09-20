"use client";

import { useEffect, useRef, useCallback } from "react";

type WsMessage = {
  type: string;
  payload: unknown;
};

interface UseWebSocketOptions {
  url: string;
  onMessage: (msg: WsMessage) => void;
  enabled?: boolean;
}

/**
 * Lightweight WebSocket hook for real-time approval queue updates.
 * Falls back to silent no-op when `enabled` is false (e.g. no auth yet).
 */
export function useWebSocket({ url, onMessage, enabled = true }: UseWebSocketOptions) {
  const wsRef = useRef<WebSocket | null>(null);
  const onMessageRef = useRef(onMessage);
  onMessageRef.current = onMessage;

  const connect = useCallback(() => {
    if (!enabled || wsRef.current) return;
    const ws = new WebSocket(url);
    wsRef.current = ws;

    ws.onmessage = (ev) => {
      try {
        const msg = JSON.parse(ev.data) as WsMessage;
        onMessageRef.current(msg);
      } catch {
        // ignore malformed frames
      }
    };

    ws.onclose = () => {
      wsRef.current = null;
      // Reconnect after 3 s
      setTimeout(connect, 3_000);
    };

    ws.onerror = () => ws.close();
  }, [url, enabled]);

  useEffect(() => {
    connect();
    return () => {
      wsRef.current?.close();
      wsRef.current = null;
    };
  }, [connect]);
}

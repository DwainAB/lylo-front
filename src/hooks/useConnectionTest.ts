"use client";

import { useState, useCallback, useRef } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

// Phase 1 — latency: 8 pings over 4s
const N_PINGS = 8;
const PING_INTERVAL_MS = 500;
const PING_TIMEOUT_MS = 3000;

// Phase 2 — download speed: fetch ~500KB payload
const SPEEDTEST_TIMEOUT_MS = 10000;
const SPEEDTEST_SIZE_BYTES = 512 * 1024; // expected payload from /api/speedtest

export type ConnectionVerdict = "good" | "degraded" | "poor";

export interface ConnectionTestResult {
  downloadMbps: number;
  avgLatency: number;
  packetLoss: number;
  verdict: ConnectionVerdict;
}

export type ConnectionTestStatus = "idle" | "pinging" | "downloading" | "done" | "error";

function computeVerdict(download: number, latency: number, loss: number): ConnectionVerdict {
  if (download < 1.5 || latency > 300 || loss > 3) return "poor";
  if (download < 3 || latency > 150 || loss >= 1) return "degraded";
  return "good";
}

export function useConnectionTest() {
  const [status, setStatus] = useState<ConnectionTestStatus>("idle");
  const [pingProgress, setPingProgress] = useState(0); // 0–100 during pinging phase
  const [result, setResult] = useState<ConnectionTestResult | null>(null);
  const abortRef = useRef(false);

  const run = useCallback(async () => {
    abortRef.current = false;
    setStatus("pinging");
    setPingProgress(0);
    setResult(null);

    // ── Phase 1: latency + packet loss ──────────────────────────────────────
    const latencies: number[] = [];
    let failed = 0;

    for (let i = 0; i < N_PINGS; i++) {
      if (abortRef.current) { setStatus("idle"); return; }

      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), PING_TIMEOUT_MS);
      const t0 = performance.now();

      try {
        await fetch(`${API_BASE}/api/ping`, { signal: controller.signal });
        latencies.push(Math.round(performance.now() - t0));
      } catch {
        failed++;
      } finally {
        clearTimeout(timeout);
      }

      setPingProgress(Math.round(((i + 1) / N_PINGS) * 100));

      if (i < N_PINGS - 1) {
        await new Promise((r) => setTimeout(r, PING_INTERVAL_MS));
      }
    }

    if (latencies.length === 0) { setStatus("error"); return; }

    const avgLatency = Math.round(latencies.reduce((a, b) => a + b, 0) / latencies.length);
    const packetLoss = Math.round((failed / N_PINGS) * 100);

    // ── Phase 2: download speed ──────────────────────────────────────────────
    if (abortRef.current) { setStatus("idle"); return; }
    setStatus("downloading");

    let downloadMbps = 0;

    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), SPEEDTEST_TIMEOUT_MS);
      const t0 = performance.now();

      const res = await fetch(`${API_BASE}/api/speedtest`, { signal: controller.signal });
      const blob = await res.blob();
      clearTimeout(timeout);

      const durationSec = (performance.now() - t0) / 1000;
      const bytes = blob.size || SPEEDTEST_SIZE_BYTES;
      downloadMbps = parseFloat(((bytes * 8) / durationSec / 1_000_000).toFixed(2));
    } catch {
      // If speedtest endpoint unavailable, fall back to latency-only verdict
      downloadMbps = avgLatency < 150 ? 4 : avgLatency < 300 ? 2 : 1;
    }

    const verdict = computeVerdict(downloadMbps, avgLatency, packetLoss);
    setResult({ downloadMbps, avgLatency, packetLoss, verdict });
    setStatus("done");
  }, []);

  const reset = useCallback(() => {
    abortRef.current = true;
    setStatus("idle");
    setPingProgress(0);
    setResult(null);
  }, []);

  return { status, pingProgress, result, run, reset };
}

"use client";
import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("KICKFORGE error boundary:", error);
  }, [error]);

  return (
    <div style={{ padding: 40, color: "#fff", background: "#0A0A0F", minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: "system-ui, sans-serif" }}>
      <h1 style={{ fontSize: "3rem", fontWeight: 700, letterSpacing: "0.04em", margin: 0 }}>SOMETHING BROKE</h1>
      <p style={{ color: "#8B5CF6", fontFamily: "monospace", marginTop: 12, fontSize: "0.85rem" }}>
        {error.message || "An unexpected error occurred"}
      </p>
      {error.digest && (
        <p style={{ color: "#6B7280", fontFamily: "monospace", marginTop: 8, fontSize: "0.7rem" }}>
          Digest: {error.digest}
        </p>
      )}
      <button
        onClick={reset}
        style={{ marginTop: 24, padding: "12px 24px", background: "#8B5CF6", color: "#000", border: 0, borderRadius: 8, cursor: "pointer", fontFamily: "monospace", fontSize: "0.75rem", letterSpacing: "0.2em", fontWeight: 700 }}
      >
        RETRY
      </button>
    </div>
  );
}

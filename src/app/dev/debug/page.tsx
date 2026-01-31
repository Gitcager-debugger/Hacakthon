"use client";

import { useState } from 'react';

export default function DebugPage() {
  const [lastResult, setLastResult] = useState<string | null>(null);

  const triggerClientError = () => {
    // This will be caught by DevErrorBoundary and reported
    throw new Error('Synthetic client error triggered from /dev/debug');
  };

  const simulateBadSubmit = async () => {
    try {
      // Intentionally send malformed payload (missing required fields)
      const res = await fetch('/api/checkins', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ foo: 'bar' }),
      });
      const text = await res.text();
      setLastResult(`Status: ${res.status} Body: ${text}`);
    } catch (err) {
      setLastResult(`Fetch failed: ${(err as Error).message}`);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Dev debug tools</h1>
      <div className="space-y-3">
        <button
          className="px-4 py-2 bg-red-500 text-white rounded"
          onClick={triggerClientError}
        >
          Trigger Synthetic Client Error
        </button>

        <button
          className="px-4 py-2 bg-yellow-500 text-white rounded"
          onClick={simulateBadSubmit}
        >
          Simulate Bad /api/checkins Submit
        </button>

        {lastResult && (
          <pre className="mt-4 p-3 bg-slate-50 border rounded">{lastResult}</pre>
        )}
      </div>
    </div>
  );
}

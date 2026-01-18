"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

/**
 * Simple test component for Figma integration
 * Use this for debugging or as a reference
 */
export function FigmaTestPanel() {
  const [status, setStatus] = useState<string>("Not checked");
  const [fileUrl, setFileUrl] = useState("");
  const [result, setResult] = useState<any>(null);

  const checkStatus = async () => {
    const res = await fetch("/api/figma/status");
    const data = await res.json();
    setStatus(data.isConnected ? "Connected ✓" : "Not connected ✗");
  };

  const startAuth = async () => {
    const res = await fetch("/api/figma/auth-url");
    const { url } = await res.json();
    window.location.href = url;
  };

  const importFile = async () => {
    const res = await fetch("/api/figma/files", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fileUrl }),
    });
    const data = await res.json();
    setResult(data);
  };

  return (
    <Card className="max-w-2xl">
      <CardHeader>
        <CardTitle>Figma Integration Test Panel</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Button onClick={checkStatus}>Check Status</Button>
          <span className="flex items-center">{status}</span>
        </div>

        <div className="flex gap-2">
          <Button onClick={startAuth}>Start OAuth Flow</Button>
        </div>

        <div className="space-y-2">
          <Input
            placeholder="Figma file URL"
            value={fileUrl}
            onChange={(e) => setFileUrl(e.target.value)}
          />
          <Button onClick={importFile}>Import File</Button>
        </div>

        {result && (
          <div className="bg-muted p-4 rounded">
            <pre className="text-xs overflow-auto max-h-96">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

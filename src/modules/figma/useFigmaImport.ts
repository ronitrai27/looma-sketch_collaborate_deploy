"use client";

import { useState } from "react";
import { toast } from "sonner";

export interface FigmaImportResult {
  success: boolean;
  file?: any;
  images?: Record<string, string>;
  error?: string;
}

export function useFigmaImport() {
  const [isConnected, setIsConnected] = useState(false);
  const [isImporting, setIsImporting] = useState(false);

  const checkConnection = async () => {
    try {
      const res = await fetch("/api/figma/status");
      const data = await res.json();
      setIsConnected(data.isConnected);
      return data.isConnected;
    } catch (error) {
      console.error("Failed to check Figma status:", error);
      return false;
    }
  };

  const connect = async () => {
    try {
      const res = await fetch("/api/figma/auth-url");
      const { url } = await res.json();
      window.location.href = url;
    } catch (error) {
      toast.error("Failed to start Figma authentication");
      throw error;
    }
  };

  const importFile = async (fileUrl: string): Promise<FigmaImportResult> => {
    if (!fileUrl) {
      toast.error("Please enter a Figma file URL");
      return { success: false, error: "No file URL provided" };
    }

    setIsImporting(true);
    try {
      const res = await fetch("/api/figma/files", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileUrl }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to import");
      }

      toast.success("Figma design imported successfully!");
      return { success: true, file: data.file, images: data.images };
    } catch (error: any) {
      toast.error(error.message);
      return { success: false, error: error.message };
    } finally {
      setIsImporting(false);
    }
  };

  return {
    isConnected,
    isImporting,
    checkConnection,
    connect,
    importFile,
  };
}

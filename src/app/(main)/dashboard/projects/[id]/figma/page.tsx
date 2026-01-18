"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../../../../convex/_generated/api";
import { Id } from "../../../../../../../convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";
import {
  ArrowLeft,
  FileImage,
  Download,
  Palette,
  Layers,
  ExternalLink,
  Calendar,
  History,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { FigmaProcessor } from "@/modules/figma/processor";
import { FigmaToTldrawConverter } from "@/modules/figma/figmaToTldraw";

export default function FigmaPage() {
  const params = useParams<{ id: Id<"projects"> }>();
  const router = useRouter();
  const saveFigmaImport = useMutation(api.figma.saveFigmaImport);
  const savedImports = useQuery(api.figma.getFigmaImports, {
    projectId: params.id,
  });

  const [figmaUrl, setFigmaUrl] = useState("");
  const [isImporting, setIsImporting] = useState(false);
  const [fileData, setFileData] = useState<any>(null);
  const [images, setImages] = useState<Record<string, string>>({});

  const handleImport = async () => {
    if (!figmaUrl) {
      toast.error("Please enter a Figma file URL");
      return;
    }

    setIsImporting(true);
    try {
      const res = await fetch("/api/figma/files", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileUrl: figmaUrl }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to import");
      }

      setFileData(data.file);
      setImages(data.images || {});
      toast.success("Figma design imported successfully!");

      // Extract file key from URL
      const fileKeyMatch = figmaUrl.match(/\/(file|design)\/([a-zA-Z0-9]+)/);
      const fileKey = fileKeyMatch ? fileKeyMatch[2] : ""; // Note: index 2 now!

      // Save to database
      if (fileKey) {
        await saveFigmaImport({
          projectId: params.id,
          figmaData: {
            fileKey,
            fileName: data.file.name,
            fileUrl: figmaUrl,
            lastModified: data.file.lastModified,
            thumbnailUrl: data.file.thumbnailUrl || "",
            importedAt: Date.now(),
          },
        });
        toast.success("Saved to database!");
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsImporting(false);
    }
  };

  const handleImportToCanvas = () => {
    // TO:DO - NEED ANOTHER SIMPLE CANVAS TO SHOW FIGMA DESIGN.
  };

  const handleReImport = async (url: string) => {
    setFigmaUrl(url);
    toast.info("Loading this design...");
    // We'll call the handleImport logic but we need to pass the URL
    setIsImporting(true);
    try {
      const res = await fetch("/api/figma/files", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileUrl: url }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to import");

      setFileData(data.file);
      setImages(data.images || {});
      toast.success("Design loaded successfully!");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsImporting(false);
    }
  };

  const processedData = fileData
    ? FigmaProcessor.processFileData(fileData)
    : null;
  const frames = fileData ? FigmaProcessor.extractFrames(fileData) : [];

  return (
    <div className="w-full h-full p-6 space-y-6">
      {/* Header */}
      <Link href={`/dashboard/projects/${params.id}`} className="">
        <Button variant="ghost" size="sm">
          <ArrowLeft className="w-5 h-5" /> Back to Project
        </Button>
      </Link>
      <div className="flex items-center justify-between mt-5">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-3xl font-semibold">Figma Designs</h1>
            <p className="text-muted-foreground text-base">
              Import and manage your Figma designs
            </p>
          </div>
          <Image src="/figma.png" alt="Figma" width={40} height={40} />
        </div>
      </div>

      {/* Import Section */}
      <div>
        <h3 className="text-xl font-semibold">Import Figma File</h3>
        <p className="text-muted-foreground text-sm">
          Paste the URL of your Figma file to import it into your project
        </p>

        <div className="relative mt-5 flex items-center w-full gap-4 px-12">
          <Input
            id="figma-url"
            placeholder="https://www.figma.com/file/..."
            value={figmaUrl}
            onChange={(e) => setFigmaUrl(e.target.value)}
            className="bg-muted"
          />
          <Button
            onClick={handleImport}
            disabled={isImporting}
            variant="outline"
            size="sm"
          >
            {isImporting ? (
              <>
                <Spinner className="mr-2 h-4 w-4" /> Importing...
              </>
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" /> Import Design
              </>
            )}
          </Button>
        </div>
      </div>

      {/* File Data Display */}
      {fileData && processedData && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* File Info */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileImage className="w-5 h-5" />
                File Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">File Name</p>
                <p className="font-medium">{processedData.name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Version</p>
                <p className="font-medium">{processedData.version}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Last Modified</p>
                <p className="font-medium">
                  {new Date(processedData.lastModified).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pages</p>
                <p className="font-medium">{processedData.pages.length}</p>
              </div>
              {processedData.thumbnailUrl && (
                <div>
                  <p className="text-sm text-muted-foreground mb-2">
                    Thumbnail
                  </p>
                  <img
                    src={processedData.thumbnailUrl}
                    alt="Thumbnail"
                    className="w-full rounded border"
                  />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Pages & Frames */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Layers className="w-5 h-5" />
                Pages & Frames ({frames.length} frames)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {processedData.pages.map((page: any) => (
                  <div key={page.id} className="border rounded p-4">
                    <h3 className="font-medium mb-2">{page.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      Type: {page.type}
                    </p>
                  </div>
                ))}
              </div>

              {frames.length > 0 && (
                <div className="mt-6">
                  <h4 className="font-medium mb-3">Frames</h4>
                  <div className="grid grid-cols-2 gap-3">
                    {frames.slice(0, 6).map((frame: any) => (
                      <div
                        key={frame.id}
                        className="border rounded p-3 hover:bg-muted/50 transition"
                      >
                        <p className="font-medium text-sm truncate">
                          {frame.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {frame.type}
                        </p>
                        {frame.bounds && (
                          <p className="text-xs text-muted-foreground">
                            {Math.round(frame.bounds.width)} ×{" "}
                            {Math.round(frame.bounds.height)}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                  {frames.length > 6 && (
                    <p className="text-sm text-muted-foreground mt-3">
                      +{frames.length - 6} more frames
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Actions */}
      {fileData && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="w-5 h-5" />
              Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="flex gap-3">
            <Button onClick={handleImportToCanvas}>Import to Canvas</Button>
            <Button
              variant="outline"
              onClick={() => console.log(processedData)}
            >
              View Raw Data
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                const json = JSON.stringify(processedData, null, 2);
                const blob = new Blob([json], { type: "application/json" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `${processedData?.name || "figma-export"}.json`;
                a.click();
                toast.success("Downloaded JSON file!");
              }}
            >
              Download JSON
            </Button>
          </CardContent>
        </Card>
      )}

      {/*--------------- Saved Imports Section ---------------*/}
      <div className="mt-20">
        <div className="flex items-center gap-2">
          <History className="w-5 h-5 text-muted-foreground" />
          <h2 className="text-xl font-semibold">Saved Imports</h2>
        </div>
        <p className="text-sm text-muted-foreground">
          Manage your saved imports here
        </p>

        <div className="mt-4">
          {savedImports === undefined ? (
            <div className="flex items-center justify-center p-12 bg-muted/20 rounded-lg border border-dashed">
              <Spinner className="h-6 w-6" />
            </div>
          ) : savedImports.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-12 bg-muted/20 rounded-lg border border-dashed text-center">
              <Layers className="h-10 w-10 text-muted-foreground/30 mb-3" />
              <h3 className="font-medium text-muted-foreground">
                No saved designs yet
              </h3>
              <p className="text-sm text-muted-foreground max-w-xs">
                Import your first Figma design above to see it listed here.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {savedImports.map((imp) => (
                <Card
                  key={imp._id}
                  className="overflow-hidden hover:shadow-md transition-shadow group"
                >
                  <div className="aspect-video w-full bg-muted relative overflow-hidden flex items-center justify-center">
                    {imp.thumbnailUrl ? (
                      <img
                        src={imp.thumbnailUrl}
                        alt={imp.fileName}
                        className="w-full h-full object-cover transition-transform group-hover:scale-105"
                      />
                    ) : (
                      <FileImage className="w-12 h-12 text-muted-foreground/30" />
                    )}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-4">
                      <Button
                        size="sm"
                        className="w-full bg-blue-600 hover:bg-blue-700"
                        onClick={() => handleReImport(imp.fileUrl)}
                        disabled={isImporting}
                      >
                        {isImporting && figmaUrl === imp.fileUrl ? (
                          <Spinner className="h-3 w-3 mr-2" />
                        ) : (
                          <Download className="h-3 w-3 mr-2" />
                        )}
                        Load Design
                      </Button>
                      <div className="flex gap-2 w-full">
                        <Link
                          href={imp.fileUrl}
                          target="_blank"
                          className="flex-1"
                        >
                          <Button
                            size="sm"
                            variant="secondary"
                            className="w-full"
                          >
                            <ExternalLink className="h-3 w-3 mr-2" />
                            Link
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                  <CardHeader className="p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-base truncate max-w-[200px]">
                          {imp.fileName}
                        </CardTitle>
                        <CardDescription className="flex items-center gap-1 text-xs mt-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(imp.importedAt).toLocaleDateString()}
                        </CardDescription>
                      </div>
                      <div className="text-xs bg-muted px-2 py-0.5 rounded text-muted-foreground">
                        v{imp.fileKey.substring(0, 4)}
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

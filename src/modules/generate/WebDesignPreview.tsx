"use client";
import { Button } from "@/components/ui/button";
import {
  LucideCode2,
  LucideDownload,
  LucideExternalLink,
  LucideEye,
  LucideMonitor,
  LucidePaintBucket,
  LucidePaintbrush,
  LucidePhone,
  LucideTablet,
  LucideTabletSmartphone,
  ToolCase,
} from "lucide-react";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

interface WebDesignPreviewProps {
  onToggleTools: () => void;
  showTools: boolean;
  designCode: string;
}

const WebDesignPreview = ({
  onToggleTools,
  showTools,
  designCode,
}: WebDesignPreviewProps) => {
  const [displayCode, setDisplayCode] = useState("");
  const [selectedScreen, setSelectedScreen] = useState<
    "web" | "mobile" | "tablet"
  >("web");
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState<"preview" | "design">("preview");
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const [selectedElement, setSelectedElement] = useState<HTMLElement | null>(
    null,
  );

  // RENDERING CODE ON IFRAME WITH DEBOUNCE-----------------------
  useEffect(() => {
    if (designCode) {
      setIsLoading(true);
      const timeout = setTimeout(() => {
        setDisplayCode(designCode);
        setIsLoading(false);
      }, 300);
      return () => clearTimeout(timeout);
    }
  }, [designCode]);

  const fullHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/flowbite/2.3.0/flowbite.min.css" rel="stylesheet">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/flowbite/2.3.0/flowbite.min.js"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css" />
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swiper@10/swiper-bundle.min.css" />
    <script src="https://cdn.jsdelivr.net/npm/swiper@10/swiper-bundle.min.js"></script>
    <style>
      body { margin: 0; padding: 0; min-height: 100vh; }
      .hover-outline { outline: 2px dotted #3b82f6 !important; outline-offset: -2px !important; }
      .selected-outline { outline: 2px solid #ef4444 !important; outline-offset: -2px !important; }
    </style>
</head>
<body class="bg-gray-50">
${displayCode}
</body>
</html>
`;

  // ONLY WHEN ITS IN DESIGN MODE SELECTED (NOT PREVIEW)
  // SELECTABLE DOM ELEMENT-------------------------------
  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe || !displayCode) return;

    const doc = iframe.contentDocument;
    if (!doc) return;

    // Helper to cleanup selections
    const cleanupSelections = (d: Document) => {
      const selected = d.querySelector(".selected-outline");
      if (selected) {
        selected.classList.remove("selected-outline");
        selected.removeAttribute("contenteditable");
      }
      const hovered = d.querySelector(".hover-outline");
      if (hovered) {
        hovered.classList.remove("hover-outline");
      }
    };

    let hoverEl: HTMLElement | null = null;
    let selectedEl: HTMLElement | null = null;

    const handleMouseOver = (e: MouseEvent) => {
      if (selectedEl) return;
      const target = e.target as HTMLElement;
      if (target === doc.body || target === doc.documentElement) return;
      if (hoverEl && hoverEl !== target) hoverEl.classList.remove("hover-outline");
      hoverEl = target;
      hoverEl.classList.add("hover-outline");
    };

    const handleMouseOut = () => {
      if (selectedEl) return;
      if (hoverEl) {
        hoverEl.classList.remove("hover-outline");
        hoverEl = null;
      }
    };

    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target === doc.body || target === doc.documentElement) return;
      e.preventDefault();
      e.stopPropagation();
      if (selectedEl && selectedEl !== target) {
        selectedEl.classList.remove("selected-outline");
        selectedEl.removeAttribute("contenteditable");
      }
      selectedEl = target;
      selectedEl.classList.add("selected-outline");
      selectedEl.setAttribute("contenteditable", "true");
      selectedEl.focus();
      setSelectedElement(selectedEl);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && selectedEl) {
        selectedEl.classList.remove("selected-outline");
        selectedEl.removeAttribute("contenteditable");
        selectedEl = null;
        setSelectedElement(null);
      }
    };

    const applyLayer = () => {
      if (!doc || !doc.body) return;
      if (mode === "design") {
        doc.body.addEventListener("mouseover", handleMouseOver);
        doc.body.addEventListener("mouseout", handleMouseOut);
        doc.body.addEventListener("click", handleClick);
        doc.addEventListener("keydown", handleKeyDown);
      } else {
        cleanupSelections(doc);
        setSelectedElement(null);
      }
    };

    // Apply logic based on current mode
    applyLayer();

    // If iframe reloads, we need to re-apply
    const onIframeLoad = () => {
      // Small delay to ensure doc is ready
      setTimeout(applyLayer, 100);
    };
    iframe.addEventListener("load", onIframeLoad);

    return () => {
      if (doc && doc.body) {
        doc.body.removeEventListener("mouseover", handleMouseOver);
        doc.body.removeEventListener("mouseout", handleMouseOut);
        doc.body.removeEventListener("click", handleClick);
      }
      if (doc) {
        doc.removeEventListener("keydown", handleKeyDown);
        cleanupSelections(doc);
      }
      if (iframe) {
        iframe.removeEventListener("load", onIframeLoad);
      }
      setSelectedElement(null);
    };
  }, [displayCode, mode]);

  return (
    <div className="flex flex-col h-full w-full">
      {/* header */}
      <div className="h-12 border-b border-border bg-muted p-3 w-full flex items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <Button
            variant={mode === "preview" ? "default" : "outline"}
            size="sm"
            className="text-xs cursor-pointer"
            onClick={() => setMode("preview")}
          >
            Preview <LucideEye />
          </Button>
          <Button
            variant={mode === "design" ? "default" : "outline"}
            size="sm"
            className="text-xs cursor-pointer"
            onClick={() => setMode("design")}
          >
            Design <LucidePaintbrush />
          </Button>
          <Button variant={"outline"} size="sm" className="text-xs cursor-pointer">
            Style Guide <LucidePaintBucket />
          </Button>
        </div>
        <div className="flex items-center gap-4">
          <Button className="cursor-pointer text-xs" size="sm">
            Save <LucideCode2 />
          </Button>
          <Button
            className={`cursor-pointer text-xs transition-all duration-300 ${
              showTools ? "bg-primary text-primary-foreground" : ""
            }`}
            size="sm"
            variant={showTools ? "default" : "outline"}
            onClick={onToggleTools}
          >
            {showTools ? "Hide Tools" : "View Tools"} <ToolCase />
          </Button>
        </div>
      </div>
      {/* design preview */}
      <div className={`w-full h-full p-2 flex-1 bg-primary-foreground`}>
        {displayCode.length === 0 && !isLoading && (
          <div className="w-full h-full flex items-center justify-center">
            <p>No design yet</p>
          </div>
        )}
        {/* Loading */}
        {/* {isLoading && <div className="">loading....</div>} */}

        {/* Iframe preview */}
        {displayCode.length > 0 && (
          <motion.div
            className={`h-full transition-all duration-500 ease-linear
              ${
                selectedScreen === "web"
                  ? "w-full rounded-none ring-0 mx-auto"
                  : selectedScreen === "tablet"
                    ? "w-[768px] rounded-xl ring-4 ring-accent mx-auto"
                    : "w-[375px] rounded-2xl ring-6 ring-accent mx-auto"
              }`}
          >
            <iframe
              ref={iframeRef}
              className="w-full h-full border-none"
              srcDoc={fullHtml}
              sandbox="allow-scripts allow-same-origin allow-forms allow-modals"
              title="Website Preview"
            ></iframe>
          </motion.div>
        )}
      </div>

      {/* Tools */}
      <div className="border-y p-3 h-14  mt-auto flex justify-between px-6 bg-muted">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon-sm"
            className={
              selectedScreen === "web"
                ? "bg-blue-600 text-white border-blue-600 hover:border-none cursor-pointer duration-300 transition-colors"
                : ""
            }
            onClick={() => setSelectedScreen("web")}
            title="Web View"
          >
            <LucideMonitor />
          </Button>
          <Button
            variant="outline"
            size="icon-sm"
            className={
              selectedScreen === "tablet"
                ? "bg-blue-600 text-white border-blue-600 hover:border-none cursor-pointer duration-300 transition-colors"
                : ""
            }
            onClick={() => setSelectedScreen("tablet")}
            title="Tablet View"
          >
            <LucideTabletSmartphone />
          </Button>
          <Button
            variant="outline"
            size="icon-sm"
            className={
              selectedScreen === "mobile"
                ? "bg-blue-600 text-white border-blue-600 hover:border-none cursor-pointer duration-300 transition-colors"
                : ""
            }
            onClick={() => setSelectedScreen("mobile")}
            title="Mobile View"
          >
            <LucideTablet />
          </Button>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="default" size="sm" className="cursor-pointer">
            View <LucideExternalLink />
          </Button>
          <Button variant="default" size="sm" className="cursor-pointer px-6!">
            Download in React{" "}
            <Image src="/atom.png" alt="react" width={20} height={20} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WebDesignPreview;

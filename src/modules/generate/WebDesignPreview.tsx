import { Button } from "@/components/ui/button";
import {
  LucideCode2,
  LucideDownload,
  LucideExternalLink,
  LucideMonitor,
  LucidePhone,
  LucideTablet,
  LucideTabletSmartphone,
  ToolCase,
} from "lucide-react";
import Image from "next/image";
import React from "react";

interface WebDesignPreviewProps {
  onToggleTools: () => void;
  showTools: boolean;
}

const WebDesignPreview = ({ onToggleTools, showTools }: WebDesignPreviewProps) => {
  return (
    <div className="flex flex-col h-full w-full">
      {/* header */}
      <div className="h-12 border-b border-border bg-sidebar p-3 w-full flex items-center justify-end gap-6">
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
      {/* design preview */}
      <div className="border-y p-3 h-14  mt-auto flex justify-between px-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon-sm" className="cursor-pointer">
            <LucideMonitor />
          </Button>
          <Button variant="outline" size="icon-sm" className="cursor-pointer">
            <LucideTabletSmartphone />
          </Button>
          <Button variant="outline" size="icon-sm" className="cursor-pointer">
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
      {/* Tools */}
    </div>
  );
};

export default WebDesignPreview;

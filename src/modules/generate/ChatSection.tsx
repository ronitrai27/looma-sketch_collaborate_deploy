import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { LucideBot, LucideBrain } from "lucide-react";
import React from "react";

const ChatSection = () => {
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="h-12 border-b border-border bg-sidebar p-3">
        <h3 className="font-semibold text-xl text-primary">
          <LucideBot className="mr-2 inline -mt-1" /> Looma AI
        </h3>
      </div>
      {/* AI MESSAGE AREA */}
      {/* INPUT AREA */}
      <div className="relative mt-auto border-t border-border px-3 py-4">
        <Textarea
          className="resize-none h-24 p-1 bg-sidebar focus:outline-none focus:ring-0 shadow-sm"
          placeholder="Create  saas landing page..."
        />
        <Button
          className="cursor-pointer text-xs absolute bottom-6 right-5"
          size="icon-sm"
          variant="default"
        >
          <LucideBrain />
        </Button>
      </div>
    </div>
  );
};

export default ChatSection;

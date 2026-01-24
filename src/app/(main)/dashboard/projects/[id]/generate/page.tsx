"use client";
import React, { useState } from "react";
import { Allotment } from "allotment";
import "allotment/dist/style.css";
import ChatSection from "@/modules/generate/ChatSection";
import WebDesignPreview from "@/modules/generate/WebDesignPreview";

const MIN_AI_WIDTH = 200;
const MAX_AI_WIDTH = 400;
const DEFAULT_MAIN_SIZE = 1000;
const DEFAULT_DESIGN_PREVIEW_WIDTH = 400;
const MIN_DESIGN_PREVIEW_WIDTH = 200;
const MAX_DESIGN_PREVIEW_WIDTH = 400;

const GeneratePage = () => {
  const [showTools, setShowTools] = useState(false);

  return (
    <div className="h-[calc(100vh-64px)] w-full border-t border-border">
      <Allotment>
        <Allotment.Pane minSize={MIN_AI_WIDTH} maxSize={MAX_AI_WIDTH} preferredSize={300}>
          <div className="h-full flex flex-col bg-muted/30 ">
            <ChatSection />
          </div>
        </Allotment.Pane>

        <Allotment.Pane>
          <div className="h-full flex flex-col bg-background border-x border-border">
            <WebDesignPreview onToggleTools={() => setShowTools(!showTools)} showTools={showTools} />
          </div>
        </Allotment.Pane>

        <Allotment.Pane
          visible={showTools}
          minSize={MIN_DESIGN_PREVIEW_WIDTH}
          maxSize={MAX_DESIGN_PREVIEW_WIDTH}
          preferredSize={300}
        >
        <div className="w-full h-full bg-muted/30 border-l border-border"></div>
        </Allotment.Pane>
      </Allotment>
    </div>
  );
};

export default GeneratePage;

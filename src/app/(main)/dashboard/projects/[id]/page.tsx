"use client";
import { Tldraw, useEditor } from "tldraw";
import "tldraw/tldraw.css";

const ProjectPage = () => {
  return (
    <div className="h-[calc(100vh-65px)] overflow-auto p-1">
      <Tldraw
      // components={}
        licenseKey={process.env.NEXT_PUBLIC_TLDRAW_LICENSE_KEY}
        onMount={(editor) => {
          console.log("Editor mounted:", editor);
        }}
      />
    </div>
  );
};

export default ProjectPage;

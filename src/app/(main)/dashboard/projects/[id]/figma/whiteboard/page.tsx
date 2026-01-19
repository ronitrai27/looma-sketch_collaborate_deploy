"use client";

import { useSearchParams, useParams } from "next/navigation";
import { useEffect, useState, useCallback, Suspense, useRef } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  Node,
  Edge,
  Panel,
  Connection,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2, Download, Layers, RefreshCw, ZoomIn, Settings2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

// Custom node component for Figma frames
const FigmaNode = ({ data }: { data: any }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="group relative border-[3px] border-white/10 hover:border-blue-500 rounded-xl overflow-hidden transition-all shadow-[0_8px_30px_rgb(0,0,0,0.12)] bg-neutral-900"
    >
      <div className="absolute top-0 left-0 right-0 bg-blue-600 text-white text-[11px] font-bold px-3 py-1 opacity-0 group-hover:opacity-100 transition-all z-10 flex justify-between items-center backdrop-blur-sm bg-opacity-80">
        <span className="truncate pr-4">{data.name}</span>
        <span className="text-[9px] uppercase tracking-wider opacity-80">{data.type}</span>
      </div>
      
      {data.imageUrl ? (
        <div className="relative">
          <img
            src={data.imageUrl}
            alt={data.name}
            width={data.width}
            height={data.height}
            className="pointer-events-none select-none max-w-none block"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      ) : (
        <div 
          style={{ width: data.width, height: data.height }}
          className="flex flex-col items-center justify-center bg-neutral-800 text-neutral-400 gap-2 p-6 text-center"
        >
          <div className="p-3 bg-neutral-700/50 rounded-full">
            <Layers className="w-6 h-6 opacity-20" />
          </div>
          <p className="text-xs font-medium">Render Unavailable</p>
          <p className="text-[10px] opacity-60">ID: {data.id.substring(0, 8)}...</p>
        </div>
      )}
    </motion.div>
  );
};

const nodeTypes = {
  figmaNode: FigmaNode,
};

function WhiteboardContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const url = searchParams.get("url");
  
  const [nodes, setNodes, onNodesChange] = useNodesState<Node<any>>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge<any>>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fileMeta, setFileMeta] = useState<{ name: string } | null>(null);
  const fetchedRef = useRef<string | null>(null);

  const fetchFigmaData = useCallback(async (figmaUrl: string) => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/figma/files", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileUrl: figmaUrl }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fetch");

      setFileMeta({ name: data.file.name });
      
      const initialNodes: Node<any>[] = [
        {
          id: 'file-thumbnail',
          type: "figmaNode",
          position: { x: 0, y: 0 },
          data: {
            id: 'thumbnail',
            name: data.file.name,
            type: 'FILE_THUMBNAIL',
            imageUrl: data.file.thumbnailUrl,
            width: 800,
            height: 600,
          },
        }
      ];

      setNodes(initialNodes);
      toast.success(`Loaded thumbnail for ${data.file.name}`);
    } catch (error: any) {
      toast.error(error.message);
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, [setNodes]);

  useEffect(() => {
    if (url && fetchedRef.current !== url) {
      fetchedRef.current = url;
      fetchFigmaData(url);
    }
  }, [url, fetchFigmaData]);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  return (
    <div className="w-full h-screen relative overflow-hidden">
      {/* HUD Header */}
      <div className="absolute top-6 left-6 z-50 flex items-center gap-4">
        <Link href={`/dashboard/projects/${params.id}/figma`}>
          <Button variant="outline" size="sm" className="bg-black/70 backdrop-blur-md border-neutral-800 text-neutral-200 hover:bg-neutral-800 hover:text-white shadow-2xl transition-all">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back
          </Button>
        </Link>
        
        <div className="bg-black/70 backdrop-blur-md px-5 py-2 rounded-2xl border border-neutral-800 shadow-2xl flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
            <Layers className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-[10px] text-neutral-00 font-bold uppercase tracking-tighter">Design Board</p>
            <h1 className="text-sm font-semibold text-white truncate max-w-[200px]">
              {fileMeta?.name || "Initializing..."}
            </h1>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isLoading && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center z-40 backdrop-blur-xl"
          >
            <div className="flex flex-col items-center gap-6">
              <div className="relative">
                <div className="w-20 h-20 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                   <Layers className="w-8 h-8 text-blue-500 animate-pulse" />
                </div>
              </div>
              <div className="text-center">
                <p className="text-xl font-bold text-white tracking-tight">Syncing Figma Components</p>
                <p className="text-neutral-500 text-sm mt-1">Downloading vectors and rendering previews...</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
        colorMode="light"
        className="#ffff"
        minZoom={0.05}
        maxZoom={4}
      >
        <Background color="#1a1a1a" variant={"dots" as any} gap={24} size={2} />
        {/* <Controls 
          className="bg-neutral-900 border-neutral-800 fill-neutral-400 shadow-2xl!"
          showInteractive={false} 
        /> */}
        <MiniMap 
          className="bg-gray-200! border-neutral-800! rounded-xl! overflow-hidden" 
          nodeColor="#3b82f6"
          maskColor="rgba(0,0,0,0.7)"
        />
        
        {/* <Panel position="top-right" className="flex flex-col gap-3 p-4">
           <div className="bg-neutral-900/90 backdrop-blur-md p-1.5 rounded-2xl border border-neutral-800 shadow-2xl flex flex-col gap-1">
             <Button 
                variant="ghost" 
                size="icon" 
                className="w-10 h-10 rounded-xl text-neutral-400 hover:bg-neutral-800 hover:text-white"
                onClick={() => url && fetchFigmaData(url)}
                disabled={isLoading}
              >
                <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="w-10 h-10 rounded-xl text-neutral-400 hover:bg-neutral-800 hover:text-white"
              >
                <ZoomIn className="w-5 h-5" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="w-10 h-10 rounded-xl text-neutral-400 hover:bg-neutral-800 hover:text-white"
              >
                <Settings2 className="w-5 h-5" />
              </Button>
           </div>
        </Panel> */}

        <Panel position="bottom-center" className="mb-6">
           <div className="bg-neutral-900/90 backdrop-blur-md px-6 py-3 rounded-2xl border border-neutral-800 shadow-2xl flex items-center gap-4">
              <div className="flex -space-x-2">
                 {[1,2,3].map(i => (
                   <div key={i} className="w-8 h-8 rounded-full border-2 border-neutral-900 bg-neutral-800 flex items-center justify-center text-[10px] font-bold text-neutral-400">
                     U{i}
                   </div>
                 ))}
              </div>
              <div className="h-4 w-px bg-neutral-800" />
              <p className="text-xs text-neutral-400 font-medium whitespace-nowrap">
                {nodes.length} Components detected
              </p>
           </div>
        </Panel>
      </ReactFlow>

      <style jsx global>{`
        .react-flow__handle {
          width: 8px;
          height: 8px;
          background: #3b82f6;
          border: 2px solid #0a0a0a;
        }
        .react-flow__edge-path {
          stroke: #3b82f6;
          stroke-width: 2;
        }
        .react-flow__controls button {
          background-color: #171717 !important;
          border-bottom: 1px solid #262626 !important;
          color: #a3a3a3 !important;
        }
        .react-flow__controls button:hover {
          background-color: #262626 !important;
          color: #ffffff !important;
        }
        .react-flow__controls button svg {
          fill: currentColor !important;
        }
      `}</style>
    </div>
  );
}

export default function FigmaWhiteboardPage() {
  return (
    <Suspense fallback={
       <div className="w-full h-screen flex items-center justify-center bg-[#0a0a0a]">
         <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
       </div>
    }>
      <WhiteboardContent />
    </Suspense>
  );
}

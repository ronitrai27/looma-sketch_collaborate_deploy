import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  LinkIcon,
  Loader,
  Loader2,
  LucideBot,
  LucideBrain,
  LucideLoader,
  MessageSquare,
  X,
} from "lucide-react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import {
  Message,
  MessageContent,
  MessageResponse,
} from "@/components/ai-elements/message";

import React, { useEffect, useState } from "react";
import { toast } from "sonner";

type Props = {
  onCodeChange?: (code: string) => void;
  onStatusChange?: (status: string) => void;
};

const Suggestions = [
  "Create a SaaS landing page",
  "Create a soft minimal website",
  "create a login ui",
  "make a admin dashboard",
];

const ChatSection = ({ onCodeChange, onStatusChange }: Props) => {
  const [input, setInput] = useState("");
  const [generatedCode, setGeneratedCode] = useState("");

  // SCRAPING
  const [isScrapingUrl, setIsScrapingUrl] = useState(false);
  const [detectedUrl, setDetectedUrl] = useState<string | null>(null);
  const [urlCodeMessages, setUrlCodeMessages] = useState<
    Array<{ role: string; content: string }>
  >([]);

  // AI calling sdk6
  const { messages, sendMessage, status, setMessages } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/generate",
    }),
  });

  console.log("messages in client side", messages);

  // STATUS CHANGE HANDLING-------------------------------------
  useEffect(() => {
    if (status === "submitted") {
      toast.loading("Analyzing context...", { id: "code-loading" });
    } else if (
      // @ts-ignore
      status !== "submitted" &&
      status !== "error" &&
      status === "streaming"
    ) {
      toast.dismiss("code-loading");
      toast.loading("Executing...", { id: "code-generation" });
    } else if (
      status === "ready" &&
      // @ts-ignore
      status !== "submitted" &&
      messages.length > 0
    ) {
      toast.dismiss("code-loading");
      toast.dismiss("code-generation");
      toast.success("Execution Successfull.");
    } else if (status === "error") {
      toast.dismiss("code-loading");
      toast.dismiss("code-generation");
      toast.error("Failed to execute.");
    }
  }, [status, onStatusChange]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    sendMessage({
      parts: [{ type: "text", text: input }],
    });
    setInput("");
  };

  // DETECT URL IN INPUT-------------------------------------
  useEffect(() => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const match = input.match(urlRegex);
    if (match && match[0]) {
      setDetectedUrl(match[0]);
    } else {
      setDetectedUrl(null);
    }
  }, [input]);

  const handleUrlCode = async () => {
    if (!detectedUrl) return;

    setIsScrapingUrl(true); // for loading part...
    try {
      setUrlCodeMessages((prev) => [
        ...prev,
        {
          role: "user",
          content: `Recreate this website: ${detectedUrl}`,
        },
      ]);
      toast.loading("Processing website...", { id: "scrape" });

      const response = await fetch("/api/scrape-generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url: detectedUrl,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to process website");
      }

      toast.dismiss("scrape");
      toast.loading("Generating code...", { id: "code-generation" });

      // Stream the response
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let accumulatedText = "";
      let lastCodeLength = 0;

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          accumulatedText += chunk;

          // Extract HTML code
          const match = accumulatedText.match(/```html\n([\s\S]*?)(```|$)/);
          if (match && match[1]) {
            const codeLength = match[1].length;
            if (codeLength > lastCodeLength) {
              setGeneratedCode(match[1]);
              lastCodeLength = codeLength;
            }
          }
        }
      }

      // Add success message
      if (lastCodeLength > 0) {
        setUrlCodeMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: `✅ I've analyzed ${detectedUrl} and generated ${lastCodeLength} characters of pixel-perfect HTML/Tailwind code. The recreation is now displaying in the preview panel.\n\n• View live preview\n• Edit by clicking elements\n• Download as React\n• Copy code\n• Save design`,
          },
        ]);
        toast.success("Website recreated!");
      } else {
        toast.error("⚠️ No code generated");
      }

      setInput("");
      setDetectedUrl(null);
    } catch (error) {
      console.error("💥 Error:", error);
      toast.error("Failed to process website");
      toast.dismiss("code-generation");

      setUrlCodeMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `❌ Failed: ${error?.message}`,
        },
      ]);
    } finally {
      setIsScrapingUrl(false);
      toast.dismiss("code-generation");
      toast.dismiss("scrape");
    }
  };

  // CODE EXTRACTION-------------------------------------
  useEffect(() => {
    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.role === "assistant" && lastMessage.parts) {
        const fullText = lastMessage.parts
          .filter((p) => p.type === "text")
          .map((p: any) => p.text)
          .join("");

        // Extract code part
        const match = fullText.match(/```html\n([\s\S]*?)(```|$)/);
        if (match && match[1]) {
          setGeneratedCode(match[1]);
        }
      }
    }
  }, [messages]);

  // CODE CHANGE HANDLING WITH DEBOUNCE-------------------------------------
  useEffect(() => {
    if (onCodeChange && generatedCode) {
      const handler = setTimeout(() => {
        onCodeChange(generatedCode);
      }, 200);

      return () => {
        clearTimeout(handler);
      };
    }
  }, [generatedCode, onCodeChange]);

  // STATUS CHANGE HANDLING-------------------------------------
  useEffect(() => {
    if (onStatusChange) {
      onStatusChange(status);
    }
  }, [status, onStatusChange]);

  console.log("generated code", generatedCode);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="h-12 border-b border-border bg-sidebar p-3 flex justify-between items-center">
        <h3 className="font-semibold text-xl text-primary">
          <LucideBot className="mr-2 inline -mt-1" /> Looma AI
        </h3>

        {/* if message , show clear button to clear message + generated code */}
        {messages.length > 0 && (
          <Button
            onClick={() => {
              setMessages([]);
              setGeneratedCode("");
            }}
            className="cursor-pointer text-[10px] p-2!"
            size="sm"
            variant={"outline"}
          >
            <X /> Clear
          </Button>
        )}
      </div>
      <div className="flex-1 overflow-y-auto p-2">
        <Conversation>
          <ConversationContent>
            {messages.length === 0 ? (
              <ConversationEmptyState
                icon={<MessageSquare className="size-12" />}
                title="Start a conversation"
                description="Imagine anything and let Looma AI create it for you!"
              />
            ) : (
              <>
                {messages.map((message) => (
                  <Message from={message.role} key={message.id}>
                    <MessageContent>
                      {message.parts.map((part, i) => {
                        switch (part.type) {
                          case "text":
                            return (
                              <MessageResponse key={`${message.id}-${i}`}>
                                {part.text}
                              </MessageResponse>
                            );
                          default:
                            return null;
                        }
                      })}
                    </MessageContent>
                  </Message>
                ))}

                {(status === "streaming" || status === "submitted") && (
                  <div className="flex items-center gap-2 text-xs text-muted-foreground py-2 pl-1 animate-in fade-in duration-300">
                    <LucideLoader className="size-3 animate-spin" />
                    <span>
                      {status === "submitted"
                        ? "AI is thinking..."
                        : "AI is executing..."}
                    </span>
                  </div>
                )}

                {isScrapingUrl && (
                  <div className="flex items-center gap-2 text-blue-600 text-sm animate-pulse">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <p>Backend processing website...</p>
                  </div>
                )}
              </>
            )}
          </ConversationContent>
        </Conversation>
      </div>
      {/* INPUT AREA */}
      <div className="relative mt-auto border-t border-border px-3 py-3">
        {detectedUrl ? (
          <div className="mb-2 p-1 bg-blue-50 dark:bg-gray-200 border border-blue-200 rounded-md flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-blue-700">
              <LinkIcon className="w-4 h-4" />
              <span className="font-medium">URL:</span>
              <span className="truncate max-w-[180px] text-sm text-muted-foreground dark:text-black">
                {detectedUrl}
              </span>
            </div>
            <Button
              size="sm"
              onClick={handleUrlCode}
              disabled={isScrapingUrl}
              className="bg-blue-500 hover:bg-blue-600 text-white text-xs cursor-pointer"
            >
              {isScrapingUrl ? (
                <>
                  <Loader className="w-4 h-4 animate-spin mr-2" />
                  Processing...
                </>
              ) : (
                "Recreate"
              )}
            </Button>
          </div>
        ) : (
          <div className="flex gap-2 w-full mb-2 overflow-x-auto scrollbar-hide">
            {Suggestions.map((suggestion, index) => (
              <Button
                key={index}
                className="cursor-pointer text-[10px] p-2! rounded-full"
                size="sm"
                variant="outline"
                onClick={() => setInput(suggestion)}
              >
                {suggestion}
              </Button>
            ))}
          </div>
        )}

        <Textarea
          className="resize-none h-18 p-1 bg-primary-foreground focus:outline-none focus:ring-0 shadow-sm"
          placeholder="Create  saas landing page..."
          value={input}
          onChange={(event) => {
            setInput(event.target.value);
          }}
          onKeyDown={async (event) => {
            if (event.key === "Enter") {
              handleSendMessage();
            }
          }}
        />
        <Button
          className="cursor-pointer text-xs absolute bottom-6 right-5"
          size="icon-sm"
          onClick={handleSendMessage}
          variant="default"
        >
          <LucideBrain />
        </Button>
      </div>
    </div>
  );
};

export default ChatSection;

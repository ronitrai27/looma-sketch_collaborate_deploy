import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  LinkIcon,
  Loader,
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
  const [visionMessages, setVisionMessages] = useState<
    Array<{ role: string; content: string }>
  >([]);

  // AI SDK hooks
  const { messages, sendMessage, status, setMessages } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/generate",
    }),
  });

  const {
    messages: scrapeMessages,
    sendMessage: scrapeSendMessage,
    status: scrapeStatus,
    setMessages: scrapeSetMessages,
  } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/scrape-generate",
    }),
  });

  const handleSendMessage = async () => {
    if (!input.trim()) return;
    sendMessage({
      parts: [{ type: "text", text: input }],
    });
    setInput("");
    setDetectedUrl(null);
    toast.success("Message sent successfully");
  };

  const handleSendScrapeMessage = async () => {
    if (!detectedUrl) return;
    toast.info("Starting scrape process. This may take a minute...");
    scrapeSendMessage(
      {
        role: "user",
        parts: [{ type: "text", text: "Recreating the website from URL..." }],
      },
      {
        body: {
          url: detectedUrl,
        },
      }
    );
    setInput("");
    setDetectedUrl(null);
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

  // CODE EXTRACTION-------------------------------------
  useEffect(() => {
    const allMsgs = [...messages, ...scrapeMessages];
    if (allMsgs.length > 0) {
      const lastMessage = allMsgs[allMsgs.length - 1];
      
      if (lastMessage.role === "assistant") {
        let fullText = "";
        
        // Try content first (Vercel AI SDK text streams)
        if ((lastMessage as any).content) {
            fullText = (lastMessage as any).content;
        } 
        // Then try parts (Vercel AI SDK UI message streams)
        else if (lastMessage.parts) {
            fullText = lastMessage.parts
                .filter((p) => p.type === "text")
                .map((p: any) => p.text)
                .join("");
        }

        if (fullText) {
            const match = fullText.match(/```html\n([\s\S]*?)(```|$)/);
            if (match && match[1]) {
              console.log("💎 Code extracted successfully (length):", match[1].length);
              setGeneratedCode(match[1]);
            } else {
              // Log snippet if no match found but text exists
              console.log("📝 Assistant message received, but no code block found yet. Text snippet:", fullText.substring(0, 100));
            }
        }
      }
    }
  }, [messages, scrapeMessages]);

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
    // Handle scrape specific toasts
    if (scrapeStatus === "submitted") {
        toast.loading("Analyzing URL & Screenshot...", { id: "scrape-loading" });
    } else if (scrapeStatus === "streaming") {
        toast.dismiss("scrape-loading");
    } else if (scrapeStatus === "ready") {
        toast.dismiss("scrape-loading");
    } else if (scrapeStatus === "error") {
        toast.dismiss("scrape-loading");
        toast.error("Failed to scrape URL.");
    }

    if (onStatusChange) {
      if (status === "streaming" || status === "submitted") {
        onStatusChange(status);
      } else if (
        scrapeStatus === "streaming" ||
        scrapeStatus === "submitted"
      ) {
        onStatusChange(scrapeStatus);
      } else {
        onStatusChange("ready");
      }
    }
  }, [status, scrapeStatus, onStatusChange]);

  const allMessages = [...messages, ...scrapeMessages];
  console.log("📊 UI Messages Count:", allMessages.length);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="h-12 border-b border-border bg-sidebar p-3 flex justify-between items-center">
        <h3 className="font-semibold text-xl text-primary">
          <LucideBot className="mr-2 inline -mt-1" /> Looma AI
        </h3>

        {/* if message , show clear button to clear message + generated code */}
        {allMessages.length > 0 && (
          <Button
            onClick={() => {
              setMessages([]);
              scrapeSetMessages([]);
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
            {allMessages.length === 0 ? (
              <ConversationEmptyState
                icon={<MessageSquare className="size-12" />}
                title="Start a conversation"
                description="Imagine anything and let Looma AI create it for you!"
              />
            ) : (
              <>
                {allMessages.map((message, idx) => (
                  <Message from={message.role} key={message.id || idx}>
                    <MessageContent>
                      {(message as any).content ? (
                         <MessageResponse>{(message as any).content}</MessageResponse>
                      ) : message.parts && message.parts.length > 0 ? (
                        message.parts.map((part, i) => {
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
                        })
                      ) : (
                        <div className="flex items-center gap-2 text-xs text-muted-foreground italic">
                           {message.role === 'assistant' ? (
                             <>
                               <LucideLoader className="size-3 animate-spin" />
                               <span>AI is working...</span>
                             </>
                           ) : (
                             'Processing...'
                           )}
                        </div>
                      )}
                    </MessageContent>
                  </Message>
                ))}

                {(status === "streaming" ||
                  status === "submitted" ||
                  scrapeStatus === "streaming" ||
                  scrapeStatus === "submitted") && (
                  <div className="flex items-center gap-2 text-xs text-muted-foreground py-2 pl-1 animate-in fade-in duration-300">
                    <LucideLoader className="size-3 animate-spin" />
                    <span>
                      {status === "submitted" || scrapeStatus === "submitted"
                        ? "AI is thinking..."
                        : "AI is typing..."}
                    </span>
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
              onClick={handleSendScrapeMessage}
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
          variant="default"
          onClick={handleSendMessage}
        >
          <LucideBrain />
        </Button>
      </div>
    </div>
  );
};

export default ChatSection;

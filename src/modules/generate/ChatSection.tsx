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

  // AI calling sdk6
  const { messages, sendMessage, status, setMessages } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/generate",
    }),
  });


  const { messages:scrapeMessages, sendMessage:scrapeSendMessage, status:scrapeStatus, setMessages:scrapeSetMessages } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/scrape-generate",
    }),
  });

  console.log("messages in client side", messages);

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
              <span className="truncate max-w-[180px] text-sm text-muted-foreground dark:text-black">{detectedUrl}</span>
            </div>
            <Button
              size="sm"
              // onClick={handleScrapeUrl}
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
              sendMessage({
                parts: [{ type: "text", text: input }],
              });
              setInput("");
            }
          }}
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

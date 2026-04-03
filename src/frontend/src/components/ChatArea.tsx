import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { type MockMessage, formatTimestamp } from "@/data/mockData";
import {
  ImageIcon,
  Paperclip,
  Phone,
  Plus,
  Search,
  Send,
  Users,
  Video,
  X,
} from "lucide-react";
import { Hash } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

interface AttachedFile {
  id: number;
  name: string;
  type: "image" | "video" | "file";
}

let nextFileId = 1;

interface ChatAreaProps {
  title: string;
  isChannel: boolean;
  messages: MockMessage[];
  onSendMessage: (content: string) => void;
  onAudioCall: () => void;
  onVideoCall: () => void;
  rightPanelOpen: boolean;
  onToggleRightPanel: () => void;
}

export function ChatArea({
  title,
  isChannel,
  messages,
  onSendMessage,
  onAudioCall,
  onVideoCall,
  rightPanelOpen,
  onToggleRightPanel,
}: ChatAreaProps) {
  const [input, setInput] = useState("");
  const [search, setSearch] = useState("");
  const [attachMenuOpen, setAttachMenuOpen] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState<AttachedFile[]>([]);
  const bottomRef = useRef<HTMLDivElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const attachMenuRef = useRef<HTMLDivElement>(null);

  // biome-ignore lint/correctness/useExhaustiveDependencies: scroll on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        attachMenuRef.current &&
        !attachMenuRef.current.contains(e.target as Node)
      ) {
        setAttachMenuOpen(false);
      }
    };
    if (attachMenuOpen)
      document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [attachMenuOpen]);

  const handleSend = () => {
    if (!input.trim() && attachedFiles.length === 0) return;
    onSendMessage(input.trim() || attachedFiles.map((f) => f.name).join(", "));
    setInput("");
    setAttachedFiles([]);
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: AttachedFile["type"],
  ) => {
    const files = Array.from(e.target.files ?? []);
    setAttachedFiles((prev) => [
      ...prev,
      ...files.map((f) => ({ id: nextFileId++, name: f.name, type })),
    ]);
    e.target.value = "";
    setAttachMenuOpen(false);
  };

  const removeAttachment = (id: number) => {
    setAttachedFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const filteredMessages = search
    ? messages.filter((m) =>
        m.content.toLowerCase().includes(search.toLowerCase()),
      )
    : messages;

  const canSend = input.trim() || attachedFiles.length > 0;

  return (
    <main className="flex flex-col flex-1 min-w-0 h-full bg-background">
      {/* Top bar */}
      <header
        className="flex items-center gap-3 px-5 py-3 border-b shrink-0"
        style={{ borderColor: "oklch(0.9 0.01 240)", minHeight: 60 }}
      >
        <div className="flex items-center gap-2 mr-auto min-w-0">
          {isChannel ? (
            <Hash className="h-5 w-5 text-muted-foreground shrink-0" />
          ) : null}
          <h1 className="text-lg font-bold text-foreground truncate">
            {title}
          </h1>
        </div>

        {/* Search */}
        <div className="relative hidden sm:block">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-8 pl-8 pr-3 w-40 text-sm"
            style={{
              background: "oklch(0.96 0.008 240)",
              border: "1px solid oklch(0.9 0.01 240)",
            }}
            data-ocid="chat.search_input"
          />
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 rounded-lg"
            style={{ background: "oklch(0.94 0.01 240)" }}
            onClick={onAudioCall}
            aria-label="Start audio call"
            data-ocid="chat.button"
          >
            <Phone
              className="h-4 w-4"
              style={{ color: "oklch(0.35 0.03 255)" }}
            />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 rounded-lg"
            style={{ background: "oklch(0.94 0.01 240)" }}
            onClick={onVideoCall}
            aria-label="Start video call"
            data-ocid="chat.secondary_button"
          >
            <Video
              className="h-4 w-4"
              style={{ color: "oklch(0.35 0.03 255)" }}
            />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-2.5 rounded-lg gap-1.5 text-xs font-medium"
            style={{
              background: rightPanelOpen
                ? "oklch(0.58 0.18 255)"
                : "oklch(0.94 0.01 240)",
              color: rightPanelOpen ? "white" : "oklch(0.35 0.03 255)",
            }}
            onClick={onToggleRightPanel}
            data-ocid="chat.toggle"
          >
            <Users className="h-4 w-4" />
            <span className="hidden md:inline">Members</span>
          </Button>
        </div>
      </header>

      {/* Messages */}
      <ScrollArea className="flex-1 scrollbar-thin">
        <div className="px-5 py-4 space-y-1">
          <AnimatePresence initial={false}>
            {filteredMessages.map((msg, idx) => {
              const showHeader =
                idx === 0 || filteredMessages[idx - 1].sender !== msg.sender;
              return (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.15 }}
                  className={`flex gap-3 ${msg.isOwn ? "flex-row-reverse" : "flex-row"} ${
                    showHeader ? "mt-4" : "mt-0.5"
                  }`}
                  data-ocid={`chat.item.${idx + 1}`}
                >
                  {/* Avatar */}
                  <div className="shrink-0" style={{ width: 32 }}>
                    {showHeader && (
                      <Avatar className="h-8 w-8">
                        <AvatarFallback
                          style={{
                            background: msg.senderColor,
                            color: "white",
                          }}
                          className="text-xs font-semibold"
                        >
                          {msg.senderInitials}
                        </AvatarFallback>
                      </Avatar>
                    )}
                  </div>

                  {/* Bubble */}
                  <div
                    className={`flex flex-col ${
                      msg.isOwn ? "items-end" : "items-start"
                    } max-w-[70%]`}
                  >
                    {showHeader && (
                      <div
                        className={`flex items-baseline gap-2 mb-1 ${
                          msg.isOwn ? "flex-row-reverse" : "flex-row"
                        }`}
                      >
                        <span className="text-sm font-semibold text-foreground">
                          {msg.sender}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {formatTimestamp(msg.timestamp)}
                        </span>
                      </div>
                    )}
                    <div
                      className="px-3 py-2 rounded-2xl text-sm leading-relaxed"
                      style={{
                        background: msg.isOwn
                          ? "oklch(0.9 0.06 250)"
                          : "oklch(0.94 0.01 240)",
                        color: "oklch(0.15 0.03 255)",
                        borderRadius: msg.isOwn
                          ? "18px 18px 4px 18px"
                          : "18px 18px 18px 4px",
                      }}
                    >
                      {msg.content}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
          {filteredMessages.length === 0 && search && (
            <div
              className="flex flex-col items-center py-16 text-muted-foreground"
              data-ocid="chat.empty_state"
            >
              <Search className="h-10 w-10 mb-3 opacity-30" />
              <p className="text-sm">No messages match "{search}"</p>
            </div>
          )}
          <div ref={bottomRef} />
        </div>
      </ScrollArea>

      {/* Composer */}
      <div
        className="px-5 py-3 border-t shrink-0"
        style={{ borderColor: "oklch(0.9 0.01 240)" }}
      >
        {/* Attached file chips */}
        {attachedFiles.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-2">
            {attachedFiles.map((f, idx) => (
              <div
                key={f.id}
                className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium"
                style={{
                  background: "oklch(0.93 0.04 255)",
                  color: "oklch(0.35 0.1 255)",
                  border: "1px solid oklch(0.85 0.06 255)",
                }}
                data-ocid={`chat.item.${idx + 1}`}
              >
                {f.type === "image" && <ImageIcon className="h-3 w-3" />}
                {f.type === "video" && <Video className="h-3 w-3" />}
                {f.type === "file" && <Paperclip className="h-3 w-3" />}
                <span className="max-w-[120px] truncate">{f.name}</span>
                <button
                  type="button"
                  onClick={() => removeAttachment(f.id)}
                  className="ml-0.5 hover:opacity-70 transition-opacity"
                  aria-label={`Remove ${f.name}`}
                  data-ocid={`chat.delete_button.${idx + 1}`}
                >
                  <X className="h-2.5 w-2.5" />
                </button>
              </div>
            ))}
          </div>
        )}

        <div
          className="flex items-center gap-2 rounded-xl px-3 py-2"
          style={{
            border: "1px solid oklch(0.88 0.012 240)",
            background: "white",
          }}
        >
          {/* Attachment button */}
          <div className="relative shrink-0" ref={attachMenuRef}>
            <Button
              size="icon"
              variant="ghost"
              className="h-7 w-7 rounded-lg transition-colors"
              style={{
                background: attachMenuOpen
                  ? "oklch(0.58 0.18 255)"
                  : "oklch(0.94 0.01 240)",
                color: attachMenuOpen ? "white" : "oklch(0.5 0.05 255)",
              }}
              onClick={() => setAttachMenuOpen((v) => !v)}
              aria-label="Add attachment"
              data-ocid="chat.upload_button"
            >
              <Plus className="h-3.5 w-3.5" />
            </Button>

            {/* Dropdown menu -- opens upward */}
            <AnimatePresence>
              {attachMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 6, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.96 }}
                  transition={{ duration: 0.12 }}
                  className="absolute left-0 bottom-full mb-2 rounded-xl overflow-hidden shadow-lg z-50"
                  style={{
                    background: "white",
                    border: "1px solid oklch(0.9 0.01 240)",
                    minWidth: 140,
                  }}
                  data-ocid="chat.popover"
                >
                  <button
                    type="button"
                    className="flex items-center gap-2.5 w-full px-3 py-2.5 text-sm font-medium hover:bg-slate-50 transition-colors"
                    style={{ color: "oklch(0.3 0.05 255)" }}
                    onClick={() => imageInputRef.current?.click()}
                    data-ocid="chat.button"
                  >
                    <ImageIcon
                      className="h-4 w-4"
                      style={{ color: "oklch(0.58 0.18 255)" }}
                    />
                    Image
                  </button>
                  <button
                    type="button"
                    className="flex items-center gap-2.5 w-full px-3 py-2.5 text-sm font-medium hover:bg-slate-50 transition-colors"
                    style={{ color: "oklch(0.3 0.05 255)" }}
                    onClick={() => videoInputRef.current?.click()}
                    data-ocid="chat.secondary_button"
                  >
                    <Video
                      className="h-4 w-4"
                      style={{ color: "oklch(0.6 0.15 150)" }}
                    />
                    Video
                  </button>
                  <button
                    type="button"
                    className="flex items-center gap-2.5 w-full px-3 py-2.5 text-sm font-medium hover:bg-slate-50 transition-colors"
                    style={{ color: "oklch(0.3 0.05 255)" }}
                    onClick={() => fileInputRef.current?.click()}
                    data-ocid="chat.toggle"
                  >
                    <Paperclip
                      className="h-4 w-4"
                      style={{ color: "oklch(0.55 0.12 40)" }}
                    />
                    File
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Hidden file inputs */}
          <input
            ref={imageInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            multiple
            onChange={(e) => handleFileChange(e, "image")}
          />
          <input
            ref={videoInputRef}
            type="file"
            accept="video/*"
            className="hidden"
            multiple
            onChange={(e) => handleFileChange(e, "video")}
          />
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            multiple
            onChange={(e) => handleFileChange(e, "file")}
          />

          <Input
            className="flex-1 border-0 shadow-none p-0 text-sm focus-visible:ring-0 bg-transparent"
            placeholder="Type your message…"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            data-ocid="chat.input"
          />
          <Button
            size="icon"
            variant="ghost"
            className="h-7 w-7 rounded-lg shrink-0 transition-colors"
            style={{
              background: canSend ? "oklch(0.58 0.18 255)" : "transparent",
              color: canSend ? "white" : "oklch(0.65 0.025 255)",
            }}
            onClick={handleSend}
            disabled={!canSend}
            data-ocid="chat.submit_button"
            aria-label="Send message"
          >
            <Send className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </main>
  );
}

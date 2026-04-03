import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { MockChannel, MockUser } from "@/data/mockData";
import { ChevronDown, Hash, MessageSquare, Plus } from "lucide-react";

type ActiveView =
  | { type: "channel"; id: string }
  | { type: "dm"; userId: string };

interface SidebarProps {
  channels: MockChannel[];
  dmUsers: MockUser[];
  activeView: ActiveView;
  onSelectChannel: (id: string) => void;
  onSelectDM: (userId: string) => void;
  onAddChannel: () => void;
  onAddDM: () => void;
  currentUserInitials?: string;
}

export function Sidebar({
  channels,
  dmUsers,
  activeView,
  onSelectChannel,
  onSelectDM,
  onAddChannel,
  onAddDM,
}: SidebarProps) {
  return (
    <aside
      className="flex flex-col w-64 shrink-0 h-full"
      style={{
        background:
          "linear-gradient(160deg, oklch(0.14 0.065 260) 0%, oklch(0.18 0.07 255) 100%)",
      }}
    >
      {/* Brand */}
      <div
        className="flex items-center gap-2.5 px-5 py-4 border-b"
        style={{ borderColor: "oklch(0.22 0.05 255)" }}
      >
        <img
          src="/assets/generated/meetflow-logo-transparent.dim_48x48.png"
          alt="MeetFlow"
          className="w-7 h-7 rounded-lg"
        />
        <span
          className="text-base font-semibold"
          style={{ color: "oklch(0.96 0.012 255)" }}
        >
          MeetFlow
        </span>
        <ChevronDown
          className="ml-auto h-4 w-4"
          style={{ color: "oklch(0.55 0.03 255)" }}
        />
      </div>

      <ScrollArea className="flex-1 py-3 scrollbar-thin">
        {/* Channels */}
        <div className="mb-4">
          <div className="flex items-center justify-between px-5 mb-1">
            <span
              className="text-xs font-semibold uppercase tracking-wider"
              style={{ color: "oklch(0.62 0.025 255)" }}
            >
              Channels
            </span>
            <button
              type="button"
              onClick={onAddChannel}
              className="rounded p-0.5 transition-colors hover:bg-white/10"
              style={{ color: "oklch(0.62 0.025 255)" }}
              aria-label="Add channel"
              data-ocid="channel.open_modal_button"
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
          </div>
          <nav>
            {channels.map((ch) => {
              const isActive =
                activeView.type === "channel" && activeView.id === ch.id;
              return (
                <button
                  type="button"
                  key={ch.id}
                  onClick={() => onSelectChannel(ch.id)}
                  className="w-full flex items-center gap-2 px-4 py-1.5 mx-1 rounded-lg text-sm transition-colors group"
                  style={{
                    background: isActive
                      ? "oklch(0.21 0.065 255)"
                      : "transparent",
                    color: isActive
                      ? "oklch(0.96 0.012 255)"
                      : "oklch(0.72 0.025 255)",
                    width: "calc(100% - 8px)",
                  }}
                  data-ocid="channel.link"
                >
                  <Hash
                    className="h-4 w-4 shrink-0"
                    style={{ opacity: isActive ? 1 : 0.7 }}
                  />
                  <span className="truncate font-medium">{ch.name}</span>
                  {ch.unread && !isActive && (
                    <span
                      className="ml-auto text-xs font-bold rounded-full px-1.5 py-0.5 min-w-[20px] text-center"
                      style={{
                        background: "oklch(0.58 0.18 255)",
                        color: "white",
                      }}
                    >
                      {ch.unread}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Private Messages */}
        <div className="mb-4">
          <div className="flex items-center justify-between px-5 mb-1">
            <span
              className="text-xs font-semibold uppercase tracking-wider"
              style={{ color: "oklch(0.62 0.025 255)" }}
            >
              Private Messages
            </span>
            <button
              type="button"
              onClick={onAddDM}
              className="rounded p-0.5 transition-colors hover:bg-white/10"
              style={{ color: "oklch(0.62 0.025 255)" }}
              aria-label="Start direct message"
              data-ocid="dm.open_modal_button"
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
          </div>
          <nav>
            {dmUsers.map((user) => {
              const isActive =
                activeView.type === "dm" && activeView.userId === user.id;
              return (
                <button
                  type="button"
                  key={user.id}
                  onClick={() => onSelectDM(user.id)}
                  className="w-full flex items-center gap-2.5 px-4 py-1.5 mx-1 rounded-lg text-sm transition-colors"
                  style={{
                    background: isActive
                      ? "oklch(0.21 0.065 255)"
                      : "transparent",
                    color: isActive
                      ? "oklch(0.96 0.012 255)"
                      : "oklch(0.72 0.025 255)",
                    width: "calc(100% - 8px)",
                  }}
                  data-ocid="dm.link"
                >
                  <div className="relative shrink-0">
                    <Avatar className="h-6 w-6">
                      <AvatarFallback
                        style={{ background: user.color, color: "white" }}
                        className="text-[10px] font-semibold"
                      >
                        {user.initials}
                      </AvatarFallback>
                    </Avatar>
                    <span
                      className={`absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full border border-current ${
                        user.status === "online"
                          ? "status-online"
                          : user.status === "away"
                            ? "status-away"
                            : "bg-muted-foreground/40"
                      }`}
                      style={{ borderColor: "oklch(0.16 0.066 258)" }}
                    />
                  </div>
                  <span className="truncate font-medium">{user.name}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </ScrollArea>

      {/* New Chat button */}
      <div
        className="p-4"
        style={{ borderTop: "1px solid oklch(0.22 0.05 255)" }}
      >
        <button
          type="button"
          onClick={onAddDM}
          className="w-full flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-white/10"
          style={{
            border: "1px solid oklch(0.32 0.055 255)",
            color: "oklch(0.82 0.02 255)",
          }}
          data-ocid="dm.primary_button"
        >
          <MessageSquare className="h-4 w-4" />
          New Chat
        </button>
      </div>
    </aside>
  );
}

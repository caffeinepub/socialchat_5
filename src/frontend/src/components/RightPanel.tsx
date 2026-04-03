import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MOCK_USERS } from "@/data/mockData";
import { Pin, Settings, UserPlus, Users, X } from "lucide-react";
import { useState } from "react";

type PanelTab = "members" | "pinned" | "settings";

interface RightPanelProps {
  title: string;
  onClose: () => void;
}

export function RightPanel({ title, onClose }: RightPanelProps) {
  const [activeTab, setActiveTab] = useState<PanelTab>("members");

  return (
    <aside
      className="flex flex-col w-64 shrink-0 h-full border-l animate-slide-in-right"
      style={{
        background: "oklch(0.97 0.005 240)",
        borderColor: "oklch(0.9 0.01 240)",
      }}
      data-ocid="members.panel"
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-3.5 border-b"
        style={{ borderColor: "oklch(0.9 0.01 240)" }}
      >
        <h2 className="text-sm font-semibold text-foreground truncate">
          {title}
        </h2>
        <button
          type="button"
          onClick={onClose}
          className="p-1 rounded hover:bg-black/5 text-muted-foreground transition-colors"
          aria-label="Close panel"
          data-ocid="members.close_button"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Tabs */}
      <div
        className="flex items-center border-b"
        style={{ borderColor: "oklch(0.9 0.01 240)" }}
      >
        {(
          [
            { id: "members" as PanelTab, icon: Users, label: "Members" },
            { id: "pinned" as PanelTab, icon: Pin, label: "Pinned" },
            { id: "settings" as PanelTab, icon: Settings, label: "Settings" },
          ] as const
        ).map(({ id, icon: Icon, label }) => (
          <button
            type="button"
            key={id}
            onClick={() => setActiveTab(id)}
            className="flex-1 flex flex-col items-center gap-1 py-3 text-xs font-medium transition-colors"
            style={{
              color:
                activeTab === id
                  ? "oklch(0.58 0.18 255)"
                  : "oklch(0.52 0.025 255)",
              borderBottom:
                activeTab === id
                  ? "2px solid oklch(0.58 0.18 255)"
                  : "2px solid transparent",
            }}
            data-ocid="members.tab"
          >
            <Icon className="h-4 w-4" />
            {label}
          </button>
        ))}
      </div>

      <ScrollArea className="flex-1 scrollbar-thin">
        {activeTab === "members" && (
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {MOCK_USERS.length} Members
              </span>
              <button
                type="button"
                className="p-1 rounded hover:bg-black/5 text-muted-foreground transition-colors"
                aria-label="Add member"
              >
                <UserPlus className="h-3.5 w-3.5" />
              </button>
            </div>
            <div className="flex flex-wrap gap-2 mb-4">
              {MOCK_USERS.map((user) => (
                <div key={user.id} className="relative" title={user.name}>
                  <Avatar className="h-8 w-8">
                    <AvatarFallback
                      style={{ background: user.color, color: "white" }}
                      className="text-xs font-semibold"
                    >
                      {user.initials}
                    </AvatarFallback>
                  </Avatar>
                  <span
                    className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-background ${
                      user.status === "online"
                        ? "status-online"
                        : user.status === "away"
                          ? "status-away"
                          : "bg-muted-foreground/30"
                    }`}
                  />
                </div>
              ))}
            </div>
            <div className="space-y-1">
              {MOCK_USERS.map((user, i) => (
                <div
                  key={user.id}
                  className="flex items-center gap-2.5 py-2 px-2 rounded-lg hover:bg-black/5 cursor-pointer transition-colors"
                  data-ocid={`members.item.${i + 1}`}
                >
                  <div className="relative shrink-0">
                    <Avatar className="h-7 w-7">
                      <AvatarFallback
                        style={{ background: user.color, color: "white" }}
                        className="text-xs font-semibold"
                      >
                        {user.initials}
                      </AvatarFallback>
                    </Avatar>
                    <span
                      className={`absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full border border-background ${
                        user.status === "online"
                          ? "status-online"
                          : user.status === "away"
                            ? "status-away"
                            : "bg-muted-foreground/30"
                      }`}
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate text-foreground">
                      {user.name}
                    </p>
                    <p
                      className="text-xs capitalize"
                      style={{
                        color:
                          user.status === "online"
                            ? "oklch(0.65 0.15 155)"
                            : "oklch(0.52 0.025 255)",
                      }}
                    >
                      {user.status}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "pinned" && (
          <div className="p-4">
            <p className="text-sm font-semibold mb-3 text-foreground">
              Pinned Messages
            </p>
            <div
              className="rounded-lg p-3 border text-sm"
              style={{
                background: "white",
                borderColor: "oklch(0.9 0.01 240)",
              }}
            >
              <p className="font-medium text-xs text-muted-foreground mb-1">
                Alice Chen · Today
              </p>
              <p className="text-foreground">
                Launching MeetFlow v2.0 next Friday! Please make sure all PRs
                are merged by Wednesday EOD.
              </p>
            </div>
          </div>
        )}

        {activeTab === "settings" && (
          <div className="p-4 space-y-3">
            <p className="text-sm font-semibold text-foreground">
              Channel Settings
            </p>
            <div className="space-y-2">
              {[
                { label: "Notifications", desc: "All messages" },
                { label: "Privacy", desc: "Public channel" },
                { label: "Integrations", desc: "2 connected" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between py-2.5 px-3 rounded-lg hover:bg-black/5 cursor-pointer transition-colors"
                  style={{
                    background: "white",
                    border: "1px solid oklch(0.9 0.01 240)",
                  }}
                >
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {item.label}
                    </p>
                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                  </div>
                  <Settings className="h-3.5 w-3.5 text-muted-foreground" />
                </div>
              ))}
            </div>
          </div>
        )}
      </ScrollArea>
    </aside>
  );
}

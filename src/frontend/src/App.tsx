import { CallModal } from "@/components/CallModal";
import { ChatArea } from "@/components/ChatArea";
import { NewChannelModal } from "@/components/NewChannelModal";
import { NewDMModal } from "@/components/NewDMModal";
import { RightPanel } from "@/components/RightPanel";
import { Sidebar } from "@/components/Sidebar";
import { Toaster } from "@/components/ui/sonner";
import {
  MOCK_CHANNELS,
  MOCK_CHANNEL_MESSAGES,
  MOCK_DM_MESSAGES,
  MOCK_USERS,
  type MockChannel,
  type MockMessage,
  type MockUser,
} from "@/data/mockData";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useState } from "react";

type ActiveView =
  | { type: "channel"; id: string }
  | { type: "dm"; userId: string };

type CallState = { type: "audio" | "video"; title: string } | null;

export default function App() {
  const [channels, setChannels] = useState<MockChannel[]>(MOCK_CHANNELS);
  const [dmUsers, setDmUsers] = useState<MockUser[]>(MOCK_USERS.slice(0, 3));
  const [activeView, setActiveView] = useState<ActiveView>({
    type: "channel",
    id: "general",
  });
  const [channelMessages, setChannelMessages] = useState<
    Record<string, MockMessage[]>
  >(MOCK_CHANNEL_MESSAGES);
  const [dmMessages, setDmMessages] =
    useState<Record<string, MockMessage[]>>(MOCK_DM_MESSAGES);
  const [rightPanelOpen, setRightPanelOpen] = useState(true);
  const [callState, setCallState] = useState<CallState>(null);
  const [newChannelOpen, setNewChannelOpen] = useState(false);
  const [newDMOpen, setNewDMOpen] = useState(false);

  // Derive current messages & title
  const currentMessages: MockMessage[] =
    activeView.type === "channel"
      ? (channelMessages[activeView.id] ?? [])
      : (dmMessages[activeView.userId] ?? []);

  const currentTitle =
    activeView.type === "channel"
      ? (channels.find((c) => c.id === activeView.id)?.name ?? "channel")
      : (dmUsers.find((u) => u.id === activeView.userId)?.name ?? "User");

  const handleSendMessage = useCallback(
    (content: string) => {
      const newMsg: MockMessage = {
        id: `msg-${Date.now()}`,
        sender: "You",
        senderInitials: "ME",
        senderColor: "oklch(0.58 0.18 255)",
        content,
        timestamp: new Date(),
        isOwn: true,
      };
      if (activeView.type === "channel") {
        setChannelMessages((prev) => ({
          ...prev,
          [activeView.id]: [...(prev[activeView.id] ?? []), newMsg],
        }));
      } else {
        setDmMessages((prev) => ({
          ...prev,
          [activeView.userId]: [...(prev[activeView.userId] ?? []), newMsg],
        }));
      }
    },
    [activeView],
  );

  const handleCreateChannel = (name: string, description: string) => {
    const newCh: MockChannel = { id: name, name, description };
    setChannels((prev) => [...prev, newCh]);
    setChannelMessages((prev) => ({ ...prev, [name]: [] }));
    setActiveView({ type: "channel", id: name });
  };

  const handleSelectDMUser = (user: MockUser) => {
    if (!dmUsers.find((u) => u.id === user.id)) {
      setDmUsers((prev) => [...prev, user]);
    }
    setActiveView({ type: "dm", userId: user.id });
  };

  const rightPanelTitle =
    activeView.type === "channel" ? `#${currentTitle}` : currentTitle;

  return (
    <div className="flex h-full bg-background overflow-hidden">
      <Toaster />

      {/* Left Sidebar */}
      <Sidebar
        channels={channels}
        dmUsers={dmUsers}
        activeView={activeView}
        onSelectChannel={(id) => setActiveView({ type: "channel", id })}
        onSelectDM={(userId) => setActiveView({ type: "dm", userId })}
        onAddChannel={() => setNewChannelOpen(true)}
        onAddDM={() => setNewDMOpen(true)}
      />

      {/* Main chat */}
      <AnimatePresence mode="wait">
        <motion.div
          key={
            activeView.type === "channel" ? activeView.id : activeView.userId
          }
          className="flex flex-1 min-w-0 h-full"
          initial={{ opacity: 0, x: 8 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -8 }}
          transition={{ duration: 0.15 }}
        >
          <ChatArea
            title={currentTitle}
            isChannel={activeView.type === "channel"}
            messages={currentMessages}
            onSendMessage={handleSendMessage}
            onAudioCall={() =>
              setCallState({ type: "audio", title: currentTitle })
            }
            onVideoCall={() =>
              setCallState({ type: "video", title: currentTitle })
            }
            rightPanelOpen={rightPanelOpen}
            onToggleRightPanel={() => setRightPanelOpen((v) => !v)}
          />
        </motion.div>
      </AnimatePresence>

      {/* Right Panel */}
      <AnimatePresence>
        {rightPanelOpen && (
          <motion.div
            key="right-panel"
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 256, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden shrink-0 h-full hidden lg:block"
          >
            <RightPanel
              title={rightPanelTitle}
              onClose={() => setRightPanelOpen(false)}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Call Modal */}
      <AnimatePresence>
        {callState && (
          <CallModal
            callType={callState.type}
            channelName={callState.title}
            onEnd={() => setCallState(null)}
          />
        )}
      </AnimatePresence>

      {/* New Channel Modal */}
      <NewChannelModal
        open={newChannelOpen}
        onClose={() => setNewChannelOpen(false)}
        onCreate={handleCreateChannel}
      />

      {/* New DM Modal */}
      <NewDMModal
        open={newDMOpen}
        onClose={() => setNewDMOpen(false)}
        onSelect={handleSelectDMUser}
      />

      {/* Footer branding - hidden but in DOM */}
      <footer className="sr-only">
        <a
          href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          © {new Date().getFullYear()}. Built with love using caffeine.ai
        </a>
      </footer>
    </div>
  );
}

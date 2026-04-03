import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Mic,
  MicOff,
  Monitor,
  PhoneOff,
  Users,
  Video,
  VideoOff,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

type CallType = "audio" | "video";

interface CallModalProps {
  callType: CallType;
  channelName: string;
  onEnd: () => void;
}

export function CallModal({ callType, channelName, onEnd }: CallModalProps) {
  const [muted, setMuted] = useState(false);
  const [videoOff, setVideoOff] = useState(callType === "audio");
  const [duration, setDuration] = useState(0);
  const [participants] = useState([
    { initials: "AC", color: "oklch(0.65 0.18 320)", name: "Alice Chen" },
    { initials: "BM", color: "oklch(0.65 0.18 160)", name: "Bob Martinez" },
    { initials: "ME", color: "oklch(0.58 0.18 255)", name: "You" },
  ]);

  useEffect(() => {
    const interval = setInterval(() => setDuration((d) => d + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  const formatDuration = (s: number) => {
    const m = Math.floor(s / 60)
      .toString()
      .padStart(2, "0");
    const sec = (s % 60).toString().padStart(2, "0");
    return `${m}:${sec}`;
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        data-ocid="call.modal"
      >
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
        <motion.div
          className="relative z-10 w-full max-w-2xl mx-4 rounded-2xl overflow-hidden shadow-modal"
          style={{
            background:
              "linear-gradient(135deg, oklch(0.14 0.065 260) 0%, oklch(0.20 0.08 255) 100%)",
          }}
          initial={{ scale: 0.95, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.95, y: 20 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          {/* Header */}
          <div className="px-8 pt-8 pb-4 text-center">
            <p
              className="text-sm font-medium"
              style={{ color: "oklch(0.72 0.025 255)" }}
            >
              {callType === "video" ? "Video Call" : "Audio Call"} · #
              {channelName}
            </p>
            <p
              className="text-2xl font-semibold mt-1"
              style={{ color: "oklch(0.96 0.012 255)" }}
            >
              {formatDuration(duration)}
            </p>
          </div>

          {/* Participants grid */}
          <div className="px-8 py-4">
            {callType === "video" ? (
              <div className="grid grid-cols-3 gap-3">
                {participants.map((p) => (
                  <div
                    key={p.initials}
                    className="aspect-video rounded-xl flex items-center justify-center"
                    style={{ background: "oklch(0.21 0.065 255)" }}
                  >
                    <div className="flex flex-col items-center gap-2">
                      <Avatar className="h-12 w-12">
                        <AvatarFallback
                          style={{ background: p.color, color: "white" }}
                          className="text-sm font-semibold"
                        >
                          {p.initials}
                        </AvatarFallback>
                      </Avatar>
                      <span
                        className="text-xs font-medium"
                        style={{ color: "oklch(0.82 0.015 255)" }}
                      >
                        {p.name}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex justify-center gap-6 py-6">
                {participants.map((p) => (
                  <div
                    key={p.initials}
                    className="flex flex-col items-center gap-2"
                  >
                    <div
                      className="w-16 h-16 rounded-full flex items-center justify-center text-lg font-semibold text-white shadow-lg"
                      style={{ background: p.color }}
                    >
                      {p.initials}
                    </div>
                    <span
                      className="text-xs font-medium"
                      style={{ color: "oklch(0.82 0.015 255)" }}
                    >
                      {p.name}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="px-8 pb-8 pt-2 flex items-center justify-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="h-12 w-12 rounded-full"
              style={{
                background: muted
                  ? "oklch(0.58 0.18 255)"
                  : "oklch(0.21 0.065 255)",
                color: "oklch(0.96 0.012 255)",
              }}
              onClick={() => setMuted(!muted)}
              data-ocid="call.toggle"
              aria-label={muted ? "Unmute" : "Mute"}
            >
              {muted ? (
                <MicOff className="h-5 w-5" />
              ) : (
                <Mic className="h-5 w-5" />
              )}
            </Button>

            {callType === "video" && (
              <Button
                variant="ghost"
                size="icon"
                className="h-12 w-12 rounded-full"
                style={{
                  background: videoOff
                    ? "oklch(0.58 0.18 255)"
                    : "oklch(0.21 0.065 255)",
                  color: "oklch(0.96 0.012 255)",
                }}
                onClick={() => setVideoOff(!videoOff)}
                aria-label={videoOff ? "Turn camera on" : "Turn camera off"}
              >
                {videoOff ? (
                  <VideoOff className="h-5 w-5" />
                ) : (
                  <Video className="h-5 w-5" />
                )}
              </Button>
            )}

            <Button
              variant="ghost"
              size="icon"
              className="h-12 w-12 rounded-full"
              style={{
                background: "oklch(0.21 0.065 255)",
                color: "oklch(0.96 0.012 255)",
              }}
              aria-label="Share screen"
            >
              <Monitor className="h-5 w-5" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="h-12 w-12 rounded-full"
              style={{
                background: "oklch(0.21 0.065 255)",
                color: "oklch(0.96 0.012 255)",
              }}
              aria-label="Participants"
            >
              <Users className="h-5 w-5" />
            </Button>

            <Button
              size="icon"
              className="h-12 w-12 rounded-full bg-destructive hover:bg-destructive/90 text-white"
              onClick={onEnd}
              data-ocid="call.confirm_button"
              aria-label="End call"
            >
              <PhoneOff className="h-5 w-5" />
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

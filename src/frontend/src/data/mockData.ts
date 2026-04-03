export type MockMessage = {
  id: string;
  sender: string;
  senderInitials: string;
  senderColor: string;
  content: string;
  timestamp: Date;
  isOwn: boolean;
};

export type MockChannel = {
  id: string;
  name: string;
  description: string;
  unread?: number;
};

export type MockUser = {
  id: string;
  name: string;
  initials: string;
  color: string;
  status: "online" | "away" | "offline";
};

export const MOCK_CHANNELS: MockChannel[] = [
  {
    id: "general",
    name: "general",
    description: "General discussion for the team",
  },
  {
    id: "random",
    name: "random",
    description: "Off-topic conversations",
    unread: 3,
  },
  {
    id: "announcements",
    name: "announcements",
    description: "Important team updates",
  },
  {
    id: "design",
    name: "design",
    description: "Design discussion and feedback",
  },
  {
    id: "engineering",
    name: "engineering",
    description: "Technical discussions",
  },
];

export const MOCK_USERS: MockUser[] = [
  {
    id: "alice",
    name: "Alice Chen",
    initials: "AC",
    color: "oklch(0.65 0.18 320)",
    status: "online",
  },
  {
    id: "bob",
    name: "Bob Martinez",
    initials: "BM",
    color: "oklch(0.65 0.18 160)",
    status: "online",
  },
  {
    id: "carol",
    name: "Carol White",
    initials: "CW",
    color: "oklch(0.65 0.18 40)",
    status: "away",
  },
  {
    id: "david",
    name: "David Kim",
    initials: "DK",
    color: "oklch(0.65 0.18 200)",
    status: "offline",
  },
];

const now = new Date();
const t = (minutesAgo: number) =>
  new Date(now.getTime() - minutesAgo * 60 * 1000);

export const MOCK_CHANNEL_MESSAGES: Record<string, MockMessage[]> = {
  general: [
    {
      id: "m1",
      sender: "Alice Chen",
      senderInitials: "AC",
      senderColor: "oklch(0.65 0.18 320)",
      content: "Good morning everyone! 👋 Ready for the weekly sync?",
      timestamp: t(45),
      isOwn: false,
    },
    {
      id: "m2",
      sender: "Bob Martinez",
      senderInitials: "BM",
      senderColor: "oklch(0.65 0.18 160)",
      content:
        "Morning! Yes, I've got my notes ready. We made a lot of progress on the new dashboard this week.",
      timestamp: t(43),
      isOwn: false,
    },
    {
      id: "m3",
      sender: "You",
      senderInitials: "ME",
      senderColor: "oklch(0.58 0.18 255)",
      content:
        "Same here! I finished the user profile redesign. Will share the Figma link shortly.",
      timestamp: t(40),
      isOwn: true,
    },
    {
      id: "m4",
      sender: "Carol White",
      senderInitials: "CW",
      senderColor: "oklch(0.65 0.18 40)",
      content:
        "Great! I also wrapped up the API integration for the notification system. We should be good to demo.",
      timestamp: t(35),
      isOwn: false,
    },
    {
      id: "m5",
      sender: "Alice Chen",
      senderInitials: "AC",
      senderColor: "oklch(0.65 0.18 320)",
      content:
        "Awesome work team! I'll set up the call in 10 minutes. Ping me if you have any issues joining.",
      timestamp: t(30),
      isOwn: false,
    },
    {
      id: "m6",
      sender: "You",
      senderInitials: "ME",
      senderColor: "oklch(0.58 0.18 255)",
      content:
        "Sounds good! Here's the Figma link: https://figma.com/file/meetflow-ui-v2",
      timestamp: t(28),
      isOwn: true,
    },
    {
      id: "m7",
      sender: "Bob Martinez",
      senderInitials: "BM",
      senderColor: "oklch(0.65 0.18 160)",
      content:
        "The new designs look fantastic! I love the dark sidebar. Very clean and professional.",
      timestamp: t(20),
      isOwn: false,
    },
    {
      id: "m8",
      sender: "You",
      senderInitials: "ME",
      senderColor: "oklch(0.58 0.18 255)",
      content:
        "Thanks! Took inspiration from some of the best collaboration tools out there. 😄",
      timestamp: t(15),
      isOwn: true,
    },
  ],
  random: [
    {
      id: "r1",
      sender: "David Kim",
      senderInitials: "DK",
      senderColor: "oklch(0.65 0.18 200)",
      content:
        "Anyone catch the game last night? That final quarter was insane! 🏀",
      timestamp: t(120),
      isOwn: false,
    },
    {
      id: "r2",
      sender: "Bob Martinez",
      senderInitials: "BM",
      senderColor: "oklch(0.65 0.18 160)",
      content: "I missed it but saw the highlights. Incredible buzzer beater!",
      timestamp: t(115),
      isOwn: false,
    },
    {
      id: "r3",
      sender: "You",
      senderInitials: "ME",
      senderColor: "oklch(0.58 0.18 255)",
      content:
        "Also missed it — was heads down on the project. But the score was wild!",
      timestamp: t(110),
      isOwn: true,
    },
  ],
  announcements: [
    {
      id: "a1",
      sender: "Alice Chen",
      senderInitials: "AC",
      senderColor: "oklch(0.65 0.18 320)",
      content:
        "📢 Team update: We're launching MeetFlow v2.0 next Friday! Please make sure all PRs are merged by Wednesday EOD.",
      timestamp: t(180),
      isOwn: false,
    },
    {
      id: "a2",
      sender: "Alice Chen",
      senderInitials: "AC",
      senderColor: "oklch(0.65 0.18 320)",
      content:
        "Also — we have a team lunch on Thursday at 12:30 PM. Details in the calendar invite!",
      timestamp: t(175),
      isOwn: false,
    },
  ],
  design: [
    {
      id: "d1",
      sender: "Carol White",
      senderInitials: "CW",
      senderColor: "oklch(0.65 0.18 40)",
      content:
        "Sharing the updated component library for review. All icons have been standardized to 24px.",
      timestamp: t(200),
      isOwn: false,
    },
  ],
  engineering: [
    {
      id: "e1",
      sender: "Bob Martinez",
      senderInitials: "BM",
      senderColor: "oklch(0.65 0.18 160)",
      content:
        "Heads up: deploying the auth service update at 3 PM today. Should be zero-downtime but FYI.",
      timestamp: t(90),
      isOwn: false,
    },
    {
      id: "e2",
      sender: "You",
      senderInitials: "ME",
      senderColor: "oklch(0.58 0.18 255)",
      content:
        "Got it, thanks for the heads up! I'll make sure to save my work before then.",
      timestamp: t(85),
      isOwn: true,
    },
  ],
};

export const MOCK_DM_MESSAGES: Record<string, MockMessage[]> = {
  alice: [
    {
      id: "dm1",
      sender: "Alice Chen",
      senderInitials: "AC",
      senderColor: "oklch(0.65 0.18 320)",
      content:
        "Hey! Do you have a moment to review my PR? It's the one for the dark mode toggle.",
      timestamp: t(60),
      isOwn: false,
    },
    {
      id: "dm2",
      sender: "You",
      senderInitials: "ME",
      senderColor: "oklch(0.58 0.18 255)",
      content:
        "Sure! Give me 5 minutes to finish what I'm working on and I'll take a look.",
      timestamp: t(58),
      isOwn: true,
    },
    {
      id: "dm3",
      sender: "Alice Chen",
      senderInitials: "AC",
      senderColor: "oklch(0.65 0.18 320)",
      content:
        "Perfect, no rush! I'll leave some comments in the PR description to guide you through the changes.",
      timestamp: t(55),
      isOwn: false,
    },
  ],
  bob: [
    {
      id: "dm4",
      sender: "Bob Martinez",
      senderInitials: "BM",
      senderColor: "oklch(0.65 0.18 160)",
      content:
        "Quick question — did you update the API docs after the endpoint changes?",
      timestamp: t(240),
      isOwn: false,
    },
    {
      id: "dm5",
      sender: "You",
      senderInitials: "ME",
      senderColor: "oklch(0.58 0.18 255)",
      content:
        "Ah yes, I did! Check the /docs folder in the repo. I updated them yesterday afternoon.",
      timestamp: t(238),
      isOwn: true,
    },
  ],
  carol: [
    {
      id: "dm6",
      sender: "Carol White",
      senderInitials: "CW",
      senderColor: "oklch(0.65 0.18 40)",
      content:
        "Hey are you free for a quick call about the notification design?",
      timestamp: t(300),
      isOwn: false,
    },
  ],
};

export function formatTimestamp(date: Date): string {
  const now = new Date();
  const isToday =
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear();
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  if (isToday) return `Today at ${hours}:${minutes}`;
  return `${date.toLocaleDateString()} at ${hours}:${minutes}`;
}

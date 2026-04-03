import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { MOCK_USERS, type MockUser } from "@/data/mockData";

interface NewDMModalProps {
  open: boolean;
  onClose: () => void;
  onSelect: (user: MockUser) => void;
}

export function NewDMModal({ open, onClose, onSelect }: NewDMModalProps) {
  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-sm" data-ocid="dm.dialog">
        <DialogHeader>
          <DialogTitle>Start a Direct Message</DialogTitle>
        </DialogHeader>
        <div className="space-y-1 py-2">
          {MOCK_USERS.map((user) => (
            <button
              type="button"
              key={user.id}
              onClick={() => {
                onSelect(user);
                onClose();
              }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-muted transition-colors text-left"
            >
              <div className="relative">
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
                        : "bg-muted-foreground/40"
                  }`}
                />
              </div>
              <div>
                <p className="text-sm font-medium">{user.name}</p>
                <p className="text-xs text-muted-foreground capitalize">
                  {user.status}
                </p>
              </div>
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}

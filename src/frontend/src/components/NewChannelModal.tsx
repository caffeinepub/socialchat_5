import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

interface NewChannelModalProps {
  open: boolean;
  onClose: () => void;
  onCreate: (name: string, description: string) => void;
}

export function NewChannelModal({
  open,
  onClose,
  onCreate,
}: NewChannelModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const handleCreate = () => {
    if (!name.trim()) return;
    onCreate(
      name.trim().toLowerCase().replace(/\s+/g, "-"),
      description.trim(),
    );
    setName("");
    setDescription("");
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-md" data-ocid="channel.dialog">
        <DialogHeader>
          <DialogTitle>Create a Channel</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label htmlFor="channel-name">Channel Name</Label>
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground text-sm">#</span>
              <Input
                id="channel-name"
                placeholder="e.g. marketing"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleCreate()}
                data-ocid="channel.input"
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="channel-desc">
              Description{" "}
              <span className="text-muted-foreground">(optional)</span>
            </Label>
            <Textarea
              id="channel-desc"
              placeholder="What's this channel about?"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              data-ocid="channel.textarea"
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
            data-ocid="channel.cancel_button"
          >
            Cancel
          </Button>
          <Button
            onClick={handleCreate}
            disabled={!name.trim()}
            data-ocid="channel.submit_button"
          >
            Create Channel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

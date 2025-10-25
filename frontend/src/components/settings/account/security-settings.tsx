import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Lock } from "lucide-react";

export function SecuritySettings() {
  return (
    <div className="p-6 border rounded-xl shadow-island bg-card">
      <div className="flex items-center gap-3 mb-6">
        <Lock className="size-5" />
        <h3 className="text-lg font-semibold">Security</h3>
      </div>
      <div className="space-y-6">
        <div>
          <Label className="mb-2 block">Current Password</Label>
          <Input type="password" placeholder="Enter current password" />
        </div>
        <div>
          <Label className="mb-2 block">New Password</Label>
          <Input type="password" placeholder="Enter new password" />
        </div>
        <div>
          <Label className="mb-2 block">Confirm Password</Label>
          <Input type="password" placeholder="Confirm new password" />
        </div>
        <div className="flex justify-end pt-4">
          <Button>Update Password</Button>
        </div>
      </div>
    </div>
  );
}

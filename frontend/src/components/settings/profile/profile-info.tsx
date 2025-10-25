import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Briefcase, Building2 } from "lucide-react";

const mockUser = {
  name: "Sarah Johnson",
  email: "sarah.johnson@company.com",
  role: "Contract Manager",
  department: "Legal & Compliance",
};

export function ProfileInfo() {
  return (
    <div className="p-6 border rounded-xl shadow-island bg-card">
      <h3 className="text-lg font-semibold mb-6">Profile Information</h3>
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <Label className="mb-2 block">Full Name</Label>
            <Input defaultValue={mockUser.name} />
          </div>
          <div>
            <Label className="mb-2 block">Email Address</Label>
            <Input defaultValue={mockUser.email} type="email" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <Label className="mb-2 block">Role</Label>
            <div className="flex items-center gap-2 px-3 py-2 border rounded-md bg-muted/50">
              <Briefcase className="size-4 text-muted-foreground" />
              <span>{mockUser.role}</span>
            </div>
          </div>
          <div>
            <Label className="mb-2 block">Department</Label>
            <div className="flex items-center gap-2 px-3 py-2 border rounded-md bg-muted/50">
              <Building2 className="size-4 text-muted-foreground" />
              <span>{mockUser.department}</span>
            </div>
          </div>
        </div>

        <div className="flex gap-3 justify-end pt-4">
          <Button variant="outline">Cancel</Button>
          <Button>Save Changes</Button>
        </div>
      </div>
    </div>
  );
}

import { Button } from "@/components/ui/button";
import { User2, Mail, Calendar } from "lucide-react";

const mockUser = {
  name: "Sarah Johnson",
  email: "sarah.johnson@company.com",
  role: "Contract Manager",
  joinedDate: "January 2024",
};

export function ProfileHeader() {
  return (
    <div className="p-6 border rounded-xl shadow-island bg-card">
      <div className="flex items-start gap-6">
        <div className="size-24 rounded-full bg-primary/10 flex items-center justify-center">
          <User2 className="size-12 text-primary" />
        </div>
        <div className="flex-1">
          <h2 className="text-2xl font-semibold">{mockUser.name}</h2>
          <p className="text-muted-foreground mt-1">{mockUser.role}</p>
          <div className="flex gap-4 mt-4 text-sm">
            <div className="flex items-center gap-2">
              <Mail className="size-4 text-muted-foreground" />
              <span className="text-muted-foreground">{mockUser.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="size-4 text-muted-foreground" />
              <span className="text-muted-foreground">
                Joined {mockUser.joinedDate}
              </span>
            </div>
          </div>
        </div>
        <Button variant="outline">Edit Profile</Button>
      </div>
    </div>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { useHeader } from "@/stores/header";
import { Tabs, TabContent, useTabs } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Bell, Palette, FileText, Users, ClipboardList } from "lucide-react";
import { SecuritySettings } from "@/components/settings/account/security-settings";
import { TwoFactorAuth } from "@/components/settings/account/two-factor-auth";
import { ThemeSelector } from "@/components/settings/preferences/theme-selector";

export const Route = createFileRoute("/(app)/settings")({
  component: RouteComponent,
});

const tabs = [
  { id: "account", label: "Account" },
  { id: "notifications", label: "Notifications" },
  { id: "preferences", label: "Preferences" },
  { id: "contracts", label: "Contract Defaults" },
  { id: "team", label: "Team" },
];

function RouteComponent() {
  useHeader("Settings");
  const { activeTab, setActiveTab } = useTabs({ tabs, defaultTab: "account" });

  return (
    <>
      <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab}>
        <TabContent value="account" activeTab={activeTab}>
          <div className="space-y-6">
            <SecuritySettings />
            <TwoFactorAuth />
          </div>
        </TabContent>

        <TabContent value="notifications" activeTab={activeTab}>
          <div className="space-y-6">
            <div className="p-6 border rounded-xl shadow-island bg-card">
              <div className="flex items-center gap-3 mb-6">
                <Bell className="size-5" />
                <h3 className="text-lg font-semibold">Email Notifications</h3>
              </div>
              <div className="space-y-4">
                {[
                  {
                    title: "Contract Updates",
                    description:
                      "Receive notifications when contracts are updated or require action",
                  },
                  {
                    title: "Policy Changes",
                    description:
                      "Get notified when policies are created or modified",
                  },
                  {
                    title: "Approval Requests",
                    description:
                      "Receive alerts for pending approvals and reviews",
                  },
                  {
                    title: "Weekly Summary",
                    description:
                      "Get a weekly digest of your contract activity",
                  },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="flex items-start justify-between p-4 border rounded-lg"
                  >
                    <div>
                      <div className="font-medium">{item.title}</div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {item.description}
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      defaultChecked
                      className="mt-1 size-4 cursor-pointer"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </TabContent>

        <TabContent value="preferences" activeTab={activeTab}>
          <div className="space-y-6">
            <div className="p-6 border rounded-xl shadow-island bg-card">
              <div className="flex items-center gap-3 mb-6">
                <Palette className="size-5" />
                <h3 className="text-lg font-semibold">Appearance & Display</h3>
              </div>
              <div className="space-y-6">
                <ThemeSelector />
                <div>
                  <Label className="mb-2 block">Language</Label>
                  <Select defaultValue="en">
                    <SelectTrigger className="md:min-w-64">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Spanish</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                      <SelectItem value="de">German</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="mb-2 block">Timezone</Label>
                  <Select defaultValue="utc">
                    <SelectTrigger className="md:min-w-64">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="utc">UTC</SelectItem>
                      <SelectItem value="est">Eastern Time (ET)</SelectItem>
                      <SelectItem value="pst">Pacific Time (PT)</SelectItem>
                      <SelectItem value="cet">Central European Time</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex justify-end pt-4">
                  <Button>Save Preferences</Button>
                </div>
              </div>
            </div>
          </div>
        </TabContent>

        <TabContent value="contracts" activeTab={activeTab}>
          <div className="space-y-6">
            <div className="p-6 border rounded-xl shadow-island bg-card">
              <div className="flex items-center gap-3 mb-6">
                <ClipboardList className="size-5" />
                <h3 className="text-lg font-semibold">Default Settings</h3>
              </div>
              <div className="space-y-6">
                <div>
                  <Label className="mb-2 block">Default Policy</Label>
                  <Select defaultValue="none">
                    <SelectTrigger className="md:min-w-64">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      <SelectItem value="pol-privacy-001">
                        Data Privacy Policy
                      </SelectItem>
                      <SelectItem value="pol-security-002">
                        Security Policy
                      </SelectItem>
                      <SelectItem value="pol-use-003">
                        Acceptable Use Policy
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="mb-2 block">
                    Default Approval Workflow
                  </Label>
                  <Select defaultValue="standard">
                    <SelectTrigger className="md:min-w-64">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="standard">Standard Review</SelectItem>
                      <SelectItem value="expedited">Expedited</SelectItem>
                      <SelectItem value="detailed">Detailed Review</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="mb-2 block">Retention Period (days)</Label>
                  <Input type="number" defaultValue="365" />
                </div>
                <div className="flex justify-end pt-4">
                  <Button>Save Defaults</Button>
                </div>
              </div>
            </div>
          </div>
        </TabContent>

        <TabContent value="team" activeTab={activeTab}>
          <div className="space-y-6">
            <div className="p-6 border rounded-xl shadow-island bg-card">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <Users className="size-5" />
                  <h3 className="text-lg font-semibold">Team Members</h3>
                </div>
                <Button>Invite Member</Button>
              </div>
              <div className="space-y-3">
                {[
                  {
                    name: "Sarah Johnson",
                    email: "sarah.johnson@company.com",
                    role: "Admin",
                  },
                  {
                    name: "Michael Chen",
                    email: "michael.chen@company.com",
                    role: "Editor",
                  },
                  {
                    name: "Emily Davis",
                    email: "emily.davis@company.com",
                    role: "Viewer",
                  },
                ].map((member, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div>
                      <div className="font-medium">{member.name}</div>
                      <p className="text-sm text-muted-foreground">
                        {member.email}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm px-3 py-1 rounded-full bg-primary/10 text-primary">
                        {member.role}
                      </span>
                      <Button variant="ghost" size="sm">
                        Edit
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </TabContent>
      </Tabs>
      <p className="text-sm text-muted-foreground mt-4 text-end">
        This is only a demo page.
      </p>
    </>
  );
}

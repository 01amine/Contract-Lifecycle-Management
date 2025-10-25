import { createFileRoute } from "@tanstack/react-router";
import { useHeader } from "@/stores/header";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  SettingsIcon,
  BellIcon,
  ShieldIcon,
  DatabaseIcon,
  UserIcon,
  SaveIcon,
  CheckCircleIcon,
} from "lucide-react";

export const Route = createFileRoute("/(app)/settings")({
  component: RouteComponent,
});

function RouteComponent() {
  useHeader("Settings");
  const [saved, setSaved] = useState(false);
  const [settings, setSettings] = useState({
    companyName: "Al Baraka Islamic Finance",
    email: "admin@albaraka.ae",
    language: "en",
    timezone: "Asia/Dubai",
    complianceThreshold: "75",
    autoReview: true,
    emailNotifications: true,
    shariahAudits: true,
    blockchainEnabled: true,
  });

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-4">
      {/* General Settings */}
      <div className="p-5 border rounded-xl shadow-island bg-card">
        <div className="flex items-center gap-2 mb-4">
          <SettingsIcon className="size-5 text-primary" />
          <h3 className="font-semibold text-lg">General Settings</h3>
        </div>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="companyName">Company Name</Label>
              <Input
                id="companyName"
                value={settings.companyName}
                onChange={(e) => setSettings({ ...settings, companyName: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="email">Admin Email</Label>
              <Input
                id="email"
                type="email"
                value={settings.email}
                onChange={(e) => setSettings({ ...settings, email: e.target.value })}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="language">Language</Label>
              <Select
                value={settings.language}
                onValueChange={(value) => setSettings({ ...settings, language: value })}
              >
                <SelectTrigger id="language">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="ar">العربية (Arabic)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="timezone">Timezone</Label>
              <Select
                value={settings.timezone}
                onValueChange={(value) => setSettings({ ...settings, timezone: value })}
              >
                <SelectTrigger id="timezone">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Asia/Dubai">Dubai (GMT+4)</SelectItem>
                  <SelectItem value="Asia/Riyadh">Riyadh (GMT+3)</SelectItem>
                  <SelectItem value="Asia/Kuwait">Kuwait (GMT+3)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      {/* Compliance Settings */}
      <div className="p-5 border rounded-xl shadow-island bg-card">
        <div className="flex items-center gap-2 mb-4">
          <ShieldIcon className="size-5 text-primary" />
          <h3 className="font-semibold text-lg">Compliance Settings</h3>
        </div>
        <div className="space-y-4">
          <div>
            <Label htmlFor="threshold">Minimum Compliance Threshold (%)</Label>
            <Select
              value={settings.complianceThreshold}
              onValueChange={(value) => setSettings({ ...settings, complianceThreshold: value })}
            >
              <SelectTrigger id="threshold">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="70">70% - Lenient</SelectItem>
                <SelectItem value="75">75% - Standard</SelectItem>
                <SelectItem value="85">85% - Strict</SelectItem>
                <SelectItem value="90">90% - Very Strict</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground mt-1">
              Contracts below this threshold will be flagged for review
            </p>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="shariahAudits"
              checked={settings.shariahAudits}
              onChange={(e) => setSettings({ ...settings, shariahAudits: e.target.checked })}
              className="size-4"
            />
            <Label htmlFor="shariahAudits" className="cursor-pointer">
              Enable automatic Shariah compliance audits
            </Label>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="autoReview"
              checked={settings.autoReview}
              onChange={(e) => setSettings({ ...settings, autoReview: e.target.checked })}
              className="size-4"
            />
            <Label htmlFor="autoReview" className="cursor-pointer">
              Auto-trigger AI review on contract upload
            </Label>
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="p-5 border rounded-xl shadow-island bg-card">
        <div className="flex items-center gap-2 mb-4">
          <BellIcon className="size-5 text-primary" />
          <h3 className="font-semibold text-lg">Notifications</h3>
        </div>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="emailNotif"
              checked={settings.emailNotifications}
              onChange={(e) => setSettings({ ...settings, emailNotifications: e.target.checked })}
              className="size-4"
            />
            <Label htmlFor="emailNotif" className="cursor-pointer">
              Email notifications for critical issues
            </Label>
          </div>
        </div>
      </div>

      {/* Blockchain */}
      <div className="p-5 border rounded-xl shadow-island bg-card">
        <div className="flex items-center gap-2 mb-4">
          <DatabaseIcon className="size-5 text-primary" />
          <h3 className="font-semibold text-lg">Blockchain Integration</h3>
        </div>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="blockchain"
              checked={settings.blockchainEnabled}
              onChange={(e) => setSettings({ ...settings, blockchainEnabled: e.target.checked })}
              className="size-4"
            />
            <Label htmlFor="blockchain" className="cursor-pointer">
              Enable Polygon blockchain verification
            </Label>
          </div>
          <p className="text-xs text-muted-foreground">
            Contracts will be automatically registered on Polygon network for immutable verification
          </p>
        </div>
      </div>

      {/* User Management */}
      <div className="p-5 border rounded-xl shadow-island bg-card">
        <div className="flex items-center gap-2 mb-4">
          <UserIcon className="size-5 text-primary" />
          <h3 className="font-semibold text-lg">User Management</h3>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div>
              <div className="font-medium text-sm">Ahmed Hassan</div>
              <div className="text-xs text-muted-foreground">Legal Team Lead</div>
            </div>
            <span className="text-xs bg-green-500/10 text-green-600 px-2 py-1 rounded">
              Active
            </span>
          </div>
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div>
              <div className="font-medium text-sm">Sarah Al-Mansoori</div>
              <div className="text-xs text-muted-foreground">Compliance Officer</div>
            </div>
            <span className="text-xs bg-green-500/10 text-green-600 px-2 py-1 rounded">
              Active
            </span>
          </div>
          <Button variant="outline" className="w-full">
            <UserIcon className="size-4 mr-2" />
            Add New User
          </Button>
        </div>
      </div>

      {/* Save Button */}
      <div className="sticky bottom-4">
        <Button onClick={handleSave} className="w-full" size="lg">
          {saved ? (
            <>
              <CheckCircleIcon className="size-4 mr-2" />
              Settings Saved!
            </>
          ) : (
            <>
              <SaveIcon className="size-4 mr-2" />
              Save Settings
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

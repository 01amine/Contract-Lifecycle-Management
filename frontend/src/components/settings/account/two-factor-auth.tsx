import { Button } from "@/components/ui/button";

export function TwoFactorAuth() {
  return (
    <div className="p-6 border rounded-xl shadow-island bg-card">
      <h3 className="text-lg font-semibold mb-2">Two-Factor Authentication</h3>
      <p className="text-sm text-muted-foreground mb-4">
        Add an extra layer of security to your account
      </p>
      <Button variant="outline">Enable 2FA</Button>
    </div>
  );
}

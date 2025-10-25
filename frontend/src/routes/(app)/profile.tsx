import { createFileRoute } from "@tanstack/react-router";
import { useHeader } from "@/stores/header";
import { ProfileHeader } from "@/components/settings/profile/profile-header";
import { ProfileStats } from "@/components/settings/profile/profile-stats";
import { ProfileInfo } from "@/components/settings/profile/profile-info";

export const Route = createFileRoute("/(app)/profile")({
  component: RouteComponent,
});

function RouteComponent() {
  useHeader("Your profile");

  return (
    <>
      <div className="space-y-6">
        <ProfileHeader />
        <ProfileStats />
        <ProfileInfo />
      </div>
      <p className="text-sm text-muted-foreground mt-4 text-end">
        This is only a demo page.
      </p>
    </>
  );
}

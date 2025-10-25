import { useHeader } from "@/stores/header";
import { createFileRoute } from "@tanstack/react-router";
import { Tabs, TabContent, useTabs } from "@/components/ui/tabs";
import { NewPolicyForm } from "@/components/policies/new-policy-form";
import { PoliciesList } from "@/components/policies/policies-list";
import { EditPolicyForm } from "@/components/policies/edit-policy-form";

export const Route = createFileRoute("/(app)/policies")({
  component: RouteComponent,
});

const tabs = [
  { id: "policies", label: "Policies" },
  { id: "new-policy", label: "New Policy" },
  { id: "edit-policy", label: "Edit Policy", hidden: true },
];

function RouteComponent() {
  useHeader("Update and manage your policies");
  const { activeTab, setActiveTab } = useTabs({ tabs, defaultTab: "policies" });
  const searchParams = new URLSearchParams(window.location.search);
  const policyId = searchParams.get("policyId") || "";

  return (
    <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab}>
      <TabContent value="policies" activeTab={activeTab}>
        <PoliciesList setActiveTab={setActiveTab} />
      </TabContent>
      <TabContent value="new-policy" activeTab={activeTab}>
        <NewPolicyForm />
      </TabContent>
      <TabContent value="edit-policy" activeTab={activeTab}>
        <EditPolicyForm policyId={policyId} setActiveTab={setActiveTab} />
      </TabContent>
    </Tabs>
  );
}

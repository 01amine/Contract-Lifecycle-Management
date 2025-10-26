import { Building2, Scale, FileText, Users, Check } from "lucide-react";
import { Tabs, TabContent } from "@/components/ui/tabs";
import { useState } from "react";

type UseCase = {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  benefits: string[];
};

function UseCases() {
  const useCases: UseCase[] = [
    {
      id: "finance",
      title: "Financial Institutions",
      description:
        "Streamline loan agreements, compliance checks, and regulatory documentation with AI-powered analysis.",
      icon: Building2,
      benefits: ["Faster contract reviews", "Automated compliance", "Risk detection"],
    },
    {
      id: "legal",
      title: "Legal Departments",
      description:
        "Manage contracts at scale with intelligent clause analysis, policy enforcement, and version control.",
      icon: Scale,
      benefits: ["Clause regeneration", "Policy management", "Audit trails"],
    },
    {
      id: "procurement",
      title: "Corporate Procurement",
      description:
        "Analyze vendor contracts, identify obligations, and ensure terms align with corporate policies.",
      icon: FileText,
      benefits: ["Vendor analysis", "Term extraction", "Cost tracking"],
    },
    {
      id: "government",
      title: "Government Entities",
      description:
        "Ensure transparency and security in public contracts with secure verification and bilingual support.",
      icon: Users,
      benefits: ["Immutable records", "Arabic/English", "Transparency"],
    },
  ];

  return (
    <div className="w-full bg-gray-50 py-20 px-4">
      <div className="max-w-7xl mx-auto flex flex-col items-center gap-12">
        <div className="text-center space-y-4 max-w-3xl">
          <h2 className="text-5xl font-extrabold">Built for Every Industry</h2>
          <p className="text-xl text-[#6B7280]">
            From financial institutions to government entities — our platform adapts to your needs
          </p>
        </div>

        {/* Tabs-driven storytelling layout */}
        <UseCaseTabs useCases={useCases} />
      </div>
    </div>
  );
}

export default UseCases;

// Sub-component: Tabs experience
function UseCaseTabs({ useCases }: { useCases: UseCase[] }) {
  const tabs = useCases.map((u) => ({ id: u.id, label: u.title }));
  const [activeTab, setActiveTab] = useState<string>(tabs[0]?.id || "");

  return (
    <div className="w-full">
      <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab}>
        <div className="bg-white/60 backdrop-blur-sm rounded-3xl border border-gray-200 p-6 md:p-10">
          {useCases.map((u) => (
            <TabContent key={u.id} value={u.id} activeTab={activeTab}>
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
                <div className="lg:col-span-4 flex lg:flex-col gap-4 items-center lg:items-start">
                  <div className="size-16 rounded-2xl bg-primary text-white flex items-center justify-center shadow-lg">
                    <u.icon size={28} />
                  </div>
                  <div>
                    <h3 className="text-3xl font-extrabold">{u.title}</h3>
                    <p className="text-[#6B7280] mt-2">{u.description}</p>
                  </div>
                </div>

                <div className="lg:col-span-8">
                  <div className="relative overflow-hidden rounded-2xl p-6 md:p-8 bg-linear-to-r from-primary/5 via-transparent to-transparent">
                    <h4 className="text-lg font-bold mb-4">Why it matters</h4>
                    <ul className="space-y-3">
                      {u.benefits.map((b, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <span className="mt-1 size-5 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                            <Check size={14} />
                          </span>
                          <span className="text-gray-700">{b}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </TabContent>
          ))}
        </div>
      </Tabs>
    </div>
  );
}

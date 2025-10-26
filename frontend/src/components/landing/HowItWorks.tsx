import { Upload, Sparkles, ShieldCheck, CheckCircle, type LucideIcon } from "lucide-react";

type Step = {
  title: string;
  description: string;
  icon: LucideIcon;
  stepNumber: number;
};

function HowItWorks() {
  const steps: Step[] = [
    {
      stepNumber: 1,
      title: "Upload Contract",
      description:
        "Upload PDF or DOCX contracts. Our OCR technology instantly extracts text and prepares it for AI analysis.",
      icon: Upload,
    },
    {
      stepNumber: 2,
      title: "AI Analysis",
      description:
        "AI extracts key data, identifies risks, checks policy compliance, and highlights missing clauses automatically.",
      icon: Sparkles,
    },
    {
      stepNumber: 3,
      title: "Secure Storage",
      description:
        "Contract hash is stored securely, creating an immutable record with version history and proof of authenticity.",
      icon: ShieldCheck,
    },
    {
      stepNumber: 4,
      title: "Review & Collaborate",
      description:
        "Use AI chat for Q&A, regenerate risky clauses, and manage approvals with complete audit trail and compliance tracking.",
      icon: CheckCircle,
    },
  ];

  return (
    <div className="w-full flex flex-col items-center justify-center gap-16 py-20 px-4">
      <div className="text-center space-y-4 max-w-3xl">
        <h2 className="text-5xl font-extrabold">How It Works</h2>
        <p className="text-xl text-[#6B7280]">
          From upload to approval in four simple steps — powered by advanced AI technology
        </p>
      </div>

      {/* Desktop: horizontal stepper */}
      <div className="hidden md:flex relative w-full max-w-7xl items-start justify-between">
        {/* connector line */}
        <div className="absolute left-0 right-0 top-8 h-[3px] bg-gray-200" />

        {steps.map((step) => (
          <div key={step.stepNumber} className="flex-1 flex flex-col items-center text-center px-2">
            <div className="relative">
              <div className="size-16 rounded-full bg-primary text-white flex items-center justify-center shadow-lg ring-8 ring-primary/10">
                <step.icon size={24} />
              </div>
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 text-xs font-bold text-primary">
                {step.stepNumber}
              </div>
            </div>
            <div className="mt-6 max-w-xs space-y-2">
              <h3 className="text-lg font-extrabold">{step.title}</h3>
              <p className="text-sm text-[#6B7280]">{step.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Mobile: vertical timeline */}
      <div className="md:hidden w-full max-w-2xl">
        <div className="relative">
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200" />
          <div className="space-y-10">
            {steps.map((step) => (
              <div key={step.stepNumber} className="relative pl-14">
                <div className="absolute left-0 top-1.5 size-8 rounded-full bg-primary text-white flex items-center justify-center shadow-md">
                  <step.icon size={16} />
                </div>
                <div className="space-y-1">
                  <div className="text-xs font-bold text-primary">Step {step.stepNumber}</div>
                  <h3 className="text-lg font-extrabold">{step.title}</h3>
                  <p className="text-sm text-[#6B7280]">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default HowItWorks;

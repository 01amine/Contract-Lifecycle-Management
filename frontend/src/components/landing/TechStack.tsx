import { Cpu, Database, Link2, Languages } from "lucide-react";

type Technology = {
  title: string;
  description: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  tags: string[];
};

function TechStack() {
  const technologies: Technology[] = [
    {
      title: "Advanced AI Models",
      description:
        "Powered by GPT-4 and specialized NLP models for contract analysis, clause extraction, and intelligent Q&A.",
      icon: Cpu,
      tags: ["GPT-4", "NLP", "RAG"],
    },
    {
      title: "Vector Database",
      description:
        "FAISS-powered semantic search enabling natural language queries across contract documents in real-time.",
      icon: Database,
      tags: ["FAISS", "Embeddings", "Search"],
    },
    {
      title: "Multilingual NLP",
      description:
        "Native support for English and Arabic with specialized models for accurate translation and analysis.",
      icon: Languages,
      tags: ["Arabic", "English", "i18n"],
    },
    {
      title: "Secure Infrastructure",
      description:
        "Enterprise-grade security with immutable hash storage, version control, and transparent audit trails.",
      icon: Link2,
      tags: ["Encryption", "Audit Trail", "Compliance"],
    },
  ];

  return (
    <div className="w-full py-20 px-4">
      <div className="max-w-7xl mx-auto flex flex-col items-center gap-16">
        <div className="text-center space-y-4 max-w-3xl">
          <h2 className="text-5xl font-extrabold">
            Enterprise-Grade <span className="text-primary">Technology</span>
          </h2>
          <p className="text-xl text-[#6B7280]">
            Built on cutting-edge AI technology for security, accuracy, and scale
          </p>
        </div>

        <div className="w-full max-w-5xl mx-auto">
          <ul className="divide-y divide-gray-200 rounded-2xl border border-gray-200 overflow-hidden bg-white/60 backdrop-blur-sm">
            {technologies.map((tech, index) => (
              <li key={index} className="p-6 md:p-8">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                  <div className="md:col-span-2 flex items-center gap-4">
                    <div className="size-12 rounded-xl bg-primary text-white flex items-center justify-center shadow-md">
                      <tech.icon size={22} />
                    </div>
                    <h3 className="text-xl font-extrabold md:hidden">{tech.title}</h3>
                  </div>
                  <div className="md:col-span-7">
                    <h3 className="text-xl font-extrabold hidden md:block">{tech.title}</h3>
                    <p className="text-sm text-[#6B7280] mt-2 leading-relaxed">{tech.description}</p>
                  </div>
                  <div className="md:col-span-3 flex flex-wrap gap-2 md:justify-end">
                    {tech.tags.map((tag, i) => (
                      <span
                        key={i}
                        className="bg-primary/10 text-primary px-2.5 py-1 rounded-md text-xs font-semibold"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default TechStack;

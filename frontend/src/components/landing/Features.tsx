import { Home, type LucideIcon } from "lucide-react";

type Feature = {
  title: string;
  description: string;
  icon: LucideIcon;
};

function Features() {
  const features: Feature[] = [
    {
      title: "financial products",
      description:
        "Create Islamic financial products in minutes, not months. Our AI-powered platform guides you through every step of the process.",
      icon: Home,
    },
    {
      title: "financial products",
      description:
        "Create Islamic financial products in minutes, not months. Our AI-powered platform guides you through every step of the process.",
      icon: Home,
    },
    {
      title: "financial products",
      description:
        "Create Islamic financial products in minutes, not months. Our AI-powered platform guides you through every step of the process.",
      icon: Home,
    },
    {
      title: "financial products",
      description:
        "Create Islamic financial products in minutes, not months. Our AI-powered platform guides you through every step of the process.",
      icon: Home,
    },
  ];

  return (
    <div className="w-full flex flex-col items-center justify-center gap-24 relative pb-20">
      <img src="hero-right-icon.svg" className="absolute right-0 top-0" />
      <img src="hero-left-icon.svg" className="absolute left-0 top-0" />
      <div className="relative border border-solid border-gray-300 size-[360px] rounded-full flex items-center justify-center">
        <div className="bg-[#A9A9A9]/15 size-[250px] rounded-full flex items-center justify-center shadow-[120px_120px_100px_0_rgba(0,0,0,0.2)] border border-solid border-gray-300">
          <img src="logo-square.svg" className="size-[190px]" />
        </div>
      </div>
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-8 md:gap-10">
        {features.map((feature) => {
          return (
            <div className="max-w-[280px] bg-gray-100 border border-solid border-gray-200 px-3 pb-2 pt-10 rounded-xl flex flex-col items-center gap-3 relative">
              <div className="absolute top-0 left-1/2 -translate-1/2 size-[60px] bg-primary flex items-center justify-center rounded-xl">
                <feature.icon className="text-white" />
              </div>
              <h1 className="text-2xl font-extrabold">{feature.title}</h1>
              <p className="text-[10px] text-[#6B7280] text-center max-w-2/3">
                {feature.description}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Features;

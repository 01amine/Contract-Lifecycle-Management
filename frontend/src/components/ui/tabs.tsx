import { cn } from "@/lib/utils";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";

interface Tab {
  id: string;
  label: string;
  hidden?: boolean;
}

interface UseTabsOptions {
  tabs: Tab[];
  searchParam?: string;
  defaultTab?: string;
}

export function useTabs({
  tabs,
  searchParam = "tab",
  defaultTab,
}: UseTabsOptions) {
  const navigate = useNavigate();
  const search = (useSearch as any)({ strict: false, select: (s: any) => s });
  const activeTab =
    (search?.[searchParam] as string) || defaultTab || tabs[0]?.id;

  const setActiveTab = (
    tabId: string,
    additionalSearch?: Record<string, any>
  ) => {
    (navigate as any)({
      search: (prev: any) => ({
        ...prev,
        [searchParam]: tabId,
        ...(additionalSearch || {}),
      }),
    });
  };

  return {
    activeTab,
    setActiveTab,
  };
}

interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  children: React.ReactNode;
}

export function Tabs({ tabs, activeTab, onTabChange, children }: TabsProps) {
  return (
    <div>
      <div className="border-b mb-3 flex text-sm border-muted-foreground/40 -mt-2">
        {tabs.map(
          (tab, index) =>
            !(tab.hidden && tab.id !== activeTab) && (
              <button
                key={index}
                className={cn(
                  "px-6 py-2 text-muted-foreground hover:bg-linear-to-t to-transparent from-50% from-card/50 border-b-2 border-transparent transition-all hover:text-foreground/60 duration-300",
                  activeTab === tab.id &&
                    "text-foreground hover:text-foreground border-primary font-medium"
                )}
                onClick={() => onTabChange(tab.id)}
              >
                {tab.label}
              </button>
            )
        )}
      </div>
      {children}
    </div>
  );
}

interface TabContentProps {
  value: string;
  activeTab: string;
  children: React.ReactNode;
}

export function TabContent({ value, activeTab, children }: TabContentProps) {
  return (
    <div className="overflow-hidden">
      <AnimatePresence mode="popLayout">
        {value === activeTab && (
          <motion.div
            key={value}
            initial={{ opacity: 0, x: 600 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -600 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

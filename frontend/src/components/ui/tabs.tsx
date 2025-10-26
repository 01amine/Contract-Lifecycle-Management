import { cn } from "@/lib/utils";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef } from "react";

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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const search = (useSearch as any)({
    strict: false,
    select: (s: Record<string, unknown>) => s,
  });
  const activeTab =
    (search?.[searchParam] as string) || defaultTab || tabs[0]?.id;

  const setActiveTab = (
    tabId: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    additionalSearch?: Record<string, any>
  ) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (navigate as any)({
      search: (prev: Record<string, unknown>) => ({
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
                  "px-6 py-2 text-muted-foreground hover:bg-linear-to-t to-transparent from-50% from-card/50 border-b-2 border-transparent transition-all hover:text-foreground/60 duration-300 font-medium",
                  activeTab === tab.id &&
                    "text-foreground hover:text-foreground border-primary"
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
  const hasChangedRef = useRef(false);
  const prevActiveTabRef = useRef(activeTab);

  useEffect(() => {
    if (prevActiveTabRef.current !== activeTab) {
      hasChangedRef.current = true;
      prevActiveTabRef.current = activeTab;
    }
  }, [activeTab]);

  return (
    <div className="overflow-x-hidden overflow-y-visible">
      <AnimatePresence mode="popLayout">
        {value === activeTab && (
          <motion.div
            key={value}
            initial={hasChangedRef.current ? { opacity: 0, x: 600 } : false}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -600 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

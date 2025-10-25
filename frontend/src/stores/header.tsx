import { useEffect, useRef } from "react";
import { create } from "zustand";

export type Title =
  | {
      type: "text";
      text: string;
      icon?: React.ReactNode;
    }
  | {
      type: "back";
      back: string;
      backPath: string;
    };

interface HeaderStore {
  title: Title | null;
  setterId: string;
  setTitle: (title: Title | null, setterId: string) => void;
}

export const useHeaderStore = create<HeaderStore>((set) => ({
  title: null,
  setterId: "",
  setTitle: (title, setterId) => set({ title, setterId }),
}));

export const useHeader = (title: Title | string) => {
  const { setTitle, setterId } = useHeaderStore();
  const setterIdRef = useRef(Math.random().toString(36).substring(2, 15));

  useEffect(() => {
    if (typeof title === "string") {
      setTitle({ type: "text", text: title }, setterIdRef.current);
    } else {
      setTitle(title, setterIdRef.current);
    }
    return () => {
      // if the component is unmounted we only want to reset if its still relevant
      if (setterIdRef.current === setterId) {
        setTitle(null, "");
      }
    };
  }, [title, setterId]);
};

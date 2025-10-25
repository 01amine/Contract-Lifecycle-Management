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

interface HeaderEntry {
  id: string;
  title: Title;
}

interface HeaderStore {
  layers: Record<number, HeaderEntry>;
  setLayer: (layer: number, id: string, title: Title) => void;
  removeLayer: (layer: number, id: string) => void;
}

export const useHeaderStore = create<HeaderStore>((set) => ({
  layers: {},
  setLayer: (layer, id, title) =>
    set((state) => ({
      layers: { ...state.layers, [layer]: { id, title } },
    })),
  removeLayer: (layer, id) =>
    set((state) => {
      // Only remove if the ID matches (prevents removing a layer that was overwritten)
      if (state.layers[layer]?.id === id) {
        const { [layer]: _, ...rest } = state.layers;
        return { layers: rest };
      }
      return state;
    }),
}));

export const useHeader = (title: Title | string, layer: number = 0) => {
  const { setLayer, removeLayer } = useHeaderStore();
  const idRef = useRef(Math.random().toString(36).substring(2, 15));

  useEffect(() => {
    const normalizedTitle: Title =
      typeof title === "string" ? { type: "text", text: title } : title;

    // Set or update the layer
    setLayer(layer, idRef.current, normalizedTitle);

    return () => {
      // Cleanup: remove this layer entry
      removeLayer(layer, idRef.current);
    };
  }, [title, layer, setLayer, removeLayer]);
};

// Helper hook to get the current active header (highest layer number)
export const useCurrentHeader = () => {
  const layers = useHeaderStore((state) => state.layers);
  const layerNumbers = Object.keys(layers).map(Number);

  if (layerNumbers.length === 0) return null;

  const maxLayer = Math.max(...layerNumbers);
  return layers[maxLayer].title;
};

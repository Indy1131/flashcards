import { createContext } from "react";
import type { WindowTypes } from "../../decks/utilities";

type DeckContextType = {
  windowHidden: boolean;
  hideWindow: () => void;
  showWindow: (data: WindowTypes) => void;
  windowData: WindowTypes;
};

export const DeckContext = createContext<DeckContextType | null>(null);

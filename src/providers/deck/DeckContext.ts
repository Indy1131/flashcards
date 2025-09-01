import { createContext } from "react";
import type {
  DeckWindow,
  SelectionWindow,
  WindowTypes,
} from "../../decks/utilities";

type DeckContextType = {
  windowHidden: boolean;
  hideWindow: () => void;
  showWindow: (data: WindowTypes) => void;
  deckData: DeckWindow;
  selectionData: SelectionWindow;
  current: string | null;
};

export const DeckContext = createContext<DeckContextType | null>(null);

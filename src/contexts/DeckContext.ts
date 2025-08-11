import { createContext } from "react";
import type { CardModes, WindowTypes } from "../decks/utilities";

type DeckContextType = {
  resetDeck: (top: number) => boolean;
  shuffleDeck: (top: number) => number;
  setCardCompleted: (number: number, value: boolean) => void;
  setCardStatus: (number: number, value: string) => void;
  setCardFormData: (
    number: number,
    key: CardModes,
    value: string
  ) => void;
  switchDeck: (newDeck: string[], top: number) => boolean;
  filterDeck: (options: Set<string>, top: number) => boolean;
  flipDeck: () => void;
  filterDeckModes: (options: Set<string>, top: number) => boolean;
  windowHidden: boolean;
  hideWindow: () => void;
  showWindow: (data: WindowTypes) => void;
  windowData: WindowTypes;
};

export const DeckContext = createContext<DeckContextType | null>(null);

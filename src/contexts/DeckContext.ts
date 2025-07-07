import { createContext } from "react";

type DeckContextType = {
  resetDeck: (top: number) => boolean;
  shuffleDeck: (top: number) => number;
  setCardCompleted: (number: number, value: boolean) => void;
  setCardStatus: (number: number, value: string) => void;
  setCardFormData: (
    number: number,
    key: "pinyin" | "definition",
    value: string
  ) => void;
  switchDeck: (newDeck: string[], top: number) => boolean;
  filterDeck: (options: Set<string>, top: number) => boolean;
  flipDeck: () => void;
  filterDeckModes: (options: Set<string>, top: number) => boolean;
};

export const DeckContext = createContext<DeckContextType | null>(null);

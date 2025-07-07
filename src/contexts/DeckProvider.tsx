import { type ReactNode } from "react";
import { DeckContext } from "./DeckContext";

type DeckProviderProps = {
  children: ReactNode;
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

export function DeckProvider({
  children,
  resetDeck,
  shuffleDeck,
  setCardCompleted,
  setCardStatus,
  setCardFormData,
  switchDeck,
  filterDeck,
  flipDeck,
  filterDeckModes,
}: DeckProviderProps) {
  return (
    <DeckContext.Provider
      value={{
        resetDeck,
        shuffleDeck,
        setCardCompleted,
        setCardStatus,
        setCardFormData,
        switchDeck,
        filterDeck,
        flipDeck,
        filterDeckModes,
      }}
    >
      {children}
    </DeckContext.Provider>
  );
}

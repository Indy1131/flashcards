import { useState, type ReactNode } from "react";
import { DeckContext } from "./DeckContext";
import type { CardModes, WindowTypes } from "../decks/utilities";

type DeckProviderProps = {
  children: ReactNode;
  resetDeck: (top: number) => boolean;
  shuffleDeck: (top: number) => number;
  setCardCompleted: (number: number, value: boolean) => void;
  setCardStatus: (number: number, value: string) => void;
  setCardFormData: (number: number, key: CardModes, value: string) => void;
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
  const [windowHidden, setWindowHidden] = useState(true);
  const [windowData, setWindowData] = useState<WindowTypes>(null);

  function hideWindow() {
    setWindowHidden(true);
  }

  function showWindow(data: WindowTypes) {
    setWindowHidden(false);
    setWindowData(data);
  }

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
        windowHidden,
        hideWindow,
        showWindow,
        windowData,
      }}
    >
      {children}
    </DeckContext.Provider>
  );
}

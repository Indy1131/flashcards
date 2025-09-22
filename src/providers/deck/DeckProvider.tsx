import { useState, type ReactNode } from "react";
import { DeckContext } from "./DeckContext";
import type {
  DeckWindow,
  SelectionWindow,
  WindowTypes,
} from "../../decks/utilities";

type DeckProviderProps = {
  children: ReactNode;
};

export function DeckProvider({ children }: DeckProviderProps) {
  const [windowHidden, setWindowHidden] = useState(true);
  const [deckData, setDeckData] = useState<DeckWindow>({
    type: "deck",
    deckIds: [],
  });
  const [selectionData, setSelectionData] = useState<SelectionWindow>({
    type: "selection",
    parent: null,
  });
  const [current, setCurrent] = useState<"deck" | "selection" | null>("deck");

  function hideWindow() {
    setCurrent(null);
    setWindowHidden(true);
  }

  function showWindow(data: WindowTypes) {
    setWindowHidden(false);
    setCurrent(data.type);

    if (data.type == "deck") {
      if (data.deckIds) {
        setDeckData(data);
      }
    } else {
      if (data.parent) {
        setSelectionData(data);
      }
    }
  }

  return (
    <DeckContext.Provider
      value={{
        windowHidden,
        hideWindow,
        showWindow,
        deckData,
        selectionData,
        current,
      }}
    >
      {children}
    </DeckContext.Provider>
  );
}

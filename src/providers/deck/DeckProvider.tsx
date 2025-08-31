import { useState, type ReactNode } from "react";
import { DeckContext } from "./DeckContext";
import type { WindowTypes } from "../../decks/utilities";

type DeckProviderProps = {
  children: ReactNode;
};

export function DeckProvider({ children }: DeckProviderProps) {
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

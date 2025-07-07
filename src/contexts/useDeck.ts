import { useContext } from "react";
import { DeckContext } from "./DeckContext";

export function useDeck() {
  const context = useContext(DeckContext);
  if (!context) {
    throw new Error("no context");
  }

  return context;
}

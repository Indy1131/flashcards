import { useContext } from "react";
import { PopupContext } from "./PopupContext";

export function usePopup() {
  const ctx = useContext(PopupContext);
  if (!ctx) throw new Error("usePopup must be used within a PopupProvider");
  return ctx;
}

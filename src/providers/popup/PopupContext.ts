import { createContext } from "react";

export type PopupOptions = {
  title: string;
  description: string;
  acceptText?: string;
  declineText?: string;
  onAccept?: () => void;
  onDecline?: () => void;
};

export type PopupContextType = {
  showPopup: (options: PopupOptions) => void;
  hidePopup: () => void;
};

export const PopupContext = createContext<PopupContextType | undefined>(
  undefined
);

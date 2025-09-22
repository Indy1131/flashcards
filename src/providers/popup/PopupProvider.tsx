import { useState } from "react";
import { createPortal } from "react-dom";
import { PopupContext, type PopupOptions } from "./PopupContext";
import { icons } from "../../components/icons";

const TRANSITION_DURATION = 200; // ms

export function PopupProvider({ children }: { children: React.ReactNode }) {
  const [popup, setPopup] = useState<PopupOptions | null>(null);
  const [isClosing, setIsClosing] = useState(false);

  function showPopup(options: PopupOptions) {
    setPopup(options);
    setIsClosing(false);
  }

  function hidePopup() {
    setIsClosing(true);
    setTimeout(() => {
      setPopup(null);
      setIsClosing(false);
    }, TRANSITION_DURATION);
  }

  const visible = !!popup && !isClosing;
  const closing = !!popup && isClosing;

  return (
    <PopupContext.Provider value={{ showPopup, hidePopup }}>
      {children}
      {popup &&
        createPortal(
          <div
            className={`fixed select-none top-0 left-0 w-screen h-screen z-[999] flex items-center justify-center backdrop-blur-xs transition-opacity duration-200 ${
              visible
                ? "opacity-100 pointer-events-auto"
                : closing
                ? "opacity-0 pointer-events-none"
                : "invisible opacity-0 pointer-events-none"
            }`}
            onClick={() => {
              popup.onDecline?.();
              hidePopup();
            }}
          >
            <div
              className="bg-gradient-to-t text-blue-500 from-blue-100 to-white rounded-lg shadow-xl p-6 min-w-[300px] max-w-[500px] border-1 border-blue-500 flex flex-col items-center"
              style={{
                boxShadow: "0px 15px 15px 1px #3B82F6",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-xl font-bold mb-2">
                <img
                  src={icons.warning}
                  alt="Warning"
                  className="inline-block mr-2 h-[1.6rem] w-[1.6rem] align-middle"
                />
                {popup.title}
              </h2>
              <p className="mb-6 text-center">{popup.description}</p>
              <div className="flex gap-2 w-full">
                <button
                  className="bg-gradient-to-l from-blue-500 to-blue-400 text-white px-4 py-2 rounded-md cursor-pointer flex-1"
                  onClick={() => {
                    popup.onAccept?.();
                    hidePopup();
                  }}
                >
                  {popup.acceptText || "Accept"}
                </button>
                <button
                  className="border-2 px-4 py-2 rounded-md cursor-pointer flex-1"
                  onClick={() => {
                    popup.onDecline?.();
                    hidePopup();
                  }}
                >
                  {popup.declineText || "Cancel"}
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </PopupContext.Provider>
  );
}

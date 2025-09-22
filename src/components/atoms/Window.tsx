import { useDeck } from "../../providers/deck/useDeck";
import DeckWindow from "../windows/DeckWindow";
import Flashlight from "./Flashlight";
import SelectWindow from "../windows/SelectWindow";
import { icons } from "../icons";
import { useState } from "react";

type WindowProps = {
  changeDecks: (newIds: string[], special: boolean) => void;
  refreshDeck: (newCurrent?: string[]) => void;
  viewedIds: string[];
};

export default function Window({
  changeDecks,
  refreshDeck,
  viewedIds,
}: WindowProps) {
  const { windowHidden, hideWindow, deckData, selectionData, current } =
    useDeck();
  const [isClosing, setIsClosing] = useState(false);

  function handlePaddingClick(e: React.MouseEvent<HTMLDivElement>) {
    if (e.target === e.currentTarget) {
      setIsClosing(true);
      setTimeout(() => {
        hideWindow();
        setIsClosing(false);
      }, 200);
    }
  }

  function handleCloseClick() {
    setIsClosing(true);
    setTimeout(() => {
      hideWindow();
      setIsClosing(false);
    }, 200);
  }

  const visible = !windowHidden && !isClosing;
  const closing = isClosing;

  return (
    <div
      className={`top-0 overflow-hidden fixed w-screen h-screen flex justify-center items-center p-8 pb-10 backdrop-blur-xs z-200 transition-opacity duration-200 ${
        visible
          ? "visible opacity-100 pointer-events-auto"
          : closing
          ? "visible opacity-0 pointer-events-none"
          : "invisible opacity-0 pointer-events-none"
      }`}
      onMouseDown={handlePaddingClick}
    >
      <Flashlight
        className="w-full max-w-[1920px] h-full relative bg-blue-100 border-blue-500 border-1 rounded-xl"
        lightClassName="rounded-xl "
        style={{
          boxShadow: "0px 15px 15px 1px #3B82F6",
        }}
        percent={80}
      >
        <div className="absolute w-full h-full text-blue-500 flex flex-col">
          <button className="h-[1.5rem] m-2 w-[1.3rem] pointer-events-auto cursor-pointer z-20">
            <img
              className="cursor-pointer h-[1.3rem] w-[1.3rem] transition-[height] active:h-[1rem]"
              onClick={handleCloseClick}
              src={icons.close}
              alt="Logo"
            />
          </button>
          <div
            className={`transition-all absolute w-full h-full p-4 pt-10 flex flex-col ${
              current == "deck"
                ? "opacity-100 z-10"
                : "opacity-0 pointer-events-none z-[-1]"
            }`}
          >
            <DeckWindow
              deckIds={deckData.deckIds}
              viewedIds={viewedIds}
              refreshDeck={refreshDeck}
            />
          </div>
          <div
            className={`transition-all absolute w-full h-full p-4 pt-10 flex flex-col ${
              current == "selection"
                ? "opacity-100 z-10"
                : "opacity-0 pointer-events-none z-[-1]"
            }`}
          >
            <SelectWindow
              changeDecks={changeDecks}
              parentProp={selectionData.parent}
              viewedIds={viewedIds}
              refreshDeck={refreshDeck}
            />
          </div>
        </div>
      </Flashlight>
    </div>
  );
}

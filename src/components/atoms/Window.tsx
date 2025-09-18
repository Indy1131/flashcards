import { useDeck } from "../../providers/deck/useDeck";
import DeckWindow from "../windows/DeckWindow";
import Flashlight from "./Flashlight";
import SelectWindow from "../windows/SelectWindow";
import { icons } from "../icons";

type WindowProps = {
  changeDecks: (newIds: string[], special: boolean) => void;
  refreshDeck: () => void;
  viewedIds: string[];
};

export default function Window({
  changeDecks,
  refreshDeck,
  viewedIds,
}: WindowProps) {
  const { windowHidden, hideWindow, deckData, selectionData, current } =
    useDeck();

  function handlePaddingClick(e: React.MouseEvent<HTMLDivElement>) {
    if (e.target === e.currentTarget) {
      hideWindow();
    }
  }

  function handleCloseClick() {
    hideWindow();
  }

  return (
    <div
      className={`top-0 overflow-hidden fixed w-screen h-screen flex justify-center items-center p-8 pb-10 backdrop-blur-xs z-200 transition-opacity ${
        windowHidden ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
      onClick={handlePaddingClick}
    >
      <Flashlight
        className="w-full max-w-[1400px] h-full relative bg-blue-100 border-blue-500 border-1 rounded-xl"
        lightClassName="rounded-xl "
        style={{
          boxShadow: "0px 15px 15px 1px #3B82F6",
        }}
        percent={70}
      >
        <div className="absolute w-full h-full text-blue-500 flex flex-col">
          <button className="rounded-md h-[1.5rem] m-2">
            <img
              className="cursor-pointer h-[1.3rem] w-[1.3rem] transition-[height] active:h-[1rem]"
              onClick={handleCloseClick}
              src={icons.close}
              alt="Logo"
            />
          </button>
          <div
            className={`transition-all absolute w-full h-full p-2 pt-8 flex flex-col ${
              current == "deck"
                ? "opacity-100"
                : "opacity-0 pointer-events-none"
            }`}
          >
            <DeckWindow
              deckIds={deckData.deckIds}
              viewedIds={viewedIds}
              refreshDeck={refreshDeck}
            />
          </div>
          <div
            className={`transition-all absolute w-full h-full p-2 pt-8 ${
              current == "selection"
                ? "opacity-100"
                : "opacity-0 pointer-events-none"
            }`}
          >
            <SelectWindow
              changeDecks={changeDecks}
              parentProp={selectionData.parent}
            />
          </div>
        </div>
      </Flashlight>
    </div>
  );
}

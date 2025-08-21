import { useDeck } from "../../providers/useDeck";
import { seeDecks } from "../../decks/utilities";
import DeckWindow from "../windows/DeckWindow";
import Flashlight from "./Flashlight";
import SelectWindow from "../windows/SelectWindow";

export default function Window() {
  const { windowHidden, hideWindow, windowData } = useDeck();

  function handlePaddingClick(e: React.MouseEvent<HTMLDivElement>) {
    if (e.target === e.currentTarget) {
      hideWindow();
    }
  }

  function handleCloseClick() {
    hideWindow();
  }

  let content;

  if (windowData) {
    switch (windowData.type) {
      case "deck":
        content = <DeckWindow decks={seeDecks(windowData.deckNames)} />;
        break;
      case "selection":
        content = <SelectWindow />;
        break;
    }
  }

  return (
    <div
      className={`overflow-hidden absolute w-full h-full flex justify-center items-center p-8 pb-10 backdrop-blur-xs z-200 transition-opacity ${
        windowHidden ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
      onClick={handlePaddingClick}
    >
      <Flashlight
        className="w-full h-full relative  bg-blue-100 border-blue-500 border-1 rounded-xl"
        lightClassName="rounded-xl "
        style={{
          boxShadow: "0px 15px 15px 1px #3B82F6",
        }}
        percent={70}
      >
        <div className="absolute px-2 pt-2 w-full h-full text-blue-500 flex flex-col">
          <button className="rounded-md h-[1.5rem]">
            <img
              className="cursor-pointer h-[1.3rem] w-[1.3rem] transition-[height] active:h-[1rem]"
              onClick={handleCloseClick}
              src="/close.svg"
              alt="Logo"
            />
          </button>
          {content}
        </div>
      </Flashlight>
    </div>
  );
}

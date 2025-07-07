import { useCallback, useEffect, useRef, useState } from "react";
import Card from "./Card";
import { type CardData } from "../decks/utilities";
import { decks } from "../decks/generatedDecks";
import Chip from "./Chip";
import { useDeck } from "../contexts/useDeck";
import Dropdown from "./Dropdown";
import CheckboxInput from "./CheckboxInput";

type Props = {
  data: CardData[];
};

function back(top: number, cards: CardData[]): number {
  return (top - 1 + cards.length) % cards.length;
}

function forward(top: number, cards: CardData[]): number {
  return (top + 1) % cards.length;
}

export default function Deck({ data }: Props) {
  const [oldCard, setOldCard] = useState<CardData | null>(null);
  const [top, setTop] = useState(0);
  const [transitioning, setTransitioning] = useState<string | null>(null);
  const [dropdown, setDropdown] = useState<string | null>(null);

  const {
    resetDeck,
    shuffleDeck,
    setCardCompleted,
    filterDeck,
    flipDeck,
    switchDeck,
    filterDeckModes,
  } = useDeck();

  const progressRef = useRef<HTMLDivElement>(null);

  const jumpForward = useCallback(
    (next: number) => {
      if (transitioning !== null) return;
      progressRef.current?.children[next + 1].scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest",
      });
      setTransitioning("forward");
      setOldCard({ ...data[top], number: top });
      setTop(next);
      setTimeout(() => {
        setTransitioning(null);
      }, 500);
    },
    [transitioning, data, top]
  );

  const jumpBackward = useCallback(
    (next: number) => {
      if (transitioning !== null) return;
      progressRef.current?.children[next + 1].scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest",
      });
      setTransitioning("back");
      setOldCard({ ...data[top], number: top });
      setTop(next);
      setTimeout(() => {
        setTransitioning(null);
      }, 500);
    },
    [transitioning, data, top]
  );

  function handleJump(next: number) {
    if (next == top) {
      return;
    }
    if (next < top) {
      jumpBackward(next);
    } else {
      jumpForward(next);
    }
  }

  const handleBackClick = useCallback(() => {
    jumpBackward(back(top, data));
  }, [top, data, jumpBackward]);

  const handleForwardClick = useCallback(() => {
    jumpForward(forward(top, data));
  }, [top, data, jumpForward]);

  function handleClickFront() {
    handleJump(data.length - 1);
  }

  function handleClickBack() {
    handleJump(0);
  }

  function handleResetClick() {
    if (transitioning !== null) return;

    if (resetDeck(top)) jumpBackward(0);
  }

  function handleShuffleClick() {
    if (transitioning !== null) return;

    const newTop = shuffleDeck(top);

    if (!(top == 0 && newTop == 0)) {
      jumpBackward(0);
    }
  }

  function handleFilterClick(set: Set<string>) {
    if (filterDeck(set, top)) jumpBackward(0);
  }

  function handleModeClick(set: Set<string>) {
    if (filterDeckModes(set, top)) jumpBackward(0);
  }

  function handleFlipClick() {
    flipDeck();
  }

  function handleSwitchClick(newDeck: Set<string>) {
    if (switchDeck([...newDeck], top)) jumpBackward(0);
  }

  function setCompleted(number: number, value: boolean) {
    setTransitioning("flipping");

    setCardCompleted(number, value);

    setTimeout(() => {
      setTransitioning(null);
    }, 500);
  }

  function setOpen(name: string) {
    if (dropdown == name) {
      setDropdown(null);
    } else {
      setDropdown(name);
    }
  }

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      const target = e.target as HTMLElement;
      const isTyping =
        target.tagName === "INPUT" || target.tagName === "TEXTAREA";

      if (isTyping) return;

      if (e.key === "ArrowRight") {
        handleForwardClick();
      } else if (e.key === "ArrowLeft") {
        handleBackClick();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleForwardClick, handleBackClick]);

  return (
    <div className="h-screen flex flex-col items-baseline">
      <div className="flex gap-2 p-1 w-full">
        <button
          className=" cursor-pointer rounded-md"
          onClick={handleShuffleClick}
        >
          <img
            className="h-[1.3rem] w-[1.3rem] transition-[height] active:h-[1rem]"
            src="/shuffle.svg"
            alt="Logo"
          />
        </button>
        <button
          className=" cursor-pointer rounded-md"
          onClick={handleFlipClick}
        >
          <img
            className="h-[1.3rem] w-[1.3rem] transition-[height] active:h-[1rem]"
            src="/flip.svg"
            alt="Logo"
          />
        </button>
        <Dropdown
          name="filter"
          label="Filter"
          open={dropdown == "filter"}
          src="/filter.svg"
          setOpen={setOpen}
          handleFilterClick={handleFilterClick}
        >
          <CheckboxInput name="Unanwered" value="default" checked />
          <CheckboxInput name="Guesses" value="guess" checked />
          <CheckboxInput name="Incorrect" value="incorrect" checked />
          <CheckboxInput name="Correct" value="correct" checked />
        </Dropdown>
        <Dropdown
          name="mode"
          label="Set Mode"
          open={dropdown == "mode"}
          src="/zhong.svg"
          setOpen={setOpen}
          handleFilterClick={handleModeClick}
        >
          <CheckboxInput name="Pinyin/Definition" value="pinyin" checked />
          <CheckboxInput name="Sentences" value="sentence" checked />
          <CheckboxInput name="Hanzi" value="hanzi" />
        </Dropdown>
        <div className="ml-auto">
          <Dropdown
            name="deck"
            label="Load Deck"
            open={dropdown == "deck"}
            src="/deck.svg"
            setOpen={setOpen}
            handleFilterClick={handleSwitchClick}
            right
          >
            {/* <CheckboxInput name="Hello, World" value="defaultDeck" checked /> */}
            {...Object.keys(decks).map((name, i) => {
              return (
                <CheckboxInput
                  key={name}
                  name={decks[name].name}
                  value={name}
                  checked={i == 0}
                />
              );
            })}
          </Dropdown>
        </div>
        <button
          className=" cursor-pointer rounded-md"
          onClick={handleResetClick}
        >
          <img
            className="h-[1.3rem] w-[1.3rem] transition-[height] active:h-[1rem]"
            src="/reset.svg"
            alt="Logo"
          />
        </button>
      </div>
      <div className="w-full flex justify-center flex-1 p-40">
        <div className="flex w-[500px] relative">
          {data.length > 0 ? (
            <>
              <Card
                key={data[top].term + "" + data[top].order}
                data={data[top]}
                number={top}
                setCompleted={setCompleted}
                transition={transitioning == "back" ? "back" : null}
              />
              {oldCard &&
                transitioning !== null &&
                transitioning !== "flipping" && (
                  <Card
                    key={oldCard.term + "" + oldCard.order + "fake"}
                    data={oldCard}
                    number={oldCard.number ? oldCard.number : 0}
                    setCompleted={setCompleted}
                    transition={transitioning == "forward" ? "forward" : null}
                  />
                )}
            </>
          ) : (
            <div className="bg-amber-300 w-full">
              There are no cards in this deck.
            </div>
          )}
        </div>
      </div>
      <div className="absolute bottom-4 w-full flex flex-col items-center">
        {data.length > 0 && (
          <div className="mb-2 text-white text-xs">
            {top + 1}/{data.length}
          </div>
        )}
        {data.length > 1 && (
          <form className="gap-2 h-8 flex justify-center">
            <button
              className="relative text-white border-1 rounded-sm w-[60px] text-xs cursor-pointer group"
              type="button"
              onClick={handleBackClick}
            >
              <div className="absolute w-full h-full top-0 rounded-sm bg-gradient-to-tr from-blue-600 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-250" />
              <h1 className="relative z-2">
                <img
                  className="h-[1rem] w-full"
                  src="/backArrow.svg"
                  alt="Logo"
                />
              </h1>
            </button>
            <button
              className="relative text-white border-1 rounded-sm w-[60px] text-xs cursor-pointer group"
              type="button"
              onClick={handleForwardClick}
            >
              <div className="absolute w-full h-full top-0 rounded-sm bg-gradient-to-tr from-blue-600 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-250" />
              <h1 className="relative z-2">
                <img
                  className="h-[1rem] w-full"
                  src="/forwardArrow.svg"
                  alt="Logo"
                />
              </h1>
            </button>
          </form>
        )}
        <div className="relative w-full px-3 flex justify-center mt-3">
          <div
            className="relative border-2 border-blue-500 rounded-full h-[1.5rem] w-[min(100%,1200px)] flex overflow-scroll"
            style={{
              boxShadow: "0px 2px 10px 0px #3B82F6",
              scrollbarWidth: "none",
            }}
            ref={progressRef}
          >
            {data.length > 0 ? (
              <>
                <div
                  className="flex-none w-[calc(50%-37.5px)] h-full bg-gradient-to-r from-blue-300 to-blue-200 text-blue-500 cursor-pointer"
                  onClick={handleClickFront}
                />
                {data.map((card: CardData, i: number) => {
                  return (
                    <Chip
                      card={card}
                      number={i}
                      key={i}
                      handleJump={handleJump}
                    />
                  );
                })}
                <div
                  className="flex-none w-[calc(50%-37.5px)] h-full bg-gradient-to-r from-blue-300 to-blue-200 text-blue-500 cursor-pointer"
                  onClick={handleClickBack}
                />
              </>
            ) : (
              <div className="flex-none w-full h-full bg-gradient-to-r from-blue-300 to-blue-200 text-blue-500 cursor-pointer" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

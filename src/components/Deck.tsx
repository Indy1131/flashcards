import { useCallback, useEffect, useRef, useState } from "react";
import Card from "./Card";
import Chip from "./atoms/Chip";
import Dropdown from "./atoms/Dropdown";
import CheckboxInput from "./atoms/CheckboxInput";
import Eye from "./atoms/Eye";
import { icons } from "./icons";

import {
  applyDeckModes,
  copyDeck,
  DEFAULT_MODES,
  prepData,
  resetCard,
  shuffle,
  unionDecks,
  type CardData,
  type CardFormTypes,
  type Deck,
} from "../decks/utilities";
import { useDeck } from "../providers/deck/useDeck";
import { useAuth } from "../providers/auth/useAuth";
import Flashlight from "./atoms/Flashlight";

type DeckProps = {
  deckIds: string[];
};

function back(top: number, cards: CardData[]): number {
  return (top - 1 + cards.length) % cards.length;
}

function forward(top: number, cards: CardData[]): number {
  return (top + 1) % cards.length;
}

export default function Deck({ deckIds }: DeckProps) {
  const [data, setData] = useState<null | CardData[]>(null);
  const fullDeck = useRef<CardData[] | null>(null);

  const [modes, setModes] = useState(DEFAULT_MODES);

  const [oldCard, setOldCard] = useState<CardData | null>(null);
  const [top, setTop] = useState(0);

  const [transitioning, setTransitioning] = useState<string | null>(null);
  const [dropdown, setDropdown] = useState<string | null>(null);

  const { user, logout, fetchWithAuth } = useAuth();
  const { showWindow } = useDeck();

  const progressRef = useRef<HTMLDivElement>(null);

  const jumpForward = useCallback(
    (next: number) => {
      if (!data || transitioning !== null) return;
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
      if (!data || transitioning !== null) return;
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

  function resetDeck(top: number) {
    if (!data || !fullDeck.current) return;

    const newDeck = copyDeck(fullDeck.current);
    const newDeckModes = applyDeckModes(newDeck, modes);

    setData(newDeckModes);

    if (
      top == 0 &&
      data[top].term == applyDeckModes(fullDeck.current, modes)[0].term
    ) {
      return false;
    }

    return true;
  }

  function shuffleDeck(top: number) {
    if (!data) return;

    const [newData, newTop] = shuffle(data, top);
    setData(newData);
    return newTop;
  }

  function setCardCompleted(number: number, value: boolean) {
    if (!data) return;

    data[number].completed = value;
    setData([...data]);
  }

  function setCardStatus(number: number, value: string) {
    if (!data) return;

    data[number].status = value;
    setData([...data]);
  }

  function setCardFormData(number: number, key: CardFormTypes, value: string) {
    if (!data) return;
    const formData = data[number].formData;

    if (key === "hanzi" && "hanzi" in formData) {
      formData.hanzi = value;
    } else if (
      (key === "pinyin" || key === "definition") &&
      "pinyin" in formData &&
      "definition" in formData
    ) {
      formData[key] = value;
    }

    setData([...data]);
  }

  function filterDeck(options: Set<string>, top: number) {
    if (!data || !fullDeck.current) return;
    const union = unionDecks(prepData(fullDeck.current), data);

    const filteredDeck = union.filter((item) => {
      const favoritesOnly = options.has("favorite");

      return (
        options.has(item.status) &&
        modes.has(item.type) &&
        (!favoritesOnly || item.favorite)
      );
    });
    setData(filteredDeck);

    if (
      filteredDeck.length > 0 &&
      top == 0 &&
      data[top] &&
      filteredDeck[0].order == data[top].order
    ) {
      return false;
    }

    return true;
  }

  function filterDeckModes(options: Set<string>, top: number) {
    if (!data || !fullDeck.current) return;
    const union = unionDecks(prepData(fullDeck.current), data);

    const filteredDeck = union.filter((item) => options.has(item.type));

    setData(filteredDeck);
    setModes(options);

    if (
      filteredDeck.length > 0 &&
      top == 0 &&
      filteredDeck[0].order == data[top].order
    ) {
      return false;
    }

    return true;
  }

  function flipDeck() {
    if (!data) return;

    const newDeck = data.map((card) => {
      resetCard(card);
      return card;
    });
    setData(newDeck);
  }

  const handleBackClick = useCallback(() => {
    if (!data) return;
    jumpBackward(back(top, data));
  }, [top, data, jumpBackward]);

  const handleForwardClick = useCallback(() => {
    if (!data) return;
    jumpForward(forward(top, data));
  }, [top, data, jumpForward]);

  function handleClickFront() {
    if (!data) return;
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

  function handleSelectDeckClick() {
    showWindow({ type: "selection", parent: null });
  }

  function setCompleted(number: number, value: boolean) {
    setTransitioning("flipping");

    setCardCompleted(number, value);

    setTimeout(() => {
      setTransitioning(null);
    }, 500);
  }

  function setFavorite(id: string, value: boolean) {
    if (!data) return;

    const url = `${import.meta.env.VITE_API_BASE_URL}/set-favorite/`;
    fetchWithAuth(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id,
        value,
      }),
    });

    const card = data.find((card) => card.id == id);
    if (card) card.favorite = value;

    setData([...data]);
  }

  function setOpen(name: string) {
    if (dropdown == name) {
      setDropdown(null);
    } else {
      setDropdown(name);
    }
  }

  useEffect(() => {
    async function getData() {
      setTop(0);
      const url = `${import.meta.env.VITE_API_BASE_URL}/get-decks/`;
      const response = await fetchWithAuth(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          deckIds: deckIds,
          includeCards: true,
        }),
      });
      const json = await response.json();
      if (Object.keys(json).length < 1) return;

      const deck = json
        .map((deck: Deck) => [...deck.cards, ...deck.hanzi])
        .flat();
      const prepped = prepData(deck);

      const newDeckModes = applyDeckModes(prepped, modes);

      setData(newDeckModes);
      setTop(0);
      progressRef.current?.children[0].scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest",
      });
      fullDeck.current = deck;
    }
    getData();
  }, [deckIds, fetchWithAuth, modes]);

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
    <div className="h-screen flex flex-col items-center">
      <div className="select-none flex gap-2 p-1 w-full max-w-[1200px]">
        <div className="text-xs cursor-pointer rounded-full bg-gradient-to-tr from-blue-500 to-blue-400 text-white h-[2em] w-[2em] flex items-center justify-center">
          {user?.username.charAt(0).toUpperCase()}
        </div>
        <button
          className=" cursor-pointer rounded-md mr-4"
          onClick={() => logout()}
        >
          <img
            className="h-[1.3rem] w-[1.3rem] transition-[height] active:h-[1rem]"
            src={icons.logout}
            alt="Logo"
          />
        </button>
        <button
          className=" cursor-pointer rounded-md"
          onClick={handleShuffleClick}
        >
          <img
            className="h-[1.3rem] w-[1.3rem] transition-[height] active:h-[1rem]"
            src={icons.shuffle}
            alt="Logo"
          />
        </button>
        <button
          className=" cursor-pointer rounded-md"
          onClick={handleFlipClick}
        >
          <img
            className="h-[1.3rem] w-[1.3rem] transition-[height] active:h-[1rem]"
            src={icons.flip}
            alt="Logo"
          />
        </button>
        <Dropdown
          name="filter"
          label="Filter"
          open={dropdown == "filter"}
          src={icons.filter}
          setOpen={setOpen}
          handleFilterClick={handleFilterClick}
        >
          <CheckboxInput name="Unanwered" value="default" checked />
          <CheckboxInput name="Guesses" value="guess" checked />
          <CheckboxInput name="Incorrect" value="incorrect" checked />
          <CheckboxInput name="Correct" value="correct" checked />
          <CheckboxInput name="Favorite" value="favorite" />
        </Dropdown>
        <Dropdown
          name="mode"
          label="Set Mode"
          open={dropdown == "mode"}
          src={icons.zhong}
          setOpen={setOpen}
          handleFilterClick={handleModeClick}
        >
          <CheckboxInput name="Pinyin/Definition" value="pinyin" checked />
          <CheckboxInput name="Sentences" value="sentence" checked />
          <CheckboxInput name="Hanzi" value="hanzi" />
        </Dropdown>
        <Eye deckIds={deckIds} />
        <button
          className=" cursor-pointer rounded-md"
          onClick={handleSelectDeckClick}
        >
          <img
            className="h-[1.3rem] w-[1.3rem] transition-[height] active:h-[1rem]"
            src={icons.deck}
            alt="Logo"
          />
        </button>
        <button
          className=" cursor-pointer rounded-md"
          onClick={handleResetClick}
        >
          <img
            className="h-[1.3rem] w-[1.3rem] transition-[height] active:h-[1rem]"
            src={icons.reset}
            alt="Logo"
          />
        </button>
      </div>
      <div className="w-full flex justify-center flex-1 p-6">
        <div className="flex w-[700px] items-center relative pointer-events-none">
          {data && data.length > 0 ? (
            <>
              <Card
                key={data[top].term + "" + data[top].order}
                data={data[top]}
                number={top}
                setCompleted={setCompleted}
                setCardStatus={setCardStatus}
                setCardFormData={setCardFormData}
                setFavorite={setFavorite}
                transition={transitioning == "back" ? "back" : null}
              />
              {oldCard &&
                transitioning !== null &&
                transitioning !== "flipping" && (
                  <Card
                    key={oldCard.term + "" + oldCard.order}
                    data={oldCard}
                    number={oldCard.number ? oldCard.number : 0}
                    setCompleted={setCompleted}
                    setCardStatus={setCardStatus}
                    setCardFormData={setCardFormData}
                    setFavorite={setFavorite}
                    transition={transitioning == "forward" ? "forward" : null}
                  />
                )}
            </>
          ) : (
            <div className="absolute flex-none flex flex-col bottom-0 h-full justify-center items-center w-full select-none rounded-xl perspective-[1000px] z-1">
              <div className="flex-none flex flex-col bottom-0 h-full justify-center max-h-[600px] items-center w-full select-none rounded-xl perspective-[1000px] z-1">
                <Flashlight
                  className="text-blue-500 text-4xl flex items-center justify-center card w-full h-full border-1 bg-blue-100 border-blue-400 rounded-xl pointer-events-auto"
                  lightClassName="rounded-xl"
                  style={{
                    boxShadow: "0px 10px 10px 1px #3B82F6",
                  }}
                >
                  <h1 className="z-10">{/* There are no cards loaded. */}</h1>
                </Flashlight>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="absolute bottom-4 w-full flex flex-col items-center">
        {data && data.length > 0 && (
          <div className="mb-2 text-white text-xs">
            {top + 1}/{data.length}
          </div>
        )}
        {data && data.length > 1 && (
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
                  src={icons.backArrow}
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
                  src={icons.forwardArrow}
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
            {data && data.length > 0 ? (
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

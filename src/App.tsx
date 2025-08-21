import { useRef, useState } from "react";
import Deck from "./components/Deck";
import {
  applyDeckModes,
  copyDeck,
  resetCard,
  shuffle,
  type CardData,
  type CardFormTypes,
} from "./decks/utilities";
import { decks } from "./decks/generatedDecks";
import { DeckProvider } from "./providers/DeckProvider";
import Window from "./components/atoms/Window";

const DEFAULT_MODES = new Set(["pinyin", "sentence"]);

function App() {
  const initial = ["numbers", "vocab10", "Dialogue12", "Dialogue11"];
  const initialDeck = copyDeck(initial);

  const [current, setCurrent] = useState(initial);
  const [deck, setDeck] = useState(applyDeckModes(initialDeck, DEFAULT_MODES));
  const fullDeck = useRef(initialDeck);

  const [modes, setModes] = useState(DEFAULT_MODES);

  function resetDeck(top: number) {
    const newDeck = copyDeck(current);
    const newDeckModes = applyDeckModes(newDeck, modes);

    setDeck(newDeckModes);
    fullDeck.current = newDeck;

    if (
      top == 0 &&
      deck[top].term ==
        applyDeckModes(decks[current[0]].cards as CardData[], modes)[0].term
    ) {
      return false;
    }

    return true;
  }

  function shuffleDeck(top: number) {
    const [newData, newTop] = shuffle(deck, top);
    setDeck(newData);
    return newTop;
  }

  function setCardCompleted(number: number, value: boolean) {
    deck[number].completed = value;
    setDeck([...deck]);
  }

  function setCardStatus(number: number, value: string) {
    deck[number].status = value;
    setDeck([...deck]);
  }

  function setCardFormData(number: number, key: CardFormTypes, value: string) {
    const formData = deck[number].formData;

    if (key === "hanzi" && "hanzi" in formData) {
      formData.hanzi = value;
    } else if (
      (key === "pinyin" || key === "definition") &&
      "pinyin" in formData &&
      "definition" in formData
    ) {
      formData[key] = value;
    }

    setDeck([...deck]);
  }

  function filterDeck(options: Set<string>, top: number) {
    const filteredDeck = fullDeck.current.filter(
      (item) => options.has(item.status) && modes.has(item.mode)
    );
    setDeck(filteredDeck);

    if (
      filteredDeck.length > 0 &&
      top == 0 &&
      filteredDeck[0].order == deck[top].order
    ) {
      return false;
    }

    return true;
  }

  function filterDeckModes(options: Set<string>, top: number) {
    const filteredDeck = fullDeck.current.filter((item) =>
      options.has(item.mode)
    );
    setDeck(filteredDeck);
    setModes(options);

    if (
      filteredDeck.length > 0 &&
      top == 0 &&
      filteredDeck[0].order == deck[top].order
    ) {
      return false;
    }

    return true;
  }

  function flipDeck() {
    const newDeck = deck.map((card) => {
      resetCard(card);
      return card;
    });
    setDeck(newDeck);
  }

  function switchDeck(newDeck: string[], top: number) {
    const prevName = current[0];
    const prev = deck[0];

    setCurrent(newDeck);

    const newDeckCopy = copyDeck(newDeck);
    const newDeckModes = applyDeckModes(newDeckCopy, modes);
    setDeck(newDeckModes);
    fullDeck.current = newDeckCopy;

    if (
      newDeckCopy.length > 0 &&
      top == 0 &&
      prevName == newDeck[0] &&
      newDeckCopy[0].order == prev.order
    ) {
      return false;
    }

    return true;
  }

  return (
    <DeckProvider
      resetDeck={resetDeck}
      shuffleDeck={shuffleDeck}
      setCardCompleted={setCardCompleted}
      setCardStatus={setCardStatus}
      setCardFormData={setCardFormData}
      switchDeck={switchDeck}
      filterDeck={filterDeck}
      flipDeck={flipDeck}
      filterDeckModes={filterDeckModes}
    >
      <div className="h-screen bg-gradient-to-t from-blue-500 to-white overflow-hidden">
        <Window />
        <Deck data={deck} deckNames={current} />
      </div>
    </DeckProvider>
  );
}

export default App;

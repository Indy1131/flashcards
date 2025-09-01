import { useEffect, useState } from "react";
import { DEFAULT_MODES, type Deck } from "../../decks/utilities";
import Scrollable from "../atoms/Scrollable";
import CheckboxInput from "../atoms/CheckboxInput";
import Dropdown from "../atoms/Dropdown";
import PinyinCard from "../atoms/PinyinCard";
import { icons } from "../icons";
import { Fragment } from "react";
import { useAuth } from "../../providers/auth/useAuth";
import { useDeck } from "../../providers/deck/useDeck";
import SentenceCard from "../atoms/SentenceCard";

type Props = {
  deckIds?: string[];
  viewedIds: string[];
  refreshDeck: () => void;
};

export default function DeckWindow({ deckIds, viewedIds, refreshDeck }: Props) {
  const [data, setData] = useState<Deck[] | null>(null);
  const [dropdown, setDropdown] = useState<string | null>(null);
  const [modes, setModes] = useState(DEFAULT_MODES);

  const [createType, setCreateType] = useState<string>("pinyin");
  const [creating, setCreating] = useState<string | null>(null);

  const { fetchWithAuth } = useAuth();
  const { showWindow } = useDeck();

  function checkRefresh(deckId: string) {
    if (viewedIds.find((id) => id == deckId)) refreshDeck();
  }

  useEffect(() => {
    async function getData() {
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
      setData(json);
    }

    getData();
  }, [deckIds, fetchWithAuth]);

  function setOpen(name: string) {
    if (dropdown == name) {
      setDropdown(null);
    } else {
      setDropdown(name);
    }
  }

  function handleFilterClick(set: Set<string>) {
    setModes(set);
  }

  function handleGoBackClick(parent: string | null) {
    showWindow({ type: "selection", parent });
  }

  function handleCreateClick(id: string, type: string) {
    setCreateType(type);
    setCreating(id);
  }

  function handleStopCreate() {
    setCreating(null);
  }

  async function handleDelete(deckId: string, cardId: string) {
    const url = `${import.meta.env.VITE_API_BASE_URL}/delete-card/`;
    const response = await fetchWithAuth(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        card: cardId,
      }),
    });

    if (response.status != 200 || !data) return;

    const json = await response.json();

    const decks = data.map((item) => item);
    const curr = decks.find((info) => info.id == deckId);

    const i = curr.cards.findIndex((card) => card.id == cardId);
    curr.cards.splice(i, 1);

    const toDelete = new Set(json.deleted);
    curr.hanzi = curr?.hanzi.filter((card) => !toDelete.has(card.id));

    setData(decks);
    checkRefresh(deckId);
  }

  async function handleEdit(
    deck: string,
    cardId: string,
    formData: { term: string; definition: string }
  ) {
    const { term, definition } = formData;
    const url = `${import.meta.env.VITE_API_BASE_URL}/edit-card/`;
    const response = await fetchWithAuth(url, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        deck,
        card: cardId,
        term,
        definition,
      }),
    });

    if (response.status != 200) return;

    const json = await response.json();
    checkRefresh(deck);

    if (!data) return;

    const decks = data.map((item) => item);
    const curr = decks.find((info) => info.id == deck);

    const i = curr.cards.findIndex((card) => card.id == cardId);
    curr.cards[i] = json.card;
    curr.hanzi.push(...json.added);

    const toDelete = new Set(json.deleted);
    curr.hanzi = curr?.hanzi.filter((card) => !toDelete.has(card.id));

    setData(decks);
  }

  async function handleCreate({
    deck,
    term,
    definition,
  }: {
    deck: string;
    term: string;
    definition: string;
  }) {
    const url = `${import.meta.env.VITE_API_BASE_URL}/create-card/`;
    const response = await fetchWithAuth(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        deck,
        term,
        definition,
        type: createType,
      }),
    });

    if (response.status != 200) return;

    const json = await response.json();
    checkRefresh(deck);

    if (!data) return;

    const decks = data.map((item) => item);
    const curr = decks.find((info) => info.id == deck);

    curr.cards.push(json.card);
    curr.hanzi.push(...json.added);

    setData(decks);
  }

  if (!data) return <h1>Loading</h1>;

  return (
    <>
      <div className="">
        <Dropdown
          name="filter"
          label="Filter"
          open={dropdown == "filter"}
          src={icons.filter}
          setOpen={setOpen}
          handleFilterClick={handleFilterClick}
        >
          <CheckboxInput name="Pinyin" value="pinyin" checked />
          <CheckboxInput name="Sentence" value="sentence" checked />
          <CheckboxInput name="Hanzi" value="hanzi" />
        </Dropdown>
      </div>
      <Scrollable
        scrollAccent="scrollbar-thumb-blue-500"
        className="flex-1 text-xl mb-4 h-full"
      >
        {data.length >= 1 &&
          data.map((deck) => {
            return (
              <Fragment key={deck.name}>
                <h1 className="text-4xl mt-4 ml-2 font-semibold">
                  {deck.name}
                </h1>
                <div className="flex gap-4 mb-4 ml-2">
                  <p>{deck.desc}</p>
                </div>
                <button
                  onClick={() => handleGoBackClick(deck.parent)}
                  className="bg-blue-500 rounded-md text-white w-[200px] text-sm py-2 cursor-pointer"
                >
                  See folder
                </button>
                {deck.cards
                  .filter((card) => modes.has(card.type))
                  .map((card, i) => {
                    switch (card.type) {
                      case "pinyin":
                        return (
                          <PinyinCard
                            deckId={deck.id}
                            card={card}
                            i={i}
                            key={i}
                            handleDelete={handleDelete}
                            handleEdit={handleEdit}
                          />
                        );
                      case "sentence":
                        return (
                          <SentenceCard
                            deckId={deck.id}
                            card={card}
                            i={i}
                            key={i}
                            handleDelete={handleDelete}
                            handleEdit={handleEdit}
                          />
                        );
                      default:
                        return <h1>error</h1>;
                    }
                  })}
                {modes.has("hanzi") &&
                  deck.hanzi.map((card, i) => {
                    return (
                      <div
                        className="w-full grid grid-cols-[64px_50px__1fr_2fr] border-2 rounded-xl"
                        key={i}
                      >
                        <div />
                        <div className="border-r-2 flex py-1 px-2 justify-center">
                          {i + 1 + deck.cards.length}
                        </div>
                        <div className="border-r-2 flex py-1 px-2 text-3xl">
                          {card.term}
                        </div>
                        <div className="flex flex-col items-center">
                          {card.readings.map((reading, i) => {
                            return (
                              <div
                                className={`grid grid-cols-[60px_1fr] w-full ${
                                  i != card.readings.length - 1 && "border-b-2"
                                } ${card.readings.length == 1 && "h-full"}`}
                              >
                                <div className="flex justify-center items-center border-r-2 py-1 px-2">
                                  {reading.pinyin}
                                </div>
                                <div className="flex items-center py-1 px-2">
                                  {reading.definition.join("; ")}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                <div className="flex items-center h-[60px] gap-2 mb-20">
                  {creating != deck.id ? (
                    <>
                      <button
                        onClick={() => handleCreateClick(deck.id, "pinyin")}
                        className="cursor-pointer bg-blue-500 text-white w-[200px] rounded-md py-2 text-sm"
                      >
                        Create Pinyin
                      </button>
                      <button
                        onClick={() => handleCreateClick(deck.id, "sentence")}
                        className="cursor-pointer bg-blue-500 text-white w-[200px] rounded-md py-2 text-sm"
                      >
                        Create Sentence
                      </button>
                    </>
                  ) : createType == "pinyin" ? (
                    <PinyinCard
                      deckId={deck.id}
                      creating={true}
                      cancel={handleStopCreate}
                      handleCreate={handleCreate}
                    />
                  ) : (
                    <SentenceCard
                      deckId={deck.id}
                      creating={true}
                      cancel={handleStopCreate}
                      handleCreate={handleCreate}
                    />
                  )}
                </div>
              </Fragment>
            );
          })}
      </Scrollable>
    </>
  );
}

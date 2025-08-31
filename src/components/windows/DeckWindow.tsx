import { useEffect, useState } from "react";
import { DEFAULT_MODES, type Deck } from "../../decks/utilities";
import Scrollable from "../atoms/Scrollable";
import CheckboxInput from "../atoms/CheckboxInput";
import Dropdown from "../atoms/Dropdown";
import { icons } from "../icons";
import { Fragment } from "react";
import { useAuth } from "../../providers/auth/useAuth";

type Props = {
  decks?: Deck[];
  deckIds?: string[];
};

export default function DeckWindow({ decks, deckIds }: Props) {
  const [data, setData] = useState<Deck[] | null>(null);
  const [dropdown, setDropdown] = useState<string | null>(null);
  const [modes, setModes] = useState(DEFAULT_MODES);

  const { fetchWithAuth } = useAuth();

  useEffect(() => {
    if (decks) {
      setData(decks);
      return;
    }

    async function getData() {
      const url = `${import.meta.env.VITE_BASE_URL}/`;
      const response = await fetchWithAuth(url);
      const json = response.json();
      console.log(json);
    }

    getData();
  }, [decks, deckIds]);

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

  if (!data) return <h1>Loading</h1>;

  return (
    <>
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
      <Scrollable
        scrollAccent="scrollbar-thumb-blue-500"
        className="flex-1 text-xl mb-4"
      >
        {data.map((deck) => {
          return (
            <Fragment key={deck.name}>
              <h1 className="text-4xl mt-4 ml-2 font-semibold">{deck.name}</h1>
              <div className="flex gap-4 mb-4 ml-2">
                <p>{deck.desc}</p>
              </div>
              {deck.cards
                .filter((card) => modes.has(card.type))
                .map((card, i) => {
                  switch (card.type) {
                    case "pinyin":
                      return (
                        <div
                          className="w-full grid grid-cols-[50px_1fr_1fr_1fr] border-2 rounded-xl"
                          key={i}
                        >
                          <div className="rounded-l-md border-r-2 flex items-center py-1 px-2 justify-center">
                            {i + 1}
                          </div>
                          <div className="border-r-2 flex items-center py-1 px-2 text-3xl">
                            {card.term}
                          </div>
                          <div className="border-r-2 flex items-center py-1 px-2">
                            {card.pinyin}
                          </div>
                          <div className="py-1 px-2 flex items-center">
                            {card.definition}
                          </div>
                        </div>
                      );
                    case "sentence":
                      return (
                        <div
                          className="w-full grid grid-cols-[50px_1fr_1fr] border-2 rounded-xl"
                          key={i}
                        >
                          <div className="rounded-l-md border-r-2 flex items-center py-1 px-2 justify-center">
                            {i + 1}
                          </div>
                          <div className="border-r-2 flex items-center py-1 px-2 text-2xl">
                            {card.term}
                          </div>
                          <div className="flex flex-col">
                            <div className="border-b-2 py-1 px-2">
                              {card.pinyin}
                            </div>
                            <div className="py-1 px-2">{card.definition}</div>
                          </div>
                          {/* <div className="py-1 px-2 flex items-center">
                            {card.definition}
                          </div> */}
                        </div>
                      );
                    case "hanzi":
                      return (
                        <div
                          className="w-full grid grid-cols-[50px_1fr_2fr] border-2 rounded-xl"
                          key={i}
                        >
                          <div className="border-r-2 flex items-center py-1 px-2 justify-center">
                            {i + 1}
                          </div>
                          <div className="border-r-2 flex items-center py-1 px-2 text-3xl">
                            {card.term}
                          </div>
                          <div className="flex flex-col items-center">
                            {card.readings.map((reading, i) => {
                              return (
                                <div
                                  className={`grid grid-cols-[60px_1fr] w-full ${
                                    i != card.readings.length - 1 &&
                                    "border-b-2"
                                  } ${card.readings.length == 1 && "h-full"}`}
                                >
                                  <div className="flex justify-center items-center border-r-2 py-1 px-2">
                                    {reading.pinyin}
                                  </div>
                                  <div className="flex items-center py-1 px-2">
                                    {reading.definition}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    default:
                      return <h1>error</h1>;
                  }
                })}
            </Fragment>
          );
        })}
      </Scrollable>
    </>
  );
}

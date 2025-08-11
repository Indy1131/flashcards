import type { Deck } from "../decks/utilities";
import Scrollable from "./Scrollable";

type Props = {
  deck: Deck;
};

export default function DeckWindow({ deck }: Props) {
  console.log(deck);
  return (
    <>
      <h1 className="text-2xl mt-4">{deck.name}</h1>
      <div className="flex gap-4 mb-4">
        <p>{deck.desc}</p>
      </div>
      <Scrollable scrollAccent="scrollbar-thumb-blue-500" className="flex-1">
        {[...Array(100)].map(() => {
          return (
            <div className="w-full flex justify-between">
              <div>Term</div>
              <div>Definition</div>
            </div>
          );
        })}
      </Scrollable>
    </>
  );
}

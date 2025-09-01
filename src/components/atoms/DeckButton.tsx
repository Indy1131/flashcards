import { useState } from "react";
import { icons } from "../icons";
import Eye from "./Eye";
import Scrollable from "./Scrollable";
import type { Deck } from "../../decks/utilities";

type DeckButtonProps = {
  deck: Deck;
  selected?: boolean;
  editDeck: (formData: Deck) => void;
  handleSelect: (id: string) => void;
  className?: string;
};

export default function DeckButton({
  deck,
  selected = false,
  editDeck,
  handleSelect,
  className,
}: DeckButtonProps) {
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: deck.name,
    desc: deck.desc,
    parent: deck.parent,
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  function handleSubmitClick() {
    setEditing(false);
    editDeck({ id: deck.id, ...formData });
  }

  return (
    <div
      className={`relative flex flex-col border-2 gap-1 border-blue-500 rounded-md p-2 transition-all cursor-pointer h-[124px] ${
        selected ? "bg-blue-500 text-white" : "hover:bg-blue-100"
      } ${className}`}
    >
      <div className="flex items-center gap-1 select-none">
        {!editing ? (
          <h1 onClick={() => handleSelect(deck.id)} className="flex-1">
            {deck.name}
          </h1>
        ) : (
          <div>
            <input
              className="bg-white border-2"
              value={formData.name}
              onChange={handleChange}
              name="name"
            />
            <button
              className="text-white bg-blue-500 cursor-pointer"
              onClick={handleSubmitClick}
            >
              confirm
            </button>
          </div>
        )}
        {!editing && !selected && (
          <>
            <div className="ml-auto flex items-center">
              <Eye deckIds={[deck.id]} />
            </div>
            <button className="cursor-pointer" onClick={() => setEditing(true)}>
              <img
                className="cursor-pointer h-[1.3rem] w-[1.3rem] transition-[height] active:h-[1rem]"
                src={icons.pencil}
                alt="Logo"
              />
            </button>
            <button className="cursor-pointer" onClick={() => setEditing(true)}>
              <img
                className="cursor-pointer h-[1.3rem] w-[1.3rem] transition-[height] active:h-[1rem]"
                src={icons.trash}
                alt="Logo"
              />
            </button>
          </>
        )}
      </div>
      <Scrollable scrollAccent="scrollbar-thumb-blue-500">
        <p className="text-xs select-none">{deck.desc}</p>
      </Scrollable>
    </div>
  );
}

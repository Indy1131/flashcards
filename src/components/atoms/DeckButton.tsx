import { useState } from "react";
import { icons } from "../icons";
import type { Deck } from "../../decks/utilities";
import Eye from "./Eye";

type DeckButtonProps = {
  deck: Deck;
  selected?: boolean;
  editDeck: (formData: Deck) => void;
  deleteDeck: (id: string) => void;
  handleSelect: (id: string) => void;
  i: number;
  creating?: boolean;
  cancel?: () => void;
  handleCreate?: (formData: {
    name: string;
    desc: string;
    parent: string;
  }) => void;
  className?: string;
};

export default function DeckButton({
  deck,
  selected = false,
  editDeck,
  deleteDeck,
  handleSelect,
  i,
  creating,
  cancel,
  handleCreate,
  className,
}: DeckButtonProps) {
  const [formData, setFormData] = useState({
    name: deck?.name || "",
    desc: deck?.desc || "",
    parent: deck?.parent || "",
  });
  const [editing, setEditing] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (editing) {
      setEditing(false);
      editDeck({ id: deck.id, ...formData });
    } else if (creating && handleCreate) {
      handleCreate(formData);
    }
    setFormData({ name: "", desc: "", parent: "" });
  }

  function handleEditClick(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    setEditing(true);
    setFormData({ name: deck.name, desc: deck.desc, parent: deck.parent });
  }

  function handleCancel() {
    if (cancel) {
      cancel();
    } else {
      setEditing(false);
    }
  }

  let buttons;
  let content;
  let grid;

  if (creating || editing) {
    buttons = (
      <>
        <button
          type="submit"
          className="cursor-pointer flex items-center justify-center bg-blue-500 border-2 border-blue-500 text-white py-1 px-2 rounded-md text-sm"
        >
          {editing ? "Apply" : "Create Deck"}
        </button>
        <button
          className="cursor-pointer flex items-center justify-center text-blue-500 border-2 py-1 px-2 rounded-md text-sm"
          onClick={handleCancel}
          type="button"
        >
          Cancel
        </button>
      </>
    );
    content = (
      <>
        <div className="rounded-l-md border-r-1 flex items-center py-1 px-2 justify-center">
          {i + 1}
        </div>
        <div className="border-r-1 flex items-center py-1 px-2 break-all whitespace-normal">
          <input
            className="bg-white border-2 w-full"
            value={formData.name}
            onChange={handleChange}
            name="name"
            placeholder="Deck Name"
          />
        </div>
        <div className="py-1 px-2 flex items-center break-all whitespace-normal">
          <input
            className="bg-white border-2 w-full"
            value={formData.desc}
            onChange={handleChange}
            name="desc"
            placeholder="Description"
          />
        </div>
      </>
    );
    grid = creating ? "grid-cols-[200px_1fr_1fr]" : "grid-cols-[150px_1fr_1fr]";
  } else {
    buttons = (
      <>
        <div className="flex items-center">
          <Eye deckIds={[deck.id]} />
        </div>
        <button
          className="cursor-pointer flex items-center justify-center"
          type="button"
          onClick={handleEditClick}
        >
          <img
            className="h-[1.3rem] w-[1.3rem] transition-[height] active:h-[1rem]"
            src={icons.pencil}
            alt="Edit"
          />
        </button>
        <button
          className="cursor-pointer flex items-center justify-center"
          type="button"
          onClick={() => deleteDeck(deck.id)}
        >
          <img
            className="h-[1.3rem] w-[1.3rem] transition-[height] active:h-[1rem]"
            src={icons.trash}
            alt="Delete"
          />
        </button>
      </>
    );
    content = (
      <>
        <div
          className="h-full w-full flex items-center justify-center border-r-1 cursor-pointer pointer-events-auto"
          onClick={() => handleSelect(deck.id)}
        >
          <div className="flex border-2 border-blue-500 z rounded-sm overflow-hidden">
            <div
              className={`${
                selected ? "opacity-100" : "opacity-0"
              } h-[14px] w-[14px] flex justify-center items-center transition-all bg-blue-500 text-white`}
            >
              {selected && (
                <img src={icons.check} className="select-none" alt="select" />
              )}
            </div>
          </div>
        </div>
        <div
          className="cursor-pointer flex items-center justify-end"
          onClick={() => handleSelect(deck.id)}
        >
          <img
            className="h-[1.3rem] w-[1.3rem] transition-[height] active:h-[1rem]"
            src={icons.deck}
            alt="Edit"
          />
        </div>
        <div className="flex items-center w-full overflow-hidden">
          <div
            className="select-none flex items-center py-1 pl-2 whitespace-nowrap cursor-pointer pointer-events-auto"
            onClick={() => handleSelect(deck.id)}
          >
            {deck.name}
          </div>
          <div
            className="text-blue-500/90 truncate overflow-hidden whitespace-nowrap flex-1 pl-2 py-1 text-xs"
            onClick={() => handleSelect(deck.id)}
          >
            {deck.desc}
          </div>
        </div>
      </>
    );
    grid = "grid-cols-[50px_30px_1fr_96px]";
  }

  return (
    <form
      className={`w-full grid items-stretch min-h-[46px] relative ${grid} ${
        i % 2 !== 0 && !creating ? "bg-blue-200/50" : "break-all bg-transparent"
      } ${className || ""}`}
      onSubmit={handleSubmit}
    >
      {content}
      <div className={`h-full flex items-center justify-end pr-2 gap-2`}>
        {buttons}
      </div>
    </form>
  );
}

import { useState } from "react";
import type { PreCard, PrePinyin } from "../../decks/utilities";
import { icons } from "../icons";

type PinyinCardProps = {
  deckId: string;
  card: PrePinyin & PreCard;
  i: number;
  creating?: boolean;
  cancel?: () => void;
  handleCreate: (formData: {
    term: string;
    definition: string;
    deck: string;
  }) => void;
  handleEdit: (
    deck: string,
    cardId: string,
    formData: { term: string; definition: string }
  ) => void;
  handleDelete: (deckId: string, cardId: string) => void;
};

export default function PinyinCard({
  deckId,
  card,
  i,
  creating,
  cancel,
  handleCreate,
  handleEdit,
  handleDelete,
}: PinyinCardProps) {
  const [formData, setFormData] = useState({ term: "", definition: "" });
  const [editing, setEditing] = useState(false);

  let buttons;
  let content;
  let grid;

  function handleCancel() {
    if (cancel) {
      cancel();
    } else {
      setEditing(false);
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (editing) {
      setEditing(false);
      handleEdit(deckId, card.id, formData);
    } else if (creating) {
      handleCreate({ ...formData, deck: deckId });
    }

    setFormData({ term: "", definition: "" });
  }

  function handleEditClick(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    setEditing(true);
    setFormData({ term: card.term, definition: card.definition });
  }

  if (creating || editing) {
    buttons = (
      <>
        <button
          type="submit"
          className=" cursor-pointer flex items-center justify-center bg-blue-500 border-2 border-blue-500 text-white py-1 px-2 rounded-md text-sm"
        >
          {editing ? "Apply" : "Create"}
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
        <div className="p-2 border-r-2">
          <input
            placeholder="Term"
            value={formData.term}
            onChange={handleChange}
            name="term"
            className="border-2 rounded-md w-full px-2 auto"
            autoComplete="off"
          ></input>
        </div>
        <div className="p-2">
          <input
            placeholder="Definition"
            value={formData.definition}
            onChange={handleChange}
            name="definition"
            className="border-2 rounded-md w-full px-2"
            autoComplete="off"
          ></input>
        </div>
      </>
    );
    grid = "grid-cols-[164px_1fr_1fr]";
  } else {
    buttons = (
      <>
        <button
          className=" cursor-pointer flex items-center justify-center"
          type="button"
          onClick={handleEditClick}
        >
          <img
            className="h-[1.3rem] w-[1.3rem] transition-[height] active:h-[1rem]"
            src={icons.pencil}
            alt="Logo"
          />
        </button>
        <button
          className=" cursor-pointer flex items-center justify-center"
          type="button"
          onClick={() => handleDelete(deckId, card.id)}
        >
          <img
            className="h-[1.3rem] w-[1.3rem] transition-[height] active:h-[1rem]"
            src={icons.trash}
            alt="Logo"
          />
        </button>
      </>
    );
    content = (
      <>
        <div className="rounded-l-md border-r-2 flex items-center py-1 px-2 justify-center">
          {i + 1}
        </div>
        <div className="border-r-2 flex items-center py-1 px-2 text-3xl">
          {card.term}
        </div>
        <div className="border-r-2 flex items-center py-1 px-2">
          {card.pinyin}
        </div>
        <div className="py-1 px-2 flex items-center">{card.definition}</div>
      </>
    );
    grid = "grid-cols-[64px_50px_1fr_1fr_1fr]";
  }

  return (
    <form
      className={`w-full grid ${grid} border-2 rounded-xl`}
      onSubmit={handleSubmit}
    >
      <div className="h-full border-r-2 flex items-center justify-center gap-2">
        {buttons}
      </div>
      {content}
    </form>
  );
}

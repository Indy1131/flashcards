import { useState } from "react";
import type { PreCard, PreSentence } from "../../decks/utilities";
import { icons } from "../icons";

type SentenceCardProps = {
  deckId: string;
  card: PreSentence & PreCard;
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
  handleFavorite: (deckId: string, cardId: string, value: boolean) => void;
  className?: string;
};

export default function SentenceCard({
  deckId,
  card,
  i,
  creating,
  cancel,
  handleCreate,
  handleEdit,
  handleDelete,
  handleFavorite,
  className,
}: SentenceCardProps) {
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
          className={`cursor-pointer ${
            creating && "flex-1"
          } flex items-center justify-center bg-blue-500 border-2 border-blue-500 text-white py-1 px-2 rounded-md text-sm`}
        >
          {editing ? "Apply" : "Create Sentence"}
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
        <div className={`${editing && "border-r-1"} flex items-center px-2`}>
          <input
            placeholder="Term"
            value={formData.term}
            onChange={handleChange}
            name="term"
            className="border-1 rounded-md w-full px-2 auto"
            autoComplete="off"
          />
        </div>
        <div className="flex items-center px-2">
          <input
            placeholder="Definition"
            value={formData.definition}
            onChange={handleChange}
            name="definition"
            className="border-1 rounded-md w-full px-2"
            autoComplete="off"
          />
        </div>
      </>
    );
    grid = creating ? "grid-cols-[200px_1fr_1fr]" : "grid-cols-[150px_1fr_1fr]";
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
        <button
          className=" cursor-pointer flex items-center justify-center"
          type="button"
          onClick={() => handleFavorite(deckId, card.id, !card.favorite)}
        >
          <img
            className="h-[1.3rem] w-[1.3rem] transition-[height] active:h-[1rem]"
            src={card.favorite ? icons.star : icons.starEmpty}
            alt="Logo"
          />
        </button>
      </>
    );
    content = (
      <>
        <div className="rounded-l-md border-r-1 flex items-center py-1 px-2 justify-center">
          {i + 1}
        </div>
        <div className="border-r-1 flex items-center py-1 px-2 text-2xl">
          {card.term}
        </div>
        <div className="flex flex-col justify-center">
          <div className="border-b-1 py-1 px-2 flex items-center h-full">
            {card.pinyin}
          </div>
          <div className="py-1 px-2 flex items-center h-full">
            {card.definition}
          </div>
        </div>
      </>
    );
    grid = "grid-cols-[100px_50px_1fr_1fr]";
  }

  return (
    <form
      className={`w-full grid items-stretch ${className} ${
        !creating ? "min-h-[76px]" : "min-h-[46px]"
      } relative ${grid} ${
        i % 2 == 0 && !creating ? "bg-blue-200/50" : "break-all bg-transparent"
      }`}
      onSubmit={handleSubmit}
    >
      <div
        className={`h-full ${
          !creating && "border-r-1"
        } flex items-center justify-center gap-2`}
      >
        {buttons}
      </div>
      {content}
    </form>
  );
}

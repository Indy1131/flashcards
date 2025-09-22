import { useState } from "react";
import { icons } from "../icons";
import type { Deck } from "../../decks/utilities";
import Eye from "./Eye";
import { usePopup } from "../../providers/popup/usePopup";

type FolderOption = { id: string; name: string };

type DeckButtonProps = {
  deck: Deck;
  selected?: boolean;
  editDeck: (formData: {
    id: string;
    name: string;
    desc: string;
    parent: string;
  }) => void;
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
  folderOptions?: FolderOption[]; // <-- Add this prop
  moveDeck?: (id: string, newParent: string) => void; // <-- Add this prop
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
  folderOptions = [],
  moveDeck,
}: DeckButtonProps) {
  const [formData, setFormData] = useState({
    name: deck?.name || "",
    desc: deck?.desc || "",
    parent: deck?.parent || "",
  });
  const [editing, setEditing] = useState(false);
  const [moving, setMoving] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState(
    deck ? deck.parent : null
  );

  const { showPopup } = usePopup();

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (editing) {
      setEditing(false);
      editDeck({ id: deck.id, ...formData });
    } else if (creating && handleCreate) {
      handleCreate(formData);
    } else if (moving) {
      setMoving(false);
    }
    setFormData({ name: "", desc: "", parent: "" });
  }

  function handleEditClick(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    setEditing(true);
    setFormData({ name: deck.name, desc: deck.desc, parent: deck.parent });
  }

  function handleMoveClick(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    setMoving(true);
    setSelectedFolder(deck.parent);
  }

  function handleCancel() {
    if (cancel) {
      cancel();
    } else {
      setEditing(false);
      setMoving(false);
    }
  }

  function handleDeleteClick() {
    showPopup({
      title: "Delete Deck?",
      description: `Are you sure you want to delete "${deck.name}"? This will delete all cards associated with "${deck.name}." This action cannot be undone.`,
      acceptText: "Delete",
      declineText: "Cancel",
      onAccept: () => deleteDeck(deck.id),
    });
  }

  let buttons;
  let content;
  let grid;

  if (creating || editing) {
    buttons = (
      <>
        <button
          type="submit"
          className={`cursor-pointer ${
            creating && "flex-1"
          } flex items-center justify-center bg-blue-500 border-2 border-blue-500 text-white py-1 px-2 rounded-md text-sm`}
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
        <div
          className={` ${
            !creating && "border-r-1"
          } flex items-center py-1 px-2 break-all whitespace-normal`}
        >
          <input
            className="border-1 rounded-md w-full px-2"
            value={formData.name}
            onChange={handleChange}
            name="name"
            placeholder="Deck Name"
          />
        </div>
        <div
          className={` ${
            !creating && "border-r-1"
          } flex items-center py-1 px-2 break-all whitespace-normal`}
        >
          <input
            className="border-1 rounded-md w-full px-2"
            value={formData.desc}
            onChange={handleChange}
            name="desc"
            placeholder="Description"
          />
        </div>
      </>
    );
    grid = creating ? "grid-cols-[200px_1fr_1fr]" : "grid-cols-[1fr_1fr_150px]";
  } else if (moving) {
    buttons = (
      <>
        <button
          type="button"
          className="cursor-pointer flex-1 flex items-center justify-center bg-blue-500 border-2 border-blue-500 text-white py-1 px-2 rounded-md text-sm"
          onClick={() => {
            if (moveDeck) {
              moveDeck(deck.id, selectedFolder);
            }
            setMoving(false);
          }}
        >
          Move
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
      <div className="flex items-center py-1 px-2 w-full">
        <select
          className="border-1 rounded-md w-full px-2"
          name="parent"
          value={selectedFolder ? selectedFolder : "Root"}
          onChange={(e) => setSelectedFolder(e.target.value)}
        >
          {folderOptions.map((folder) => {
            return (
              <option key={folder.id} value={folder.id}>
                {folder.name}
              </option>
            );
          })}
        </select>
      </div>
    );
    grid = "grid-cols-[1fr_150px]";
  } else {
    buttons = (
      <>
        <div className="flex items-center">
          <Eye deckIds={[deck.id]} />
        </div>
        <button
          className="cursor-pointer flex items-center justify-center"
          type="button"
          onClick={handleMoveClick}
        >
          <img
            className="h-[1.3rem] w-[1.3rem] transition-[height]"
            src={icons.move}
            alt="Move"
          />
        </button>
        <button
          className="cursor-pointer flex items-center justify-center"
          type="button"
          onClick={handleEditClick}
        >
          <img
            className="h-[1.3rem] w-[1.3rem] transition-[height]"
            src={icons.pencil}
            alt="Edit"
          />
        </button>
        <button
          className="cursor-pointer flex items-center justify-center"
          type="button"
          onClick={handleDeleteClick}
        >
          <img
            className="h-[1.3rem] w-[1.3rem] transition-[height]"
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
          className="select-none cursor-pointer flex items-center justify-end"
          onClick={() => handleSelect(deck.id)}
        >
          <img
            className="h-[1.3rem] w-[1.3rem] transition-[height]"
            src={icons.deck}
            alt="Edit"
          />
        </div>
        <div className="flex items-center w-full overflow-hidden cursor-pointer">
          <div
            className="select-none flex items-center py-1 pl-2 whitespace-nowrap cursor-pointer pointer-events-auto"
            onClick={() => handleSelect(deck.id)}
          >
            {deck.name}
          </div>
          <div
            className="flex flex-1 h-full items-center"
            onClick={() => handleSelect(deck.id)}
          >
            <div className="text-blue-500/90 select-none truncate overflow-hidden whitespace-nowrap flex-1 pl-2 py-1 text-xs">
              {deck.desc}
            </div>
          </div>
        </div>
      </>
    );
    grid = "grid-cols-[50px_30px_1fr_124px]";
  }

  return (
    <form
      className={`w-full grid items-stretch min-h-[46px] relative ${grid} ${
        i % 2 == 0 && !creating ? "bg-blue-200/50" : "break-all bg-transparent"
      } ${className || ""}`}
      onSubmit={handleSubmit}
    >
      {creating && (
        <div
          className={`select-none h-full flex items-center justify-end pr-2 gap-2`}
        >
          {buttons}
        </div>
      )}
      {content}
      {!creating && (
        <div
          className={`select-none h-full flex items-center justify-end pr-2 gap-2`}
        >
          {buttons}
        </div>
      )}
    </form>
  );
}

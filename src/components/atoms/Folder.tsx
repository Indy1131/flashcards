import { useState } from "react";
import { icons } from "../icons";
import type { FolderType } from "../../decks/utilities";
import { usePopup } from "../../providers/popup/usePopup";

type FolderOption = { id: string; name: string };

type FolderProps = {
  folder: FolderType;
  editFolder: (formData: { id: string; name: string }) => void;
  deleteFolder: (id: string) => void;
  onClick: (id: string | null) => void;
  i: number;
  creating?: boolean;
  cancel?: () => void;
  handleCreate?: (formData: { name: string }) => void;
  className?: string;
  folderOptions?: FolderOption[];
  moveFolder?: (id: string, newParent: string) => void;
};

export default function Folder({
  folder,
  editFolder,
  deleteFolder,
  onClick,
  i,
  creating,
  cancel,
  handleCreate,
  className,
  folderOptions = [],
  moveFolder,
}: FolderProps) {
  const [formData, setFormData] = useState({
    name: folder?.name || "",
  });
  const [editing, setEditing] = useState(false);
  const [moving, setMoving] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState(folder?.parent || "");

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
      editFolder({ id: folder.id, ...formData });
    } else if (creating && handleCreate) {
      handleCreate(formData);
    } else if (moving) {
      setMoving(false);
      if (moveFolder) {
        moveFolder(folder.id, selectedFolder);
      }
    }
    setFormData({ name: "" });
  }

  function handleEditClick(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    setEditing(true);
    setFormData({ name: folder.name });
  }

  function handleMoveClick(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    setMoving(true);
    setSelectedFolder(folder?.parent || "");
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
      title: "Folder Deletion",
      description: `Are you sure you want to delete "${folder.name}"? This will move all folders and decks associated with "${folder.name}" into the current directory. This action cannot be undone.`,
      acceptText: "Delete",
      declineText: "Cancel",
      onAccept: () => {
        deleteFolder(folder.id);
      },
      onDecline: () => {},
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
          {editing ? "Apply" : "Create Folder"}
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
            placeholder="Folder Name"
          />
        </div>
      </>
    );
    grid = creating ? "grid-cols-[200px_1fr]" : "grid-cols-[1fr_150px]";
  } else if (moving) {
    buttons = (
      <>
        <button
          type="button"
          className="cursor-pointer flex-1 flex items-center justify-center bg-blue-500 border-2 border-blue-500 text-white py-1 px-2 rounded-md text-sm"
          onClick={() => {
            if (moveFolder) {
              moveFolder(folder.id, selectedFolder);
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
          value={selectedFolder}
          onChange={(e) => setSelectedFolder(e.target.value)}
        >
          {folderOptions
            .filter((option) => option.id !== folder.id)
            .map((option) => (
              <option key={option.id} value={option.id}>
                {option.name}
              </option>
            ))}
        </select>
      </div>
    );
    grid = "grid-cols-[1fr_150px]";
  } else {
    buttons = (
      <>
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
        <div className="select-none cursor-pointer flex items-center justify-end">
          <img
            className="h-[1.3rem] w-[1.3rem] transition-[height]"
            src={icons.folder}
            alt="Edit"
          />
        </div>
        <div
          onClick={() => onClick(folder.id)}
          className="flex items-center py-1 px-2 break-all whitespace-normal cursor-pointer select-none"
        >
          {folder.name}
        </div>
      </>
    );
    grid = "grid-cols-[30px_1fr_124px]";
  }

  return (
    <form
      className={`w-full grid items-stretch min-h-[46px] pointer-events-auto cursor-pointer relative ${grid} ${
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

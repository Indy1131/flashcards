import { useState } from "react";
import { icons } from "../icons";
import type { FolderType } from "../../decks/utilities";

type FolderProps = {
  folder: FolderType;
  editFolder: (folder: FolderType) => void;
  deleteFolder: (id: string) => void;
  onClick: (id: string | null) => void;
  i: number;
  creating?: boolean;
  cancel?: () => void;
  handleCreate?: (formData: { name: string; parent: string }) => void;
  className?: string;
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
}: FolderProps) {
  const [formData, setFormData] = useState({
    name: folder?.name || "",
    parent: folder?.parent || "",
  });
  const [editing, setEditing] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (editing) {
      setEditing(false);
      editFolder({ id: folder.id, ...formData });
    } else if (creating && handleCreate) {
      handleCreate(formData);
    }
    setFormData({ name: "", parent: "" });
  }

  function handleEditClick(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    setEditing(true);
    setFormData({ name: folder.name, parent: folder.parent });
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
        <div className="border-r-1 flex items-center py-1 px-2 break-all whitespace-normal">
          <input
            className="border-1 rounded-md w-full px-2"
            value={formData.name}
            onChange={handleChange}
            name="name"
            placeholder="Folder Name"
          />
        </div>
        <div className="py-1 px-2 flex items-center break-all whitespace-normal">
          <input
            className="border-1 rounded-md w-full px-2"
            value={formData.parent}
            onChange={handleChange}
            name="parent"
            placeholder="Parent ID"
          />
        </div>
      </>
    );
    grid = creating ? "grid-cols-[200px_1fr_1fr]" : "grid-cols-[1fr_1fr_150px]";
  } else {
    buttons = (
      <>
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
          onClick={() => deleteFolder(folder.id)}
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
        <div className="cursor-pointer flex items-center justify-end">
          <img
            className="h-[1.3rem] w-[1.3rem] transition-[height] active:h-[1rem]"
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
    grid = "grid-cols-[30px_1fr_64px]";
  }

  return (
    <form
      className={`w-full grid items-stretch min-h-[46px] pointer-events-auto cursor-pointer relative ${grid} ${
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

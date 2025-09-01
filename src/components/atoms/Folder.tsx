import { useState } from "react";
import { icons } from "../icons";
import type { FolderType } from "../../decks/utilities";

type FolderProps = {
  folder: FolderType;
  editFolder: (folder: FolderType) => void;
  onClick: (id: string | null) => void;
  className?: string;
};

export default function Folder({
  folder,
  editFolder,
  onClick,
  className,
}: FolderProps) {
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: folder.name,
    parent: folder.parent,
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  function handleSubmitClick() {
    setEditing(false);
    editFolder({ id: folder.id, ...formData });
  }

  return (
    <div
      className={`relative flex flex-col border-2 gap-1 rounded-md hover:bg-blue-100 p-2 transition-all cursor-pointer h-[124px] ${className} `}
    >
      <div className="flex items-center gap-1 select-none">
        {!editing ? (
          <div className="flex-1" onClick={() => onClick(folder.id)}>
            {folder.name}
          </div>
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
        {!editing && (
          <>
            <button
              className="cursor-pointer ml-auto"
              onClick={() => setEditing(true)}
            >
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
    </div>
  );
}

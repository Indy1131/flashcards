import { useEffect, useState } from "react";
import type { FolderType } from "../../decks/utilities";
import Folder from "../atoms/Folder";
import DeckButton, { type FakeDeck } from "../atoms/DeckButton";
import { useAuth } from "../../providers/auth/useAuth";
import { useDeck } from "../../providers/deck/useDeck";

type SelectWindowProps = {
  changeDecks: (newIds: string[]) => void;
};

type Data = {
  prevId: string;
  folders: FolderType[];
  decks: FakeDeck[];
};

export default function SelectWindow({ changeDecks }: SelectWindowProps) {
  const [parent, setParent] = useState<string | null>(null);
  const [selected, setSelected] = useState(new Set<string>());
  const [data, setData] = useState<Data | null>(null);

  const { fetchWithAuth } = useAuth();
  const { hideWindow } = useDeck();

  function editFolder(formData: FolderType) {
    try {
      //FETCHING LOGIC
    } catch {}

    setData((prev) => ({
      ...prev,
      folders: prev.folders.map((folder) =>
        folder.id === formData.id ? { ...folder, ...formData } : folder
      ),
    }));
  }

  function editDeck(formData: FakeDeck) {
    try {
      //FETCHING LOGIC
    } catch {}

    setData((prev) => ({
      ...prev,
      decks: prev.decks.map((deck) =>
        deck.id === formData.id ? { ...deck, ...formData } : deck
      ),
    }));
  }

  function handleSelect(id: string) {
    const newSelected = new Set(selected);
    if (selected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }

    setSelected(newSelected);
  }

  function handleClearSelectedClick() {
    setSelected(new Set());
  }

  function handleLoadSelected() {
    hideWindow();
    changeDecks(Array.from(selected));
  }

  function handleFolderClick(id: string | null) {
    setParent(id);
  }

  function handleGoBack(id: string | null) {
    setParent(id);
  }

  useEffect(() => {
    async function getData() {
      const url = `${import.meta.env.VITE_API_BASE_URL}/get-folder-contents/${
        parent ? `?parent=${parent}&current=${data?.prevId || ""}` : ""
      }`;
      const response = await fetchWithAuth(url);
      const json = await response.json();
      setData(json);
    }
    getData();
  }, [parent, fetchWithAuth]);

  return (
    <div>
      <div className="flex justify-between items-center h-[2rem]">
        <h1>{parent == null ? "Root Directory" : parent}</h1>
        {parent && (
          <div
            className="cursor-pointer bg-blue-500 text-white p-2 rounded-md"
            onClick={() => handleGoBack(data?.prevId || null)}
          >
            Go back
          </div>
        )}
        <div className={`flex gap-2 ${selected.size == 0 && "opacity-0"}`}>
          <button
            className="bg-blue-500 text-white cursor-pointer p-2 rounded-md mt-2 transition-opacity"
            onClick={handleLoadSelected}
          >
            Load Selection {`(${selected ? selected.size : "D"})`}
          </button>
          <button
            className="bg-blue-500 text-white cursor-pointer p-2 rounded-md mt-2 transition-opacity"
            onClick={handleClearSelectedClick}
          >
            Clear Selection
          </button>
        </div>
      </div>

      <h1 className="text-3xl my-2">Contents</h1>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-2">
        {data &&
          data.folders.map((folder) => (
            <Folder
              folder={folder}
              key={folder.id}
              editFolder={editFolder}
              onClick={handleFolderClick}
            />
          ))}
        {data &&
          data.decks.map((deck) => (
            <DeckButton
              deck={deck}
              selected={selected.has(deck.id)}
              key={deck.id}
              editDeck={editDeck}
              handleSelect={handleSelect}
            />
          ))}
      </div>
      {/* <div className="border-2 my-2">New Folder</div>
      <div>New Deck</div> */}
    </div>
  );
}

import { useEffect, useState } from "react";
import type { Deck, FolderType } from "../../decks/utilities";
import Folder from "../atoms/Folder";
import DeckButton from "../atoms/DeckButton";
import { useAuth } from "../../providers/auth/useAuth";
import { useDeck } from "../../providers/deck/useDeck";
import CreateFolder from "../atoms/CreateFolder";
import Scrollable from "../atoms/Scrollable";
import CreateDeck from "../atoms/CreateDeck";

type SelectWindowProps = {
  changeDecks: (newIds: string[], special: boolean) => void;
  parentProp: string | null;
};

type Data = {
  name: string;
  prevId: string | null;
  folders: FolderType[];
  decks: Deck[];
};

const TRANSITION_DURATION = 150;

export default function SelectWindow({
  changeDecks,
  parentProp,
}: SelectWindowProps) {
  const [parent, setParent] = useState<string | null>(parentProp);

  const [selected, setSelected] = useState(new Set<string>());
  const [data, setData] = useState<Data | null>(null);

  const [prev, setPrev] = useState<Data | null>(null);

  const [dataVisible, setDataVisible] = useState(true);

  const { fetchWithAuth } = useAuth();
  const { hideWindow } = useDeck();

  // useEffect(() => {
  //   if (data) {
  //     // Ensure it starts hidden
  //     setDataVisible(false);

  //     // Flip to visible on the next tick
  //     const id = requestAnimationFrame(() => setDataVisible(true));
  //     return () => cancelAnimationFrame(id);
  //   }
  // }, [data]);

  useEffect(() => {
    setParent(parentProp);
  }, [parentProp]);

  function editFolder(formData: FolderType) {
    // try {
    // } catch {}
    // setData((prev) => ({
    //   ...prev,
    //   folders: prev.folders.map((folder) =>
    //     folder.id === formData.id ? { ...folder, ...formData } : folder
    //   ),
    // }));
  }

  function editDeck(formData: Deck) {
    try {
      //FETCHING LOGIC
    } catch {}

    // setData((prev) => ({
    //   ...prev,
    //   decks: prev.decks.map((deck) =>
    //     deck.id === formData.id ? { ...deck, ...formData } : deck
    //   ),
    // }));
  }

  function handleSelect(id: string) {
    if (prev) return;

    const newSelected = new Set(selected);
    if (selected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }

    setSelected(newSelected);
  }

  function handleClearSelectedClick() {
    if (prev) return;

    setSelected(new Set());
  }

  function handleLoadSelected() {
    if (prev) return;

    hideWindow();
    changeDecks(Array.from(selected));
  }

  function handleFolderClick(id: string | null) {
    if (prev) return;

    setParent(id);
  }

  function handleGoBack(id: string | null) {
    if (prev) return;

    setParent(id);
  }

  function handleLoadFavoritesClick() {
    if (prev) return;

    hideWindow();
    changeDecks(["favorites"], true);
  }

  useEffect(() => {
    async function getData() {
      await new Promise((resolve) => setTimeout(resolve, 150));

      const url = `${import.meta.env.VITE_API_BASE_URL}/get-folder-contents/${
        parent ? `?parent=${parent}` : ""
      }`;
      const response = await fetchWithAuth(url);
      const json = await response.json();
      // setDataVisible(false);
      // setPrev(data);
      setData(json);
      // setTimeout(() => {
      //   setPrev(null);
      // }, TRANSITION_DURATION);
    }
    getData();
  }, [parent, fetchWithAuth]);

  async function handleCreateFolder(formData: { name: string }) {
    const url = `${import.meta.env.VITE_API_BASE_URL}/create-folder/`;
    const response = await fetchWithAuth(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: formData.name, parent: parent }),
    });

    if (response.status != 200) return;

    const json = await response.json();

    const newFolders = data.folders.map((item) => item);
    newFolders.push(json.folder);

    setData({ ...data, folders: newFolders });
  }

  async function handleCreateDeck(formData: { name: string; desc: string }) {
    const url = `${import.meta.env.VITE_API_BASE_URL}/create-deck/`;
    const response = await fetchWithAuth(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: formData.name,
        desc: formData.desc,
        parent: parent,
      }),
    });

    if (response.status != 200) return;

    const json = await response.json();

    const newFolders = data.decks.map((item) => item);
    newFolders.push(json.deck);

    setData({ ...data, decks: newFolders });
  }

  return (
    <div className="relative flex flex-col h-full">
      <div className="flex my-3 gap-2">
        <div
          className="cursor-pointer bg-blue-500 text-white p-2 rounded-md"
          onClick={handleLoadFavoritesClick}
        >
          Load Favorites
        </div>
        <div className="cursor-pointer bg-blue-500 text-white p-2 rounded-md">
          Load Recent
        </div>
      </div>
      <div className="flex gap-2 items-center justify-between w-full h-[2rem] mb-2">
        <div className="flex-1 relative flex items-center h-full">
          <h1
            className={`text-4xl duration-[${TRANSITION_DURATION}ms] ${
              dataVisible
                ? "opacity-100 transition-opacity"
                : "opacity-0 transition-none"
            }
          `}
          >
            {data ? data.name : "Loading"}
          </h1>
        </div>

        <div className="flex gap-2">
          <div
            className={`flex gap-2 transition-opacity ${
              selected.size == 0 && "opacity-0"
            }`}
          >
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
          <button
            className={`cursor-pointer bg-blue-500 text-white p-2 rounded-md mt-2 transition-opacity duration-[${TRANSITION_DURATION}ms] ${
              parent ? "opacity-100" : "opacity-0"
            }`}
            onClick={() => handleGoBack(data?.prevId || null)}
          >
            Go back
          </button>
        </div>
      </div>

      <Scrollable
        scrollAccent="scrollbar-thumb-blue-500"
        className={`duration-[${TRANSITION_DURATION}ms] flex-1 will-change-opacity absolute w-full grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-2 ${
          dataVisible
            ? "opacity-100 transition-opacity"
            : "opacity-0 transition-none"
        }`}
      >
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
        <div className="col-span-full h-[100px] flex flex-col gap-2">
          <CreateFolder handleCreate={handleCreateFolder} />
          <CreateDeck handleCreate={handleCreateDeck} />
        </div>
      </Scrollable>

      {/* <div
        className={`duration-[${TRANSITION_DURATION}ms] will-change-opacity invisible absolute w-full grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-2 pointer-events-none ${
          prev
            ? "visible transition-opacity opacity-0"
            : "transition-none opacity-100"
        }`}
      >
        {!prev || (prev.folders.length < 1 && <h1>No Folders</h1>)}
        {prev &&
          prev.folders.map((folder) => (
            <Folder
              folder={folder}
              key={folder.id}
              editFolder={editFolder}
              onClick={handleFolderClick}
            />
          ))}
        <div className="col-span-full text-3xl">Decks</div>
        {!prev || (prev.decks.length < 1 && <h1>No Decks</h1>)}
        {prev &&
          prev.decks.map((deck) => (
            <DeckButton
              deck={deck}
              selected={selected.has(deck.id)}
              key={deck.id}
              editDeck={editDeck}
              handleSelect={handleSelect}
            />
          ))}
      </div> */}
    </div>
  );
}

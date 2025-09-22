import { useEffect, useState } from "react";
import type { Deck, FolderType } from "../../decks/utilities";
import Folder from "../atoms/Folder";
import DeckButton from "../atoms/DeckButton";
import { useAuth } from "../../providers/auth/useAuth";
import { useDeck } from "../../providers/deck/useDeck";
import Scrollable from "../atoms/Scrollable";
import { icons } from "../icons";

type SelectWindowProps = {
  changeDecks: (newIds: string[], special: boolean) => void;
  deckData: { parent: string | null; type: "selection" } | null;
  viewedIds: string[];
  refreshDeck: (newCurrent?: string[]) => void;
  windowTransitionClose: () => void;
};

type Data = {
  name: string;
  prevId: string | null;
  prevName: string;
  folders: FolderType[];
  decks: Deck[];
};

export default function SelectWindow({
  changeDecks,
  deckData,
  viewedIds,
  refreshDeck,
  windowTransitionClose,
}: SelectWindowProps) {
  const [parent, setParent] = useState<string | null>(deckData?.parent || null);
  const [selected, setSelected] = useState(new Set<string>());
  const [data, setData] = useState<Data | null>(null);
  const [createType, setCreateType] = useState<string>("folder");
  const [creating, setCreating] = useState(false);

  const { fetchWithAuth } = useAuth();

  function checkRefresh(deckId: string) {
    if (viewedIds.find((id) => id == deckId))
      refreshDeck(viewedIds.filter((id) => id !== deckId));
  }

  useEffect(() => {
    setParent(deckData?.parent || null);
  }, [deckData]);

  function editFolder(formData: { id: string; name: string }) {
    const url = `${import.meta.env.VITE_API_BASE_URL}/edit-folder/`;
    fetchWithAuth(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    // Optimistically update local state
    setData((prev) =>
      prev
        ? {
            ...prev,
            folders: prev.folders.map((folder) =>
              folder.id === formData.id ? { ...folder, ...formData } : folder
            ),
          }
        : prev
    );
  }

  function editDeck(formData: { id: string; name: string; desc: string }) {
    const url = `${import.meta.env.VITE_API_BASE_URL}/edit-deck/`;
    fetchWithAuth(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    // Optimistically update local state
    setData((prev) =>
      prev
        ? {
            ...prev,
            decks: prev.decks.map((deck) =>
              deck.id === formData.id ? { ...deck, ...formData } : deck
            ),
          }
        : prev
    );
  }

  async function deleteFolder(id: string) {
    const url = `${import.meta.env.VITE_API_BASE_URL}/delete-folder/`;
    const response = await fetchWithAuth(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    if (response.status !== 200) return;

    const json = await response.json();

    setData((prev) =>
      prev
        ? {
            ...prev,
            folders: [
              ...prev.folders.filter((folder) => folder.id !== id),
              ...(json.addedFolders || []),
            ],
            decks: [...prev.decks, ...(json.addedDecks || [])],
          }
        : prev
    );
  }

  function deleteDeck(id: string) {
    checkRefresh(id);
    const url = `${import.meta.env.VITE_API_BASE_URL}/delete-deck/`;
    fetchWithAuth(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    setData((prev) =>
      prev
        ? {
            ...prev,
            decks: prev.decks.filter((deck) => deck.id !== id),
          }
        : prev
    );
  }

  function handleCreateClick(type: string) {
    setCreateType(type);
    setCreating(true);
  }

  function handleStopCreate() {
    setCreating(false);
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
    windowTransitionClose();
    changeDecks(Array.from(selected));
  }

  function handleFolderClick(id: string | null) {
    setParent(id);
  }

  function handleGoBack(id: string | null) {
    setParent(id);
  }

  function handleLoadFavoritesClick() {
    windowTransitionClose();
    changeDecks(["favorites"], true);
  }

  useEffect(() => {
    async function getData() {
      // setData(null);
      await new Promise((resolve) => setTimeout(resolve, 150));

      const url = `${import.meta.env.VITE_API_BASE_URL}/get-folder-contents/${
        parent ? `?parent=${parent}` : ""
      }`;
      const response = await fetchWithAuth(url);
      const json = await response.json();
      setData(json);
    }
    getData();
  }, [parent, fetchWithAuth]);

  async function moveDeck(deckId: string, newParentId: string) {
    if (parent == newParentId) return;
    const url = `${import.meta.env.VITE_API_BASE_URL}/move-deck/`;
    const response = await fetchWithAuth(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: deckId,
        parent: newParentId == "Root" ? null : newParentId,
      }),
    });

    if (response.status !== 200) return;

    // Optionally update local state if needed

    setData((prev) =>
      prev
        ? {
            ...prev,
            decks: prev.decks.filter((deck) => deck.id != deckId),
          }
        : prev
    );
  }

  async function moveFolder(folderId: string, newParentId: string) {
    if (parent == newParentId) return;
    const url = `${import.meta.env.VITE_API_BASE_URL}/move-folder/`;
    const response = await fetchWithAuth(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: folderId,
        parent: newParentId == "Root" ? null : newParentId,
      }),
    });

    if (response.status !== 200) return;

    // Optimistically remove folder from current list
    setData((prev) =>
      prev
        ? {
            ...prev,
            folders: prev.folders.filter((folder) => folder.id !== folderId),
          }
        : prev
    );
  }

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

  const folderOptions = data
    ? data.folders.map((folder) => {
        return { id: folder.id, name: folder.name };
      })
    : null;

  if (data && folderOptions) {
    folderOptions.unshift({ id: parent, name: data.name });
    if (data.name != "Root") {
      const prevName = data.prevName ? data.prevName : "Root";
      folderOptions.unshift({ id: data.prevId, name: prevName });
    }
  }

  return (
    <>
      <div className="border-2 rounded-md p-2 mb-2">
        <button
          className="select-none cursor-pointer flex items-center h-[1.3rem]"
          onClick={handleLoadFavoritesClick}
        >
          <img
            src={icons.starEmpty}
            className="relative z-20 cursor-pointer h-[1.3rem] w-[1.3rem] transition-[height] active:h-[1rem]"
            alt="Filter"
          />
        </button>
      </div>
      <Scrollable
        scrollAccent="scrollbar-thumb-blue-500"
        className="gap-[0px] flex-1"
      >
        <div className="flex flex-col flex-1">
          {parent ? (
            <button
              onClick={() => handleGoBack(data?.prevId || null)}
              className="
            text-blue-500 w-[100px] flex items-center text-sm cursor-pointer rounded-md mb-[.75rem]"
            >
              <img
                className="h-[1.5rem] w-[1.5rem] inline-block mr-2"
                src={icons.backArrowBlue}
                alt="Logo"
              />
              Back
            </button>
          ) : (
            <div className="text-xs h-[calc(1.5rem+12px)] pb-1 pl-2 flex items-end">
              {/* This is the root directory. */}
            </div>
          )}
          <div className="text-blue-500  border-1 rounded-t-md">
            <h1 className="select-none text-4xl font-semibold py-1 px-2 border-b-1 flex items-center">
              <img
                className="h-[1.5rem] w-[1.5rem] inline-block mr-2"
                src={icons.folder}
                alt="Logo"
              />
              {data ? data.name : "Loading"}

              <div
                className={`ml-auto text-sm transition-opacity flex gap-2 ${
                  selected.size > 0 ? "opacity-100" : "opacity-0"
                }`}
              >
                <button
                  onClick={handleLoadSelected}
                  className="cursor-pointer font-normal text-white bg-blue-500 border-blue-500 border-2 rounded-md py-1 text-sm flex items-center pr-2"
                >
                  <img
                    className="h-[1.3rem] w-[1.3rem] transition-[height] mx-1 active:h-[1rem]"
                    src={icons.load}
                    alt="Logo"
                  />
                  Load Selection
                </button>
                <button
                  onClick={handleClearSelectedClick}
                  className="cursor-pointer font-normal text-blue-500 border-2 rounded-md py-1 text-sm flex items-center pr-2"
                >
                  <img
                    className="h-[1.3rem] w-[1.3rem] transition-[height] mx-1 active:h-[1rem]"
                    src={icons.trash}
                    alt="Logo"
                  />
                  Clear Selection
                </button>
              </div>
            </h1>
            <div className="w-full text-sm py-1 px-2 border-blue-500">
              <p className="text-right">{selected.size} Decks Selected</p>
            </div>
          </div>
          <div
            className={`grid divide-y-1 rounded-b-md ${
              data &&
              data.folders.length + data.decks.length > 0 &&
              "border-b-1"
            } border-x-1`}
          >
            {data &&
              data.folders.map((folder, i) => {
                // If there are no decks, make the last folder row rounded
                const isLastFolder =
                  data.decks.length === 0 && i === data.folders.length - 1;
                return (
                  <Folder
                    folder={folder}
                    i={i}
                    key={folder.id}
                    editFolder={editFolder}
                    deleteFolder={deleteFolder}
                    onClick={handleFolderClick}
                    className={
                      (data.decks.length + data.folders.length === 1 &&
                        i === 0) ||
                      isLastFolder
                        ? "rounded-b-md"
                        : ""
                    }
                    folderOptions={folderOptions}
                    moveFolder={moveFolder}
                  />
                );
              })}
            {data &&
              data.decks.map((deck, i) => {
                const isLast =
                  (i === data.decks.length - 1 && data.folders.length === 0) ||
                  (i === data.decks.length - 1 &&
                    data.folders.length > 0 &&
                    data.folders.length + data.decks.length - 1 ===
                      i + data.folders.length);
                return (
                  <DeckButton
                    deck={deck}
                    i={i + data.folders.length}
                    selected={selected.has(deck.id)}
                    key={deck.id}
                    editDeck={editDeck}
                    deleteDeck={deleteDeck}
                    handleSelect={handleSelect}
                    className={isLast ? "rounded-b-md" : ""}
                    folderOptions={folderOptions}
                    moveDeck={moveDeck}
                  />
                );
              })}
          </div>
          <div className="flex items-center gap-2 mb-4 mt-[12px]">
            {!creating ? (
              <div className="flex gap-2 h-[46px] py-1">
                <button
                  onClick={() => handleCreateClick("folder")}
                  className="cursor-pointer text-blue-500 border-2 rounded-md py-2 text-sm flex items-center pr-2"
                >
                  <img
                    className="h-[1.3rem] w-[1.3rem] transition-[height] active:h-[1rem]"
                    src={icons.plus}
                    alt="Logo"
                  />
                  Folder
                </button>
                <button
                  onClick={() => handleCreateClick("deck")}
                  className="cursor-pointer text-blue-500 border-2 rounded-md py-2 text-sm flex items-center pr-2"
                >
                  <img
                    className="h-[1.3rem] w-[1.3rem] transition-[height] active:h-[1rem]"
                    src={icons.plus}
                    alt="Logo"
                  />
                  Deck
                </button>
              </div>
            ) : createType == "folder" ? (
              <Folder
                creating={true}
                cancel={handleStopCreate}
                handleCreate={handleCreateFolder}
              />
            ) : (
              // TODO
              <DeckButton
                creating={true}
                cancel={handleStopCreate}
                handleCreate={handleCreateDeck}
              />
            )}
          </div>
        </div>
      </Scrollable>
    </>
  );
}

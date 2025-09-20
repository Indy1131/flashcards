import { useEffect, useState } from "react";
import type { Deck, FolderType } from "../../decks/utilities";
import Folder from "../atoms/Folder";
import DeckButton from "../atoms/DeckButton";
import { useAuth } from "../../providers/auth/useAuth";
import { useDeck } from "../../providers/deck/useDeck";
import CreateFolder from "../atoms/CreateFolder";
import Scrollable from "../atoms/Scrollable";
import CreateDeck from "../atoms/CreateDeck";
import { icons } from "../icons";

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
  const [createType, setCreateType] = useState<string>("folder");
  const [creating, setCreating] = useState(false);

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
    <>
      <div className="border-2 rounded-md p-2 mb-2">
        <button
          className="cursor-pointer flex items-center h-[1.3rem]"
          onClick={handleLoadFavoritesClick}
        >
          <img
            src={icons.starEmpty}
            className="relative z-20 cursor-pointer h-[1.3rem] w-[1.3rem] transition-[height] active:h-[1rem]"
            alt="Filter"
          />
        </button>
      </div>
      <div>
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
          <h1 className="text-4xl font-semibold py-1 px-2 border-b-1 flex items-center">
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
                className="cursor-pointer text-white bg-blue-500 border-blue-500 border-2 rounded-md py-1 text-sm flex items-center pr-2"
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
                className="cursor-pointer text-blue-500 border-2 rounded-md py-1 text-sm flex items-center pr-2"
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
        <Scrollable
          scrollAccent="scrollbar-thumb-blue-500"
          className="gap-[0px]"
        >
          <div className="grid divide-y-1 border-b-1 rounded-b-md border-x-1 overflow-hidden">
            {data &&
              data.folders.map((folder, i) => (
                <Folder
                  folder={folder}
                  i={i}
                  key={folder.id}
                  editFolder={editFolder}
                  onClick={handleFolderClick}
                />
              ))}
            {data &&
              data.decks.map((deck, i) => (
                <DeckButton
                  deck={deck}
                  i={i}
                  selected={selected.has(deck.id)}
                  key={deck.id}
                  editDeck={editDeck}
                  handleSelect={handleSelect}
                />
              ))}
          </div>
          <div className="flex items-center gap-2 mb-4 mt-[12px]">
            {!creating ? (
              <div className="flex gap-2 h-[46px] py-1">
                <button
                  onClick={() => handleCreateClick(deck.id, "pinyin")}
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
                  onClick={() => handleCreateClick(deck.id, "sentence")}
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
            ) : createType == "pinyin" ? (
              // TDOD
              <h1>Pinyin Card Creation Form</h1>
            ) : (
              // TODO
              <h1>Sentence Card Creation Form</h1>
            )}
          </div>
        </Scrollable>
      </div>
      {/* <button
        onClick={() => handleGoBack(data?.prevId || null)}
        className="text-blue-500 w-[100px] h-[40px] flex items-center text-sm cursor-pointer rounded-md"
      >
        <img
          className="h-[1.5rem] w-[1.5rem] inline-block mr-2"
          src={icons.backArrowBlue}
          alt="Logo"
        />
        Back
      </button>
      <div className="flex gap-2 items-center justify-between w-full mb-2">
        <div className="flex-1 relative flex items-center h-full border-1 rounded-md">
          <h1 className="text-4xl font-semibold py-1 px-2">
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
      </Scrollable> */}
    </>
  );
}

import { useEffect, useState } from "react";
import Deck from "./components/Deck";
import { DeckProvider } from "./providers/deck/DeckProvider";
import Window from "./components/atoms/Window";
import { useAuth } from "./providers/auth/useAuth";

function App() {
  const [current, setCurrent] = useState<string[]>([]);

  const { fetchWithAuth } = useAuth();

  useEffect(() => {
    async function getData() {
      const url = `${import.meta.env.VITE_API_BASE_URL}/get-last-viewed/`;
      const response = await fetchWithAuth(url);
      const json = await response.json();

      setCurrent(json.lastViewed);
    }

    getData();
  }, [fetchWithAuth]);

  async function changeDecks(newIds: string[], special = false) {
    if (special) {
      const url = `${import.meta.env.VITE_API_BASE_URL}/load-special/`;
      const response = await fetchWithAuth(url, {
        headers: { "Content-Type": "application/json" },
        method: "POST",
        body: JSON.stringify({ type: newIds[0] }),
      });
      const json = await response.json();

      if (response.status != 200) return;

      setCurrent([json.id]);
    } else {
      const url = `${import.meta.env.VITE_API_BASE_URL}/set-last-viewed/`;
      fetchWithAuth(url, {
        headers: { "Content-Type": "application/json" },
        method: "POST",
        body: JSON.stringify({ newIds }),
      });

      setCurrent(newIds);
    }
  }

  function refreshDeck(newCurrent?: string[]) {
    if (newCurrent) {
      setCurrent([...newCurrent]);
      return;
    }

    setCurrent([...current]);
  }

  return (
    <DeckProvider>
      <div className="h-screen bg-gradient-to-t from-blue-500 to-white overflow-hidden m-0 p-0">
        <Window
          changeDecks={changeDecks}
          refreshDeck={refreshDeck}
          viewedIds={current}
        />
        <Deck deckIds={current} />
      </div>
    </DeckProvider>
  );
}

export default App;

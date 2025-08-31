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

  function changeDecks(newIds: string[]) {
    const url = `${import.meta.env.VITE_API_BASE_URL}/set-last-viewed/`;
    fetchWithAuth(url, {
      headers: { "Content-Type": "application/json" },
      method: "POST",
      body: JSON.stringify({ newIds: newIds }),
    });

    setCurrent(newIds);
  }

  return (
    <DeckProvider>
      <div className="h-screen bg-gradient-to-t from-blue-500 to-white overflow-hidden m-0 p-0">
        <Window changeDecks={changeDecks} />
        <Deck deckIds={current} />
      </div>
    </DeckProvider>
  );
}

export default App;

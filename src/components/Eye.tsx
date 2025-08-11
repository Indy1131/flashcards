import { useDeck } from "../contexts/useDeck";
import type { Deck } from "../decks/utilities";

type Props = {
  deck: Deck;
};

export default function Eye({ deck }: Props) {
  const { showWindow } = useDeck();

  function handleClick() {
    showWindow({ type: "deck", deck: "dialogue1" });
  }

  return (
    <button
      className=" cursor-pointer rounded-md ml-auto"
      onClick={handleClick}
    >
      <img
        className="h-[1.3rem] w-[1.3rem] transition-[height] active:h-[1rem]"
        src="/eye.svg"
        alt="Logo"
      />
    </button>
  );
}

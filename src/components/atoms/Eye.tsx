import { useDeck } from "../../providers/deck/useDeck";
import { icons } from "../icons";

type Props = {
  deckNames: string[];
};

export default function Eye({ deckNames }: Props) {
  const { showWindow } = useDeck();

  function handleClick() {
    showWindow({ type: "deck", deckNames });
  }

  return (
    <button
      className=" cursor-pointer rounded-md ml-auto"
      onClick={handleClick}
    >
      <img
        className="h-[1.3rem] w-[1.3rem] transition-[height] active:h-[1rem]"
        src={icons.eye}
        alt="Logo"
      />
    </button>
  );
}

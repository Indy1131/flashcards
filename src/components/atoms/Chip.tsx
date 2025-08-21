import type { CardData } from "../../decks/utilities";

type Props = {
  card: CardData;
  number: number;
  handleJump: (next: number) => void;
};

export default function Chip({ card, number, handleJump }: Props) {
  function handleClick() {
    handleJump(number);
  }

  const accent =
    card.status == "correct"
      ? "from-green-500 to-green-400 text-green-700"
      : card.status == "incorrect"
      ? "from-red-500 to-red-400 text-red-900"
      : card.status == "guess"
      ? "from-amber-500 to-amber-400 text-amber-700"
      : "from-blue-300 to-blue-200 text-blue-500";

  return (
    <button
      onClick={handleClick}
      className={`bg-gradient-to-r ${accent} flex-1 transition-colors duration-300 cursor-pointer min-w-[75px] text-xs text-left px-2 hover:brightness-95`}
    >
      {number + 1}
    </button>
  );
}

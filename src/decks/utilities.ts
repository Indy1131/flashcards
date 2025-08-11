import { decks } from "./generatedDecks";

export type DeckWindow = {
  type: "deck";
  deck: string;
};

export type WindowTypes = DeckWindow | null;

export type CardModes = "pinyin" | "hanzi" | "sentence";

type PrePinyin = {
  mode: "pinyin";
  pinyin: string;
  definition: string;
  toneless: string;
};

type PreHanzi = {
  mode: "hanzi";
  readings: { pinyin: string; definition: string }[];
};

type PreSentence = {
  mode: "sentence";
  pinyin: string;
  definition: string;
  toneless: string;
};

type PreCard = {
  term: string;
};

export type PreCardData = (PrePinyin | PreHanzi | PreSentence) & PreCard;

type PinyinFormData = {
  pinyin: string;
  definition: string;
};

type HanziFormData = {
  hanzi: string;
};

type SentenceFormData = HanziFormData;

export type CardData = PreCard &
  (
    | (PrePinyin & { formData: PinyinFormData })
    | (PreHanzi & { formData: HanziFormData })
    | (PreSentence & { formData: SentenceFormData })
  ) & {
    completed: boolean;
    status: string;
    order: number;
    number?: number;
  };

export type Deck = {
  name: string;
  folder: string;
  desc: string;
  cards: PreCardData[];
};

export type Decks = Record<string, Deck>;

export function prepData(arr: PreCardData[]) {
  const newArr = arr.map((item: PreCardData, i: number) => {
    return {
      ...item,
      formData:
        item.mode == "pinyin" ? { pinyin: "", definition: "" } : { hanzi: "" },
      completed: false,
      status: "default",
      order: i + 1,
    };
  });

  return newArr;
}

export function copyDeck(deck: string[]) {
  return prepData(
    deck
      .map((name) => {
        return decks[name].cards;
      })
      .flat()
  );
}

export function seeDeck(deck: string) {
  return decks[deck];
}

export function applyDeckModes(deck: CardData[], modes: Set<string>) {
  return deck.filter((card) => modes.has(card.mode));
}

export function resetCard(card: CardData) {
  if (card.mode == "hanzi" || card.mode == "sentence") {
    card.formData = { hanzi: "" };
  } else {
    card.formData = { pinyin: "", definition: "" };
  }

  card.completed = false;
  card.status = "default";

  return card;
}

export function shuffle(array: CardData[], top: number): [CardData[], number] {
  let current = top;

  const copy = [...array];

  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));

    if (current == i) {
      current = j;
    } else if (current == j) {
      current = i;
    }

    [copy[i], copy[j]] = [copy[j], copy[i]];
  }

  return [copy, current];
}

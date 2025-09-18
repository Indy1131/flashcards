import { decks } from "./generatedDecks";

export type FolderType = {
  id: string;
  name: string;
  parent: string | null;
};

export type DeckWindow = {
  type: "deck";
  deckIds: string[];
};

export type SelectionWindow = {
  type: "selection";
  parent: string | null;
};

export type WindowTypes = DeckWindow | SelectionWindow;

export type CardModes = "pinyin" | "hanzi" | "definition";

export type CardFormTypes = "pinyin" | "definition" | "hanzi";

export type PrePinyin = {
  type: "pinyin";
  pinyin: string;
  definition: string;
  toneless: string;
};

export type PreHanzi = {
  type: "hanzi";
  readings: { pinyin: string; definition: string[] }[];
};

export type PreSentence = {
  type: "sentence";
  pinyin: string;
  definition: string;
  toneless: string;
};

export type PreCard = {
  term: string;
  id: string;
  favorite: boolean;
};

export type PreCardData =
  | (PrePinyin & PreCard)
  | (PreHanzi & PreCard)
  | (PreSentence & PreCard);

type PinyinFormData = {
  pinyin: string;
  definition: string;
};

type HanziFormData = {
  hanzi: string;
};

type SentenceFormData = HanziFormData;

type CommonCardFields = {
  completed: boolean;
  status: string;
  order: number;
  number?: number;
};

export type CardData =
  | (PrePinyin & { formData: PinyinFormData } & PreCard & CommonCardFields)
  | (PreHanzi & { formData: HanziFormData } & PreCard & CommonCardFields)
  | (PreSentence & { formData: SentenceFormData } & PreCard & CommonCardFields);

export type Deck = {
  id: string;
  name: string;
  parent: string;
  desc: string;
  cards: PreCardData[];
  hanzi: (PreHanzi & PreCard)[];
};

export type Decks = Record<string, Deck>;

export function prepData(arr: PreCardData[]): CardData[] {
  return arr.map((item, i) => {
    if (item.type === "pinyin") {
      return {
        ...item,
        formData: { pinyin: "", definition: "" },
        completed: false,
        status: "default",
        order: i + 1,
      };
    } else if (item.type === "hanzi") {
      return {
        ...item,
        formData: { hanzi: "" },
        completed: false,
        status: "default",
        order: i + 1,
      };
    } else {
      return {
        ...item,
        formData: { hanzi: "" },
        completed: false,
        status: "default",
        order: i + 1,
      };
    }
  });
}

export const DEFAULT_MODES = new Set(["pinyin", "sentence"]);

export function copyDeck(fullDeck: CardData[]) {
  return prepData(fullDeck.map((card) => card));
}

export function unionDecks(deck1: CardData[], deck2: CardData[]): CardData[] {
  return [
    ...new Map([...deck1, ...deck2].map((item) => [item.id, item])).values(),
  ];
}

export function seeDecks(deckNames: string[]) {
  return [...deckNames.map((name) => decks[name])];
}

export function applyDeckModes(
  deck: CardData[],
  modes: Set<string>
): CardData[] {
  return deck.filter((card) => modes.has(card.type));
}

export function resetCard(card: CardData) {
  if (card.type == "hanzi" || card.type == "sentence") {
    card.formData = { hanzi: "" };
  } else {
    card.formData = { pinyin: "", definition: "" };
  }

  card.completed = false;
  card.status = "default";

  return { ...card };
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

import { Fragment } from "react";
import Scrollable from "./atoms/Scrollable";
import Flashlight from "./atoms/Flashlight";
import { icons } from "./icons";

import type { CardData, CardFormTypes, CardModes } from "../decks/utilities";

type Props = {
  data: CardData;
  number: number;
  setCompleted: (number: number, value: boolean) => void;
  setFavorite: (id: string, value: boolean) => void;
  setCardStatus: (number: number, value: string) => void;
  setCardFormData: (number: number, key: CardFormTypes, value: string) => void;
  transition?: string | null;
};

export default function Card({
  data,
  number,
  setCompleted,
  setCardStatus,
  setCardFormData,
  setFavorite,
  transition,
}: Props) {
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setCardFormData(number, e.target.name as CardModes, e.target.value);
  }

  function handleUnFlip() {
    if (transition !== null) return;

    setCompleted(number, false);
    setCardStatus(number, "default");
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
    setCompleted(number, true);

    if (data.type == "pinyin") {
      const extra = data.definition?.indexOf(" (");
      const definition = (
        extra == -1 ? data.definition : data.definition.substring(0, extra)
      )?.toLowerCase();
      if (
        data.formData.pinyin == data.term &&
        data.formData.definition.toLowerCase() == definition
      ) {
        setCardStatus(number, "correct");
      } else {
        setCardStatus(number, "incorrect");
      }
    } else if (
      (data.type == "hanzi" || data.type == "sentence") &&
      data.formData.hanzi == data.term
    ) {
      setCardStatus(number, "correct");
    } else {
      setCardStatus(number, "incorrect");
    }
  }

  function handleGuessClick() {
    if (transition !== null) return;

    setCompleted(number, true);
    setCardStatus(number, "guess");
  }

  function handleFavoriteClick() {
    setFavorite(data.id, !data.favorite);
  }

  const accent =
    data.status == "correct"
      ? "text-green-500"
      : data.status == "incorrect"
      ? "text-red-500"
      : data.status == "guess"
      ? "text-amber-500"
      : "text-blue-500";

  const scrollAccent =
    data.status == "correct"
      ? "scrollbar-thumb-green-500"
      : data.status == "incorrect"
      ? "scrollbar-thumb-red-500"
      : data.status == "guess"
      ? "scrollbar-thumb-amber-500"
      : "scrollbar-thumb-blue-500";

  let back;
  switch (data.type) {
    case "pinyin":
      back = (
        <Scrollable scrollAccent={scrollAccent} className="max-h-[200px]">
          <div
            className={`w-full rounded-md p-3 border-1 ${accent} transition-colors duration-500 font-medium break-words`}
          >
            {data.pinyin}
          </div>
          <p
            className={`text-xs font-medium ${accent} transition-colors duration-500 h-[.5rem] mt-[-.5rem] flex-1`}
          >
            {data.formData.pinyin
              ? "You answered: " + data.formData.pinyin
              : "No answer"}
          </p>
          <div
            className={`w-full rounded-md p-3 border-1 ${accent} transition-colors duration-500 font-medium`}
          >
            {data.definition}
          </div>
          <p
            className={`text-xs font-medium ${accent} transition-colors duration-500 h-[.5rem] mt-[-.5rem] flex-1`}
          >
            {data.formData.definition
              ? "You answered: " + data.formData.definition
              : "No answer"}
          </p>
        </Scrollable>
      );
      break;
    case "hanzi":
      back = (
        <Scrollable scrollAccent={scrollAccent} className="max-h-[200px]">
          {data.readings &&
            data.readings.map((reading, i) => {
              return (
                <Fragment key={i}>
                  <p
                    className={`font-medium ${accent} transition-colors duration-500 h-[.5rem] mb-[0.4rem] flex-1`}
                  >
                    {reading.pinyin}
                  </p>
                  <div
                    className={`w-full rounded-md p-3 border-1 ${accent} transition-colors duration-500 font-medium flex-1`}
                  >
                    {reading.definition.join("; ")}
                  </div>
                  {/* <div className="absolute w-full bottom-0 h-[50px] bg-gradient-to-t from-white to-transparent" /> */}
                </Fragment>
              );
            })}
        </Scrollable>
      );
      break;
    case "sentence":
      back = (
        <Scrollable scrollAccent={scrollAccent} className="max-h-[200px]">
          <div
            className={`w-full rounded-md p-3 border-1 ${accent} transition-colors duration-500 font-medium break-words`}
          >
            {data.pinyin}
          </div>
          <p
            className={`text-xs font-medium ${accent} transition-colors duration-500 h-[.5rem] mt-[-.5rem] flex-1`}
          >
            {data.formData.hanzi
              ? "You answered: " + data.formData.hanzi
              : "No answer"}
          </p>
          <div
            className={`w-full rounded-md p-3 border-1 ${accent} transition-colors duration-500 font-medium`}
          >
            {data.definition}
          </div>
        </Scrollable>
      );
      break;
  }

  return (
    <div
      className={`${transition == "forward" && "shuffle"} ${
        transition == "back" && "shuffle-back"
      } absolute flex-none flex flex-col bottom-0 h-full justify-center items-center w-full select-none rounded-xl perspective-[1000px] z-1`}
    >
      <div className="flex-none flex flex-col bottom-0 h-full justify-center max-h-[600px] items-center w-full select-none rounded-xl perspective-[1000px] z-1">
        <Flashlight
          className={`card w-full h-full border-1 bg-blue-100 border-blue-400 rounded-xl pointer-events-auto ${
            data.completed && "flipped"
          }`}
          lightClassName={"rounded-xl " + (data.completed ? "flipped" : "")}
          style={{
            boxShadow: "0px 10px 10px 1px #3B82F6",
          }}
        >
          <div
            className={`card-front justify-between flex flex-col p-5 pt-10 gap-5 ${
              data.completed && "pointer-events-none"
            }`}
          >
            <Scrollable
              scrollAccent={scrollAccent}
              className={`absolute w-full h-full font-medium text-6xl ${accent} z-4 transition-colors duration-500 items-center`}
            >
              {data.term}
            </Scrollable>

            <form
              className="bottom-5 w-full flex flex-col gap-3"
              onSubmit={handleSubmit}
            >
              {data.type == "pinyin" ? (
                <>
                  <input
                    className="w-full rounded-md p-3 border-1 border-blue-400"
                    placeholder="Hanzi"
                    autoComplete="off"
                    lang="zh-CN"
                    value={data.formData.pinyin}
                    name="pinyin"
                    onChange={handleChange}
                  />
                  <input
                    className="w-full rounded-md p-3 border-1 border-blue-400"
                    placeholder="Definition"
                    autoComplete="off"
                    value={data.formData.definition}
                    name="definition"
                    onChange={handleChange}
                  />
                </>
              ) : (
                <>
                  <input
                    className="w-full rounded-md p-3 border-1 border-blue-400"
                    placeholder="Hanzi"
                    autoComplete="off"
                    lang="zh-CN"
                    value={data.formData.hanzi}
                    name="hanzi"
                    onChange={handleChange}
                  />
                </>
              )}
              <div className="flex gap-2 w-full">
                <button
                  className="flex-1 bg-gradient-to-l from-blue-500 to-blue-400 text-white py-2 rounded-md cursor-pointer"
                  type="submit"
                >
                  Check
                </button>
                <button
                  className="flex-1 border-2 text-blue-500 py-2 rounded-md cursor-pointer"
                  type="button"
                  onClick={handleGuessClick}
                >
                  I don't know
                </button>
              </div>
            </form>
          </div>
          <div className="card-back justify-between flex flex-col p-5 pt-10 gap-5 cursor-pointer">
            <button
              className="h-[2rem] w-[2rem] pointer-events-auto cursor-pointer absolute top-3 left-4 p-1 flex items-center justify-center"
              onClick={handleFavoriteClick}
            >
              <img
                className="h-[1.6rem] w-[1.6rem] transition-[height] active:h-[1.1rem]"
                src={data && data.favorite ? icons.star : icons.starEmpty}
                alt="Logo"
              />
            </button>
            <div onClick={handleUnFlip} className="flex-1 flex flex-col w-full h-full">
              <Scrollable
                scrollAccent={scrollAccent}
                className={`absolute w-full h-full font-medium text-6xl ${accent} z-40 transition-colors duration-500 items-center`}
              >
                {data.term}
              </Scrollable>
              <div className="bottom-5 w-full flex flex-col gap-3">{back}</div>
            </div>
          </div>
        </Flashlight>
        <h1
          className={`pointer-events-none absolute top-3 right-4 font-medium ${accent} transition-colors duration-500`}
        >
          {number + 1}
        </h1>
      </div>
    </div>
  );
}

import { Fragment, useRef } from "react";
import type { CardData } from "../decks/utilities";
import { useDeck } from "../contexts/useDeck";
import Scrollable from "./Scrollable";

type Props = {
  data: CardData;
  number: number;
  setCompleted: (number: number, value: boolean) => void;
  transition?: string | null;
};

export default function Card({
  data,
  number,
  setCompleted,
  transition,
}: Props) {
  const { setCardStatus, setCardFormData } = useDeck();

  const lightRef = useRef<HTMLDivElement>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setCardFormData(
      number,
      e.target.name as "pinyin" | "definition" | "hanzi",
      e.target.value
    );
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

    if (data.mode == "pinyin") {
      const extra = data.definition?.indexOf(" (");
      const definition = (
        extra == -1 ? data.definition : data.definition.substring(0, extra)
      )?.toLowerCase();
      if (
        data.formData.pinyin == data.toneless &&
        data.formData.definition.toLowerCase() == definition
      ) {
        setCardStatus(number, "correct");
      } else {
        setCardStatus(number, "incorrect");
      }
    } else if (data.formData.hanzi == data.term) {
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

  function handleMouseMove(e: React.MouseEvent) {
    const rect = lightRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    lightRef.current?.style.setProperty(
      "background-image",
      `radial-gradient(circle at ${x}px ${y}px, white 0%, transparent 90%)`
    );
    lightRef.current?.style.setProperty("opacity", "1");
  }

  function handleMouseLeave() {
    lightRef.current?.style.setProperty("opacity", "0");
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

  return (
    <div
      className={`${transition == "forward" && "shuffle"} ${
        transition == "back" && "shuffle-back"
      } absolute flex-none flex flex-col bottom-0 max-h-[600px] justify-center items-center w-full h-full select-none rounded-xl perspective-[1000px] z-1`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseMove}
    >
      <div
        className={`card bg-blue-100 w-full h-full border-1 border-blue-400 rounded-xl ${
          data.completed && "flipped"
        }`}
        style={{
          boxShadow: "0px 10px 10px 1px #3B82F6",
        }}
      >
        <div
          className={`absolute w-full h-full transition-opacity rounded-xl ${
            data.completed && "flipped"
          }`}
          ref={lightRef}
        />
        <div className="card-front">
          <form
            className="absolute bottom-5 w-full px-5 flex flex-col gap-3"
            onSubmit={handleSubmit}
          >
            {data.mode == "pinyin" ? (
              <>
                <input
                  className="w-full rounded-md p-3 border-1 border-blue-400"
                  placeholder="Pinyin"
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
        <div className="card-back cursor-pointer" onClick={handleUnFlip}>
          <div className="absolute bottom-5 w-full px-5 flex flex-col gap-3">
            {data.mode == "pinyin" || data.mode == "sentence" ? (
              <Scrollable scrollAccent={scrollAccent}>
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
            ) : (
              <Scrollable scrollAccent={scrollAccent}>
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
                          {reading.definition}
                        </div>
                        {/* <div className="absolute w-full bottom-0 h-[50px] bg-gradient-to-t from-white to-transparent" /> */}
                      </Fragment>
                    );
                  })}
              </Scrollable>
            )}
          </div>
        </div>
      </div>

      <h1
        className={`absolute font-medium text-6xl ${accent} z-4 transition-colors duration-500 pointer-events-none px-6 bottom-[250px]`}
      >
        {data.term}
      </h1>

      <h1
        className={`absolute top-3 right-4 font-medium ${accent} transition-colors duration-500`}
      >
        {number + 1}
      </h1>
    </div>
  );
}

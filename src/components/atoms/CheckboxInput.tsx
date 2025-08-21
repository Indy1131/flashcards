import { useEffect, useState } from "react";

export type CheckboxInputProps = {
  name: string;
  value: string;
  checked?: boolean;
  inputSetFormData?: (value: string, include: boolean) => boolean;
};

export default function CheckboxInput({
  name,
  value,
  checked = false,
  inputSetFormData,
}: CheckboxInputProps) {
  const [selected, setSelected] = useState(checked);

  useEffect(() => {
    if (inputSetFormData) inputSetFormData(value, checked);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleClick() {
    if (inputSetFormData && inputSetFormData(value, !selected))
      setSelected(!selected);
  }

  return (
    <div
      className="flex justify-between items-center cursor-pointer select-none"
      onClick={handleClick}
    >
      <h1>{name}</h1>
      <div className="h-full border-2 border-blue-500 rounded-sm overflow-hidden">
        <div
          className={`${
            selected ? "opacity-100" : "opacity-0"
          } h-[20px] w-[20px] flex justify-center items-center transition-all bg-blue-500 text-white`}
        >
          {selected && <img src="/check.svg" className="select-none" />}
        </div>
      </div>
    </div>
  );
}

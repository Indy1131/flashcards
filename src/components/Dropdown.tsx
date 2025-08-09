import {
  cloneElement,
  isValidElement,
  useState,
  type ReactElement,
  type ReactNode,
} from "react";
import type { CheckboxInputProps } from "./CheckboxInput";
import Scrollable from "./Scrollable";

type Props = {
  children: ReactNode[];
  name: string;
  label: string;
  open: boolean;
  src: string;
  setOpen: (name: string) => void;
  handleFilterClick: (set: Set<string>) => void;
  right?: boolean;
};

export default function Dropdown({
  children,
  name,
  label,
  open,
  src,
  setOpen,
  handleFilterClick,
  right = false,
}: Props) {
  const [formData, setFormData] = useState<Set<string>>(new Set());

  function handleOpenClick() {
    setOpen(name);
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setOpen(name);
    handleFilterClick(formData);
  }

  function inputSetFormData(value: string, include: boolean) {
    if (formData.has(value) && !include) {
      if (formData.size <= 1) {
        return false;
      }
      formData.delete(value);
    } else {
      formData.add(value);
    }

    setFormData(new Set(formData));

    return true;
  }

  //   children.map((child) => {
  //     console.log(child);
  //   });

  return (
    <div className="rounded-md relative">
      <div
        className="z-12 h-[1.3rem] flex items-center"
        onClick={handleOpenClick}
      >
        <img
          className="relative z-20 cursor-pointer h-[1.3rem] w-[1.3rem] transition-[height] active:h-[1rem]"
          src={src}
          alt="Logo"
          onClick={handleOpenClick}
        />
      </div>
      {open && (
        <div
          className="fixed w-screen h-screen top-0 left-0 z-10"
          onClick={handleOpenClick}
        />
      )}
      <form
        className={`${open ? "opacity-100" : "opacity-0 pointer-events-none"} ${
          right && "right-[calc(100%-1.3rem)]"
        } transition-opacity top-[calc(100%+10px)] absolute w-[200px] bg-gradient-to-b from-white to-blue-100 border-blue-500 border-1 rounded-md z-100 flex flex-col p-3 text-blue-500 cursor-auto`}
        style={{ boxShadow: "0px 3px 10px 1px #3B82F6" }}
        onSubmit={handleSubmit}
      >
        {/* <div className="flex justify-between w-full mb-3 items-center">
          <img
            src="/close.svg"
            className="h-full w-[1rem] cursor-pointer"
            onClick={handleOpenClick}
          />
        </div> */}
        <Scrollable
          scrollAccent="scrollbar-thumb-blue-500"
          className="max-h-[400px]"
        >
          {children &&
            children.map((child: ReactNode, i: number) => {
              if (isValidElement<CheckboxInputProps>(child)) {
                return cloneElement(child as ReactElement<CheckboxInputProps>, {
                  inputSetFormData,
                  key: i,
                });
              }
            })}
        </Scrollable>
        <div className="w-full flex  mt-6 gap-1">
          <button className="py-2 text-sm flex-1 text-white bg-gradient-to-l from-blue-500 to-blue-400 rounded-md cursor-pointer">
            {label}
          </button>
          <button
            className="text-sm flex-1 text-blue-500 bg-gradient-to-l border-2 border-blue-500 rounded-md cursor-pointer"
            type="button"
            onClick={handleOpenClick}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

import { useRef, type ReactNode } from "react";

type Props = {
  children?: ReactNode;
  className?: string;
  style?: React.CSSProperties;
  lightClassName?: string;
  percent?: number;
};

export default function Flashlight({
  children,
  className,
  style,
  lightClassName,
  percent = 90,
}: Props) {
  const lightRef = useRef<HTMLDivElement>(null);

  function handleMouseMove(e: React.MouseEvent) {
    const rect = lightRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    lightRef.current?.style.setProperty(
      "background-image",
      `radial-gradient(circle at ${x}px ${y}px, white 0%, transparent ${percent}%)`
    );
    lightRef.current?.style.setProperty("opacity", "1");
  }

  function handleMouseLeave() {
    lightRef.current?.style.setProperty("opacity", "0");
  }

  return (
    <div
      className={className}
      style={style}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseMove}
    >
      <div
        className={`absolute w-full h-full transition-opacity ${lightClassName}`}
        ref={lightRef}
      />
      {children}
    </div>
  );
}

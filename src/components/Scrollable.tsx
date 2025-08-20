import { useEffect, useRef, useState } from "react";

type Props = {
  scrollAccent: string;
  children: React.ReactNode;
  className?: string;
};

export default function Scrollable({
  children,
  scrollAccent,
  className,
}: Props) {
  const [hasScrollbar, setHasScrollbar] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const checkScrollbar = () => {
      const hasVerticalScrollbar = el.scrollHeight > el.clientHeight;
      setHasScrollbar(hasVerticalScrollbar);
    };

    checkScrollbar();

    const resizeObserver = new ResizeObserver(checkScrollbar);
    resizeObserver.observe(el);

    return () => resizeObserver.disconnect();
  }, []);

  return (
    <div
      className={`relative ${className} ${
        hasScrollbar && "pr-4"
      } w-full flex flex-col gap-3 overflow-y-scroll scrollbar ${scrollAccent} always-scrollbar select-auto`}
      ref={containerRef}
    >
      {children}
    </div>
  );
}

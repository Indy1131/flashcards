import { useEffect, useRef, useState } from "react";

type Props = {
  scrollAccent: string;
  children: React.ReactNode;
};

export default function Scrollable({ children, scrollAccent }: Props) {
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
      className={`relative max-h-[200px] ${
        hasScrollbar && "pr-4"
      } w-full flex flex-col gap-3 overflow-y-scroll scrollbar ${scrollAccent} always-scrollbar`}
      ref={containerRef}
    >
      {children}
    </div>
  );
}

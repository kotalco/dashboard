"use client";

import { useEffect } from "react";
import tocbot from "tocbot";

interface TOCProps {
  children: React.ReactNode;
}

export const TOC = ({ children }: TOCProps) => {
  useEffect(() => {
    tocbot.init({
      tocSelector: ".toc",
      contentSelector: "#content",
      headingSelector: "h2",
      positionFixedSelector: ".toc",
      fixedSidebarOffset: 250,
    });

    return () => tocbot.destroy();
  }, []);

  return (
    <div className="relative">
      <nav className="toc right-0 translate-x-0 top-0 h-full w-72 overflow-y-auto z-[1] pt-4 p-8 absolute" />
      <div id="content">{children}</div>
    </div>
  );
};

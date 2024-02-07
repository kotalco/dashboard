"use client";

import { MouseEventHandler, useEffect, useState } from "react";

import { useHeadingsObserver } from "@/hooks/use-headings-observer";
import { useNavObserver } from "@/hooks/use-nav-observer";
import { cn } from "@/lib/utils";

interface TableOfContentProps {
  children: React.ReactNode;
}

interface Heading {
  text: string;
  id: string;
  level: number;
}

export const TableOfContent = ({ children }: TableOfContentProps) => {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const { activeId } = useHeadingsObserver();
  const { isFixed } = useNavObserver();

  useEffect(() => {
    const elements = Array.from(
      document.querySelectorAll<HTMLElement>(
        "#content h2, #content h3, #content h4"
      )
    ).map((elem) => ({
      text: elem.innerText,
      id: elem.id,
      level: Number(elem.nodeName.charAt(1)),
    }));

    setHeadings(elements);
  }, []);

  return (
    <div className="overflow-hidden">
      <div id="content">{children}</div>
      <nav
        id="toc"
        className={cn(
          "w-72 h-full absolute top-80 hidden lg:block lg:w-96 right-0 overflow-y-auto z-[1] pt-4 text-muted-foreground text-lg",
          isFixed && "fixed top-12"
        )}
      >
        <ul className="space-y-3 px-6 overflow-hidden relative">
          {headings.map((heading) => {
            const handleClick: MouseEventHandler<HTMLAnchorElement> = (e) => {
              e.preventDefault();
              document
                .querySelector(`#${heading.id}`)
                ?.scrollIntoView({ behavior: "smooth" });
            };

            return (
              <li
                key={heading.id}
                className={cn(
                  "before:bg-muted before:inline-block before:h-full before:left-0 before:-mt-px before:absolute before:w-0.5",
                  activeId === heading.id &&
                    "text-foreground font-semibold before:bg-primary"
                )}
              >
                <a href={`#${heading.id}`} onClick={handleClick}>
                  {heading.text}
                </a>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
};

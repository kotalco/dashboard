import { useEffect, useRef, useState } from "react";

export const useHeadingsObserver = () => {
  const observer = useRef<IntersectionObserver>();
  const [activeId, setActiveId] = useState<string>();

  useEffect(() => {
    const handleObserver = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveId(entry.target.id);
        }
      });
    };

    observer.current = new IntersectionObserver(handleObserver, {
      rootMargin: "0px 0px -90% 0px",
      threshold: [0],
    });

    const elements = document.querySelectorAll<HTMLElement>(
      "#content h2, #content h3, #content h4"
    );

    elements.forEach((elem) => observer.current?.observe(elem));

    return () => {
      observer.current?.disconnect();
    };
  }, []);

  return { activeId };
};

import { useEffect, useRef, useState } from "react";

export const useNavObserver = () => {
  const observer = useRef<IntersectionObserver>();
  const lastScrollY = useRef(0);
  const [isFixed, setIsFixed] = useState(false);

  useEffect(() => {
    const handleObserver = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setIsFixed(true);
          lastScrollY.current = window.scrollY;
        }
      });
    };

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY < lastScrollY.current) {
        setIsFixed(false);
        lastScrollY.current = 0;
      }
    };

    observer.current = new IntersectionObserver(handleObserver, {
      rootMargin: "0px 0px -90% 0px",
      threshold: [0],
    });

    const elements = document.querySelectorAll<HTMLElement>("#toc");

    elements.forEach((elem) => observer.current?.observe(elem));
    window.addEventListener("scroll", handleScroll);

    return () => {
      observer.current?.disconnect();
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return { isFixed };
};

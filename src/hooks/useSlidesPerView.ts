import { useEffect, useState } from "react";
import { useAppDispatch } from "../store/store";
import { setSlidesPerView } from "../store/itemsSlice";

export const breakpoints = {
  0: { slidesPerView: 2 },
  576: { slidesPerView: 4 },
  768: { slidesPerView: 6 },
  1024: { slidesPerView: 8 },
  1280: { slidesPerView: 10 },
  1536: { slidesPerView: 12 },
};

type Breakpoint = keyof typeof breakpoints;

export const useSlidesPerView = () => {
  const [currentBreakpoint, setCurrentBreakpoint] = useState<Breakpoint>(0);
  const dispatch = useAppDispatch();
  const [slidesPerView, setSlidesPerViewState] = useState<number>(breakpoints[0].slidesPerView);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;

      const breakpoint: Breakpoint =
        width >= 1536
          ? 1536
          : width >= 1280
          ? 1280
          : width >= 1024
          ? 1024
          : width >= 768
          ? 768
          : width >= 576
          ? 576
          : 0;

      setCurrentBreakpoint(breakpoint);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const slides = breakpoints[currentBreakpoint]?.slidesPerView || 2;
    setSlidesPerViewState(slides);
    dispatch(setSlidesPerView(slides));
  }, [currentBreakpoint, dispatch]);

  return slidesPerView;
};

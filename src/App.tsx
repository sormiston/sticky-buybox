import { useState, useRef, useEffect } from "react";
import { isWhatPercentageOf } from "./utils/index";

import "./scss/App.scss";

const headerHeightFromCss = window
  .getComputedStyle(document.documentElement)
  .getPropertyValue("--header-height");

const TOP_OFFSET = parseInt(headerHeightFromCss) + 24; 
const BOTTOM_OFFSET = 50;

function App() {
  // STATE
  const [colBPosition, setColBPosition] = useState<
    "sticky" | "relative" | "static"
  >("static");
  const [colBTop, setColBTop] = useState("0px");
  // Demo UI state
  const [headerHide, setHeaderHide] = useState(true);
  const [hideDemoUI, setHideDemoUI] = useState(false);

  // Implementation values that need only exist in their observer callbacks,
  // here elevated to state for Demo UI purposes
  const [topObserving, setTopObserving] = useState(false);
  const [bottomObserving, setBottomObserving] = useState(false);
  const [topRootIntersecting, setTopRootIntersecting] = useState(false);
  const [bottomRootIntersecting, setBottomRootIntersecting] = useState(false);
  const [isPastFold, setIsPastFold] = useState(false);

  // DOM REFS
  const container = useRef<HTMLDivElement>(null);
  const colB = useRef<HTMLDivElement>(null);

  // OBSERVERS
  const topOffsetPctg = isWhatPercentageOf(TOP_OFFSET - 1, window.innerHeight);
  const upScrollIO = useRef<IntersectionObserver>(
    new IntersectionObserver(stickOrScroll("up"), {
      rootMargin: `0% 0% -${100 - topOffsetPctg}% 0%`, // top 63px
    })
  );

  const bottomOffsetPctg = isWhatPercentageOf(
    BOTTOM_OFFSET - 1,
    window.innerHeight
  );
  const downScrollIO = useRef<IntersectionObserver>(
    new IntersectionObserver(stickOrScroll("down"), {
      rootMargin: `-${100 - bottomOffsetPctg}% 0% 0% 0%`, // bottom 49px of my macbook viewport
    })
  );

  // IO CALLBACK
  function stickOrScroll(scrollDir: "up" | "down") {
    return (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        // console.log("entry from " + scrollDir + " observer:", entry);
        if (!container.current || !colB.current) return;

        const { top: containerTop, bottom: containerBottom } =
          container.current.getBoundingClientRect();
        const isScrolledPastFold = containerBottom < 0;

        if (!entry.isIntersecting && !isScrolledPastFold) {
          // stick
          setColBPosition("sticky");
          if (scrollDir === "up") {
            setColBTop(`${TOP_OFFSET}px`);
            // setColBTop(`${-1 * TOP_OFFSET}px`);
          } else {
            const currBottomOffset =
              window.innerHeight - colB.current.getBoundingClientRect().bottom;
            const adjustment = -1 * (BOTTOM_OFFSET - currBottomOffset);
            setColBTop(
              `${Math.round(entry.boundingClientRect.top + adjustment)}px`
            );
          }
        } else {
          // scroll
          setColBPosition("relative");
          setColBTop(
            `${-1 * Math.round(containerTop - entry.boundingClientRect.top)}px`
          );
        }

        // DEV UI state only
        setIsPastFold(isScrolledPastFold);
        scrollDir === "up"
          ? setTopRootIntersecting(entry.isIntersecting)
          : setBottomRootIntersecting(entry.isIntersecting);
      });
    };
  }

  // SCROLL LISTENER FOR DIRECTION
  const lastScrollTop = useRef(window.scrollY);

  useEffect(() => {
    window.addEventListener("scroll", scrollListenerCallback, {
      passive: true,
    });
    return () => {
      window.removeEventListener("scroll", scrollListenerCallback);
    };
  });

  function scrollListenerCallback() {
    const scrollDir = window.scrollY > lastScrollTop.current ? "down" : "up";
    lastScrollTop.current = window.scrollY;

    // OBSERVE
    if (!colB.current) return;

    if (scrollDir === "down") {
      upScrollIO.current.unobserve(colB.current);
      downScrollIO.current.observe(colB.current);
    } else if (scrollDir === "up") {
      downScrollIO.current.unobserve(colB.current);
      upScrollIO.current.observe(colB.current);
    }

    // DEV UI state only
    if (scrollDir === "down") {
      setTopObserving(false);
      setBottomObserving(true);
    } else {
      setTopObserving(true);
      setBottomObserving(false);
    }
  }

  // DEV UI

  return (
    <>
      <header className={`${headerHide ? "hide" : ""}`}>
        <h1 className="h1">2-Column Synchronized Scroll Container</h1>
      </header>
      <main>
        <div className="container" ref={container}>
          <div className="col colA">
            <h2 className="colA__start">Col A Start</h2>
            <span className="colA__foot">Col A Foot</span>
          </div>

          <div
            className="col colB"
            ref={colB}
            style={{ position: colBPosition, top: colBTop }}
          >
            <h2 className="colB__start">Col B Start</h2>
            <hr />
            <p className="colB__content">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Pariatur
              ducimus eligendi, dicta est esse at accusantium. Blanditiis cum
              similique obcaecati! Architecto, repellat ab quisquam odit ipsam
              voluptatem doloribus animi assumenda?
              <br />
              <br />
              <br />
              Lorem ipsum, dolor sit amet consectetur adipisicing elit. Totam
              fuga excepturi dignissimos, assumenda magnam quae id quisquam
              molestiae, facilis quibusdam quo, molestias accusamus voluptatum
              earum ipsum. Facilis repellendus beatae dolor.
              <br />
              <br />
              <br />
              Consequuntur placeat earum velit consequatur, illo ad nihil
              reprehenderit sunt error. Architecto accusamus repudiandae vero
              veritatis ad doloremque sed, odit ipsam assumenda necessitatibus
              voluptatibus nam non, possimus ipsum, quam consequatur.
              <br />
              <br />
              <br />
              Consequuntur placeat earum velit consequatur, illo ad nihil
              reprehenderit sunt error. Architecto accusamus repudiandae vero
              veritatis ad doloremque sed, odit ipsam assumenda necessitatibus
              voluptatibus nam non, possimus ipsum, quam consequatur.
              <br />
              <br />
              <br />
              <button className="CTA">Call to Action</button>
            </p>
            <hr />
            <span className="colB__foot">Col B Foot</span>
          </div>
        </div>
      </main>
      <section className="otherStuff"></section>
      <div className="devButtonBar">
        <button
          className="devButton"
          onClick={() => setHeaderHide(!headerHide)}
        >
          {headerHide ? "Show" : "Hide"} Header
        </button>
        <button
          className="devButton"
          onClick={() => setHideDemoUI(!hideDemoUI)}
        >
          {hideDemoUI ? "Show" : "Hide"} Demo UI
        </button>
      </div>
      <div
        className={`intersectionRoot intersectionRoot--top ${
          topObserving ? "intersectionRoot--active" : ""
        } ${topRootIntersecting ? "intersectionRoot--intersecting" : ""} ${
          isPastFold ? "intersectionRoot--pastFold" : ""
        }`}
        style={{
          height: `${topOffsetPctg}%`,
          display: hideDemoUI ? "none" : "block",
        }}
      >
        {isPastFold ? (
          <code className="codeReadout codeReadout--isPastFold">
            isPastFold
          </code>
        ) : (
          topObserving && (
            <code className="codeReadout">{`ColB: { position: ${colBPosition}, top: ${colBTop} }`}</code>
          )
        )}
      </div>
      <div
        className={`intersectionRoot intersectionRoot--bottom ${
          bottomObserving ? "intersectionRoot--active" : ""
        } ${bottomRootIntersecting ? "intersectionRoot--intersecting" : ""}`}
        style={{
          height: `${bottomOffsetPctg}%`,
          display: hideDemoUI ? "none" : "block",
        }}
      >
        {bottomObserving && (
          <code className="codeReadout">{`ColB: { position: ${colBPosition}, top: ${colBTop} }`}</code>
        )}
      </div>
    </>
  );
}

export default App;

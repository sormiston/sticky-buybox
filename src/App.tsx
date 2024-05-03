import { useState, useRef, useEffect, useCallback } from "react";
import "./App.scss";

function App() {
  // STATE
  const [showSentinels, setShowSentinels] = useState(false);
  const [colBPosition, setColBPosition] = useState<
    "sticky" | "relative" | "static"
  >("static");
  const [colBTop, setColBTop] = useState("0px");
  const [scrollDirection, setScrollDirection] = useState<"up" | "down">("down");
  const [downScrollIO, setDownScrollIO] =
    useState<IntersectionObserver | null>();
  const [upScrollIO, setUpScrollIO] = useState<IntersectionObserver | null>();

  // REFS
  const container = useRef<HTMLDivElement>(null);
  const colB = useRef<HTMLDivElement>(null);
  const topSentinel = useRef<HTMLDivElement>(null);
  const bottomSentinel = useRef<HTMLDivElement>(null);

  // IO CALLBACK
  const stickOrScroll = useCallback(
    (scrollDir: "up" | "down") => (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        console.log("entry from " + scrollDir + " observer:", entry);
        if (!container.current || !colB.current) return;
        const isScrolledPastFold =
          container.current.getBoundingClientRect().bottom < 0;
        if (!entry.isIntersecting && !isScrolledPastFold) {
          // stick
          setColBPosition("sticky");
          setColBTop(
            scrollDir === "up"
              ? `${Math.min(entry.boundingClientRect.top, 175)}px` // disallow top of buybox to lag more than 175px behind viewport
              : `${entry.boundingClientRect.top}px`
          );
        } else {
          // scroll
          setColBPosition("relative");
          setColBTop(
            `${
              -1 *
              (container.current.getBoundingClientRect().top -
                entry.boundingClientRect.top)
            }px`
          );
        }
      });
    }
  );

  // IO INSTANTIATION
  useEffect(() => {
    if (downScrollIO || upScrollIO) return;
    if (topSentinel.current && bottomSentinel.current) {
      setDownScrollIO(
        new IntersectionObserver(stickOrScroll("down"), {
          root: bottomSentinel.current,
        })
      );
      setUpScrollIO(
        new IntersectionObserver(stickOrScroll("up"), {
          root: topSentinel.current,
        })
      );
    } else {
      console.error("missing refs!!");
    }
  }, [upScrollIO, downScrollIO, stickOrScroll]);

  // SCROLL LISTENER FOR DIRECTION
  let lastScrollTop = window.scrollY;
  window.addEventListener("scroll", () => {
    const scrollDir = window.scrollY > lastScrollTop ? "down" : "up";
    setScrollDirection(scrollDir);
    lastScrollTop = window.scrollY;

    // OBSERVE
    if (!downScrollIO || !upScrollIO || !colB.current) return;

    if (scrollDir === "down") {
      upScrollIO?.unobserve(colB.current);
      downScrollIO.observe(colB.current);
    } else if (scrollDir === "up") {
      downScrollIO.unobserve(colB.current);
      upScrollIO.observe(colB.current);
    }
  });

  return (
    <>
      <header style={{ opacity: showSentinels ? "0.15" : "1" }}>
        <h1 className="h1">2-Column Synchronized Scroll Container</h1>
      </header>
      <main>
        <div className="container" ref={container}>
          <div className="col colA">
            <h2 className="colA__start">Col A Start</h2>
            <span className="colA__foot">Col A Foot</span>
          </div>

          <div className="col colB" ref={colB}>
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
      <button
        className="devButton"
        onClick={() => setShowSentinels((prev) => !prev)}
      >
        Show Sentinels
      </button>
      <div
        className={`sentinel sentinel--top ${
          showSentinels ? "sentinel--show" : ""
        }`}
        ref={topSentinel}
      ></div>
      <div
        className={`sentinel sentinel--bottom ${
          showSentinels ? "sentinel--show" : ""
        }`}
        ref={bottomSentinel}
      ></div>
    </>
  );
}

export default App;

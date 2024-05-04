import { useState, useRef, useEffect } from "react";
import "./App.scss";

function App() {
  // STATE
  const [colBPosition, setColBPosition] = useState<
    "sticky" | "relative" | "static"
  >("static");
  const [colBTop, setColBTop] = useState("0px");

  // DOM REFS
  const container = useRef<HTMLDivElement>(null);
  const colB = useRef<HTMLDivElement>(null);

  const upScrollIO = useRef<IntersectionObserver>(
    new IntersectionObserver(stickOrScroll("up"), {
      rootMargin: "0% 0% -88% 0%", // top 12% of viewport
    })
  );

  const downScrollIO = useRef<IntersectionObserver>(
    new IntersectionObserver(stickOrScroll("down"), {
      rootMargin: "-90% 0% 0% 0%", // bottom 10% of viewport
    })
  );

  // IO CALLBACK
  function stickOrScroll(scrollDir: "up" | "down") {
    return (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        console.log("entry from " + scrollDir + " observer:", entry);
        if (!container.current || !colB.current) return;
        const { top: containerTop, bottom: containerBottom } = container.current.getBoundingClientRect();
        const isScrolledPastFold =
          containerBottom < 0;
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
              (containerTop -
                entry.boundingClientRect.top)
            }px`
          );
        }
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
    // console.log("scrollDir:", scrollDir);
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
  }

  return (
    <>
      <header>
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
    </>
  );
}

export default App;

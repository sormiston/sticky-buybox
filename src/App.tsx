import { useState, useRef, useEffect } from 'react';
import './scss/App.scss';

const headerHeightFromCss = window
  .getComputedStyle(document.documentElement)
  .getPropertyValue('--header-height');

const TOP_OFFSET = parseInt(headerHeightFromCss) + 24;
const BOTTOM_OFFSET = 50;

function App() {
  // CORE BUSINESS STATE
  const [colBPosition, setColBPosition] = useState<'sticky' | 'relative' | 'static'>('relative');
  const [colBTop, setColBTop] = useState<`${number}px`>('0px');

  // DEMO PURPOSE DEV UI STATE
  const [headerHide, setHeaderHide] = useState<boolean>(true);
  const [hideDemoUI, setHideDemoUI] = useState<boolean>(false);
  const [topObserving, setTopObserving] = useState<boolean>(false);
  const [bottomObserving, setBottomObserving] = useState<boolean>(false);
  const [topMarginIntersecting, setTopMarginIntersecting] = useState<boolean>(false);
  const [bottomMarginIntersecting, setBottomMarginIntersecting] = useState<boolean>(false);

  // DOM REFS
  const container = useRef<HTMLDivElement>(null);
  const colB = useRef<HTMLDivElement>(null);

  // CALCULATION REFS
  const ticking = useRef<boolean>(false);
  const lastScrollTop = useRef<number>(window.scrollY);
  const lastScrollDir = useRef<undefined | 'up' | 'down'>(undefined);

  // SET SCROLL LISTENER
  useEffect(() => {
    window.addEventListener('scroll', handleScroll, {
      passive: true,
    });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  });

  // Handle scroll event with requestAnimationFrame
  function handleScroll() {
    if (!ticking.current) {
      requestAnimationFrame(() => {
        scrollListenerCallback();
        ticking.current = false;
      });
      ticking.current = true;
    }
  }

  // DEFINE SCROLL LISTENER CALLBACK
  function scrollListenerCallback() {
    const scrollDir = window.scrollY > lastScrollTop.current ? 'down' : 'up';

    if (!colB.current) return;

    let { top: colBTop, bottom: colBBottom } = colB.current.getBoundingClientRect();
    colBTop = Math.round(colBTop);
    colBBottom = Math.round(colBBottom);

    if (scrollDir !== lastScrollDir.current) {
      // get absolute difference of container top and colBTop
      const topDiff = container.current
        ? Math.abs(container.current.getBoundingClientRect().top - colBTop)
        : 0;
      setColBTop(`${Math.round(topDiff)}px`);
      setColBPosition('relative');
      console.log('scroll direction changed, setting colB position to relative');
    } else if (scrollDir === 'down') {
      if (
        colBBottom < Math.round(window.innerHeight - BOTTOM_OFFSET) &&
        colBPosition !== 'sticky'
      ) {
        console.log('bottom scroll, sticking colB');
        const topStickValue =
          -1 * (colB.current.getBoundingClientRect().height + BOTTOM_OFFSET - window.innerHeight);
        setColBTop(`${Math.round(topStickValue)}px`);
        setColBPosition('sticky');
      }
    } else if (scrollDir === 'up') {
      if (colBTop >= TOP_OFFSET && colBPosition !== 'sticky') {
        const topStickValue = TOP_OFFSET;
        console.log('top scroll, sticking colB');
        setColBTop(`${Math.round(topStickValue)}px`);
        setColBPosition('sticky');
      }
    }

    lastScrollTop.current = window.scrollY;
    lastScrollDir.current = scrollDir;
    // FOR DEV UI ONLY
    setDevUI(scrollDir, colBTop, colBBottom);
  }

  // FOR DEV UI ONLY
  function setDevUI(scrollDir: 'up' | 'down', colBTop: number, colBBottom: number) {
    setTopObserving(scrollDir === 'up');
    setBottomObserving(scrollDir === 'down');
    setTopMarginIntersecting(colBTop >= Math.round(TOP_OFFSET) ? false : true);
    setBottomMarginIntersecting(
      colBBottom <= Math.round(window.innerHeight - BOTTOM_OFFSET) ? false : true
    );
  }

  return (
    <>
      <header className={`${headerHide ? 'hide' : ''}`}>
        <h1 className="h1">2-Column Synchronized Scroll Container</h1>
      </header>
      <main>
        <div className="container" ref={container}>
          <div className="col colA">
            <h2 className="colA__start">Col A Start</h2>
            <span className="colA__foot">Col A Foot</span>
          </div>

          <div className="col colB" ref={colB} style={{ position: colBPosition, top: colBTop }}>
            <h2 className="colB__start">Col B Start</h2>
            <hr />
            <p className="colB__content">
              {Array.from({ length: 4 }, (_, index) => (
                <span key={index}>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Pariatur ducimus
                  eligendi, dicta est esse at accusantium. Blanditiis cum similique obcaecati!
                  Architecto, repellat ab quisquam odit ipsam voluptatem doloribus animi assumenda?
                  <br />
                  <br />
                  <br />
                </span>
              ))}

              <button className="CTA">Call to Action</button>
            </p>
            <hr />
            <span className="colB__foot">Col B Foot</span>
          </div>
        </div>
      </main>
      <section className="otherStuff"></section>
      <div className="devButtonBar">
        <button className="devButton" onClick={() => setHeaderHide(!headerHide)}>
          {headerHide ? 'Show' : 'Hide'} Header
        </button>
        <button className="devButton" onClick={() => setHideDemoUI(!hideDemoUI)}>
          {hideDemoUI ? 'Show' : 'Hide'} Demo UI
        </button>
      </div>
      <div
        className={`intersectionRoot intersectionRoot--top ${
          topObserving ? 'intersectionRoot--active' : ''
        } ${topMarginIntersecting ? 'intersectionRoot--intersecting' : ''} 
        }`}
        style={{
          height: `${TOP_OFFSET}px`,
          display: hideDemoUI ? 'none' : 'block',
        }}
      >
        {topObserving && (
          <code className="codeReadout">{`ColB: { position: ${colBPosition}, top: ${colBTop} }`}</code>
        )}
      </div>
      <div
        className={`intersectionRoot intersectionRoot--bottom ${
          bottomObserving ? 'intersectionRoot--active' : ''
        } ${bottomMarginIntersecting ? 'intersectionRoot--intersecting' : ''}`}
        style={{
          height: `${BOTTOM_OFFSET}px`,
          display: hideDemoUI ? 'none' : 'block',
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

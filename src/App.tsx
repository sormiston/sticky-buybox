import { useState } from "react";
import "./App.scss";

function App() {
  return (
    <>
      <header>
        <h1 className="h1">2 Column Synchronized Scroll Container</h1>
      </header>
      <main>
        <div className="container">
          <div className="sentinel sentinel--top"></div>
          <div className="col colA">
            <h2 className="colA__start">Col A Start</h2>
            <span className="colA__foot">Col A Foot</span>
          </div>
          <div className="col colB">
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
          <div className="sentinel sentinel--bottom"></div>
        </div>
      </main>
      <section className="otherStuff"></section>
    </>
  );
}

export default App;

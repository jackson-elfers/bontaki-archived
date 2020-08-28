import React from "react";
import { Link } from "react-router-dom";
import { routes } from "../../config";

class Main extends React.Component {
  render() {
    return (
      <div>
        <h1>Home</h1>
        <hr />
        <div className="box">
          <h2>Let's talk about our problems together.</h2>
          <p>
            Bontaki is a different kind of social platform where you can talk about your problems, realize you're not
            alone and find resolution.
          </p>
        </div>
        <img src={`${process.env.REACT_APP_API}/images/bonfire.gif`} />
        <div className="box">
          <h2>Let's have a conversation.</h2>
          <p>Take a seat around the bonfire and have a chat with those who understand your situation.</p>
        </div>
        <Link to={`${routes.Register}`}>
          <button>Get Started</button>
        </Link>
        <Link to={`${routes.About}`}>
          <button>About</button>
        </Link>
      </div>
    );
  }
}
export default Main;

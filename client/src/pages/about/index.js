import React from "react";
import { Link } from "react-router-dom";
import { routes } from "../../config";

class Main extends React.Component {
  render() {
    return (
      <div>
        <h1>About</h1>
        <hr />
        <div className="box">
          <p>
            Invisible are the unique problems in our lives that we cannot express even to our best friends. That's why I
            built Bontaki, a "social help" platform that facilitates the resolution of our issues under the cloak of
            anonymity.
          </p>
          <p>
            Hey I'm Jackson, I originate from eastern Washington and enjoy life assisting local community and
            contributing to open source software on github. I want to focus on improving mental health and fighting
            addiction with technology and wouldn't mind joining a small startup someday.
          </p>
        </div>
        <Link to={`${routes.Register}`}>
          <button>Get Started</button>
        </Link>
        <img src={`${process.env.REACT_APP_API}/images/bonfire.gif`} />
      </div>
    );
  }
}
export default Main;

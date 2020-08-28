import React from "react";
import { Issues } from "../../components";
import { api, routes } from "../../config";

class Main extends React.Component {
  render() {
    return (
      <div>
        <h1>Resolved Issues By Date</h1>
        <hr />
        <Issues url={api.issue.resolvedDate} offset={30} />
      </div>
    );
  }
}
export default Main;

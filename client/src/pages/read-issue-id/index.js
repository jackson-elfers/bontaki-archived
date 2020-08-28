import React from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import check from "check-types";
import { api, routes } from "../../config";
import { connect } from "../../redux";

class Main extends React.Component {
  async resolveId() {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API}${api.issue.readSingleId}/${this.props.match.params._id}`
      );
      if (response.data.error) {
        throw new Error(response.data.error.detail);
      } else if (response.data.data.length === 0) {
        throw new Error("issue doesn't exist");
      }
      this.props.history.push(`${routes.ReadIssue}/${response.data.data[0].url_title}`);
    } catch (e) {
      this.props.actions.notice.message(e.message);
      throw e;
    }
  }

  async componentDidMount() {
    try {
      await this.resolveId();
    } catch (e) {
      this.props.actions.notice.message(e.message);
    }
  }

  render() {
    return <div></div>;
  }
}

export default connect(Main);

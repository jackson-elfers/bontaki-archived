import React from "react";
import axios from "axios";
import check from "check-types";
import { LoggedIn } from "../../components";
import { api, routes } from "../../config";
import { connect } from "../../redux";

class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      issue: {}
    };
  }

  async getIssue() {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API}${api.issue.readSingleUrlTitle}/${this.props.match.params.url_title}`
      );
      if (response.data.error) {
        throw new Error(response.data.error.detail);
      } else if (response.data.data.length === 0) {
        throw new Error("issue doesn't exist");
      }
      this.setState({ issue: response.data.data[0] });
    } catch (e) {
      this.props.actions.notice.message(e.message);
      throw e;
    }
  }

  async remove(e) {
    e.preventDefault();
    const form = document.getElementById("formOne");
    try {
      if (form.delete.value !== "delete") {
        throw new Error("please write 'delete'");
      }
      const response = await axios.delete(`${process.env.REACT_APP_API}${api.issue.remove}/${this.state.issue._id}`);
      if (response.data.error) {
        throw new Error(response.data.error.detail);
      }
      this.props.history.push(routes.Dashboard);
    } catch (e) {
      this.props.actions.notice.message(e.message);
    }
  }

  async componentDidMount() {
    try {
      await this.getIssue();
    } catch (e) {}
  }

  render() {
    return (
      <div>
        <h1>Delete</h1>
        <hr />
        <form id="formOne" onSubmit={this.remove.bind(this)}>
          <input type="text" name="delete" placeholder="write 'delete'" />
          <input type="submit" value="delete" />
        </form>
      </div>
    );
  }
}
export default connect(Main);

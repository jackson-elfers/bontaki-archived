import React from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import check from "check-types";
import { Menu, LoggedIn, Issues } from "../../components";
import { api, routes } from "../../config";
import { connect } from "../../redux";

class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      notes: 0
    };
  }

  shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
    return array;
  }

  async findIssue() {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API}${api.issue.findIssue}`);
      if (response.data.error) {
        throw new Error(response.data.error.detail);
      } else if (response.data.data.length === 0) {
        throw new Error("No issues available at this time, please try again later. 👍");
      }
      this.props.history.push(`${routes.ReadIssue}/${this.shuffleArray(response.data.data)[0].url_title}`);
    } catch (e) {
      this.props.actions.notice.message(e.message);
    }
  }

  async readNotes() {
    const response = await axios.get(`${process.env.REACT_APP_API}${api.notify.readNew}/${0}/${1000}`);
    if (response.data.error) {
      throw new Error(response.data.error.detail);
    }
    this.setState({ notes: response.data.data.length });
  }

  menu() {
    return [
      [
        "Create Issue",
        () => {
          this.props.history.push(routes.CreateIssue);
        }
      ],
      [
        "Find Issue",
        async () => {
          await this.findIssue();
        }
      ]
    ];
  }

  async messages() {
    const response = await axios.get(`${process.env.REACT_APP_API}${api.issue.unresolvedOwner}/${0}/${1}`);
    if (response.data.error) {
      throw new Error(response.data.error.detail);
    } else if (response.data.data.length === 0) {
      throw new Error(`Welcome to your dashboard! Are you ready to talk about your problem? Select 'Create Issue'. Otherwise help
              somebody out with 'Find Issue' which will search for issues in the categories you've historically been
              good at resolving. 👍`);
    }
  }

  async componentDidMount() {
    try {
      await this.readNotes();
      await this.messages();
    } catch (e) {
      this.props.actions.notice.message(e.message);
    }
  }

  render() {
    return (
      <div>
        <LoggedIn />
        <h1>Dashboard</h1>
        <hr />
        <Link to={routes.Notifications}>
          <h3 style={{ cursor: "pointer" }}>{`Notifications ${this.state.notes}`}</h3>
        </Link>
        <hr />
        <Menu data={this.menu()} />
        <h3>My Unresolved Issues</h3>
        <Issues url={api.issue.unresolvedOwner} offset={30} />
        <h3>My Resolved Issues</h3>
        <Issues url={api.issue.resolvedOwner} offset={30} />
      </div>
    );
  }
}

export default connect(Main);

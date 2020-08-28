import React from "react";
import { Link } from "react-router-dom";
import { withRouter } from "react-router";
import axios from "axios";
import check from "check-types";
import { LoggedIn } from "../../components";
import { api, routes } from "../../config";
import { connect } from "../../redux";

const Note = withRouter(
  connect(
    class extends React.Component {
      async findIssue() {
        this.props.history.push(this.props.data.link);
      }

      render() {
        return (
          <div onClick={this.findIssue.bind(this)} style={{ cursor: "pointer" }}>
            <p>{this.props.data.body}</p>
          </div>
        );
      }
    }
  )
);

function Notes(props) {
  var temp = [];
  for (var i = 0; i < props.data.length; ++i) {
    temp.push(
      <div className="box" key={`${props.data[i]._id}${props.data[i].body}`}>
        <Note data={props.data[i]} />
      </div>
    );
  }
  return temp;
}

const Notifications = connect(
  class extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        index: 0,
        offset: props.offset,
        data: [],
        loading: true
      };
    }

    async readNotes() {
      const response = await axios.get(
        `${process.env.REACT_APP_API}${this.props.url}/${this.state.index}/${this.state.offset}`
      );
      if (response.data.error) {
        throw new Error(response.data.error.detail);
      }
      var update = JSON.parse(JSON.stringify(this.state.data));
      for (var i = 0; i < response.data.data.length; ++i) {
        update.push(response.data.data[i]);
      }
      this.setState({ data: update, index: ++this.state.index });
    }

    async componentDidMount() {
      try {
        await this.readNotes();
        this.setState({ loading: false });
      } catch (e) {
        this.props.actions.notice.message(e.message);
      }
    }

    render() {
      if (this.state.loading) {
        return <div style={{ display: "none" }}></div>;
      }
      return (
        <div>
          <Notes data={this.state.data} />
          <button onClick={this.readNotes.bind(this)}>load more</button>
        </div>
      );
    }
  }
);

class Main extends React.Component {
  async dismissAll() {
    const response = await axios.put(`${process.env.REACT_APP_API}${api.notify.updateDismissed}`);
    if (response.data.error) {
      throw new Error(response.data.error.detail);
    }
  }

  async componentDidMount() {
    try {
      await this.dismissAll();
    } catch (e) {
      this.props.actions.notice.message(e.message);
    }
  }

  render() {
    return (
      <div>
        <LoggedIn />
        <h1>Notifications</h1>
        <hr />
        <h3>New Notes</h3>
        <hr />
        <Notifications url={api.notify.readNew} offset={30} />
        <h3>Old Notes</h3>
        <hr />
        <Notifications url={api.notify.readOld} offset={30} />
      </div>
    );
  }
}

export default connect(Main);

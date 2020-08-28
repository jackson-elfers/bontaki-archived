import React from "react";
import { withRouter } from "react-router";
import { Link } from "react-router-dom";
import axios from "axios";
import check from "check-types";
import { api, routes } from "../../config";
import errors from "../../errors";
import { connect } from "../../redux";
import io from "socket.io-client";

function TextBody(props) {
  const strings = props.data.split("\n");
  var temp = [];
  for (var i = 0; i < strings.length; ++i) {
    temp.push(<p key={strings[i]}>{strings[i]}</p>);
  }
  return temp;
}

const Comment = connect(
  withRouter(
    class extends React.Component {
      constructor(props) {
        super(props);
        this.state = {
          username: "",
          toggles: [false, false, false, false]
        };
      }

      pauseForUpdates(data) {
        var pause = false;
        for (var i = 0; i < data.toggles.length; ++i) {
          if (data.toggles[i]) {
            pause = true;
          }
        }
        if (pause) {
          this.props.handlers[1](true);
        } else {
          this.props.handlers[1](false);
        }
      }

      toggleSwitch(index) {
        var copy = JSON.parse(JSON.stringify(this.state.toggles));
        const update = copy.map((d, i) => {
          if (index === i && d) {
            return false;
          } else if (index === i) {
            return true;
          }
          return false;
        });
        this.pauseForUpdates({ toggles: update });
        this.setState({ toggles: update });
      }

      async update(e) {
        e.preventDefault();
        const form = document.getElementById(`${this.props.data._id}-formOne`);
        const data = {
          _id: this.props.data._id,
          body: form.body.value
        };
        try {
          errors.comment.update(data);
          const response = await axios.put(`${process.env.REACT_APP_API}${api.comment.update}`, data);
          if (response.data.error) {
            throw new Error(response.data.error.detail);
          }
          await this.props.handlers[0]();
          this.toggleSwitch(0);
        } catch (e) {
          this.props.actions.notice.message(e.message);
        }
      }

      async remove(e) {
        e.preventDefault();
        const form = document.getElementById(`${this.props.data._id}-formTwo`);
        try {
          if (form.deleteme.value !== "delete") {
            throw new Error("Please write 'delete'.");
          }
          const response = await axios.delete(
            `${process.env.REACT_APP_API}${api.comment.remove}/${this.props.data._id}`
          );
          if (response.data.error) {
            throw new Error(response.data.error.detail);
          }
          await this.props.handlers[0]();
        } catch (e) {
          this.props.actions.notice.message(e.message);
        }
      }

      async resolve(e) {
        e.preventDefault();
        const form = document.getElementById(`${this.props.data._id}-formThree`);
        const data = {
          _id: this.props.issue._id,
          user_id: this.props.data.owner_id
        };
        try {
          if (form.resolve.value !== "resolve") {
            throw new Error("Please write 'resolve'.");
          }
          const response = await axios.put(`${process.env.REACT_APP_API}${api.issue.resolved}`, data);
          if (response.data.error) {
            throw new Error(response.data.error.detail);
          }
          this.props.history.push(routes.Dashboard);
        } catch (e) {
          this.props.actions.notice.message(e.message);
        }
      }

      async silence(e) {
        e.preventDefault();
        const form = document.getElementById(`${this.props.data._id}-formFour`);
        const data = {
          parent_id: this.props.issue._id,
          user_id: this.props.data.owner_id
        };
        try {
          if (form.silence.value !== "silence") {
            throw new Error("Please write 'silence'.");
          }
          const response = await axios.post(`${process.env.REACT_APP_API}${api.silence.create}`, data);
          if (response.data.error) {
            throw new Error(response.data.error.detail);
          }
          await this.props.handlers[0]();
        } catch (e) {
          this.props.actions.notice.message(e.message);
        }
      }

      async resolveUsername() {
        const response = await axios.get(
          `${process.env.REACT_APP_API}${api.user.readSingleId}/${this.props.data.owner_id}`
        );
        if (response.data.error) {
          throw new Error(response.data.error.detail);
        } else if (response.data.data.length === 0) {
          return;
        }
        this.setState({ username: response.data.data[0].username });
      }

      isCommentOwner() {
        if (this.props.globals.user !== null && this.props.globals.user._id === this.props.data.owner_id) {
          return true;
        }
        return false;
      }

      isIssueOwner() {
        if (
          this.props.globals.user !== null &&
          this.props.globals.user._id === this.props.issue.owner_id &&
          this.props.globals.user._id !== this.props.data.owner_id
        ) {
          return true;
        }
        return false;
      }

      async componentDidMount() {
        try {
          await this.resolveUsername();
        } catch (e) {
          this.props.actions.notice.message(e.message);
        }
      }

      render() {
        const commentOwner = (
          <div>
            <button
              onClick={function() {
                this.toggleSwitch(0);
              }.bind(this)}
            >
              update
            </button>
            <button
              onClick={function() {
                this.toggleSwitch(1);
              }.bind(this)}
            >
              delete
            </button>
          </div>
        );
        const issueOwner = (
          <div>
            <button
              onClick={function() {
                this.toggleSwitch(2);
              }.bind(this)}
            >
              resolve
            </button>
            <button
              onClick={function() {
                this.toggleSwitch(3);
              }.bind(this)}
            >
              silence
            </button>
          </div>
        );
        const update = (
          <div style={this.state.toggles[0] ? { display: "block" } : { display: "none" }}>
            <form onSubmit={this.update.bind(this)}>
              <textarea name="body" placeholder="What's on your mind?" />
              <input type="submit" value="update" />
            </form>
          </div>
        );
        const remove = (
          <div style={this.state.toggles[1] ? { display: "block" } : { display: "none" }}>
            <form onSubmit={this.remove.bind(this)}>
              <input type="text" name="deleteme" placeholder="write 'delete'" />
              <input type="submit" value="delete" />
            </form>
          </div>
        );
        const resolve = (
          <div style={this.state.toggles[2] ? { display: "block" } : { display: "none" }}>
            <form onSubmit={this.resolve.bind(this)}>
              <input type="text" name="resolve" placeholder="write 'resolve'" />
              <input type="submit" value="resolve" />
            </form>
          </div>
        );
        const silence = (
          <div style={this.state.toggles[3] ? { display: "block" } : { display: "none" }}>
            <form onSubmit={this.silence.bind(this)}>
              <input type="text" name="silence" placeholder="write 'silence'" />
              <input type="submit" value="silence" />
            </form>
          </div>
        );
        return (
          <div className="box">
            <h4>{this.state.username}</h4>
            <p>{this.props.data.body}</p>
            <div>
              {this.isCommentOwner() ? commentOwner : <div style={{ display: "none" }}></div>}
              {this.isIssueOwner() ? issueOwner : <div style={{ display: "none" }}></div>}
            </div>
            {update}
            {remove}
            {resolve}
            {silence}
          </div>
        );
      }
    }
  )
);

function CommentList(props) {
  var temp = [];
  for (var i = 0; i < props.data.length; ++i) {
    temp.push(
      <div key={props.data[i]._id}>
        <Comment handlers={props.handlers} issue={props.issue} data={props.data[i]} />
      </div>
    );
  }
  return temp;
}

function Categories(props) {
  var temp = [];
  for (var i = 0; i < props.data.length; ++i) {
    temp.push(
      <button data-index={i} key={props.data[i]}>
        {props.data[i]}
      </button>
    );
  }
  return temp;
}

class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      issue: {},
      comments: [],
      categories: [],
      loading: true,
      active: false,
      updateLock: false
    };
    this.socket = io();
  }

  updateLock(lock) {
    this.setState({ updateLock: lock ? true : false });
  }

  async getIssue() {
    const response = await axios.get(
      `${process.env.REACT_APP_API}${api.issue.readSingleUrlTitle}/${this.props.match.params.url_title}`
    );
    if (response.data.error) {
      throw new Error(response.data.error.detail);
    } else if (response.data.data.length === 0) {
      throw new Error("Looks like this issue doesn't exist... sorry about that.");
    }
    this.setState({ issue: response.data.data[0] });
  }

  async getComments() {
    const response = await axios.get(`${process.env.REACT_APP_API}${api.comment.read}/${this.state.issue._id}`);
    if (response.data.error) {
      throw new Error(response.data.error.detail);
    }
    this.setState({ comments: response.data.data });
  }

  async report() {
    const data = { parent_id: this.state.issue.owner_id };
    try {
      const response = await axios.post(`${process.env.REACT_APP_API}${api.report.create}`, data);
      if (response.data.error) {
        throw new Error(response.data.error.detail);
      }
      throw new Error(
        `Thanks for letting us know. Bontaki doesn't tolerate abuse and will remove this user if others feel the same way. 👍`
      );
    } catch (e) {
      this.props.actions.notice.message(e.message);
    }
  }

  isOwner() {
    if (this.props.globals.user !== null && this.props.globals.user._id === this.state.issue.owner_id) {
      return true;
    }
    return false;
  }

  async createComment(e) {
    e.preventDefault();
    const form = document.getElementById("formOne");
    const data = { parent_id: this.state.issue._id, body: form.body.value };
    try {
      errors.comment.create(data);
      const response = await axios.post(`${process.env.REACT_APP_API}${api.comment.create}`, data);
      if (response.data.error) {
        throw new Error(response.data.error.detail);
      }
      form.body.value = "";
      this.emitCreateComment();
    } catch (e) {
      this.props.actions.notice.message(e.message);
    }
  }

  async messages() {
    if (this.isOwner() && !this.state.issue.public) {
      throw new Error(`Your issue is currently private. Once you're ready to talk about it with others click update and select public
          from the dropdown. 👍`);
    }
  }

  activeIndicator(data) {
    try {
      if (data.error) {
        throw new Error(data.error);
      }
      if (this.state.active || data.data.owner_id === this.props.globals.user._id) {
        return;
      }
      this.setState({ active: true });
      setTimeout(() => {
        this.setState({ active: false });
      }, 30000);
    } catch (e) {
      this.props.actions.notice.message(e.message);
    }
  }

  emitCreateComment() {
    try {
      this.socket.emit(`${routes.ReadIssue}/message`, { url_title: this.props.match.params.url_title });
    } catch (e) {
      this.props.actions.notice.message(e.message);
    }
  }

  emitActiveIndicator() {
    try {
      this.socket.emit(`${routes.ReadIssue}/typing`, {
        url_title: this.props.match.params.url_title,
        owner_id: this.props.globals.user._id
      });
    } catch (e) {
      this.props.actions.notice.message(e.message);
    }
  }

  message(data) {
    if (!this.state.updateLock) {
      this.getComments(data);
    }
  }

  typing(data) {
    this.activeIndicator(data);
  }

  websockets() {
    this.socket.on(`${routes.ReadIssue}/message/${this.props.match.params.url_title}`, this.message.bind(this));
    this.socket.on(`${routes.ReadIssue}/typing/${this.props.match.params.url_title}`, this.typing.bind(this));
  }

  async componentDidMount() {
    try {
      this.websockets();
      await this.getIssue();
      await this.getComments();
      this.setState({ categories: this.state.issue.categories.split("#"), loading: false });
      await this.messages();
    } catch (e) {
      this.props.actions.notice.message(e.message);
    }
  }

  componentWillUnmount() {
    try {
      this.socket.close();
    } catch (e) {
      this.props.actions.notice.message(e.message);
    }
  }

  render() {
    if (this.state.loading) {
      return <div style={{ display: "none" }}></div>;
    }
    const issuerOptions = (
      <div>
        <Link to={`${routes.UpdateIssue}/${this.props.match.params.url_title}`}>
          <button>update</button>
        </Link>
        <Link to={`${routes.DeleteIssue}/${this.props.match.params.url_title}`}>
          <button>delete</button>
        </Link>
      </div>
    );
    const commentorOptions = (
      <div>
        <button onClick={this.report.bind(this)}>report</button>
      </div>
    );
    const activeIndicator = this.state.active ? <button>🔥active🔥</button> : <button>💤inactive💤</button>;
    return (
      <div>
        {activeIndicator}
        {this.isOwner() ? issuerOptions : commentorOptions}
        <h1>{`Read: ${this.state.issue.resolved ? "Resolved" : "Unresolved"}`}</h1>
        <hr />
        <Categories data={this.state.categories} />
        <div className="box">
          <TextBody data={this.state.issue.body} />
        </div>
        <form id="formOne" onSubmit={this.createComment.bind(this)}>
          <textarea onChange={this.emitActiveIndicator.bind(this)} name="body" placeholder="What's on your mind?" />
          <input type="submit" value="comment" />
        </form>
        <CommentList
          handlers={[this.getComments.bind(this), this.updateLock.bind(this)]}
          issue={this.state.issue}
          data={this.state.comments}
        />
      </div>
    );
  }
}
export default connect(Main);

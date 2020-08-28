import React from "react";
import axios from "axios";
import check from "check-types";
import { LoggedIn } from "../../components";
import { api, routes, categories, settings } from "../../config";
import errors from "../../errors";
import { connect } from "../../redux";

function Selected(props) {
  var temp = [];
  for (var i = 0; i < props.selected.length; ++i) {
    temp.push(<button key={props.categories[props.selected[i]]}>{props.categories[props.selected[i]]}</button>);
  }
  return temp;
}

function Categories(props) {
  var temp = [];
  for (var i = 0; i < props.data.length; ++i) {
    temp.push(
      <button onClick={props.handler} data-index={i} key={props.data[i]}>
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
      selected: []
    };
  }

  async createIssue(e) {
    e.preventDefault();
    const form = document.getElementById("formOne");
    const data = {
      body: form.body.value,
      categories: this.state.selected,
      public: form.public.value === "0" ? false : true
    };
    try {
      errors.issue.create(data);
      const response = await axios.post(`${process.env.REACT_APP_API}${api.issue.create}`, data);
      if (response.data.error) {
        throw new Error(response.data.error.detail);
      }
      this.props.history.push(`${routes.ReadIssue}/${response.data.data.url_title}`);
    } catch (e) {
      this.props.actions.notice.message(e.message);
    }
  }

  selectCategory(e) {
    const index = Number(e.target.getAttribute("data-index"));
    const update = JSON.parse(JSON.stringify(this.state.selected));
    var exists = false;
    this.state.selected.map((d, i) => {
      if (index === this.state.selected[i]) {
        update.splice(i, 1);
        exists = true;
      }
    });
    if (!exists && this.state.selected.length < settings.issue.categories.max) {
      update.push(index);
    }
    this.setState({ selected: update });
  }

  render() {
    return (
      <div>
        <LoggedIn />
        <h1>Create Issue</h1>
        <hr />
        <form id="formOne" onSubmit={this.createIssue.bind(this)}>
          <select name="public">
            <option value="0">Private</option>
            <option value="1">Public</option>
          </select>
          <textarea style={{ height: "300px" }} name="body" placeholder="What's on your mind?" />
          <input type="submit" value="create" />
        </form>
        <Selected categories={categories} selected={this.state.selected} />
        <hr />
        <p>{`Choose up to ${settings.issue.categories.max} categories...`}</p>
        <Categories handler={this.selectCategory.bind(this)} data={categories} />
      </div>
    );
  }
}
export default connect(Main);

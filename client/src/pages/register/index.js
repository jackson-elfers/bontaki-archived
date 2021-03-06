import React from "react";
import axios from "axios";
import check from "check-types";
import { routes, api } from "../../config";
import errors from "../../errors";
import { connect } from "../../redux";
import ReCaptcha from "react-google-recaptcha";

class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      recaptcha_token: null
    };
  }

  async register(e) {
    e.preventDefault();
    const form = document.getElementById("formOne");
    const data = {
      username: form.username.value,
      password: form.password.value,
      recaptcha_token: this.state.recaptcha_token
    };
    try {
      errors.user.register(data);
      if (
        (await axios.get(`${process.env.REACT_APP_API}${api.user.usernameExists}/${data.username}`)).data.data
          .length !== 0
      ) {
        throw new Error(`${data.username} already exists as a username.`);
      }
      check.assert(data.password === form.confirm.value, "Please make sure passwords match.");
      check.assert(this.state.recaptcha_token !== null, "Please check, 'I am not a robot'.");
      // register
      const responseOne = await axios.post(`${process.env.REACT_APP_API}${api.user.register}`, data);
      if (responseOne.data.error) {
        throw new Error(responseOne.data.error.detail);
      }
      // login
      const responseTwo = await axios.post(`${process.env.REACT_APP_API}${api.user.login}`, data);
      if (responseTwo.data.error) {
        throw new Error(responseTwo.data.error.detail);
      }
      await this.props.actions.user.set();
      this.props.history.push(routes.Tutorial);
    } catch (e) {
      this.props.actions.notice.message(e.message);
    }
  }

  reCaptcha(token) {
    this.setState({ recaptcha_token: token });
  }

  async messages() {
    throw new Error(`We're excited you can join our community! After filling out the fields below 
      we can help you get started! 👍`);
  }

  async componentDidMount() {
    try {
      await this.messages();
    } catch (e) {
      this.props.actions.notice.message(e.message);
    }
  }

  render() {
    return (
      <div>
        <h1>Register</h1>
        <hr />
        <form id="formOne" onSubmit={this.register.bind(this)}>
          <input type="text" name="username" placeholder="username" />
          <input type="password" name="password" placeholder="password" />
          <input type="password" name="confirm" placeholder="password confirm" />
          <input type="submit" value="register" />
        </form>
        <ReCaptcha sitekey={process.env.REACT_APP_RECAPTCHA_SITE_KEY} onChange={this.reCaptcha.bind(this)} />
      </div>
    );
  }
}
export default connect(Main);

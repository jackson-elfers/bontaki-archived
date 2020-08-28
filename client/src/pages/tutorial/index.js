import React from "react";
import { Link } from "react-router-dom";
import { routes } from "../../config";
import { Menu } from "../../components";

class Main extends React.Component {
  menu() {
    return [
      ["Create Issue", () => {}],
      ["Find Issue", async () => {}]
    ];
  }

  render() {
    return (
      <div>
        <h1>Welcome!</h1>
        <hr />
        <div className="box">
          <p>
            Bontaki is simple by design. If you have something you wish to talk about you'll create an issue from your
            dashboard.
          </p>

          <Menu data={this.menu()} />

          <p>Select categories that reflect what your issue is about and then press create.</p>
          <div className="box">
            <p>Here's my issue...</p>
          </div>
          <button>Create</button>
          <div>
            <button>Family</button>
            <button>Career</button>
            <button>Friendship</button>
          </div>
          <hr />
          <p>
            Your issue is private by default meaning it's only visible to you. Once you're ready to talk about it you'll
            change the issue to public using the dropdown from the update page.
          </p>

          <select name="public">
            <option value="0">Private</option>
            <option value="1">Public</option>
          </select>

          <p>
            You'll receive notifications when someone comments on your issue. An issuer can silence unhelpful commentors
            removing them from the chat entirely.
          </p>

          <button>Silence</button>

          <p>
            Once a comment satisfies your issue you will resolve it rewarding the commentor points in the categories you
            have chosen.
          </p>

          <button>Resolve</button>

          <p>We hope we can help you figure out whatever you're going through and find resolution!</p>
        </div>
        <Link to={`${routes.Dashboard}`}>
          <button>See Dashboard</button>
        </Link>
      </div>
    );
  }
}
export default Main;

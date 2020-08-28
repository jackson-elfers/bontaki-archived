import React from "react";
import { Menu } from "../../components";
import { routes } from "../../config";
import { connect } from "../../redux";

class Main extends React.Component {
  menu() {
    return [
      [
        "Home",
        () => {
          this.props.history.push(routes.Home);
        }
      ],
      [
        "Dashboard",
        () => {
          this.props.history.push(routes.Dashboard);
        }
      ],
      [
        "Account",
        () => {
          this.props.history.push(routes.Account);
        }
      ],
      [
        "Tutorial",
        () => {
          this.props.history.push(routes.Tutorial);
        }
      ],
      [
        "About",
        () => {
          this.props.history.push(routes.About);
        }
      ],
      [
        "Logout",
        () => {
          this.props.history.push(routes.Logout);
        }
      ]
    ];
  }

  render() {
    return (
      <div>
        <h1>Menu</h1>
        <hr />
        <Menu data={this.menu()} />
      </div>
    );
  }
}

export default connect(Main);

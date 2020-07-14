import React from "react";
import { NavLink } from "react-router-dom";
import css from "./nav.module.css";

const Nav = () => (
  <div className={css.nav}>
    <NavLink className={css.navItem} activeClassName={css.active} exact to="/">
      Home
    </NavLink>
    <NavLink
      className={css.navItem}
      activeClassName={css.active}
      to="/exercise"
    >
      Exercise
    </NavLink>
    <NavLink className={css.navItem} activeClassName={css.active} to="/history">
      History
    </NavLink>
    <NavLink
      className={css.navItem}
      activeClassName={css.active}
      to="/settings"
    >
      Settings
    </NavLink>
  </div>
);

export default Nav;

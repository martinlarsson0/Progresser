import React from "react";
import { NavLink } from "react-router-dom";
import css from "./header.module.css";

const Header = () => (
  <div className={css.header}>
    <h1> </h1>
    <h1>
      <NavLink className={`${css.logo} ${css.navItem}`} exact to="/">
        Progresser
      </NavLink>
    </h1>
    <h3>
      <NavLink className={css.navItem} exact to="/login">
        Log in
      </NavLink>
      <NavLink className={css.navItem} exact to="/register">
        Register
      </NavLink>
    </h3>
  </div>
);

export default Header;

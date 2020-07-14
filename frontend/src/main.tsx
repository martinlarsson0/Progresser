import React, { useState } from "react";
import { Route, BrowserRouter as Router } from "react-router-dom";
import Home from "./routes/home";
import Exercise from "./routes/exercise";
import History from "./routes/history";
import Login from "./routes/login";
import Register from "./routes/register";
import Settings from "./routes/settings";
import Header from "./components/header";
import Nav from "./components/nav";
import "./index.css";

const Main = () => {
  return (
    <div className="main">
      <Router>
        <Header />
        <div className="main-column">
          <Nav />
          <div className="content">
            <Route exact path="/" component={Home} />
            <Route path="/exercise" component={Exercise} />
            <Route path="/history" component={History} />
            <Route path="/login" component={Login} />
            <Route path="/register" component={Register} />
            <Route path="/settings" component={Settings} />
          </div>
        </div>
      </Router>
    </div>
  );
};

export default Main;

import React, { useState } from "react";
import {
  Route,
  BrowserRouter as Router
} from "react-router-dom";
import Home from "./routes/home";
import Stuff from "./routes/stuff";
import Contact from "./routes/contact";
import Header from "./components/header";
import Nav from "./components/nav";
import './index.css';

 
const Main = () => {
    return (
        <div className="main">
            <Header />
            <div className="main-column">
                <Router>
                    <Nav />
                    <div className="content">
                        <Route exact path="/" component={Home}/>
                        <Route path="/stuff" component={Stuff}/>
                        <Route path="/contact" component={Contact}/>
                    </div>
                </Router>
            </div>
        </div>
    )
}
    


export default Main
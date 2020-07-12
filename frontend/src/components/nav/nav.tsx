import React from 'react'
import {
    NavLink,
  } from "react-router-dom";
import './nav.css'

const Nav = () => 
    <div className="nav">
        <NavLink className="navItem" exact to="/">Home</NavLink>
        <NavLink className="navItem" to="/stuff">Stuff</NavLink>
        <NavLink className="navItem" to="/contact">Contact</NavLink>
    </div>

export default Nav
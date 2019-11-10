import React from 'react';
import { Navbar } from 'reactstrap';
import Logo from './Logo'
import { Link } from 'react-router-dom'

const NavBar = (props) => {

  return (
    <div>
      <Navbar color="default" default expand="md">
        <Link to="/"><Logo /></Link>
      </Navbar>
    </div>
  );
}

export default NavBar;
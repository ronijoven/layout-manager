import React, { Component} from "react";
import { NavLink } from "react-router-dom";
import { Nav, Navbar, NavDropdown } from 'react-bootstrap';
import logo from '../logo.svg';

// The Header creates links that can be used to navigate
// between routes.

class Header extends Component {

  render() {
    return (
      <div>
        <Navbar collapseOnSelect expand="md" bg="dark" variant="dark" fixed="top">
          <Navbar.Brand href="/">
            <img src={logo} width="30" height="30" className="d-inline-block align-top" alt="React Bootstrap logo"/>
          </Navbar.Brand> 
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="mr-auto">
              <NavLink to="/">Home</NavLink>
              <NavLink to="/inventory">Inventory</NavLink>
              <NavLink to="/transactions">Transactions</NavLink>
              <NavLink to="/category">Categories</NavLink>
            </Nav>
            <Nav>
              <Nav.Link eventKey={2} href="#">Sales Report</Nav.Link>
              <NavDropdown title="Profile" id="collasible-nav-dropdown">
                <NavDropdown.Item href="#">Edit</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item href="#">Logout</NavDropdown.Item>
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
      </div>
    );
  }
}

export default Header;

import React, { Component} from "react";
import { NavLink } from "react-router-dom";
import { Nav, Navbar, NavDropdown } from 'react-bootstrap';
import logo from './logo.svg';

// The Header creates links that can be used to navigate
// between routes.

class Header extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            module: "",
            showHeader: false
        };
    }
    componentDidMount() {
        this.setState({ module: this.props.module });
        this.setState({ showHeader: this.props.showHeader });
    };
    render() {
        const { showHeader, module } = this.state;
        return (
            <div>
                <Navbar collapseOnSelect expand="md" bg="dark" variant="dark" fixed="top">
                <Navbar.Brand href="/">
                    <img src={logo} width="30" height="30" className="d-inline-block align-top" alt="React Bootstrap logo"/>
                </Navbar.Brand> 
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav">
                    { (showHeader && module !=="dashboard") && (
                    <Nav className="mr-auto">
                        <NavLink exact activeClassName="active" to="/">Home</NavLink>
                        <NavLink exact activeClassName="active" to="/about">About Us</NavLink>
                        <NavLink exact activeClassName="active" to="/contact">Contact Us</NavLink>
                        <NavLink activeClassName="active" to="/login">Login</NavLink>
                    </Nav>
                    )}
                    { (showHeader && module==="dashboard") && (
                    <Nav className="mr-auto">
                        <NavLink activeClassName="active" to="/dashboard">Dashboard</NavLink>
                        <NavLink activeClassName="active" to="/example1">Example 1</NavLink>
                        <NavLink activeClassName="active" to="/example3">Example 3</NavLink>
                        <NavLink activeClassName="active" to="/example4">Example 4</NavLink>
                    </Nav>
                    )}
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

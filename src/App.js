import React, { Component } from 'react';
import { Redirect, BrowserRouter, Switch, Route, NavLink } from 'react-router-dom';
import { Nav, Navbar, NavDropdown } from 'react-bootstrap';
import logo from './logo.svg';
import { removeUserSession } from './Utils/Common';
import 'bootstrap/dist/css/bootstrap.min.css';

import PublicRoute from './Utils/PublicRoute';
import PrivateRoute from './Utils/PrivateRoute';
import Login from './Component/Login';
import Home from './Site/Home';
import About from './Site/About';
import Contact from './Site/Contact';
import Dashboard from './Component/Dashboard';
import Example1 from './Component/Dnd1';
import Example2 from './Component/Dnd2';
import Example3 from './Component/Dnd3';
import Example4 from './Component/Dnd4';

import './App.css';

class App extends Component{
  constructor(props) {
    super(props);
    this.state = { 
      module: "home",
      userlogged : "Guest",
      showHeader: true
    };
    this.handleLogout = this.handleLogout.bind(this);
  }

  callbackFunction = (childData) => { 
    this.setState({
      module: childData.module,
      showHeader: childData.showHeader,
      userlogged: childData.userlogged
    })
  };
  handleLogout = () => {
    removeUserSession();
    this.setState({ module: "home", userlogged: "Guest" });
    return <Redirect to='/login'  />
    //this.props.history.push('/login');
  }
  render(){
    const { showHeader, module, userlogged } = this.state;
    return (
      <div className="App">
        <BrowserRouter>
          <div>
            <Navbar id="navbar" collapseOnSelect expand="md" bg="dark" variant="dark" fixed="top">
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
                        <NavLink activeClassName="active" to="/example2">Example 2</NavLink>
                        <NavLink activeClassName="active" to="/example3">Example 3</NavLink>
                        <NavLink activeClassName="active" to="/example4">Example 4</NavLink>
                    </Nav>
                    )}
                    <Nav>
                    { (showHeader && module==="dashboard") && (
                      <NavDropdown title="Profile" id="collasible-nav-dropdown">
                          <NavDropdown.Item href="#">Edit</NavDropdown.Item>
                          <NavDropdown.Divider />
                          <NavDropdown.Item onClick={this.handleLogout}>Logout</NavDropdown.Item>
                      </NavDropdown>
                    )}
                      <Nav.Link eventKey={2} href="#">Welcome {userlogged}</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
              </Navbar>
            
            </div>
            <div className="content">
              <Switch>
                <Route exact path="/" component={Home} />
                <Route exact path="/about" component={About} />
                <Route exact path="/contact" component={Contact} />
                <PublicRoute path="/login" component={Login} />
                <PrivateRoute path="/dashboard" parentCallback = {this.callbackFunction} component={Dashboard} />
                <PrivateRoute path="/example1" parentCallback = {this.callbackFunction} component={Example1 } />
                <PrivateRoute path="/example2" parentCallback = {this.callbackFunction} component={Example2 } />
                <PrivateRoute path="/example3" parentCallback = {this.callbackFunction} component={Example3 } />
                <PrivateRoute path="/example4" parentCallback = {this.callbackFunction} component={Example4 } />
              </Switch>
            </div> 
        </BrowserRouter>
      </div>
    );
  }
}

export default App;


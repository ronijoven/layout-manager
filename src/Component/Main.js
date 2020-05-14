import React, { Component } from 'react';
import { BrowserRouter, Switch, Route, NavLink } from 'react-router-dom';
import axios from 'axios';

import Login from './Component/Login';
import Dashboard from './Component/Dashboard';
import Home from './Component/Home';
import Example1 from './Component/Dnd1';
import Example3 from './Component/Dnd3';
import Example4 from './Component/Dnd4';

import PrivateRoute from './Utils/PrivateRoute';
import PublicRoute from './Utils/PublicRoute';
import { getToken, removeUserSession, setUserSession } from './Utils/Common';

class Main extends Component {
  constructor(props) {
    super(props);
    this.state =  { 
      showHeader : false,
      authLoading : true,
      setAuthLoading: true
    };
  }

  useEffect = () => {
    const token = getToken();
    if (!token) {
      return;
    }

    axios.get(`http://localhost:8002/verifyToken?token=${token}`).then(response => {
      setUserSession(response.data.token, response.data.user);
      this.setState({setAuthLoading : false });
    }).catch(error => {
      removeUserSession();
      this.setState({setAuthLoading : false });
    });

  };

  render() {

    if (this.authLoading && getToken()) {
      return <div className="content">Checking Authentication...</div>
    }

    return (
      <div className="App">
        <BrowserRouter>
          <div>
            <div className="header" id="top-header" style={{display:( this.showHeader ? 'block':'none')}}>
              <NavLink exact activeClassName="active" to="/">Home</NavLink>
              <NavLink activeClassName="active" to="/login">Login</NavLink>
              <NavLink activeClassName="active" to="/dashboard">Dashboard</NavLink>
              <NavLink activeClassName="active" to="/example1">Example 1</NavLink>
              <NavLink activeClassName="active" to="/example3">Example 3</NavLink>
              <NavLink activeClassName="active" to="/example4">Example 4</NavLink>
            </div>
            <div className="content">
              <Switch>
                <Route exact path="/" component={Home} />
                <PublicRoute path="/login" component={Login} />
                <PrivateRoute path="/dashboard" component={Dashboard } />
                <PrivateRoute path="/example1" component={Example1 } />
                <PrivateRoute path="/example3" component={Example3 } />
                <PrivateRoute path="/example4" component={Example4 } />
              </Switch>
            </div>
          </div>
        </BrowserRouter>
      </div>
    );
  }
}

export default Main;

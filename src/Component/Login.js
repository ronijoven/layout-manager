import React, { Component } from 'react';
import axios from 'axios';
import { Form, Button, Container, Row, Col } from "react-bootstrap";

import { setUserSession } from '../Utils/Common';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      loading: false,
      setLoading: false,
      username : '',
      password : '',
      error: null,
      setError: null,
      validated: false,
      showHeader: true
    };

    this.handleUsername = this.handleUsername.bind(this);
    this.handlePassword = this.handlePassword.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

  }

  handleUsername = e => {
    console.log("name");
    this.setState({ username: e.target.value });
  }
  handlePassword = e => {
    console.log("name");
    this.setState({ password: e.target.value });
  }
  // handle button click of login form
  handleSubmit = e => {
    e.preventDefault();
    // check count validation is 0
    var validate_count = 2;   // form validation of 4 fields (category_id, name, quantity and price)
    var field_arr = ["username","password"];
    field_arr.forEach(function(item,index) {
      var obj = document.getElementById(item);
      if (obj.checkValidity()) {
        --validate_count
      }
    })
    if (validate_count===0) {
      this.setState({ validated: false }, this.handleLogin(e)) ;
    } else {
      this.setState({ validated:true });
    }
  }
  handleLogin = () => {
    this.setState({
      setError: null,
      setLoading: true
    })
    axios.post('http://localhost:8002/users/signin', 
      { username: this.state.username, password: this.state.password })
    .then(response => {
      this.setState({ setLoading: false })
      setUserSession(response.data.token, response.data.user);
      this.props.history.push('/dashboard');
    })
    .catch(error => {
      this.setState({ setLoading: false });
      this.setState({ setError: "Something went wrong. Please try again later."});
    });
  }

  render() {
    const { setError, username, password } = this.state;
    const { trigger } = this.props;

    return (
    <div>
      <Form noValidate validated={this.state.validated}>
        <Form.Group as={Col} md="6" controlId="username">
          <Form.Label>Username</Form.Label>
          <Form.Control type="text" placeholder="Enter Username" required onChange={this.handleUsername}/>
          <Form.Control.Feedback type="invalid">
              Please enter Username.
          </Form.Control.Feedback>
          <Form.Text className="text-muted">
            We'll never share your email with anyone else.
          </Form.Text>
        </Form.Group>

        <Form.Group as={Col} md="6" controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" placeholder="Enter Password" required onChange={this.handlePassword}/>
          <Form.Control.Feedback type="invalid">
              Please enter Password.
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group controlId="formBasicCheckbox">
          <Form.Check type="checkbox" label="Check me out" />
        </Form.Group>
        <Button variant="primary" type="submit"  onClick={this.handleSubmit}>
          Submit
        </Button>
      </Form>
      </div>

    );
  }
}

export default Login;
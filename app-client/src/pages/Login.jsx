import React, { Component } from 'react';
import { login } from './UserFunctions';
import { withRouter } from 'react-router-dom';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      errors: ''
    };
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
    this.setState({ errors: ''}); 
  }

  onSubmit(e) {
    e.preventDefault();

    const user = {
      username: this.state.username,
      password: this.state.password
    };

    login(user).then(res => {
      console.log(res);
      if (res.Exit === "0") {
        this.props.setSignedIn(true);
        this.props.history.push('/home');
      }
      else if(res.Exit === "1") {
        this.setState({
          username: '',
          password: '',
          errors: "Invalid Username/Password Combination"
        }); 
      }
      else if(res.Exit === "3") {
        this.setState({
          username: '',
          password: '',
          errors: "Invalid Form"
        }); 
      }
      else {
        this.setState({
          username: '',
          password: '',
          errors: "Unknown Error -- Please try again later"
        }); 
      }
    });
  }

  render() {
    return (
      <div className="container">
        <div className="row">
          <div className="col-md-6 mt-5 mx-auto">
            <form noValidate onSubmit={this.onSubmit}>
              <h1 className="h3 mb-3 font-weight-normal"> Please Sign in</h1>
              <div className="form-group">
                <label htmlFor="username"> Username </label>
                <input
                  type="text"
                  className="form-control"
                  name="username"
                  placeholder="Enter Username"
                  value={this.state.username}
                  onChange={this.onChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="password"> Password </label>
                <input
                  type="password"
                  className="form-control"
                  name="password"
                  placeholder="Enter password"
                  value={this.state.password}
                  onChange={this.onChange}
                />
              </div>

              {this.state.errors &&
                <div>
                  <div style={{ fontSize: 14, color: 'red', marginBottom: '5%' }}>{this.state.errors}</div>
                </div>
              }
              <button type="submit" className="btn btn-lg btn-primary btn-block">
                Sign in
              </button>
              <a href = '/tiweb/Change_Password'>Forgot Password</a>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(Login);
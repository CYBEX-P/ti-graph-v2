import React, { Component } from 'react';
import { change_password } from './UserFunctions';

class Change_password extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username:'',
      old_password: '',
      new_password: '',
      passwordError: ''
    };
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  validate = () => {
    
    const errors = {
      usernameError: '',
      passwordError: ''
    }

    if (!this.state.username || this.state.username.length < 4) {
      errors.usernameError = 'username must be more than 3 characters';
    }
    if (!this.state.password || this.state.password.length < 4) {
      errors.passwordError = 'password must be more than 3 characters';
    }

    if (errors.usernameError === '' && errors.passwordError === ''){
      return true
    }
    else {
      return false
    }
  };

  onSubmit(e) {
    e.preventDefault();

    const newPassword = {
      username : this.state.username,
      old_password: this.state.old_password,
      new_password: this.state.new_password,
     
    };

    const isValid = this.validate();
    if (isValid) {
      let res = change_password(newPassword);
      console.log(res);
      this.props.history.push('/login');
    }
  }

  render() {
    return (
      
      <div className="container">
        <div className="row">
          <div className="col-md-6 mt-5 mx-auto">
            <form noValidate onSubmit={this.onSubmit}>
              <h1 className="h3 mb-3 font-weight-normal"> Change Password</h1>

              <div className="form-group">
                <label htmlFor="username"> Username </label>
                <input
                  type="username"
                  className="form-control"
                  name="username"
                  placeholder="Enter username"
                  value={this.state.username}
                  onChange={this.onChange}
                />
              </div>
              {this.state.usernameError ? (
                <div style={{ fontSize: 12, color: 'red' }}>{this.state.usernameError}</div>
              ) : null}
              
              
                <div className="form-group">
                <label htmlFor="password"> Old Password </label>
                <input
                  type="password"
                  className="form-control"
                  name="old_password"
                  placeholder="Enter old password"
                  value={this.state.old_password}
                  onChange={this.onChange}
                />
              </div>
              {this.state.passwordError ? (
                <div style={{ fontSize: 12, color: 'red' }}>{this.state.passwordError}</div>
              ) : null}

                <div className="form-group">
                <label htmlFor="password1"> New Password </label>
                <input
                  type="password"
                  className="form-control"
                  name="new_password"
                  placeholder="Enter new password"
                  value={this.state.new_password}
                  onChange={this.onChange}
                />
              </div>
              {this.state.passwordError ? (
                <div style={{ fontSize: 12, color: 'red' }}>{this.state.passwordError}</div>
              ) : null}
              <button type="submit" className="btn btn-lg btn-primary btn-block">
                Submit
              </button>
            </form>
          </div>
        </div>
      </div>
      
    );
  }
}

export default Change_password;
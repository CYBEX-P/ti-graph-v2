import React, { Component } from 'react';
import { register } from './UserFunctions';
import { CircleLoader } from 'react-spinners';
//import Checkbox from './Checkbox';

class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      first_name: '',
      last_name: '',
      email: '',
      username: '',
      password: '',
      admin:false,
      
      first_nameError: '',
      last_nameError: '',
      emailError: '',
      usernameError: '',
      passwordError: '',

      isLoading:false,
      msg:'',
      msf:''
    };
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value});
    this.setState({msg: '', msf: ''});
  }
  handleInputChange(e) {
    this.setState({
      [e.target.name]: e.target.checked
    })
  }

  validate = () => {
    let first_nameError = '';
    let last_nameError = '';
    let emailError = '';
    let usernameError = '';
    let passwordError = '';

    if (!this.state.first_name) {
      first_nameError = 'First name cannot be blank';
    }
    if (!this.state.last_name) {
      last_nameError = 'Last name cannot be blank';
    }
    if (!this.state.username || this.state.username.length < 4) {
      usernameError = 'Username must be more than 3 characters';
    }
    if (!this.state.password || this.state.password.length < 4) {
      passwordError = 'Password must be more than 3 characters';
    }

    if (!this.state.email.includes('@')) {
      emailError = 'Invalid Email id';
    }
    if (emailError || first_nameError || last_nameError || usernameError || passwordError) {
      this.setState({ emailError, first_nameError, last_nameError, usernameError, passwordError });
      return false;
    }
    return true;
  };

  onSubmit(e) {
    e.preventDefault();

    const newUser = {
      first_name: this.state.first_name,
      last_name: this.state.last_name,
      email: this.state.email,
      username: this.state.username,
      password: this.state.password,
      admin:this.state.admin,
      user:this.state.user
      //selectedValue: this.state.selectedValue
    };

    const isValid = this.validate();
    
    if (isValid) {
      this.setState({isLoading: true});

      register(newUser).then((res) => {
        if (res.Exit === "0") {
          this.setState({isLoading: false});
          const msg1 = "Successful Registration -- Redirecting to Login";
          this.setState({msg : msg1});
          setTimeout(() => this.props.history.push('/login'), 3000);
        }
        else if(res.Exit === "1") {
          this.setState({isLoading: false});
          const msg1 = "DB Creation Error";
          this.setState({msf : msg1});
        }
        else if(res.Exit === "2") {
          this.setState({isLoading: false});
          const msg1 = "Invalid Form";
          this.setState({msf : msg1});
        }
      })
    }
  }

  render() {
    return (
      <div className="container">
        <div className="row">
          <div className="col-md-6 mt-5 mx-auto">
            <form noValidate onSubmit={this.onSubmit}>
              <h1 className="h3 mb-3 font-weight-normal"> Register</h1>

              <div className="form-group">
                <label htmlFor="first_name"> First Name </label>
                <input
                  type="text"
                  className="form-control"
                  name="first_name"
                  placeholder="Enter First Name"
                  value={this.state.first_name}
                  onChange={this.onChange}
                />
              </div>
              {this.state.first_nameError ? (
                <div style={{ fontSize: 12, color: 'red' }}>{this.state.first_nameError}</div>
              ) : null}

              <div className="form-group">
                <label htmlFor="last_name"> Last Name </label>
                <input
                  type="text"
                  className="form-control"
                  name="last_name"
                  placeholder="Enter Last Name"
                  value={this.state.last_name}
                  onChange={this.onChange}
                />
              </div>

              {this.state.last_nameError ? (
                <div style={{ fontSize: 12, color: 'red' }}>{this.state.last_nameError}</div>
              ) : null}

              {this.state.isLoading &&
                <div
                style={{
                  gridRow: '2',
                  gridColumn: 1,
                  backgroundColor: '#e0e0e0dd',
                  zIndex: 10,
                  display: 'grid'
                }}
              >
                <div style={{ justifySelf: 'center', alignSelf: 'end', fontSize: '24px', width: '80px' }}>Loading</div>
                <div
                  style={{
                    alignSelf: 'start',
                    justifySelf: 'center'
                  }}
                >
                  <CircleLoader color="#00cbcc" />
                </div>
              </div>
              }

              <div className="form-group">
                <label htmlFor="email"> Email Address </label>
                <input
                  type="email"
                  className="form-control"
                  name="email"
                  placeholder="Enter email"
                  value={this.state.email}
                  onChange={this.onChange}
                />
              </div>
              {this.state.emailError ? <div style={{ fontSize: 12, color: 'red' }}>{this.state.emailError}</div> : null}

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
              {this.state.passwordError ? (
                <div style={{ fontSize: 12, color: 'red' }}>{this.state.passwordError}</div>
              ) : null}
              <label> isAdmin: </label>
              <input type="checkbox" name ="admin" checked={this.state.admin} onChange ={this.handleInputChange}/><br></br>


              {!this.state.msg &&
              <button type="submit" className="btn btn-lg btn-primary btn-block">
                Register
              </button>
              }

              {this.state.msg && <div style={{ fontSize: 18, color: 'green' }}>{this.state.msg}</div>}
              {this.state.msf && <div style={{ fontSize: 18, color: 'red' }}>{this.state.msf}</div>}
              
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default Register;

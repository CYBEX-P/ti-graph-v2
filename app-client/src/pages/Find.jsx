import React, { Component } from 'react';
import { find } from './UserFunctions';



class Find extends Component {
  constructor() {
    super();
    this.state = {
      username: '',
      first_name:'',
      last_name:'',
      email:''
      
    };
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  onSubmit(e) {
    e.preventDefault();

    const user = {
      username: this.state.username,
      first_name:this.state.first_name,
      last_name:this.state.last_name,
      email:this.state.email
      
    };

    find(user).then(res => {
      console.log('found');
      this.setState({
        first_name:res.result['found_f'],
        last_name:res.result['found_l'],
        email:res.result['email']
        
      })
      
     
    });
  }

  render() {
    return (
      <div className="container">
        <div className="row">
          <div className="col-md-6 mt-5 mx-auto">
            <form noValidate onSubmit={this.onSubmit}>
              <h1 className="h3 mb-3 font-weight-normal"> Find User</h1>

              <div className="form-group">
                <label htmlFor="first_name"> First Name </label>
                <input
                  type="text"
                  className="form-control"
                  name="username"
                  placeholder="Enter Username"
                  value={this.state.username}
                  onChange={this.onChange}
                />
              </div>

              <button type="submit" className="btn btn-lg btn-primary btn-block">
                Find
              </button>
              
            </form>
            <div className="container">
        <div className="jumbotron mt-5">
        <h1><center>Details</center></h1>
          <div className="col-sm-8 mt-5">
            {/* <h1 className="text-center" /> */}
            
          </div>
          
          <table className="table col-md-6 mx-auto">
            <tbody>
              <tr>
                <td>Username</td>
                <td>{this.state.username}</td>
              </tr>
              <tr>
                <td>First Name</td>
                <td>{this.state.first_name}</td>
              </tr>
              <tr>
                <td>Last Name</td>
                <td>{this.state.last_name}</td>
              </tr>
              <tr>
                <td>Email</td>
                <td>{this.state.email}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
          </div>
        </div>
      </div>
      
    );
  }
}

export default Find;

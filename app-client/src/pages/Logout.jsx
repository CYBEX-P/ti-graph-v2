import React, { Component } from 'react';
import { logout } from './UserFunctions';

class Logout extends Component {
    constructor() {
        super();
        this.state = {
            isSignedIn: false
        };
        this.onSubmit = this.onSubmit.bind(this);
    }

    onSubmit(e) {
        e.preventDefault();
        
        const user = {
            _isSignedIn: this.state.isSignedIn
        };
    }

    render() {
        return (
            <button onSubmit={!_isSignedIn}>Logout</button>
        )
    }
}

export default Logout;
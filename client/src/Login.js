/**
 * login.js
 * React file to handle login
 */

import React from 'react';
import GoogleLogin from 'react-google-login';
//import './Login.css';

class Login extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: ''
        }
    }

    render() {
        return (
            <div className='Login'>
                <header className='header'>
                <h1>Log In</h1>
                </header>
                <GoogleLogin
                    buttonText="Log in with Google"
                />
                <form name='emailPassword' onsubmit='validateEP' method='post'>
                    <label>Log in with an email</label><br />
                    <input 
                        type='email' 
                        name='email' 
                        placeholder='Email address' 
                        required='required'
                        onChange={(newValue) => this.setState({email: newValue})}
                    /><br />
                    <input 
                        type='password' 
                        name='pw' 
                        placeholder='Password' 
                        required='required'
                        onChange={(newValue) => this.setState({password: newValue})}
                    /><br />

                    <input type='submit' value='Log In' />
                </form>
            </div>
            
        );
    }
}

export default Login;
/**
 * Login.js
 * React file to handle login
 */

import React from 'react';
import {Form, Button} from 'react-bootstrap';
import GoogleLogin from 'react-google-login';

import AuthNavbar from './AuthNavbar.js';
import Footer from './Footer.js';

import 'bootstrap/dist/css/bootstrap.min.css';
import './LoginSignUp.css';
import './outline.css';

class Login extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: ''
        };

        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        // set page title
        document.title = 'Login | App';
    }

    handleSubmit(event) {
        event.preventDefault();

        alert(`Email: ${this.state.email}\nPassword: ${this.state.password}`);
    }

    render() {
        return (   

            <div className='LoginPage'>
                <AuthNavbar type={'LOGIN'}/>

                <div className='Login'>
                    <h1>Welcome Back</h1>

                    <GoogleLogin
                        buttonText="Log in with Google"
                    />
                    <h3>Log in with an email</h3>

                    <Form onSubmit={this.handleSubmit}>
                        <Form.Group controlid='getEmail'>
                            <Form.Control 
                                type='email' 
                                placeholder='Email address' 
                                required='required'
                                value={this.state.email}
                                onChange={(event) => this.setState({email: event.target.value})}/>
                        </Form.Group>
                        <Form.Group controlid='getPassword'>
                            <Form.Control 
                                type='password' 
                                placeholder='Password' 
                                required='required' 
                                value={this.state.password}
                                onChange={(event) => this.setState({password: event.target.value})}/>
                        </Form.Group>
                        <Button variant='primary' type='submit'>Log In</Button>
                    </Form>
                </div>

                <Footer />
            </div>
            
        );
    }
}

export default Login;
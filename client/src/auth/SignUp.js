/**
 * SignUp.js
 * 
 * Handles sign-up
 */

import React from 'react';
import {Form, Button, Col} from 'react-bootstrap';
import GoogleLogin from 'react-google-login';

import AuthNavbar from './AuthNavbar.js';
import Footer from '../Footer.js';

import 'bootstrap/dist/css/bootstrap.min.css';
import './LoginSignUp.css';
import './outline.css'

class SignUp extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            email: '',
            firstName: '',
            lastName: '',
            password1: '',
            password2: ''
        };

        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        // set page title
        document.title = 'Sign Up | App';
    }

    verifyPassword() {
        let msg = '';
        if(this.state.password1 !== this.state.password2) {
            msg += 'Passwords must match.\n';
        }
        if(this.state.password1 === this.state.password2 
            & (this.state.password1.length < 8 | this.state.password1.length > 20)) {
            msg += 'Your password must be 8-20 characters long.\n';
        }
        if(msg !== '') {
            alert(msg);
            return false;
        }
        else {
            return true;
        }
    }

    handleSubmit(event) {
        event.preventDefault();
        this.verifyPassword();

        alert(`Email: ${this.state.email}\nFirst name: ${this.state.firstName}\nLast name: ${this.state.lastName}\nPassword: ${this.state.password1}`);
    }

    render() {
        return (
            <div className='signUpPage'>
                <AuthNavbar type={'SIGNUP'}/>

                <div className='SignUp'>
                    <h1>Create an Account</h1>

                    <GoogleLogin
                        buttonText="Sign Up with Google"
                    />

                    <h3>Register with an email</h3>

                    <Form onSubmit={this.handleSubmit}>
                        <Form.Group controlid='getEmail'>
                            <Form.Control 
                                type='email' 
                                placeholder='Email address' 
                                required='required'
                                value={this.state.email}
                                onChange={(event) => this.setState({email: event.target.value})}/>
                        </Form.Group>
                        <Form.Row>
                            <Form.Group controlid='getFirstName' as={Col}>
                                <Form.Control
                                    type='text' 
                                    placeholder='First name'
                                    required='required'
                                    value={this.state.firstName}
                                    onChange={(event) => this.setState({firstName: event.target.value})}/>
                            </Form.Group>
                            <Form.Group controlid='getLastName' as={Col}>
                                <Form.Control
                                    type='text'
                                    placeholder='Last name'
                                    required='required'
                                    value={this.state.lastName}
                                    onChange={(event) => this.setState({lastName: event.target.value})}/>
                            </Form.Group>
                        </Form.Row>
                        <Form.Group controlid='getPassword1'>
                            <Form.Control
                                type='password'
                                placeholder='Password'
                                required='required'
                                value={this.state.password1}
                                onChange={(event) => this.setState({password1: event.target.value})}/>
                        </Form.Group>
                        <Form.Group>
                            <Form.Control controlid='getPassword2'
                                type='password'
                                placeholder='Verify password'
                                required='required'
                                value={this.state.password2}
                                onChange={(event) => this.setState({password2: event.target.value})}/>
                            <Form.Text muted>
                                Your password must be 8-20 characters long and only contain letters, numbers, and special characters.
                            </Form.Text>
                        </Form.Group>
                        <Button variant='primary' type='submit'>Sign Up</Button>
                    </Form>
                </div>

                <Footer />
            </div>
        );
        
    }

}

export default SignUp;